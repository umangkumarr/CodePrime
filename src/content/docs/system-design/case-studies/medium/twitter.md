---
title: "Design Twitter / X (microblogging)"
description: "Design a Twitter-scale microblogging service: asymmetric follows, hybrid fan-out home timelines, Snowflake IDs, real-time search and trending topics."
difficulty: "Medium"
sidebar:
  label: "Twitter / X (microblogging)"
tags: ["News feed", "Fan-out", "Caching", "Search", "Streaming"]
---

Twitter (now X) looks like the simplest product on the internet: you write a short post, called a **tweet**,
and people who follow you see it. Underneath, it is a **broadcasting system** where one person may speak to a
hundred million listeners at once, a **live newspaper** where every reader gets their own front page, a
**search engine** that must find a tweet seconds after it was written, and a **radar** that notices which topic
the world suddenly cares about.

This case study builds that system from the ground up. We start with what makes Twitter different from a
friends-based network, design the service layer by layer, then go deep on the parts interviewers push on:
timelines, the celebrity problem, IDs, search and trends.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Twitter in 5 minutes: what makes it different

The words you will need:

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Tweet** | A short public post (up to 280 characters), optionally with images or video | A postcard pinned on a public board |
| **Follow** | A one-way subscription: I see your tweets; you do not have to follow me back | Subscribing to a newspaper column |
| **Home timeline** | The feed of tweets from everyone *you* follow, newest first | Your personal newspaper |
| **User timeline** | All tweets written *by one* account | One columnist's archive |
| **Fan-out** | Delivering one tweet to every follower's home timeline | Printing one column into a million papers |
| **Retweet** | Re-sharing someone else's tweet to your own followers | Photocopying a column and posting it on your board |
| **Trend** | A topic whose tweet rate is suddenly far above normal | The headline everyone is suddenly talking about |

The one fact that shapes the whole design is that **follows are asymmetric**. On [Facebook](/system-design/case-studies/medium/facebook/), friendship is
mutual and capped (a few thousand friends), so every personal profile has a modest audience. On Twitter,
anyone can follow anyone without permission. The result is a hugely **skewed graph**: most accounts have a
few hundred followers, and a handful of celebrities have tens of millions, even over a hundred million. A
design that works for the median user breaks completely for those few.

The second defining fact is that Twitter is about **now**. People open it during a football final, an
earthquake or an election to see what is happening this minute. So freshness matters everywhere: your
timeline, search results and trends must all reflect the last few seconds, not the last hour.

## 2. Requirements

### Functional (what users can do)

- **Post** a tweet with text (up to 280 characters) and optional images or video; **delete** your own tweet.
- **Follow** and **unfollow** any account (one-way).
- **Home timeline**: tweets from accounts you follow, newest first, scrolling back through older ones.
- **User timeline**: one account's tweets, newest first.
- **Like**, **retweet** and **reply**, with visible counts.
- **Search** tweets by words, hashtags and accounts, including tweets posted seconds ago.
- **Trending topics**, worldwide and per country or city.
- **Notifications**: someone mentioned you, replied, liked, retweeted or followed you.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Read latency** | Home timeline in under 200 ms (p99) | Opening the app is the most common action by far |
| **Freshness** | A new tweet reaches followers' timelines within ~5 s; searchable within ~10 s; trends update every minute | Twitter is used to follow live events |
| **Availability** | 99.99%; reading must keep working even if posting is degraded | Being slightly stale beats being down |
| **Consistency** | Eventual for other people's timelines; read-your-writes for your own tweets | You must see your own tweet at once; your followers can wait a few seconds |
| **Durability** | A tweet that was acknowledged is never lost | Tweets are public records |
| **Scale** | ~250 million daily active users, ~500 million tweets a day | Twitter-sized (our assumptions, see below) |

### Out of scope

Direct messages, ads, live audio, the machine-learning "For you" ranking in depth, and content moderation.
Mention them in an interview, then set them aside. We design the reverse-chronological "Following" timeline
and point out where ranking would plug in.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resources dominate**.

**Assumptions:** 250 million daily active users (DAU). 500 million tweets a day. An author has **200**
followers on average (the median is far lower; celebrities pull the average up). Each user opens their home
timeline **20** times a day. A tweet record is about **1 KB** with metadata; **10%** of tweets carry media
averaging **500 KB**. Each user likes about **10** tweets a day.

**Traffic**

- Tweets written: $500\text{M} / 86{,}400 \approx 5{,}800$ per second on average, roughly **17,000 per
  second** at peak (3× average), with short spikes far higher during big live events.
- Home timeline reads: $250\text{M} \times 20 = 5\text{B}$ a day, about **58,000 per second**, roughly
  175,000 per second at peak. Reads outnumber tweets by about **10 to 1**.
- Likes: $250\text{M} \times 10 = 2.5\text{B}$ a day, about **29,000 per second**.

**Fan-out work**

- If every tweet were copied into every follower's timeline: $500\text{M} \times 200 = 100\text{B}$ timeline
  inserts a day, about **1.2 million per second**. That is the hidden cost of a fast home timeline.
- One tweet from an account with **100 million** followers is 100 million inserts on its own. Even at the
  whole cluster's 1.2 million per second, that single tweet takes over 80 seconds of all fan-out capacity.

**Storage**

- Tweets: $500\text{M} \times 1\text{ KB} = 500\text{ GB}$ a day, about **180 TB a year** before replication.
- Media: $50\text{M} \times 500\text{ KB} = 25\text{ TB}$ a day, about **9 PB a year**.
- Home timeline cache: keep the newest **800** entries per active user, each a tweet ID plus author ID
  (16 bytes): $250\text{M} \times 800 \times 16\text{ B} = 3.2\text{ TB}$, about **10 TB of RAM** with three
  replicas. Large, but it fits in memory across a few hundred cache servers.

Three conclusions follow:

1. **Reads dominate, so precompute.** Building each home timeline from scratch on every open would be far
   too slow; we prepare it ahead of time.
2. **Fan-out dominates writes, and celebrities dominate fan-out.** We need a special path for huge accounts.
3. **Media dominates bytes.** Images and video go to object storage behind a CDN, never into the tweet database.

## 4. The API

Clients (web, Android, iOS) talk to us over HTTPS with a JSON API.

| Method and path | What it does |
| --- | --- |
| `POST /v1/tweets` | Post a tweet: `{"text": "...", "media_ids": [...], "reply_to": 123}`, with an `Idempotency-Key` header so a retried request is not posted twice. Returns the new tweet with its ID. |
| `DELETE /v1/tweets/{id}` | Delete your tweet. |
| `POST /v1/media` | Get a pre-signed upload URL; the app uploads the file straight to object storage and gets a `media_id`. |
| `GET /v1/timelines/home?max_id=...&count=20` | Your home timeline, newest first. `max_id` is the cursor: "tweets older than this ID". |
| `GET /v1/users/{id}/tweets?max_id=...` | One account's user timeline. |
| `POST /v1/users/{id}/follow` / `DELETE` | Follow or unfollow. |
| `POST /v1/tweets/{id}/like` / `DELETE` | Like or unlike. |
| `POST /v1/tweets/{id}/retweet` | Retweet. |
| `GET /v1/search?q=%23WorldCup&max_id=...` | Search recent tweets. |
| `GET /v1/trends?region=GB` | Current trends for a region. |
| `GET /v1/notifications?max_id=...` | Your notifications. |

Notice the cursor is a **tweet ID**, not a page number. Twitter's public API has long used `since_id` and
`max_id` this way. It works because tweet IDs are **sorted by time** (section 8), so "give me tweets older than
ID X" is the same as "older than the moment X was created". A page number would shift every time a new tweet
arrived, and you would see duplicates.

## 5. High-level design

[![High-level architecture: users reach the API gateway, which routes posts to the tweet service and tweet store, home-timeline reads to the timeline service and timeline cache, and searches to the search service; the tweet store's change stream feeds an event log consumed by fan-out workers (which read the social graph and push IDs into timeline caches), the search indexer, notifications and the trends pipeline; media is served by a CDN from object storage](/img/system-design/twitter/01-architecture.png)](/img/system-design/twitter/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **API gateway:** checks who you are (OAuth tokens), applies **rate limits** (section 13), routes requests.
- **Tweet service:** validates a tweet, gives it a **Snowflake ID**, and writes it to the tweet store.
- **Tweet store:** the source of truth for tweets, sharded by tweet ID, with a cache in front for hot tweets.
- **Event log** (for example Kafka): an ordered, replicated stream of events (`TweetCreated`, `TweetDeleted`,
  `LikeAdded`, `Followed`). Everything that reacts to a tweet reads from here, so the write path stays short.
- **Fan-out workers:** look up an author's followers in the **social graph** and push the tweet ID into each
  follower's **timeline cache**.
- **Timeline service:** serves home and user timelines: reads cached IDs, merges in celebrity tweets, then
  **hydrates** (fetches the full tweets for the IDs).
- **Search indexer and search service:** keep a real-time inverted index and answer queries over it.
- **Trends pipeline:** counts terms in the tweet stream over sliding windows and ranks what is surging.
- **Notifications:** turns events into "@alice mentioned you" and pushes them to phones.
- **CDN and media store:** images and video are uploaded to object storage and served from the CDN edge.

The event is published from the tweet store's **change stream** (or an "outbox" table written in the same
transaction), not by the tweet service in a second, separate call. If the service wrote the tweet and then
crashed before publishing, followers would never see it. Tying the event to the stored row means a tweet is
never stored without its event.

The single most useful idea in this design: **do the expensive work at write time, once, so that reads are
cheap, except where write-time work explodes**. That exception is the celebrity, and it gets its own section.

## 6. Flow 1: posting a tweet

Alice (2,000 followers) posts a tweet.

[![Sequence for posting: Alice's app sends POST /tweets with an idempotency key; the tweet service rate-limits, checks length and assigns a Snowflake ID, inserts the tweet and replies 201 Created; asynchronously the tweet store emits TweetCreated to the event log, a fan-out worker reads Alice's followers from the social graph and prepends the tweet ID to each follower's timeline cache, trimmed to about 800 IDs](/img/system-design/twitter/02-post-tweet.png)](/img/system-design/twitter/02-post-tweet.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Alice waits only for steps 1 to 4**: one ID generation and one database write. Fan-out to 2,000 followers
  happens afterwards, in the background. Her app also shows the tweet in her own timeline immediately
  (read-your-writes) without waiting for fan-out.
- **The timeline cache stores IDs, not tweets.** Each follower's timeline is a **sorted set** of small `(tweet_id, author_id)`
  pairs, ordered by tweet ID (which is time-ordered), so inserting the same tweet twice is harmless.
  The tweet text lives once in the tweet store. If Alice edits or deletes the tweet, no follower list needs
  rewriting; hydration simply returns the new version or drops it.
- **Lists are capped** at about 800 entries. Nobody scrolls back through thousands of tweets in a cached
  timeline; older pages fall back to the slower "pull" path described in the next section.
- **Inactive followers are skipped.** A user who has not opened the app for a month gets no fan-out writes;
  their timeline is rebuilt when they return. This cuts fan-out work a lot, since many accounts are dormant.
- **The idempotency key** stops a mobile retry from posting the same tweet twice: the service remembers the
  key for a day and returns the first result for any repeat.

## 7. Deep dive: the home timeline and the celebrity problem

There are two ways to build a home timeline, and both are wrong on their own.

**Fan-out on read (pull).** Store tweets only once, by author. When Bob opens the app, look up the 300 accounts
he follows, fetch each one's latest tweets, and merge them by time. Writes are trivial, but every read does
300 lookups and a merge. At 58,000 timeline reads per second, that is millions of lookups per second, and the
slowest of those 300 shards decides Bob's latency.

**Fan-out on write (push).** When Alice tweets, copy the tweet ID into every follower's timeline list (section 6).
Reading becomes one lookup of a ready-made list, which is fast. But the cost moves to writing, and it is
proportional to the follower count. For a celebrity with 100 million followers, one tweet means 100 million
writes and, as we computed, over a minute of the entire fan-out fleet. Followers at the end of the queue would
see the tweet minutes late, and a celebrity tweeting during a live event would starve everyone else's fan-out.

The everyday analogy: a newspaper (push) prints your copy overnight so breakfast reading is instant; a library
(pull) makes you collect every article yourself when you arrive. A newspaper works until one columnist has
100 million readers who all need their copy in five seconds.

### Hybrid fan-out

The answer used by large feed systems is to **push for ordinary accounts and pull for celebrities**.

[![Hybrid fan-out decision: on TweetCreated, if the author is a celebrity (for example 100k+ followers) the tweet is only stored with the author's tweets and merged in at read time; otherwise the worker pages through followers 5,000 at a time and, for each active follower, prepends the tweet ID to their timeline; inactive followers are skipped and rebuilt on their next visit](/img/system-design/twitter/03-hybrid-fanout.png)](/img/system-design/twitter/03-hybrid-fanout.png)

*Select the diagram to zoom in and move around.*

- An account is marked **celebrity** (`is_celebrity` in the data model) once its follower count crosses a
  threshold, for example 100,000. The threshold is a tuning knob: lower means less fan-out work but more
  merging at read time.
- A celebrity's tweets are **not** fanned out. They live in the celebrity's user timeline, which is heavily
  cached because millions of readers ask for it.
- The fan-out worker pages through followers in batches (for example 5,000 IDs at a time), so a 90,000-follower
  account is many small jobs that can run in parallel and retry independently.

### Reading: merge at read time

[![Home timeline read: Bob's app calls the timeline service, which reads about 800 pushed IDs from the timeline cache, asks the social graph which celebrities Bob follows, fetches their recent tweet IDs from the tweet store, merges both lists newest first while dropping deleted, muted and blocked tweets, multi-gets the top 20 tweets with their counts, and returns them with the next cursor](/img/system-design/twitter/04-home-read.png)](/img/system-design/twitter/04-home-read.png)

*Select the diagram to zoom in and move around.*

The merge is cheap because every list is already sorted by tweet ID, which means by time. Merging Bob's
pushed list with the recent tweets of, say, 10 celebrities is a **k-way merge of sorted lists** (the same idea
as merging sorted arrays with a heap), and only the top 20 are needed. Most people follow only a few
celebrities, so this adds a handful of cached lookups to each read, not hundreds.

**Hydration** turns IDs into what you see: a batched multi-get of 20 tweets, their authors and their counts,
almost always served from cache. This is also where we apply **filters**: drop deleted tweets, muted words,
blocked accounts, and collapse duplicates (two people you follow both retweeted the same tweet).

Three edge cases interviewers like:

- **Follow:** when Bob follows Carol, a background job copies Carol's recent tweet IDs into Bob's list so his
  timeline is not empty of her until her next tweet.
- **Unfollow:** we filter Carol's tweets out at read time at once, and remove them from Bob's list lazily.
- **Cache miss** (a returning inactive user, or a lost cache server): rebuild the list with the pull method
  once, then go back to push. The timeline cache is **derived data**; the tweet store and social graph can always
  regenerate it.

Ranking ("For you") plugs in after the merge: gather a larger candidate set, score it with a model, and
reorder. The candidate generation is exactly the machinery above.

## 8. Deep dive: Snowflake, time-sortable IDs

Every tweet needs a unique ID, generated thousands of times a second across many machines and data centres.

- A **database auto-increment** counter is a single point of contention and failure.
- A random **UUID** (128 bits) is unique but **not sorted**: you cannot page by "older than this ID", and random
  keys scatter writes across an index.

Twitter's answer, which it open-sourced in 2010 as **Snowflake**, is a 64-bit integer made of three parts:

| Bits | Field | What it gives |
| --- | --- | --- |
| 1 | Sign bit, always 0 | The ID stays a positive signed 64-bit integer |
| 41 | Milliseconds since a custom epoch | IDs sort by creation time; $2^{41}$ ms is about 69 years |
| 10 | Machine ID (Twitter split it into data centre and worker) | Up to 1,024 generators that never collide |
| 12 | Sequence number within that millisecond | Up to 4,096 IDs per millisecond per machine |

```text
id = (milliseconds_since_epoch << 22) | (machine_id << 12) | sequence
```

Why this is so useful:

- **No coordination.** Each generator only needs its own machine ID and its own clock. No locks, no network
  round trip.
- **Sorted by time** (roughly: two machines' clocks differ by a few milliseconds, so IDs are "k-sorted"). That
  gives us cursors (`max_id`), cheap merges of timelines, and "newest first" by sorting on the primary key. A
  tweet needs no separate `created_at` column: the time is inside the ID.
- **Fits in 64 bits**, so it is a fast integer key in every database and language.

The one danger is the **clock going backwards** (for example after a time-sync correction). A generator that
sees an earlier time than its last ID must refuse to issue IDs (or wait) until the clock catches up; otherwise
it could repeat an ID. When the 4,096 sequence numbers of one millisecond run out, it waits for the next
millisecond.

## 9. Low-level design: the data model

[![Data model: users has following and followers tables (the same follow edge stored twice, keyed by each side); users write tweets, which reference replies and retweets, attach media, and have one tweet_counters row and many likes](/img/system-design/twitter/05-data-model.png)](/img/system-design/twitter/05-data-model.png)

*Select the diagram to zoom in and move around.*

Design decisions hiding in this diagram:

**1. The follow graph is stored twice.** "Whom does Bob follow?" (for the read-time merge) and "who follows
Alice?" (for fan-out) are both hot queries, and each must hit one shard. So the same edge is written to
`following`, sharded by `follower_id`, and to `followers`, sharded by `followee_id`. Two writes per follow is a
small price; a follow is rare compared with timeline reads. The second write can be applied from the event log,
which makes the two tables briefly inconsistent (a second or two), which is acceptable.

**2. Tweets are sharded by tweet ID.** Snowflake IDs spread evenly across shards, and a hot account does not
overload one machine. The user timeline ("Alice's tweets") needs a second index, `(author_id, tweet_id DESC)`,
sharded by `author_id`, so it is one sequential read on one shard.

**3. A retweet is a tweet.** It is a row with `retweet_of_id` set and no text of its own. It fans out to the
retweeter's followers through exactly the same path. A reply is a tweet with `reply_to_id`.

**4. Counts live apart from tweets.** `tweet_counters` changes thousands of times a second for a viral tweet,
while the tweet itself never changes. Keeping them apart lets us cache tweets for a long time and update
counters separately (section 12).

**5. Media is referenced, not stored.** A `media` row holds the object-storage key and processing `status`; the
bytes live in object storage and are served by the CDN.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Tweets, user timeline index | Billions of small, immutable rows; point and range reads | Sharded MySQL / Postgres or a wide-column store (Cassandra, ScyllaDB) | Simple keys, horizontal scale |
| Social graph | Billions of edges, read by one side | Sharded key-value or wide-column, both directions | "All followers of X" is a range scan |
| Home timelines | Short, capped, time-ordered sets of IDs per user | In-memory store (Redis sorted sets keyed by tweet ID) | Read on every app open; derived and rebuildable |
| Hot tweets, users, counters | Read-heavy key-value | Memcached / Redis | Hydration multi-gets |
| Events | Ordered, replayable stream | Kafka or similar | Many independent consumers |
| Search index | Inverted index, time-partitioned | Lucene-style engine | Full-text queries |
| Media | Large immutable blobs | Object storage + CDN | Cheapest per byte, served from the edge |

## 10. Deep dive: real-time search

"#WorldCup final" must return tweets posted **seconds** ago. A general search engine re-indexes in batches;
we cannot wait that long.

[![Real-time search: new tweets flow from the event log through a tokeniser into an in-memory real-time index within seconds; a nightly batch builder rebuilds an SSD archive index from the tweet store; a query is sent by the query broker to every shard of both indexes, and each returns its top hits, which the broker ranks and merges into the top 20 results](/img/system-design/twitter/06-search.png)](/img/system-design/twitter/06-search.png)

*Select the diagram to zoom in and move around.*

An **inverted index** is the index at the back of a book: for each word, the list of documents (here tweet IDs)
that contain it. That list is called a **posting list**.

| Term | Posting list (newest first) |
| --- | --- |
| `#worldcup` | 1790…912, 1790…877, 1790…501, … |
| `final` | 1790…912, 1790…640, … |
| `from:fifa` | 1790…877, … |

"#WorldCup final" is the intersection of two lists: tweet 1790…912 matches both.

**How a new tweet becomes searchable in seconds:**

1. The indexer reads `TweetCreated` from the event log, as soon as it is written.
2. The **tokeniser** splits the text into terms: lower-cased words, `#hashtags`, `@mentions`, the language, and
   fields such as `from:` and `has:media`.
3. Each term's posting list gets the new tweet ID **appended in memory**. Because Snowflake IDs grow with time,
   new IDs always go at one end, so appending is cheap and lists stay in time order.
4. The in-memory segment is readable immediately. When it fills up, it is frozen (made read-only) and a new one
   starts, much like a log-structured storage engine.

Twitter described its own engine for this, **Earlybird**, in a 2012 research paper; the ideas above are the
general pattern, and our design does not depend on its internals.

**Partitioning.** We split the index two ways:

- **By time:** a small, hot **real-time index** in memory for recent tweets (most searches want those), and a
  large **archive index** on SSD for older tweets, rebuilt in batch from the tweet store.
- **By document within each tier:** each shard holds a slice of the tweets with *all* their terms. A query goes
  to every shard (**scatter**), each returns its top hits, and the **broker** merges them (**gather**).

Why not split by term (one shard owns `#worldcup`, another owns `final`)? During a live event a single hashtag
gets a huge share of all tweets and queries, so the shard owning it would melt. Document partitioning spreads
every term's load evenly, at the cost of asking every shard.

**Deletes** cannot rewrite posting lists cheaply. Instead each shard keeps a "deleted" set of tweet IDs and
filters them out of results; the next segment rebuild drops them for good.

**Ranking** mixes recency (the default for live events), engagement (likes and retweets so far), and the
searcher's own graph (tweets from people they follow rank higher).

## 11. Deep dive: trending topics

A trend is **not** simply the most-used term. "Good morning" is used millions of times every day and is never
news. A trend is a term whose rate is **far above its usual rate**, right now, in a region.

[![Trends pipeline: tweets from the event log go through term extraction (hashtags, phrases, region) into a count-min sketch per region per minute; a heavy-hitters top-k heap keeps candidate terms; a scorer compares each candidate's current rate with baselines from the same hour in past weeks; the ranked top 30 per region are stored and served by GET /trends, cached for a minute](/img/system-design/twitter/07-trends.png)](/img/system-design/twitter/07-trends.png)

*Select the diagram to zoom in and move around.*

This is a typical streaming design; Twitter has not published its exact algorithm.

### Sliding windows

We want "how often was `#eclipse` used in the last 10 minutes?", updated every minute. Keeping a counter per
term **per minute bucket** and summing the last 10 buckets gives a **sliding window**: every minute the oldest
bucket drops out and a fresh one starts. The window moves smoothly without recounting anything.

### Counting millions of distinct terms: the count-min sketch

Keeping an exact counter for every distinct term, per region, per minute, is a lot of memory: most terms appear
once and never again. A **count-min sketch** gives approximate counts in a fixed, small amount of memory.

It is a grid of counters with $d$ rows and $w$ columns, plus one hash function per row.

- **Add a term:** hash it with each row's function and add 1 to the chosen counter in every row.
- **Estimate a term's count:** look at its $d$ counters and take the **minimum**.

Different terms sometimes land on the same counter (collisions), so a counter can only be **too high**, never
too low. Taking the minimum across rows picks the counter that suffered least. With $w = 2{,}720$ and
$d = 5$, the estimate is within about 0.1% of the total count ($e / w \approx 0.001$) with about 99%
probability ($1 - e^{-5}$), using $5 \times 2{,}720 = 13{,}600$ four-byte counters, roughly 54 KB. Small enough to keep one sketch per
region per minute.

A sketch answers "how many?" but cannot list terms. So alongside it we keep a **heavy-hitters** structure: a
min-heap of the top few thousand terms by estimated count. When a term's estimate beats the heap's smallest
entry, it replaces it.

### Scoring and serving

- **Velocity score:** compare each candidate's count in the current window with its **baseline**, for example
  the same hour in recent weeks. A term going from 50 to 50,000 mentions an hour scores far above one going from
  1 million to 1.2 million.
- **Clean-up:** count each account at most once per term per window, and drop bot-like bursts, so one spammer
  cannot create a trend.
- **Per region:** the region comes from the account's settings or the tweet's location. Each region gets its
  own sketches and ranking.
- **Serving:** the scorer writes the top 30 per region to a small store every minute. `GET /trends` reads it
  from cache. Trends are minutes-fresh by design, so this is one of the cheapest reads in the system.

## 12. Deep dive: likes, retweets and counters

A viral tweet can collect tens of thousands of likes a minute. If every like ran
`UPDATE tweet_counters SET like_count = like_count + 1` on one row, that row would become a **hot key**: every
write serialises on it.

[![Liking a tweet: Bob's app posts a like and shows the heart at once; the engagement service inserts (tweet, Bob) into the likes table only if absent, so a double tap is a no-op, and returns 200 OK; asynchronously a LikeAdded event goes to the event log, a counter worker sums events per tweet for about a second, and writes like_count += 37 in a single update](/img/system-design/twitter/08-like-counter.png)](/img/system-design/twitter/08-like-counter.png)

*Select the diagram to zoom in and move around.*

- **The like itself is a row** keyed by `(tweet_id, user_id)`. That makes it **idempotent**: liking twice,
  or a retried request, inserts nothing new. It also answers "did I like this?" with a point lookup.
- **The count is derived.** Counter workers read `LikeAdded` events and **batch** them: 37 likes in one second
  become one `+37` write. For the very hottest tweets, the counter can also be split into several sub-counters
  (`like_count_0` … `like_count_9`) that are summed when read.
- **Counts are approximate for a moment**, and that is fine: nobody notices if 1,204,331 likes shows as
  1,204,294 for a second. The source of truth (the likes rows) is exact, so a background job can recount and
  repair drift.
- A **retweet** works the same way for its counter, plus it is a new tweet that fans out (section 9).

## 13. Media, notifications and rate limits

### Media

1. The app calls `POST /v1/media` and gets a pre-signed upload URL.
2. It uploads the file **straight to object storage**, so our API servers never carry large bytes.
3. A processing job validates the file, makes resized images or transcodes video into streaming formats, and
   marks the media row `ready`.
4. The tweet is posted with `media_ids`. Followers' apps fetch the files from the **CDN**, which pulls from
   object storage only on a cache miss. A viral image is served from edge caches near each viewer.

### Notifications

The notification service reads the event log: `TweetCreated` (for `@mentions` and replies), `LikeAdded`,
`Retweeted`, `Followed`. For each, it writes a row to the recipient's notification list (keyed by user, newest
first) and decides whether to push to their phone through Apple Push Notification service or Firebase Cloud
Messaging.

Two details matter at Twitter's scale:

- **Aggregation.** A celebrity's tweet may get 50,000 likes in a minute. Instead of 50,000 notifications, the
  service groups them: "Alice and 49,999 others liked your post", updating one entry.
- **Push budgets.** Each user gets a limited number of phone pushes per hour, chosen by importance (a reply from
  someone you follow beats a like from a stranger). The in-app list still shows everything.

### Rate limits

Rate limits protect the service from abuse (spam bots, scrapers) and from accidental overload (a buggy client in
a retry loop). They are enforced at the **API gateway**, keyed by user and by app token, with different
limits per action: posting, following and searching each have their own budget.

A common algorithm is the **token bucket**: each user has a bucket that refills at a steady rate (say 1 token a
minute, up to 50). Each request takes a token; an empty bucket means `429 Too Many Requests`. Short bursts are
allowed, sustained floods are not. The counters live in a fast in-memory store with expiry, and responses tell
the client how many requests remain and when the window resets, so well-behaved clients slow down by themselves.
Following limits matter especially here: mass-following thousands of accounts is a classic spam tactic.

## 14. What breaks as it grows, and how to fix it

**The celebrity tweet.** Covered by hybrid fan-out, but the *read* side also spikes: millions of people open that
celebrity's tweet at once. *Fix:* cache the celebrity's user timeline and hot tweets in many replicas, plus a
small in-process cache on each timeline server, so one key is not served by one cache machine.

**The live event spike.** During a final, the tweet rate can jump several times above peak within seconds.
*Fix:* the event log absorbs the burst; fan-out lag grows by a few seconds instead of anything failing. Scale
fan-out workers from the log's backlog, and degrade gracefully: delay fan-out for inactive users, slow down
trends refresh, but keep posting and reading up.

**The timeline cache bill.** 10 TB of RAM grows with users. *Fix:* cap lists (800 entries), store only IDs, and
keep lists only for users active in the last month; everyone else is rebuilt on return.

**The mega-follower list.** Paging through 90,000 followers for each tweet of a mid-size account adds up. *Fix:*
batch jobs in parallel, skip inactive followers, and lower the celebrity threshold if fan-out lag grows.

**The hot search shard.** One hashtag dominates queries. *Fix:* document partitioning spreads it; replicate
real-time shards and cache identical popular queries for a few seconds.

**Hot counters.** *Fix:* batch increments in workers, split counters for the hottest tweets, and serve counts
from cache.

## 15. Reliability: how we never lose a tweet

| Risk | Defence |
| --- | --- |
| A server crashes after saying "posted" | Only reply `201` after the tweet is written to a **replicated** tweet store |
| A tweet is stored but its event is lost | Publish from the store's change stream or an outbox in the same transaction |
| Fan-out runs twice after a retry | Timeline lists are keyed by tweet ID (a sorted set), so inserting the same ID twice is a no-op |
| A timeline cache server dies | Rebuild lists with the pull method; the cache is derived data |
| The search index is corrupted | Rebuild the archive from the tweet store and replay the event log into the real-time tier |
| A whole region fails | Tweets, graph and logs are replicated across regions; traffic fails over and caches warm up |

The pattern to remember: **one source of truth (tweets, follows, likes), many derived views (timelines, search,
trends, counters) fed by a replayable log.** Any view can be thrown away and rebuilt, so most failures cost
freshness, not data.

## 16. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Building home timelines | Fan-out on read (pull) | Fan-out on write (push) | **Hybrid**: push for normal accounts (fast reads), pull for celebrities (bounded writes) |
| What the timeline cache holds | Full tweets | Tweet IDs | **IDs**: tiny, and edits or deletes need no rewrite; hydrate at read time |
| Tweet IDs | Auto-increment or UUID | Snowflake | **Snowflake**: no coordination, sorted by time, 64 bits |
| Follow graph | One table | Stored in both directions | **Both**: each hot query hits one shard |
| Search partitioning | By term | By document, tiered by time | **By document**: hot hashtags cannot overload one shard |
| Trend counting | Exact counters | Count-min sketch + heavy hitters | **Sketch**: fixed memory, tiny error that does not change rankings |
| Like counts | Update on every like | Batch from events | **Batch**: avoids hot rows; exact likes table remains the truth |
| Consistency | Strong everywhere | Eventual, read-your-writes for your own posts | **Eventual**: a few seconds of lag is invisible; availability matters more |

## Cheat sheet for last-minute revision

- **What is different:** asymmetric follows give a skewed graph (most accounts small, a few with 100M
  followers) and everything is about "now".
- **Write path:** tweet service (rate limit, Snowflake ID) → replicated tweet store → change stream → event
  log → fan-out, search indexer, trends, notifications. The user waits only for the store write.
- **Home timeline:** **hybrid fan-out**. Push tweet IDs into capped (~800) in-memory lists for normal authors;
  pull celebrities' recent tweets at read time; k-way merge by ID; hydrate 20 tweets from cache; filter deletes,
  mutes and blocks.
- **Skip inactive users** during fan-out; rebuild their timelines on return. Timeline cache = derived data.
- **Snowflake:** 1 sign + 41 ms timestamp + 10 machine + 12 sequence bits. No coordination, time-sorted,
  `max_id` cursors; refuse IDs if the clock goes backwards.
- **Graph stored twice:** `following` by follower (for the read merge), `followers` by followee (for fan-out).
- **Search:** inverted index fed from the log within seconds; in-memory real-time tier + SSD archive; document
  partitioning with scatter-gather; deletes via a filter set.
- **Trends:** per-minute buckets → sliding window; count-min sketch (min of d hashed counters) + top-k heap;
  score by velocity against a baseline; per region; refreshed every minute.
- **Counters:** likes as idempotent `(tweet_id, user_id)` rows; counts batched from events.
- **Media:** pre-signed upload to object storage, processed async, served via CDN.
- **Numbers:** ~5,800 tweets/s (17K peak), ~58K timeline reads/s, ~1.2M fan-out inserts/s, ~3.2 TB of
  timeline IDs (10 TB with replicas), ~25 TB of media a day.

## Practice questions

1. **A celebrity with 80 million followers replies to a normal user. Who sees it, and how?** It is a tweet with
   `reply_to_id` set, so it is stored once and not fanned out (celebrity author). Followers see it when their
   timeline merges in the celebrity's recent tweets (many products show replies only to people who follow both
   accounts, which is a filter at merge time). The replied-to user gets a notification through the event log.
2. **How would you implement "edit tweet" within 30 minutes?** Store edits as new versions of the tweet row with
   the same ID (or a version table). Timelines hold only IDs, so hydration returns the newest version with no
   fan-out. Re-index the new text in search and keep the old version for transparency.
3. **Bob follows 2,000 accounts, 200 of them celebrities. What happens to his timeline latency?** The read-time
   merge now needs 200 extra lookups. Fixes: cap how many celebrity lists are merged per page (take the most
   recently active ones), cache each celebrity's recent tweets aggressively, or treat a user who follows many
   celebrities specially by pushing some celebrities' tweets into their list after all.
4. **How would you show "X new tweets" at the top of the timeline?** The app remembers the newest tweet ID it
   displayed and periodically asks for the count of IDs above it (`since_id`). Because IDs are time-sorted, that
   is a cheap range count on the cached list plus the celebrity merge.
5. **Why not build trends by running `GROUP BY hashtag` over the tweet table every minute?** It would rescan
   every tweet in the window (about 350,000 new ones a minute worldwide), compete with real traffic, and still
   not know what is *unusual*. Streaming counts in sketches over windows, compared with baselines, does it
   continuously in fixed memory.
6. **A bug fanned out the same tweet twice. Does Bob see it twice?** No. The timeline is a sorted set keyed by
   tweet ID, so the second insert is a no-op. Hydration also de-duplicates by ID as a second line of
   defence.
