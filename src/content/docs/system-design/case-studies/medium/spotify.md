---
title: "Design Spotify (Music Streaming)"
description: "Design a Spotify-scale music service: bitrate ladders, CDN streaming, fast playback start, shared playlists, offline DRM, exact play counts and recommendations."
difficulty: "Medium"
sidebar:
  label: "Spotify (music streaming)"
tags: ["Streaming", "CDN", "Storage", "Data pipelines", "Recommendations"]
---

You open a music app, tap a song, and it starts playing in well under a second, on a train, with a weak signal.
Underneath that tap sit several different systems. There is a **record shop** with a catalogue of a hundred
million tracks, a **radio transmitter** pushing audio to tens of millions of listeners at once, a **notebook**
where people keep their playlists (and share them with friends), an **accountant** who counts every play so
that artists get paid, and a **friend with good taste** who suggests what to play next.

This case study designs that service from first principles. We start with how digital audio works, then
build the system layer by layer, and finish with what breaks as it grows and a one-page revision sheet.
The design is a typical one for this problem; where Spotify has published a fact (bitrates, download limits),
we say so, and everything else is "how you would build it", not a claim about Spotify's internals.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Audio streaming in 5 minutes

A song in the studio is a long list of numbers: the air pressure measured 44,100 times a second for each of two
channels. Stored as is, that is about 1,411 kbit/s (kilobits per second), roughly **10 MB per minute**. Nobody
streams that to a phone. The words below are the vocabulary for the rest of the design.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Master** | The original, uncompressed (or lossless) file a record label delivers, usually WAV or FLAC | The original painting |
| **Codec** | The method that compresses and decompresses audio: Ogg Vorbis, AAC, Opus, MP3, FLAC | The way you fold a map so it fits in a pocket |
| **Lossy / lossless** | Lossy codecs throw away sounds people barely hear and shrink the file 5–15×; lossless (FLAC) shrinks it about 2× and keeps every bit | A good photocopy vs a perfect copy |
| **Bitrate** | How many bits one second of audio takes. Higher means better quality and more data | Words per minute on a telegram |
| **Encoding ladder** | The same track stored at several bitrates, so the app can pick one | The same book in pocket, paperback and hardback editions |
| **Chunk / byte range** | A small piece of a file fetched on its own (HTTP `Range: bytes=0-262143`), so playback can start before the whole file arrives | Reading a book a chapter at a time |
| **Buffer** | Audio already downloaded but not yet played. A full buffer survives a network gap | The water in a tank that keeps the tap running when the mains drop |
| **ABR** (adaptive bitrate) | The player choosing the bitrate of the next chunk from the network speed it is seeing | Driving slower on a bumpy road |
| **CDN** | A content delivery network: thousands of cache servers near users that serve the bytes | Local corner shops instead of one central warehouse |
| **DRM** | Digital rights management: files are encrypted and only an authorised app with a valid key can play them | A locked box that only opens with today's code |
| **ISRC** | International Standard Recording Code: a global ID for one recording | An ISBN for a song |

Spotify's public help pages describe its quality settings as roughly **24 kbit/s** (Low), **96** (Normal),
**160** (High) and **320** (Very high) on its apps, plus a lossless FLAC option on Premium, and AAC at 128 or
256 kbit/s in the web player. At 160 kbit/s, a 3.5-minute song is about **4 MB**, and one second of audio is
**20 KB**. Keep those numbers in mind: they decide most of the design.

Two facts shape everything that follows:

1. **The bytes and the "brains" travel separately.** Audio bytes are big, identical for everyone, and never
   change, so they come from a CDN. Everything else (who you are, what you may play, your playlists) is small
   and personal, so it comes from our API servers.
2. **Music is a long tail.** A small share of the catalogue gets most of the plays (this week's hits), while
   millions of tracks are played rarely. Caching works brilliantly for the head and must be designed for the tail.

## 2. Requirements

### Functional (what users can do)

- **Play** any track in the catalogue, starting fast, without stutters, on mobile, desktop, web and speakers.
- **Browse and search** tracks, albums, artists and playlists, with typo-tolerant, as-you-type search.
- **Playlists**: create, edit, reorder, follow other people's, and **collaborate** (several people editing one).
- **Queue and autoplay**: the next track starts with no gap.
- **Offline downloads** (paid plans): save music to the device and play it with no connection.
- **Play counts**: public counts on tracks, and exact reports so rights holders are paid correctly.
- **Recommendations**: a personalised home page, radio, and weekly personalised playlists.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Playback start** | Under ~500 ms at the median after a tap; under 1–2 s at the 99th percentile | Slow starts are the most noticed failure in a music app |
| **Smoothness** | Rebuffering (silence while waiting for data) in well under 1% of plays | A gap in a song ruins it |
| **Availability** | 99.99% for playback; browsing and recommendations can degrade first | People notice silence more than a missing shelf on the home page |
| **Scale** | ~600 million monthly users, ~250 million daily; ~100 million tracks | Spotify-sized (our assumption, round numbers) |
| **Correctness of counts** | Every qualifying play counted exactly once in royalty reports | Money is paid on these numbers and they are audited |
| **Consistency** | Playlist edits visible to the editor immediately, to collaborators within seconds | Eventual consistency between people is fine |
| **Rights** | Never play a track in a country where it is not licensed; protect the files | Licences are the business |

### Out of scope

Podcasts and audiobooks (similar pipeline, different rights), live audio, lyrics, social features, ads,
payments and the artist dashboard. Mention them in an interview, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resources dominate**.

**Assumptions:** 250 million daily active users, each listening **100 minutes** a day. The average delivered
bitrate is **160 kbit/s** (= 20 KB/s). An average track lasts **3.5 minutes**. The catalogue has
**100 million** tracks. Peak traffic is **2×** the daily average (music listening is smoother through the day
than, say, video at prime time).

**Listening and bandwidth**

- Listening minutes per day: $250\text{M} \times 100 = 25\text{B}$ minutes.
- Average concurrent listeners: $25\text{B} / 1440 \approx 17\text{M}$, about **35 million** at peak.
- Average bandwidth: $17\text{M} \times 160\text{ kbit/s} \approx 2.8\text{ Tbit/s}$, about **5.6 Tbit/s**
  at peak.
- Bytes served per day: $25\text{B} \times 60\text{ s} \times 20\text{ KB} = 30\text{ PB}$.

**Requests**

- Track starts per day: $25\text{B} / 3.5 \approx 7\text{B}$, about **83,000 per second** on average and
  **170,000 per second** at peak. Each start is one playback API call plus a few CDN range requests.
- Play events (start, 30 seconds reached, skip, end), about 4 per play: about **28B a day**, roughly
  **330,000 per second**.

**Storage**

- One track, all encodings: 24 + 96 + 160 + 320 kbit/s Vorbis (600 kbit/s together) + 128 + 256 kbit/s AAC
  (384) + FLAC (~900) is about 1,900 kbit/s, or 240 KB per second of audio. Over 210 seconds, about **50 MB**.
- Whole catalogue: $100\text{M} \times 50\text{ MB} = 5\text{ PB}$, plus roughly as much again for the masters.
- Metadata: about 2 KB per track, so $100\text{M} \times 2\text{ KB} = 200\text{ GB}$. That fits in the
  memory of a small cluster.
- Playlists: assume 4 billion playlists with 60 items each at ~60 bytes per item: about **14 TB**.

Three conclusions follow:

1. **Bandwidth dominates, not storage.** We serve about 30 PB **every day** from a catalogue of about 10 PB.
   Terabits per second can only come from a CDN, so the CDN bill is the biggest line in the budget.
2. **The catalogue is read-mostly and small.** Metadata changes when labels deliver new releases; it is read
   billions of times a day. Cache it everywhere.
3. **Events are a big-data problem.** Hundreds of thousands of events per second must be stored durably and
   counted exactly, which calls for a log and batch pipeline rather than a database counter.

## 4. The API

Apps talk to our API over HTTPS with JSON. Audio bytes come from CDN hostnames, never through the API servers.

| Method and path | What it does |
| --- | --- |
| `GET /v1/tracks/{id}`, `/v1/albums/{id}`, `/v1/artists/{id}` | Catalogue metadata. Heavily cached; responses carry a version so caches stay correct. |
| `GET /v1/search?q=dua+lip&types=track,artist&limit=10` | Search, including as-you-type prefixes and typos. |
| `POST /v1/playback/{track_id}` | Checks that this user may play this track here, then returns the file IDs for each bitrate, **signed CDN URLs** that expire in a few hours, and the loudness value. |
| `POST /v1/keys` | Body: `file_id`, device ID. Returns that file's decryption key, wrapped (encrypted) for this device. |
| `GET https://audio.cdn.example/{file_id}?sig=...` with a `Range` header | Fetch a chunk of an encoded, encrypted file from the CDN. |
| `GET /v1/playlists/{id}` and `GET /v1/playlists/{id}/changes?since=41` | A playlist, or only the edits after a revision. |
| `POST /v1/playlists/{id}/ops` | Edits: `{"base_revision": 41, "ops": [{"add": "track:X", "after": "item:i7"}]}`, with an `Idempotency-Key` header so a retry is not applied twice. |
| `POST /v1/events` | A batch of play events, each with a client-generated `event_id`. |
| `POST /v1/downloads` | Ask to download tracks to this device; returns offline licences. |
| `GET /v1/home` | The personalised home page. |

Why is **signing** CDN URLs useful? The CDN cannot call our database for every chunk, so we give it a cheap
check instead: the URL contains an expiry time and a signature computed with a secret the CDN shares with us.
A link copied to a forum stops working in a few hours, and the CDN verifies it with no network call.

## 5. High-level design

[![High-level architecture: apps call the API gateway for catalogue, search, playback and playlists, fetch audio chunks from the CDN which pulls from the audio object store on a miss, and send play events to a collector that feeds an event log, stream and batch jobs, and royalty reports and recommendations; labels deliver releases to the ingest and transcode service](/img/system-design/spotify/01-architecture.png)](/img/system-design/spotify/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Apps:** the player. It holds the buffer, chooses bitrates, caches recent audio, and batches events.
- **API gateway:** checks the user's token, applies rate limits, routes requests to the right service.
- **Catalogue + search:** serves track, album and artist metadata, and answers search queries.
- **Playback service:** the gatekeeper. It decides whether this user may play this track in this country on
  this plan, and returns the file list and signed URLs. It also serves the queue ("what plays next").
- **Key + licence service:** hands out decryption keys and offline licences, only to authorised devices.
- **Playlist service + store:** stores playlists as a revision log, merges concurrent edits, pushes changes.
- **CDN edge + audio object store:** the CDN serves audio chunks from caches near users; on a miss it fetches
  from the object store (the "origin"), which holds every encoded file.
- **Ingest + transcode:** turns a label's delivery into encoded, encrypted files and catalogue rows.
- **Event collector, event log, stream and batch jobs:** the data platform. It counts plays, builds royalty
  reports and trains recommendation models.

The single most useful idea in this design: **the control plane and the data plane are separate**. The API
(control plane) answers small, personal questions: "may I play this, and where is it?". The CDN (data plane)
moves terabits of identical bytes and knows nothing about users. Each can scale and fail on its own.

## 6. Flow 1: getting music into the catalogue

Before anyone can press play, a release has to be prepared. Labels and distributors deliver each release as
lossless audio files plus a metadata file (an industry XML format) listing titles, artists, ISRCs, release
date and the countries where each track may be sold.

[![Ingest pipeline: the label delivery sends the lossless master to the encoders and metadata to validation; encoders make every bitrate; each file is chunked and encrypted with a new key from the key store, written to the object store and pulled by the CDN on a cache miss; validation writes the track record to the catalogue DB](/img/system-design/spotify/02-encoding.png)](/img/system-design/spotify/02-encoding.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Encode once, serve forever.** Transcoding is CPU-heavy but happens once per track. Every bitrate is made
  ahead of time; nothing is transcoded while a user waits. The jobs run on a queue of workers that scales
  with how much is being delivered (a big back-catalogue delivery can mean millions of tracks).
- **Loudness is measured at ingest.** Songs are mastered at very different volumes. The encoder measures
  each track's loudness and stores a gain value, so the player can even out volume between tracks without
  re-encoding anything.
- **Files are immutable.** A file ID never points to different bytes. If a label fixes a mistake, a **new**
  file with a new ID is made and the catalogue row is switched to it. That is what makes CDN caching safe:
  a cached file can never be stale.
- **Each file gets its own encryption key.** Leaking one key exposes one file, not the catalogue.
- **The release goes live at a set time.** Rows carry a release date and per-country availability, so a big
  album can be fully ingested days early and simply become visible at midnight local time.

## 7. Flow 2: pressing play

This is the path interviewers care about most. The goal is **sound in a few hundred milliseconds**.

[![Sequence for pressing play: the app asks the playback service, which checks rights and returns file IDs and signed CDN URLs; the app fetches the wrapped key, then the first 256 KB chunk from the CDN edge and starts playing; it keeps fetching further ranges with a bitrate chosen per chunk, sends a stream event after 30 seconds, and near the end of the track asks for the next track and prefetches its start](/img/system-design/spotify/03-playback.png)](/img/system-design/spotify/03-playback.png)

*Select the diagram to zoom in and move around.*

Count the round trips before sound: the playback call (1–2), the key (3–4) and the first chunk (5). On a
mobile network one round trip can cost 50–150 ms, so the work is all about **removing or hiding** them.

### Making playback start fast

- **Start small and low.** The first request asks for a small chunk (for example 256 KB, or less at a lower
  bitrate). At 160 kbit/s, 256 KB is about 13 seconds of music: playback can start once the first second or
  two has arrived and decoded, while the rest streams in.
- **Answer before the question.** When a user opens an album or a playlist, the app can ask for playback info
  for the tracks on screen in one batch, before any tap. By the time they tap, steps 1–4 are already done.
- **Cache keys and URLs.** Signed URLs last hours and keys can be cached on the device for their licence
  period, so replaying a track skips steps 1–4 entirely.
- **Warm connections.** Keep a TLS connection open to the CDN and the API, so a tap does not pay for a new
  TCP and TLS handshake (one to three extra round trips).
- **Local cache.** Apps keep recently played audio on disk (encrypted). A favourite song often plays with no
  network request at all.
- **Nearby CDN edges.** A cache server a few milliseconds away beats one an ocean away; for the long tail
  that is not cached at the edge, a regional tier (an "origin shield") stops every miss going to the origin.

(Historically, Spotify's early desktop app also fetched audio from other listeners through a peer-to-peer
network to cut start time and server cost. It was retired as CDNs became cheap and fast; today, a CDN is the
standard answer.)

### Prefetching the next track

Music has a property video lacks: we usually **know what comes next**. It is the next item in the album,
playlist or queue. So, a little before the current track ends (for example in its last 10–30 seconds, or as
soon as its file is fully buffered), the app fetches playback info and the first chunk of the next track
(steps 8–10). When the track ends, the next one starts from memory: **gapless playback**, and crossfades are
possible. If the user skips, the prefetched bytes are wasted, which is a small, acceptable cost.

### Who checks the rights?

The playback service checks, on every start: is the track available in the user's country, is the user's plan
allowed this track and quality, and has the account exceeded any limits? The CDN never checks rights. It only
checks the URL signature, which the playback service gave out after its checks.

## 8. Low-level design: chunked streaming and adaptive bitrate

### How the file is split

Two common ways to make "chunks":

| Approach | How it works | Good for |
| --- | --- | --- |
| **One file per encoding + byte ranges** | Each encoding is one file. The app fetches `bytes=262144-524287` and so on. A small index maps time to byte offset, for seeking | Simple storage; few objects; works on any HTTP CDN |
| **Segments** (HLS / MPEG-DASH style) | Each encoding is cut into separate segment files of a few seconds each, listed in a manifest | Bitrate switching on segment boundaries; standard players |

Either works for music; this design uses one file per encoding with byte ranges. Two details matter:

- **Seeking** ("jump to 2:30") needs the byte offset for that time. The time-to-offset index is small and is
  fetched with the file's first chunk.
- **Switching bitrate in the middle of a track** needs every encoding to have chunk boundaries at the same
  points in time, so the player can stop at second 40 of the 160 kbit/s file and continue at second 40 of
  the 96 kbit/s file. The encoders align these boundaries at ingest.

### Choosing the bitrate

After each chunk the player knows how fast it arrived. It also knows how many seconds are buffered. A simple
rule, run for every chunk:

[![Adaptive bitrate decision: after a chunk downloads, if the buffer is under 10 seconds step down a level; otherwise if the measured speed is over 1.5 times the next level's bitrate and the buffer is over 20 seconds step up a level, never above the user's setting; otherwise keep the bitrate](/img/system-design/spotify/04-bitrate.png)](/img/system-design/spotify/04-bitrate.png)

*Select the diagram to zoom in and move around.*

- **Buffer first, speed second.** A low buffer means silence is close, so step down whatever the speed says.
- **Step up slowly, step down fast.** Requiring 1.5× headroom and a healthy buffer avoids "flapping" between
  levels on a jittery network.
- **Respect settings.** "Data saver" or "Normal on mobile data" caps the ladder; "Very high on Wi-Fi" raises it.
- Audio is small compared with video: even 320 kbit/s is under a third of one megabit. So the buffer can be
  generous (tens of seconds, or the whole track on Wi-Fi), which makes music far more forgiving than video.

### The CDN for audio

- **Cache key = file ID + byte range** (or the segment name). Every listener of the same file shares the same
  cached chunks, and file IDs never change meaning, so entries never need to be purged.
- **Head and tail.** The top tracks of the week sit at every edge with hit ratios near 100%. Tail tracks may
  be cached only at a regional tier, or come from origin; a slower first chunk for a rare B-side is acceptable.
- **Pre-warming.** Before a huge album drops at midnight, push its files to the edges so the first million
  plays do not all miss at once.
- **Several CDNs.** Large services often use more than one CDN, or their own, and steer traffic between them
  by price and measured performance. The playback service simply signs a URL for whichever CDN it chooses.

## 9. Low-level design: the data model

[![Data model: in the catalogue, an artist releases albums, an album contains tracks, and a track is encoded as many audio files; in playlists, a playlist holds playlist items in position order, each pointing to a track, and is shared with collaborators](/img/system-design/spotify/05-data-model.png)](/img/system-design/spotify/05-data-model.png)

*Select the diagram to zoom in and move around.*

Five design decisions hide in this diagram.

**1. The catalogue and playlists are different kinds of data.** The catalogue is written by the ingest
pipeline and read billions of times: it is replicated to every region and cached in memory. Playlists are
written by users all day long: they are sharded by `playlist_id` and replicated within a region.

**2. A track has many audio files.** `audio_files` has one row per codec and bitrate. The playback service
picks the rows the user's plan and device may use and signs their URLs.

**3. `markets` lives on the track.** Rights are per country, so "can Alice in India play this?" is a lookup on
the track row. In practice the same song can have different track IDs in different countries (different
licences or releases); the playback service maps a requested track to the version licensed locally.

**4. Positions are sortable strings, not integers.** If item positions were 1, 2, 3…, inserting a song at the
top of a 5,000-song playlist would rewrite 5,000 rows. Instead, each item has a **fractional position key**:
to insert between `"m"` and `"n"`, use `"mm"`. One row is written, whatever the playlist size. A rare
background job rebalances keys if they grow long.

**5. Items have their own `item_id`.** The same song can appear twice in a playlist, so "remove the song at
index 3" is ambiguous and breaks if someone else edits first. Edits name an `item_id` instead. This is what
makes collaborative editing work (section 11).

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Catalogue metadata | ~100M tracks, read-mostly, small | Relational or wide-column DB, replicated globally, with an in-memory cache in front | Tiny, hot, changes slowly |
| Search index | Inverted index over names and aliases | Lucene-based engine (Elasticsearch, OpenSearch, Solr) | Typo tolerance, prefixes, ranking |
| Playlists | Billions of small lists, read and written by key | Wide-column store (Cassandra, Bigtable) or sharded SQL, keyed by `playlist_id` | Partitioned writes; one playlist on one shard |
| Audio files | Petabytes, immutable | Object storage (S3, GCS or similar) + CDN | Cheapest per byte; the CDN does the serving |
| Keys | Small, very sensitive | A dedicated key-management service with hardware-backed master keys | Separate blast radius and access controls |
| Events | Hundreds of thousands per second | Kafka or Pub/Sub, then files in a data lake (Parquet on object storage) | Replayable streams; cheap columnar history |
| User library, likes | Per-user sets | Wide-column store keyed by `user_id` | Partitioned by user |

## 10. Low-level design: catalogue and search

**Catalogue reads** are the easiest scaling problem in the system. The whole catalogue is about 200 GB, so each
region keeps a full replica, and the catalogue service keeps the hottest rows in memory. Responses carry a
version, so apps and edge caches can keep them for hours and revalidate cheaply. A popular album page is
served thousands of times a second from cache without touching a database.

**Search** has to handle how people actually type: `"beatls"`, `"the weeknd blinding"`, `"ac dc"`, `"bts"`
in Korean script. An inverted index (for each word, the list of documents containing it) is built over track,
album, artist and playlist names, with:

- **Normalisation**: lower case, strip accents and punctuation, so "AC/DC" matches "ac dc".
- **Prefix matching** for as-you-type: "blin" should already find "Blinding Lights".
- **Fuzzy matching** (small edit distance) for typos, and **aliases and transliterations** for artists known
  by several names or scripts.
- **Ranking** by text match **and popularity**: a search for "hello" should show the famous song before 4,000
  obscure tracks also called "Hello". Personal signals (artists you play) break ties.

The index is **sharded by document** and replicated; a query goes to every shard, and each returns its top
results to be merged. It is rebuilt from the catalogue in batch and kept fresh by catalogue change events, so a
new release is searchable within minutes of going live. Search results are mostly **IDs**; the display data
comes from the catalogue cache.

## 11. Low-level design: playlists and collaborative editing

A playlist looks like a simple list, but it is read by millions (a big editorial playlist), edited by several
people at once (a collaborative party playlist) and synced to every device of every follower.

**Store a playlist as a revision log.** Every edit (add, remove, move, rename) is an **operation** appended
with a **revision number**: 41, 42, 43… The current state is a snapshot plus the operations after it. Devices
remember the revision they have and ask for "changes since 41", so syncing sends only what changed.
Spotify's public Web API exposes a similar idea: each playlist version has a `snapshot_id`.

Two people edit at the same moment:

[![Collaborative edit sequence: Alice adds track X after item i7 based on revision 41; the playlist service writes it only if the revision is still 41 and gets revision 42; Bob then removes item i3, also based on revision 41; the service reads operation 42, sees that item i3 still exists so there is no conflict, writes his edit as revision 43, returns operation 42 for Bob to apply, and nudges Alice to fetch the change](/img/system-design/spotify/06-collab-edit.png)](/img/system-design/spotify/06-collab-edit.png)

*Select the diagram to zoom in and move around.*

How the merge works:

- **Compare-and-set** on the revision makes writes to one playlist happen one at a time: "save only if the
  revision is still 41". The loser of a race does not fail; the service **rebases** its operation on top of the
  newer ones.
- **Operations name items, not indexes.** "Remove `i3`" and "add X after `i7`" still mean the same thing after
  someone else's edit. "Remove the third song" would not.
- **Simple rules for real conflicts.** Remove beats move (the song is gone); two people adding the same song
  get two items (people do want duplicates sometimes); renames are last-writer-wins.
- **Permissions** are checked on every operation against `playlist_collaborators` (owner, editor, viewer).

**Hot playlists.** An editorial playlist with tens of millions of followers is read far more than it is
written. Cache the snapshot keyed by `(playlist_id, revision)` at the API layer (and even on the CDN, since a
given revision never changes). Followers do not get a push per edit; their apps notice a new revision the next
time they open it.

**Big playlists.** Some users keep playlists of 10,000 songs. Return items in pages, keyed by position, and
compact old operations into a fresh snapshot now and then so a new device does not replay years of edits.

## 12. Low-level design: offline downloads and DRM

Downloads let a paid user listen with no network: on a plane, in the underground. The music industry licenses
this only if the files cannot simply be copied out of the app. That is what DRM is for, at a conceptual level:

- **Files are always encrypted** with a per-file content key (the same files the CDN serves, see section 6).
- **Keys are delivered wrapped**: the key service encrypts the content key with a key that belongs to this
  device and app install. Copying the file and key to another device gets you nothing usable.
- **An offline licence has an expiry.** The device must check in periodically to renew it, which is when the
  service confirms the subscription is still active and the tracks are still licensed. Spotify's help pages
  state that downloads need the app to go online at least once every **30 days** (otherwise they are
  removed), and limit downloads to **10,000 songs on each of up to 5 devices**.
- **Limits are enforced on the server.** The licence service tracks which devices hold downloads; a sixth
  device has to free a slot first.

[![Lifecycle of a downloaded track: not downloaded, queued, downloading, playable offline; downloading pauses when the network is lost and resumes from the last byte range; after 30 days offline the licence expires and the file is kept but cannot play until the app goes online and renews; if the plan has ended the file and key are deleted](/img/system-design/spotify/07-offline.png)](/img/system-design/spotify/07-offline.png)

*Select the diagram to zoom in and move around.*

The diagram keeps the encrypted file when the licence expires, so renewing does not mean downloading it
again; deleting the downloads, as Spotify does, is the simpler choice. Either way, nothing plays without a
valid licence.

No DRM is unbreakable: a determined attacker controls the device. The honest goal is to make copying **harder
than paying**, and to make each leak small (one file, one key, one device). Plays made offline still count:
the app stores their events and uploads them when it reconnects (section 13).

## 13. Low-level design: play counts and royalty reporting

Rights holders are paid from their share of the plays in a period, so counts are **money**. By common industry
practice (and Spotify's public statements) a play counts as a **stream** once at least **30 seconds** have been
listened to. The hard parts are **exactly once** and **late data**.

[![Play counting pipeline: the app buffers events offline and sends each with an event_id to the collector, which acknowledges only after a durable write to the replicated, partitioned event log; a stream job deduplicates by event_id and updates live counters within minutes; the log is also archived as append-only hourly files, and a daily batch job deduplicates, applies the rules and joins rights data to produce exact royalty reports per rights holder](/img/system-design/spotify/08-play-counts.png)](/img/system-design/spotify/08-play-counts.png)

*Select the diagram to zoom in and move around.*

**Why exact counting is hard.** Phones retry when they get no answer, so the same event can arrive twice.
Collectors and stream jobs restart, so the same event can be processed twice. A phone that was offline for a
week uploads a week of events at once. A naive `UPDATE plays SET count = count + 1` on every event gets all
three wrong, and at 330,000 events per second it would also melt the database.

**The pattern: an immutable log, plus idempotent counting.**

1. **The app gives each event a unique `event_id`** (a random UUID) when the play happens, and keeps it in a
   local queue until the collector acknowledges it. Retries resend the same ID.
2. **The collector acknowledges only after a durable write** to a replicated log (Kafka-style). From then on
   nothing is lost; at worst it is duplicated.
3. **The fast path** (seconds to minutes) is a stream job that drops duplicate IDs it has seen recently and
   bumps counters. Good enough for live charts and the public play count, which may be slightly behind or off
   by a tiny fraction.
4. **The slow path** is the source of truth. Raw events are archived as append-only files, partitioned by hour.
   Once a day a batch job reads them, **deduplicates on `event_id` over the whole period**, applies the rules
   (30-second threshold, fraud filters for bot-like listening), joins the track's rights holders and writes
   the report. Because the input is immutable, the job can be rerun and produces the same answer, which is
   exactly what an auditor wants.
5. **Late events** are counted by the date they arrive within a reporting window, or the window is
   recomputed: the batch job simply reruns over the affected days.

```sql
-- Daily royalty count, conceptually (the real job runs on a distributed engine).
-- Only the "stream" event (sent once per play at 30 s) counts; DISTINCT drops retried copies.
SELECT track_id, country, COUNT(*) AS streams
FROM (SELECT DISTINCT event_id, track_id, country
      FROM play_events
      WHERE event_date = '2026-11-11' AND event_type = 'stream'
        AND ms_played >= 30000 AND NOT flagged_fraud) t
GROUP BY track_id, country;
```

This split of a fast approximate path and a slow exact path is often called the **lambda architecture**. The
key idea for an interview: **at-least-once delivery + deduplication by a unique ID = exactly-once counting.**

## 14. Low-level design: recommendations (high level)

A personalised home page, radio that "keeps going" after an album ends, and a fresh personalised playlist
every week (Spotify's Discover Weekly is the well-known example) come from the same pipeline. Recommendation
systems at this scale almost always have **two stages**: cheaply find a few hundred plausible tracks out of
100 million (**candidate generation**), then carefully order them (**ranking**).

[![Recommendation pipeline: listening history, playlists and audio and text features feed offline training of user and track embeddings; nearest neighbours fill a candidate store with a few hundred tracks per user; an online ranking model combines those candidates with the current session's context and returns an ordered list to home and radio](/img/system-design/spotify/09-recommendations.png)](/img/system-design/spotify/09-recommendations.png)

*Select the diagram to zoom in and move around.*

- **Signals.** What people play, skip and save (**implicit feedback**: nobody rates songs, but finishing one
  is a strong "yes" and skipping it in 5 seconds is a "no"). Playlists are a goldmine: if thousands of people
  put two songs in the same playlist, those songs go together. Audio and text features (tempo, energy,
  genre, words used to describe the artist) help with brand-new tracks nobody has played yet.
- **Offline batch training** (daily or weekly) turns users and tracks into **embeddings**: lists of numbers
  where similar things end up close together. "Users who play what you play also play…" becomes "tracks near
  your vector".
- **Candidate generation** finds the nearest tracks with an **approximate nearest-neighbour** index (Spotify
  open-sourced one called Annoy). Approximate is fine: we need a few hundred good candidates, not the exact
  best one. Candidates can be precomputed per user overnight.
- **Ranking** runs online when you open the app. A model scores each candidate with fresh context (time of
  day, device, what you just skipped), filters what you heard yesterday or blocked, and mixes in some
  **exploration** so the system keeps learning instead of only feeding back what you already like.
- **A weekly playlist** is the same pipeline run once in batch: rank, take the top 30, write it as a normal
  playlist owned by the system. Hundreds of millions of playlists are written in one batch job and then
  served like any other playlist.

**Cold start** is the classic follow-up: a new user has no history (ask for a few favourite artists, use
country and popular charts), and a new track has no plays (use its audio features and the artist's existing
listeners, then learn from the first plays).

## 15. What breaks as it grows, and how to fix it

**The midnight album drop.** A superstar releases an album at 00:00 and millions press play in the same minute.
*Fix:* ingest days early with a release time, pre-warm the files at CDN edges, pre-cache the catalogue rows,
and scale the playback service ahead of time; the event pipeline absorbs the burst because the log buffers it.

**The CDN bill.** Terabits per second cost real money. *Fix:* efficient codecs (better quality per bit), bigger
on-device caches (a replayed song costs nothing), a sensible default bitrate on mobile data, several CDNs
bought on price, and caching tail content at regional tiers instead of everywhere.

**The long tail.** Millions of rarely played tracks miss the edge cache. *Fix:* a regional origin shield, a
small first chunk so even a miss starts quickly, and prefetching when we can predict the next track.

**The hot playlist.** An editorial playlist is opened millions of times an hour. *Fix:* cache snapshots by
`(playlist_id, revision)`; revisions are immutable, so caching is trivially correct.

**The event firehose.** Hundreds of thousands of events per second, more after outages as phones flush their
queues. *Fix:* batch events on the device, partition the log by `event_id` or user, autoscale consumers from
the backlog, and keep the counting jobs rerunnable.

**Global users.** Users in Brazil should not wait for a server in Sweden. *Fix:* run the API in several regions
with the catalogue replicated to all of them, keep each user's data (library, playlists) in a home region with
replicas, and route audio to the nearest CDN edge.

## 16. Reliability: keep the music playing

| Risk | Defence |
| --- | --- |
| A CDN or CDN region fails | Several CDNs; the playback service returns URLs for a backup CDN; the app retries a failed chunk on the backup |
| The playback or key service is slow | Prefetched playback info and cached keys; already-buffered tracks keep playing; short timeouts with retries |
| Recommendations or search are down | Degrade gracefully: show a cached home page or popular charts; playback is unaffected |
| The playlist service is down | Apps show their cached copy and queue edits locally with idempotency keys, then replay them |
| Events are lost | The app keeps events until acknowledged; the collector acknowledges only after a replicated write; counting is rerunnable from raw files |
| A bad catalogue update | Versioned catalogue snapshots that can be rolled back; files are immutable, so audio is never corrupted in place |

Notice the priority order: **playback first**, then browsing, then everything else. Every non-essential
dependency on the play path is removed or made optional.

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Encode when | On demand, per request | Every bitrate at ingest | **At ingest**: encode once, serve billions of times; no CPU on the play path |
| Chunking | Segment files + manifest | One file per encoding + byte ranges | **Byte ranges**: fewer objects; both work for music |
| Who serves audio | Our own servers | CDN (one or several) | **CDN**: terabits near users; our servers only sign URLs |
| Rights checks | At the CDN on every chunk | At the playback service, then signed URLs | **Playback service**: the CDN only checks a cheap signature |
| Playlist edits | Lock the playlist / last write wins | Revision log + rebase of item-based operations | **Revision log**: concurrent editors never lose each other's changes |
| Play counts | Database counters | Immutable event log + batch deduplication | **Event log**: exact, auditable, rerunnable; a stream path for live numbers |
| Recommendations | Compute everything online | Offline candidates + online ranking | **Both**: heavy work in batch, fresh context at request time |
| Next track | Fetch when the current one ends | Prefetch near the end | **Prefetch**: gapless playback for a few wasted KB on skips |

## Cheat sheet for last-minute revision

- **Two planes:** the API (control plane) decides "may I play this, where is it?"; the CDN (data plane)
  serves immutable, encrypted audio chunks. Signed, expiring URLs connect them.
- **Encodings:** one lossless master becomes an encoding ladder at ingest (Spotify publicly lists about 24, 96,
  160, 320 kbit/s plus lossless; AAC on web). Files are immutable and each has its own key.
- **Streaming:** byte-range chunks; start with a small first chunk; buffer tens of seconds; ABR steps down fast
  on a low buffer and up slowly with 1.5× headroom; chunk boundaries aligned across bitrates.
- **Fast start:** batch-fetch playback info for tracks on screen, cache keys and URLs, warm TLS connections,
  on-device cache, nearby CDN edge; **prefetch the next track** for gapless play.
- **Catalogue:** about 200 GB, read-mostly; replicate everywhere and cache. **Search:** inverted index with
  prefixes, typos, aliases, ranked by match and popularity.
- **Playlists:** revision log + compare-and-set; operations reference `item_id`; fractional position keys;
  cache snapshots by `(playlist_id, revision)`.
- **Offline:** encrypted files + device-wrapped keys + expiring licences (check in every 30 days; 10,000 songs
  on up to 5 devices).
- **Play counts:** client `event_id` → durable log → stream job for approximate live counts, daily batch
  dedupe for exact royalty reports; a stream counts after 30 seconds.
- **Recommendations:** implicit feedback + playlist co-occurrence + audio features → embeddings → ANN
  candidates (offline) → ranking with session context (online).
- **Numbers:** 250M daily users × 100 min → ~17M concurrent, ~2.8 Tbit/s average, ~30 PB served a day from a
  ~10 PB catalogue; ~7B plays a day (~83K/s).

## Practice questions

1. **Users in one country report songs taking 3 seconds to start. How do you investigate?** Split the start
   into its parts with client timing (playback call, key call, first byte from the CDN, decode). Then compare
   CDN hit ratio and edge latency for that country, check whether a CDN or its routing changed, and whether
   the playback service in that region is slow. The fix depends on which slice grew.
2. **How would you add a "Jam" or "group session" where friends control one queue?** A shared session object
   with a revision log, like a collaborative playlist, plus a push channel to every participant. One device
   plays and others follow the session's current track and position.
3. **How would you support lyrics synced to the music?** Lyrics with timestamps per line are small, cacheable
   metadata keyed by track ID, fetched with playback info; the app highlights the line for the current
   position.
4. **A label says its counts are too low. How do you prove your numbers?** The raw event files are immutable,
   so rerun the batch job for that period and show the input count, duplicates removed, plays under 30
   seconds, and plays flagged as fraud. Reproducibility is why counting happens on an immutable log.
5. **How would you cut CDN costs by 20%?** Find where the bytes go: a better codec at the same quality,
   larger on-device caches, lower default quality on mobile data, more traffic to the cheapest CDN that meets
   latency targets, and checking that prefetching is not wasting too many bytes on skipped tracks.
