---
title: "Design Instagram (photo sharing)"
description: "Design Instagram: direct uploads to object storage, a media pipeline and CDN, the follow graph, a hybrid fan-out feed, counters and stories."
difficulty: "Medium"
sidebar:
  label: "Instagram (photo sharing)"
tags: ["News feed", "Media storage", "CDN", "Sharding", "Caching"]
---

A photo-sharing app looks like three screens: a camera, a profile and an endless scroll of pictures from people
you follow. Underneath, it is several systems in one. It is a **darkroom** that turns one upload into a dozen
sizes, a **distribution network** that puts those images a few milliseconds from every phone on earth, a
**social graph** that knows who follows whom, a **newspaper** that prints a personal front page for every user
every time they open the app, and a **scoreboard** counting billions of likes.

This case study builds that system from the ground up. We start with the vocabulary, then design the service
layer by layer, and finish with what breaks as it grows and a one-page revision sheet.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. The idea in 5 minutes

Two observations shape the whole design.

1. **Bytes and data are different problems.** A photo is a few megabytes of pixels that never change once
   uploaded. A post's caption, author, time and like count are a few hundred bytes that are read constantly.
   We keep the bytes in cheap **object storage** behind a **CDN**, and the small facts in databases and caches.
2. **Reads vastly outnumber writes.** A person might post once a week but scroll their feed many times a day,
   and each scroll loads dozens of images. So we do work **when a photo is posted** (resizing it, pushing it
   into followers' feeds) to make every later read cheap.

The vocabulary you need:

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Object storage** | A service that stores files ("objects") by key, very durably and cheaply: Amazon S3, Google Cloud Storage | A huge warehouse with a numbered shelf for every box |
| **Pre-signed URL** | A time-limited link, signed by our server, that lets one client upload (or download) one object directly to object storage | A one-time visitor pass for one shelf, valid for 15 minutes |
| **CDN** (content delivery network) | Servers spread around the world that keep copies of popular files close to users | A corner shop that stocks the bestsellers so you don't drive to the warehouse |
| **Follow graph** | Who follows whom. Edges are one-way: Alice can follow a celebrity who does not follow her back | A list of magazine subscriptions |
| **Feed** | The list of posts shown to one user, newest or most relevant first | Your personal newspaper |
| **Fan-out** | Delivering one new post to the feeds of many followers | A newspaper printing one story into a million copies |
| **Shard** | One slice of a database that has been split across machines, for example by user ID | One filing cabinet out of many, each holding surnames A–C, D–F… |
| **Time-sortable ID** | A unique number that also encodes when it was created, so sorting by ID sorts by time | A ticket number that starts with today's date |

## 2. Requirements

### Functional (what users can do)

- **Post** a photo or a short video (or a carousel of several, up to a fixed limit such as 20), with a caption.
- **Follow** and unfollow other users; see follower and following lists.
- **Home feed**: posts from people you follow, ranked, with infinite scroll.
- **Like** and **comment** on posts; see like and comment counts.
- **Profile**: a user's own posts in a grid, newest first.
- **Stories**: photos or videos that disappear after **24 hours**.
- **Explore**: a page of posts from accounts you do not follow, picked for you.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Availability** | 99.99% for browsing; posting may degrade briefly | An app people open dozens of times a day must just work |
| **Latency** | Feed page in under 200 ms (server side); first image visible in under a second | Scrolling must feel instant |
| **Durability** | Never lose an uploaded photo | People's memories live here |
| **Scale** | ~500 million daily active users (our assumption for the estimates) | Instagram-sized |
| **Consistency** | Eventual is fine for feeds and counts: a post may reach followers a few seconds late, a like count may lag. Read-your-writes for the author: you must see your own post at once | Nobody notices 3 seconds of lag in someone else's feed; everybody notices their own post missing |

### Out of scope

Direct messages, Reels recommendations in depth, ads, live video, search by name or hashtag, and content
moderation tooling. Mention them in an interview, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resources dominate**.

**Assumptions:** 500 million daily active users (DAU). One in ten posts once a day, so **50 million new posts a
day**. Each user opens the feed **10 times** a day and sees **20 posts** per visit. An original photo is about
**2 MB**; all resized variants together add about **1 MB**. An average user has **200 followers**.

**Traffic**

- New posts: $50\text{M} / 86{,}400 \approx$ **580 per second**, roughly **1,700 per second** at peak (3×).
- Feed requests: $500\text{M} \times 10 = 5\text{B}$ a day, about **58,000 per second** (about 175,000 at peak).
- Image loads: $5\text{B} \times 20 = 100\text{B}$ a day, about **1.2 million per second**. This is why the CDN,
  not our servers, must serve images.
- Read-to-write ratio for posts: about $5\text{B} : 50\text{M} = 100 : 1$.

**Storage**

- Photos: $50\text{M} \times 3\text{ MB} = 150\text{ TB}$ a day, about **55 PB a year** before replication.
  Videos make this several times larger.
- Post metadata (IDs, caption, time, counters): about 1 KB each, so $50\text{M} \times 1\text{ KB} = 50\text{ GB}$
  a day. Small enough for ordinary sharded databases.

**Fan-out**

- If every post is pushed to every follower's feed: $50\text{M} \times 200 = 10\text{B}$ feed inserts a day,
  about **116,000 per second**. Large but steady, and each insert is tiny (an 8-byte post ID).
- Feed cache: keeping the newest 500 post IDs for each of 500M users is
  $500\text{M} \times 500 \times 8\text{ bytes} = 2\text{ TB}$, a few terabytes with overhead. That fits in a
  cluster of in-memory cache servers.

Three conclusions follow:

1. **Media bytes dominate storage and bandwidth.** They go to object storage and are served by a CDN; our
   application servers should never stream image bytes.
2. **Feed reads dominate requests.** Feeds must be precomputed or cheaply assembled, not built from scratch with
   a giant query on every scroll.
3. **Metadata is small and hot.** It lives in sharded databases with caches in front.

## 4. The API

Clients talk to us over HTTPS with a JSON API. Every list uses a **cursor** for pagination.

| Method and path | What it does |
| --- | --- |
| `POST /v1/uploads` | Ask to upload a file. Returns an `upload_id` and a **pre-signed URL**; the app then sends the bytes straight to object storage. |
| `POST /v1/posts` | Create a post: `{"upload_ids": [...], "caption": "..."}`, with an `Idempotency-Key` header so a retry does not post twice. |
| `GET /v1/feed?cursor=...` | The next page of the home feed. |
| `GET /v1/users/{id}/posts?cursor=...` | A profile grid, newest first. |
| `POST /v1/users/{id}/follow` / `DELETE` | Follow or unfollow. |
| `POST /v1/posts/{id}/like` / `DELETE` | Like or unlike. Repeating it is harmless (idempotent). |
| `GET /v1/posts/{id}/comments?cursor=...` / `POST` | Read or add comments. |
| `POST /v1/stories` / `GET /v1/stories/tray` | Post a story; get the row of story circles at the top of the feed. |
| `GET /v1/explore?cursor=...` | The Explore grid. |

Why a **cursor** and not `?page=3`? A feed changes while you scroll. With page numbers, three new posts at the
top push everything down and you see duplicates. A cursor says "continue after this post", which stays correct
however the list changes.

## 5. High-level design

[![High-level architecture: apps call the API gateway, which routes to the feed, post and upload services; the post service writes to the post DB and emits events; fan-out workers ask the graph service for followers and write post IDs into the feed cache; counter workers and Explore consume the same events; photos go to the object store, are processed by media workers and are served through the CDN](/img/system-design/instagram/01-architecture.png)](/img/system-design/instagram/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **API gateway:** checks who you are (OAuth tokens), applies rate limits, routes to the right service.
- **Upload service:** hands out pre-signed URLs so the app can upload bytes directly to object storage.
- **Object store:** holds every original and every resized variant. **Media workers** create the variants.
- **CDN:** serves images and videos from servers near the user; asks the object store only on a miss.
- **Post service:** creates posts, records likes and comments, assigns IDs, and writes to the **post DB**.
- **Event log** (for example Kafka): a durable, replayable stream of events such as "post created" and "post
  liked". Many consumers read it independently.
- **Fan-out workers:** for each new post, look up the author's followers and add the post ID to their feeds.
- **Graph service + follow store:** who follows whom, in both directions.
- **Feed service + feed cache:** assemble, rank and fill in ("hydrate") a user's feed.
- **Counter workers + counter store:** keep like and comment counts without hammering the database.
- **Explore + ranking:** learn from engagement events which posts to recommend.

The two ideas to remember: **bytes never pass through our app servers**, and **the event log decouples posting
from everything that happens after it**. Posting only has to write one row and one event; fan-out, counters
and recommendations catch up asynchronously.

## 6. Flow 1: posting a photo

Alice takes a photo and taps **Share**.

[![Upload sequence: the app gets a signed URL from the API, uploads the bytes directly to the object store, then creates the post; the API saves it as processing, emits an event and replies 202; media workers read the original, write the sizes and thumbnail, mark the post ready and emit post.ready, which starts fan-out](/img/system-design/instagram/02-upload.png)](/img/system-design/instagram/02-upload.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Why upload directly to object storage?** If 1,700 photos a second at 2 MB each streamed through our API
  servers, that is over 3 GB/s of traffic for servers whose real job is small JSON requests. A pre-signed URL
  lets the storage service, which is built for this, take the bytes. The URL is limited to **one object key, one
  method (`PUT`), a size limit and about 15 minutes**, so a leaked URL is nearly useless.
- **Resumable uploads.** Phones lose signal. Large files (videos) are uploaded in chunks (for example S3
  multipart upload), so a dropped connection resumes from the last chunk instead of starting again.
- **The post is created in a `processing` state.** The app already has the photo, so it shows Alice her own
  post immediately (read-your-writes). Followers only see it once the variants exist and the status is `ready`.
- **The idempotency key** stops the classic mobile bug: the app sends, the network drops before the reply, the
  app retries, and Alice posts the same photo twice. The server remembers the key for a day and returns the
  first result for any repeat.
- **Two steps (upload, then create post)** also allow a nicer experience: the app can start uploading while
  Alice is still typing her caption.

## 7. Deep dive: the media pipeline and serving images

### Processing: one upload becomes many files

A phone screen showing a grid of thumbnails does not need a 12-megapixel original. Sending it would waste
the user's data plan and make scrolling slow. So every upload is turned into **variants**.

[![Media pipeline: the original photo and video are validated, then resized into four widths, turned into thumbnails or poster frames, or transcoded into streaming segments; all variants land in the object store, are pulled by the CDN on a miss, and their keys are recorded in the post DB](/img/system-design/instagram/03-media-pipeline.png)](/img/system-design/instagram/03-media-pipeline.png)

*Select the diagram to zoom in and move around.*

- **Validate first.** Check the file really is an image or video (by its content, not its file name), enforce
  size limits, scan for malware, and **strip location metadata** (EXIF GPS tags) so a photo does not reveal
  where someone lives.
- **Resize to a few fixed widths**, for example 150, 320, 640 and 1080 pixels. The app picks the smallest that
  fills the screen at the device's pixel density. Fixed widths (not "any size on demand") keep the number of
  distinct files small, which keeps the CDN's hit rate high.
- **Encode efficiently.** Modern formats such as WebP or AVIF are often noticeably smaller than JPEG at similar
  quality; keep a JPEG fallback for old clients.
- **Thumbnails and placeholders.** A tiny blurred preview (a few hundred bytes, small enough to send inside the
  feed response itself) lets the app paint something before the real image arrives.
- **Video is transcoded** into several bitrates and cut into short segments for adaptive streaming (HLS or
  DASH): the player switches to a lower bitrate when the network slows, instead of freezing.

The workers are stateless and read jobs from a queue, so they scale with the backlog. Video transcoding is far
more CPU-heavy than photo resizing, so it gets its own worker pool; a burst of videos should not delay photos.

### Serving: the CDN does almost all the work

Every variant is stored under an **immutable key**, for example `media/9f3a…/1080.webp`. The key never points at
different bytes; if a photo is edited, it gets a new key. That single rule makes caching trivial: the CDN and the
phone can keep a file **forever** (`Cache-Control: max-age=31536000, immutable`) because it can never go stale.

When an image is requested:

1. The app asks the nearest **CDN edge** server.
2. On a hit (the usual case for anything popular), the edge returns it in a few milliseconds.
3. On a miss, the edge fetches it from a regional cache layer or the **object store**, keeps a copy and returns it.

Two refinements that matter at scale:

- **Signed or hard-to-guess URLs.** Private accounts' photos should not be fetchable by anyone who guesses a
  URL. Keys contain long random parts, and URLs for private content can carry an expiring signature that the
  CDN checks.
- **Storage tiers.** Most views happen in a post's first days. Old variants can move to cheaper, slower storage
  classes; the CDN hides the extra latency for anything still popular.

## 8. Low-level design: the data model

### What we store

[![Data model: users own posts and stories and are linked to each other through follows; a post has media items, likes, comments and one post_counters row](/img/system-design/instagram/04-data-model.png)](/img/system-design/instagram/04-data-model.png)

*Select the diagram to zoom in and move around.*

Design decisions hiding in this diagram:

**1. Media rows hold keys, not bytes.** `media.variant_keys` lists the object-store keys of each size. The feed
response turns them into CDN URLs.

**2. `follows` is stored twice.** "Who does Bob follow?" (to build Bob's feed) and "Who follows Alice?" (to fan
out Alice's post) are both hot queries. So we keep two copies of every edge: one keyed by `follower_id` and one
keyed by `followee_id`, each sorted so either question is a single range scan on one shard. A follow writes both
copies; if one write fails, a repair job fixes it from the other.

**3. Likes are a set, counts are separate.** The primary key `(post_id, user_id)` makes a like idempotent: liking
twice cannot create two rows. The count lives in `post_counters`, because counting millions of rows on every
view would be absurd (section 11).

**4. Denormalised counters.** `users.follower_count` and `post_counters` duplicate information you could compute.
That is deliberate: profile and feed pages read them millions of times a second.

**5. `stories.expires_at` is stored, not computed.** It makes "live stories by these authors" a simple indexed
range query (section 12).

### Sharding by user

No single machine holds billions of posts. We split (**shard**) the data, and the shard key decides which
queries are cheap.

- **Posts are sharded by `author_id`.** A profile grid ("Alice's posts, newest first") hits exactly one shard.
  Adding shards adds capacity.
- **Likes and comments are sharded by `post_id`**, so all engagement on one post sits together.
- **Follow edges** are sharded by the user in the key of each copy, as above.
- Many **logical shards** (thousands) are mapped onto fewer physical machines through a lookup table. Moving a
  logical shard to a new machine changes one row in the table, not every user's ID.

The cost of sharding: queries that cross shards (for example "posts from these 300 people") must ask many shards
at once. The feed design in section 10 exists largely to avoid running that query on every scroll.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Users, posts, media, comments | Billions of small rows, accessed by key and sorted ranges | Sharded PostgreSQL / MySQL, or a wide-column store (Cassandra, ScyllaDB) | Key lookups and range scans; scales horizontally |
| Follow edges | Two sorted lists per user | Wide-column store, or a sharded SQL table with two indexes | One range scan answers each direction |
| Photos and videos | Immutable bytes, petabytes | Object storage (S3, GCS) behind a CDN | Cheapest per byte, built for durability |
| Feed lists, counters, sessions | Small, very hot | Redis / Memcached clusters | Microsecond reads |
| Events | Ordered, durable streams | Kafka | Replay, many independent consumers |
| Explore features and candidates | Large batch data | A data warehouse plus a feature store | Training and scoring models |

## 9. Deep dive: unique IDs that sort by time

Every post, comment and story needs a unique ID. With sharded databases, a single auto-increment counter does
not work: it is one bottleneck and one point of failure, and two shards would hand out the same numbers.

Random UUIDs are unique, but 128 bits is large, and random IDs scatter inserts across an index instead of
appending to it. We want IDs that are **64-bit, unique without coordination, and roughly sorted by time**, so
that "newest first" is just "biggest ID first". The best-known recipe is Twitter's **Snowflake** layout:

| Bits | Field | What it gives |
| --- | --- | --- |
| 1 | Sign bit, always 0 | IDs stay positive in every language |
| 41 | Milliseconds since a custom epoch | About 69 years of timestamps; sorting by ID sorts by time |
| 10 | Machine (or shard) ID | Up to 1,024 generators that never collide |
| 12 | Sequence within that millisecond | Up to 4,096 IDs per millisecond per generator |

Each generator builds an ID from its clock, its own number and a counter, with no network call.

- **Bonus:** the ID tells you when something was created, and, in variants that store the shard number, **where
  it lives**. Instagram's engineering blog described a scheme like this in 2012: 41 bits of time, 13 bits of
  logical shard ID and a 10-bit sequence, generated inside each database shard. Looking at a post ID was enough
  to know which shard held it.
- **Clock risk:** if a machine's clock jumps backwards, it could repeat IDs. Generators refuse to issue IDs until
  the clock passes the last timestamp they used.
- IDs are "roughly" sorted: two machines with slightly different clocks may interleave within a few
  milliseconds, which no feed cares about.

## 10. Deep dive: the home feed

This is the part interviewers push on hardest. Bob follows 300 accounts. When he opens the app, we must show the
best recent posts from those accounts in under 200 ms.

### Option A: fan-out on read (pull)

When Bob opens the app, ask the post shards for the recent posts of all 300 accounts, merge and rank.

- **Good:** posting is cheap (write one row); nothing is wasted on users who never open the app.
- **Bad:** every feed open becomes a query to up to 300 shards. At 175,000 feed requests a second at peak, that
  is tens of millions of shard lookups a second, and the slowest shard sets the response time.

### Option B: fan-out on write (push)

When Alice posts, add the post ID to the **precomputed feed list** of each of her followers. Bob's feed is then
one read of one list.

- **Good:** reads are trivially cheap, which matters because reads outnumber posts 100 to 1.
- **Bad:** a celebrity with 300 million followers posting once means 300 million writes, and the last followers
  get the post many minutes late. Writes are also wasted on followers who are not active.

### Option C: hybrid (what large systems do)

Push for normal authors; pull for celebrities.

[![Hybrid fan-out: on post.ready a worker checks whether the author is a celebrity; if not, it fetches followers in pages, keeps active users and prepends the post ID to each follower's feed list, trimmed to about 500; if so, it skips fan-out and the post is pulled from the author's own post list at read time](/img/system-design/instagram/05-fanout.png)](/img/system-design/instagram/05-fanout.png)

*Select the diagram to zoom in and move around.*

- **Most authors** (say, under a few hundred thousand followers; the threshold is a tuning knob) are pushed. The
  workers page through followers 1,000 at a time and do batched writes to the feed cache.
- **Skip inactive followers.** Someone who has not opened the app in a month does not need a precomputed feed;
  if they return, their feed is built by pull once and then kept up to date.
- **Feed lists are bounded.** Each list holds only the newest ~500 post IDs. Nobody scrolls further, and a bounded
  list keeps the cache at a few terabytes.
- **Celebrities are not pushed.** Their posts stay in their own post list and are merged in at read time. Since
  any user follows only a handful of celebrities, the pull part is a few cheap lookups, not 300.

### Reading the feed

[![Feed read sequence: the feed service reads Bob's pushed list from the feed cache, asks the graph service for the celebrities he follows, fetches their recent post IDs, merges both lists, asks the ranking model to score them, hydrates the top 20 with captions, counts and media URLs, and returns them with a cursor](/img/system-design/instagram/06-feed-read.png)](/img/system-design/instagram/06-feed-read.png)

*Select the diagram to zoom in and move around.*

**Hydration** means turning bare IDs into displayable posts: caption, author name and avatar, media URLs, like
count, "liked by you". Each piece comes from a cache in a batched lookup (`MGET` of 20 keys), not one call per
post. Deleted posts or posts from people Bob has since unfollowed or blocked are filtered out here, which is why
the feed list itself can stay simple.

### Ranking, at a high level

A purely chronological feed is easy to explain but shows you whoever posts most. Ranked feeds order the
candidates by the **predicted chance that you will engage**. A typical design:

1. **Candidates:** the few hundred post IDs gathered above.
2. **Features** for each candidate: how often you interact with the author (closeness), the post's age, how
   quickly it is collecting likes and comments, the media type, what you usually engage with.
3. **A model** (trained offline on past engagement) scores each candidate; a light first pass trims the list,
   a heavier model orders the top.
4. **Rules** on top: do not show three posts from one author in a row, mix in unseen posts, respect "Following"
   (chronological) mode.

The ranked page is cached for a short while, so scrolling back and forth does not re-rank.

## 11. Deep dive: likes and comments at scale

### The naive way fails

`UPDATE post_counters SET like_count = like_count + 1 WHERE post_id = 42` on every tap works until a celebrity
posts. Then 100,000 people like the same post in a minute, every update waits for the same row lock, and the
shard holding that row melts. This is the **hot key** problem.

### Exact rows, batched counters

[![Like counting: a heart tap goes to the like service, which inserts the like row only if new and emits a +1 event; counter workers sum events per post each second and apply one increment to the counter store; a recount job occasionally counts the rows and repairs drift](/img/system-design/instagram/08-like-counter.png)](/img/system-design/instagram/08-like-counter.png)

*Select the diagram to zoom in and move around.*

- **The like row is the truth.** Inserting `(post_id, user_id)` with "insert if not exists" makes double taps and
  retries harmless, and answers "did Bob like this?" exactly.
- **The count is derived, and batched.** Instead of 100,000 updates, counter workers read like events from the
  log (partitioned by `post_id`, so one worker owns each post), add them up for a second, and apply **one**
  increment: `INCRBY like_count 37`. That is roughly 60 writes a minute for even the hottest post.
- **Hot counters can be split.** For extreme cases, keep N sub-counters per post (`42:0` … `42:15`), increment a
  random one, and sum them on read.
- **Counts are allowed to be approximate for a moment.** Nobody can tell 1,203,511 from 1,203,548, and the app
  often shows "1.2M" anyway. The author's own like appears instantly because the app updates locally.
- **A recount job** occasionally counts the real rows and corrects drift caused by lost or doubled events.

**Comments** follow the same pattern: the comment row is stored on the post's shard (sorted by `comment_id`, so
newest-first is a range scan), the count is a batched counter, and a post's first few comments are cached with
the post so the feed can show them without a second query.

## 12. Deep dive: stories that vanish after 24 hours

Stories reuse the upload and media pipeline. What is different is **time**: a story is visible for exactly 24
hours and is shown in a "tray" of circles at the top of the feed, not inside the feed.

[![Story lifecycle: uploaded, processing, live in followers' tray, expired after 24 hours, then archived for the author; a bad file fails, the author can delete a live story, and an archived story can be pinned to a highlight](/img/system-design/instagram/07-story-lifecycle.png)](/img/system-design/instagram/07-story-lifecycle.png)

*Select the diagram to zoom in and move around.*

- **Expiry is a read-time filter, not a delete.** Each story stores `expires_at = created_at + 24 h`. The tray
  query is "live stories by people Bob follows" = `expires_at > now()`. No job has to delete anything on the
  stroke of the 24th hour, and a slow job can never show an expired story.
- **Cleanup happens later, lazily.** A background job moves expired stories to the author's archive, and
  storage lifecycle rules or cache TTLs (time to live) drop the cached copies. The data is gone from viewers'
  point of view at once, even if bytes are reclaimed hours later.
- **The tray is pull-based.** A user follows a few hundred accounts, and only some of them have live stories. A
  small per-author cache entry "has live stories until time T" (with a TTL equal to the newest story's expiry)
  makes the tray one batched cache lookup. Celebrities' stories are hugely popular, so their entries are
  replicated across many cache nodes.
- **Seen state** ("you have watched this ring") is a per-viewer set of story IDs with a 24-hour TTL. It may be
  approximate; nothing bad happens if a ring is grey for a second too long.
- **Viewer lists** ("who saw my story") are appended to a per-story list the author can read, capped and expired
  along with the story.

## 13. The Explore page, at a high level

The home feed only shows people you follow. **Explore** finds posts from anyone that you are likely to enjoy.
It is a recommendation system with the same two-stage shape as ranking:

1. **Candidate generation** (cheap, broad): pull a few thousand posts from many sources. Examples: posts liked by
   people with similar tastes, posts from accounts similar to ones you engage with (accounts close together in a
   learned "embedding" space), and posts trending in your region.
2. **Filtering:** remove what you have seen, what is from blocked accounts, and anything that fails content
   policies.
3. **Ranking** (expensive, precise): a model predicts engagement for each remaining candidate; the top results
   fill the grid, with rules for diversity.

The engagement events (likes, saves, time spent) flow from the event log into a data warehouse, where models are
trained offline. Per-user candidates can be precomputed in batch and refreshed often, so a request mostly reads
and re-ranks a prepared list.

## 14. Caching: where and why

| Layer | What it holds | Notes |
| --- | --- | --- |
| **Phone** | Images, recent feed pages | Immutable image URLs can be kept for months |
| **CDN** | Every image and video variant | Serves the ~1.2 million image loads a second |
| **Feed cache** | Up to ~500 post IDs per active user | Written by fan-out, read by the feed service |
| **Object cache** | Posts, users, counters by ID (Redis / Memcached) | Read-through: on a miss, load from the DB and store with a TTL |
| **Graph cache** | Following lists for active users | Read on every feed build |

Three classic cache problems and their fixes:

- **Stale data after an update.** On a write (edit caption, delete post), update the database first, then
  **delete** the cache entry so the next read reloads it. Deleting is safer than writing the new value, which
  can race with a concurrent reader.
- **Thundering herd.** A celebrity's post is evicted and 50,000 requests miss at once and hit one DB shard.
  *Fix:* request coalescing (only one request reloads, the rest wait for it) and a few replicas of very hot keys.
- **Cold start.** A new cache node starts empty. *Fix:* warm it gradually, and size the DB to survive a
  temporary drop in hit rate.

## 15. What breaks as it grows, and how to fix it

**The celebrity post.** One account with hundreds of millions of followers. *Fix:* hybrid fan-out (pull for big
accounts), batched counters, and replicated hot cache keys for that post.

**The hot shard.** Sharding by author puts all of a celebrity's posts, and all reads of them, on one shard. *Fix:*
cache those posts aggressively, add read replicas, and use many logical shards so busy ones can be moved to their
own machines.

**The fan-out backlog.** A traffic spike (a big event, New Year's Eve) produces posts faster than workers can
fan out. *Fix:* the event log absorbs the burst; auto-scale workers from the backlog; deliver to the most active
followers first; and let feed reads fall back to pulling recent posts from authors when a feed is behind.

**The storage bill.** Petabytes a year. *Fix:* efficient formats, a fixed small set of variants, storage tiers for
old media, and deleting originals' extra replicas once variants exist (keeping one durable copy).

**The follow graph's giant nodes.** Listing 300 million followers is heavy for fan-out, follower lists and
counts. *Fix:* paginate everything, store follower counts as counters, and never fan out to such accounts.

**Global users.** Users far from our data centres see slow API calls even though images come from a nearby CDN.
*Fix:* several regions, each serving reads from local replicas; writes go to the user's home region and replicate
asynchronously.

## 16. Reliability: how we never lose a photo or a post

| Risk | Defence |
| --- | --- |
| The upload fails halfway | Chunked, resumable uploads; the post is only created after the object store confirms the bytes |
| A server crashes after accepting a post | The post row and its event are written durably before replying (or the event is derived from the database's change log, so they cannot disagree) |
| A worker processes an event twice | **Idempotent** consumers: feed inserts and like rows are keyed, so a repeat is a no-op |
| Media processing fails | The job is retried with backoff; after repeated failures the post is marked failed and the user is asked to retry; the original is kept |
| A data centre fails | Object storage replicates across zones; databases have replicas in other zones and regions; traffic fails over |
| The feed cache is lost | It is derived data: rebuild an active user's feed by pull on first request, then resume pushing |

The pattern to remember: **the database and the object store are the truth; feeds, counters and caches are
derived and can be rebuilt.** That is what makes it safe to keep them eventually consistent.

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Upload path | Through our API servers | Pre-signed URL straight to object storage | **Direct**: keeps gigabytes a second off app servers |
| Image sizes | Resize on demand | Fixed variants at upload | **Fixed variants**: predictable cost, high CDN hit rate |
| Feed | Fan-out on read | Fan-out on write | **Hybrid**: push for most authors, pull for celebrities |
| Feed order | Chronological | Ranked | **Ranked** by default, chronological as an option |
| Like counts | Exact, updated in place | Batched, eventually consistent | **Batched**: survives hot posts; rows stay exact |
| IDs | Database auto-increment / UUID | Snowflake-style 64-bit | **Snowflake-style**: unique without coordination, sorts by time |
| Story expiry | Delete at 24 h | Filter by `expires_at`, clean up later | **Filter**: correct even if cleanup is slow |
| Consistency | Strong everywhere | Eventual, read-your-writes for the author | **Eventual**: a few seconds of lag is invisible to followers |

## Cheat sheet for last-minute revision

- **Split bytes from data:** media in object storage behind a CDN with immutable keys; metadata in sharded
  databases with caches in front.
- **Upload:** get a pre-signed URL, upload directly (resumable), then create the post as `processing`; media
  workers make 4-ish sizes, thumbnails and video segments, then mark it `ready`.
- **Feed = hybrid fan-out.** Push post IDs into bounded per-user lists (~500) for normal authors; pull
  celebrities' posts at read time; skip inactive users. Then rank, then hydrate in batches.
- **Follow graph** stored twice (by follower and by followee) so both questions are one range scan.
- **Shard by user** (posts by author, engagement by post), using many logical shards mapped to machines.
- **IDs:** 64-bit Snowflake-style = 41-bit time + machine/shard bits + sequence. Sorted by time, no coordination.
- **Likes:** idempotent rows `(post_id, user_id)` are the truth; counts are batched increments, split if hot,
  repaired by recounts.
- **Stories:** `expires_at` filter at read time; lazy cleanup and archive; pull-based tray.
- **Explore:** candidate generation → filtering → ranking, fed by engagement events.
- **Numbers:** 500M DAU, ~580 posts/s (1,700 peak), ~58K feed reads/s, ~1.2M image loads/s, ~150 TB of
  media a day, feed cache ~2 TB.

## Practice questions

1. **A user says their new post is not showing in a friend's feed. How would you investigate?** Check the post's
   status (stuck in `processing`?), whether `post.ready` was emitted, the fan-out backlog, whether the friend was
   skipped as inactive or the author treated as a celebrity (then the pull path), and whether the friend has
   muted or blocked the author.
2. **How would you implement "unfollow" so the person's posts disappear from my feed?** Remove both follow
   edges; at read time the feed service drops posts whose author is no longer followed (it already checks during
   hydration). Optionally clean the feed list in the background.
3. **A celebrity with 200 million followers deletes a post. What happens?** The post row is marked deleted and its
   cache entry is invalidated. Because celebrities are pulled, no feed lists hold the ID; for pushed authors,
   hydration filters deleted posts, so stale IDs in feed lists are harmless.
4. **How would you add "close friends" stories?** Store an audience list per story (or a flag plus the author's
   close-friends set) and check membership when building the tray. The cache entry for that author becomes
   per-audience, so keep the close-friends check outside the shared cache.
5. **How would you show "liked by alice and 1,203 others"?** The count comes from the counter; "alice" is chosen
   by intersecting the post's recent likers with the viewer's following list (both bounded), cached per viewer
   for a short time.
