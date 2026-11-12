---
title: "Design Autocomplete for a Search Engine (typeahead suggestions)"
description: "Design search autocomplete step by step: a trie with top-k cached at every node, an offline build from query logs, sharding, filtering and trending queries."
difficulty: "Easy"
sidebar:
  label: "Search autocomplete (typeahead)"
tags: ["Trie", "Caching", "Batch processing", "Sharding", "Latency"]
---

You type `ca` into a search box and, before you reach the third letter, a list appears: *car*, *cat*,
*cards against humanity*. That list is **autocomplete** (also called **typeahead** or **search
suggestions**). It saves typing, fixes spelling before it happens, and quietly teaches people what they can
search for.

It looks like a small feature, but it has an unusual shape. A search engine answers one request per search;
autocomplete answers one request per **keystroke**, so it receives several times more traffic than search itself,
and every answer must arrive before the user types the next letter. The trick that makes it possible is to do
almost all the work **ahead of time**, so that answering a keystroke is little more than a memory lookup.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Autocomplete in 5 minutes

A few terms we will use throughout:

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Prefix** | What the user has typed so far: `c`, `ca`, `car` | The first letters you remember of a word |
| **Suggestion** | A complete past query that starts with the prefix | A librarian finishing your sentence |
| **Top-k** | The k best suggestions for a prefix (k is usually 5 to 10) | The short list on the shelf at the front of the shop |
| **Score** | How good a suggestion is, mostly how often people searched it recently | A bestseller chart |
| **Trie** (say "try") | A tree where each edge is one character, so each node *is* a prefix | The thumb tabs on the edge of a dictionary |
| **Debounce** | Waiting until the user pauses typing before sending a request | Not answering until someone finishes their sentence |
| **TTL** (time to live) | How long a cached answer may be reused before it must be fetched again | A "best before" date |

The whole design rests on one observation: **the answer for a prefix changes slowly**. What people search for
after typing `ca` today is almost the same as an hour ago. So we can compute every answer in advance, in a
batch job, and serve it from memory. The only parts that need to be fast-moving are trending topics and the
user's own history, and we will bolt those on at the end.

## 2. Requirements

### Functional (what users get)

- As the user types, show up to **5 suggestions** that **start with** what they typed.
- Rank suggestions by **popularity**, favouring recent popularity over old.
- Suggestions respect the user's **language and region** (`football` means different things in London and Texas).
- **Never** suggest offensive, dangerous or private content.
- Selecting a suggestion runs that search.

### Non-functional (how well)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Latency** | Suggestions on screen within ~100 ms of the request leaving the client (after the debounce pause); server time under 10 ms at p99 | A quick typist presses a key every 100–200 ms; a late list is useless or, worse, jumps under the cursor |
| **Availability** | 99.99%, and **fail soft**: if suggestions are down, the search box still works | Autocomplete is a helper, not the product |
| **Scale** | Hundreds of thousands of requests per second on average, around a million at peak | Every keystroke is a request |
| **Freshness** | General suggestions may be hours old; trending topics within minutes | A breaking news story should appear quickly |
| **Consistency** | Eventual. Two users may briefly see slightly different lists | Nobody is harmed by a list that is an hour stale |

"p99" means the 99th percentile: 99 out of 100 requests are at least this fast. Interviews care about tail
latency because a user types many keys per search, so they will hit the slow 1% often.

### Out of scope

Spelling correction and fuzzy matching (`cra` suggesting `car`), the search results page itself, voice search,
and query understanding. Mention them, then set them aside. We return to typo tolerance briefly in the practice
questions.

## 3. Back-of-the-envelope estimates

**Assumptions:** 500 million daily active users, each doing **10 searches** a day. An average query is
**20 characters**. With debouncing (section 10), the client sends roughly **one request per 3 characters**, so
about **6 suggestion requests per search**. Peak traffic is 3× the average.

**Traffic**

- Searches per day: $500\text{M} \times 10 = 5\text{B}$.
- Suggestion requests per day: $5\text{B} \times 6 = 30\text{B}$, which is
  $30\text{B} / 86{,}400 \approx 350{,}000$ per second on average and about **1 million per second** at peak.
- Six times more traffic than search itself, and all of it read-only.

**Data to serve**

- We do not keep every query ever typed: the long tail (queries searched once) is noise and often private. Say
  we keep the **50 million** most popular distinct queries.
- At 20 characters each, that is at most $50\text{M} \times 20 = 1\text{B}$ characters, so at most 1 billion trie
  nodes. Shared prefixes (`car`, `card`, `care` share `car`) cut that a lot; assume **250 million nodes**.
- Each node holds its child pointers plus a cached top-10 list of query IDs (10 × 4 bytes). Call it
  **~120 bytes per node**: $250\text{M} \times 120\text{ B} = 30\text{ GB}$.

**Logs to process**

- Each search is logged with the query, time, region and language: about 100 bytes.
  $5\text{B} \times 100\text{ B} = 500\text{ GB}$ a day.

Three conclusions:

1. **The serving data fits in memory.** 30 GB fits in the RAM of one large server, or of a few smaller shards.
   No disk on the hot path.
2. **Throughput, not size, drives the server count.** A million requests per second needs many replicas of the
   same data, plus caches in front of them.
3. **The heavy computation is offline.** Processing 500 GB of logs a day is a routine batch job; it must never
   happen on the request path.

## 4. The API

One read endpoint, designed to be cacheable:

```text
GET /v1/suggest?q=ca&lang=en&region=gb&limit=5

200 OK
Cache-Control: public, max-age=300
{
  "q": "ca",
  "suggestions": ["car", "cat", "card", "care", "cars for sale"]
}
```

Design choices worth saying out loud:

- **`GET` with everything in the URL.** The same URL always means the same answer, so browsers and CDNs can
  cache it (section 10).
- **No user ID in the URL.** The general list is identical for everyone in a region, which is what makes it
  cacheable. Personal suggestions come from a separate, private call (section 13).
- **Small responses.** Five short strings, a few hundred bytes. Compression and keep-alive connections matter
  more than anything else in the payload.

The offline side needs no public API: it reads the search service's logs, which are already written for
analytics.

## 5. The core idea: a trie with the answers already stored

### Why a trie?

A **trie** stores strings by their characters. The root is the empty prefix; each child adds one character; a
node is marked when a whole query ends there. To find everything starting with `ca`, walk `c` then `a`: two
steps, no matter how many millions of queries are stored. Every query below that node starts with `ca`.

### Why store the top-k in every node?

Finding the node is fast. Finding the **best 5 queries below it** is not: below `c` there may be millions of
queries, and a search through all of them on every keystroke would take far too long. So we do that search
**once, offline**, and store the answer in the node.

[![A trie of six queries with their counts: car 90, cat 70, card 55, care 40, dog 80 and dot 20. Every node stores its own top-3 list, for example the root stores car, dog, cat and the node ca stores car, cat, card](/img/system-design/search-autocomplete/01-trie.png)](/img/system-design/search-autocomplete/01-trie.png)

In the picture, each node is a prefix, the number in brackets is how often that query was searched, and
"top" is the cached list with k = 3. Look at `ca`: its list (`car, cat, card`) was computed from everything
below it. Answering `ca` is now two pointer hops plus reading three IDs.

| Approach | Work per keystroke | Problem |
| --- | --- | --- |
| Scan all queries, keep those that start with the prefix | O(number of queries) | Hopeless at 50 million queries |
| Trie, then search the subtree and sort | O(prefix length + size of subtree) | The subtree for `s` holds millions of nodes |
| **Trie with top-k cached at each node** | **O(prefix length)** | Uses more memory; lists go stale between rebuilds |

That last row is the whole trick: **move the expensive part from read time to build time**. We read about a
million times a second but rebuild a few times a day, so the trade is overwhelmingly worth it. The memory cost
is small because each node stores only k IDs, not k strings; the strings live once in a separate table.

Two refinements interviewers like:

- **Cap the prefix length.** Lists are only precomputed for prefixes up to, say, 30 characters. Past that, almost
  nobody types without a suggestion already matching, and the deep tail of the trie can be dropped.
- **A trie is not the only option.** Because every answer is precomputed, you could store a flat
  **prefix table**: a key-value map from each prefix to its list (`"ca" → [car, cat, card]`). It uses more
  memory, since shared prefixes are not shared, but it can live in any key-value store and shards trivially.
  The trie is still the natural structure for *building* the lists.

## 6. High-level design

[![Architecture: the browser sends prefix requests through a CDN edge and API gateway to the suggestion service, which reads a result cache and in-memory trie servers. Separately, full searches are logged to a query log stream, aggregated, built into a trie with a blocklist applied, written to a snapshot store and loaded by the trie servers](/img/system-design/search-autocomplete/02-architecture.png)](/img/system-design/search-autocomplete/02-architecture.png)

*Select the diagram to zoom in and move around.*

The system splits cleanly into two halves that share only a file format.

**Online (every keystroke), top row:**

- **Browser / app:** debounces keystrokes and keeps a small cache of recent answers.
- **CDN edge:** a server of a content delivery network (CDN), one of many placed close to users, that caches
  responses. Short prefixes like `a` or `th` are asked by everyone, so most of
  them never reach our servers.
- **API gateway:** authentication, rate limiting (to stop scrapers), routing.
- **Suggestion service:** a stateless service (it keeps no data of its own between requests) that finds the right trie shard, merges in trending and personal
  results, applies a last safety filter and returns the list.
- **Result cache:** an in-memory cache (for example Redis or Memcached) of `prefix → final list`.
- **Trie servers:** hold the trie in RAM. It is **sharded** (split into pieces, each on its own servers) by prefix,
  and each piece is **replicated** (several identical copies) for throughput and safety.

**Offline (rebuilt hourly or daily), bottom row:**

- **Search service:** when a user actually runs a search, it logs the query.
- **Query log:** an event stream (for example Kafka) feeding storage for batch jobs.
- **Aggregation jobs:** count and score each query (for example with Spark or MapReduce).
- **Trie builder:** builds the trie and computes the top-k list for every node, dropping blocklisted queries.
- **Snapshot store:** versioned, immutable trie files in object storage.
- Trie servers **load + swap** a new snapshot when it is ready.

Notice that we log **submitted searches**, not keystrokes. What people finally searched for is the signal we
want; half-typed prefixes are noise.

## 7. Flow 1: what happens on each keystroke

A user types `c`, `a` quickly, pauses, types `r`, then presses backspace.

[![Sequence: the app debounces c and a, then sends GET q=ca to the CDN, which misses and asks the suggestion service; the service reads the top-k from the trie shard, filters it and returns it with max-age 300; later q=car is a CDN hit, and after backspace the app answers ca from its own cache](/img/system-design/search-autocomplete/03-keystroke.png)](/img/system-design/search-autocomplete/03-keystroke.png)

*Select the diagram to zoom in and move around.*

Step by step:

1. **No request for `c`.** The second key arrived before the debounce timer fired, so only `ca` is sent.
2. **`ca` is a cold miss.** The CDN does not have it, so it travels to the suggestion service, which asks the
   trie shard for the cached list at node `ca` and filters it. The response carries `max-age=300`, so the CDN and
   the browser may reuse it for 5 minutes.
3. **`car` is a CDN hit.** Someone nearby asked for it recently. Our servers do no work at all.
4. **Backspace costs nothing.** The app already has the list for `ca` in memory and shows it instantly.

### The latency budget

The user should see suggestions within roughly 100 ms of the request being sent. Here is a typical split, with the
debounce wait listed first because it happens before the request leaves the client:

| Step | Budget | How we meet it |
| --- | --- | --- |
| Debounce wait | 50–150 ms (by design) | Happens while the user pauses; not part of the 100 ms and not felt as "slow" |
| Network to the CDN edge and back | 10–40 ms | Edges are near users; reuse connections (HTTP/2 or HTTP/3) |
| Edge to our data centre and back (on a miss) | 10–40 ms | Serve from several regions |
| Suggestion service + trie lookup | 1–10 ms | Everything in RAM; no disk, no database query |
| Render in the browser | a few ms | Tiny payload, no layout shift |

The server's share is tiny. **Most of the latency is network**, which is why caching at the edge and in the
browser matters more than shaving microseconds off the lookup.

## 8. Inside the suggestion service

[![Serving workflow: the prefix is normalised, the result cache is checked and a hit is returned at once; on a miss the trie shard gives candidates, trending boosts are merged and ranked, the safety filter keeps the top 5, the answer is returned and stored in the result cache](/img/system-design/search-autocomplete/04-serving.png)](/img/system-design/search-autocomplete/04-serving.png)

1. **Normalise** the prefix the same way the builder normalised queries: lowercase, trim spaces, collapse
   repeated spaces, Unicode normalisation (so `café` typed two different ways matches). If the two sides
   disagree, lookups silently miss.
2. **Check the result cache** under the key `(prefix, language, region)`. A hit returns immediately; cached lists
   were already filtered before they were stored.
3. **On a miss, read the trie shard.** Ask for a few more than we will show (say 10), so the later steps have room
   to drop or reorder some.
4. **Merge and rank** with fresh signals, mainly trending boosts (section 13). The user's own history is **not**
   merged here: this list is stored in a shared cache, so personal suggestions come from a separate private call
   (section 13).
5. **Safety filter:** apply the online blocklist (section 12), remove duplicates, keep the top 5.
6. **Return and store** the result in the cache with a short TTL.

Every step is in memory. The service itself is **stateless**: any instance can serve any request, so we scale it
by adding instances behind a load balancer.

## 9. Flow 2: building the trie offline

This is where the real work happens: turning billions of log lines into a trie with good lists.

[![Offline pipeline: the query log is normalised, counted and scored together with decayed past scores, built into a trie with the blocklist removed, serialised into a versioned snapshot, then loaded and swapped into the trie servers](/img/system-design/search-autocomplete/05-offline-build.png)](/img/system-design/search-autocomplete/05-offline-build.png)

*Select the diagram to zoom in and move around.*

### Step 1: clean

Normalise each logged query exactly as the online service will. Drop traffic from bots and scrapers (very high
rates from one source, robotic timing), and drop queries that are mostly symbols or far too long.

### Step 2: count and score

Group by `(query, language, region)` and count. Raw all-time counts would keep last year's news at the top
forever, so we **decay** old popularity. A simple and effective rule is an exponentially weighted score:

```text
score_today = score_yesterday × 0.9 + count_today
```

With a factor of 0.9, a day's searches lose about half their weight in a week ($0.9^7 \approx 0.48$). Steady
favourites stay high; yesterday's spike fades on its own. The previous day's scores are kept, so each run only
reads one new day of logs.

Two filters belong here too:

- **Minimum popularity.** Drop queries searched fewer than, say, 50 times. This keeps the trie small and, just
  as important, protects **privacy**: a query typed by only one person (which might contain their name, address
  or medical condition) must never be shown to strangers. Counting **distinct users**, not raw searches, stops one
  person from pushing a query in by repetition.
- **Blocklist.** Remove anything on the offensive or unsafe list (section 12).

### Step 3: build the trie and the top-k lists

Insert every surviving query into a trie, then fill in the lists **bottom-up**: a node's best queries are the
best of its own query (if one ends there) and its children's lists.

```text
function fill(node):
    candidates = []
    if node.is_query_end:
        candidates.add((node.score, node.query_id))
    for child in node.children:
        fill(child)
        candidates.extend(child.top_k)
    node.top_k = best k of candidates by score
```

This visits each node once and merges a few short lists at each, so it is roughly linear in the number of nodes.
Each node also only needs its children's top-k, never the whole subtree, which keeps it cheap. For a trie larger
than one machine, each shard builds its own range in parallel, and the few short prefixes that span several shards
(section 11) are filled last by merging those shards' top-k lists.

### Step 4: publish and swap

The builder **serialises** each shard's trie into a compact file, writes it to the snapshot store with a version
number, and runs sanity checks: is the file roughly the expected size, and do canary prefixes (`a`, `how to`,
`weather`) return sensible lists? Only then do the trie servers pick it up:

1. Load the new snapshot into memory **alongside** the old one (servers need RAM for two copies).
2. Flip one pointer so new requests use the new trie.
3. Free the old copy a minute later, once in-flight requests finish.

Servers roll over a few at a time, so capacity never drops. If something looks wrong, rolling back is just
loading the previous version. Because the data is **read-only between swaps**, there are no locks and no
consistency problems on the hot path.

### How often?

Daily rebuilds are fine for general suggestions; hourly is better and cheap at this size. Going much faster
with a full rebuild is wasteful. Fast-moving topics get their own path instead (section 13).

## 10. Deep dive: the client does half the work

The cheapest request is the one never sent. The client has three tools.

**Debouncing.** Start a short timer (for example 100 ms) on each key press; if another key arrives first, restart
it; send a request only when the timer fires. A fast typist entering `cars for sale` sends perhaps three requests
instead of thirteen. (*Throttling* is different: at most one request every N ms even while typing continues.
Some products combine both so a long burst of typing still shows something.)

**Out-of-order responses.** Requests for `ca` and `car` can return in the wrong order. Showing the `ca` list
after the user typed `car` would be wrong. The client either cancels the older request or tags each request with
a sequence number and **ignores any response older than the latest one shown**.

**Caching at three levels.**

| Where | What it holds | Why it works |
| --- | --- | --- |
| Browser / app memory | The last few dozen prefixes this user asked for | Backspace and retyping are very common |
| CDN edge | Popular prefixes for the region | Short prefixes are shared by everyone: millions of users type `w`, `we`, `wea` |
| Result cache in our data centre | Recent final lists | Absorbs whatever the CDN misses |

The `Cache-Control: max-age=300` header lets the browser and CDN reuse an answer for 5 minutes. A short TTL keeps
trending changes visible; a longer one saves more traffic. Short prefixes are so popular that even a TTL of a
minute takes most of that load off our servers.

A neat extra trick: if the server marks the list for `ca` as **complete** (the node had fewer than k suggestions
in total), it already holds every suggestion that starts with `ca`, so the client can answer `car` by filtering
that list locally, with no request. A short list alone is not proof, because the safety filter may have removed
entries.

## 11. Deep dive: sharding the trie

At 30 GB, one machine could hold the whole trie, so why shard? Two reasons: **growth** (more languages and
regions, longer lists) and **build time** (a smaller shard builds and loads faster). Throughput is solved by
**replicas** of the same data; sharding is about size.

### By first letter? Uneven

The obvious split, one shard per first letter, is badly unbalanced: far more queries start with `s` or `c` than
with `x` or `q`. So we split by **prefix ranges** chosen from the data, so each shard holds a similar amount of
data and traffic.

[![Sharding by prefix range: the suggestion service checks a cached shard map and sends q=sun to the one shard whose range sn to z contains it; the cluster has ranges a to f, g to r, sa to sm (the hot letter s split in two) and sn to z, each replicated](/img/system-design/search-autocomplete/06-sharding.png)](/img/system-design/search-autocomplete/06-sharding.png)

- A small **shard map** lists the ranges (`a–f`, `g–r`, `sa–sm`, `sn–z`). Every suggestion service instance
  caches it.
- A busy letter is **split** further by its second character, as `s` is here.
- Each range is served by **several replicas** in different zones. Any replica can answer, because the data is
  read-only.
- The builder recomputes the split points from size and traffic, and publishes the new map together with the
  snapshots, so the map and the data always agree.
- **Prefixes above a split need care.** The prefix `s` belongs to neither `sa–sm` nor `sn–z`, and its list must
  draw on both halves. The builder has every score, so it computes the lists for these few short prefixes
  globally and stores them on one of the shards (or on every shard: there are only a handful).

Why does this work so neatly? Because every node already stores its own answer. Serving a prefix needs **only
that one node**, never data from another shard, so one request touches exactly one shard.

### The alternative: hash the prefix

If you store the flat prefix table instead of a trie (`prefix → list`), you can shard by **hash of the prefix**,
which balances load automatically and needs no split points. The cost is that you lose shared prefixes and must
store an entry for every prefix. Both are reasonable; saying why is what earns the marks.

### Hot keys

A single prefix such as `w` during a weather emergency may get enormous traffic, more than one replica can
handle. The layers in front absorb it: the browser, the CDN and the result cache all hold short prefixes. If
needed, extra replicas can be added for the hottest shard only.

## 12. Deep dive: filtering offensive suggestions

A suggestion is the product **putting words in the user's mouth**. Suggesting something hateful, sexual, violent,
defamatory about a real person, or dangerous (for example self-harm methods) causes real harm, even if many people
searched it. Large search engines publish policies for exactly this. Filtering happens in layers:

| Layer | When | What it catches |
| --- | --- | --- |
| **Popularity and distinct-user thresholds** | Offline, during scoring | Private information typed by one person; spam pushed by a few accounts |
| **Blocklist of terms and patterns** | Offline, before the trie build | Known slurs, explicit terms, after the same normalisation (so `l33t` spellings and extra spaces still match) |
| **Classifier** | Offline | A machine-learning model scoring each candidate query for hate, violence, sexual content and so on; too risky → dropped |
| **Online blocklist** | At serve time (section 8) | Emergencies: a newly harmful suggestion is removed **within minutes**, without waiting for the next rebuild |
| **User reports and review** | Continuous | "Report inappropriate prediction" feeds back into the lists and the classifier |

Two subtleties:

- **Filter the prefix too.** If the user types an offensive prefix, the safest answer is usually no suggestions
  at all, rather than completing it.
- **Context matters.** A word that is fine in a medical query may be offensive elsewhere, which is why a
  classifier that sees the whole query beats a plain word list.

The online blocklist is small, kept in every service instance's memory, and updated through a config push. It is
the **kill switch**: the slow offline pipeline is the main filter, but the online layer guarantees that removing
a bad suggestion is never "wait for tomorrow's build".

## 13. Extensions: trending queries and personalisation

### Trending queries

A daily or hourly build is too slow for breaking news. When a storm is named or a match ends, people search for
it within minutes. So we add a **fast path** next to the slow one.

[![Trending: the query log feeds a stream counter with 5-minute windows and a spike detector that writes rising queries to a small trending table; in parallel batch jobs feed the trie builder and trie servers; the suggestion service merges both at read time](/img/system-design/search-autocomplete/07-trending.png)](/img/system-design/search-autocomplete/07-trending.png)

*Select the diagram to zoom in and move around.*

- A **stream processor** (for example Flink or Kafka Streams) counts queries in short windows, such as 5 minutes.
- A **spike detector** compares the recent count with the query's usual level for this time of day. A query
  searched 50× more than normal is trending, even if its absolute count is still smaller than `facebook`.
- Trending queries go into a **small table** (thousands of entries, not millions), refreshed every minute and
  copied to every suggestion service instance.
- At read time, the service **merges**: trending queries that match the prefix get a boost and can enter the top
  5. The trie is untouched.

This is the general pattern: a **slow, complete, batch view** plus a **fast, small, streaming view**, combined
when reading. Trending entries pass the same safety filter, and need a minimum number of distinct users, because
a fresh spike is exactly what a manipulation campaign looks like.

### Personalisation

Users like seeing their own past searches ("you searched this before"), and results that fit their location and
language.

- **Location and language** are already part of the cache key `(prefix, language, region)`. Cities can be
  handled the same way for local queries (restaurants, weather), at the cost of more lists to store.
- **Personal history:** keep each user's recent searches (say the last few hundred) in a per-user store. On a
  request, fetch the matching ones and blend them in, usually at the top.

Personalisation fights caching: a personal list cannot be cached at a shared CDN. The usual answer is to **split
the response**. The general list stays public and cacheable; personal suggestions come from a separate private
call (or are stored on the device and matched locally), and the client merges the two. Users must be able to
delete their history and turn this off.

## 14. What breaks as it grows, and how to fix it

**Traffic outgrows the replicas.** *Fix:* more replicas per shard and more caching in front. Raise the CDN TTL for
the shortest prefixes, which are the most requested and the most stable.

**The trie outgrows memory.** More languages, regions and longer lists push past one machine. *Fix:* shard by
prefix range (section 11), store query strings once and keep only IDs in nodes, compress chains of single-child
nodes into one node (a **radix tree**), and cap the prefix depth.

**Builds take too long.** A full rebuild over months of logs every hour would be wasteful. *Fix:* incremental
scoring (yesterday's scores × decay + today's counts), building shards in parallel, and leaving freshness to the
trending path.

**The snapshot rollout overloads the network.** Hundreds of servers downloading 30 GB at once. *Fix:* stagger the
rollout, and copy snapshots region by region rather than all from one bucket.

**Bad data reaches users.** A bug in the builder ranks garbage first, or a blocklist file is empty. *Fix:* canary
prefix checks before publishing, gradual rollout to a few servers first while watching click-through, and instant
rollback to the previous snapshot.

**Manipulation.** Groups try to push a query (often defamatory) into suggestions by searching it repeatedly.
*Fix:* count distinct, trusted users rather than raw searches, discount bursts from new accounts or narrow IP
ranges, and require trending candidates to come from many regions or sources.

## 15. Reliability: failing soft

| Risk | Defence |
| --- | --- |
| A trie server crashes | Replicas serve the same read-only data; the load balancer routes around it |
| A bad snapshot is published | Versioned snapshots, sanity checks before publishing, gradual rollout, one-step rollback |
| The offline pipeline stops for a day | Servers keep serving the last good snapshot; suggestions are a little stale, not broken |
| The suggestion service is overloaded or down | The client times out quickly (for example after 300 ms) and shows nothing; the search box still works |
| A whole region fails | DNS or the CDN sends users to another region; each region holds a full copy |
| A harmful suggestion appears | Online blocklist push removes it within minutes |

The guiding principle: **autocomplete is optional**. Every failure should degrade to "no suggestions" or "slightly
stale suggestions", never to a broken search box.

## 16. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| When to compute top-k | Per request, by searching the subtree | Precomputed in every node | **Precomputed**: reads outnumber builds by millions to one |
| Data structure | Trie with top-k | Flat prefix → list table | **Trie** to build; either can serve. The table is simpler to shard, the trie uses less memory |
| Freshness | Rebuild constantly | Batch rebuild + streaming trending | **Batch + stream**: complete and cheap, plus fast where it matters |
| Sharding | By first letter | By data-driven prefix ranges (or hash) | **Ranges**: balanced, one shard per request |
| Where to cache | Server only | Browser + CDN + server | **All three**: the network is most of the latency |
| Personalisation | Personal list in one response | Separate private call merged on the client | **Separate**: keeps the general list cacheable |
| Filtering | Offline only | Offline + online blocklist | **Both**: thorough offline, instant removal online |
| What to log | Every keystroke | Submitted searches | **Submitted searches**: the real signal, far less data |

## Cheat sheet for last-minute revision

- **Core idea:** a trie where every node stores its **top-k** suggestions, computed offline. A keystroke is
  O(prefix length): walk to the node, read k IDs.
- **Why precompute:** ~1M reads/s versus a few rebuilds a day; searching a subtree per keystroke is far too slow.
- **Offline pipeline:** query logs → normalise and drop bots → count per `(query, language, region)` with decay
  (`score = old × 0.9 + today`) → popularity and distinct-user threshold → blocklist → build bottom-up → versioned
  snapshot → load beside the old copy and swap a pointer.
- **Online path:** client debounce → browser cache → CDN → gateway → stateless suggestion service → result
  cache → in-memory trie shard → merge trending → online filter → top 5; personal history comes from a separate
  private call merged on the client.
- **Latency:** aim for ~100 ms from request to screen; the server takes under 10 ms, the rest is network, so cache at the edge.
- **Client:** debounce ~100 ms, drop out-of-order responses, cache recent prefixes, filter locally when a list is
  already complete.
- **Sharding:** by data-driven prefix ranges (split hot letters like `s`), or by hash of the prefix with a flat
  table; replicas for throughput.
- **Safety:** thresholds protect privacy, blocklist plus classifier offline, online blocklist as a kill switch,
  user reports.
- **Extensions:** trending = stream counts + spike detection in a small table merged at read time; personal
  history = separate private call.
- **Numbers:** 5B searches/day → ~30B suggestion requests/day (~350K/s, ~1M/s peak); 50M queries → ~30 GB trie;
  ~500 GB logs/day.

## Practice questions

1. **How would you support typo tolerance, so `wether` suggests `weather`?** Keep the exact trie as the fast
   path. On few or no results, look up variants within one edit (insert, delete, substitute, swap a letter),
   limited to the first few characters to bound the work, or keep a precomputed map of common misspellings learnt
   from logs ("users who typed X then searched Y"). Rank fuzzy matches below exact ones.
2. **How would you suggest queries where the prefix matches a later word, so `york` suggests `new york
   times`?** Also index each query under the start of each of its words (`york times`, `times`), pointing back to
   the full query. The trie grows a few times larger; merge and deduplicate results at read time.
3. **A celebrity's name suddenly autocompletes to a false and harmful rumour. What do you do?** Immediately add it
   to the online blocklist (removed within minutes everywhere), then add it to the offline blocklist so the next
   build drops it, and look at why it got through: probably a coordinated campaign, so tighten the distinct-user
   and source checks for trending.
4. **How would you measure whether a new ranking is better?** A/B test it: send a small share of users to the new
   lists and compare the share of searches that came from a suggestion, how many characters users typed before
   picking one, and how often they deleted a suggestion. Watch latency and report rates too.
5. **Why not query the search index (for example Elasticsearch with a prefix query) on every keystroke?** It works
   for a small site. At a million requests per second it is slow and costly, because each query does work at read
   time and ranks by document relevance rather than query popularity. Precomputed lists in memory answer in
   microseconds and are trivially cacheable.
