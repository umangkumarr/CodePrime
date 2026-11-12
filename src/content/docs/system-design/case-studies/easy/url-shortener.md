---
title: "Design a URL Shortener (like TinyURL)"
description: "Design a URL shortener like TinyURL: short-code generation, 301 vs 302 redirects, read-heavy caching, sharding, expiry, abuse checks and click analytics."
difficulty: "Easy"
sidebar:
  label: "URL shortener (like TinyURL)"
tags: ["Hashing", "Caching", "Databases", "Sharding", "Analytics"]
---

A URL shortener turns a long, ugly link such as
`https://shop.example.com/products/shoes?colour=red&size=9&utm_campaign=autumn` into something like
`https://sho.rt/kYJb`. When anyone opens the short link, the service looks up the original and sends the browser
there. TinyURL and bit.ly are the famous examples.

It is the classic first system design question because the core fits on a napkin: **a giant dictionary from short
codes to long URLs**. The interesting part is everything around that dictionary: how to invent billions of codes
that never clash, how to answer redirects in a few milliseconds when one link goes viral, which HTTP status code to
send, how to stop spammers, and how to count clicks without slowing anything down.

This case study builds the service from first principles, then digs into the questions interviewers push on.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. URL shortening in 5 minutes

A few terms we will use throughout:

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Long URL** | The original address the user wants to share | A full postal address |
| **Short code** | The few characters after the domain: `kYJb` in `sho.rt/kYJb` | A PO box number |
| **Redirect** | An HTTP response that says "what you want is over there"; the browser then fetches that address itself | A "we have moved" sign on a shop door |
| **301 / 302** | The two common redirect status codes: **301** means *moved permanently*, **302** means *found, but temporarily elsewhere* | A permanent change of address vs a "back in 10 minutes, try next door" note |
| **Base62** | Writing a number using 62 symbols: `0–9`, `a–z`, `A–Z` | Like decimal, but with 62 digits instead of 10 |
| **Cache** | A small, fast in-memory copy of the most-used data | Keeping the phone numbers you dial daily on a sticky note |

Here is what happens when someone opens a short link:

1. The browser asks our server for `GET /kYJb`.
2. We look up `kYJb` and find the long URL.
3. We answer `302 Found` with a header `Location: https://shop.example.com/...`. No page body is needed.
4. The browser immediately requests the long URL from the shop's own server. We are out of the picture.

**Why base62?** URLs can safely use letters and digits without any escaping, and 62 symbols pack a lot of
information into few characters. Each extra character multiplies the number of possible codes by 62:

| Code length | Possible codes | Roughly |
| --- | --- | --- |
| 5 | $62^5$ | 916 million |
| 6 | $62^6$ | 56.8 billion |
| 7 | $62^7$ | 3.5 trillion |
| 8 | $62^8$ | 218 trillion |

Converting a number to base62 is the same as converting to any base: repeatedly divide by 62 and keep the
remainders. With the alphabet `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`, the number 125 is
$2 \times 62 + 1$, so it becomes `21`, and 5,000,001 becomes `kYJb`.

```text
ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

function base62(n):
    if n == 0: return "0"
    code = ""
    while n > 0:
        code = ALPHABET[n % 62] + code
        n = n / 62            (integer division)
    return code
```

Two facts shape the whole design:

1. **Reads vastly outnumber writes.** A link is created once and may be clicked thousands of times. The redirect
   path must be fast and cheap; the create path can afford a bit more work.
2. **A short link is a promise.** It gets printed on posters, embedded in emails and pasted into chats we can never
   edit. If our service is down, or a code is reused for something else, every one of those copies breaks.

## 2. Requirements

### Functional (what users can do)

- **Shorten**: given a long URL, return a short URL that is unique to this request.
- **Redirect**: opening the short URL takes the visitor to the long URL.
- **Custom aliases**: optionally choose the code yourself, such as `sho.rt/autumn-sale`.
- **Expiry**: optionally set an expiry date, after which the link stops working.
- **Analytics**: the link owner sees click counts over time, by country, referrer and device.
- **Manage links**: registered users list, disable and delete their links; developers use an API with a key.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Availability** | 99.99% for redirects; 99.9% is fine for creating links | A broken redirect breaks every place the link was ever shared |
| **Latency** | Redirect answered in a few milliseconds inside our servers; well under 100 ms end to end for most users | The redirect is an extra hop before the real page; it should be invisible |
| **Scale** | 100 million new links a month, 10 billion redirects a month | Large public shortener |
| **Durability** | A created link must never be lost or silently changed | Losing the mapping is the same as breaking the link |
| **Uniqueness** | Two different links must never get the same code | A clash would send people to the wrong site |
| **Unpredictability** | Codes should be hard to guess or enumerate | People shorten private documents and do not expect strangers to find them |
| **Safety** | Do not become a delivery tool for phishing and malware | Otherwise browsers and email providers start blocking our whole domain |

Analytics may lag by seconds to minutes. Nobody needs a click count to be exact to the millisecond.

### Out of scope

Link-in-bio pages, QR code design, A/B testing of destinations, billing, and the web UI itself. Mention them, then
set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** 100 million new links a month. Each link is read 100 times on average over its life, so the
read-to-write ratio is **100 : 1**. We keep links for 10 years. A month is about $2.6 \times 10^6$ seconds
(30 days × 86,400 s).

**Traffic**

- Creates: $100\text{M} / 2.6\text{M s} \approx$ **40 per second** on average.
- Redirects: $10\text{B} / 2.6\text{M s} \approx$ **3,900 per second** on average. Traffic is spiky (a link shared
  by a celebrity, a link in a TV advert), so plan for at least **5× peaks, about 20,000 per second**, and for one
  single link suddenly receiving a large share of it.

**Storage**

- Links over 10 years: $100\text{M} \times 12 \times 10 = 12\text{B}$ links.
- One row (code, long URL averaging a couple of hundred bytes, owner, timestamps, index overhead): about **500
  bytes**.
- Total: $12\text{B} \times 500\text{ B} = 6\text{ TB}$. Small by modern standards: a handful of database shards.

**Code length**

- We need room for 12 billion codes, plus headroom. Six characters give 56.8 billion, which is only about 5×
  headroom; **seven characters give 3.5 trillion**, almost 300×. Seven it is. Codes generated from a counter start
  shorter (the first 56.8 billion fit in six characters), which is fine.

**Cache**

- Redirects per day: $10\text{B} / 30 \approx 330\text{M}$. Traffic is very skewed: a small share of links gets most
  clicks. Suppose 20 million distinct links are opened on a busy day. At about 500 bytes per cached entry, that is
  $20\text{M} \times 500\text{ B} = 10\text{ GB}$, which fits in the memory of a single machine. We still run a
  small cluster, for throughput and so a node failure does not empty the cache.

**Analytics events**

- One event per redirect, about 200 bytes: $10\text{B} \times 200\text{ B} = 2\text{ TB}$ of raw events a month.
  This is now the **largest** data set, larger than the links themselves after only three months.

Three conclusions follow:

1. **The redirect path is everything.** It is 99% of traffic, it must be cached, and it must not wait for
   analytics.
2. **The mapping table is small but precious.** 6 TB is easy to store; the hard part is keeping it unique, always
   available and never lost.
3. **Analytics is a separate, bigger, asynchronous system.** It should share nothing with the redirect path except
   a queue.

## 4. The API

Clients talk to us over HTTPS. Developers authenticate with an API key; anonymous users can create links at a low
rate limit.

| Method and path | What it does |
| --- | --- |
| `POST /api/v1/urls` | Create a short link. Body: `{"long_url": "...", "custom_alias": "autumn-sale", "expires_at": "2027-01-31T00:00:00Z"}` (the last two optional). Returns `201 Created` with `{"code": "kYJb", "short_url": "https://sho.rt/kYJb"}`. |
| `GET /{code}` | The redirect itself: `302` with a `Location` header, `404 Not Found` for an unknown code, `410 Gone` for an expired or removed one. |
| `GET /api/v1/urls/{code}` | Details of one of your links: destination, created, expires, status. |
| `PATCH /api/v1/urls/{code}` | Change the expiry, or disable the link. |
| `DELETE /api/v1/urls/{code}` | Delete one of your links. |
| `GET /api/v1/urls/{code}/stats?from=...&to=...&by=day` | Click counts over time, by country, referrer or device. |
| `GET /api/v1/urls?cursor=...` | List your own links, newest first, with a cursor for the next page. |

Notice that the redirect path, `GET /{code}`, lives on the **root of the short domain** and is not under `/api`.
That keeps the short URL short, and it means we must **reserve** words such as `api`, `login`, `admin` and `help`
so nobody can register them as custom aliases.

Should shortening the same long URL twice return the same code? It is tempting, because it saves space, but two
users shortening the same page usually want **separate** links: each has its own owner, expiry and click counts.
So by default every create request makes a new code. A client that retries a timed-out request can send an
`Idempotency-Key` header so the retry returns the first result instead of creating a second link.

## 5. High-level design

[![High-level architecture: users reach a load balancer; the create service asks the key service for ID ranges, checks URLs with a safety service and inserts mappings into the URL database; the redirect service looks codes up in a cache and falls back to the database on a miss, and publishes click events to a Kafka topic that analytics workers aggregate into an analytics store](/img/system-design/url-shortener/01-architecture.png)](/img/system-design/url-shortener/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Load balancer:** ends TLS (decrypts HTTPS), applies per-IP and per-key **rate limits**, and spreads requests over
  stateless servers.
- **Create service:** validates and normalises the long URL, checks it is safe, picks a code, stores the mapping.
- **Key service:** the source of unique numbers. It hands each create server a **range** of IDs to use (section 8).
- **URL safety check:** compares the destination against blocklists and threat feeds before we agree to shorten it.
- **Redirect service:** the hot path. Looks the code up, answers with a redirect, and fires off a click event.
- **Cache:** an in-memory key-value store (for example Redis or Memcached) holding `code → long URL` for popular
  links.
- **URL database:** the source of truth for every mapping, **sharded** (split across machines) by code.
- **Click events + analytics workers + analytics store:** an asynchronous pipeline that turns raw clicks into the
  numbers owners see.

The most important idea in this design: **the read path and the write path are separate services.** They scale
independently (we may run ten redirect servers for every create server), and a bug or overload in creating links
cannot slow down the redirects that millions of existing links depend on.

## 6. Flow 1: creating a short link

A client shortens a long URL without asking for a custom alias.

[![Sequence for creating a link: the client posts to the create service, which validates the URL, asks the safety check, fetches a new ID range from the key service only when its current range is used up, encodes the next ID in base62, inserts the code and URL if absent into the database, and returns 201 with sho.rt/kYJb](/img/system-design/url-shortener/02-create.png)](/img/system-design/url-shortener/02-create.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Normalising** the URL means lower-casing the scheme and host, rejecting anything that is not `http` or `https`
  (a `javascript:` URL could run code in the visitor's browser), and refusing links to our own domain, which could
  create redirect loops.
- **Step 5 is rare.** The create server keeps its range in memory and only calls the key service when it has used
  all million IDs. Almost every create needs no network call to pick a code.
- **Step 7** turns ID 5,000,001 into `kYJb`. For clarity the diagram encodes the ID directly; section 8 explains
  why a real service scrambles it first so codes cannot be guessed.
- **"Insert if absent"** (a conditional insert that fails if the code already exists) is our last line of defence
  against duplicates. With a range-based counter it should never fail, but custom aliases share the same namespace
  (section 13), so we never blindly overwrite a row.
- The whole flow is a few milliseconds plus the safety check. Creates are rare (40 a second), so we can afford a
  careful write.

## 7. Flow 2: following a short link

This is the flow that happens billions of times a month.

[![Sequence for following a link: on a cache hit the redirect service gets the long URL from the cache, answers 302 to the long URL and publishes a click event without waiting; on a miss it reads the row from the URL database, stores it in the cache with a TTL and answers 302, or 404 or 410](/img/system-design/url-shortener/03-redirect.png)](/img/system-design/url-shortener/03-redirect.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The cache answers most requests.** Popular links are in memory; the database only sees first visits and cold
  links. This pattern, where the application checks the cache, reads the database on a miss and then fills the
  cache, is called **cache-aside**.
- **The click event is fire and forget.** The redirect does not wait for analytics. The event is put in a small
  in-memory buffer and sent to the queue in batches; if the queue is briefly unavailable, we drop or spill a few
  events rather than delay a redirect.
- **The cache stores the expiry too**, so an expired link is refused even when it is served from memory.
- **Unknown codes are cached as well**, with a short TTL (time to live, how long an entry may stay in the cache).
  Scanners that try random codes would otherwise send every guess straight to the database. This is called
  **negative caching**.

## 8. Deep dive: generating the short code

This is the heart of most interviews. We need codes that are **unique**, **short**, ideally **hard to guess**, and
cheap to make at 40 per second (or 4,000, if we grow). There are three classic approaches.

### Approach 1: hash the long URL

Run the long URL through a hash function such as MD5 or SHA-256, write the result in base62 and keep the first 7
characters.

[![Hash-based codes: the normalised long URL is hashed with a salt, encoded in base62 and cut to seven characters, then inserted if absent; if the code is taken and the stored long URL is the same, the existing code is reused, otherwise the salt is changed and the hash is retried](/img/system-design/url-shortener/04-hash-collision.png)](/img/system-design/url-shortener/04-hash-collision.png)

The appeal is that no coordination is needed: any server can compute a code on its own. The problem is
**collisions**. Cutting a hash to 7 characters throws away almost all of it, and two different URLs can end up with
the same 7 characters. How likely is that? When we already store 12 billion codes out of 3.5 trillion possible
ones, a brand-new code hits an existing one with probability

$$\frac{12 \times 10^9}{3.5 \times 10^{12}} \approx 0.34\%$$

That is about one create in 300, which is far too often to ignore. So every insert must be **"insert if absent"**,
and on a clash we check whether the stored row is the same long URL (if we want to reuse codes for identical URLs)
or add a counter or random **salt** (extra input mixed into the hash) and try again, as the diagram shows. Each
retry is another database round trip, and the retries grow as the table fills.

Note also that hashing the URL alone gives the **same** code to everyone who shortens the same page. As section 4
explained, we usually want separate links per request, so the salt should include something unique such as the
user ID and a timestamp, at which point the hash is really just an expensive random number generator.

### Approach 2: a counter, encoded in base62

Give every new link the next number from a counter: 1, 2, 3 … and write that number in base62. Different numbers
always give different codes, so there are **no collisions at all**, and early codes are very short.

The challenge is the counter itself. One database row incremented on every create is a **single point of
failure** and a bottleneck. The standard fix is **ID ranges**: a small key service owns a counter, and each create
server asks for a whole block of IDs at once.

[![ID ranges: a key service atomically adds one million to a range counter stored in ZooKeeper or one database row; create servers A, B and C each hold a different million-ID range, encode each ID in base62 and insert it into the URL database](/img/system-design/url-shortener/05-id-ranges.png)](/img/system-design/url-shortener/05-id-ranges.png)

*Select the diagram to zoom in and move around.*

How it works:

- The key service stores one number, the start of the next free range, in a strongly consistent store such as
  ZooKeeper, etcd, or a single database row. Handing out a range is one **atomic** "read and add 1,000,000"
  operation (atomic means no other request can sneak in between the read and the write), so two servers can never
  get the same range.
- Each create server then uses its range from memory with no coordination. At 40 creates per second, one million
  IDs last a single server about seven hours ($10^6 / 40 = 25{,}000$ seconds).
- If a create server crashes, the unused part of its range is simply **skipped**. Losing a few hundred thousand
  numbers out of 3.5 trillion does not matter.
- If the key service is down, servers keep working on the ranges they already hold, which buys hours to fix it.

**The catch: sequential codes are guessable.** If my link is `kYJb`, I can try `kYJc`, `kYJd` and so on, and read
other people's links, which may point to private documents. Two common fixes:

1. **Scramble the number before encoding it.** Apply a reversible, collision-free shuffle to the ID, for example
   multiplying by a large odd constant modulo $62^7$, or a small block cipher designed for a fixed range of numbers.
   Each ID still maps to exactly one code, so uniqueness is kept, but neighbouring IDs produce codes that look
   unrelated.
2. **Add a few random characters** to each code. This makes codes longer but makes guessing hopeless.

### Approach 3: a key generation service with pre-made random codes

A **key generation service (KGS)** creates random 7-character codes ahead of time, offline, removes duplicates, and
stores them in an "unused keys" table. Create servers take codes in batches (say 1,000 at a time), and the KGS
marks those as used so no one else gets them.

- Codes are **random**, so they are not guessable, and there is still **no collision check** at create time.
- The KGS must make sure two servers never receive the same batch: mark keys as used in the same transaction that
  hands them out.
- As with ranges, keys held by a server that crashes are wasted, which is acceptable.
- The cost is an extra service and table to run, and the key store must be replicated so it is not a single point
  of failure.

### Which one to choose?

| Approach | Unique without checks? | Guessable? | Coordination | Complexity |
| --- | --- | --- | --- | --- |
| Hash + truncate | No: about 1 in 300 creates clash at our scale | No | None | Low, but retries grow as the table fills |
| Counter with ID ranges | Yes | Yes, unless scrambled | One call per million IDs | Low |
| Key generation service | Yes | No | One call per batch | Medium: an extra service and table |

**A good interview answer:** ID ranges from a small key service, with the ID scrambled by a reversible shuffle
before base62 encoding, and "insert if absent" as a safety net. It is simple, collision-free, needs almost no
coordination and produces codes that do not reveal their neighbours. Mention hashing and the KGS as alternatives
and explain why you did not pick them.

## 9. Deep dive: 301 or 302?

Both status codes redirect the browser, but they differ in one way that matters a lot: **caching**.

| | 301 Moved Permanently | 302 Found (temporary) |
| --- | --- | --- |
| What it tells the browser | "This address has moved for good" | "Go there this time; ask me again next time" |
| Browser caching | Browsers may cache it, often for a long time, and skip us on later clicks | Not cached by default; every click comes to us |
| Load on our servers | Lower | Every click |
| Click analytics | We miss repeat clicks from the same browser | We see every click |
| Changing or expiring the link later | Unreliable: browsers that cached it keep going to the old destination | Takes effect immediately |
| Search engines | Treat it as a permanent move | Treat it as temporary |

A shortener that sells analytics, supports expiry, and must be able to **switch off** a phishing link instantly
needs to see every click, so it uses **302** (or **307**, which is the same idea but also guarantees the browser
keeps the request method). A shortener that only wants the cheapest possible redirect and never changes a link
could use 301.

A middle ground is to send 301 or 302 with an explicit `Cache-Control: max-age=...` header of a few minutes: the
browser may reuse the answer briefly, which absorbs repeated clicks, but changes still take effect soon. In an
interview, the key is to **name the trade-off**: fewer requests versus control and analytics.

## 10. Low-level design: data model and sharding

### What we store

[![Data model: users own many urls; urls has code as primary key, long_url, a nullable user_id foreign key, is_custom, status, created_at and a nullable expires_at; daily_clicks has a composite primary key of code, day and country with a clicks count](/img/system-design/url-shortener/06-data-model.png)](/img/system-design/url-shortener/06-data-model.png)

*Select the diagram to zoom in and move around.*

Design decisions in this diagram:

1. **`code` is the primary key of `urls`.** The redirect path does exactly one thing: look up a row by code. Making
   it the key makes that a single point lookup, the cheapest query a database can do.
2. **`user_id` is nullable** because anonymous users can create links. `is_custom` marks aliases the user chose,
   which matters for abuse rules and reporting.
3. **`status`** (active or disabled) lets us switch a link off without deleting it, so we keep the evidence when we
   take down a phishing link.
4. **`daily_clicks` lives in the analytics store, not in the URL database.** Counting clicks means a write on every
   redirect; keeping those writes away from the mapping table protects the hot path. Its key `(code, day, country)`
   matches the question owners ask: "clicks per day, by country, for this link".

### Which database?

The access pattern is a pure key-value lookup at high read rates, with modest writes and no joins on the hot path.
Good fits:

| Option | Why it works | What to watch |
| --- | --- | --- |
| Key-value or wide-column store (DynamoDB, Cassandra, ScyllaDB) | Built for point lookups by key, scales horizontally, replicates across zones | "Insert if absent" needs a conditional write (DynamoDB condition expressions, Cassandra lightweight transactions) |
| Sharded relational DB (MySQL, Postgres) | Unique constraints and transactions are familiar; 6 TB is only a few shards | You run the sharding and resharding yourself |

Either is a fine answer. What matters is explaining **why**: one lookup by key, no joins, easy to split by key.

### Sharding the mapping table

**Sharding** means splitting a table across several database machines, each holding part of the rows. We pick a
**shard key** that decides which machine a row lives on. Here the natural key is `code`, because every redirect
already knows it.

- **Hash-based sharding.** Compute a hash of the code and use it to pick the shard. Rows spread evenly, and a
  redirect touches exactly one shard. With **consistent hashing** (a scheme where adding a machine only moves a
  small fraction of the keys), we can add shards without reshuffling everything.
- **Why not range-based sharding by code?** With a counter, new codes are close together. If shard 1 held `a…` to
  `f…`, every new link would land on the same shard and it would take all the writes: a **hot shard**. Hashing the
  code first removes that pattern.
- **"List my links"** is a different access pattern: by `user_id`, newest first. Since the main table is sharded
  by code, that query would have to ask every shard. The fix is a second, small table `user_links(user_id,
  created_at, code)` sharded by `user_id`, written alongside the main row. This is how a secondary index works in a
  distributed database anyway.
- **Replication.** Each shard has replicas in other availability zones (separate data centres in one region). Reads
  can be served by replicas; a new link is visible within milliseconds, and a miss on a replica can be retried on
  the primary for very new codes.

## 11. Deep dive: caching the read path

Redirect traffic is extremely skewed: today's viral link gets millions of clicks while most links get a handful.
That is the ideal case for a cache.

- **What we cache:** `code → (long URL, expires_at, status)`. A few hundred bytes per entry.
- **Eviction:** **LRU** (least recently used): when memory is full, drop the entry nobody has asked for the
  longest. Links that stop being popular fall out on their own.
- **TTL:** every entry expires after, say, a day, and never later than the link's own `expires_at`. The TTL is a
  safety net that bounds how long a stale entry can live.
- **Invalidation:** when a link is disabled, deleted or has its expiry changed, the write path also **deletes** the
  cache entry. The next redirect misses, reads the new state and refills the cache. Deleting is safer than
  updating: two concurrent updates can leave the wrong value behind, a deletion cannot.
- **Negative caching:** remember "this code does not exist" for a minute, so scanners cannot hammer the database.
- **The hot key problem.** One link receiving 50,000 clicks a second all lands on the **one** cache node that owns
  that key. Fixes: keep a tiny **in-process cache** (inside each redirect server's memory) for the top few thousand
  links with a TTL of a few seconds, or replicate very hot keys to several cache nodes. The in-process cache alone
  absorbs most of a viral spike.
- **CDN or edge caching.** A redirect is a tiny response that depends only on the code, so it can even be cached at
  a CDN's edge servers close to users. That cuts latency worldwide, but the CDN then answers clicks we never see, so
  it trades away analytics accuracy and fast takedowns, exactly like 301.

If the cache cluster fails completely, all traffic falls to the database. Size the database replicas to survive a
cold cache for a while, and warm the cache gradually (or rate-limit misses) rather than letting a stampede of
misses knock the database over.

## 12. Deep dive: click analytics

Owners want "how many clicks, when, from where, from which site". The rule is simple: **analytics must never slow a
redirect down**, so the redirect service only emits an event and everything else happens asynchronously.

[![Click analytics pipeline: redirect servers emit one event per click to a Kafka click topic keyed by code; a stream aggregator adds counts per minute to the analytics store, which a stats API queries for owner dashboards; a raw archiver appends hourly files to object storage, which nightly batch jobs read to compute unique visitors and filter bots, writing corrected totals back to the analytics store](/img/system-design/url-shortener/07-analytics.png)](/img/system-design/url-shortener/07-analytics.png)

*Select the diagram to zoom in and move around.*

How it fits together:

- **The event:** code, timestamp, country (looked up from the IP address), referrer, device type. Store the country,
  not the raw IP: it is all the dashboard needs and it avoids keeping personal data we do not need.
- **The queue** (for example Kafka, a durable, replayable log of messages) absorbs bursts. Keying by code keeps one
  link's events in order on one partition.
- **The stream aggregator** counts in memory, for example "link `kYJb`, 14:05, India: 312 clicks", and writes one
  row per minute instead of one per click. That turns 3,900 writes per second into a few hundred.
- **The analytics store** is a column-oriented database built for adding up large tables (ClickHouse, Druid,
  BigQuery and similar). The stats API reads it.
- **Raw events go to cheap object storage** as well. If we find a bug in the counting logic, we can replay history
  and recompute.
- **Nightly batch jobs** do the expensive work: filtering bots and crawlers (link previews in chat apps open every
  link once), and counting **unique visitors**. For uniques at scale, a **HyperLogLog** sketch estimates the number
  of distinct visitors within about 1% using a few kilobytes per link, instead of storing every visitor ID.

Counts are therefore **eventually consistent**: the dashboard is a minute or so behind, and the next morning's
batch may correct it slightly. That is a perfectly good trade for keeping redirects fast.

## 13. Deep dive: custom aliases and expiry

### Custom aliases

A user asks for `sho.rt/autumn-sale`.

- **Validate it:** allowed characters only (letters, digits, `-`), a length limit (say 4 to 30), not a reserved word
  (`api`, `login`, `admin`), and not offensive or impersonating a brand.
- **Claim it atomically** with the same "insert if absent". If two users ask for `autumn-sale` at the same moment,
  exactly one insert succeeds and the other gets `409 Conflict`. Never "check, then insert" in two steps: another
  request can slip in between.
- **Aliases and generated codes share one namespace.** A user could pick `kYJc`, a code our counter will reach one
  day. When that happens, the generated insert fails, and the create server simply takes the next ID. Some services
  avoid the clash entirely by requiring aliases to be longer than generated codes, or to contain a `-`.

### Expiry

- **Check at read time.** The redirect service compares `expires_at` with the current time on every request,
  whether the row came from the cache or the database, and answers `410 Gone` when it has passed. This is called
  **lazy expiry**: it is always correct, even before any clean-up has run.
- **Clean up in the background.** A sweeper job, or the database's own TTL feature where it has one, deletes expired
  rows after a grace period, so the owner can still see stats and renew for a while.
- **Never reuse a code.** An expired code may still be printed on posters or saved in old emails. If we gave it to a
  new link, those old copies would silently lead somewhere else, possibly to a scam. With 3.5 trillion codes there
  is no shortage, so retired codes stay retired.

## 14. Deep dive: abuse, spam and malicious links

Short links hide their destination, which makes them attractive for phishing and malware. If our domain gets a bad
reputation, email providers and browsers start blocking **every** `sho.rt` link, including all the honest ones.
Defence is layered:

- **Check at creation.** Compare the destination's domain and URL against blocklists and threat-intelligence feeds
  (for example Google Safe Browsing, which offers a public lookup API), and against our own list of domains taken
  down before.
- **Limit who can create how much.** Strict rate limits for anonymous users, a CAPTCHA after suspicious patterns,
  higher limits for verified accounts and paying API customers.
- **Re-check later.** A page can be harmless when shortened and malicious a week later. Periodically re-scan
  destinations, prioritising links whose click rate suddenly jumps.
- **Act fast.** A "report this link" button, plus signals from the analytics stream (a brand-new link with an
  enormous click rate from email referrers is suspicious). Disabling a link sets `status = disabled` and deletes the
  cache entry, so it takes effect on the next click. This is another reason to prefer 302: a cached 301 cannot be
  taken back.
- **Warn instead of redirect.** A disabled or suspicious link shows a warning page instead of redirecting.
- **Refuse redirect chains.** Do not shorten links to other shorteners or to ourselves; chains hide the real
  destination and can create loops.

Putting expiry and abuse together, every link moves through a small set of states:

[![Life of a short link: Requested becomes Active when the URL is safe or Rejected when it is on a blocklist; Active becomes Expired when expires_at passes, Disabled when abuse is confirmed (and back to Active if an appeal is accepted), or Purged when the owner deletes it; Expired becomes Purged when the grace period ends](/img/system-design/url-shortener/08-link-lifecycle.png)](/img/system-design/url-shortener/08-link-lifecycle.png)

*Select the diagram to zoom in and move around.*

## 15. Reliability: keeping every link working

| Risk | Defence |
| --- | --- |
| A redirect server dies | Servers are stateless; the load balancer stops sending them traffic within seconds |
| A cache node dies | Its keys are re-read from the database and re-cached; the database is sized to absorb this |
| A database primary dies | Replicas in other zones; one is promoted. Redirects keep working from replicas meanwhile; only creates pause briefly |
| A whole region fails | Replicate the mapping table to a second region and send redirect traffic there with DNS or anycast. Redirects need only read access, so they can run on a read-only copy |
| The key service is down | Create servers keep using the ranges they hold; ranges last hours |
| A create request is retried | `Idempotency-Key` returns the first result instead of a second link |
| A bad deploy corrupts mappings | Rows are never edited in place except status and expiry; keep backups and point-in-time recovery for the mapping table |
| The analytics pipeline falls behind | Nothing user-facing breaks: the queue buffers, counts catch up later |

The most important property: **the redirect path depends only on the cache and a read replica of the database.**
Creates, analytics, the key service and the safety checks can all be down and existing links still work.

## 16. What breaks as it grows, and how to fix it

**The viral link.** One link gets a large share of all traffic and overloads one cache node. *Fix:* in-process
caches on each redirect server with a short TTL, replication of hot keys, and optionally CDN caching for links whose
owners do not need per-click analytics.

**The counter ceiling.** At much higher create rates, seven characters run out sooner. *Fix:* nothing dramatic;
move to eight characters (218 trillion codes). Old seven-character codes keep working because codes are just
strings.

**The scanner.** Bots try millions of random codes to find private links. *Fix:* unguessable codes (scrambled IDs or
random keys), per-IP rate limits on `404` responses, and negative caching so the guesses never reach the database.

**The spam wave.** A campaign creates thousands of links an hour. *Fix:* creation rate limits, reputation scoring
of accounts and IPs, re-scanning, and bulk takedown of every link pointing to a reported domain.

**The analytics bill.** Raw events grow by terabytes a month. *Fix:* pre-aggregate per minute, keep raw events in
cheap object storage for a limited time (for example 90 days), and keep only daily rollups after that.

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Code generation | Hash and truncate | Counter with ID ranges (or KGS) | **ID ranges**, scrambled: no collisions, almost no coordination |
| Code length | 6 characters | 7 characters | **7**: 3.5 trillion codes, about 300× headroom over 10 years |
| Redirect status | 301 permanent | 302 temporary | **302**: every click is counted and links can be expired or taken down instantly |
| Same URL twice | Return the same code | New code each time | **New code**: separate owners, expiry and stats; idempotency key for retries |
| Database | Sharded SQL | Key-value store | **Either**; key-value fits the single-lookup access pattern naturally |
| Shard key | Range of codes | Hash of code | **Hash**: spreads sequential codes evenly, no hot shard |
| Analytics | Update a counter on each click | Event stream, aggregated | **Stream**: keeps the redirect path fast; counts lag by a minute |
| Expiry | Delete exactly on time | Check at read time, sweep later | **Lazy check + sweeper**: always correct, cheap to run |

## Cheat sheet for last-minute revision

- **Core:** a dictionary from short code to long URL. Reads beat writes about 100 : 1, so the redirect path is a
  separate, heavily cached service.
- **Numbers:** 100M links a month (~40/s), 10B redirects a month (~3,900/s, ~20K/s peak), 12B links in 10 years,
  ~6 TB, 7 base62 characters = 3.5 trillion codes.
- **Code generation:** hash + truncate clashes (~1 in 300 at our scale) and needs retries; a **counter with ID
  ranges** from a key service never clashes; a **KGS** hands out pre-made random codes. Scramble counter IDs so codes
  are not guessable. Always "insert if absent".
- **301 vs 302:** 301 is cached by browsers (less load, lost analytics, cannot undo); 302 sends every click to us
  (analytics, expiry, takedowns). A shortener with analytics and takedowns prefers 302.
- **Cache:** cache-aside, LRU, TTL capped at expiry, delete on change, negative caching for unknown codes,
  in-process cache for viral links.
- **Data:** `urls(code PK, long_url, user_id, is_custom, status, created_at, expires_at)`, sharded by **hash of
  code**; `user_links` by `user_id` for "my links".
- **Custom aliases:** validate, reserve words, claim with an atomic conditional insert, `409` on conflict.
- **Expiry:** check at read time (`410 Gone`), sweep later, **never reuse codes**.
- **Abuse:** blocklists at creation, rate limits, re-scans, report button, instant disable through 302 + cache
  delete, warning pages.
- **Analytics:** fire-and-forget event → Kafka → per-minute aggregation → column store; raw events to object
  storage; HyperLogLog for uniques; eventually consistent.

## Practice questions

1. **How would you let owners change where a short link points?** Update `long_url` in the database and delete the
   cache entry. This only works reliably because we send 302: browsers that cached a 301 would keep going to the old
   destination.
2. **Two users request the custom alias `launch` at the same moment. What happens?** Both try "insert if absent"
   on the same primary key; the database lets exactly one succeed. The other gets `409 Conflict` and picks another
   alias.
3. **How would you serve redirects with low latency worldwide?** Run redirect servers and cache replicas in several
   regions, replicate the mapping table to each (reads only), and route users to the nearest region with DNS or
   anycast. New links take a moment to replicate, so on a miss for a very new code, fall back to the home region.
4. **How would you show "unique visitors" per link without storing every visitor?** Keep a HyperLogLog sketch per
   link per day, built from a hashed visitor identifier. Sketches can be merged to answer "uniques this week".
5. **Your database shows heavy load from `404` lookups. What is going on and what do you do?** Probably a scanner
   guessing codes. Cache negative results for a short time, rate-limit IPs that produce many `404`s, and make codes
   unguessable so scanning is pointless.
