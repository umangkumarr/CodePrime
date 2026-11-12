---
title: "Design a Rate Limiter"
description: "Design a distributed rate limiter: token bucket, leaky bucket and window algorithms, atomic Redis checks, local vs global limits, HTTP 429 and failing open."
difficulty: "Medium"
sidebar:
  label: "Rate limiter"
tags: ["Rate limiting", "Algorithms", "Redis", "Concurrency", "API design"]
---

A rate limiter answers one question, millions of times a second: **"Is this caller allowed to make this request
right now?"** If the caller has stayed within its allowance, the request goes through. If not, it is turned away
with a polite "slow down", before it costs us anything.

It is a small component with a big job. It is the **bouncer** at the door of every API, the **turnstile** that
stops one greedy customer from emptying the shelves, and the **fuse** that protects a fragile database from a
flood. Because it sits in front of every request, it must also be fast, cheap and hard to break.

This case study builds a rate limiter from first principles: why we need one, where it runs, the five classic
algorithms with worked examples, and then the hard part, making it work across hundreds of servers and several
regions without slowing anything down.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Rate limiting in 5 minutes

### Why limit at all?

| Reason | What goes wrong without it | Example |
| --- | --- | --- |
| **Abuse and security** | Attackers guess passwords, scrape data, or spam sign-ups at machine speed | 10,000 login attempts a minute against one account |
| **Fairness** | One heavy customer uses all the capacity and everyone else gets slow responses | A partner's buggy script calls `/search` in a tight loop |
| **Cost** | Every request costs CPU, bandwidth, or money paid to someone else | Each SMS one-time password (OTP) costs us a few cents |
| **Protecting downstreams** | A slow database or a third-party API with its own quota collapses under a burst | A payment provider allows us 100 calls a second |

A rate limiter is not the only defence. **Load shedding** drops work when *the server* is overloaded, whoever
sent it. A rate limiter drops work when *one caller* exceeds *its* allowance, even if the server is idle. Real
systems use both.

### The vocabulary

| Term | What it means | Everyday analogy |
| --- | --- | --- |
| **Limit** | How many requests are allowed, for example 100 | Tickets per person |
| **Window** | The time span the limit covers: per second, minute, hour, day | "Per visit" |
| **Key** | Who or what is being counted: an API key, a user, an IP address, or a combination with the route | The name on the ticket |
| **Rule** | A key, a limit, a window and an algorithm, for example "100 per minute per API key on `/search`" | The venue's ticket policy |
| **Burst** | Many requests arriving close together | A coach party arriving at once |
| **Throttle** | Slow a caller down (reject or delay) once it is over its limit | The bouncer saying "wait outside" |
| **HTTP 429** | The status code for *Too Many Requests* | "Come back later" |
| **`Retry-After`** | A response header telling the client how long to wait | "Try again in 20 minutes" |

## 2. Requirements

### Functional (what the limiter must do)

- Decide **allow or reject** for each request, based on configurable **rules**.
- Identify callers by **API key, user ID, IP address**, or a combination with the route or tenant.
- Support **several rules per request** (per user *and* per endpoint *and* a global safety cap).
- Support different algorithms and **request costs** (an export may cost 10 units, a read 1).
- Tell clients where they stand: **429**, `Retry-After`, and remaining-quota headers.
- Change rules **without a deploy**, and try new rules in a log-only **shadow mode** first.
- Record decisions for dashboards and alerts.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Latency** | Adds under 1 ms at the median, a few ms at p99 (the slowest 1%) | It runs on every request; it must be invisible |
| **Throughput** | Millions of checks per second | It sees all traffic, including attack traffic |
| **Accuracy** | Close to the limit; a small, bounded overshoot is acceptable | Exact global counting costs latency |
| **Availability** | The limiter failing must not take the API down | It is a guard, not the product |
| **Consistency across servers** | A caller cannot multiply its limit by spreading requests over many servers | Otherwise the limit means nothing |

### Out of scope

Full DDoS protection at the network layer, billing for usage, and bot detection with machine learning. They
are neighbours of rate limiting; mention them in an interview, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resource dominates**.

**Assumptions:** a public API platform with **1 million requests per second** at peak. On average each request
is checked against **2 rules** (per-key and per-endpoint). In any hour about **10 million distinct keys** are
active (API keys, users and IP addresses).

**Checks per second**

- $1\text{M} \times 2 = 2\text{M}$ limiter checks per second.
- A single Redis shard handles on the order of 100,000 simple commands per second; a small script costs more.
  Planning on a conservative **50,000 checks per shard** gives $2\text{M} / 50\text{K} = 40$ shards, plus a
  replica each. The work splits cleanly because each key lives on exactly one shard.

**Memory**

- A token bucket stores two numbers per key (tokens left, last refill time). With the key name and Redis
  overhead, call it **about 150 bytes**: $10\text{M} \times 150\text{ B} = 1.5\text{ GB}$. That fits in memory
  with room to spare.
- A sliding window *log* (section 6) stores one timestamp per request. With a limit of 100 per minute and
  roughly 80 bytes per sorted-set entry: $10\text{M} \times 100 \times 80\text{ B} = 80\text{ GB}$, about
  **50 times more**.

**Latency**

- A Redis round trip inside one data centre is typically 0.2–1 ms. So **one** round trip per request is
  affordable; three sequential round trips start to hurt. Section 8 squeezes every check into one call.

Three conclusions follow:

1. **The algorithm decides the memory bill.** Counter-based algorithms are tiny; logs are not.
2. **Network round trips, not CPU, decide latency.** Batch every rule for a request into one call.
3. **Shard by key.** Keys are independent, so the store scales out horizontally, except for a few hot keys
   (section 12).

## 4. Where the limiter runs

A limiter can live at several points on a request's path. Each sees different information and protects
different things.

[![Where a rate limiter can run: the client app backs off politely but is not trusted, the edge or CDN limits per IP against floods, the API gateway limits per API key and user and is the main place, a sidecar proxy in the service pod limits per calling service, the service code applies business rules such as 3 OTPs per hour, and the service limits its own outbound calls to a third-party API](/img/system-design/rate-limiter/01-placement.png)](/img/system-design/rate-limiter/01-placement.png)

*Select the diagram to zoom in and move around.*

| Where | Good at | Weakness |
| --- | --- | --- |
| **Client** (SDK, app) | Saving wasted calls: backing off after a 429, spreading retries | Can be modified or bypassed, so never the real defence |
| **Edge / CDN** | Cheap per-IP limits that absorb floods before they reach us | Knows little about who the user is |
| **API gateway** (or a middleware in every server) | One place for all public rules: per API key, per user, per route | Every request pays the check; it must be fast |
| **Sidecar** (a proxy next to each service, as in a service mesh) | Limits between internal services ("checkout may call inventory 5,000 times a second") | Needs the same shared state to be accurate |
| **Inside the service** | Business rules that need domain knowledge: "3 OTPs per phone number per hour" | Each team re-implements it unless there is a shared library |

For an interview, the usual answer is: **a rate-limiting middleware in the API gateway, backed by a shared fast
store**, plus cheap IP limits at the edge and business limits in the few services that need them. It also
applies **outbound**: when *we* call a third party with a quota, our own limiter keeps us under it.

## 5. Identifying the caller, and the rules

### Choosing the key

| Key | When to use it | Watch out for |
| --- | --- | --- |
| **API key** | Business APIs: each customer has a key and a plan | A leaked key is shared by attackers too |
| **User ID** | After login: limits follow the person across devices | Unavailable before authentication |
| **IP address** | Before login: sign-up, login, password reset | Many users can share one IP (offices, mobile carriers using carrier-grade NAT), and IPv6 users can rotate addresses, so limit IPv6 by prefix (for example `/64`) |
| **Tenant / organisation** | Multi-tenant SaaS: cap a whole company | One noisy team blocks colleagues |
| **Combination** | `api_key + route`, `ip + route` | More keys, more memory |

Order matters. **IP limits run first**, before authentication, because authentication itself costs CPU and is
a target. Key and user limits run once we know who is calling.

### Rules as configuration

Rules live in a **versioned rules store**, are edited by people (or by the billing system when a customer
upgrades), and are **pushed to every gateway**, which keeps them in memory. A rule lookup is then a hash-map
read, not a network call.

```yaml
- name: login-per-ip
  match: { route: "POST /v1/login" }
  key: ip
  algorithm: sliding_window_counter
  limit: 5
  window: 1m
  on_store_failure: closed        # see section 11

- name: free-plan
  match: { plan: free }
  key: api_key
  algorithm: token_bucket
  capacity: 20                    # largest burst
  refill_per_second: 2            # long-run average rate
  on_store_failure: open

- name: search-global-cap
  match: { route: "GET /v1/search" }
  key: global                     # one counter for everyone
  algorithm: token_bucket
  capacity: 50000
  refill_per_second: 20000
  mode: shadow                    # log what would be rejected, reject nothing
```

A request must pass **every** matching rule. **Shadow mode** is the safe way to introduce a rule: it logs what it
*would* reject, so you can see whether it would block real customers before it does.

## 6. The algorithms

This is the heart of the interview. Five algorithms come up again and again. Each answers "how many requests has
this key made recently?" in a different way, with different costs and different behaviour at the edges.

### 6.1 Fixed window counter

**Idea:** cut time into fixed windows (12:00–12:01, 12:01–12:02, …) and keep one counter per key per window.
Each request increments the counter; if it goes over the limit, reject. A new window starts a new counter.

```text
key = "user:42:" + current_minute          # e.g. user:42:12:01
count = INCR key                           # set it to expire after 60 s
allow if count <= 10
```

**The boundary burst.** With a limit of 10 per minute, a caller can send 10 requests at 12:00:59 (allowed: the
12:00 window holds 10) and 10 more at 12:01:00 (allowed: a fresh window). That is **20 requests in about one
second**, twice the limit, and it can repeat every minute.

| Time | Window | Counter after | Result |
| --- | --- | --- | --- |
| 12:00:59 × 10 | 12:00 | 10 | all allowed |
| 12:01:00 × 10 | 12:01 | 10 | all allowed |
| 12:01:01 × 1 | 12:01 | 11 | rejected |

- **Pros:** tiny (one integer per key), one atomic `INCR`, easy to explain to customers ("resets on the minute").
- **Cons:** up to 2× the limit around a boundary; everyone's counter resets at once, which can create a
  synchronised rush at the top of each window.

### 6.2 Sliding window log

**Idea:** remember the **timestamp of every accepted request**. To check, drop timestamps older than one window
and count the rest.

```text
ZREMRANGEBYSCORE key 0 (now - 60s)    # forget requests older than a minute
if ZCARD key < 10:                    # how many remain?
    ZADD key now request_id           # record this one
    allow
else reject
```

In Redis a **sorted set** (a set ordered by a score, here the timestamp) does this neatly.

- **Pros:** exact. For any 60-second span, at most 10 requests got through. No boundary problem.
- **Cons:** memory grows with the limit: a limit of 10,000 per hour means up to 10,000 timestamps per key
  (section 3 showed 80 GB vs 1.5 GB). Each check also does more work.

### 6.3 Sliding window counter

**Idea:** keep fixed-window counters (cheap), but **estimate** a sliding window by blending the previous window
and the current one. Assume requests in the previous window were spread evenly; count only the part of it that
still overlaps the last 60 seconds.

$$
\text{estimate} = \text{previous} \times \frac{\text{overlap of previous window}}{\text{window}} + \text{current}
$$

**Worked example.** Limit 10 per minute. The 12:00 window saw 8 requests. It is now 12:01:15, and the 12:01
window has 3 so far. The last 60 seconds are 12:00:15–12:01:15, which overlaps the previous window by 45 s.

- Estimate $= 8 \times \frac{45}{60} + 3 = 6 + 3 = 9$.
- 9 is below 10, so the request is **allowed** and the current counter becomes 4.
- At 12:01:30 with no new requests: $8 \times \frac{30}{60} + 4 = 8$. Old traffic "slides out" smoothly.

- **Pros:** two integers per key, smooth, no 2× boundary burst. The error is small for real traffic, which is
  why large CDNs and API platforms commonly use it.
- **Cons:** an approximation; if the previous window's requests were all bunched at its end, it under-counts a
  little.

### 6.4 Token bucket

**Idea:** every key has a **bucket** holding up to `capacity` tokens. Tokens drip in at a steady `rate`. Each
request takes one token (or `cost` tokens). No token, no entry.

Two numbers describe it, and they mean two different things:

- **`rate`** is the long-run average: 2 tokens per second means about 120 requests a minute over time.
- **`capacity`** is the largest burst: a caller who has been quiet can spend up to `capacity` at once.

That split is exactly what real clients need: an app opening a screen fires 8 calls at once, then goes quiet.
A token bucket allows that burst without raising the average.

We never run a timer to add tokens. Instead we store the token count and the time we last updated it, and
**refill lazily** when the next request arrives:

[![Token bucket check: a request for key user:42 arrives, the gateway reads the bucket's tokens and last refill time, refills by elapsed time times rate, checks whether there are enough tokens for the cost; if yes it takes them, saves the bucket and forwards the request with a remaining header, if no it replies 429 with Retry-After](/img/system-design/rate-limiter/02-token-bucket.png)](/img/system-design/rate-limiter/02-token-bucket.png)

```text
CAPACITY = 10          # biggest burst
RATE     = 1.0         # tokens added per second

function allow(key, cost = 1):
    b = store.get(key) or { tokens: CAPACITY, last: now() }
    elapsed  = now() - b.last
    b.tokens = min(CAPACITY, b.tokens + elapsed * RATE)   # lazy refill
    b.last   = now()
    if b.tokens >= cost:
        b.tokens = b.tokens - cost
        store.put(key, b)
        return ALLOW, remaining = floor(b.tokens)
    store.put(key, b)                                     # keep the refill
    return REJECT, retry_after = ceil((cost - b.tokens) / RATE)
```

**Worked example** (capacity 10, rate 1 per second):

| Time | Before | Refill | Request | After | Result |
| --- | --- | --- | --- | --- | --- |
| 0.0 s | 10 (new, full) | +0 | 10 requests at once | 0 | all 10 allowed: a burst |
| 0.5 s | 0 | +0.5 | 1 request | 0.5 | rejected, `Retry-After: 1` |
| 3.0 s | 0.5 | +2.5 | 1 request | 2 | allowed, 2 left |

- **Pros:** allows natural bursts while enforcing an average; two numbers per key; supports request costs;
  `Retry-After` falls straight out of the maths. This is the most common choice for public APIs.
- **Cons:** two parameters to tune; a full bucket lets a burst of `capacity` hit the backend at once, so
  capacity must be something the backend can absorb.

### 6.5 Leaky bucket

**Idea:** requests pour into a bucket (a **queue**) and leak out of a hole at the bottom at a **fixed rate**.
If the bucket is full, new requests spill over and are rejected.

Example: queue size 5, leak rate 2 per second. A burst of 8 requests arrives: 5 wait in the queue, 3 are
rejected. The 5 then reach the backend evenly, one every 0.5 s, whatever the input looked like.

- **Pros:** perfectly **smooth output**. Ideal in front of something that hates bursts: a legacy database, or a
  third-party API that allows exactly 2 calls per second.
- **Cons:** queued requests wait (added latency), and a burst of old requests can delay fresh ones. Bursts are
  never allowed, even after a long quiet period.

There is also a "leaky bucket as a meter" version that does not queue: it rejects instead of waiting, and is
mathematically equivalent to a token bucket. The **generic cell rate algorithm (GCRA)** implements it by storing
a single timestamp per key, "the theoretical arrival time" of the next allowed request; some Redis rate-limiting
modules use it. Shopify, for example, documents its REST Admin API limits in leaky-bucket terms.

### 6.6 Choosing

| Algorithm | Memory per key | Accuracy | Bursts | Best for |
| --- | --- | --- | --- | --- |
| Fixed window | 1 counter | Up to 2× at boundaries | Allowed, even doubled | Simple daily or hourly quotas |
| Sliding log | 1 entry per request | Exact | Never above limit | Low limits where exactness matters (login attempts) |
| Sliding window counter | 2 counters | Very close | Smoothed | General per-minute API limits at scale |
| Token bucket | 2 numbers | Exact average, bounded burst | Up to `capacity` | Public APIs, per-user limits, request costs |
| Leaky bucket (queue) | Queue | Exact output rate | Absorbed, then smoothed | Protecting a fragile downstream |

**Interview default:** token bucket for API limits, sliding window counter if the interviewer cares about
per-window semantics, and explain why you did not choose the others.

## 7. High-level design

[![High-level architecture: clients reach a load balancer and then the API gateway, whose rate-limiter middleware checks Redis with an atomic Lua script and forwards allowed requests to backend services; the rules service loads rules from a versioned store and pushes them to gateways, which cache them; decisions go asynchronously to metrics and logs](/img/system-design/rate-limiter/03-architecture.png)](/img/system-design/rate-limiter/03-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **API gateway nodes:** many identical, stateless servers. Each runs the limiter middleware on every request.
- **Rules service + rules store:** the source of truth for rules; pushes changes to gateways within seconds.
  Gateways keep the last-known rules in memory, so a rules-service outage changes nothing.
- **Redis cluster:** the shared, in-memory store of counters and buckets, sharded by key. Every entry has a
  **TTL** (time to live), so idle keys disappear on their own.
- **Metrics and logs:** allowed and rejected counts per rule, sent asynchronously so they never slow a request.

Why a **shared** store? Because the load balancer spreads one caller's requests over many gateways. If each
gateway counted on its own, a caller hitting 20 gateways would get 20 times its limit.

Why **Redis** (or a similar in-memory store)? Counters are tiny, change on every request, and are **soft
state**: losing a few seconds of counts in a failure is harmless. That rules out a disk-based database (too
slow per write) and makes an in-memory store with atomic operations and built-in expiry a natural fit.

### The request flow

[![Request sequence: the client calls GET /v1/orders with key k1; the gateway, holding the rule 100 per minute, runs the bucket script on Redis, which answers allowed with 37 left; the gateway forwards to the orders service and returns 200 with RateLimit-Remaining 37. Later, Redis answers denied with the next token in 0.6 seconds, and the gateway returns 429 with Retry-After 1 (whole seconds, rounded up) without calling the service](/img/system-design/rate-limiter/04-request-flow.png)](/img/system-design/rate-limiter/04-request-flow.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **One network round trip** to Redis per request, whatever the algorithm.
- **Rejected requests never reach the service.** That is the point: a flood costs us one cheap Redis call per
  request, not a database query.
- The gateway reports the remaining quota on **every** response, not just on rejections, so well-behaved clients
  can slow down before they hit the wall.

### What the client sees

**429 Too Many Requests** (defined in RFC 6585) is the status for "you, specifically, are sending too much".
Use **503 Service Unavailable** instead when the *server* is overloaded for everyone. A typical rejection:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 1
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 1
Content-Type: application/json

{"error": "rate_limited", "message": "Limit of 100 requests per minute exceeded. Retry in 1 second."}
```

- **`Retry-After`** is a standard HTTP header: either a number of seconds or a date.
- With 100 tokens a minute, a new token arrives every 0.6 s, so the wait rounds up to 1 second.
- The **remaining-quota headers** are a convention. Many APIs use `X-RateLimit-Limit`, `X-RateLimit-Remaining`
  and `X-RateLimit-Reset` (GitHub does, for example, with the reset as a Unix timestamp). Early drafts of an IETF
  specification used the three `RateLimit-*` fields shown above; later drafts fold them into two fields,
  `RateLimit` and `RateLimit-Policy`. Pick one style and document it.
- **Good clients** honour `Retry-After` and retry with **exponential backoff plus jitter** (random spread), so a
  thousand rejected clients do not all retry in the same millisecond.

## 8. Deep dive: race conditions and atomic operations

The simplest distributed limiter reads the count, decides, and writes the new count. With many gateways that is
broken. Here two gateways handle requests 10 and 11 for the same user, whose limit is 10:

[![Race condition: gateway A and gateway B both GET the count and see 9, both decide 9 is under the limit of 10, and both SET the count to 10, so 11 requests are served while the counter says 10. With one atomic INCR instead, A gets 10 and is allowed, B gets 11 and is rejected with a 429](/img/system-design/rate-limiter/05-race.png)](/img/system-design/rate-limiter/05-race.png)

This is a classic **check-then-act race**: the check (read 9) and the act (write 10) are separate steps, and
another gateway slipped in between. Under real load, with thousands of requests a second for one key, the
overshoot is not 1 but can be many times the limit.

**The fix is to make the read, the decision and the write one indivisible (atomic) step** on the store.

### Fixed window: `INCR` is already atomic

Redis executes commands one at a time, so `INCR` returns each caller a different number. Allow if the number
is at most the limit. But beware a second, subtler race:

```text
count = INCR user:42:12:01
if count == 1: EXPIRE user:42:12:01 60    # crash here, and the key never expires
```

If the gateway crashes between `INCR` and `EXPIRE`, the key never expires. Here the key name contains the
minute, so the cost is leaked memory; in the common variant whose key has no window in its name and relies on
the expiry to reset the count, the user stays blocked for good once they reach the limit. Do both in **one**
atomic step: a short script that sets the expiry when the count is 1, or a `MULTI`/`EXEC` transaction that
sends `INCR` and `EXPIRE` together (safe to repeat here only because the key name already fixes the window).

### Token bucket: a Lua script

A token bucket reads two fields, does arithmetic and writes them back. Redis runs a **Lua script** atomically:
no other command runs on that shard until the script finishes. So the whole check becomes one call:

```lua
-- KEYS[1] = bucket key; ARGV = capacity, rate (tokens per second), cost
local capacity, rate, cost = tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])
local t   = redis.call('TIME')                       -- the store's clock, not the gateway's
local now = tonumber(t[1]) + tonumber(t[2]) / 1e6

local b      = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
local tokens = tonumber(b[1]) or capacity
local ts     = tonumber(b[2]) or now

tokens = math.min(capacity, tokens + math.max(0, now - ts) * rate)
local allowed = 0
if tokens >= cost then
  tokens  = tokens - cost
  allowed = 1
end
redis.call('HSET', KEYS[1], 'tokens', tokens, 'ts', now)
redis.call('EXPIRE', KEYS[1], math.ceil(capacity / rate) + 1)   -- idle keys vanish
return { allowed, tostring(tokens) }
```

Details that interviewers like:

- **Use the store's clock** (`TIME`), not each gateway's. Gateways' clocks drift apart by milliseconds or more,
  and a gateway whose clock runs ahead would hand out extra tokens. Clamp the elapsed time at zero, because after
  a failover the new primary's clock may be slightly behind the old one. (Calling `TIME` inside a script that
  writes is fine since Redis 5, which replicates a script's effects rather than the script itself.)
- **The TTL equals the time to refill a full bucket** (plus a margin). After that, a missing key and a full
  bucket mean the same thing, so deleting it loses nothing.
- **Load the script once** (`SCRIPT LOAD`) and call it by its hash (`EVALSHA`) to avoid sending the source on
  every request.
- In **Redis Cluster**, all keys a script touches must live on the same shard. Use one key per bucket, or
  **hash tags** like `{user:42}:search` and `{user:42}:global` to keep one user's keys together, so all of that
  user's rules can be checked in a single script call. A rule keyed on something else, such as an endpoint-wide
  cap, lives on another shard; send that call in parallel, so the request still waits for only one round trip.

### Why not a database lock?

A lock (or a database transaction) also prevents the race, but it costs several round trips and makes
requests for the same key wait for each other. An atomic operation on an in-memory store does the same job in
one round trip, which is why it is the standard answer.

## 9. Deep dive: local vs global limits

Even one Redis call per request adds latency and load, and at millions of checks per second the Redis bill is
real. A popular optimisation trades a little accuracy for a lot of speed: **decide locally, sync globally**.

[![Local counters with periodic global sync: clients with a limit of 1,000 per minute send requests to gateways 1, 2 and 3, each deciding from memory with local unsynced counts of 12, 9 and 15; every second each gateway pushes its delta to the global Redis store, which holds a total of 640 for user 42, and pulls the new total](/img/system-design/rate-limiter/06-local-global.png)](/img/system-design/rate-limiter/06-local-global.png)

*Select the diagram to zoom in and move around.*

How it works:

1. Each gateway keeps an **in-memory counter** per key and decides on its own, using
   "last known global total + my unsent local count". Gateway 1 above sees $640 + 12 = 652$, well under 1,000,
   so it allows.
2. Every second (the **sync interval**), each gateway adds its local count to the global total in Redis
   (one `INCRBY` per active key, batched) and reads back the new total.
3. Once the global total reaches the limit, every gateway learns within one interval and starts rejecting.

**The price is a bounded overshoot.** Between syncs, gateways do not see each other's traffic, so a caller can
exceed the limit by at most about **one sync interval's worth of its traffic**. A caller sending 50 requests a
second against a limit of 1,000 per minute can get roughly 50 extra. For most API limits that is fine; for
"5 login attempts", it is not, so those rules stay on the exact path.

A simpler variant is to **split the limit**: with 10 gateways, each allows 1/10 of the limit with no shared
store at all. It works when the load balancer spreads every caller's requests evenly over the gateways, but is
unfair when traffic is uneven: a caller whose requests all land on one gateway (one long-lived connection, say)
gets only a tenth of its allowance. The opposite fix is **sticky routing**: send each key to the same gateway
(consistent hashing of the key), which can then enforce the full limit on its own.

| Approach | Latency added | Accuracy | Store load |
| --- | --- | --- | --- |
| Shared store on every request | One round trip (~0.5 ms) | Exact | One call per request |
| Local + periodic sync | ~0 | Over by up to one interval's traffic | One call per active key per interval |
| Split the limit per node | ~0 | Unfair under uneven load | None |

## 10. Deep dive: multiple regions

A global product runs in several regions, for example Europe and the US. A round trip between them takes on the
order of 70–150 ms, a hundred times the budget for a limiter check. So **never check a remote region on the
request path**.

[![Rate limiting across two regions: users in Europe reach EU gateways, which check the local EU Redis in about 1 ms; users in the US reach US gateways, which check the US Redis; the two Redis stores swap counts asynchronously in both directions](/img/system-design/rate-limiter/07-multi-region.png)](/img/system-design/rate-limiter/07-multi-region.png)

*Select the diagram to zoom in and move around.*

The options, from simplest to most accurate:

- **Independent limits per region.** Each region enforces the full limit on its own. Simple and fast; a caller
  could get up to N times the limit by spreading over N regions, but most callers are routed to their nearest
  region anyway, so in practice they rarely do.
- **Split the limit across regions** (60% Europe, 40% US). Tighter, but wrong when a caller's traffic moves.
- **Local decisions plus asynchronous replication of counts.** Each region keeps its own count for a key and
  ships it to the others every second or so. The global total is the **sum** of all regions' counts. This is a
  **G-counter**, a simple CRDT (a data type designed so copies can be merged in any order without conflict): each
  region only ever increases its own slot, so merging is just "take the larger value per region". Overshoot is
  bounded by the replication lag.

The usual answer: **local Redis per region on the request path, counts replicated asynchronously**, and the
strict, low-volume rules (login, OTP) either kept per region or pinned to a home region for that user.

## 11. Deep dive: failing open or failing closed

What happens when Redis is slow, partitioned, or down? The limiter must decide **without** its data.

[![Failure handling: the gateway asks Redis with a timeout of about 5 ms; if Redis answers, the gateway uses its allow or 429 decision; on a timeout it checks the rule's policy: fail open, enforcing only a local in-memory limit, for most APIs, or fail closed, rejecting requests, for risky endpoints like login and OTP](/img/system-design/rate-limiter/08-fail-open.png)](/img/system-design/rate-limiter/08-fail-open.png)

- **Fail open** (allow the request): the API stays up; for a few minutes callers may exceed their limits. Right
  for most traffic, because a limiter outage should not become an API outage, and backends have their own load
  shedding as a second line of defence.
- **Fail closed** (reject the request): safe against abuse but turns a Redis outage into a user-facing outage.
  Right for endpoints where abuse is costly or dangerous: login and password reset (brute force), sending OTPs or
  SMS (real money), and money transfers.
- **Middle ground:** fall back to a **local in-memory limiter** per gateway (the "split the limit" approach
  above). Not exact, but it still stops a single client from flooding.

Make the failure path itself cheap:

- **Tight timeouts** (a few ms). A limiter waiting 2 seconds for Redis is worse than no limiter.
- A **circuit breaker**: after repeated timeouts, stop calling Redis for a few seconds and use the fallback
  immediately, then probe again. This prevents every request from paying the timeout.
- Counters are **soft state**. When a Redis primary fails and a replica takes over, a few seconds of counts may
  be lost. That is acceptable; do not pay for disk persistence or synchronous replication here.

## 12. Deep dive: hot keys

Sharding by key spreads load evenly, until **one key** becomes enormous. A large customer's API key, the
`global` key of an endpoint-wide cap, or an attacker's IP during a flood might receive 200,000 requests per
second. All of them land on the **one shard** that owns that key, and that shard's CPU becomes the bottleneck
for everyone else on it.

Fixes, from cheapest to most involved:

1. **Deny cache.** Once a key is rejected with `Retry-After: 2`, the gateway remembers "blocked until
   12:01:17" in memory and rejects further requests locally, without calling Redis. During an attack, almost all
   requests are rejections, so this removes almost all of the load.
2. **Local batching** for that key (section 9): each gateway sends one `INCRBY` per interval instead of one call
   per request.
3. **Split the key.** Store the bucket as 8 sub-buckets, `tenant:7#0` … `tenant:7#7`, on different shards, each
   with 1/8 of the rate and capacity. Each request picks one at random. The total stays close to the limit and
   the load spreads over 8 shards.
4. **Push floods outward.** A real DDoS should be absorbed at the edge (CDN, firewall), not counted one request
   at a time in Redis.

## 13. What breaks as it grows, and how to fix it

**Too many round trips.** Each new rule adds a Redis call. *Fix:* evaluate all of a request's rules in one
script call, keeping each caller's keys on one shard with hash tags.

**Redis CPU.** Scripts cost more than plain commands. *Fix:* more shards (keys are independent, so this scales
linearly), local batching for high-volume keys, and the deny cache.

**Retry storms.** After an outage, thousands of clients retry at once and immediately hit their limits, which
triggers more retries. *Fix:* `Retry-After` on every 429, and client SDKs that back off exponentially with
jitter.

**False positives behind shared IPs.** A whole university or mobile carrier shares a few IP addresses and gets
blocked together. *Fix:* use IP limits only before login and set them generously; switch to user or API-key
limits as soon as the caller is known.

**Rule sprawl.** Hundreds of overlapping rules nobody understands. *Fix:* versioned rules with owners, shadow
mode before enforcement, and dashboards showing which rule rejected what.

**Memory from logs.** A sliding log with high limits eats RAM. *Fix:* sliding window counters or token buckets
for anything above a few dozen requests per window.

## 14. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Algorithm | Exact (sliding log) | Approximate (counter, bucket) | **Token bucket / sliding counter**: tiny memory, near-exact |
| State | Per-node memory | Shared store | **Shared Redis**, so spreading requests over nodes does not multiply the limit |
| Check path | Every request hits the store | Local decision + periodic sync | **Store per request** by default; **local + sync** for very high-volume keys |
| Store failure | Fail closed | Fail open | **Per rule**: open for most APIs, closed for login, OTP, payments |
| Multi-region | One global store | Regional stores + async sync | **Regional + async**: cross-region latency is unaffordable per request |
| Concurrency safety | Locks / transactions | Atomic ops and Lua scripts | **Atomic scripts**: one round trip, no waiting |
| Where | In each service | Gateway middleware | **Gateway**, plus edge IP limits and in-service business limits |

## Cheat sheet for last-minute revision

- **Why:** abuse and security, fairness between callers, cost control, protecting downstreams and third-party quotas.
- **Where:** gateway middleware (main), edge for per-IP floods, sidecar for service-to-service, in-service
  for business rules, client for polite backoff (never trusted).
- **Key:** API key, user ID, IP (before login; beware shared IPs; IPv6 by prefix), or combined with the route.
  Rules are config, pushed to gateways and cached in memory; shadow mode first.
- **Algorithms:** fixed window (simple, 2× burst at the boundary) · sliding log (exact, memory-hungry) · sliding
  window counter (`prev × overlap + curr`, near-exact, cheap) · token bucket (`rate` = average, `capacity` = burst,
  lazy refill) · leaky bucket (queue, smooth output).
- **Distributed:** shared Redis sharded by key, TTL on every key. Read-then-write races → make it **atomic**:
  `INCR`, `MULTI/EXEC`, or a **Lua script**. Use the store's clock. `INCR` then `EXPIRE` separately can leak keys.
- **Speed:** one round trip per request; or decide locally and sync every second (overshoot ≤ one interval's traffic).
- **Response:** `429 Too Many Requests` + `Retry-After` + remaining-quota headers; clients back off with jitter.
- **Failure:** tight timeouts and a circuit breaker; fail open for most APIs, closed for login, OTP and payments.
- **Multi-region:** never check another region on the request path; regional stores + async count sharing (G-counter).
- **Hot keys:** deny cache, local batching, split the key into sub-buckets, push floods to the edge.
- **Numbers:** 1M req/s × 2 rules = 2M checks/s ≈ 40 Redis shards; token buckets ≈ 1.5 GB for 10M keys vs ~80 GB for logs.

## Practice questions

1. **A customer says they got 429s while staying under their limit. How would you investigate?** Check which
   rule rejected them (the decision log names it). Common causes: a second, overlapping rule (per-IP or global),
   a shared office IP, their own retries counting against the limit, or a burst larger than the bucket capacity
   (their per-minute average was fine, but 30 calls in one second emptied a bucket of 20).
2. **How would you limit concurrent requests (at most 5 in flight) rather than a rate?** Use a counter that is
   incremented when a request starts and decremented when it ends. Because a crashed server never decrements, store
   each in-flight request with an expiry (for example a sorted set of request IDs scored by deadline) and drop
   expired entries before counting.
3. **Some endpoints are far more expensive than others. How do you reflect that?** Give each route a **cost** and
   take that many tokens: a read costs 1, a bulk export 50. GraphQL APIs often compute the cost from the query's
   complexity before running it.
4. **Your 200 workers must call a partner API that allows 100 calls per second in total. Design it.** An
   outbound token bucket in Redis shared by all workers (rate 100, small capacity), or a single queue drained at
   100 per second by a leaky-bucket dispatcher. Respect the partner's own 429 and `Retry-After` as a backstop.
5. **How would you give paying customers higher limits without redeploying?** Rules keyed by plan; the billing
   system updates the customer's plan in the rules store, and the change is pushed to gateways within seconds.
