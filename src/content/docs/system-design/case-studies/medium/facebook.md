---
title: "Design Facebook (social network: profiles, friends, news feed)"
description: "Design a Facebook-scale social network: a friend graph with a TAO-style cache, hybrid feed fan-out, ranked feeds and privacy checks on every read."
difficulty: "Medium"
sidebar:
  label: "Facebook (social network)"
tags: ["Social graph", "News feed", "Caching", "Privacy", "Replication"]
---

A social network looks like a website full of profiles and photos. Underneath, it is three hard systems
woven together. It is a **map of who knows whom** (the social graph), holding hundreds of billions of
friendships. It is a **personal newspaper** printed fresh for every reader every time they open the app (the
news feed). And it is a **bouncer** standing at every door, checking that you are allowed to see each post
before it reaches you (privacy).

This case study designs a Facebook-style network from first principles. It focuses on the parts that make
Facebook different from Twitter or Instagram: **mutual friendships**, **per-post audiences**, and a **ranked
feed** built from friends' activity. Where we mention Facebook's real systems, we stick to what Facebook has
published (the TAO and Memcache papers); everything else is "a typical design".

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. A social network in 5 minutes: the vocabulary

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Social graph** | All users (nodes) and the relationships between them (edges): friends, likes, memberships | A huge map of the town with a string between every pair of friends |
| **Bidirectional edge** | A relationship that exists in both directions at once. Facebook friendship is mutual: if Alice is Bob's friend, Bob is Alice's | A handshake: it takes two hands |
| **Unidirectional edge** | A one-way relationship, like following a Page or a Twitter account | Subscribing to a magazine |
| **Adjacency list** | For each node, the list of its neighbours: `alice → [bob, carol, dave]` | Your phone's contact list |
| **News feed** | A personal, ranked list of recent posts from your friends, groups and Pages | A newspaper printed just for you |
| **Fan-out** | Spreading one post to the feeds of everyone who should see it | A teacher handing a copy of a notice to every pupil |
| **Ranking** | Ordering feed candidates by predicted interest, not just by time | A friend who tells you the three bits of news you care about first |
| **Audience** | Who may see a post: Public, Friends, Only me, or a custom list | The guest list at a party |

How this differs from the neighbouring interview questions:

- **[Twitter](/system-design/case-studies/medium/twitter/)** is a **follow graph**: one-way, and some accounts have 100 million followers. The hard part is the
  celebrity fan-out. Posts are almost always public.
- **[Instagram](/system-design/case-studies/medium/instagram/)** is also mostly a follow graph, centred on photos and video.
- **Facebook** is a **friend graph**: mutual, and capped (a personal profile can have at most **5,000
  friends**). Posts carry **audiences**, so the same post is visible to some people and invisible to others,
  and that must be checked on every read. The feed is **ranked**, mixing friends, groups and Pages.

## 2. Requirements

### Functional (what users can do)

- **Profiles**: name, photo, bio, with per-field visibility.
- **Friends**: send, accept, decline and cancel a friend request; unfriend; block.
- **Post** text, photos and videos with an audience (Public, Friends, Only me, a custom friend list).
- **News feed**: a ranked, infinitely scrolling feed of posts from friends, groups and followed Pages.
- **React and comment**: Like and the other reactions, comments and replies, with counts on every post.
- **Notifications**: "Bob accepted your friend request", "Carol and 12 others reacted to your post".
- **Search** for people, Pages and posts.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Latency** | Feed's first page in under 500 ms; profile under 200 ms | People scroll away from a slow app |
| **Availability** | 99.99% for reading the feed | A feed that is a few seconds stale is fine; a feed that does not load is not |
| **Scale** | ~3 billion accounts, ~2 billion daily active users (assumed round numbers) | Facebook-sized |
| **Read-heavy** | Reads outnumber writes by hundreds to one | Design for cheap reads first |
| **Consistency** | Eventual between users (seconds), but **read-your-writes** for your own actions | You must see the comment you just posted; your friend can see it a second later |
| **Privacy** | No post is ever shown to someone outside its audience | A leak is a serious incident, not a bug |

### Out of scope

Messenger, ads targeting and auctions, Marketplace, Stories, live video and content moderation models.
Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** 2 billion daily active users (DAU) out of 3 billion accounts. Each user opens the feed **10**
times a day. One in ten users posts once a day. The average user has **300** friends. Each user reacts **10**
times and comments **2** times a day. A post's text and metadata are about **1 KB**; 20% of posts carry media
averaging **2 MB** once all resized copies are counted.

**Traffic**

- Feed loads: $2\text{B} \times 10 = 20\text{B}$ a day, about **230,000 per second** on average and roughly
  **700,000 per second** at peak (3× average).
- New posts: $2\text{B} \times 10\% = 200\text{M}$ a day, about **2,300 per second**.
- Reactions: $2\text{B} \times 10 = 20\text{B}$ a day, about **230,000 writes per second**. Comments:
  $4\text{B}$ a day, about **46,000 per second**.
- Fan-out if every post is pushed to every friend: $200\text{M} \times 300 = 60\text{B}$ feed inserts a day,
  about **700,000 per second**.
- Privacy checks: if each feed load filters about 500 candidate posts,
  $230{,}000 \times 500 \approx 115\text{M}$ checks per second. They can only be cache lookups.

**Storage**

- Posts: $200\text{M} \times 1\text{ KB} = 200\text{ GB}$ a day, about **73 TB a year**. Small.
- Media: $200\text{M} \times 20\% \times 2\text{ MB} = 80\text{ TB}$ a day, about **29 PB a year**. Large.
- Friend graph: each friendship is stored once per side, so rows $= 3\text{B} \times 300 = 900\text{B}$. At
  about 40 bytes a row that is **36 TB**, before replicas and indexes.
- Feed cache: 500 recent post IDs per active user at 16 bytes each:
  $2\text{B} \times 500 \times 16\text{ B} = 16\text{ TB}$ of memory, spread over many machines.

Three conclusions follow:

1. **Every feed load turns into hundreds of small graph reads.** Caching the graph is not optional.
2. **Media dominates storage**; it belongs in a blob store behind a CDN, never in the database.
3. **The graph itself is small enough to keep mostly in memory** (tens of TB), which is exactly what a graph
   cache does.

## 4. The API

Clients talk to us over HTTPS with a JSON (or GraphQL) API. Lists use a **cursor**, not a page number, because
feeds and comment threads change while you scroll.

| Method and path | What it does |
| --- | --- |
| `GET /v1/users/{id}` | A profile, with fields filtered by what the viewer may see. |
| `POST /v1/friend-requests` | Send a request: `{"to": 42}`. |
| `POST /v1/friend-requests/{id}/accept` | Accept. Creates the friendship in both directions. |
| `DELETE /v1/friends/{user_id}` | Unfriend. Removes both directions. |
| `GET /v1/users/{id}/friends?cursor=...` | A friend list, if the viewer may see it. |
| `POST /v1/media` | Get a pre-signed upload URL; the client uploads straight to blob storage. |
| `POST /v1/posts` | Create a post: text, media IDs, `audience` (`public`, `friends`, `only_me`, or a list ID). Takes an `Idempotency-Key` header. |
| `GET /v1/feed?cursor=...&limit=20` | The next page of the ranked feed. |
| `PUT /v1/posts/{id}/reaction` | Set my reaction: `{"type": "love"}`. `PUT` because a user has at most one reaction per post. |
| `POST /v1/posts/{id}/comments` / `GET .../comments?cursor=...` | Add or list comments. |
| `GET /v1/notifications?cursor=...` | My notifications, newest first. |
| `GET /v1/search?q=...` | People, Pages and posts the viewer may see. |

The **idempotency key** matters on mobile: if the network drops after the server saved the post but before the
reply arrived, the app retries with the same key and gets the original result instead of a duplicate post.

## 5. High-level design

[![High-level architecture: users reach the API gateway, which routes feed reads to the feed service (backed by the feed cache, ranking service and graph cache) and writes to the post service; posts go to the graph cache over sharded MySQL and to an event bus that drives fan-out workers and notifications; media is served by a CDN from a blob store](/img/system-design/facebook/01-architecture.png)](/img/system-design/facebook/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **API gateway:** checks your login token, applies rate limits, routes the request.
- **Feed service:** builds your feed: collects candidate posts, filters them by privacy, asks for ranking,
  returns a page.
- **Feed cache:** for each active user, a short list of recent post IDs pushed there by fan-out.
- **Ranking service:** scores candidates with machine-learned models.
- **Post service:** creates, edits and deletes posts, comments and reactions.
- **Graph cache (TAO) over sharded MySQL:** the social graph and all small objects (users, posts, comments),
  stored in MySQL and served from a large cache in front of it.
- **Event bus** (a Kafka-style log): "post created", "reaction added", "friend request accepted". It decouples
  the write that the user waits for from all the follow-up work.
- **Fan-out workers:** copy new post IDs into friends' feed caches.
- **Notifications:** group related events, then push to phones.
- **Blob store + CDN:** photo and video bytes, served from servers near the user.

The most important idea in the picture: **the user waits only for the post to be saved.** Fan-out,
notifications and search indexing all happen after, from the event bus.

## 6. The social graph: storing friendships

### Adjacency lists, stored in both directions

A graph can be stored as a matrix (a cell for every pair of users) or as **adjacency lists** (for each user,
the list of their friends). With 3 billion users and 300 friends each, a matrix would be $3\text{B} \times
3\text{B}$ cells, almost all empty. Adjacency lists store only the edges that exist.

Because friendship is mutual, we store **both directions**: one row `(alice, bob)` and one row `(bob, alice)`.
Why store it twice?

- The question we ask most is "who are **my** friends?". If each user's friends live together, sorted by the
  key `(user_id, friend_id)`, that is one range read on one shard.
- We shard by `user_id`. If we stored only `(alice, bob)`, finding Bob's friends would mean searching every
  shard for rows where `friend_id = bob`.

The price: an accept or an unfriend now writes two rows, possibly on two different shards. Those two writes
are not one database transaction. A typical design writes the first side, then the second, and puts the second
into a retry queue if it fails; a background job compares both sides and repairs any half-written friendship.
A brief moment where Alice sees Bob as a friend but Bob does not yet see Alice is acceptable.

### The friend request lifecycle

| State | Stored as | Moves to |
| --- | --- | --- |
| No relationship | nothing | **Requested**, when Alice sends a request |
| **Requested** | one `friend_requests` row `(alice, bob, pending)` | **Friends** (Bob accepts), or nothing (Bob declines, Alice cancels) |
| **Friends** | two `friendships` rows, and the request row is marked accepted | nothing (either unfriends: both rows deleted) |
| **Blocked** | one `blocks` row `(alice, bob)` | Blocking also removes any friendship and request; nothing (unblock) |

Accepting checks the 5,000-friend limit on both sides, and both checks plus the writes are done by one service
so two simultaneous accepts cannot push someone over the cap.

### The data model

[![Data model in three groups: users with friendships, friend_requests and blocks; friend_lists and friend_list_members for custom audiences; posts with comments, reactions and post_counters; posts reference an optional audience list](/img/system-design/facebook/02-data-model.png)](/img/system-design/facebook/02-data-model.png)

*Select the diagram to zoom in and move around.*

Notes on the model:

- **Every table is keyed for the question it answers.** `friendships` by `(user_id, friend_id)`, `reactions`
  by `(post_id, user_id)` so a user can have only one reaction per post, and re-sending the same reaction is
  harmless.
- **`posts.audience`** holds `public`, `friends`, `only_me` or `custom`; for `custom`, `audience_list_id` points
  at a friend list. The privacy check (section 11) reads these two columns.
- **`post_counters`** keeps totals so that showing "1.2K reactions" never counts rows (section 12).
- **IDs are 64-bit and globally unique**, generated without a central counter (for example a timestamp plus a
  shard number plus a sequence, like Twitter's Snowflake). If the shard number is inside the ID, any service
  can tell which shard owns an object just by looking at its ID.

### Objects and associations: the TAO model

Facebook's TAO paper describes a simpler, more general way to see all of this. There are only two things:

| Concept | Shape | Examples |
| --- | --- | --- |
| **Object** | `id → (type, key-value data)` | a user, a post, a comment, a photo, a Page |
| **Association** (a typed, directed edge) | `(id1, type, id2) → (time, data)` | `alice FRIEND bob`, `alice AUTHORED post9`, `bob LIKES post9`, `comment7 ON post9` |

An **association list** is every edge of one type leaving one object, sorted newest first: "Alice's friends",
"the comments on post 9", "who liked post 9". Nearly every screen is built from a handful of queries:

- `assoc_range(post9, COMMENT, 0, 20)`: the 20 newest comments.
- `assoc_count(post9, LIKED_BY)`: how many likes.
- `assoc_get(alice, FRIEND, [bob])`: is Bob Alice's friend? (A point lookup, used constantly by privacy checks.)

Many association types have an **inverse**: `FRIEND` is its own inverse, `LIKES` has `LIKED_BY`. Writing one
side automatically writes the other, which is exactly the "store both directions" rule above, done once in the
storage layer instead of in every service. Objects live on the shard given by their ID, and an association is
stored on the shard of its `id1`, so "all of Alice's edges" is again a single-shard read.

## 7. Deep dive: the graph cache

Reads outnumber writes enormously (the TAO paper reported that well over 99% of its requests were reads), and
each feed load needs hundreds of them. So the graph is served from memory, with MySQL as the durable store
underneath. The TAO paper describes a two-tier cache; here is the idea in a typical shape.

[![Graph cache tiers across two regions: in region B, web servers read and write through follower caches, which send misses and writes to a leader cache; the leader reads misses from a local MySQL replica and forwards writes to the leader in region A, which writes to the MySQL primary; the primary replicates asynchronously to the replica](/img/system-design/facebook/03-tao.png)](/img/system-design/facebook/03-tao.png)

*Select the diagram to zoom in and move around.*

- **Follower caches** are many, and web servers talk only to them. Adding followers adds read capacity.
- **One leader cache per shard** (per region) sits between the followers and the database. All misses and all
  writes for that shard go through it, so the database sees at most one request for a hot item, not one from
  every follower. This protects MySQL from a **thundering herd** (thousands of simultaneous misses for the same
  popular item).
- **One region is the primary for each shard.** Writes made anywhere are forwarded to that region's leader,
  which writes to the MySQL primary. Other regions read from their local MySQL replica, which receives changes
  by asynchronous replication.
- **Invalidation:** after a write, the leader tells followers to update or drop their copy. The follower that
  forwarded the write updates itself at once, so the user who wrote sees their own change (more on this in
  section 16).

Why not a plain key-value cache like Memcached in front of SQL queries? A graph cache understands association
lists: when Bob likes post 9, it can **append** Bob to the cached `LIKED_BY` list and bump the cached count,
instead of throwing the whole list away and re-reading it from the database.

## 8. Flow 1: publishing a post

Alice posts "Got the job!" to her friends.

[![Sequence for publishing: Alice's app calls the post service, which writes the post and the authored edge to the graph store, publishes PostCreated to the event bus and replies 201 Created; then a fan-out worker consumes the event, loads Alice's about 300 friend IDs and adds the post ID to each friend's feed list in batches, skipping inactive friends](/img/system-design/facebook/04-post-fanout.png)](/img/system-design/facebook/04-post-fanout.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Alice waits only for steps 1 to 5**: one durable write and one event. Her post appears on her own profile
  immediately because she reads it back from the same store.
- **The event and the database write must not disagree.** If the post is saved but the event is lost, nobody's
  feed gets it. A common fix is the **outbox pattern**: write the event into an `outbox` table in the same
  database transaction as the post, and let a relay publish it to the bus. Alternatively, publish events by
  reading the database's own change log.
- **Media is uploaded first**, straight to the blob store with a pre-signed URL, so the post request carries
  only small media IDs.
- **Fan-out stores IDs, not posts.** Each friend's feed list holds `(post_id, author_id)` pairs (the time is inside the post ID); the post itself
  is fetched (from cache) when the feed is read. Edits and deletes then need no fan-out at all.

## 9. Deep dive: fan-out on write vs fan-out on read

There are two ways to get Alice's post into Bob's feed.

| | Fan-out on write (push) | Fan-out on read (pull) |
| --- | --- | --- |
| **When the work happens** | When Alice posts: write the post ID into each friend's feed list | When Bob opens the app: fetch recent posts from each of his friends and merge |
| **Reading the feed** | Fast: one read of Bob's precomputed list | Slow: hundreds of reads, one per friend, then a merge |
| **Posting** | Expensive for authors with huge audiences | Cheap: just save the post |
| **Wasted work** | Pushes to inactive users who may never read it | None: only computes feeds that are actually read |
| **Freshness** | Delay of a few seconds while workers catch up | Always current |

The friend graph makes push attractive: a profile has at most 5,000 friends, so the worst case is bounded.
But Facebook also has **Pages and public figures followed by millions**, and pushing every post from a news Page
into 50 million lists would be a write storm. So a typical design is **hybrid**:

[![Hybrid fan-out decision: on PostCreated, if the author has a huge audience (a Page with 10k+ followers) keep the post only in the author's outbox to be merged at read time; otherwise load the friend list and, for each friend seen in the last 30 days, prepend the post ID to their feed list, skipping inactive friends whose feed is built at next login](/img/system-design/facebook/05-fanout-choice.png)](/img/system-design/facebook/05-fanout-choice.png)

*Select the diagram to zoom in and move around.*

- **Normal users:** push to active friends. Most feed candidates are then already waiting in Bob's list.
- **Huge audiences** (big Pages, celebrities): pull. At read time, the feed service fetches recent posts from
  the outboxes of the few big accounts Bob follows and merges them in. Bob follows only a handful of those, so
  this adds a few reads, not thousands.
- **Inactive friends:** skip. If someone has not opened the app in 30 days, we build their feed by pulling
  when they return. This removes a large share of the push work.
- **Feed lists are capped** (for example 500 IDs) and live in memory. If a list is lost, it is rebuilt by
  pulling, so the feed cache is a speed-up, not the source of truth.

The threshold (10,000 here) is a tuning knob, not a law. Real systems at this scale often lean further towards
read-time assembly than this sketch; Facebook has spoken publicly about aggregating feeds at read time from
in-memory indexes of recent activity. In an interview, the point is to name both costs and explain where you
draw the line.

## 10. Flow 2: reading and ranking the feed

Bob opens the app. A feed page is built in four stages, each one narrowing the set so the expensive work runs
on as few posts as possible.

[![Building one feed page: friends' posts from the feed cache and recent posts from Pages and groups pass through a privacy filter, a light ranker cuts thousands to about 500 using cheap features, a heavy ranker predicts likes, comments and hides using rich features, and a final mix applies diversity rules to produce the top 20 plus a cursor](/img/system-design/facebook/06-feed-ranking.png)](/img/system-design/facebook/06-feed-ranking.png)

*Select the diagram to zoom in and move around.*

1. **Gather candidates (aggregation).** Read Bob's feed list (pushed IDs), pull recent posts from the big Pages
   and groups he follows, and add a few other sources (posts friends commented on, for example). This yields
   hundreds to a few thousand candidates.
2. **Filter.** Drop anything Bob may not see (privacy, blocks), anything deleted, and anything he has already
   scrolled past. Privacy comes **before** ranking so no model ever sees a post Bob is not allowed to see.
3. **Rank in two passes.** A **light ranker** (a small, fast model) scores every candidate with cheap features
   and keeps a few hundred. A **heavy ranker** (a large model) then predicts, for each survivor, the probability
   that Bob will like, comment, share, or hide it, and combines these into one score. Typical features:
   **affinity** (how often Bob interacts with the author), the post's type and age, and how others are
   reacting to it.
4. **Mix.** Apply rules on top of the scores: do not show five posts from the same friend in a row, mix photos
   and text, insert ads in fixed slots. Return the top 20 and a cursor.

The cursor points into a **ranked snapshot** stored for a few minutes, so the next page continues the same
ordering instead of re-ranking and showing duplicates. Pulling to refresh starts a new snapshot.

Then the page is **hydrated**: post IDs become posts, authors' names and photos, counts and Bob's own reaction,
all fetched from the graph cache in parallel batches.

## 11. Deep dive: privacy on every read

Every object that leaves the server, whether a post, a comment, a photo or a profile field, passes a privacy
check for this viewer. Checking at write time is not enough: Alice can change a post from Public to Friends
after it was fanned out, or unfriend Bob, or block him.

[![Privacy check: for viewer V and post P written by A, first check whether either blocked the other (yes hides the post), then whether V is A or the post is public (yes shows it), then whether V is in the audience as a friend or list member (yes shows it, no hides it)](/img/system-design/facebook/07-privacy.png)](/img/system-design/facebook/07-privacy.png)

Design rules for the check:

- **Cheapest checks first, and deny by default.** Blocks and "is it my own post?" are single lookups. The
  audience check is `assoc_get(A, FRIEND, [V])` for Friends, or membership in a friend list for custom audiences.
- **Hidden means absent.** A hidden post is dropped silently, as if it did not exist. Returning "permission
  denied" would tell Bob that a post exists.
- **Everything is cached.** Over 100 million checks per second (section 3) is only possible because each check
  is a few in-memory graph lookups, batched for the whole candidate set.
- **One privacy library, used everywhere.** Feed, search, profile, comments and notifications all call the same
  rules. Re-implementing them per service is how leaks happen.
- **Comments inherit.** A comment is visible only if its post is visible to the viewer, plus the commenter's own
  block rules.
- **Changes take effect on read.** Because the check runs at read time against current data, changing an audience
  or unfriending someone hides the post at once, even if its ID is still in old feed lists.

Friends-of-friends audiences are more expensive: "is V a friend of any of A's friends?" means intersecting two
friend lists (up to 5,000 each). Both lists are sorted, so a merge-style intersection is fast, and the result
can be cached for the pair.

## 12. Deep dive: likes, comments and reaction counters

A viral post can receive tens of thousands of reactions a second. Two separate problems hide here.

**Who reacted** is a set: the row `(post_id, user_id) → type`. Its primary key makes reacting idempotent: a
retried request or a double tap updates the same row instead of adding a second one.

**How many reacted** is a counter, and incrementing one database row 50,000 times a second creates a hot spot:
every write locks the same row on the same shard. Common fixes:

- **Sharded counters:** keep, say, 64 sub-counters per hot post and add to a random one; the total is their sum.
  Reads sum 64 numbers (and cache the result).
- **Batching through the event bus:** reactions go onto the bus; a consumer adds them up for a second and writes
  one `+873` instead of 873 separate `+1` writes.
- **Approximate display:** the app shows "12K", so a total that is a second behind is fine. Bob's **own**
  reaction is read from the set, so his tap shows instantly.

A periodic job recounts from the set and repairs any counter drift caused by failures. Comments are an
association list per post, newest or "most relevant" first, paged with a cursor; replies are a list per comment.

## 13. Media: photos and video

- The app asks for a **pre-signed URL** and uploads directly to the **blob store**, so large uploads never pass
  through the API servers.
- An upload event triggers **processing workers**: strip location metadata, create several sizes (thumbnail,
  feed, full screen), and transcode video into several bitrates for adaptive streaming.
- Media is immutable and addressed by ID, so it caches perfectly on a **CDN**. Most views of a photo happen in
  its first days, so older media moves to cheaper storage. Facebook has published papers on both ends of this:
  Haystack for hot photo serving and f4 for "warm" blobs stored more cheaply.
- Media URLs are signed and short-lived where privacy matters, so a URL copied out of a friends-only post stops
  working later.

## 14. Notifications

Notifications are another consumer of the event bus.

1. An event arrives: "Carol reacted to Alice's post".
2. The notification service decides who cares (Alice), checks Alice's settings and the privacy rules.
3. It **groups** related events by a key such as `(recipient, post, type)` over a short window, so Alice gets
   "Carol and 12 others reacted to your post" instead of 13 separate pings.
4. It stores the notification in Alice's notification list (newest first) and, if she is not active right now,
   sends a phone push through Apple Push Notification service or Firebase Cloud Messaging.

Rate limits per user protect people from being buzzed every few seconds by a viral post.

## 15. Search, at a high level

Search runs over people, Pages, groups and posts, and it must respect privacy and the graph: a "Sam" who is
your friend should rank above a stranger called Sam.

- An **indexer** consumes events from the bus and updates **inverted indexes** (for each word, the list of
  matching objects), sharded across many machines.
- **Typeahead** (results as you type) uses prefix indexes and boosts results close to you in the graph: friends
  first, then friends of friends.
- Results pass the **same privacy check** before they are returned.

Facebook's Unicorn paper describes a search system built on this idea: inverted indexes whose entries include
graph edges, so a query like "friends of Alice who live in London" becomes intersections of posting lists.

## 16. Multi-region replication and read-your-writes

Users live everywhere, so servers run in several regions, each with a full copy of the data. As in section 7,
each shard has one **primary region** that takes writes; other regions hold read-only replicas fed by
asynchronous replication, usually a fraction of a second to a few seconds behind.

That creates a classic bug. Bob, in Europe, posts a comment. The write goes to the primary in the US. Bob's next
request reads from the European replica, which has not received it yet, and his comment seems to vanish. The
fix is **read-your-writes consistency**: a user always sees their own writes, even if others see them a moment
later. The Memcache paper describes a "remote marker" technique for this:

[![Read-your-writes from a replica region: Bob's EU web server sets a marker in the EU cache, writes to the US primary, deletes the cached key and replies; when Bob reloads, the cache misses and finds the marker, so the server reads from the US primary instead of the stale EU replica; later the replica catches up and the marker is cleared](/img/system-design/facebook/08-read-your-writes.png)](/img/system-design/facebook/08-read-your-writes.png)

*Select the diagram to zoom in and move around.*

- The marker says "this key was just written; the local replica may be stale".
- A read that misses the cache and finds the marker goes to the primary region: slower (it crosses an ocean),
  but correct. Without a marker, reads use the fast local replica.
- When replication delivers the write to the replica, the marker is removed and reads become local again.

Other common techniques: route a user to their **home region** for a few seconds after they write, or have the
client remember the timestamp of its last write and only read from replicas that have caught up to it.

What we do **not** need is strong consistency between different users. If Carol sees Bob's comment one second
after Bob does, nobody notices.

## 17. Caching layers, top to bottom

| Layer | What it caches | How it is kept fresh |
| --- | --- | --- |
| App on the phone | Last feed page, profile photos | Refreshed on open; shows old content instantly, then updates |
| CDN | Photo and video bytes | Immutable, so never invalidated, only expired |
| Feed cache | Recent post IDs per active user | Appended by fan-out; rebuilt by pulling if lost |
| Ranked snapshot | The ordering behind a feed cursor | Expires after a few minutes |
| Graph cache (TAO) | Objects, association lists, counts | Write-through via the leader; invalidations to followers and other regions |
| Look-aside cache (Memcached) | Results of other queries and computations | On write, **delete** the key (not set it); the next read refills it |

Two lessons from the Memcache paper that interviewers like:

- **Delete, do not update, on write.** Deletes are idempotent and safe to repeat; racing "set" operations can
  leave an old value in the cache forever.
- **Leases stop stampedes and stale sets.** On a miss, the cache gives one client a lease (a token) to refill the
  key; others wait briefly or get a slightly stale value. A refill whose key was deleted in the meantime is
  rejected, so an old value cannot overwrite a newer delete.

## 18. What breaks as it grows, and how to fix it

**The hot object.** A celebrity's post gets millions of reads and reactions. *Fix:* replicate hot keys across
many follower caches, sharded counters for its reactions, and pull (not push) fan-out for its author.

**The fan-out backlog.** A big event makes everyone post at once and fan-out workers fall behind. *Fix:* the
event bus absorbs the burst, workers auto-scale on lag, and posts by people you interact with most are fanned
out first. A few seconds of delay is invisible in a ranked feed.

**The shard that outgrew its machine.** Some users or Pages have far more edges than others. *Fix:* split shards
into many small logical shards from day one (thousands, mapped onto fewer machines) so you move logical shards
instead of re-hashing users.

**The half-written friendship.** One side of a friendship write failed. *Fix:* retries from a queue plus a
periodic job that compares both directions and repairs them.

**Cache cold start.** A region restarts and its empty caches send every read to MySQL. *Fix:* warm a new cache
from a healthy one before taking traffic, and lean on leases so each missing key causes only one database read.

**Ranking cost.** Heavy models on thousands of candidates for 700,000 feed loads a second is expensive. *Fix:*
the two-pass funnel, caching features, and precomputing parts of the feed for users likely to open the app soon.

## 19. Reliability and failure handling

| Risk | Defence |
| --- | --- |
| A post is saved but its event is lost | Outbox pattern or change-log capture: the event is derived from the committed write |
| An event is processed twice | Idempotent consumers: adding a post ID that is already in a list, or setting the same reaction, changes nothing |
| A cache tier fails | Followers are many and interchangeable; if a leader fails, followers send read misses straight to the database and writes to another member of the leader tier; a small spare ("gutter") pool can absorb a failed cache's traffic so the database is not flooded |
| A region fails | Another region is promoted to primary for its shards; users are routed to the nearest healthy region; recent unreplicated writes may need reconciling |
| The ranking service is slow | Time out and fall back to a simpler ordering (recent posts from close friends). A plain feed beats an error page |
| A privacy-rule bug | One shared privacy library, deny by default, tests on every rule, and audit logs of which rule allowed each view |

The guiding idea: **degrade, do not fail.** Missing counts, a less personal ranking or a slightly stale feed are
all acceptable; an empty screen or a privacy leak is not.

## 20. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Friendship storage | One row per friendship | Both directions | **Both directions**: "my friends" is one single-shard read; costs a second write |
| Graph storage | Graph database | Sharded MySQL + graph cache | **MySQL + cache**: proven at scale; the queries are simple one-hop lookups, not deep traversals |
| Feed fan-out | Push | Pull | **Hybrid**: push for normal users to active friends, pull for huge audiences and inactive readers |
| What fan-out stores | Whole posts | Post IDs | **IDs**: small, and edits, deletes and audience changes need no re-fan-out |
| Feed order | Newest first | Ranked | **Ranked**, with two passes to keep cost down; chronological is an option for users who want it |
| When to check privacy | At write (fan-out) | At every read | **Every read**: audiences, friendships and blocks change after posting |
| Counter updates | Exact, per reaction | Batched or sharded | **Batched / sharded**: avoids hot rows; the display is approximate anyway |
| Cross-region consistency | Strong | Eventual + read-your-writes | **Eventual**, with read-your-writes so users always see their own actions |

## Cheat sheet for last-minute revision

- **What makes Facebook different:** mutual friend graph (capped at 5,000), per-post audiences, ranked feed.
- **Graph = adjacency lists, both directions, sharded by `user_id`.** TAO model: objects and typed
  associations `(id1, type, id2)`, lists sorted by time, with `range`, `count` and point `get` queries.
- **Graph cache:** many followers per region, one leader per shard, MySQL underneath; one primary region per
  shard; reads are over 99% of traffic.
- **Posting:** save the post, emit an event (outbox pattern), reply; fan-out, notifications and indexing are
  asynchronous.
- **Fan-out:** hybrid. Push post IDs to active friends' feed lists; pull for big Pages and inactive users.
- **Feed read:** gather candidates → privacy filter → light ranker → heavy ranker → mix → hydrate; cursor over
  a stored ranked snapshot.
- **Privacy:** checked on every read, cheapest first, deny by default, hidden means absent, one shared library.
- **Counters:** set of reactions keyed `(post_id, user_id)` for idempotency; counts sharded or batched; show
  approximate totals.
- **Multi-region:** async replicas; read-your-writes with a remote marker or home-region routing.
- **Caching:** client, CDN, feed cache, graph cache, look-aside cache; delete on write; leases against stampedes.
- **Numbers:** ~2B DAU, ~230K feed loads/s (~700K peak), ~2,300 posts/s, ~230K reactions/s, ~36 TB of
  friendship rows, ~80 TB of new media a day.

## Practice questions

1. **How would you build "People you may know"?** Offline, for each user, count friends of friends (mutual
   friends), boost shared schools, workplaces and contacts, drop people already friends, requested or blocked,
   and store the top 100 per user. Refresh daily; serve from a cache.
2. **Alice changes an old post from Public to Friends. What has to happen?** Only the post's `audience` changes.
   Because privacy is checked on every read, strangers stop seeing it immediately; feed lists that still hold the
   ID are filtered out at read time. Search results are filtered the same way, and the index is updated
   asynchronously.
3. **Bob unfriends Alice. Should we remove her posts from his feed list?** Not necessary for correctness: the
   privacy check hides friends-only posts at once. A background clean-up can remove the stale IDs to save space.
4. **How would you show "Carol, Dave and 3 other friends liked this"?** Intersect the post's `LIKED_BY` list with
   the viewer's friend list (both sorted, so a merge is fast) and cap the work: check only the viewer's closest
   friends or the most recent likers.
5. **How would you add a chronological "Most recent" feed?** Skip the ranking stages: merge candidates by time,
   still apply the privacy filter, and paginate with a `(time, post_id)` cursor.
6. **A region goes down for 10 minutes. What do users notice?** Their requests move to another region, which is
   slower for them. Shards whose primary was in that region are promoted elsewhere; writes made just before the
   failure may arrive late or need reconciling. Feeds keep working from caches and replicas.
