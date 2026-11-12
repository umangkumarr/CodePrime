---
title: "Design a Distributed Cache (like Memcached / Redis Cluster)"
description: "Design a distributed cache like Redis Cluster: caching patterns, LRU and TTL eviction, consistent hashing, replication, hot keys and cache stampedes."
difficulty: "Easy"
sidebar:
  label: "Distributed cache (like Redis)"
tags: ["Caching", "Consistent hashing", "Replication", "Consistency"]
---

Almost every fast website you use is fast because of a cache. When you open a profile, a product page or a
news feed, the data usually comes from a **cache**: a store that keeps a copy of popular data in memory (RAM), so
it can be returned in well under a millisecond instead of asking a database that might take 10 or 50. Memcached
and Redis are the two famous examples; most large companies run fleets of them.

A **distributed cache** spreads that memory across many machines, so it can hold far more than one server's RAM
and serve millions of requests per second. The core idea fits in one sentence, **a giant hash table split across
servers**, which is why it is a popular interview question. The interesting parts are around it: what to cache,
how to keep the copy in step with the database, what to throw away when memory is full, how to find the right
server for a key, and what happens when a server dies or one key gets a million requests a second.

This case study builds the cache from first principles, then digs into the questions interviewers push on.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Caching in 5 minutes: why caches exist

A cache works for the same reason you keep a pen on your desk instead of in a cupboard in the basement: things
you use often should be close at hand. Computers have the same layers of "near and small" versus "far and big".
Rough, order-of-magnitude numbers:

| Where the data is | Typical time to read it | Analogy |
| --- | --- | --- |
| The server's own RAM | about 0.1 microseconds | The pen on your desk |
| Another machine's RAM, over the data-centre network | about 0.2 to 1 millisecond (one round trip) | A colleague's desk across the office |
| A database answering a simple indexed query | about 1 to 10 milliseconds | The filing room down the corridor |
| A database running a join, an aggregation or a busy disk | 10 to 100+ milliseconds | The archive in the basement |

So a cache does two jobs:

1. **It makes reads fast.** A cache hit costs about a millisecond; the database it replaces may cost ten times more.
2. **It protects the database.** If 95% of reads are answered by the cache, the database sees only 5% of the
   traffic. Databases are expensive to scale; RAM in front of them is cheap by comparison.

A few terms we will use throughout:

| Term | Meaning |
| --- | --- |
| **Key / value** | The cache is a dictionary. The key is a string like `user:42`; the value is bytes (often JSON or a serialised object). |
| **Hit / miss** | A *hit* means the key was in the cache. A *miss* means it was not, so we must ask the database. |
| **Hit ratio** | Hits ÷ all lookups. The single most important number for a cache. |
| **TTL** (time to live) | How long a key may stay before it expires automatically, for example 10 minutes. |
| **Eviction** | Throwing a key out to make room when memory is full. |
| **Source of truth** | The database. The cache only holds copies; losing the cache must never lose data. |
| **Stale** | A cached value that no longer matches the database. |

### What is worth caching?

Data that is **read often, changes rarely, and is expensive to compute or fetch**. Good examples: user profiles,
product details, configuration, session data, rendered page fragments, the result of a slow query ("top 50 posts
today"), and counters such as like counts. Poor candidates: data read once (a one-off report), data that must be
exactly current on every read (a bank balance at the moment of payment), and huge objects that would push
everything else out.

### Why the hit ratio matters so much

Suppose a cache hit takes 1 ms and a miss costs 1 ms (the failed lookup) plus 20 ms (the database).

- At a **95%** hit ratio the average read takes $1 + 0.05 \times 20 = 2$ ms, and with 1 million reads per second
  the database receives $1{,}000{,}000 \times 0.05 = 50{,}000$ queries per second.
- At **99%** the average is $1 + 0.01 \times 20 = 1.2$ ms, and the database receives only **10,000** per second.

Going from 95% to 99% looks like a small change, but it cuts database load by **five times**. That is why much of
this design is about keeping the hit ratio high, even while servers fail and keys expire.

## 2. Requirements

### Functional (what clients can do)

- **`get(key)`** returns the value, or "not found".
- **`set(key, value, ttl)`** stores a value, optionally with an expiry time.
- **`delete(key)`** removes a key (used to invalidate it when the database changes).
- **Batch reads** (`mget`) so a page that needs 40 keys makes one round trip, not 40.
- **Atomic helpers**: `add` (set only if absent), `incr` (increment a counter), and compare-and-set. We will need
  these for locks and counters.
- **Automatic eviction** when memory is full, and **automatic expiry** after the TTL.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Latency** | p99 (99th percentile) under 1–2 ms inside the data centre | A page may make dozens of cache calls; each must be tiny |
| **Throughput** | Millions of operations per second across the cluster | Caches sit on the hottest path of the product |
| **Scalability** | Add servers to add memory and throughput, with little disruption | The data set and traffic keep growing |
| **Availability** | Losing a server must not take the site down | A dead cache sends its whole load to the database at once |
| **Consistency** | Eventual: a cached value may be stale for a short, bounded time | Strong consistency would cost the speed that is the point of a cache |
| **Durability** | Not required | The database is the source of truth; the cache can be rebuilt |

The last two rows are the most important design choice. Because the cache is **allowed to lose data and briefly
be stale**, it can keep everything in RAM, replicate asynchronously and stay simple and fast.

### Out of scope

Using Redis as a primary database (with persistence to disk), message queues and pub/sub, multi-region active-active
replication, and browser or CDN caching (see the [CDN case study](/system-design/case-studies/easy/cdn/)). Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** a large social app. **1 million** cache reads per second at peak and **100,000** writes or
deletes per second. **500 million** distinct keys are worth caching, with values averaging **1 KB**. Usable RAM
per cache server: **64 GB**. One cache server handles roughly **100,000 to a few hundred thousand** simple
operations per second (a reasonable planning figure for Redis or Memcached on modern hardware, not a promise).

**Memory**

- Raw data: $500\text{M} \times 1\text{ KB} = 500\text{ GB}$.
- Per-key overhead (the key string, hash-table entry, pointers for eviction, expiry time, allocator waste) adds
  roughly 20–50% for 1 KB values, more for tiny ones. Plan for about **700 GB**.
- Servers for memory alone: $700 \div 64 \approx 11$. Round up for headroom (never run a cache at 100% of RAM):
  **16 primary shards**.

**Throughput**

- Reads per shard: $1{,}000{,}000 \div 16 \approx 62{,}500$ per second. Comfortable, with room for one hot shard.
- Network: $1{,}000{,}000 \times 1\text{ KB} = 1\text{ GB/s}$ for the whole cluster, about **60 MB/s per shard**.
  Easy for a 10 Gbit/s card, unless one key is very hot (section 10).

**Replicas:** one replica per shard so a crash does not empty a shard, giving **32 servers** in total.

Three conclusions:

1. **Memory, not CPU, usually decides the number of servers.** Throughput is rarely the bottleneck until a single
   key gets hot.
2. **One server cannot hold the data**, so we must split keys across servers (sharding, section 8).
3. **The hit ratio decides the database's size.** At 1 million reads per second, every 1% of misses is 10,000
   database queries per second.

## 4. The API

Caches speak a small, fast protocol over TCP (Memcached's text or binary protocol, Redis's RESP), not JSON over
HTTP: the parsing cost of HTTP would be larger than the work itself. The operations:

| Operation | What it does |
| --- | --- |
| `GET key` | Return the value or "not found". Updates the key's "recently used" information. |
| `MGET k1 k2 …` | Many keys in one round trip. |
| `SET key value EX 600` | Store with a TTL of 600 seconds. Overwrites any existing value. |
| `SET key value NX EX 10` | Store **only if the key does not exist** (`NX`). The building block for locks (section 11). |
| `DEL key` | Remove a key. Deleting a missing key is fine, so deletes can be retried safely. |
| `INCR key` | Atomically add 1 and return the new value. Good for counters and rate limits. |
| `CAS key value token` | Compare-and-set: write only if the key has not changed since you read it (Memcached `gets` / `cas`). |

The caller is an **application server**, not an end user. A **cache client library** inside each app server hides
the cluster: it hashes the key, picks the right server, keeps a pool of open connections, applies timeouts of a few
milliseconds, and treats a timeout as a miss so a slow cache never makes the page slower than having no cache.

## 5. High-level design

[![High-level architecture: users call app servers, whose cache client uses a shard map to send get and set to shard A, B or C primaries; on a miss the app reads the database; each primary replicates asynchronously to a replica; a cluster manager sends heartbeats to the shards and publishes the shard map to the app servers](/img/system-design/distributed-cache/01-architecture.png)](/img/system-design/distributed-cache/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **App servers with a cache client:** the only callers. The client decides which shard owns each key.
- **Shards (primaries):** each one holds a slice of the keys in an in-memory hash table and answers reads and writes
  for that slice. Each shard is independent; they do not talk to each other for normal requests.
- **Replicas:** a copy of a primary, updated asynchronously, ready to take over if the primary dies.
- **Cluster manager:** watches which servers are alive, decides failovers and publishes the **shard map** (which
  server owns which keys). It can be a separate service (like Redis Sentinel, or a configuration store such as
  ZooKeeper or etcd) or a protocol the nodes run among themselves (Redis Cluster uses gossip).
- **Database:** the source of truth. The cache sits beside it, not in front of every write.

The most useful idea in this design: **every shard is a simple, independent, single-machine cache**. All the
"distributed" parts (who owns which key, failover) live in the client and the cluster manager. That is why the
system scales almost linearly: adding a shard adds memory and throughput without adding coordination to each request.

## 6. Caching patterns: who talks to the database?

There are four classic ways to combine a cache with a database. Interviewers expect you to name them and say when
each fits.

### Cache-aside (lazy loading): the default

The **application** manages the cache. The cache itself knows nothing about the database.

[![Cache-aside: on a hit the app gets the value from the cache in about 1 ms; on a miss it gets a miss, selects the row from the database and sets it in the cache with a 10 minute TTL; on a write it updates the database and then deletes the cache key](/img/system-design/distributed-cache/02-cache-aside.png)](/img/system-design/distributed-cache/02-cache-aside.png)

- **Read:** try the cache; on a miss, read the database and put the result in the cache with a TTL.
- **Write:** update the database, then **delete** the cache key. The next read reloads the fresh value.

Why delete instead of overwriting the cache with the new value? Two writers can race: writer 1 sets the database to
A, writer 2 sets it to B, but their cache updates arrive in the opposite order and the cache ends up holding A
forever. A delete has no order to get wrong; the worst case is one extra miss. Deleting is also cheaper when the
cached value is expensive to build (a whole rendered profile) and might never be read again.

Cache-aside is the most common pattern because it is simple, only caches what is actually read, and keeps working
if the cache is down (every read becomes a miss). Its costs: the first read of each key is slow, and there is a
small window for stale data, which section 12 deals with.

### Read-through

Like cache-aside, but the **cache layer** loads from the database on a miss, using a loader function you give it.
The application only ever talks to the cache. Libraries such as Caffeine, or caching proxies, work this way. The
logic is the same; it just lives in one place instead of being repeated in every service.

### Write-through and write-behind

[![Write-through: the app sets cart 7 in the cache layer, which writes the row to the database now, waits for the commit and only then replies OK. Write-behind: the cache replies OK at once and flushes a batch of dirty keys to the database later, which is lost if the cache node dies first](/img/system-design/distributed-cache/03-write-patterns.png)](/img/system-design/distributed-cache/03-write-patterns.png)

- **Write-through:** every write goes to the cache layer, which writes the database **synchronously** before
  answering. The cache is never stale for keys written this way, but every write pays both latencies, and the
  cache fills with data that may never be read.
- **Write-behind (write-back):** the cache answers immediately and writes to the database **later**, in batches.
  Writes are very fast and the database sees fewer, larger writes, but a crashed cache node **loses** every write it
  had not flushed. Use it only when losing a few seconds of writes is acceptable, such as view counters or
  analytics, never for orders or payments.

| Pattern | Who loads the cache | Write path | Stale risk | Data-loss risk | Good for |
| --- | --- | --- | --- | --- | --- |
| **Cache-aside** | Application, on a miss | DB, then delete key | Small window | None | Most read-heavy data (the default) |
| **Read-through** | Cache layer, on a miss | Usually DB, then delete key | Small window | None | Same, with the logic centralised |
| **Write-through** | Cache layer, on every write | Cache and DB together | Very low | None | Data read right after it is written |
| **Write-behind** | Cache layer | Cache now, DB later | Low | **Yes**, unflushed writes | Counters, metrics, high write rates |

In an interview, choose **cache-aside with delete-on-write and a TTL** unless the question pushes you elsewhere,
and say why.

## 7. Inside one server: eviction and expiry

Memory is finite. When it is full and a new key arrives, something must go. An **eviction policy** decides what.

| Policy | Throws out | Strength | Weakness |
| --- | --- | --- | --- |
| **LRU** (least recently used) | The key not touched for the longest time | Simple, matches "recent things get reused" | One big scan of old keys can flush out the popular ones |
| **LFU** (least frequently used) | The key used the fewest times | Keeps steady favourites through a scan | Needs counters that decay, or yesterday's star never leaves |
| **TTL-based** | Keys whose expiry time has passed (or the nearest to expiring) | Bounds staleness | Not a full policy by itself: a full cache of unexpired keys still needs LRU or LFU |
| **Random** | Any key | Almost free | Sometimes throws out a hot key |
| **No eviction** | Nothing: new writes fail | Predictable | Only for data that must not silently vanish |

TTL and eviction answer different questions. **TTL** answers "how stale may this be?"; **eviction** answers "what do
we drop when we run out of room?". Real caches use both: Redis, for example, lets you choose policies such as
`allkeys-lru`, `allkeys-lfu` or `volatile-ttl`.

### How expiry is done cheaply

Checking every key's clock every second would be far too expensive with hundreds of millions of keys. Instead, two
lazy tricks work together (Redis does both):

- **On access:** when a key is read, check its expiry time; if it has passed, delete it and report a miss.
- **In the background:** a few times a second, sample a small random set of keys that have a TTL and delete the
  expired ones. If many in the sample had expired, sample again straight away.

Expired keys that nobody touches therefore linger briefly, but they are cleaned up steadily without long pauses.

### How LRU works in O(1)

This is a favourite interview question in its own right (LeetCode 146, "LRU Cache"). We need three operations,
each in constant time: find a key, mark it as just used, and remove the least recently used key. No single data
structure does all three, but two together do:

- A **hash map** from key to node gives O(1) lookup.
- A **doubly linked list** keeps keys in order of use: most recent at the **head**, least recent at the **tail**.
  Because each node knows both its neighbours, it can be unlinked from the middle in O(1).

[![LRU cache: a hash map points from keys user:3, user:1 and user:7 to nodes of a doubly linked list ordered from the head, most recently used, to the tail, where keys are evicted](/img/system-design/distributed-cache/04-lru.png)](/img/system-design/distributed-cache/04-lru.png)

*Select the diagram to zoom in and move around.*

The arrows between list nodes stand for a pair of pointers, `next` and `prev`. The head and tail are dummy nodes,
so inserting and removing never need special cases for an empty list.

```text
get(key):
    node = map.get(key)           # O(1)
    if node is none: return MISS
    unlink(node); push_front(node)  # mark as most recently used, O(1)
    return node.value

set(key, value):
    if key in map: update value; unlink + push_front; return
    if size == capacity:
        lru = tail.prev           # least recently used
        unlink(lru); map.remove(lru.key)
    node = new Node(key, value); push_front(node); map.put(key, node)
```

Real caches cut corners to save memory and locking. Redis does not keep a full list at all: it stores a small
"last used" clock in each key, samples a handful of keys (five by default) and evicts the oldest of the sample.
This **approximate LRU** is close to exact LRU in practice and costs no extra pointers. Memcached keeps LRU lists
per **slab class** (section 13). Redis's LFU mode stores a tiny counter per key that grows logarithmically and
decays over time, so old popularity fades.

## 8. Sharding: which server holds a key?

With 16 shards, every client must agree, for any key, which shard owns it, and they must agree without asking a
central server on every request.

### The obvious idea, and why it fails

`shard = hash(key) mod N`. It spreads keys evenly and is trivial to compute. The problem appears when N changes.
Go from 4 shards to 5, and a key stays on the same shard only if `hash mod 4` equals `hash mod 5`, which is true for
only about 1 key in 5. **About 80% of keys move**: almost every lookup misses at once, and the full read traffic
lands on the database. In general, going from N to N+1 moves about $\frac{N}{N+1}$ of all keys. Adding capacity
would cause an outage.

### Consistent hashing

Picture the hash space, say every number from 0 to about 4.3 billion ($2^{32}$), bent into a **ring**. Each server
is hashed to a position on the ring. To find a key's owner, hash the key and **walk clockwise until you meet a
server**.

[![Consistent hashing ring: server A at position 0, key user:42 at 0.9 billion is stored on server B at 1.4 billion, key feed:5 at 2.6 billion is stored on server C at 3.0 billion, and key cart:9 at 3.9 billion wraps past the top to server A](/img/system-design/distributed-cache/05-hash-ring.png)](/img/system-design/distributed-cache/05-hash-ring.png)

*Select the diagram to zoom in and move around.*

Now add server D at position 2.0 billion. Only the keys between B (1.4 billion) and D (2.0 billion), which used to
walk on to C, now stop at D. Every other key keeps its owner. **Adding or removing one of N servers moves only about
1/N of the keys**, and only to or from the server that changed.

Two refinements make it work in practice:

- **Virtual nodes.** With only a few points on the ring, the gaps between servers are uneven, so one server might
  own 40% of the ring. Instead, each server is placed at many points (for example 100 to 200, by hashing
  `"A#1"`, `"A#2"`, …). The many small arcs average out to an even share, and when a server leaves, its load is
  spread across all the others instead of dumped on its single neighbour. A bigger machine can simply get more
  virtual nodes.
- **Hash slots, a simpler cousin.** Redis Cluster uses a fixed set of **16,384 slots**: `slot = CRC16(key) mod
  16384`, and a table assigns slots to servers. The number of slots never changes, so keys never move by accident;
  rebalancing means moving whole slots from one server to another on purpose. Keys that must live together (for
  a multi-key operation) can share a slot with a **hash tag**: only the part in braces is hashed, so
  `{user:42}:profile` and `{user:42}:cart` land on the same server.

### Where does the routing happen?

| Approach | How it works | Pros | Cons | Example |
| --- | --- | --- | --- | --- |
| **Client-side** | The client library holds the ring and talks to servers directly | No extra hop, nothing in the middle to fail | Every client, in every language, must have the same ring and update it together | Memcached clients with consistent hashing (the "ketama" style) |
| **Proxy** | Clients talk to a proxy, which routes to the right server | Clients stay simple; one place to add pooling, retries, metrics | An extra network hop; the proxies themselves must scale and stay up | Twemproxy, mcrouter |
| **Cluster-aware servers** | Any server can be asked; a wrong one answers "this key lives on server X" | No proxy, and the servers own the map | Clients must understand redirects and cache the map | Redis Cluster (`MOVED` redirects) |

A good interview answer: start with a **smart client** (fewest hops), and mention a proxy when many services in
many languages share the cache.

## 9. Replication and failover

A cache server will crash, be rebooted for patches, or lose its network. If its shard simply vanishes, all its keys
miss at once; one shard's share of a million reads per second lands on the database. Replication keeps a warm copy
ready.

- Each shard has a **primary**, which takes all writes, and one or more **replicas**, which receive a stream of the
  primary's writes.
- Replication is **asynchronous**: the primary answers the client first and ships the write afterwards. Waiting for
  the replica would double write latency, and for a cache it is fine to lose the last few writes.
- Replicas can also serve reads to spread load, at the cost of slightly older values.

[![Failover: the app sets k on the shard B primary, which replies OK and then replicates k asynchronously to the replica; a crash before that loses the write. When the primary stops answering heartbeats, the cluster manager marks it down, promotes the replica, publishes a new shard map, and the app reads k from the new primary](/img/system-design/distributed-cache/06-failover.png)](/img/system-design/distributed-cache/06-failover.png)

*Select the diagram to zoom in and move around.*

How failover works:

1. **Detect.** The cluster manager (or the other nodes, by gossip) sends **heartbeats**. A primary that misses them
   for a timeout, often a few seconds, is suspected down.
2. **Agree.** One observer might simply have a bad network link, so a **majority** of observers must agree before
   acting (Redis Sentinel uses a quorum of sentinels; Redis Cluster uses a majority of primaries). This guards
   against promoting a replica while the old primary is still alive and taking writes, a situation called
   **split brain**.
3. **Promote** the most up-to-date replica to primary.
4. **Tell the clients.** The new shard map is published; clients that still call the old address get an error or a
   redirect and refresh their map.

Choosing the timeout is a real trade-off. Too short, and a garbage-collection pause or a brief network blip causes
needless failovers. Too long, and the shard is unavailable for longer.

What if there is no replica (classic Memcached has no built-in replication)? Two common answers. Send the dead
server's traffic to a small, separate **standby pool** with short TTLs, so its keys are rebuilt there instead of all
hitting the database (Facebook described this as a "gutter" pool in its 2013 Memcache paper). Or let consistent
hashing remap the keys to the neighbouring servers and accept a burst of misses, protected by the stampede defences
in section 11.

## 10. Hot keys

Sharding assumes load is spread across many keys. Sometimes it is not: a celebrity's post, the home page feed, a
flash sale's product. One key can receive hundreds of thousands of reads per second, and all of them land on **one
shard**, which saturates its CPU or network card while the other 15 shards are idle. Adding shards does not help,
because the key still lives in one place.

Defences, from simplest to strongest:

- **A small local cache in each app server (an "L1" cache).** Keep the hottest few thousand keys in the app server's
  own memory for a second or two. With 500 app servers, each asks the shard for `home:feed` at most once every couple
  of seconds, a few hundred requests per second instead of hundreds of thousands. The cost is a couple of seconds of
  extra staleness.
- **Replicate the hot key across shards.** Store copies under several keys, `home:feed#0` to `home:feed#3`, which
  hash to different shards. Each read picks a copy at random; a write or delete updates every copy.
- **Read from replicas** for that shard, so its replicas share the load.

[![Spreading one hot key: millions of readers hit app servers that answer most reads from a local L1 copy with a 2 second TTL; on an L1 miss each picks one of four copies, home:feed#0 to #3, stored on shards A to D](/img/system-design/distributed-cache/07-hot-key.png)](/img/system-design/distributed-cache/07-hot-key.png)

*Select the diagram to zoom in and move around.*

(The diagram shows each app server using two copies for clarity; in practice any app server can pick any copy.)

**Finding hot keys** matters as much as fixing them. Clients or servers sample requests and count the most frequent
keys (a top-K count over a sliding window, for example with a count-min sketch), then promote the winners to the
local cache or to multiple copies automatically. Some keys are predictable (a planned sale, a scheduled live
event) and can be warmed and spread in advance.

A related problem is the **big key**: one value of many megabytes, such as a list with a million entries. Reading it
blocks the server and floods the network. Split it into pieces (`followers:42:page:1`, `…:page:2`) or store it
somewhere else.

## 11. Thundering herd: the cache stampede

A popular key expires. In the next few milliseconds, hundreds of requests miss on it **at the same time**, and every
one of them runs the same expensive database query and writes the same value back. The database, which normally sees
almost no traffic for this key, suddenly receives hundreds of identical heavy queries and may fall over, which makes
the queries slower, which makes even more requests pile up. This is a **cache stampede** (or thundering herd, or dog-pile).

The same thing happens on a larger scale when a cache server restarts empty (a **cold cache**), or when many keys
were written at the same moment with the same TTL and therefore expire together.

### Defence 1: request coalescing (only one rebuilds)

Let only one caller rebuild a missing key; everyone else waits for its result.

- **Inside one app server**, concurrent misses for the same key share a single in-flight database call (often called
  "single flight").
- **Across many app servers**, use a short-lived lock in the cache itself:

[![Stopping a stampede with a rebuild lock: servers A and B both miss on home:feed; A wins SET lock NX with a 10 second expiry, B is told the lock is taken and waits 50 ms; A runs one expensive query, sets home:feed and deletes the lock; B retries and gets a hit](/img/system-design/distributed-cache/08-stampede.png)](/img/system-design/distributed-cache/08-stampede.png)

*Select the diagram to zoom in and move around.*

`SET lock:home:feed <id> NX EX 10` succeeds for exactly one caller, because `NX` means "only if absent". The lock has
its own expiry, so if the winner crashes, the lock frees itself after 10 seconds instead of blocking forever. Losers
wait briefly and retry, or are served a slightly old value if one is kept (next defence). When the winner
releases the lock, it deletes it only if it still holds its own `<id>` (checked atomically, for example with a
small Lua script): if its rebuild ran past the 10 seconds, the lock may now belong to someone else. Facebook's Memcache paper
describes a similar idea called **leases**.

### Defence 2: jittered TTLs

If a million keys are loaded at 09:00 with a TTL of exactly one hour, they all expire at 10:00. Add a random
**jitter**: `ttl = 3600 + random(0, 300)` seconds. Expiries spread over five minutes instead of one instant.

### Defence 3: refresh before expiry

Do not wait for a hot key to expire at all.

- **Soft and hard expiry (stale-while-revalidate):** store the value with a "refresh after" time earlier than its real
  TTL. A reader that sees a value past its refresh time still returns it immediately, and triggers one background
  refresh (protected by the lock above). Users never wait, and the key is rarely missing.
- **Probabilistic early refresh:** each reader, as the expiry approaches, refreshes early with a small probability
  that grows as the deadline nears. With many readers, one of them almost certainly refreshes a little early, and
  only one usually does. A well-known form is the "XFetch" algorithm.
- **Background warm-up:** a job refreshes known hot keys on a schedule, and a new or restarted server is warmed (for
  example by replaying recent popular keys) before it takes full traffic.

## 12. Cache invalidation and consistency with the database

There are two copies of every cached value: the database's and the cache's. Any time the database changes, the cache
copy may be wrong. Keeping them in step is famously one of the hard problems in computing.

### The basic rule

With cache-aside: **write the database first, then delete the cache key**, and always set a TTL. Why this order?

- **Delete first, then write the database:** between the two steps, a reader can miss, read the *old* row and put it
  back in the cache. The cache is now stale until the TTL ends.
- **Write the database first, then delete:** much safer. But there is still one rare race.

### The rare race that still happens

[![How a stale value sneaks into the cache: a reader misses on price:9, reads the old price 100 from the database and stalls; a writer updates the price to 120 and deletes price:9; the reader then sets price:9 to 100, so the cache says 100 while the database says 120 until the TTL ends](/img/system-design/distributed-cache/09-stale-race.png)](/img/system-design/distributed-cache/09-stale-race.png)

*Select the diagram to zoom in and move around.*

The reader read the old value **before** the write, but put it in the cache **after** the delete. It needs bad
timing (the reader must stall between steps 4 and 7), so it is rare, but at millions of requests per second rare
things happen daily.

### Ways to close the gap

- **Always set a TTL.** It is the safety net: whatever goes wrong, a stale value lives at most one TTL. Choose the TTL
  by asking "how stale may this be?": seconds for prices, hours for a country list.
- **Delayed double delete.** Delete the key after the write, then delete it **again** a short moment later (say one
  second), which removes a stale value that a slow reader put back in between.
- **Versioned or conditional sets.** Store a version (or the row's update time) with the value, and let the cache
  accept a set only if it is newer than what it holds. Leases (from Facebook's Memcache paper) do a similar job: a reader
  may only fill a key if no delete happened since its miss.
- **Invalidate from the database's change log.** Instead of trusting every service to remember to delete, a small
  service reads the database's change stream (for example MySQL's binlog, through a tool like Debezium) and deletes
  the affected keys. Nothing is forgotten, and deletes can be retried until they succeed. It is a little slower (tens
  to hundreds of milliseconds) but far more reliable.
- **Do not cache what must be exact.** For a payment, an inventory decrement or anything that needs the true value,
  read the database.

### Consistency in plain words

A cache gives **eventual consistency**: after a write, readers may briefly see the old value, and then everyone sees
the new one. Two stronger promises are often cheap to add where they matter:

- **Read-your-writes:** after a user changes their own profile, read it from the database (or skip the cache) for a
  few seconds, so they never see their own change "undone".
- **Bounded staleness:** guaranteed by the TTL.

## 13. Memory management basics

A cache is a memory product, so how memory is used decides its cost.

- **Fragmentation.** Values of different sizes are allocated and freed all day. Freed gaps may be too small to reuse,
  so the process can hold, say, 30 GB of RAM while storing 22 GB of data. Redis reports this as a fragmentation ratio
  and can defragment in the background.
- **Slab allocation (Memcached).** Memory is carved into pages, and each page is split into equal **chunks** of one
  size class (for example 96 bytes, 120 bytes, 152 bytes, each about 25% bigger than the last). A value goes into the
  smallest chunk that fits. This avoids fragmentation, but wastes the gap inside each chunk, and if traffic shifts
  from small values to large ones, memory can stay stuck in the wrong size classes. Newer versions move pages between
  classes automatically.
- **Per-key overhead.** Every key costs bookkeeping bytes (hash-table entry, pointers, expiry, the key string itself).
  For tiny values, this can exceed the value. Short keys (`u:42:p` rather than `user_profile_for_user_id_42`),
  compact encodings (Redis stores small hashes and lists in a packed form) and grouping many tiny fields into one hash
  all help.
- **Compression and serialisation.** Compress large values (they are usually text or JSON) and use a compact format.
  It trades a little CPU for a lot of RAM.
- **Headroom.** Set the cache's memory limit below the machine's RAM: the operating system, connection buffers,
  replication buffers and fragmentation all need room. If the machine starts swapping to disk, a 1 ms cache becomes a
  100 ms one.
- **Single-threaded versus multi-threaded.** Redis runs commands on one main thread (simple, no locks, but one slow
  command such as reading a huge key blocks everyone). Memcached is multi-threaded. Either way, scale out with more
  shards rather than bigger single servers.

## 14. What breaks as it grows, and how to fix it

**The cold start.** A new cluster, or a restart after a big outage, has an empty cache, so every read misses and the
database melts. *Fix:* warm the cache before sending full traffic (replay popular keys), ramp traffic up gradually, and
rate-limit database reloads.

**Resharding.** Adding shards moves keys. *Fix:* consistent hashing or hash slots so only a small fraction move, and move
them gradually (slot by slot) during quiet hours.

**The hot shard.** One shard is at 100% CPU while others idle. *Fix:* detect hot keys and spread them (section 10); split
big keys; move busy slots to a quieter server.

**Connection storms.** Thousands of app servers each opening connections to hundreds of cache servers is millions of
connections. *Fix:* connection pooling, a proxy layer that multiplexes many clients over few connections, or
fewer, larger cache servers.

**Cross-region traffic.** Calling a cache in another region costs tens of milliseconds, which defeats the point. *Fix:*
one cache cluster per region, each filled from its local database replica, with invalidations broadcast to all regions.

## 15. Reliability: failing safely

The guiding rule: **the cache may fail, but the product must not.** Every failure should degrade to "slower" rather than
"broken".

| Risk | Defence |
| --- | --- |
| A cache server crashes | Replica promoted (section 9); without one, keys remap or a standby pool absorbs them |
| The cache is slow or unreachable | Tight client timeouts (a few ms); treat a timeout as a miss; a **circuit breaker** stops calling a failing server for a while |
| Every request misses at once | Stampede protection: coalescing, locks, jittered TTLs, warm-up (section 11) |
| The database cannot take the miss traffic | **Rate-limit** reloads and serve stale values if kept; shed low-priority features before core pages |
| A cached value is stale or corrupt | TTL on every key, change-log invalidation, and a way to flush one key or one key prefix quickly |
| Split brain during failover | Majority agreement before promotion; clients follow the latest shard map |

## 16. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Caching pattern | Cache-aside | Write-through / write-behind | **Cache-aside**: simple, survives a cache outage, caches only what is read |
| On a write | Update the cache | Delete the key | **Delete**: no ordering races, never caches unread data |
| Eviction | LRU | LFU | **LRU** (approximate) by default; LFU when scans or one-off reads pollute the cache |
| Key placement | `hash mod N` | Consistent hashing / hash slots | **Consistent hashing or slots**: resizing moves about 1/N of keys, not nearly all |
| Routing | Smart client | Proxy | **Smart client** for fewest hops; proxy when many languages or huge connection counts |
| Replication | Synchronous | Asynchronous | **Asynchronous**: losing a few writes is fine for a cache; speed is not optional |
| Consistency | Strong | Eventual with TTL | **Eventual**, with read-your-writes where users would notice |
| Persistence | Write to disk | Memory only | **Memory only**: the database is the source of truth |

## Cheat sheet for last-minute revision

- **Why cache:** RAM over the network is about 1 ms or less; a database query is often 10 times slower or more. A cache makes reads fast
  and protects the database. **Hit ratio is everything**: 95% to 99% cuts database load five times.
- **Cache good data:** read often, changes rarely, expensive to compute. Never the only copy.
- **Patterns:** cache-aside (default: read, miss, load, set with TTL; write DB then **delete** key), read-through,
  write-through (sync, consistent, slower writes), write-behind (fast, can lose writes).
- **Eviction:** LRU, LFU, TTL, random. TTL bounds staleness; eviction frees memory. Expiry is lazy on access plus
  background sampling.
- **LRU in O(1):** hash map (key to node) + doubly linked list (head = most recent, tail = evict). Redis uses
  approximate LRU by sampling.
- **Sharding:** `hash mod N` moves about N/(N+1) of keys on resize. Consistent hashing moves about 1/N; use virtual
  nodes. Redis Cluster: 16,384 hash slots, hash tags `{…}` to co-locate keys.
- **Routing:** smart client (no extra hop), proxy (Twemproxy, mcrouter), or cluster redirects (Redis `MOVED`).
- **Replication:** primary plus replicas, asynchronous. Failover = heartbeats, majority agreement, promote, publish new
  map. Beware split brain.
- **Hot keys:** local L1 cache with a short TTL, copies `key#0..#n` on different shards, read replicas; detect with
  top-K sampling. Split big keys.
- **Stampede:** request coalescing / `SET NX` lock, jittered TTLs, stale-while-revalidate, probabilistic early refresh,
  warm-up.
- **Invalidation:** DB first then delete; TTL as safety net; delayed double delete; versioned sets or leases; change-log
  (binlog) driven invalidation.
- **Memory:** fragmentation, slab classes, per-key overhead, compression, headroom, never swap.
- **Numbers:** 500M keys × 1 KB ≈ 500 GB raw, ~700 GB with overhead, ~16 shards of 64 GB plus replicas; 1M reads/s is
  ~62K per shard.

## Practice questions

1. **Your cache hit ratio drops from 98% to 80% overnight. How do you investigate?** Check whether memory filled up
   (evictions rising), whether a deploy changed key names or the serialisation format (every old key now misses),
   whether TTLs were shortened, whether a shard failed or the cluster was resized, and whether traffic shifted to new,
   uncached data such as a new feature or a crawler.
2. **Design an LRU cache class with `get` and `put` in O(1).** Hash map plus doubly linked list with dummy head and tail,
   exactly as in section 7. Mention thread safety (a lock, or striped locks per bucket) if asked.
3. **How would you use the cache as a rate limiter (100 requests per minute per user)?** `INCR rate:<user>:<minute>` and
   set a 60-second TTL on the first increment; reject when the count passes 100. For smoother limits use a sliding
   window or a token bucket stored in the cache (see the
   [rate limiter case study](/system-design/case-studies/medium/rate-limiter/)).
4. **One shard is overloaded but the others are idle. What could be wrong?** A hot key, a big key, a poor hash spread
   (too few virtual nodes), or many related keys pinned together by the same hash tag. Find out with per-key sampling,
   then spread or split the key, or move slots.
5. **Your product team wants the cache to be "always consistent" with the database. What do you say?** True strong
   consistency would need the cache to take part in every database transaction, which costs the speed that is the
   reason for the cache. Offer instead: short TTLs, change-log invalidation, read-your-writes for the user who made the
   change, and reading critical values (balances, stock at checkout) straight from the database.
