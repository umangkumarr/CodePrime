---
title: "Design Reddit (communities, posts, voting, threaded comments)"
description: "Design a Reddit-scale forum: subreddits, voting at scale, hot/top/new ranking, precomputed listings, threaded comment trees, moderation, anti-spam, viral posts."
difficulty: "Medium"
sidebar:
  label: "Reddit (communities and voting)"
tags: ["Ranking", "Caching", "Counters", "Trees", "Moderation"]
---

Reddit looks like a list of links with arrows next to them. Underneath, it is several hard systems in one. It is
a **noticeboard** split into hundreds of thousands of communities, a **ballot box** that takes millions of votes
an hour and must count each person once, a **league table** that re-sorts itself as votes arrive and posts age, a
**family tree** of comments that can be thousands of replies deep and wide, and a **neighbourhood watch** of
volunteer moderators and spam filters keeping it all usable.

This case study builds that system from the ground up. We start with the vocabulary, design the service layer by
layer, go deep on voting, ranking and comment trees, and finish with what happens when one post goes viral and a
one-page revision sheet.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Reddit in 5 minutes: the vocabulary

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Subreddit** (`r/name`) | A community about one topic, with its own rules and moderators | A club with its own noticeboard |
| **Membership** (subscription) | A user has joined a subreddit, so its posts appear in their home feed | Your club membership card |
| **Post** (submission) | A title plus a link, text, image or video, posted into one subreddit | A notice pinned to the board |
| **Comment** | A reply to a post or to another comment; replies nest into a tree | A conversation that branches |
| **Vote** | Up (+1) or down (−1) on a post or comment; one per user per item, changeable | A show of hands |
| **Score** | Upvotes minus downvotes | The tally |
| **Listing** | An ordered page of posts: a subreddit or the home feed, sorted by *hot*, *new*, *top* or *controversial* | The order notices are pinned in |
| **Karma** | A user's running total of the score their posts and comments earned | Reputation in the club |
| **Moderator** | A volunteer who enforces a subreddit's rules: removes posts, bans users | The club committee |

Three facts shape the whole design:

1. **Reads massively outnumber writes.** Most people scroll; few post. Listings must be cheap to read.
2. **Votes are the hottest write.** Every scroll invites a tap on an arrow, and every vote can change a post's
   position in several listings.
3. **Order depends on time as well as votes.** A good post from yesterday must eventually give way to a good post
   from this morning, so rankings change even when nobody votes.

## 2. Requirements

### Functional (what users can do)

- **Communities:** create a subreddit, join or leave one, read its rules.
- **Posts:** submit a text, link, image or video post to a subreddit; edit or delete your own.
- **Listings:** view a subreddit or your home feed (posts from subreddits you joined), sorted by hot, new, top
  (past hour, day, week, all time) or controversial. Logged-out visitors see a general popular feed.
- **Voting:** upvote or downvote posts and comments; change or cancel your vote; see scores.
- **Comments:** reply to a post or to any comment, to any depth; sort comments; collapse a thread.
- **Moderation:** report content; moderators remove posts, ban users and set automatic rules.
- **Search** for posts and communities.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Latency** | Listing pages in under 200 ms; a vote acknowledged in under 100 ms | Scrolling and tapping must feel instant |
| **Availability** | 99.95% for reading; posting and voting can degrade briefly | A read-only Reddit is far better than no Reddit |
| **Scale** | Assume ~100 million daily active users, ~100,000 active communities | A large, global social site |
| **Consistency** | Your own vote shows at once (read-your-writes); everyone else's view of a score may lag a few seconds | Exact real-time scores are not worth their cost |
| **Integrity** | One vote per user per item; resistant to bots and vote rings | Ranking is the product: rigged votes ruin it |
| **Durability** | Never lose a post or comment once accepted | They are people's words |

### Out of scope

Chat and direct messages, ads, awards and payments, live streaming, and the recommendation feed for content you
did not join. Mention them in an interview, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resources dominate**.

**Assumptions:** 100 million daily active users. Each loads **30** listing pages and casts **10** votes a day.
Users create **1 million** posts and **10 million** comments a day. Peak traffic is **3×** the average. A day has
about 86,400 seconds, call it $10^5$ for quick maths.

**Traffic**

- Listing reads: $100\text{M} \times 30 = 3\text{B}$ a day, about **35,000 per second**, roughly **100,000 per
  second** at peak.
- Votes: $100\text{M} \times 10 = 1\text{B}$ a day, about **12,000 per second**, roughly **35,000 per second** at
  peak.
- Comments: $10\text{M}$ a day, about **115 per second**. Posts: $1\text{M}$ a day, about **12 per second**.

So votes are about 100× more frequent than comments, and listing reads are about 3× more frequent than votes.

**Storage per day**

- Votes: a row is a user ID, an item ID, a direction and a timestamp, about **50 bytes** with overhead.
  $1\text{B} \times 50\text{ B} = 50\text{ GB}$ a day, about **18 TB a year**. Small per row, huge in count.
- Comments: $10\text{M} \times 500\text{ B} = 5\text{ GB}$ a day. Posts: $1\text{M} \times 2\text{ KB} = 2\text{ GB}$
  a day.
- Media: if 20% of posts carry a 2 MB image, $200\text{K} \times 2\text{ MB} = 400\text{ GB}$ a day, far more with
  video.

**Listing cache**

Keep, for each active subreddit, the top **1,000** post IDs for each of **3** common sorts, at about **16 bytes**
per entry (ID + rank): $100\text{K} \times 3 \times 1{,}000 \times 16\text{ B} \approx 4.8\text{ GB}$. That fits in
the memory of a small cache cluster.

Three conclusions follow:

1. **Precompute listings.** 100,000 reads a second cannot each sort a subreddit's posts from scratch, but a few GB
   of ready-sorted lists fits in memory.
2. **Votes need their own path.** They are the dominant write, so recording a vote must be a tiny, fast
   operation, with counting and re-ranking done in the background.
3. **Media goes to object storage and a CDN** (content delivery network: servers near users that cache files),
   never through the databases.

## 4. The API

Clients (web, Android, iOS) talk to us over HTTPS with a JSON API.

| Method and path | What it does |
| --- | --- |
| `GET /v1/r/{subreddit}/posts?sort=hot&after=<cursor>&limit=25` | One page of a subreddit listing. `sort` is `hot`, `new`, `top` (with `t=day`, `week`…) or `controversial`. |
| `GET /v1/home?sort=hot&after=<cursor>` | The signed-in user's home feed, merged from their subreddits. |
| `POST /v1/r/{subreddit}/posts` | Submit a post: title, body or URL, media IDs, plus an `Idempotency-Key` header so a retry does not post twice. |
| `POST /v1/media` | Get a pre-signed upload URL; the client uploads straight to object storage and gets a `media_id`. |
| `POST /v1/vote` | `{"item": "post:123", "dir": 1}`. `dir` is `1`, `-1` or `0` (remove). Setting the same value twice is harmless. |
| `GET /v1/posts/{id}/comments?sort=best&depth=8&limit=200` | The post and the first part of its comment tree. |
| `GET /v1/comments/more?post={id}&children=a,b,c` | Load the hidden replies behind a "load more" link. |
| `POST /v1/comments` | `{"post": 123, "parent": 456, "body": "..."}`; `parent` is empty for a top-level comment. |
| `POST /v1/r/{subreddit}/subscribe` | Join (or, with `DELETE`, leave) a subreddit. |
| `POST /v1/reports` | Report a post or comment for breaking a rule. |

Two design points hide in this table:

- **The vote API sets a value, it does not add one.** `dir: 1` means "my vote is up", not "add one up". Sending it
  twice (a double tap, a mobile retry) leaves the same state. Operations that give the same result however many
  times they run are called **idempotent**, and they make retries safe.
- **Listings use a cursor** (`after=<last post ID seen>`), not a page number. Rankings shift constantly; with
  `?page=3`, a post moving up would make you see it twice or miss another. The cursor says "continue after this
  post".

## 5. High-level design

[![High-level architecture: users reach an API gateway that routes to comment, listing, post, vote and search services, each with its own store; posts and votes emit events into an event log that feeds ranking workers, which update the listing cache, and the anti-spam system; media is served from a CDN backed by an object store](/img/system-design/reddit/01-architecture.png)](/img/system-design/reddit/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **API gateway:** checks who you are, applies rate limits, routes to the right service.
- **Listing service:** serves subreddit pages and the home feed by reading ready-sorted ID lists from the
  **listing cache**, then filling in post details from a post cache.
- **Post service:** accepts, edits and removes posts; the **posts + subreddits DB** is the source of truth for
  posts, communities and memberships.
- **Vote service:** records one vote per user per item in the **vote store** and returns immediately.
- **Event log** (for example Kafka): an ordered, durable stream of "post created", "vote changed", "post removed".
  Everything that reacts to change reads from it, so writers never wait for readers.
- **Ranking workers:** turn vote and post events into new scores and ranks, and update the listing cache.
- **Comment service + comment store:** stores and serves comment trees, sharded by `post_id` so one post's whole
  thread lives together.
- **Search service:** queries a search index that an indexer keeps up to date from the event log.
- **Anti-spam + abuse:** watches all events for bots, spam and vote manipulation, and can remove content or void
  votes.
- **CDN + object store:** images and video, uploaded directly by clients and served from edge caches.

The single most useful idea in this design: **separate recording a fact from reacting to it.** Saving a vote is
one small upsert. Recounting the score, re-ranking listings, checking for fraud and updating karma all happen
afterwards, from the event log, at their own pace.

## 6. Low-level design: the data model

[![Data model: users and subreddits are linked by memberships; subreddits contain posts; posts have comments, and each comment has a parent comment and a materialised path; post_votes and comment_votes hold one row per user per item](/img/system-design/reddit/02-data-model.png)](/img/system-design/reddit/02-data-model.png)

*Select the diagram to zoom in and move around.*

Five design decisions hide in this diagram.

**1. Votes have a composite primary key.** The key of `post_votes` is `(post_id, user_id)`. The database itself
guarantees one row per user per post, so a double vote is impossible by construction, not by careful code.

**2. Counters live on the item.** `ups`, `downs` and `comment_count` are stored on the post. Counting a million
vote rows every time someone views a post would be absurd; instead the counters are updated as votes arrive (see
section 7) and can be rebuilt from the vote rows if they ever drift.

**3. Comments know their parent and their path.** `parent_id` points at the comment being replied to (empty for a
top-level comment), and `path` records the whole chain of ancestors. Section 10 explains why we keep both.

**4. Memberships are indexed both ways.** "Which subreddits has Bob joined?" (for the home feed) and "how many
members does `r/cooking` have?" are both common. Store `(user_id, subreddit_id)` as the key and keep
`member_count` as a counter on the subreddit, rather than counting members on demand.

**5. Posts carry a `status`.** Live, in the mod queue, removed or deleted (section 11). A removed post is hidden,
not erased, so moderators can review it and appeals can restore it.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Users, subreddits, memberships, posts | Structured rows, moderate volume, need transactions and secondary indexes | Sharded relational DB (PostgreSQL, MySQL) | Rich queries, constraints, familiar tooling |
| Comments | Billions of rows, always read by `post_id` | Relational DB or wide-column store sharded by `post_id` | One post's thread on one shard, read as a range |
| Votes | Tens of billions of tiny rows, point lookups by `(item, user)` | Wide-column or key-value store (Cassandra, ScyllaDB, DynamoDB) | Cheap writes at huge volume, scales horizontally |
| Listings, hot counters, post cache | Sorted ID lists, small objects, very hot | Redis (sorted sets) or Memcached | In-memory reads in under a millisecond |
| Events | Ordered, durable streams | Kafka | Replay, many independent consumers |
| Media | Large immutable files | Object storage + CDN | Cheapest per byte, served near users |
| Search | Inverted index | Elasticsearch / OpenSearch | Full-text queries |

## 7. Deep dive: voting at scale

### Recording a vote

[![Vote sequence: Bob's app sends POST /vote; the vote service upserts the (Bob, P) row, learns the previous value was 0, publishes VoteChanged with delta +1 and returns 200 OK; later the score aggregator sums a batch of deltas for P and writes the new score and hot rank to the listing cache](/img/system-design/reddit/03-vote.png)](/img/system-design/reddit/03-vote.png)

*Select the diagram to zoom in and move around.*

Step by step:

1. The app colours the arrow **immediately** (an *optimistic update*), so Bob sees his vote without waiting.
2. The vote service **upserts** the row `(Bob, P)`: insert it, or update it if it already exists, and return the
   old value. Because the key is `(user, item)`, there can only ever be one row.
3. From the old and new values it computes the **delta**, the change in the score:

   | Old vote | New vote | Change to ups | Change to downs | Score delta |
   | --- | --- | --- | --- | --- |
   | none (0) | up (+1) | +1 | 0 | +1 |
   | up (+1) | down (−1) | −1 | +1 | −2 |
   | down (−1) | none (0) | 0 | −1 | +1 |
   | up (+1) | up (+1) | 0 | 0 | 0 (a retry: nothing to do) |

4. It publishes `VoteChanged(P, delta)` to the event log and answers `200 OK`. Bob's part is over.
5. The **score aggregator** consumes vote events, adds up the deltas per post over a short window (say one
   second), and applies **one** counter update per post per window, then recomputes the post's rank.

### Why not just `UPDATE posts SET ups = ups + 1`?

That works on a small site. At scale it fails in two ways. First, a popular post receives thousands of votes a
second, and every one would lock the same row: a **hot row** that serialises all of them. Second, the vote and
the counter would need to change together in one transaction across two stores. Batching deltas in the aggregator
turns 5,000 updates a second on one row into one update a second, and the event log makes the pipeline
**at-least-once** (no event is lost, but one might be processed twice).

To stop a replayed event being counted twice, the aggregator records the event-log **offset** (position) it has
applied for each partition together with the counter update. On restart it continues after that offset. If a
counter ever drifts, it can be rebuilt by summing the vote rows, because the vote rows are the source of truth and
the counters are only a summary.

### Eventual consistency, and why it is fine

After Bob votes, other users may see the old score for a second or two. Nobody can tell the difference between
4,212 and 4,213 points. What people do notice is their **own** vote vanishing, so the app keeps its optimistic
state, and when it reloads, the listing service fetches Bob's own votes for the posts on screen (step 8 in the
home-feed diagram in section 9). That is **read-your-writes** consistency for the voter and eventual consistency
for everyone else.

Reddit has said publicly that the up and down numbers it displays are slightly **fuzzed** (randomly blurred) to
make life harder for spam bots checking whether their votes counted. It is a nice example of deliberately giving
up exactness: the true counts drive ranking; the displayed ones only need to be roughly right.

## 8. Deep dive: ranking algorithms

A listing is only as good as its sort order. Each sort answers a different question.

| Sort | Question it answers | Sort key |
| --- | --- | --- |
| **New** | What was posted most recently? | `created_at`, newest first |
| **Top** (hour, day, week, all) | What scored highest in this time window? | Score, among posts created in the window |
| **Hot** | What is good **and** recent right now? | A blend of score and age (below) |
| **Controversial** | What is both loved and hated? | Many votes, split close to 50/50 |
| **Best** (comments) | Which replies are most likely good, given few votes? | A confidence bound on the upvote ratio |

### Hot: score versus age

The problem: if we sort by score alone, a post from last year with 50,000 points sits on top forever. If we sort by
time alone, quality does not matter. We want **a post's rank to rise with votes but fall as it ages**.

The ranking function in Reddit's original open-source code (released in 2008) is a good model to learn:

$$
\text{hot} = \operatorname{sign}(s) \cdot \log_{10}\big(\max(|s|, 1)\big) + \frac{t}{45{,}000}
$$

where $s$ is the score (ups − downs) and $t$ is the post's creation time in seconds since a fixed date. Why each
part is there:

- **The logarithm makes early votes count most.** Going from 1 to 10 points adds 1 to the rank; so does going from
  1,000 to 10,000. The first few votes decide whether a post gets noticed; after that each extra vote matters less.
- **The time term uses the creation time, not "now".** Every post's time bonus is fixed when it is posted, and newer
  posts simply have bigger bonuses. 45,000 seconds is 12.5 hours, so **a post must earn 10× the score to beat a
  post 12.5 hours younger.**
- **A big benefit:** because the rank does not depend on the current time, a post's rank only changes when **its
  votes** change. We do not need to recompute every post every minute just because time passes; old posts sink
  naturally because new posts arrive with bigger time bonuses.

A worked example. Post A was posted 12.5 hours ago and has 1,000 points: $\log_{10} 1000 = 3$. Post B was posted now
with 100 points: $\log_{10} 100 = 2$, but its time term is larger by $45{,}000 / 45{,}000 = 1$. They tie. If B
reaches 101 points, it overtakes A.

Variants are easy to reason about: a smaller divisor makes the feed churn faster; using upvotes alone ignores
downvotes; some sites (Hacker News, for example) instead divide by a power of the age, which does depend on "now"
and so needs periodic recomputation.

### Top, new and controversial

- **New** needs no maths: append the post ID to the front of the subreddit's new list.
- **Top of the day** keeps a list sorted by score, holding only posts created in the last 24 hours; a small
  cleanup job drops posts that age out. **Top of all time** changes slowly and can be recomputed in batch.
- **Controversial** rewards many votes that are evenly split. Reddit's old code used, roughly,
  $(\text{ups} + \text{downs})^{\text{balance}}$, where balance is the smaller count divided by the larger. 100 up
  and 90 down gives $190^{0.9} \approx 112$; 1,000 up and 10 down gives $1010^{0.01} \approx 1.07$.

### Best (for comments): do not trust small samples

Is a comment with 1 upvote and 0 downvotes (100% positive) better than one with 90 up and 10 down (90%)? Sorting by
ratio says yes, which is clearly wrong: one vote proves very little. The **"best"** sort ranks by the **lower bound
of the Wilson score interval**: "given these votes, we are 95% sure the true upvote ratio is at least this much".
For 1 of 1 the lower bound is about **0.21**; for 90 of 100 it is about **0.83**. Few votes mean wide uncertainty and
a low bound; many consistent votes mean a high one. (Reddit's open-source code uses a looser 80% level, which gives
about 0.38 and 0.85; the ordering is the same.) This is how a good late reply can still rise above an early,
lightly voted one.

## 9. Deep dive: precomputed listings and the front page

### Subreddit listings

[![Listing pipeline: vote events flow into an aggregator, which sends new scores to the rank calculator; new posts give an initial rank and are added to the new list; the rank calculator writes the hot list and the top-of-day list; the listing service serves any of the three sorted lists](/img/system-design/reddit/04-listings.png)](/img/system-design/reddit/04-listings.png)

*Select the diagram to zoom in and move around.*

For each subreddit we keep a few **sorted lists of post IDs** in an in-memory store. A Redis **sorted set** is a
natural fit: each member (a post ID) has a numeric score (its hot rank, its vote score, or its creation time), and
the set stays sorted, so "the 25 entries after this one" is a fast range read.

- On a **new post:** add its ID to `r/x:new`, and to `r/x:hot` with its initial hot rank.
- On a **score change:** update the post's entry in `r/x:hot` and `r/x:top:day` (an `O(log n)` operation).
- **Trim** each list to about 1,000 entries. Almost nobody pages past the first few hundred posts; deeper pages
  can fall back to a slower database query.
- If the cache is lost, rebuild a list from the database (recent posts of that subreddit, sorted), which is why
  the cache can be treated as disposable.

Reading `GET /r/cooking/posts?sort=hot` is then: read 25 IDs from `r/cooking:hot`, fetch those 25 posts from the
**post cache** (titles, scores, thumbnails), filter anything removed, and return. No sorting at read time.

### The home feed: merge, do not fan out

A signed-in user's home feed mixes posts from every subreddit they joined. There are two classic ways to build a
feed:

- **Fan-out on write (push):** when a post is created, copy its ID into the feed of every member. With subreddits
  of tens of millions of members, one post would mean tens of millions of writes, and a post's rank keeps changing
  after it is copied.
- **Fan-out on read (pull):** at read time, take the precomputed hot lists of the user's subreddits and merge them.

Reddit-style feeds suit **pull**: there are far fewer subreddits than users, so per-subreddit lists are shared by
everyone who joined them.

[![Home feed sequence: the listing service fetches Bob's 80 subreddit IDs, reads the top ~50 hot entries of each in one batched read, does a k-way merge by hot rank to keep the top 25, fetches those posts from the post cache, fetches Bob's votes on them, and returns 25 posts with a cursor](/img/system-design/reddit/05-front-page.png)](/img/system-design/reddit/05-front-page.png)

*Select the diagram to zoom in and move around.*

The merge is a **k-way merge**: put the head of each of the 80 lists in a heap (a structure that always hands back
the largest item) and pop 25 times. That is about 4,000 candidates and a few microseconds of CPU. Two refinements:

- Users with thousands of subscriptions: cap the merge at, say, the user's 250 most active subreddits, or sample.
- The **cursor** for page 2 records the last hot rank returned, so the next merge continues below it.

For **logged-out visitors**, the popular feed is the same for everybody in a region, so it is computed once a minute
and served from the CDN. That removes a large share of all listing traffic from our servers.

## 10. Deep dive: threaded comment trees

A big post can have tens of thousands of comments, nested many levels deep. We need to store a **tree** in tables
and, more importantly, read the interesting part of it quickly.

### Storage options

| Option | How it works | Read a subtree | Insert a reply | Move a subtree |
| --- | --- | --- | --- | --- |
| **Adjacency list** | Each comment stores `parent_id` | Needs one query per level, or a recursive query (`WITH RECURSIVE`) | One row, trivial | Change one `parent_id` |
| **Materialised path** | Each comment stores its ancestor chain, e.g. `01.01.03` | One range query: `path LIKE '01.01.%'`, already in tree order | One row; build path from the parent's | Rewrite every path below it |
| **Closure table** | A separate table with one row per (ancestor, descendant) pair | One indexed query on `ancestor = X` | One row per ancestor (depth + 1 rows) | Expensive |
| **Nested sets** | Each node stores left/right numbers from a tree walk | One range query | Renumber much of the tree | Expensive |

Comments are **append-only in practice**: people add replies, but never move a comment to a new parent. That
favours **adjacency list plus materialised path**, as in our data model. `parent_id` keeps the structure simple and
easy to repair; `path` lets us fetch a whole thread, or one branch of it, with a single ordered range scan on the
`post_id` shard. Each path segment is a fixed-width counter (for example base-36, padded), so text order equals
tree order. A closure table is a good answer when you need fast "all ancestors" and "all descendants" queries on
data that does not move either, at the cost of more rows.

[![A comment thread as a tree: Post P has top-level comments by alice (path 01) and erin (path 02) plus a load-more link for 1,830 comments not sent yet; alice's replies bob (01.01) and carol (01.02) branch further; dave's reply under bob ends in a continue-this-thread link at the depth limit, and carol's has a 12-more-replies link fetched on click](/img/system-design/reddit/06-comment-tree.png)](/img/system-design/reddit/06-comment-tree.png)

*Select the diagram to zoom in and move around.*

### Loading a large thread

Sending all 20,000 comments of a viral post would be slow and pointless; nobody reads them all. Instead:

1. **Keep a lightweight tree per post** in cache: for each comment just its ID, parent ID and current "best"
   score. That is a few dozen bytes per comment, so even a huge thread is a few MB.
2. **Pick what to show:** walk the tree from the top, taking children in sort order (best, top, new…), until a
   budget is used up, for example **200 comments** and **depth 8**.
3. **Fetch bodies only for the chosen comments** in one batched read.
4. **Leave placeholders** where the budget ran out: "load 12 more replies" (the client later calls
   `/comments/more` with those child IDs) and, at the depth limit, "continue this thread", which opens that
   comment as the root of a new page.

**Collapsing** a thread is mostly a client feature: hide a comment's subtree on screen. The server can help by
collapsing heavily downvoted or removed comments by default.

**Comment counts and sorting** reuse the voting machinery: comment votes flow through the same event log, and the
aggregator updates each comment's score in the cached tree. New comments are appended to the tree and to the
store, and the post's `comment_count` is incremented in batches like vote counters.

## 11. Deep dive: moderation, spam and vote manipulation

### The life of a post

[![Post lifecycle: a submitted post goes through automatic checks; if it looks fine it goes live, then is archived after an age limit; if suspicious it waits in the mod queue until a moderator approves or removes it; clear spam is removed at once; a live post can be removed after reports or deleted by its author](/img/system-design/reddit/07-post-lifecycle.png)](/img/system-design/reddit/07-post-lifecycle.png)

*Select the diagram to zoom in and move around.*

Moderation is layered, cheapest and fastest first:

- **Automatic checks on submit:** a spam score (account age, karma, link domain reputation, posting rate,
  similarity to known spam) and **subreddit rules** written by moderators, for example "hold posts from accounts
  younger than 7 days" or "remove posts whose title matches this pattern". Reddit's AutoModerator is a well-known
  example of such rules.
- **The mod queue:** anything held or reported waits for a human. Moderators see it sorted by number of reports.
- **Reports from users** feed both the queue and the spam models.
- **Site-wide admins** handle illegal content and policy violations across all communities.

Archiving makes old threads read-only (Reddit lets each community choose whether posts are archived after six
months). That is good for
moderation (no necro-spam on forgotten threads) and for the system: archived posts never change, so they can be
cached forever and dropped from live ranking.

### Defending the votes

Ranking is the product, so people try to game it: bot farms, purchased accounts, and **vote rings** (groups that
agree to upvote each other).

[![Vote defence: a vote request must pass a per-user and per-IP rate limit, otherwise it is rejected with 429; then a trust check on account age, karma, IP and device, otherwise it is stored with weight 0 while the user still sees their own vote; trusted votes are counted, and the vote log feeds a batch ring detector that voids fake votes and bans accounts](/img/system-design/reddit/08-vote-defence.png)](/img/system-design/reddit/08-vote-defence.png)

*Select the diagram to zoom in and move around.*

- **Rate limits** per user and per IP stop crude scripts.
- **Trust weighting:** votes from brand-new or suspicious accounts can be stored but given weight 0. Crucially, the
  voter still sees their own vote. This is a **shadow** defence: if the bot could tell its votes were ignored, its
  operator would simply change tactics.
- **Batch analysis** later looks for patterns no single vote reveals: the same group of accounts always voting on
  the same author, many accounts from one device or IP range, votes arriving in a burst seconds after posting.
  Graph analysis over the vote log finds the rings; their votes are voided and scores recounted, which is easy
  because every vote row is kept.
- **Fuzzed display counts** (section 7) deny bots a clean signal.

## 12. Media and search

**Media.** The client asks for a pre-signed upload URL and sends the image or video **directly to object
storage**, so large files never pass through our API servers. A media pipeline then makes thumbnails and several
resolutions (and, for video, adaptive streaming segments), scans for banned content, and the post goes live when the
media is ready. Everything is served through the CDN with long cache lifetimes, because a file at a given URL never
changes.

**Search.** An indexer consumes post and subreddit events from the event log and updates a full-text index
(Elasticsearch or OpenSearch). Results blend text relevance with signals such as score, recency and community
size. A removed post triggers a delete event, so it disappears from search too. Indexing is asynchronous: a new post
becomes searchable a few seconds after it appears, which is fine.

## 13. A post goes viral

One post hits the top of the popular feed. Millions of people open it in an hour; tens of thousands vote and
comment every minute. Everything about that one post becomes **hot**.

| What gets hot | Why it hurts | Fix |
| --- | --- | --- |
| Reads of the post page | Millions of identical requests | Cache the rendered post and its top comments for a few seconds; logged-out views served from the CDN; **request coalescing** so one cache miss triggers one rebuild, not thousands |
| The post's vote counter | Thousands of updates a second to one key | Aggregator batches deltas per second; if one aggregator is not enough, **split the counter** into N shards and sum them when reading |
| The vote events | All land in one event-log partition if keyed by post | Partition by `(post_id, user_id)` hash for the raw log; aggregate in two steps (per partition, then per post) |
| The comment tree | Thousands of new comments to one shard; huge tree to sort | Cache the lightweight tree; append in batches; serve the top 200 and lazy-load the rest |
| The comment store shard | All of the post's comments live on one shard | Read replicas for that shard; the cache absorbs nearly all reads |
| The author's notifications | Thousands of "someone replied" events | Group them ("200 new replies") rather than one push each |

The general lesson: **a hot key is a cache and batching problem, not a sharding problem.** Sharding spreads
different keys across machines; it cannot split one key. So we cut the number of operations on that key (batching,
coalescing, short-lived caching), or split the key itself (sharded counters).

## 14. What breaks as it grows, and how to fix it

**The vote table.** Tens of billions of rows. *Fix:* a wide-column store partitioned by item ID; old posts are
archived (their votes are frozen, so their vote rows can move to cheaper storage).

**The giant subreddit.** Some communities have tens of millions of members and thousands of posts a day. *Fix:*
its listings are just bigger sorted sets; keep them trimmed, and replicate the hottest lists across several cache
nodes so reads spread out.

**The deep page.** `after=` cursors past the 1,000 cached entries. *Fix:* fall back to an indexed database query
(posts of that subreddit by creation time or score), which is slower but rare.

**The cache restart.** A cold listing cache would send every read to the database. *Fix:* rebuild lists from the
database and event log before taking traffic, replicate the cache, and keep a short stale copy rather than nothing.

**The membership fan-in.** A user subscribed to 3,000 subreddits makes the merge expensive. *Fix:* cap and rank the
subreddits used, and cache that user's merged feed for a minute.

**The spam wave.** A botnet floods new accounts and posts. *Fix:* tighter rules for new accounts during an
attack, CAPTCHA on suspicious sign-ups, and auto-scaling the anti-abuse consumers from the event log's backlog.

## 15. Reliability and failure handling

| Risk | Defence |
| --- | --- |
| The aggregator crashes mid-batch | It resumes from the last committed event-log offset; counters can be rebuilt from vote rows |
| A vote event is delivered twice | Offsets stored with the counter update make replays harmless; the vote row itself is idempotent |
| The listing cache is lost | Rebuild from the database; serve the logged-out popular feed from the CDN meanwhile |
| The vote service is down | Reading still works; the app shows "couldn't vote, try again". Votes are less important than reading |
| A bad moderation rule removes good posts | Removal is a status, not a delete: restore in bulk |
| A data centre fails | Databases and the event log are replicated across zones; caches are rebuilt in the new region |

The pattern to remember: **source of truth + derived views.** Posts, comments and vote rows are the truth. Scores,
ranks, listings, search results and karma are views derived from them through the event log, so any of them can be
recomputed when something goes wrong.

## 16. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Score updates | Synchronous counter update per vote | Async, batched from the event log | **Async**: avoids hot rows; seconds of lag is invisible |
| Listings | Sort on every read | Precomputed sorted lists | **Precomputed**: reads outnumber writes by far |
| Home feed | Fan-out on write | Merge subreddit lists on read | **Merge on read**: subreddits are shared by many users |
| Hot ranking | Depends on current time (needs recomputing) | Fixed time bonus at creation | **Fixed bonus**: ranks only change when votes change |
| Comment storage | Closure table | Adjacency list + materialised path | **Path**: comments never move; one range scan reads a branch |
| Comment loading | Whole thread | Budgeted tree + "load more" | **Budgeted**: fast first paint, lazy depth |
| Vote integrity | Reject suspicious votes visibly | Accept but weight 0 (shadow) | **Shadow**: gives attackers no feedback |
| Displayed counts | Exact | Slightly fuzzed | **Fuzzed** for display; exact counts drive ranking |

## Cheat sheet for last-minute revision

- **Read-heavy:** listing reads ~3× votes and ~300× comments. Precompute sorted lists per subreddit (Redis sorted
  sets, ~1,000 IDs per sort, a few GB total); fill in post details from a post cache.
- **Votes:** table keyed `(item_id, user_id)` = one vote per user by construction. The API sets a value (idempotent).
  The vote service records the row, emits a delta, returns. An aggregator batches deltas per post into counters and
  ranks. Eventually consistent scores; read-your-writes for the voter.
- **Hot** = $\operatorname{sign}(s)\log_{10}\max(|s|,1) + t/45000$: 10× the score beats 12.5 hours of age; rank changes
  only when votes change. **Top** = score in a window. **New** = time. **Controversial** = many votes, close split.
  **Best** (comments) = Wilson lower bound.
- **Home feed** = k-way merge of joined subreddits' hot lists (pull, not push). Logged-out feed served from the CDN.
- **Comments:** adjacency list + materialised path, sharded by `post_id`; cached lightweight tree; load ~200
  comments to depth ~8, then "load more" and "continue this thread".
- **Moderation:** auto checks → mod queue → reports → admins; removal is a status. Archive old posts (read-only).
- **Vote defence:** rate limits, trust weighting with shadow ignore, batch ring detection over the vote log, fuzzed
  counts.
- **Viral post:** hot key → batch, coalesce, cache briefly, shard the counter; sharding cannot split one key.
- **Numbers:** assume 100M DAU → ~35K listing reads/s (100K peak), ~12K votes/s (35K peak), ~50 GB of vote rows a day.

## Practice questions

1. **A user says their upvote "disappeared" after refreshing. What could cause it?** The vote write failed or timed
   out while the app showed it optimistically; or the page was served from a cache that does not merge in the user's
   own votes. Fix: retry the idempotent vote call, and always fetch the viewer's own votes for posts on screen
   rather than caching them in shared pages.
2. **How would you add "Top of the week" cheaply?** Keep a sorted set by score per subreddit holding only posts from
   the last 7 days, updated by the same aggregator; a periodic job removes posts older than 7 days. Or recompute it
   hourly in batch, since a weekly ranking barely changes minute to minute.
3. **How would you compute karma?** Consume the same vote events, look up the item's author, and add the delta to
   the author's karma counter in batches. Karma can be approximate and slightly delayed; it can always be rebuilt
   from vote rows.
4. **Why not store each post's score only in Redis?** Redis is a cache: losing it would lose scores. Keep the vote
   rows as the truth and the counter in the database; Redis holds a fast copy and the sorted lists derived from it.
5. **How would you show "3 new comments" live on an open thread?** Clients viewing a post subscribe over a
   WebSocket (or poll every few seconds); the comment service publishes "new comment on P" events, and a push
   service relays a small nudge. For a viral post, batch nudges to one per few seconds instead of one per comment.
6. **How do you delete a user's account?** Mark the account deleted, replace their name on posts and comments with
   "[deleted]" (threads keep their shape), remove their votes' influence through a recount, and erase personal data
   according to privacy law, through background jobs driven by the event log.
