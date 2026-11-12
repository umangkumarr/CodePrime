---
title: "Design TikTok (short-video feed)"
description: "Design a TikTok-style short-video app: the For You feed built on an interest graph, instant playback, a real-time recommendation loop, counters and moderation."
difficulty: "Medium"
sidebar:
  label: "TikTok (short-video feed)"
tags: ["Recommendation", "Video", "Streaming", "Feeds", "CDN"]
---

Open TikTok and a video is already playing. Swipe up and the next one starts instantly. After ten minutes the
app seems to know you better than your friends do. You never told it what you like, and you may not follow
anybody. It worked it out from **how you watch**: what you finished, what you watched twice, what you swiped
past in half a second.

That is the heart of this design. TikTok is a **video service** (store, process and stream millions of clips),
a **recommendation engine** that learns from every swipe within seconds or minutes, and an **event pipeline**
carrying billions of tiny signals a day from phones back to that engine. This case study builds all three,
then covers likes and comments, creators, sounds and duets, moderation, and what breaks at scale.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. TikTok in 5 minutes: an interest graph, not a social graph

Most older feeds (Facebook, early Instagram, Twitter) start from a **social graph**: who you follow. Your feed
is mostly posts from those people. TikTok's main screen, the **For You** feed, starts from an **interest
graph**: which videos people like you enjoyed. Who made a video matters much less than whether it matches
your interests. A creator with zero followers can reach millions on their first post.

That one difference changes the whole architecture. A follow-graph feed is a **fan-out** problem (copy each
new post to the followers' feeds). An interest-graph feed is a **search and ranking** problem: for every
request, find the best few videos out of hundreds of millions for this one person, right now.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **For You feed** | The endless, personalised stream of videos on the home screen | A radio station tuned only for you |
| **Interest graph** | Links between users and the kinds of content they engage with, learned from behaviour | A shop assistant who remembers what you browse, not who you came in with |
| **Signal** | One piece of evidence about taste: watched to the end, rewatched, liked, shared, skipped fast | A raised eyebrow or a yawn |
| **Watch time / completion rate** | How long you watched, and what fraction of the video | Did you stay for the whole song? |
| **Candidate generation** | Cheaply picking a few thousand plausible videos from hundreds of millions | Shortlisting CVs before interviews |
| **Ranking** | Scoring each candidate carefully with a machine-learning model to pick the best few | The interviews themselves |
| **Embedding** | A list of numbers (a vector) that places a user or video in a "taste space"; close vectors mean similar taste | Coordinates on a map of interests |
| **Exploration** | Deliberately showing something new (a fresh video, a new topic) to learn whether it works | A chef's "try this" on the menu |
| **CDN** | Content delivery network: servers near users that cache video files | A local warehouse instead of the factory |
| **Prefetching** | Downloading the start of the next videos before you swipe | The waiter bringing the next course as you finish this one |

TikTok has published the broad strokes of how For You works: the feed is driven by your **interactions**
(likes, shares, comments, what you watch fully, what you skip), by **video information** (captions, sounds,
hashtags) and, more weakly, by **device and account settings** (language, country). It has also said that
finishing a longer video is a strong signal, and that a creator's follower count is not by itself a direct
factor. Everything below is a typical design consistent with that, not TikTok's internal code.

## 2. Requirements

### Functional (what users can do)

- **Watch the For You feed**: an endless vertical stream of short videos, personalised from the first swipe.
- **Following feed**: videos from accounts you follow, newest and most relevant first.
- **Upload** a short video (a few seconds up to several minutes) with a caption, hashtags and a **sound**.
- **Interact**: like, comment, share, follow, save, "not interested".
- **Sounds**: every video has an audio track that others can reuse; tapping a sound lists every video using it.
- **Duet and stitch**: make a video that plays beside (duet) or after a clip of (stitch) someone else's video.
- **Creator analytics**: views, watch time, audience and traffic sources per video.
- **Moderation**: harmful videos are blocked or limited, and users can report content.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Time to first frame** | Under ~200 ms after a swipe; most swipes should feel instant (0 ms) | A short-video app lives or dies by flow; one spinner and people leave |
| **Feed latency** | Next page of recommendations in under ~150 ms at the server | Ranking runs on every page request |
| **Freshness of learning** | Your behaviour affects your feed within the same session (seconds to minutes) | This is what makes the feed feel "magic" |
| **Scale** | ~1 billion monthly users, hundreds of millions daily | TikTok announced 1 billion monthly users in 2021 |
| **Availability** | 99.99% for watching; uploads and counters may degrade first | Watching is the core product |
| **Durability** | Never lose an uploaded video once we say "posted" | Creators' work |
| **Consistency** | Counters and recommendations can be eventually consistent; your own like must show at once | Nobody minds if a view count lags a few seconds |

### Out of scope

Live streaming, direct messages, the shop, ads, search, and the video-editing tools inside the app. Mention them
in an interview, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resources dominate**.

**Assumptions:** 500 million daily active users. Each watches **100** videos a day (about 50 minutes at an
average of 30 seconds per video). **2%** of daily users upload one video a day. A raw upload averages **20 MB**.
Each view produces about **5** small events (impression, play start, progress, finish or swipe, sometimes a
like) of about **200 bytes**.

**Traffic**

- Views per day: $500\text{M} \times 100 = 50\text{B}$, about **580,000 per second**, and roughly **1.7 million
  per second** at peak (3× average).
- Feed requests: one page holds about 8 videos, so $50\text{B} / 8 \approx 6\text{B}$ a day, about **72,000 per
  second** (over 200,000 at peak). Each one runs a ranking pipeline.
- Uploads: $500\text{M} \times 2\% = 10\text{M}$ a day, about **116 per second**. Writes are tiny next to reads.
- Interaction events: $50\text{B} \times 5 = 250\text{B}$ a day, about **2.9 million per second** on average.

**Storage and bandwidth**

- New raw video: $10\text{M} \times 20\text{ MB} = 200\text{ TB}$ a day. Transcoded renditions add a similar
  amount again, so roughly **400 TB a day** before replication.
- Events: $250\text{B} \times 200\text{ B} = 50\text{ TB}$ a day of raw interaction data.
- Video served: if a view downloads about **4 MB** (30 seconds at roughly 1 Mbit/s), that is
  $50\text{B} \times 4\text{ MB} = 200\text{ PB}$ a day, about $200\text{ PB} / 86{,}400\text{ s} \approx 2.3\text{ TB/s}$,
  or **18 Tbit/s** on average.

Three conclusions follow:

1. **Egress dominates.** Serving video is by far the biggest cost, so almost every byte must come from a CDN
   edge close to the viewer, not from our data centres.
2. **The event stream is enormous.** Millions of events a second is a bigger write load than uploads, likes and
   comments combined. It needs a log built for that volume (Kafka-style), not a database.
3. **Ranking is the main compute cost.** Tens of thousands of feed requests a second, each scoring hundreds or
   thousands of candidates, is a large machine-learning serving fleet.

## 4. The API

The app talks to us over HTTPS with a JSON (or protobuf) API. Video bytes never pass through these services:
they come from the CDN.

| Method and path | What it does |
| --- | --- |
| `GET /v1/feed/foryou?count=8&cursor=...` | Next page of recommended videos: IDs, captions, creator, sound, counts and **manifest URLs** on the CDN (a manifest is a small file listing a video's segments and qualities). |
| `GET /v1/feed/following?cursor=...` | Videos from accounts you follow. |
| `POST /v1/videos` | Start an upload: caption, hashtags, `sound_id`, optional `remix_of` (duet/stitch). Returns `video_id` and a **pre-signed upload URL**. |
| `POST /v1/videos/{id}/publish` | The file is uploaded; start processing. Returns `202 Accepted`. |
| `POST /v1/events` | A **batch** of interaction events: impressions, watch progress, completions, skips. |
| `POST /v1/videos/{id}/like` / `DELETE` | Like or unlike. Idempotent: liking twice is still one like. |
| `POST /v1/videos/{id}/comments` | Add a comment. `GET` lists them with a cursor. |
| `GET /v1/sounds/{id}/videos?cursor=...` | Every video using a sound. |
| `GET /v1/creator/videos/{id}/stats` | Creator analytics for one video. |

Two choices are worth defending in an interview:

- **Pre-signed URLs** let the app upload the large file straight to object storage, so our API servers never
  carry gigabytes of video. A pre-signed URL is a link with a short-lived signature that permits exactly one
  upload to one location.
- **Events go in batches.** Sending one HTTP request per "watched 3 more seconds" would mean millions of requests a
  second and drain phone batteries. The app buffers events and sends them every few seconds, or when the
  user leaves the app.

## 5. High-level design

[![High-level architecture: the app calls the API gateway, which routes uploads to the upload service and processing pipeline, feed requests to the For You service and recommender, and event batches to the event collector, event log and stream processors that update the feature store and counter store; video bytes come from the CDN edge, which fetches from video storage on a miss](/img/system-design/tiktok/01-architecture.png)](/img/system-design/tiktok/01-architecture.png)

*Select the diagram to zoom in and move around.*

The diagram has three horizontal paths, one for each job:

- **Top: the upload path.** The **upload service** creates the video record and hands out the upload URL. The
  **processing pipeline** transcodes the video, runs safety checks and marks it ready in the **video metadata
  DB**. Files live in **video storage** (an object store such as S3 or GCS).
- **Middle: the feed path.** The **For You service** answers `GET /feed`. It asks the **recommender** for the
  best videos for this user, which reads user and video signals from the **feature store** (a fast key-value
  store holding precomputed numbers for models).
- **Bottom: the learning path.** The **event collector** receives event batches and appends them to the
  **event log** (Kafka-style topics). **Stream processors** turn the raw events into fresh features and
  counter updates within seconds.

And on the far left, the **CDN edge** serves all video bytes. The app talks to it directly using the manifest
URLs from the feed.

The single most useful idea in this design: **the feed path and the learning path form a loop.** You watch,
the events flow back, the features change, and the next page you ask for is ranked with them. The tighter that
loop, the better the feed feels.

## 6. Flow 1: uploading a video

A creator records a 30-second clip with a trending sound and posts it.

[![Upload sequence: the app asks the upload service for a video_id and a pre-signed URL, uploads the raw file to video storage in chunks, calls publish and gets 202 Accepted; asynchronously the processing workers write renditions and segments, set the status to ready or blocked, and the recommender adds the video to its fresh pool](/img/system-design/tiktok/02-upload.png)](/img/system-design/tiktok/02-upload.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Chunked, resumable upload.** Phones lose signal. The file goes up in pieces (say 5 MB each) and a failed
  piece is retried alone, not the whole file.
- **The creator waits only for steps 1 to 6.** Processing takes seconds to a minute; the app shows "posting"
  and the creator can keep scrolling.
- **Processing** produces several **renditions** (the same video at different resolutions and bitrates), cuts
  each into short **segments** for streaming, extracts a cover image and **fingerprints the audio** so the
  sound can be matched to an existing one or registered as a new original sound.
- **Safety checks run before distribution.** Automated models score the video before it reaches anyone's
  For You feed (section 13).
- **Step 9 puts the video into a fresh pool**, the starting point for exploration (section 10).

The transcoding pipeline is the same idea as YouTube's, at smaller sizes. For a deeper treatment (splitting a
video into chunks, transcoding them in parallel, codecs, adaptive bitrate ladders) see
[Design YouTube](/system-design/case-studies/medium/youtube/). Short videos make one thing easier: a 30-second
clip transcodes in seconds, so we can afford more renditions per video.

## 7. Flow 2: opening the app and instant playback

The goal is that **the next video is already playing when your finger lifts**. That is not luck; it is three
techniques working together.

[![Playback sequence: the app gets a page of 8 video IDs and manifest URLs from the For You service, which asked the recommender; it fetches the small first segment of video 1 from the CDN edge, prefetches the start of videos 2 and 3 while video 1 plays, sends batched watch events to the event collector, and asks for the next page when 3 videos are left](/img/system-design/tiktok/03-playback.png)](/img/system-design/tiktok/03-playback.png)

*Select the diagram to zoom in and move around.*

**1. Prefetch the next videos.** While you watch video 1, the app quietly downloads the **first second or two**
of videos 2 and 3. When you swipe, playback starts from the phone's memory with zero network wait. It does
not download whole videos ahead: most get swiped away early, and the bytes (and the user's data plan) would be
wasted. A typical policy: prefetch the first segment of the next 2–3 videos, and fetch the rest of a video only
once it is on screen.

**2. Small, cheap first segments.** Video is streamed with **adaptive bitrate (ABR)** protocols such as HLS or
DASH: the file is cut into segments, and the player chooses a quality per segment based on measured network
speed. For short videos we make the **first segment short and modest in quality**, so it arrives in one quick
request and starts at once; the player steps up to higher quality for later segments if the network allows. A
viewer forgives a slightly soft first second; they do not forgive a spinner.

**3. Serve from the edge.** Every segment comes from a **CDN** server near the viewer. Popular videos are
already cached there. Because the feed tells the app which videos are coming next, the system can even **warm
the edge cache** for a region before the swipe reaches them.

Two more details make the feed itself fast:

- **Pages, not single videos.** The app asks for about 8 videos at a time and asks for the next page when about
  3 are left, so a slow ranking request never stalls playback.
- **Each new page is ranked with fresh signals.** If you skipped three cooking videos in a row, the next page
  already knows. That is why the page is small: a page of 100 would be ranked on stale information.

## 8. Deep dive: how the recommender picks videos

Scoring every one of hundreds of millions of videos with a heavy model for every request is impossible: at
72,000 requests a second it would be trillions of model runs per second. So recommendation is a **funnel**:
cheap steps throw away almost everything, and the expensive model only sees a few hundred videos.

[![Recommendation funnel: candidate sources (similar videos by embedding search, followed creators, trending in region and sounds, fresh test-pool videos) feed a filter that drops seen, blocked and unsafe videos; a light ranker cuts thousands to about 500; a heavy ranker scores probabilities of finishing, liking and sharing using the feature store; a final mix adds diversity and exploration slots and returns about 8 videos and a cursor](/img/system-design/tiktok/04-recommendation.png)](/img/system-design/tiktok/04-recommendation.png)

*Select the diagram to zoom in and move around.*

### Step 1: candidate generation (retrieve)

Several independent **sources** each propose a few hundred videos in a few milliseconds:

- **Embedding search.** A **two-tower model** learns one vector per user (from their history) and one per video
  (from its content and who engaged with it), so that a user's vector lands near videos they will enjoy.
  Finding the nearest videos to your vector is an **approximate nearest neighbour (ANN)** search over an
  index of video vectors. "Approximate" means it trades a little accuracy for answering in milliseconds
  instead of scanning every vector.
- **Followed creators.** Recent videos from accounts you follow.
- **Trending.** Videos and sounds rising fast in your region or language.
- **Fresh videos.** New uploads in their test phase (section 10).

Using several sources is deliberate: if one is biased or broken, the others still give a reasonable feed.

### Step 2: filter

Remove anything you have already seen recently (a per-user "seen" set, often a **Bloom filter**: a compact
structure that answers "definitely not seen" or "probably seen"), creators you blocked, videos you marked
"not interested", and anything not eligible for recommendation.

### Steps 3 and 4: rank in two passes

- A **light ranker** (a small, fast model) scores a few thousand candidates and keeps about 500.
- A **heavy ranker** (a large neural network with hundreds of features) predicts, for each of those 500,
  several outcomes: the probability you **finish** it, **rewatch** it, **like**, **comment**, **share**,
  **follow** the creator, or **skip** it within a second. These are combined into one score, for example
  $\text{score} = w_1 P(\text{finish}) + w_2 P(\text{like}) + w_3 P(\text{share}) - w_4 P(\text{skip}) + \dots$
  The weights are a product decision, tuned with A/B tests.

Why predict many outcomes instead of just "like"? Because **most viewers never press like**. Watch time,
completion and rewatching are signals everyone gives, on every video, without trying. Short videos make them
unusually clean: watching 14 seconds of a 15-second clip is a strong vote; leaving after 1 second is a strong
vote the other way.

### Step 5: mix

A feed of the top 8 scores would often be eight near-identical videos. The final step applies **business
rules**: no two videos from the same creator or sound in a row, a mix of topics, and a few **exploration
slots** for topics you have not seen yet or for fresh videos. This is how the feed avoids trapping you in one
narrow interest, and how it discovers new ones.

## 9. Deep dive: the real-time feedback loop and event pipeline

This is the part that makes TikTok feel different. A new user can open the app with no history, and within a
dozen swipes the feed adapts. That requires two kinds of freshness:

- **Fresh features** (seconds): "this user just skipped three cooking videos", "this video's completion rate in
  the last 10 minutes is 70%".
- **Fresh models** (minutes): the model's own learned numbers (its weights and embeddings) updated from the
  newest behaviour. ByteDance has published a paper on this, describing a recommendation system ("Monolith")
  that trains online from a stream of user actions and syncs updated parameters to the serving models within
  minutes.

[![Event pipeline: the app sends event batches to a collector that validates and dedupes, appends them to a partitioned event log; feature jobs, counter jobs and online training consume the stream and update the feature store, counter store and model servers within seconds to minutes; an hourly dump to the data lake feeds daily batch retraining and analytics](/img/system-design/tiktok/05-event-pipeline.png)](/img/system-design/tiktok/05-event-pipeline.png)

*Select the diagram to zoom in and move around.*

### What an event looks like

```json
{"event_id": "a1f3...", "user_id": 42, "video_id": 9001, "type": "watch_progress",
 "watched_ms": 14000, "duration_ms": 15000, "loops": 1, "request_id": "r-77", "client_ts": 1731400000123}
```

`request_id` ties the event back to the exact feed page (and ranking) that showed the video. That join is what
turns raw events into **training examples**: "we showed video 9001 in position 3 with these features, and the
user watched 93% of it".

### Handling millions of events a second

- **Batch on the device, batch at the collector.** The app sends a batch every few seconds; collectors are
  stateless servers behind a load balancer that validate, drop malformed events, and append to the log in
  batches.
- **A partitioned log.** The event log (Kafka or similar) is split into many **partitions**. Partitioning by
  `user_id` keeps one user's events in order, which feature jobs need ("last 20 things this user did").
  Counter jobs re-partition by `video_id` so all events for a video meet in one place.
- **Deduplication.** Phones retry. Each event carries a unique `event_id`; stream jobs keep a short-lived set of
  recent IDs and drop repeats, so a retried batch does not double-count.
- **Stream processors** (Flink-style jobs) keep running state in memory with periodic checkpoints, so a
  crashed job resumes from its last checkpoint and replays the log from there.
- **Two speeds.** The real-time path updates features and models within seconds to minutes. The batch path
  copies every event to a **data lake** (cheap columnar files) where daily jobs retrain models from scratch,
  compute creator analytics and check that the real-time numbers did not drift.
- **Shed load gracefully.** If the pipeline falls behind, the feed still works with slightly older features.
  Low-value events (very fine-grained progress pings) can be sampled before high-value ones (likes, follows)
  are ever dropped.

## 10. Deep dive: giving new videos a chance (exploration)

Hundreds of thousands of videos are uploaded every hour. The model knows nothing about a new video: no watch
time, no likes. This is the **cold-start problem**. If we only recommended videos with good history, new
videos would never get any history. The answer is to **test them on small audiences and widen the audience
while they keep doing well**.

[![Exploration workflow: a ready video is shown to a small pool of a few hundred viewers; its finish, rewatch and share rates are measured and compared with similar videos of the same age; if it does better it moves to a pool about 10 times larger and the measurement repeats per tier until broad distribution; if not it stays at its level for a niche audience; very high reach triggers human review first](/img/system-design/tiktok/06-exploration.png)](/img/system-design/tiktok/06-exploration.png)

*Select the diagram to zoom in and move around.*

How a typical design does it:

- **Content understanding first.** Even with no views, models can read the caption, hashtags, sound, speech
  and visual content, and produce a first **content embedding**. That decides *who* the first small pool is:
  viewers whose interests match.
- **Small test pool.** The video fills some of the exploration slots in those viewers' feeds (section 8).
- **Compare like with like.** Its completion, rewatch, like and share rates are compared with other videos of
  similar length and age, not with all-time hits.
- **Widen in tiers**, each larger than the last (say ten times), while the numbers hold up. A video that stops performing
  stays at the level it reached; it is not punished, just not pushed further.
- **Reach triggers extra checks.** A video that is suddenly about to reach millions is a good moment for a
  human moderator to look at it, because a mistake there is very visible.

This is also how **new users** are handled: the first few dozen videos are a deliberate spread of popular
topics, and the feed narrows quickly as signals arrive. Interest-based picks for new users can also lean on
language and region from the device settings.

The principle to say in an interview: **exploration versus exploitation.** Exploiting means showing what we
are confident you will like; exploring means spending a little attention on uncertain videos to learn. Too
little exploration and the feed gets stale and new creators starve; too much and the feed feels random.

## 11. Likes, comments, shares and view counters

A viral video can receive tens of thousands of likes a minute. If every like ran
`UPDATE video_counters SET likes = likes + 1 WHERE video_id = ?`, every one of those writes would fight for the
same row: a **hot key**.

The design separates the **fact** from the **total**:

- **The fact** ("user 42 liked video 9001") is written to the `likes` table, keyed by `(video_id, user_id)`.
  The key makes it idempotent: a double tap is still one like. The app shows your own like immediately
  (optimistic update), so you see read-your-writes even though the total lags.
- **The total** is computed by the counter jobs from the event stream. They sum likes per video for a few
  seconds and write one `+n` update instead of `n` separate `+1`s.
- **Very hot counters** can be split into several **sub-counters** (shards) that are written independently and
  added up on read, so no single row takes every write.
- **Views** are never counted one write per view. They come only from the event stream (after deduplication and
  basic fraud checks such as ignoring a bot replaying the same video) and are displayed rounded ("1.2M").

**Comments** are ordinary rows sharded by `video_id`, listed with a cursor. Popular videos get millions; the app
shows a ranked first page (top comments) and pages through the rest on demand.

## 12. Low-level design: the data model

[![Data model: users and follows; videos with creator_id, sound_id, remix_of_id and remix_type, plus sounds and video_renditions; likes, comments and video_counters per video](/img/system-design/tiktok/07-data-model.png)](/img/system-design/tiktok/07-data-model.png)

*Select the diagram to zoom in and move around.*

Design decisions hidden in this diagram:

**1. A sound is its own entity.** Every video points to one `sound_id`. The sound may be a licensed track or an
"original sound" extracted from someone's upload (`origin_video_id`). Making sounds first-class gives us the
sound page ("47,000 videos use this sound") with one indexed query on `videos.sound_id`, and lets trends spread
through sounds: when a sound is rising, its videos become candidates. Audio fingerprinting during processing
links re-uploads of the same audio to one sound.

**2. Duets and stitches are a self-reference.** A remix is a normal video with `remix_of_id` pointing at the
original and `remix_type` saying `duet` or `stitch`. The original's page can list its remixes, the original
creator can be credited, and if the original is deleted or its creator disables remixing, the app can check
one field. The duet itself is rendered into a new video file at creation time, so playback stays simple.

**3. Renditions are rows, files are blobs.** `video_renditions` stores which qualities exist and where each
manifest lives. The bytes live in object storage and the CDN.

**4. Engagement is split by size.** `likes` and `comments` are huge, append-mostly tables sharded by
`video_id`. `video_counters` holds the totals the app shows. The raw events (every watch) are not in any of
these tables; they live in the event log and the data lake.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Users, videos, sounds metadata | Billions of rows, point lookups by ID | Sharded MySQL or a wide-column store (Cassandra, HBase) | Simple access by key; scales horizontally |
| Follows | Edges, read by follower and by followee | Wide-column store, two tables (one per direction) | Both "who I follow" and "my followers" are fast range reads |
| Likes, comments | Huge, keyed by `video_id` | Wide-column store | Write-heavy, range reads per video |
| Counters | Small, very hot | Redis-style cache in front of a durable store | Fast reads; totals rebuilt from the stream if lost |
| Video files | Immutable bytes, petabytes | Object storage + CDN | Cheapest per byte; CDN serves the reads |
| Events | Ordered, huge stream | Kafka-style log, then a data lake (Parquet files) | Replay, many consumers, cheap long-term storage |
| Features | Key-value, read on every ranking | Low-latency KV store (Redis, or a custom store) | Hundreds of lookups per feed request |
| Video embeddings | Vectors | ANN index (for example FAISS-style or a vector database) | Nearest-neighbour search in milliseconds |

## 13. Creator analytics

Creators see views, average watch time, completion rate, where viewers came from (For You, following,
profile, sound page) and audience demographics. None of this needs new data: it is the **same event stream**,
viewed from the creator's side.

- **Real-time numbers** (views in the last hour) come from stream jobs keyed by `video_id`.
- **Detailed reports** (retention curve: what fraction of viewers were still watching at second 5, 10, 15)
  come from daily batch jobs over the data lake, written to an analytics store (a columnar OLAP database such
  as ClickHouse or Druid) that answers "group by day, by country" quickly.
- A small delay (minutes for live counts, a day for deep reports) is acceptable and keeps this off the hot path.

## 14. Moderation

With millions of uploads a day, humans alone cannot review everything, and a harmful video can spread within
minutes. Moderation is layered, and TikTok has said publicly that it uses both automated systems and human
moderators.

[![Video lifecycle: uploading, processing, safety check, test pool and distributed; processing can fail if the file cannot be decoded; the safety check can mark a video limited (profile only, not in For You) when borderline or removed on a violation; a distributed video can be removed when reports are upheld](/img/system-design/tiktok/08-video-states.png)](/img/system-design/tiktok/08-video-states.png)

*Select the diagram to zoom in and move around.*

- **Before distribution:** models check frames, audio, speech and caption. Clear violations are removed;
  uncertain ones go to a human review queue; clean ones go to the test pool.
- **Limited, not removed.** Some content breaks no rule but should not be pushed to strangers. TikTok's
  community guidelines describe content that is allowed but **not eligible for the For You feed**. In our data
  model that is just a status the candidate filter respects.
- **During growth:** the reach-based check from section 10 adds human review as a video goes viral.
- **After distribution:** user reports, plus re-scanning with newer models, can remove a video later. Removal
  updates the status, the candidate filter drops it, and the CDN copies are purged.
- **Known bad content** is matched by fingerprint (perceptual hashes of video and audio), so a removed video
  re-uploaded with small edits is caught at processing time.

## 15. What breaks as it grows, and how to fix it

**The viral video.** One clip gets 50 million views in a day. *Fix:* its segments are cached at every edge (the
CDN loves a hot object); its counters use batched and sharded updates; its comments are paged and ranked;
human review kicks in by reach.

**The cold-start flood.** Hundreds of thousands of new videos an hour all need test viewers. *Fix:* cap
exploration slots per feed page, prioritise fresh videos whose content embedding predicts a good audience, and
keep the test pools small.

**The event firehose falls behind.** A spike (a big event, a new feature) doubles event volume. *Fix:* the log
absorbs the burst; stream jobs autoscale from consumer lag; the feed keeps working on slightly older features;
low-value events are sampled first.

**The filter bubble.** A user only ever sees one topic, and slowly gets bored. *Fix:* diversity rules in the mix
step, exploration slots, and a "not interested" button that is a strong negative signal.

**The egress bill.** Petabytes a day. *Fix:* efficient codecs (H.265 or AV1 where devices support them), a
rendition ladder tuned for phones, prefetching only the first segment, and caching deep inside ISP networks.

**Model staleness and drift.** A model that was right last week misses this week's trend. *Fix:* online
training for fast updates plus daily full retraining for stability, with A/B tests and automatic rollback if
key metrics drop.

## 16. Reliability: degrade, do not fail

| Risk | Defence |
| --- | --- |
| The heavy ranker is slow or down | Fall back to the light ranker's order, then to a cached "popular in your region" list; the feed never shows an error |
| The feature store is unavailable | Rank with default features; quality dips slightly, the app keeps playing |
| A CDN region has trouble | DNS and the app switch to another CDN or region; the manifest lists alternative hosts |
| An upload half finishes | Resumable chunked upload; the video is "posted" only after the raw file is durable in object storage |
| A batch of events is sent twice | `event_id` deduplication in the stream jobs; likes are keyed by `(video_id, user_id)` |
| A stream job crashes | Restart from its last checkpoint and replay the log; at-least-once delivery plus idempotent updates |
| A bad model ships | Gradual rollout to a small share of traffic, metrics watched, instant rollback to the previous model |

The pattern to remember: **the feed is a best effort, video bytes are a cache, uploads are sacred.** Each part
gets the reliability its users need, not more.

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Feed source | Follow graph (fan-out) | Interest graph (retrieve + rank per request) | **Interest graph** for For You; a follow-based feed only for the Following tab |
| When to rank | Precompute feeds offline | Rank on every page request | **Per request**, small pages, so the latest swipes count |
| Main signal | Explicit (likes, follows) | Implicit (watch time, completion, skips) | **Both**, with implicit signals weighted heavily because everyone gives them |
| Model freshness | Daily batch training | Online training from the stream | **Both**: online for minutes-fresh updates, batch for stability |
| Prefetch | Whole next videos | First segment of the next 2–3 | **First segment**: instant start without wasting data on skipped videos |
| Counters | Exact, synchronous | Approximate, streamed and batched | **Streamed**: hot-key safe; your own like is shown at once |
| New videos | Only show proven videos | Test with small pools, widen on success | **Test and widen**: gives every creator a chance and fixes cold start |

## Cheat sheet for last-minute revision

- **Core idea:** the For You feed is an **interest graph**: rank per request from behaviour, not from who you
  follow. A creator with zero followers can go viral.
- **Three paths:** upload (pre-signed URL → object storage → transcode + safety checks → ready), feed (For You
  service → recommender → feature store), learning (events → collector → log → stream jobs → features, counters,
  models).
- **Recommendation funnel:** retrieve (embedding ANN, follows, trending, fresh) → filter (seen, blocked, unsafe) →
  light rank (to ~500) → heavy rank (P(finish, like, share, skip)) → mix (diversity, exploration).
- **Signals:** watch time, completion, rewatch and fast skips matter most; likes and shares are rarer but strong.
- **Freshness:** features in seconds, models in minutes (online training), full retrain daily.
- **Instant playback:** small pages (~8), prefetch the first segment of the next 2–3 videos, small low-bitrate
  first segment, ABR, CDN edges.
- **Exploration:** new videos go to small test pools and widen in tiers while they beat similar videos.
- **Counters:** facts in tables, totals from the stream, batched `+n`, sharded for hot videos.
- **Data model:** sounds are first-class; duets and stitches are `remix_of_id` on the video.
- **Moderation:** models before distribution, human review for uncertain and fast-growing videos, "not eligible for
  For You" as a status, fingerprints catch re-uploads.
- **Numbers:** ~50B views a day (~580K/s), ~2.9M events/s, ~72K feed requests/s, ~18 Tbit/s video egress.

## Practice questions

1. **A new user installs the app. What do they see in the first minute, and how does it adapt?** With no
   history, the first page comes from popular videos in their language and region, spread across topics on
   purpose. Each watch, skip and like flows through the event pipeline into fresh features within seconds.
   Because pages are small (~8) and each is ranked on request, the second or third page already reflects what
   they finished and what they skipped.
2. **How would you stop the feed showing a video the user has already watched?** Keep a per-user "seen" set of
   recent video IDs, often a Bloom filter (compact, no false "not seen" answers) in a fast key-value store,
   updated from the event stream and checked in the filter step. Old entries expire after some weeks so a very
   good video can occasionally come back.
3. **A creator says their video "got stuck at 300 views". What would you check?** The video's status (limited by
   a safety check? still processing?), then its test-pool metrics compared with similar videos: if completion
   and rewatch were below its peers, it correctly stayed at the first tier. Also check whether it reached its
   intended test audience at all (content embedding, language), and whether it violated a rule that made it
   ineligible for For You.
4. **How would you add a "Friends" feed showing only videos from mutual follows?** This one is a follow-graph
   problem: candidates come from mutual follows' recent videos (a pull from their outboxes, since mutual-follow
   lists are small), then the same ranking stack orders them. No new infrastructure beyond one more candidate
   source.
5. **The event pipeline is two hours behind after an outage. What is the user impact and how do you recover?**
   Feeds still work, ranked on two-hour-old features, so they adapt more slowly; counters and creator analytics
   lag. Recovery: scale out the stream jobs to catch up from the log (nothing is lost because the log retains
   data), prioritise the feature and counter topics over analytics, and let the batch pipeline reconcile totals.
