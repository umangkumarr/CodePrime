---
title: "Design YouTube (video sharing)"
description: "Design YouTube: resumable uploads, a parallel transcoding pipeline, adaptive streaming through a tiered CDN, the long tail and view counts."
difficulty: "Medium"
sidebar:
  label: "YouTube (video sharing)"
tags: ["Video", "CDN", "Data pipelines", "Storage", "Counters"]
---

YouTube looks like two buttons: **Upload** and **Play**. Underneath, it is several hard systems in one. It is a
**loading dock** that must accept a 20 GB file over a shaky hotel Wi-Fi without making the creator start again,
a **factory** that turns every upload into dozens of versions for every screen and network, a **distribution
network** that puts those versions close to two billion viewers, a **referee** checking each upload against
copyrighted material and the rules, and a **scoreboard** that counts billions of views without being fooled by
bots.

The thing that makes it different from Netflix is **who supplies the videos**. Netflix has thousands of
carefully produced films and series that it encodes once, with great care, and can predict who will watch. YouTube has
hundreds of hours of new video uploaded **every minute** by anyone, most of which few people will ever watch,
and a few of which will be watched hundreds of millions of times within days. Uploads, the processing
pipeline and that **long tail** of rarely watched videos shape this whole design.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Video in 5 minutes: the vocabulary

A video file is not one thing. Before designing anything, we need a few words.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Resolution** | How many pixels each frame has: 360p, 720p, 1080p, 4K (2160p). The number is the frame height | The size of a photo print |
| **Bitrate** | How many bits per second the video uses, for example 5 Mbps. More bits, better picture, bigger file | How much ink the printer may use |
| **Codec** | The compression method: H.264 (AVC), VP9, AV1 for video; AAC, Opus for audio. Newer codecs give the same quality in fewer bits but cost more CPU to encode | Shorthand: the same sentence in fewer strokes, but slower to write |
| **Container** | The file that wraps video, audio and subtitles together: MP4, WebM, MOV | The envelope holding the letter and the photos |
| **Transcoding** | Decoding a video and re-encoding it with a different codec, resolution or bitrate | Translating a book into another language and a smaller print |
| **Rendition** | One encoded version of a video, for example "720p, VP9, 2.5 Mbps" | One edition of the book |
| **Bitrate ladder** | The full set of renditions for one video, from 144p up to 4K | Paperback, hardback, large print, audiobook |
| **Segment** | A short slice of a rendition, a few seconds long, stored as its own small file | One page of the book |
| **Manifest** | A small text file listing the renditions and the URL of every segment. Formats: **HLS** (`.m3u8`) and **MPEG-DASH** (`.mpd`) | The table of contents |
| **ABR** (adaptive bitrate) | The player picks the rendition for each next segment based on its measured bandwidth and buffer | A driver changing gear on a hill |
| **CDN** | A content delivery network: many cache servers near viewers that keep copies of popular files | Local convenience shops stocking the best sellers |
| **Origin** | The central storage that holds every file; caches fetch from it on a miss | The central warehouse |

Two ideas from this table shape the whole design:

1. **One upload becomes many files.** A creator uploads one file. We produce a ladder of renditions in a
   couple of codecs, each cut into thousands of segments, plus thumbnails and a manifest. That is the
   **processing pipeline**.
2. **Playback is just downloading small files in order.** Because segments are ordinary files with ordinary
   URLs, any HTTP cache can serve them. That is what lets a CDN do almost all of the work.

## 2. Requirements

### Functional (what users can do)

- **Upload** videos up to many gigabytes and several hours long, from web and mobile, surviving network drops.
- **Process** each upload: check it, transcode it into many resolutions and codecs, make thumbnails, check it
  for copyrighted material and policy violations.
- **Edit metadata**: title, description, tags, thumbnail, visibility (public, unlisted, private, scheduled).
- **Watch** videos on any device and network, starting fast and adapting quality as bandwidth changes.
- **Channels and subscriptions**: every creator has a channel; viewers subscribe and see new uploads.
- **Engage**: like, comment (with replies), share.
- **View counts** on every video, plus analytics for creators.
- **Discover**: a personalised home page, "up next" suggestions, and search.
- **Live streaming** (as an extension, see section 14).

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Durability** | Never lose an accepted upload (originals and renditions replicated) | A creator's work may exist nowhere else |
| **Availability** | 99.99% for playback; uploads can tolerate brief degradation | Playback is what almost everyone does |
| **Start-up latency** | First frame in under ~2 s; rebuffering rare | Viewers leave if a video stalls |
| **Processing time** | A low-resolution version playable within minutes of upload; HD and newer codecs may follow later | Creators want to publish quickly |
| **Scale** | Hundreds of hours uploaded per minute; over a billion hours watched per day | YouTube has publicly stated both figures |
| **Consistency** | Metadata and the creator's own edits read-your-writes; counts eventually consistent | Nobody minds a view count that is a minute old |
| **Cost** | Bandwidth and storage dominate; optimise them first | Serving video is the largest bill |

### Out of scope

Ads, payments and creator monetisation, YouTube Music and Shorts' vertical feed, the ML inside recommendations,
the video editor, and digital rights management. Mention them, then set them aside.

:::note[How is this different from Netflix?]
| | Netflix-style service | YouTube-style service |
| --- | --- | --- |
| Who uploads | The company, thousands of films and series | Anyone, hundreds of hours a minute |
| Encoding | Slow, careful, per-title tuning; time is cheap per title | Must be fast and automatic for every upload |
| Popularity | Few titles, mostly predictable; can pre-position everything | Huge catalogue, power-law popularity, viral surprises |
| Hard parts | Delivery, personalisation | Uploads, processing pipeline, long tail, abuse, counting |
:::

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resources dominate**.

**Assumptions:** **500 hours** of video uploaded per minute (a figure YouTube has published). Average upload is
**10 minutes** long at **10 Mbps** (a phone's 1080p video), so one hour of upload is
$10\text{ Mbps} \times 3600\text{ s} / 8 = 4.5\text{ GB}$. Viewers watch **1 billion hours** a day (YouTube
announced passing this in 2017) at an average delivered bitrate of **2.5 Mbps**.

**Uploads**

- Hours uploaded per day: $500 \times 60 \times 24 = 720{,}000$ hours.
- Videos per day: $720{,}000 \times 6 = 4.3\text{M}$ (six 10-minute videos per hour), about **50 uploads per
  second** on average.
- Raw bytes in per day: $720{,}000 \times 4.5\text{ GB} \approx 3.2\text{ PB}$, about **37 GB/s**, or
  **300 Gbps** of upload traffic.

**Storage**

- Assume the whole ladder in one codec adds up to about the size of the original, and we keep **two codecs**.
  Renditions then add about $2 \times 3.2 = 6.4\text{ PB}$ a day. With the originals, that is roughly
  **10 PB a day**, over **3.5 EB a year**, before replication.
- Metadata is tiny in comparison: 4.3M videos × a few KB is a few tens of GB a day.

**Transcoding compute**

- Assume encoding one hour of video into one rendition takes about **one CPU-core-hour**, and the ladder has
  **8 renditions in 2 codecs** (16 encodes). That is $720{,}000 \times 16 \approx 11.5\text{M}$ core-hours a day,
  or about $11.5\text{M} / 24 \approx$ **480,000 cores** busy around the clock. Newer codecs such as AV1 cost
  several times more per hour, which is why encoding is a major cost (Google has publicly described building
  custom video-transcoding chips for YouTube).

**Playback**

- Bytes out per day: $1\text{B hours} \times 2.5\text{ Mbps} \times 3600 / 8 \approx 1.1\text{ EB}$.
- Average egress: $1.1 \times 10^{18} \times 8 / 86{,}400 \approx 100\text{ Tbps}$, with evening peaks well
  above that.
- Average concurrent viewers: $1\text{B hours} / 24 \approx$ **42 million**. If each player sends a progress ping
  every 10 seconds, that is about **4 million events per second** into the counting system.

Three conclusions follow:

1. **Egress dwarfs everything.** About 100 Tbps out versus 0.3 Tbps in: we send roughly 300 times more than we
   receive. Delivery must come from caches near viewers, not from our data centres.
2. **Storage and encoding are the next biggest costs**, and both grow with every upload whether or not anyone
   watches. This is the long-tail problem: we must avoid spending heavily on videos nobody will see.
3. **Metadata is small** and fits comfortably in a sharded database. The interesting scale is in bytes and events.

## 4. The API

Clients talk to us over HTTPS with a JSON API. Video bytes never pass through the normal API servers: uploads
go to a dedicated upload service and playback goes to the CDN.

| Method and path | What it does |
| --- | --- |
| `POST /v1/uploads` | Start a resumable upload. Body: file size, type, title, visibility. Returns a **session URL** and a `video_id`. |
| `PUT <session URL>` with `Content-Range: bytes 0-8388607/2147483648` | Send one chunk. The server answers `308` ("keep going, I have bytes 0 to N") or `200` when the file is complete. |
| `PUT <session URL>` with `Content-Range: bytes */2147483648` | "How much do you have?" after a failure. Returns the received range so the client resumes from there. |
| `PATCH /v1/videos/{id}` | Edit title, description, thumbnail, visibility, schedule. |
| `GET /v1/videos/{id}/play` | Watch-page data: metadata plus a **signed manifest URL** on the CDN. |
| `GET /v1/feed/home?cursor=...` | Personalised home page. |
| `GET /v1/search?q=...&cursor=...` | Search videos and channels. |
| `GET /v1/videos/{id}/comments?sort=top&cursor=...` | A page of comments. `POST` to the same path adds one. |
| `PUT /v1/videos/{id}/rating` | `{"rating": "like" \| "dislike" \| "none"}`. A `PUT` of a state, so retries are harmless. |
| `PUT /v1/subscriptions/{channel_id}` / `DELETE` | Subscribe or unsubscribe (idempotent). |
| `POST /v1/events/watch` | Batched playback pings: video, position, rendition, rebuffering. Feeds view counts and quality metrics. |

This upload protocol is the one Google publicly documents for resumable uploads to its APIs, including the
YouTube Data API. It is worth knowing because it shows the key idea: **the server, not the client, is the
source of truth for how many bytes have arrived.**

**Video IDs.** YouTube's IDs are 11 characters such as `dQw4w9WgXcQ`. Eleven characters from a 64-symbol
alphabet give $64^{11} \approx 7 \times 10^{19}$ possible IDs. Generating them **randomly** rather than
sequentially matters: an "unlisted" video is only private if nobody can guess its ID, and random IDs also do
not leak how many videos exist.

## 5. High-level design

[![High-level architecture: the creator app sends resumable chunks to the upload service, which writes them to the raw upload store; a completed file triggers jobs on a queue for processing workers, which write renditions to the video store and set status ready in the metadata DB. The viewer app calls the API gateway for the watch page, home and search, and fetches video segments from the CDN, which reads the video store on a miss. Watch pings feed the view counter, whose watch history and the metadata DB feed recommendations](/img/system-design/youtube/01-architecture.png)](/img/system-design/youtube/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Upload service:** manages resumable upload sessions and writes chunks to the raw store. Scaled separately
  because it holds long-lived connections moving gigabytes.
- **Raw upload store:** object storage (like S3 or GCS) for the original files, kept so we can re-encode later
  with better codecs.
- **Job queue** (for example Kafka or Pub/Sub): decouples "upload finished" from "processing", so a burst of
  uploads waits in line instead of failing.
- **Processing workers:** a large pool that validates, splits, transcodes, makes thumbnails and runs content
  checks. The biggest compute fleet in the system.
- **Video store:** object storage for segments and manifests. It is the **origin** for the CDN.
- **API gateway:** authentication, rate limits, routing to the right service.
- **Watch service:** builds the watch page and home page: metadata, signed manifest URL, recommendations.
- **Metadata DB:** videos, channels, subscriptions, comments; sharded, with caches in front.
- **CDN:** edge caches near viewers that serve the video segments. Carries almost all the bytes.
- **View counter:** turns billions of playback pings into view counts and watch history.
- **Recommendations and search:** separate systems fed from metadata and watch history.

The single most useful idea in this design: **the bytes and the metadata take different roads.** Video bytes go
straight from the creator to object storage and straight from the CDN to the viewer. The API servers only ever
handle small JSON requests, so they scale like an ordinary web service.

## 6. Flow 1: uploading a large video

A creator uploads a 2 GB file from a laptop on a train. With one plain HTTP request, a dropped connection at
95% means starting again, and on mobile networks that can happen every time. So uploads are **resumable and
chunked**.

[![Sequence for a resumable upload: the creator app opens a session and the upload service reserves a video_id in the metadata DB and returns a session URL; chunks are sent and appended to the raw store with a 308 reply saying how many bytes arrived; after a dropped connection (the bytes arrived but the reply was lost) the app asks how much was received and resumes from byte 16 MB; the last chunk seals the file, status becomes uploaded and a video.uploaded event goes to the job queue](/img/system-design/youtube/02-upload.png)](/img/system-design/youtube/02-upload.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The session is created first**, with the total size and the metadata. The video gets its `video_id` and a
  row with status `uploading` straight away, so the creator can fill in the title while the bytes flow.
- **Chunks are large** (a few MB to tens of MB, a multiple of 256 KB in Google's protocol). Too small and the
  per-request overhead dominates; too large and a failure wastes more work.
- **After a failure, the client asks; it does not guess.** The server answers with the byte range it has
  safely stored, and the client sends from the next byte. At most one chunk is re-sent.
- **Sessions live for days**, not seconds, so a creator can close the laptop and continue tomorrow. Abandoned
  sessions are expired and their partial files deleted by a background job.
- **Integrity:** each chunk can carry a checksum, and the final file is checked against the size declared at the
  start. A file that does not match is rejected before any expensive processing.
- **Parallel chunks** are possible for very large files (several chunks in flight, assembled at the end, like S3
  multipart upload), at the cost of more bookkeeping.

Only when the last byte is safely stored (replicated) does the service mark the video `uploaded` and publish a
`video.uploaded` event. Processing starts from that event, never from a half-written file.

## 7. Deep dive: the processing pipeline

This is the heart of a user-uploaded video platform. The input is whatever a phone, camera or screen recorder
produced; the output must play smoothly on a 4K television and a budget phone on 3G.

[![Processing pipeline: the raw upload is validated; valid files go to the splitter, which cuts roughly 10-second pieces for the encoder pool to encode into every rendition in parallel; encoded pieces are stitched and packaged as HLS and DASH and written as segments and a manifest to the video store; in parallel, thumbnails are picked from sampled frames and Content ID and policy checks fingerprint and classify the audio and video; thumbnail keys, ready renditions and the verdict and claims are written to the metadata DB](/img/system-design/youtube/03-pipeline.png)](/img/system-design/youtube/03-pipeline.png)

*Select the diagram to zoom in and move around.*

### Step 1: validate

Read the container with a probe tool (like `ffprobe`): duration, codecs, resolution, frame rate, audio
channels. Then try to decode a sample. Reject or flag files that are corrupt, not video at all, or absurd
(a 30-hour file of one still frame is legal; a file that crashes the decoder is not). This is also where
**malware scanning** belongs: we are about to feed untrusted files into complex decoders, so workers run in a
sandbox with no network access and strict CPU and memory limits.

### Step 2: split, then encode in parallel

Encoding a two-hour video on one machine could take many hours. Instead:

1. **Split** the video into pieces of around 10 seconds, cut at **keyframes** (frames that can be decoded on
   their own, without the frames before them), so each piece can be encoded independently.
2. **Fan out**: each (piece, rendition) pair becomes a small task. A 2-hour video is 720 pieces; with 16
   renditions that is 11,520 tasks, spread across thousands of machines.
3. **Stitch** the encoded pieces of each rendition back together in order.

The result: a long video is processed in minutes instead of hours, and a failed task is simply retried, not the
whole video. The same idea, **split a big job into independent pieces, fan out, gather**, is
[MapReduce](https://en.wikipedia.org/wiki/MapReduce) applied to video.

The **orchestrator** tracks the tasks for each video as a small graph (a DAG: split must finish before encoding,
all pieces before stitching), retries failures, and records progress so a worker crash loses only its current
task.

### Step 3: the bitrate ladder and priorities

A typical ladder (illustrative values for one codec):

| Rendition | Bitrate | Who needs it |
| --- | --- | --- |
| 144p | 0.1 Mbps | Very poor mobile networks |
| 360p | 0.7 Mbps | Mobile on 3G, start-up |
| 480p | 1.2 Mbps | Mobile default |
| 720p | 2.5 Mbps | Laptops, good mobile |
| 1080p | 5 Mbps | TVs, desktops |
| 2160p (4K) | 15–20 Mbps | Large TVs on fast connections |

Not every rendition is equally urgent. The pipeline encodes **low resolutions in a fast codec first** so the
video can be published within minutes, then adds HD, 4K and more efficient codecs (VP9, AV1) afterwards. This is
why a freshly uploaded YouTube video is sometimes available only in low resolution for a while.

**Spend encoding effort where the views are.** A newer codec saves bandwidth on every view but costs several
times more to encode. For a video watched 10 times, that is a bad trade; for one watched 10 million times, it
pays back enormously. So a sensible policy is: everyone gets the cheap ladder; videos that become popular are
**re-encoded** in the expensive, efficient codecs later. The original upload is kept for exactly this reason.

### Step 4: package

Each rendition is cut into **segments** of a few seconds and a **manifest** (HLS `.m3u8` and/or DASH `.mpd`) is
written that lists them. Audio usually becomes separate renditions too, so the player can mix any video
quality with any audio track (and different languages). Segment files are immutable and get unique names, so
they can be cached forever.

### Step 5: thumbnails, Content ID and moderation (in parallel)

These run alongside encoding, not after it:

- **Thumbnails:** sample frames, discard blurry or black ones, offer a few candidates; creators may upload their
  own. Stored as small images in object storage and served by the CDN.
- **Content ID:** YouTube's public copyright system. Rights holders give reference files; uploads are compared
  against them using **fingerprints**, compact summaries of the audio and video that survive re-encoding,
  cropping and pitch changes. A match triggers the rights holder's chosen policy: **block** the video,
  **monetise** it (ads revenue goes to the owner), or **track** its viewing statistics. At a high level, a
  fingerprint is like a hash that is tolerant of small changes, looked up in a huge index of reference
  fingerprints.
- **Moderation:** ML classifiers flag likely policy violations (violence, adult content, spam) from frames,
  audio, title and description; flagged videos go to human reviewers. User reports feed the same queue later.

### The life of a video

[![Video states: Uploading to Processing when the last byte arrives, Processing to Ready when the low resolution and checks are done, Ready to Published when the creator publishes; Uploading can become Abandoned, Processing can become Failed or Blocked, and Published can become Removed](/img/system-design/youtube/04-video-states.png)](/img/system-design/youtube/04-video-states.png)

*Select the diagram to zoom in and move around.*

The `status` column in the metadata DB follows this machine. A video set to "public" at upload moves from
Ready to Published automatically; a scheduled one waits for its time. Every transition is a conditional update
(`UPDATE ... SET status = 'ready' WHERE video_id = ? AND status = 'processing'`), so two workers racing cannot
move it backwards.

## 8. Low-level design: the data model

[![Data model: users own channels and hold subscriptions to channels; a channel uploads many videos; each video has many renditions, one video_stats row, many comments and many reactions](/img/system-design/youtube/05-data-model.png)](/img/system-design/youtube/05-data-model.png)

*Select the diagram to zoom in and move around.*

Design decisions hiding in this diagram:

**1. Video metadata is sharded by `video_id`.** Most reads are "give me video X" (the watch page) and arrive
from everywhere, so hashing `video_id` spreads them evenly. YouTube itself famously scaled MySQL this way and
built [Vitess](https://vitess.io/), an open-source sharding layer for MySQL, to do it.

**2. A channel's videos need a second index.** "Latest uploads from channel C" would hit every shard if videos
are sharded by `video_id`. So we keep an index table `(channel_id, published_at DESC, video_id)` sharded by
`channel_id`. This is the usual pattern: **one copy per access path**.

**3. Renditions are rows, segments are not.** A row per (video, codec, height) records what exists and where
its manifest is. The thousands of segment files are listed in the manifest itself, not in the database.

**4. Counters live apart from the video row.** `video_stats` changes on every view and like, while `videos`
rarely changes. Keeping them apart stops a hot counter from fighting with metadata edits for the same row
(section 11 explains how the counts are produced).

**5. Comments are sharded by `video_id`**, sorted by time with a cursor, with replies pointing at their parent
(`parent_id`). "Top comments" uses a score updated asynchronously from likes and replies.

**6. Subscriptions are stored twice:** by `user_id` ("my subscriptions", for the subscriptions feed) and by
`channel_id` ("who to notify about a new upload"). Each copy is sharded by its own key.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Videos, channels, subscriptions | Billions of rows, point lookups and small ranges | Sharded MySQL (Vitess) or a distributed SQL / wide-column store | Simple transactions per row, horizontal scale |
| Comments, reactions | Huge, append-heavy, read by `video_id` | Wide-column store (Bigtable, Cassandra) | Write throughput, sorted range scans |
| Originals, segments, thumbnails | Immutable files, KB to GB, exabytes | Object storage | Cheapest per byte, durable, CDN-friendly |
| Hot metadata, counters | Small, read constantly | Memcached / Redis | The watch page must be fast |
| Events (uploads, pings, likes) | Ordered streams | Kafka / Pub/Sub | Fan-out to many consumers, replay |
| Search index | Inverted index | Elasticsearch-style or custom | Full-text search over titles and more |

### Storage tiers

Most videos are watched mostly in their first days, then rarely. So files move between **hot** (replicated,
fast disks), **warm** and **cold** storage (erasure-coded on cheaper disks: data split into pieces plus parity
pieces, so any few lost pieces can be rebuilt, at much less overhead than three full copies). Renditions of a
video nobody has watched for years could even be **deleted** and rebuilt from the original if anyone ever asks:
trading a slow first play for a large storage saving.

## 9. Flow 2: watching a video

Bob opens a video. Here is what his player does.

[![Playback sequence: the player gets the watch page with a signed manifest URL from the watch service, fetches the manifest from the CDN edge, starts with a 360p segment, measures about 8 Mbps and asks for a 1080p segment, which misses at the edge and the regional cache and is fetched from the video store, with each cache keeping a copy; when bandwidth falls it steps down to 480p; it reports a watch-time ping every few seconds](/img/system-design/youtube/06-playback.png)](/img/system-design/youtube/06-playback.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The watch service never touches video bytes.** It returns metadata and a **signed URL** (a URL with an
  expiry time and a signature, so the CDN can check it without calling us). Private and unlisted videos stay
  protected without slowing down the CDN.
- **Start low, then climb.** The first segment is fetched at a modest quality so the first frame appears
  quickly. As the buffer fills and throughput is measured, the player climbs the ladder.
- **ABR runs in the player.** Before each segment, it picks a rendition from two signals: recent download
  speed and how many seconds are already buffered. A full buffer allows a higher quality; a draining buffer
  forces a step down before the video stalls. The server only has to serve files.
- **Seeking** is cheap: the manifest says which segment holds minute 37, and the player fetches just that one.
- **Every cache that misses can keep a copy**, so the next viewer in that region gets a hit (the edge
  is choosier about what it keeps; see admission in section 10).

## 10. Deep dive: the CDN and the long tail

Video popularity follows a **power law**: a small fraction of videos gets most of the views, and a huge number
of videos get only a handful each. This "long tail" is the defining delivery problem of a user-upload
platform.

- **Hot videos** (a new music video, a trending clip): requested millions of times. They must be at the edge,
  in every region, or the origin would melt.
- **Warm videos**: watched steadily but not everywhere. Keeping them in **regional** caches is enough.
- **Cold videos** (most of the catalogue): watched a few times a year. Caching them at the edge would push out
  hot content for no benefit. They are served from the origin, a little more slowly, and that is fine.

[![Serving a segment: a request goes to the edge lookup; a hit (most traffic) is served directly; on a miss it goes to the regional lookup and, on another miss, to the video store; the returned segment passes an admit-to-edge check, which keeps it or passes it through to the viewer; a pre-warm job copies predicted hot videos to the edge early](/img/system-design/youtube/07-cache-tiers.png)](/img/system-design/youtube/07-cache-tiers.png)

*Select the diagram to zoom in and move around.*

The techniques that make this work:

**1. Tiered caches.** Edges are small and many (in cities and inside internet providers' networks; Google's
programme for this is called Google Global Cache). Regional caches are larger and fewer. The origin holds
everything. Each tier absorbs most of the misses of the tier below, so the origin sees only a trickle.

**2. Admission, not just eviction.** A plain LRU cache (least recently used) stores everything it serves, so a
single view of a cold video can push out a popular segment. A better edge policy **admits** an object only if it
has been requested before recently (for example, the second request within an hour). One-off requests pass
straight through without polluting the cache.

**3. Cache popular parts, not whole videos.** Most viewers watch the beginning and many leave early. Caching by
segment means the first minutes of a video can be hot at the edge while its later minutes are not.

**4. Low renditions are the cheapest win.** Mobile renditions are small, so caching 360p and 480p for warm
videos at the edge costs little and covers many viewers.

**5. Pre-warming.** Some popularity is predictable: a channel with 50 million subscribers publishing a new video,
or a scheduled premiere. A background job can copy the first segments to edges **before** the rush.

**6. Request collapsing.** When a video goes viral, thousands of viewers may miss the same segment at the same
edge within a second. The edge sends **one** request upstream and makes the others wait for it, so a cold cache
does not become a stampede on the origin.

**7. Consistent hashing inside a site.** An edge site has many servers. Hashing the segment URL to choose the
server (consistent hashing, so adding a server moves few keys) means each segment is stored once per site, not
once per server, which multiplies the effective cache size.

## 11. Deep dive: counting views at scale

A view count looks like `UPDATE video_stats SET view_count = view_count + 1`. At millions of events a second,
with a viral video getting tens of thousands of views a second on a single row, that would never work. And not
every play should count: a bot farm refreshing a page a million times must not buy a video onto the trending
list.

[![View counting: players send watch-time pings to an ingest and event log keyed by video_id; a stream counter adds per-minute sums to the live count cache shown on the watch page; stored events also go to a fraud and de-dup batch job, which writes only valid views to the verified counts store, the source of truth, which corrects drift in the live cache and feeds exact numbers to creator analytics](/img/system-design/youtube/08-view-counting.png)](/img/system-design/youtube/08-view-counting.png)

*Select the diagram to zoom in and move around.*

**Path 1: fast and approximate.** Pings go into a partitioned log keyed by `video_id`. A stream processor keeps
in-memory counts per video and, every few seconds, adds the totals to a cache in **one** write per video
(`+3,412`), instead of one write per view. This is the number on the watch page. It is quick and roughly
right.

**Path 2: slow and exact.** The same events are stored and processed in batches, with more context:

- **What counts as a view?** For example, playback past a minimum watch time, not just a page load.
- **De-duplication:** many plays from the same viewer (or the same device or IP) in a short window count once
  or a limited number of times.
- **Fraud signals:** bursts from data-centre IP ranges, devices with no other history, identical watch
  patterns. Suspicious views are discarded.

The verified count is the **source of truth**. It overwrites the live estimate periodically, so if the fast
path over-counted bots, the displayed number is corrected (and can even go down). YouTube's view counts used
to famously pause at around 301 views on new videos while views were verified; the current system updates more
smoothly, but the idea of a fast estimate later reconciled with a verified count is the same.

**Hot-key fix for viral videos.** One video can receive far more events than one stream partition can handle.
Spread its events over several sub-keys (`video_id#0` to `video_id#15`), count each separately, and add the 16
totals when reading. This is the general **sharded counter** pattern.

**Unique viewers** (for creator analytics) are a set-cardinality problem. Counting exactly needs memory per
viewer; a **HyperLogLog** sketch estimates the number of distinct viewers within about 1–2% using a few KB per
video, and sketches for different days can be merged.

## 12. Likes, comments and subscriptions

These are classic social features. The YouTube-specific twist is scale skew: one video can have millions of
comments while most have none.

- **Likes** are stored as one row per `(video_id, user_id)` with the current rating, which makes the `PUT`
  idempotent and lets a user change their mind. The **count** is maintained like view counts: events into a
  stream, batched increments into `video_stats`. The user's own like is read from their row, so they always see
  their own action immediately (read-your-writes) even if the total lags by seconds.
- **Comments** are written to the comments store and appear for the author at once; other viewers see them
  within seconds. Spam and abuse classifiers run asynchronously and can hide a comment after the fact. The
  "Top comments" order is a precomputed score, refreshed in the background, so listing is a simple read.
- **Subscriptions** drive two things: the subscriptions feed (pull: at read time, fetch the latest videos of the
  channels you follow from the per-channel index and merge them) and **notifications** for new uploads (push:
  when a video is published, fan out to subscribers who asked for alerts, through a queue, in batches). A
  channel with tens of millions of subscribers makes that fan-out a long batch job, so notifications trickle
  out over minutes, which is acceptable.

## 13. Home page, recommendations and search

### Recommendations (high level)

YouTube has publicly described its recommender as a **two-stage** system, which is the standard approach at this
scale:

1. **Candidate generation:** from billions of videos, quickly pick a few hundred that might suit this user,
   using their watch history, subscriptions and similar users (for example, nearest neighbours of a user
   embedding among video embeddings).
2. **Ranking:** a heavier model scores those few hundred on many features (freshness, the user's predicted watch
   time, satisfaction signals) and orders the home page.

The system-design parts to mention: **watch history** flows in from the view-counting events, candidates and
embeddings are precomputed in batch and refreshed often, ranking runs online per request with a strict latency
budget, and the home page is cached briefly per user. A cold-start user (no history) gets popular and regional
content until signals arrive.

### Search

An **inverted index** (word → list of videos) over titles, descriptions, tags, channel names and automatic
captions. Indexing is asynchronous from the `video.published` event, so a new video becomes searchable a little
after publishing. Results are ranked by text relevance combined with popularity, freshness and quality signals.
The index is **sharded by document** (each shard indexes a slice of the videos); a query goes to all shards in
parallel and the top results are merged. Popular queries are cached.

## 14. Extension: live streaming

Live video uses the same building blocks with one constraint changed: there is no finished file, and latency
matters.

[![Live streaming: the streamer's encoder sends one stream over RTMP(S) or SRT to an ingest server; a live transcoder builds the ladder in real time; a packager writes 2 to 6 second segments that the CDN serves as the playlist refreshes; a copy is recorded and, after the stream ends, goes through the normal pipeline to become an on-demand video](/img/system-design/youtube/09-live.png)](/img/system-design/youtube/09-live.png)

*Select the diagram to zoom in and move around.*

- **Ingest** accepts a single high-quality stream from the broadcaster's encoder (OBS, a phone app), commonly
  over RTMP or RTMPS.
- **Transcoding must keep up with real time**, so there is no time to split a whole file. Each stream gets
  dedicated encoder capacity, and the ladder is often smaller than for uploads.
- **Segments are short** (a few seconds) and the manifest is updated continuously; players re-fetch it to learn
  about new segments. Latency from camera to viewer is a few seconds to tens of seconds; low-latency modes trade
  some smoothness for less delay.
- **The CDN works well** because everyone watches the same few segments at the same moment: the ideal cache
  workload, as long as request collapsing protects the origin from the first wave.
- **After the stream**, the recording goes through the normal pipeline to become an on-demand video.
- **Live chat** is a separate real-time messaging system (WebSockets, fan-out per stream), sampled or throttled
  for streams with huge audiences.

## 15. Reliability: what can fail and what we do

| Risk | Defence |
| --- | --- |
| Upload connection drops | Resumable sessions; the server reports the stored byte range; at most one chunk is re-sent |
| Processing worker crashes mid-encode | Tasks are small and idempotent (same input piece, same output key); the orchestrator retries just that task |
| A poison file crashes decoders repeatedly | Retry a few times, then mark the video `failed` and move the job to a dead-letter queue for inspection |
| Processing backlog after a spike | The queue absorbs it; priority lanes keep "first playable rendition" ahead of 4K and AV1 re-encodes |
| Origin region fails | Video files replicated across regions; the CDN fails over to another origin |
| CDN edge fails | DNS or anycast steers viewers to the next nearest edge; players retry a failed segment on another URL |
| Metadata shard down | Replicas take over; the watch page can still be served from cache for popular videos |
| Count pipeline lags | The displayed count is stale for a while; the verified batch path catches up from the stored log |

The patterns to remember: **durably store, then acknowledge** (uploads, events); **at-least-once processing with
idempotent outputs** (encoding tasks, counters with event IDs); and **degrade gracefully** (play in low
resolution, show a slightly stale count) rather than fail.

## 16. What breaks as it grows, and how to fix it

**The viral video.** A video goes from zero to millions of viewers in an hour. *Fix:* request collapsing at the
edge, tiered caches, pre-warming for predictable launches, and sharded counters for its view and like counts.

**The giant upload.** A 12-hour 4K recording. *Fix:* chunked resumable upload, split-and-fan-out encoding so wall
time stays in minutes, and priorities so it does not starve everyone else's short clips.

**The encoding bill.** Every upload is encoded whether or not anyone watches it. *Fix:* a cheap ladder for
everyone, expensive codecs only for videos that prove popular, and specialised hardware for encoding.

**The storage bill.** Exabytes per year. *Fix:* erasure coding for cold data, tiered storage, deleting rarely
used renditions and rebuilding them from the original on demand.

**The long tail at the edge.** Cold requests evict hot content. *Fix:* admission policies (cache on second
request), per-segment caching, and serving cold videos from regional caches or the origin.

**Fake views and spam.** Bots inflate counts; spam floods comments. *Fix:* verified counting with
de-duplication and fraud models, rate limits per account and IP, and asynchronous classifiers that can hide
content after the fact.

**The celebrity notification storm.** A channel with tens of millions of subscribers publishes. *Fix:* queue
the fan-out in batches, deliver over minutes, and let the subscriptions feed pull rather than push.

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Upload transport | One HTTP request | Resumable chunked session | **Resumable**: large files on mobile networks fail often; resume costs one chunk |
| Encode order | Full ladder before publishing | Low resolution first, the rest later | **Low first**: creators publish in minutes |
| Encoding unit | Whole file per worker | Split into pieces, fan out | **Split**: minutes instead of hours, cheap retries |
| Codec spend | Best codec for everything | Cheap for all, expensive for popular | **By popularity**: encoding cost follows the views |
| Edge caching | Cache everything served (LRU) | Admit on repeated demand | **Admission**: protects hot content from the long tail |
| Quality selection | Server decides | Player decides (ABR) | **Player**: it knows its own bandwidth and buffer; servers stay simple caches |
| View counts | Exact, synchronous | Approximate now, exact later | **Both**: fast estimate on screen, verified count as truth |
| Metadata sharding | By channel | By `video_id` | **By `video_id`**, plus a per-channel index for "latest uploads" |

## Cheat sheet for last-minute revision

- **Bytes and metadata take different roads:** uploads go to the upload service and object storage; playback
  goes to the CDN; API servers handle only small JSON.
- **Resumable upload:** create a session, send large chunks, after a failure ask the server how much it has and
  resume from there. Acknowledge only after the bytes are durably stored.
- **Pipeline:** validate (sandboxed) → split at keyframes → encode every (piece, rendition) in parallel →
  stitch → package HLS/DASH segments and manifests. Thumbnails, Content ID and moderation run alongside.
- **Publish fast:** low resolutions first; HD, 4K and efficient codecs (VP9, AV1) later; re-encode popular
  videos with expensive codecs. Keep the original.
- **Video states:** uploading → processing → ready → published, with abandoned, failed, blocked and removed exits.
- **Playback:** the watch service returns metadata and a signed manifest URL; the player runs ABR, starts low and
  climbs; segments are immutable and cache forever.
- **Long tail:** tiered caches (edge, regional, origin), cache admission on repeated demand, per-segment
  caching, pre-warming, request collapsing.
- **Views:** stream counter for a fast approximate number; batch de-dup and fraud filtering for the verified
  count; sharded counters for viral videos; HyperLogLog for unique viewers.
- **Data:** metadata sharded by `video_id` (Vitess-style MySQL), extra index by channel, comments in a
  wide-column store, files in object storage.
- **Numbers:** 500 hours uploaded a minute ≈ 50 uploads/s and ~300 Gbps in; 1B hours watched a day ≈ 100 Tbps
  out and ~42M concurrent viewers; ~10 PB of new files a day; egress ≈ 300× ingress.

## Practice questions

1. **A creator says their video has been "processing" for two hours. How would you investigate?** Look up the
   `video_id` in the orchestrator: which tasks are pending or failing? Common causes: a piece that keeps
   crashing the encoder (dead-letter it and surface an error), a backlog in a priority lane, or a stuck
   Content ID or moderation check. The status machine and per-task records make this a lookup, not a hunt.
2. **How would you let creators replace a video file without changing its URL?** Upload the new file as a new
   internal version, process it fully, then switch the `video` row to the new version's renditions in one update.
   Segment names include the version, so caches never mix old and new segments.
3. **How would you support "Premieres" (a scheduled first showing watched together)?** Process the video in
   advance, pre-warm the first segments at the edges in regions with many subscribers, and at the scheduled time
   flip the status to published; the player treats it like a live stream with a shared start time.
4. **Why not let the CDN count views from its access logs?** Logs see segment requests, not viewers: one view
   is hundreds of requests, cached replays may never reach the logs you read, and logs carry no notion of a
   signed-in user for de-duplication. Logs are useful for bandwidth and quality metrics; views need player
   events.
5. **How would you cut the bandwidth bill by 20%?** Encode popular videos with more efficient codecs (AV1, VP9),
   tune the ladder per video (a static slide deck needs far fewer bits than a sports match), cap default
   quality on small mobile screens, and push more traffic into caches inside internet providers' networks.
