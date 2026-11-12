---
title: "Design Netflix (video on demand streaming)"
description: "Design a Netflix-style streaming service: a cloud control plane, ISP-embedded CDN appliances, per-title encoding, ABR, DRM and overnight pre-positioning."
difficulty: "Medium"
sidebar:
  label: "Netflix (video streaming)"
tags: ["Video", "CDN", "Encoding", "Caching", "Resilience"]
---

You open the app on your TV, pick a show, and within a couple of seconds a sharp picture fills the screen.
Hundreds of millions of people do the same thing, most of them in the same few evening hours. Behind that
simple experience sit two very different systems. One is a **brain**: services in the cloud that know who you
are, what you may watch, and where the video should come from. The other is a **delivery fleet**: thousands of
storage servers placed inside internet providers' own networks, a few hops from your living room, pushing out
the actual video bytes.

This case study builds that system from the ground up. Netflix is a useful model because a lot of its design is
public (its own CDN, Open Connect, its encoding research and its resilience practices are all described on its
engineering blog), so we can ground the design in real ideas without guessing at private details.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Video streaming in 5 minutes

Before designing anything, we need the vocabulary.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Video on demand (VOD)** | Pre-recorded video the viewer starts whenever they like (not live TV) | A library, not a radio station |
| **Codec** | The method used to compress video: H.264 (AVC), HEVC, VP9, AV1. Newer codecs give the same quality in fewer bits but need more computing to encode and newer hardware to decode | Different ways to pack a suitcase |
| **Rendition** | One encoded version of a title at a given resolution, bitrate and codec, for example "1080p, 5 Mbit/s, AVC" | One size of the same shirt |
| **Bitrate ladder** | The set of renditions made for a title, from tiny (for a weak phone signal) to 4K | All the sizes on the rack |
| **Segment** | A few seconds of one rendition, stored or addressed so the player can fetch it on its own | One page of a book you can borrow separately |
| **Manifest** | A small file listing every rendition and how to fetch its segments. **DASH** and **HLS** are the two common industry formats | The table of contents |
| **Adaptive bitrate (ABR)** | The player picks the rendition for each next segment based on its network speed and buffer | A driver changing gear on hills |
| **CDN** | Content delivery network: servers close to users that hold copies of popular content | Local warehouses instead of one central factory |
| **DRM** | Digital rights management: video is encrypted, and only an approved player with a valid **licence** can get the keys | A locked box with a key only cinemas get |

**How is this different from YouTube?** YouTube accepts hundreds of hours of uploads every minute from anyone,
and most of those videos are watched rarely. Netflix has **no user uploads**. Its catalogue is **curated**:
tens of thousands of titles, each one licensed or produced, each one arriving weeks before release. That
changes almost every decision:

1. **Encoding can be slow and thorough.** We have days, not seconds, so we can spend a lot of computing per
   title to squeeze out every bit.
2. **Demand is predictable.** We know a new season launches on Friday, and we know what each region watched
   last night. So we can **copy the right files to the edge before anyone asks**, instead of waiting for a
   cache miss.
3. **The catalogue is small enough to plan.** It is large in bytes, but small in item count, so it is
   realistic to decide, per server, exactly which files it should hold.

## 2. Requirements

### Functional (what users can do)

- **Browse** a personalised home page: rows of titles ("Continue watching", "Trending now", "Because you
  watched…"), each with artwork.
- **Search** the catalogue and see title details (synopsis, episodes, cast, maturity rating).
- **Play** a film or episode on TVs, phones, tablets, game consoles and browsers, with audio and subtitles in
  many languages.
- **Pause and resume** anywhere: stop on the TV, continue on the phone at the same second ("continue
  watching").
- **Profiles**: several people share one account, each with their own history, recommendations and maturity
  settings.
- **Plan limits**: the number of simultaneous streams and the best available quality depend on the plan.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Playback start time** | Picture within about 2 seconds of pressing play | Every extra second of waiting makes people give up |
| **Rebuffering** | As close to zero as possible; quality may drop, but the picture should not freeze | A frozen picture is the most hated failure |
| **Video quality** | The best quality the network and device can sustain | People pay for HD and 4K |
| **Availability** | Browsing and play start at 99.99%; streams already playing keep playing even if parts of the cloud fail | Evenings are when everyone watches |
| **Scale** | 300+ million paid memberships (Netflix's last reported figure, for the end of 2024), tens of millions of concurrent streams at peak | Global evening peaks |
| **Cost** | Bandwidth cost per hour watched as low as possible | Video bytes are by far the biggest bill |
| **Security** | Content encrypted end to end; licences tied to device and plan | Studios require it before licensing content |

### Out of scope

Live events, games, the studio's own production tools, payments and billing, ads, and offline downloads (we
touch on downloads briefly under DRM). Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resources dominate**. Every number below is an
assumption for practice, not a Netflix figure.

**Assumptions:** 300 million accounts. At the global evening peak, **40 million** streams play at once.
The average stream, mixing phones, HD and 4K, runs at **5 Mbit/s**. A viewing session lasts about **1 hour**.
The player sends a progress heartbeat about **once a minute**.

**Peak bandwidth (the number that matters most)**

- $40\text{M streams} \times 5\text{ Mbit/s} = 200\text{M Mbit/s} = 200\text{ Tbit/s}$.
- For one country with 10 million members where 20% watch at 9 pm:
  $2\text{M} \times 5\text{ Mbit/s} = 10\text{ Tbit/s}$.
- If one edge server can push roughly 100 Gbit/s (well within public reports of modern streaming servers),
  that one country needs about $10\text{ Tbit/s} \div 100\text{ Gbit/s} = 100$ servers busy at once, plus
  spares, spread over many ISPs and cities.

No single data centre can push 200 Tbit/s out to the internet, and buying that much transit bandwidth would be
ruinous. **This one number is why the video must be served from inside or right next to ISPs' networks.**

**Control-plane traffic (small by comparison)**

- Play starts: each stream starts about once an hour, so $40\text{M} \div 3{,}600 \approx 11{,}000$ per second
  at peak, plus retries and episode changes.
- Heartbeats: $40\text{M} \div 60 \approx 670{,}000$ writes per second. This is the busiest write path in the
  cloud, and it shapes the viewing-history store (section 11).
- Home page loads: perhaps a few times per session, so tens of thousands per second, mostly served from
  precomputed results and caches.

**Storage**

- One rendition ladder for one codec: suppose 10 rungs whose bitrates add up to about 35 Mbit/s. One hour is
  $35\text{ Mbit/s} \times 3{,}600\text{ s} = 126{,}000\text{ Mbit} \approx 16\text{ GB}$.
- With about four codec families: roughly **60 GB per hour of content**, plus audio and subtitle tracks.
- A catalogue of **50,000 hours**: $50{,}000 \times 60\text{ GB} = 3\text{ PB}$ of encoded files.
- Studio masters are far larger (assume 200 GB an hour): $50{,}000 \times 200\text{ GB} = 10\text{ PB}$, kept
  in cloud storage and read only when re-encoding.

Three conclusions follow:

1. **Bandwidth, not storage, is the hard problem.** 3 PB fits comfortably in object storage; 200 Tbit/s does
   not fit through any single pipe.
2. **The whole popular catalogue fits on an edge server.** An appliance with about 200 TB of disk can hold
   $200\text{ TB} \div 16\text{ GB} \approx 12{,}500$ title-hours in one codec, which covers what most
   people watch on any given night.
3. **The cloud handles small, frequent requests.** Thousands of play starts and hundreds of thousands of
   heartbeats per second are ordinary distributed-systems work, very different from moving video.

## 4. The API

Devices talk to the cloud over HTTPS with a JSON (or similar) API through an **API gateway**. Video bytes never
go through this API; the device fetches them directly from edge servers using the URLs the API hands out.

| Method and path | What it does |
| --- | --- |
| `GET /v1/home?profile=p7` | The personalised home page: an ordered list of rows, each with an ordered list of titles and the artwork chosen for this profile. |
| `GET /v1/titles/{title_id}` | Details: synopsis, seasons, episodes, cast, maturity rating, this profile's progress. |
| `GET /v1/search?q=...` | Search the catalogue available in the member's country. |
| `POST /v1/playback/start` | Body: `title_id`, `profile_id`, device capabilities (codecs, HDR, resolution, DRM system). Returns the manifest, ranked edge URLs and the resume position. |
| `POST /v1/licence` | Body: the DRM system's licence challenge. Returns a licence holding the content keys for this device. |
| `POST /v1/playback/heartbeat` | Body: `title_id`, position, current rendition, buffer health. Saves progress and feeds quality monitoring. |
| `POST /v1/playback/stop` | Final position; frees a slot in the plan's stream limit. |

Why does the device send its **capabilities**? A 2015 smart TV may only decode AVC at 1080p, while a new phone
decodes AV1. The playback service sends back only renditions this device can play and this plan allows, so the
player never wastes a request on a file it cannot use.

## 5. High-level design

[![High-level architecture: devices call the API gateway in the cloud control plane, which routes to the playback API, steering, licence servers, home page service and viewing history; video chunks come straight from an Open Connect appliance inside the ISP, which is filled overnight from an exchange-point appliance and the encoded file store; studios send masters to the encoding pipeline](/img/system-design/netflix/01-architecture.png)](/img/system-design/netflix/01-architecture.png)

*Select the diagram to zoom in and move around.*

The single most important idea is the split into two planes:

- **Control plane** (the cloud): every request that is about *deciding*. Who are you, which titles may you
  see, which renditions suit your device, which edge server should serve you, what should your home page show,
  where did you stop last night. Netflix publicly moved this part fully onto AWS by 2016 and runs it in several
  regions.
- **Data plane** (the edge): the bytes of video. Netflix built its own CDN, **Open Connect**. Its servers, called
  **Open Connect Appliances (OCAs)**, are either installed **inside an internet provider's network** (Netflix
  offers them to qualifying ISPs free of charge) or placed at **internet exchange points (IXPs)**, the
  buildings where many networks meet and swap traffic.

Why split them? They have opposite needs. The control plane handles small, varied requests that need fresh
data and complex logic, so it benefits from the cloud's elastic computing. The data plane moves enormous
volumes of identical, unchanging bytes, so it benefits from being physically close to viewers and from simple,
highly tuned machines (OCAs run FreeBSD and NGINX, tuned to stream from disk to network at very high rates).

What each piece does, in one line:

- **API gateway:** authenticates the device and member, applies rate limits, routes to the right service
  (Netflix's open-source gateway is called Zuul).
- **Playback API:** checks entitlement (plan, country rights, maturity), picks renditions, builds the
  manifest, and asks steering for edge URLs.
- **Steering service:** knows the health, load and contents of every OCA, and ranks the best ones for this
  client.
- **Licence servers:** hand out DRM licences so the device can decrypt.
- **Home page service:** assembles the rows and artwork from precomputed recommendations.
- **Viewing history:** stores heartbeats, bookmarks and the "Continue watching" list.
- **Encoding pipeline + encoded file store:** turn studio masters into hundreds of files, kept in object
  storage (S3), the origin for all edge fills.
- **OCAs:** hold copies of the files and serve them over HTTPS.

## 6. Flow 1: getting a title ready (ingest and encoding)

A new film arrives from a studio as a **master** (sometimes called a mezzanine file): a very high quality,
lightly compressed file, often hundreds of gigabytes. We cannot stream that. We must turn it into a ladder of
renditions in several codecs, plus audio tracks and subtitles in many languages.

[![Encoding pipeline: the studio master is split at shot boundaries into chunks; sample shots decide the ladder per title and per shot; encoder workers encode chunks in parallel in AVC, HEVC, VP9 and AV1; chunks are stitched and quality checked with VMAF; streams are packaged into segments, encrypted with per-tier keys from the key store, and written to the encoded file store](/img/system-design/netflix/02-encoding.png)](/img/system-design/netflix/02-encoding.png)

*Select the diagram to zoom in and move around.*

### Why chunked, parallel encoding

Encoding a two-hour film in one go on one machine with a modern codec can take many hours or days. Instead we
**split the master into chunks** of a few seconds to a minute, encode thousands of chunks at once on a large
fleet of workers, then **stitch** the results back together. Two benefits:

- **Speed.** Wall-clock time drops from days to hours, because the work is spread out.
- **Resilience.** A failed worker costs one chunk, which is simply retried, not the whole film.

Netflix splits at **shot boundaries** (the cuts between camera shots), because a shot is visually consistent:
the same scene, lighting and motion. That makes each chunk a natural unit for choosing encoder settings.

### Per-title and per-shot encoding

The old approach was one fixed bitrate ladder for everything: 1080p always at, say, 5 Mbit/s. But a simple
cartoon with flat colours looks perfect at 1.5 Mbit/s, while a grainy, fast-moving action film needs much more.
A fixed ladder wastes bits on the cartoon and starves the action film.

Netflix described **per-title encoding** in 2015: run trial encodes of each title at many resolutions and
bitrates, measure the quality, and build a ladder for that title. It later went further with **shot-based
encoding** (its "dynamic optimizer"): choose settings **per shot**, spending bits where the eye will notice and
saving them on static scenes. Quality is measured with **VMAF**, a perceptual quality score that Netflix
developed and open-sourced, which predicts how good a human would rate the picture.

The payoff is large: fewer bits for the same quality means less bandwidth, less rebuffering on slow networks,
and smaller downloads.

### Many codecs, many files

Each title is encoded in several codecs because devices differ: AVC plays almost everywhere, HEVC and VP9 save
bits on newer devices, and **AV1** saves more still on devices that can decode it. Add HDR versions, dozens of
audio tracks (languages, stereo and surround), and subtitles, and **one title can easily become hundreds of
files**. Each finished rendition is cut into segments (or indexed so byte ranges map to segments), **encrypted**
with the title's content keys, and written to the encoded file store. A title typically has several keys,
for example one per resolution tier (SD, HD, 4K) and one for audio, so a licence can unlock the lower tiers
without unlocking 4K (section 12).

Things worth noticing:

- **This pipeline is offline and idempotent.** If any step fails, we rerun it. Nothing a member does waits on
  it.
- **Re-encoding is normal.** When a better codec or optimiser arrives, the back catalogue is re-encoded from the
  masters, which is why we keep them.
- **Quality checks are automated.** Every output is checked for glitches, audio sync and a minimum VMAF score
  before it can be published.

## 7. Flow 2: pressing play

Priya presses play on episode 3 on her TV.

[![Sequence for pressing play: the device asks the playback API, which checks plan, country, maturity and device, asks steering for ranked OCA URLs, and returns a manifest with URLs and the bookmark; the device gets a licence with content keys, fetches the first segments at a low bitrate from the OCA in its ISP, then keeps fetching segments while sending heartbeats to viewing history](/img/system-design/netflix/03-play.png)](/img/system-design/netflix/03-play.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Only steps 1–6 touch the cloud.** After that, the device talks almost only to the OCA. The cloud never sees
  a byte of video.
- **Steps can overlap.** The licence request does not depend on steering, so a player can request it in
  parallel, and some players fetch the licence before the member even presses play (for the title they are
  hovering over). Every saved round trip shortens start time.
- **Start low, then climb.** The first segments are fetched at a modest bitrate so the picture appears fast;
  the ABR logic (section 8) then raises quality within seconds.
- **The resume position comes with the manifest**, so the player starts fetching from 31:20, not from 0:00.
- **The stream limit is checked here.** If the account's plan allows two streams and two are playing, step 1
  is refused with a friendly message.

## 8. Low-level design: adaptive bitrate streaming

Networks change constantly: a microwave turns on near the Wi-Fi router, a sibling starts a download, a train
enters a tunnel. If the player picked one rendition at the start, it would either freeze (too high) or look
blurry all evening (too low). Adaptive bitrate solves this **one segment at a time**.

The player keeps a **buffer**: video already downloaded but not yet shown. A big buffer is a cushion; if the
network stalls, playback continues from the buffer while the player recovers. The buffer level is the player's
most important signal.

[![Adaptive bitrate decision: after each segment arrives the player measures speed; if the buffer is full it pauses downloads, if the buffer is under 10 seconds it drops to a rung below measured speed, if the buffer is over 30 seconds and speed is 1.5 times the next rung it steps up one rung, otherwise it keeps the rendition](/img/system-design/netflix/04-abr.png)](/img/system-design/netflix/04-abr.png)

*Select the diagram to zoom in and move around.*

The thresholds here (10 s, 30 s, 1.5×) are illustrative; real players tune them carefully. The principles:

- **Protect the buffer first.** When the buffer gets low, drop quality immediately. A blurrier picture is far
  better than a spinning wheel.
- **Stop when the buffer is full.** Once a few minutes are buffered, the player pauses downloads until it
  drains a little. Fetching further ahead wastes bytes if the viewer stops or seeks.
- **Climb cautiously.** Only step up when there is both a healthy buffer and clear spare bandwidth, and one rung
  at a time. Jumping up and down every few seconds ("oscillation") is visibly annoying.
- **Use both signals.** Throughput estimates are noisy (one fast segment proves little), while buffer level is
  steady and honest. Modern algorithms lean heavily on the buffer, which is the approach Netflix researchers
  have published on.
- **Respect caps.** Never exceed what the plan, the device's screen, or a data-saver setting allows.
- **Switch only at segment boundaries.** Every rendition is cut at the same timestamps, so segment 412 of the
  720p rendition joins seamlessly to segment 413 of the 1080p one.

**Manifest formats.** DASH (an international standard) and HLS (from Apple) both describe renditions and
segments; a player reads one, then fetches segments with plain HTTP requests. Because segments are ordinary
HTTP objects, any web server or cache can serve them, which is exactly what makes a CDN work for video.

## 9. Low-level design: choosing the best edge server

"Nearest server" sounds simple, but the steering service has to answer a richer question: **which healthy
server, holding this exact file, sits on the cheapest, shortest network path to this client?**

[![Steering workflow: the play request brings the client IP and file ids; steering maps the IP to its network using ISP routes, finds OCAs holding the files that are healthy and not overloaded, and ranks candidates ISP first, then exchange, then other; the device tries the best URL, streams from it if it is fast and healthy, and otherwise moves to the next URL in the list without a new API call](/img/system-design/netflix/05-steering.png)](/img/system-design/netflix/05-steering.png)

*Select the diagram to zoom in and move around.*

How steering knows what it knows:

- **Routes.** OCAs inside an ISP exchange routing information with that ISP (over BGP, the protocol networks
  use to announce which IP addresses they reach). So the control plane learns which client IP ranges each OCA
  is meant to serve.
- **Contents.** Every OCA regularly reports which files it holds.
- **Health and load.** OCAs report their health and how busy they are, so an overloaded or failing appliance
  drops out of the rankings within moments.

Ranking prefers an OCA **inside the member's ISP** (the traffic never leaves the ISP's network, which is fast
for the viewer and cheap for everyone), then one at a nearby **exchange point**, then anything further away.

The device receives **several ranked URLs**, not one. If the first is slow or fails mid-stream, the player
switches to the next on its own, without asking the cloud again. This is a key resilience property: an edge
failure becomes a short quality dip, not an outage.

Contrast this with a classic CDN, which usually picks a server using DNS or anycast and has no idea whether
that server holds the file (it fetches on a miss). Because Netflix's control plane already knows exactly what
each OCA holds, it can route each play to a server that is **guaranteed to have the file**.

## 10. Low-level design: pre-positioning content overnight

Traditional CDN caches are **reactive**: the first viewer misses, the cache fetches from the origin, later
viewers hit. That is fine for a small website, but terrible for video at 9 pm: a miss means a long fetch across
the internet at the very moment the links are busiest.

Because the catalogue is curated and demand is predictable, Open Connect works **proactively**.

[![Pre-positioning pipeline: viewing data and the release calendar feed a popularity forecast per title and region; a fill planner decides what each OCA holds; exchange OCAs receive files from the encoded file store at night and fill nearby ISP OCAs, which serve evening streams to members](/img/system-design/netflix/06-fill.png)](/img/system-design/netflix/06-fill.png)

*Select the diagram to zoom in and move around.*

How it works:

1. **Forecast.** Every day, the control plane predicts how popular each title (and each rendition of it) will
   be in each region tomorrow, from recent viewing and the release calendar. A new season of a hit show is
   expected to be huge on launch day.
2. **Plan.** It turns the forecast into a **fill list** per OCA: the files that server should hold, most
   popular first, up to its disk size. Small ISP appliances get the popular head of the catalogue; large
   exchange appliances hold far more.
3. **Fill off-peak.** During a **fill window** agreed with each ISP, usually the quiet early-morning hours,
   OCAs download new files and delete ones no longer on their list. Embedded OCAs can fill from nearby,
   larger OCAs instead of all reaching back to the origin, so the ISP's links carry each file once rather
   than many times.
4. **Serve at peak.** By evening the files are already there. Almost all evening traffic is served from disk,
   with no misses to the origin.

This turns a scary peak problem into a quiet night-time batch job: we move the bytes when the network is idle,
and serve them when it is busy. If a forecast is wrong and a title suddenly trends, steering simply sends those
viewers to the nearest server that does hold it (often the exchange OCA) until the next fill.

## 11. Low-level design: data model, viewing history and "continue watching"

### What we store

[![Data model: accounts have up to five profiles; profiles have viewing history rows keyed by profile and title with position and duration; titles, including episodes linked to their show, are licensed in rights windows per country and encoded as renditions with codec, resolution, bitrate and file key](/img/system-design/netflix/07-data-model.png)](/img/system-design/netflix/07-data-model.png)

*Select the diagram to zoom in and move around.*

Design decisions hidden in this diagram:

**1. Episodes are titles.** An episode is a title with a `show_id`, `season_no` and `episode_no`. Playback,
history and renditions work the same way for films and episodes.

**2. Rights are per country and per time window.** A show may be available in the UK until March and in Brazil
from June. The playback API checks `rights_windows` for the member's country on every play, and the catalogue
service filters browse and search the same way.

**3. Viewing history is keyed by `(profile_id, title_id)`.** One row per profile per title, updated in place by
heartbeats. "Continue watching" is a query over one profile's partition: rows where
`position_s` is well past the start but before the credits, sorted by `updated_at`. "Watch again" and "next
episode" come from the same rows.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Viewing history, bookmarks | Huge write rate (heartbeats), always read by profile | Wide-column store (Cassandra, which Netflix has written about using for viewing history) | Fast writes, partitioned by `profile_id`, replicated across regions |
| Catalogue, rights, renditions | Small, read-mostly, changes a few times a day | A relational or document store, cached heavily in memory | Tiny compared to traffic; every service caches it |
| Accounts, profiles, plans | Moderate, needs correctness | Replicated relational or wide-column store | Billing and plan limits must be right |
| Precomputed home pages and recommendations | Large, regenerated in batches | Key-value store plus a cache (Netflix's EVCache is built on memcached) | Read in one lookup per home page load |
| Encoded files, masters | Petabytes of immutable bytes | Object storage (S3) | Cheap, durable origin for fills |
| Events (plays, heartbeats, clicks) | Firehose | Kafka-style log | Feeds analytics and model training |

### Heartbeats without melting the database

At roughly 670,000 heartbeats a second, writing each one straight through would be expensive. Typical tricks:

- **Write only what changed.** The row holds the latest position; each heartbeat overwrites it. History does not
  grow with every heartbeat.
- **Coalesce.** The history service can buffer in memory for a few seconds and write the newest position only.
  Losing a few seconds of progress on a crash is acceptable; the player also sends a final position on stop.
- **Compact old history.** Old rows for finished titles can be compressed into a summary per profile, which is
  what Netflix's public write-ups describe for keeping recent history fast and old history cheap.
- **Last write wins.** If the TV and the phone both send positions, the newest timestamp wins, which matches
  what the member actually did last.

## 12. Low-level design: DRM and licence servers

Studios license content only if it is protected, so **every rendition is encrypted** (with AES, a standard
cipher) during packaging. The encrypted files on OCAs are useless on their own; the **keys** live only in the
control plane.

1. The player's **DRM module** (Google Widevine, Microsoft PlayReady or Apple FairPlay, depending on the device)
   creates a **licence challenge**: a signed request proving which device and DRM system it is.
2. The licence server checks the member's entitlement (plan, country, stream limit) and the device's security
   level. A device with hardware-protected decoding may get keys for 4K; a weaker one may only get keys for
   lower resolutions.
3. It returns a **licence**: the content keys, encrypted so only that device's DRM module can read them, plus
   rules such as how long the licence lasts.
4. The DRM module decrypts segments inside protected hardware or software, so the app itself never sees the
   raw keys or decrypted frames.

Why separate licence servers from the playback API? Licences are security-critical, use special DRM vendor
libraries, and must be audited, so isolating them keeps that code small and well guarded. They are also on the
start-up path, so they must be fast and highly available. Offline downloads use the same idea with a
longer-lived licence that the device stores, with limits on how many devices can hold one.

## 13. Low-level design: the home page, rows and artwork

The home page is where members decide what to watch, so it is personalised end to end. At a high level:

- **Rows.** Each row is produced by a different algorithm: "Continue watching" (from viewing history),
  "Trending now" (regional popularity), "Because you watched X" (similar titles), genre rows, and so on.
- **Ranking titles within a row**, by how likely this profile is to enjoy each one.
- **Ranking rows on the page**, balancing relevance with variety so the page is not ten rows of crime dramas.
- **Artwork.** Netflix has written about choosing a different image for the same title per member: someone who
  watches many romances may see the two leads, someone who watches comedies may see the funny co-star. This is
  framed as a **contextual bandit** problem: show different images, learn which ones lead to plays for which
  kinds of members, and shift towards the winners while still exploring.

**Where the work happens.** Training models over billions of viewing events runs offline in batch. Candidate
rows for each profile are **precomputed** and stored in a fast key-value store and cache. When the app opens,
the home page service fetches the precomputed result and adds fresh, cheap touches (the "Continue watching" row
from minutes ago, titles just removed from the country's catalogue). This keeps the page fast even at peak.

**Graceful degradation.** If the personalisation service is slow, the home page falls back to a cached older
page or a generic popular-titles page. A slightly less personal page is far better than an error.

## 14. Reliability: keep the picture moving

The guiding rule is: **a failure should cost the member some quality or freshness, never the stream.**

| Risk | Defence |
| --- | --- |
| One OCA fails mid-stream | The player already has other ranked URLs and switches on its own; the buffer hides the gap |
| An ISP link is congested | ABR drops quality; steering shifts new plays to other OCAs or the exchange |
| A cloud service is slow or failing | Timeouts, retries with limits, **circuit breakers** (stop calling a sick dependency and use a fallback), and fallbacks such as a cached home page |
| A whole cloud region fails | Several regions run active-active; traffic is moved to healthy regions (below) |
| A bad deploy | **Canary** releases: send a small share of traffic to the new version, compare error rates automatically, roll back if worse |
| Unknown weaknesses | **Chaos engineering**: break things deliberately, in production, during working hours |

### Chaos engineering

Netflix made this idea famous. **Chaos Monkey** (open-sourced in 2012) randomly shuts down production
servers, so every service team must build for instances disappearing at any moment. Larger experiments
followed, up to **Chaos Kong**, which simulates the loss of an entire cloud region. The point is not to cause
outages; it is to discover weaknesses on a Tuesday afternoon with engineers watching, rather than on a Saturday
night by surprise.

### Regional failover

The control plane runs in several AWS regions (Netflix's public write-ups describe three), each able to serve any
member, with data such as viewing history replicated between them.

[![Regional failover sequence: normally a device resolves the API hostname to region A and calls it, with writes replicating to regions B and C; when region A's error rate rises, failover control scales region B up first and then tells DNS steering to send region A's members to B and C; the device resolves again with a short TTL, gets region B and continues, its history already there and its video never interrupted](/img/system-design/netflix/08-failover.png)](/img/system-design/netflix/08-failover.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Scale up before you shift.** Moving a third of all traffic onto regions that are not ready would just
  topple them too. The healthy regions are scaled up first, then traffic moves.
- **Short DNS TTLs** (how long a client may cache a DNS answer) let devices find the new region within
  minutes.
- **Replication makes the move invisible.** Because writes already flow to every region, Priya's bookmark is
  there when her next request lands in region B. Replication is asynchronous, so the last few seconds of
  progress might be lost, which is acceptable.
- **The data plane does not care.** Video already playing comes from OCAs, which keep serving their files even
  while the cloud reshuffles. Members mid-episode usually notice nothing.

## 15. What breaks as it grows, and how to fix it

**The launch-night spike.** A huge new season drops at the same moment worldwide. *Fix:* pre-position it on
every relevant OCA days in advance (the files are encrypted, so early placement is safe), pre-scale the control
plane, and warm caches for the title's pages.

**The long tail.** Most titles are rarely watched in a given area, and they will not fit on small ISP
appliances. *Fix:* tiering. ISP OCAs hold the popular head, exchange OCAs hold much more, and steering sends tail
requests to the larger tier, where a slightly longer path matters little.

**Encoding cost.** Shot-based encoding and new codecs multiply the computing needed per title, and re-encoding
the back catalogue is a big job. *Fix:* chunked parallel encoding on spare cloud capacity, prioritising the most
watched titles, because savings scale with hours viewed.

**Heartbeat write storms.** Hundreds of thousands of writes a second, all in the evening. *Fix:* partition by
profile, coalesce writes, overwrite rather than append, and compact old history.

**Cascading failures in the cloud.** Hundreds of microservices call each other; one slow service can tie up
threads everywhere. *Fix:* timeouts on every call, circuit breakers, bulkheads (separate thread pools per
dependency), and fallbacks, all exercised by chaos experiments.

**Device fragmentation.** Thousands of device models, each with different codecs, DRM levels and quirks.
*Fix:* devices declare capabilities; the playback API filters renditions per device, and quality is monitored
per device model through heartbeat data.

## 16. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| CDN | Rent a commercial CDN | Build your own, inside ISPs | **Own CDN** at this scale: bandwidth dominates cost, and placing servers inside ISPs is cheaper for everyone. A smaller service should rent |
| Caching | Reactive (fill on miss) | Proactive (fill overnight by forecast) | **Proactive**: the catalogue is curated and demand predictable, so evening misses almost vanish |
| Encoding | Fixed ladder, fast | Per-title / per-shot, slow and costly | **Per-shot**: encoding is paid once per title, bandwidth is paid on every view |
| Who picks the edge server | DNS / anycast | Control plane steering with ranked URLs | **Steering**: it knows exactly which OCA holds the file and its health |
| Who picks the bitrate | Server | Client (ABR) | **Client**: it sees its own buffer and network best |
| Home page | Computed on request | Precomputed, then lightly refreshed | **Precomputed**: fast at peak, with fresh "Continue watching" layered on |
| Regions | Active-passive | Active-active | **Active-active**: the standby is already warm and proven by real traffic |
| Viewing history consistency | Strong | Eventual across regions | **Eventual**: losing a few seconds of progress is acceptable; availability matters more |

## Cheat sheet for last-minute revision

- **Two planes:** control plane in the cloud (accounts, catalogue, playback API, steering, licences, home page,
  history); data plane at the edge (Open Connect appliances inside ISPs and at exchange points). The cloud never
  serves video bytes.
- **Not YouTube:** no uploads, a curated catalogue, so encode thoroughly offline and pre-position content.
- **Encoding:** split the master at shots, encode chunks in parallel, per-title and per-shot ladders, measured
  with VMAF; many renditions in AVC, HEVC, VP9 and AV1; package into segments and encrypt.
- **Playback:** play request → entitlement check → steering returns ranked OCA URLs → manifest + bookmark →
  licence → segments from the ISP's OCA → heartbeats.
- **ABR:** client picks each next segment's rendition from buffer level and measured speed; drop fast, climb
  slowly, switch at segment boundaries; DASH / HLS manifests.
- **Steering:** BGP routes + which files each OCA holds + health → rank ISP OCA, then exchange, then others;
  the device fails over through the list on its own.
- **Pre-positioning:** forecast popularity per region, fill lists per OCA, fill in off-peak windows, tiered
  fill from larger OCAs; evening traffic is served from disk.
- **DRM:** content encrypted once; licence servers give device-bound keys after checking plan and device
  security level (Widevine, PlayReady, FairPlay).
- **History:** one row per `(profile_id, title_id)` in a wide-column store, overwritten by heartbeats;
  "Continue watching" is a per-profile query.
- **Resilience:** fallbacks and circuit breakers, chaos engineering (Chaos Monkey to Chaos Kong),
  active-active regions with DNS failover.
- **Numbers:** 40M concurrent streams × 5 Mbit/s ≈ 200 Tbit/s at peak; ~11K play starts/s; ~670K heartbeats/s;
  ~3 PB of encoded files for 50,000 hours.

## Practice questions

1. **Why not serve video from the cloud regions directly?** At around 200 Tbit/s of peak demand, no set of data
   centres could push that through their internet links affordably, and every byte would cross many networks.
   Edge servers inside ISPs put the bytes a few hops from viewers and keep traffic off the busiest links.
2. **A viewer complains the picture is blurry every evening. How would you investigate?** Look at their
   heartbeats: which rendition, buffer level and throughput per segment, and which OCA served them. If the
   throughput drops at peak on one ISP, the link to that OCA is congested; check whether the ISP has embedded
   OCAs and whether steering sends them to the right one. If throughput is fine but quality low, check device
   caps and the plan.
3. **How would you add a "Skip intro" button?** During encoding or by a separate analysis job, detect intro start
   and end times per episode (the same opening appears across episodes), store them with the title metadata, and
   include them in the manifest. The player shows the button between those timestamps and seeks on tap.
4. **How would the design change for live sports?** Encoding must run in real time with no per-title
   optimisation; segments are created seconds before they are watched, so pre-positioning is impossible and
   the edge must fetch new segments as they appear. Latency targets, manifest refresh and origin protection
   become central problems.
5. **What happens if the steering service is down?** New plays cannot get fresh URLs. Mitigations: run steering
   in every region, let the playback API fall back to a cached or default ranking (for example, the exchange OCAs
   for that network), and remember that streams already playing are unaffected because the device already holds
   its URLs.
