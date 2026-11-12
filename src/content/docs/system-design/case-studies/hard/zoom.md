---
title: "Design Zoom (video conferencing)"
description: "Design a Zoom-like video meeting service: UDP and WebRTC basics, mesh vs MCU vs SFU, simulcast, bandwidth estimation, cascading media servers and recording."
difficulty: "Hard"
sidebar:
  label: "Video conferencing (like Zoom)"
tags: ["Real-time", "WebRTC", "Networking", "Video", "Scalability"]
---

A video call feels like the simplest thing on the internet: you click a link, you see faces, you talk. Underneath,
it is one of the hardest real-time systems to build. Every participant's camera and microphone produce a stream
of data that must reach everyone else **within a fraction of a second**, over home Wi-Fi, crowded mobile networks
and corporate firewalls, while each person's connection quietly gets better and worse from one second to the
next. A web page that loads in two seconds is fast. A voice that arrives two seconds late makes a conversation
impossible.

This case study builds a Zoom-like service from first principles. We start with why live media is different from
everything else you have designed, learn the WebRTC vocabulary, pick the right shape for the call (mesh, MCU or
SFU), and then design the service around it: signalling, media servers across regions, adapting quality to every
receiver, large meetings, recording, transcription and encryption.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Real-time media in 5 minutes: why it is different

Most systems you design are about **correctness**: every byte of a bank transfer or a chat message must arrive,
even if it is a little late. Live audio and video turn this upside down. **Late is the same as lost.** A video
frame that arrives after the moment it should have been shown is useless; the call has moved on.

**The latency budget.** Telephone engineers learned long ago that a conversation feels natural when the one-way
delay from mouth to ear stays under about **150 ms** (the ITU-T G.114 guideline). Beyond roughly 300 ms people
start talking over each other. That budget has to cover everything:

| Step | Typical time |
| --- | --- |
| Capture and encode a frame (camera, encoder) | 10–40 ms |
| Network: you → media server → the other person | 20–150 ms, depending on distance |
| Jitter buffer (explained below) | 20–80 ms |
| Decode and display | 10–20 ms |

There is no room for anything slow: no disk writes on the media path, no queues measured in seconds, no
"retry until it works".

**Why UDP, not TCP.** TCP guarantees that every byte arrives, in order. If one packet is lost, TCP holds back
**everything after it** until the lost packet is re-sent (this is called *head-of-line blocking*). For a file
that is right. For a voice it is a disaster: one lost packet freezes the audio for a round trip or more, and
then a burst of stale sound arrives at once. **UDP** just sends packets and lets the application decide what to
do about loss. Real-time media almost always runs over UDP, using **RTP** (Real-time Transport Protocol), which
adds a sequence number and a timestamp to each packet so the receiver can put them back in order and play them
at the right moment.

**Jitter.** Packets sent every 20 ms do not arrive every 20 ms. One takes 40 ms, the next 70 ms, the next 35 ms.
This variation is called **jitter**. The receiver keeps a small **jitter buffer**: it holds packets for a few
tens of milliseconds, then plays them out at a steady pace. A bigger buffer hides more jitter but adds delay, so
good clients resize it continuously.

**Packet loss: retransmit or not?** Networks lose 0.1–5% of packets, sometimes more on mobile. A real-time
system has three tools, used together:

- **Retransmission (NACK)**: the receiver says "I missed packet 1042, please resend". Worth it only when the
  round trip is short enough for the copy to arrive before its play-out time. Used mostly for video.
- **Forward error correction (FEC)**: send a little redundant data up front so a lost packet can be rebuilt
  without asking. Costs bandwidth, saves time. The Opus audio codec has a built-in form of it.
- **Concealment**: when audio really is missing, the decoder invents a plausible 20 ms of sound; when video is
  missing, the frame freezes or the receiver asks for a fresh **key frame** (a complete picture that does not
  depend on earlier frames).

The everyday analogy: a TCP file download is a **courier** who will not leave until you sign for every parcel.
A live call is a **radio broadcast**: if you missed a word, the presenter keeps talking, and you fill the gap
from context.

## 2. WebRTC building blocks in plain words

**WebRTC** is the open standard (built into every modern browser) for real-time audio, video and data between
endpoints. Zoom's own desktop and mobile apps have long used Zoom's own media protocol rather than standard
WebRTC, but they solve the same problems with the same ideas, so these are the words an interviewer expects.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Signalling** | Exchanging "who is in the call, what can you send, where can I reach you" before any media flows. WebRTC does not define how; most services use a WebSocket to their own server | Phoning ahead to agree a meeting place |
| **SDP** (Session Description Protocol) | The text that describes a media session: which codecs, how many streams, encryption fingerprints. One side sends an *offer*, the other an *answer* | The menu and the order |
| **NAT** | Your home router shares one public IP address between all your devices, so nobody outside can reach your laptop directly | A company switchboard: outsiders know only the main number |
| **STUN** | A tiny server that tells you "from out here, you look like `203.0.113.7:51234`", your public address | Asking a friend to read the caller ID you show up as |
| **TURN** | A relay server that forwards your media when no direct path works (strict firewalls, UDP blocked). Can run over TCP or TLS on port 443 so it looks like web traffic | A forwarding address for your post |
| **ICE** (Interactive Connectivity Establishment) | Collects every possible address (local, STUN-discovered, TURN relay), tries pairs of them, and picks the best path that works | Trying every door until one opens |
| **DTLS** | TLS for UDP. The two sides use it once to authenticate each other and agree on keys | Shaking hands and swapping keys |
| **SRTP** | Secure RTP: every media packet encrypted and authenticated with the keys DTLS agreed | Sealed envelopes for every packet |
| **Codec** | Compresses audio or video. **Opus** for audio (roughly 20–50 kbps for good speech); **H.264, VP8, VP9, AV1** for video | Packing a suitcase tightly |

Three facts from this table shape the whole design:

1. **Signalling and media are separate planes.** Signalling is small, reliable messages (a WebSocket over TCP is
   fine). Media is a firehose of UDP packets. They go to different servers and scale differently.
2. **Connectivity is never guaranteed.** A few per cent of users sit behind networks that block UDP entirely.
   Without TURN relays on TCP/TLS port 443, they simply cannot join.
3. **Encoding is expensive; forwarding is cheap.** Decoding and re-encoding video costs a lot of CPU. Copying
   an already-encoded packet to another address costs almost nothing. This one fact decides the topology.

## 3. Requirements

### Functional (what users can do)

- **Schedule** a meeting (one-off or recurring) and get a link, a meeting ID and a passcode; or start one instantly.
- **Join** from desktop, mobile or browser, with audio and video, through a waiting room if the host wants one.
- **See and hear** others: speaker view (the person talking, large) and gallery view (a grid of tiles).
- **Mute / unmute, camera on / off, screen share, in-meeting chat, raise hand, reactions.**
- **Host controls**: admit, remove, mute others, lock the meeting, hand over host.
- **Cloud recording** and **live captions / transcripts**.
- **Large meetings** of hundreds to about a thousand participants, and multi-region meetings (people in India,
  Europe and the US in one call).

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Latency** | Mouth-to-ear under ~150 ms within a region, under ~300 ms across the world | Above this, conversation breaks down |
| **Join time** | From click to hearing people in 2–3 s | First impressions; people retry or give up |
| **Availability** | 99.99% for joining; a media server failure should cost a few seconds of freeze, not a dropped meeting | Meetings are business-critical and scheduled; they cannot "come back later" |
| **Adaptivity** | Each receiver gets the best quality its own network and screen can handle | One person on weak 4G must not ruin the call for everyone |
| **Scale** | Hundreds of millions of participant-sessions a day; peak load concentrated in working hours | Zoom reported around 300 million daily meeting participants in April 2020 |
| **Security** | Media encrypted in transit; optional end-to-end encryption; no uninvited guests | Board meetings, doctor visits, classrooms |

### Out of scope

Webinars with 10,000+ view-only attendees (that is closer to live streaming), phone dial-in through the
telephone network, the persistent team-chat product, and whiteboards. Mention them, then set them aside.

## 4. Back-of-the-envelope estimates

Round numbers are fine; the goal is to find **what dominates**. It will be network bandwidth through the media
servers, by a wide margin.

**Assumptions:** 300 million participant-sessions a day, each **45 minutes** on average. About **half** of
participants have their camera on. Peak load is **3×** the daily average.

**Concurrency**

- Participant-hours per day: $300\text{M} \times 0.75\text{ h} = 225\text{M}$.
- Average concurrent participants: $225\text{M} / 24 \approx 9.4\text{M}$. At peak: about **28 million**.

**Bandwidth for one participant (camera on, gallery of 9 tiles)**

- **Uplink**: audio ~40 kbps, plus video sent as three quality layers (simulcast, section 10): 1.5 Mbps (720p) +
  0.5 Mbps (360p) + 0.15 Mbps (180p) ≈ **2.2 Mbps**.
- **Downlink**: the active speaker large at 720p (1.5 Mbps) + 8 small tiles at 180p ($8 \times 0.15 = 1.2$ Mbps)
  + the 3 loudest audio streams ($3 \times 40\text{ kbps} = 0.12$ Mbps) ≈ **2.8 Mbps**.
- So each camera-on participant pushes about **5 Mbps** through a media server. With cameras off, it is closer to
  0.2 Mbps. Averaging half and half: about **2.6 Mbps** per participant.

**Media server fleet**

- Peak traffic through media servers: $28\text{M} \times 2.6\text{ Mbps} \approx 73\text{ Tbps}$.
- Assume one media server can comfortably forward **10 Gbps** (in practice it is limited by packets per second
  and encryption CPU, not the network card). Servers needed: $73\text{ Tbps} / 10\text{ Gbps} \approx 7{,}300$.
- Add ~30% headroom for failover and spikes: about **10,000 media servers**, spread over a few dozen regions.
- Packets: at ~1,200 bytes per packet, 5 Mbps is about $5{,}000{,}000 / 9{,}600 \approx 520$ packets per second
  per camera-on participant, so a busy server moves around **a million packets per second**. That is why media
  servers are carefully tuned C/C++ or Rust programs, not ordinary web services.

**Storage (recording)**

- Assume 2% of meeting-hours are recorded, as one composed 720p video at about 1 Mbps (≈ 450 MB per hour).
- Meeting-hours per day: with an average of 5 people per meeting, $225\text{M} / 5 = 45\text{M}$. Recorded:
  $45\text{M} \times 2\% = 900{,}000$ hours, $\times 450\text{ MB} \approx 400\text{ TB per day}$.

Three conclusions follow:

1. **The media plane is the system.** Signalling, the database and the website are tiny next to tens of terabits
   per second of live packets.
2. **Never decode on the server if you can avoid it.** Transcoding 28 million streams would need a fleet many
   times larger.
3. **Put media servers close to users.** Every millisecond of distance is latency, and long-haul bandwidth is
   the most expensive kind.

## 5. The central decision: mesh, MCU or SFU

How should media travel between $n$ people? There are three classic shapes.

[![Three topologies with three people: in a mesh every peer sends to every other peer, 6 streams and no server; with an MCU each peer sends one stream and receives one mixed stream; with an SFU each peer sends one stream and the server forwards the others, receiving two](/img/system-design/zoom/01-topologies.png)](/img/system-design/zoom/01-topologies.png)

*Select the diagram to zoom in and move around.*

**Mesh (peer to peer).** Every participant sends their stream directly to every other participant. With $n$
people there are $n(n-1)$ one-way streams: 6 for 3 people, 90 for 10, 9,900 for 100. Each person **uploads**
$n-1$ copies. At 1.5 Mbps per copy, a 10-person mesh needs $9 \times 1.5 = 13.5$ Mbps of upload per person,
and their laptop must encode or at least encrypt 9 streams. Great for 1:1 calls (no server cost, lowest
latency), hopeless beyond 4–5 people.

**MCU (Multipoint Control Unit).** Everyone sends one stream to a server, which **decodes** all of them,
**composes** one picture (a grid) and one audio mix, **re-encodes** it and sends one stream back to each person.
Clients are simple: send 1, receive 1. But the server decodes $n$ streams and encodes up to $n$ outputs (each
person needs a mix without their own voice), which costs a lot of CPU, adds 50–200 ms of processing delay, and
forces one layout on everyone. MCUs still appear where clients are very weak, for example bridging old room
systems or phone calls.

**SFU (Selective Forwarding Unit).** Everyone sends one stream (or a few quality layers) to a server, which
**does not decode**. It reads only packet headers and **forwards** to each receiver the streams that receiver
wants. Server traffic is $n$ streams in and up to $n(n-1)$ out, but forwarding is cheap, so the bottleneck is
bandwidth, not CPU.

| | Mesh | MCU | SFU |
| --- | --- | --- | --- |
| Uploads per client | $n-1$ | 1 | 1 (or a few layers) |
| Downloads per client | $n-1$ | 1 | up to $n-1$ (in practice the visible ones) |
| Server CPU | none | very high (decode + mix + encode) | low (forward + re-encrypt hop) |
| Added latency | lowest | high | low |
| Per-receiver quality | hard | one size for all | yes, each receiver picks |
| Works with end-to-end encryption | yes | no (server must decode) | yes (server reads only headers) |
| Good for | 1:1 | legacy devices, phone bridges | almost everything else |

**Why SFUs dominate.** They combine the cheap server of a mesh with the cheap client of an MCU, keep latency low,
let every receiver get a different quality (sections 10 and 11), and still work with end-to-end encryption.
Modern services, Zoom included, are built around a forwarding architecture. A common refinement: start a 1:1
call peer to peer, and move it to an SFU when a third person joins.

## 6. The API

Two kinds of interface: a normal **REST API** for things that happen before and after a meeting, and a
**signalling channel** (a WebSocket) for everything that happens during one.

| Method and path | What it does |
| --- | --- |
| `POST /v1/meetings` | Schedule a meeting: topic, start time, recurrence, settings (waiting room, passcode). Returns `meeting_id` and join URL. |
| `GET /v1/meetings/{meeting_id}` | Meeting details for the host or an invitee. |
| `POST /v1/meetings/{meeting_id}/join` | Check passcode and permissions; returns a short-lived **join token** and the signalling server URL. |
| `POST /v1/meetings/{meeting_id}/recordings` | Start or stop cloud recording (also available as a signalling message). |
| `GET /v1/recordings/{recording_id}` | Recording status and a signed playback URL. |
| `WSS /v1/signal?token=...` | The signalling channel for one participant in one meeting. |

Messages on the signalling channel (JSON, each with a sequence number so a reconnecting client can resume):

| Message | Direction | Meaning |
| --- | --- | --- |
| `join` / `leave` | client → server | Enter or leave the meeting |
| `media_offer` / `media_answer` | both | SDP: which tracks and codecs, encryption fingerprints |
| `ice_candidate` | both | A possible network address for media |
| `subscribe {track, layer}` | client → server | "Send me Bob's video at 360p, Carol's at 180p" |
| `roster_delta` | server → client | Who joined, left, muted, raised a hand |
| `active_speaker` | server → client | Who is talking now |
| `chat` | both | In-meeting chat message |
| `host_action` | client → server | Mute all, remove, admit from waiting room, lock |

## 7. High-level design

[![High-level architecture: clients reach a web and API tier backed by a meeting database, a signalling service that asks a media allocator for a nearby SFU, and the SFU itself over SRTP on UDP, or through a TURN relay when UDP is blocked; SFUs in two regions are cascaded; recording workers write MP4 files and transcripts to an object store](/img/system-design/zoom/02-architecture.png)](/img/system-design/zoom/02-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Web + API tier:** accounts, scheduling, join authorisation. Ordinary stateless web servers.
- **Meeting DB:** meetings, settings, participants history, recordings index. Small and boring on purpose.
- **Signalling service:** holds a WebSocket per participant and the **live state of each meeting** (roster,
  who is muted, who is sharing, chat). All participants of one meeting are routed to the same signalling node,
  which makes it the single owner of that meeting's state.
- **Media allocator:** decides which media server (SFU) each participant should use, based on where they are and
  how loaded each server is.
- **SFUs (media plane):** receive, select and forward encrypted media. Deployed in many regions, close to users.
  When one meeting spans regions, SFUs **cascade** (forward to each other).
- **TURN relays:** the fallback path for networks that block UDP; often co-located with SFUs.
- **Recording workers and transcription:** join the meeting like a hidden participant, then write files to an
  **object store**.

The most useful idea in this design: **separate the control plane from the media plane.** Signalling is a few
messages per second per person and needs consistency (everyone must agree who the host is). Media is hundreds
of packets per second per person and needs speed above all. Keeping them apart lets each scale, fail and be
deployed on its own.

## 8. Flow: joining a meeting

Alice clicks the link to meeting 851.

[![Join sequence: Alice's app asks the API to join and gets a token; over the signalling WebSocket the signalling service asks the media allocator for an SFU near her and returns its address, ICE servers and the roster; the app runs ICE and DTLS with the SFU, publishes its microphone and camera as simulcast, and the SFU forwards others' streams](/img/system-design/zoom/03-join.png)](/img/system-design/zoom/03-join.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Authorise once, cheaply.** The API checks the passcode, waiting-room rules and whether Alice is allowed in,
  then gives her a **short-lived signed token**. Signalling and media servers verify the token's signature
  locally; they never call the database on the join path.
- **The allocator picks the SFU, not the client.** If the meeting is already live on `sfu-mumbai-07` and Alice is
  in Pune, she joins the same server. If she is in Berlin, she gets a server in Frankfurt that **cascades** to
  Mumbai (section 13).
- **ICE runs in parallel with everything else.** The app tries a direct UDP path to the SFU and the TURN
  fallback at the same time and keeps the first that works, so a blocked network costs milliseconds, not a
  timeout.
- **Audio first.** Clients start audio as soon as the path is ready and bring video up a moment later. Hearing
  people within two seconds feels fast even if video takes a little longer.
- **Roster updates are pushed, not polled.** Everyone else gets a `roster_delta` saying Alice joined.

## 9. Low-level design: meeting state and data model

### The meeting lifecycle

[![Meeting lifecycle: Scheduled, then Waiting for host when the first person joins, Live when the host starts, Ended when the host ends or everyone leaves; Live can move to Migrating when an SFU fails and back to Live when clients reconnect; a Scheduled meeting can be Cancelled](/img/system-design/zoom/04-lifecycle.png)](/img/system-design/zoom/04-lifecycle.png)

*Select the diagram to zoom in and move around.*

A **meeting** (the scheduled thing with an ID) is different from a **meeting instance** (one actual occurrence).
A weekly stand-up is one meeting with hundreds of instances. Live state belongs to the instance.

**Where live state lives.** The signalling node that owns an instance keeps its state **in memory** for speed:
roster, mute flags, who is sharing, the chat sequence counter. It also writes every change to a replicated
store (for example Redis with replication, or a small log) so that if the node dies, another node can load the
state and carry on. Ownership is decided by hashing `instance_id` to a node, with a lease so two nodes can never
both think they own a meeting.

### What we store

[![Data model: users host meetings; a meeting occurs as many meeting instances; each instance has participant sessions, produces recordings and contains chat messages](/img/system-design/zoom/05-data-model.png)](/img/system-design/zoom/05-data-model.png)

*Select the diagram to zoom in and move around.*

Notes on the design:

- **`meetings`** is ordinary relational data (sharded MySQL or Postgres is fine): it is read once per join and
  written when someone schedules. The passcode is stored hashed.
- **`participant_sessions`** records who joined, from where, on which SFU, for how long. It feeds billing,
  analytics, "who attended" reports and debugging ("why was Carol's call bad?"). It is append-heavy, so a
  wide-column store or a time-partitioned table works well.
- **`chat_messages`** is keyed by `(instance_id, seq)`; the signalling node assigns `seq`, so everyone sees chat in
  the same order. `to_user_id` is set for private messages.
- **`recordings`** points at files in the object store (`video_key`, `transcript_key`), never at bytes in the
  database.
- **No media is stored anywhere on the live path.** Media lives only in memory, for milliseconds, inside SFUs.

## 10. Deep dive: simulcast and SVC, one quality per receiver

An SFU forwards without decoding, so it cannot shrink Bob's 720p video for Carol on a weak phone. Two
techniques let it still give each receiver a suitable quality.

**Simulcast** (simultaneous broadcast): the sender's app encodes its camera **three times** at different
resolutions and bitrates, and uploads all three. The SFU then picks, separately for every receiver, which layer
to forward.

[![Simulcast: Alice's camera encodes 720p, 360p and 180p layers at about 1.5 Mbps, 500 kbps and 150 kbps; the SFU forwards 720p to Bob on fast fibre, 360p to Carol on weak 4G and 180p to Dave who shows Alice as a small thumbnail](/img/system-design/zoom/06-simulcast.png)](/img/system-design/zoom/06-simulcast.png)

The SFU chooses a layer for each receiver from two inputs:

1. **What the receiver can take**: its estimated downlink bandwidth (section 11).
2. **What the receiver needs**: a 180p thumbnail does not need 720p. The client tells the SFU the size of each
   tile with `subscribe` messages.

Switching layers must happen on a **key frame**, because the new layer's ordinary frames depend on earlier
frames of that same layer. The SFU asks the sender for a key frame on the target layer and switches the moment it
arrives.

**SVC** (Scalable Video Coding) gets the same result with **one** encoded stream built in layers: a base layer
(low frame rate, low resolution) plus enhancement layers that add frame rate or resolution on top. The SFU drops
the enhancement packets a receiver cannot use. Codecs such as VP9 and AV1 support it well.

| | Simulcast | SVC |
| --- | --- | --- |
| Sender work | Encode 2–3 independent streams | Encode one layered stream |
| Upload cost | Sum of all layers (~1.4× the top layer) | A bit more than the top layer alone |
| Switching quality | Needs a key frame on the new layer | Instant: just forward fewer layers |
| Codec support | Every codec | VP9, AV1 (and H.264 SVC extensions, less common) |

Both mean the **sender pays once and the SFU tailors per receiver**, which is exactly what an MCU does, but
without the server ever decoding a frame.

## 11. Deep dive: bandwidth estimation and congestion control

Nobody tells the system how fast a connection is, and it changes every second (someone starts a download, a
train enters a tunnel). If we send more than the path can carry, router queues fill, delay climbs, then packets
drop and the video breaks up. So the receiver and sender run a continuous **control loop**.

[![Bandwidth estimation loop: packets arrive with send times, the receiver measures the delay trend and loss, sends RTCP feedback, the bitrate is estimated; if the current layer fits, keep it or probe upward slowly; if not, the SFU switches the receiver to a lower layer, and if every receiver is low the sender cuts its bitrate](/img/system-design/zoom/07-bandwidth.png)](/img/system-design/zoom/07-bandwidth.png)

*Select the diagram to zoom in and move around.*

**The key signal is delay, not loss.** Waiting for packets to be lost means the queue is already full and the
call already hurts. Instead, the receiver compares when packets were sent with when they arrived. If the gap is
**steadily growing**, a queue somewhere is filling: back off now, before anything is lost. This is the idea
behind Google Congestion Control, which WebRTC uses, with per-packet arrival reports sent back over **RTCP**
(RTP's companion control protocol).

The loop, in plain words:

1. **Measure**: arrival times and loss for every packet.
2. **Feed back**: send reports to the sender (or SFU) several times a second.
3. **Estimate**: compute the bitrate the path can carry right now.
4. **Act**:
   - **Downlink too small** (a receiver's path): the SFU switches that receiver to a lower layer, or drops video
     tiles and keeps audio. Other receivers are unaffected.
   - **Uplink too small** (a sender's path): the sender stops sending its top layer, or lowers its bitrate and
     frame rate.
   - **Room to spare**: increase slowly (probe), and back off fast at the first sign of delay growth.
     Increase-slowly, decrease-quickly keeps the call stable.

**Priorities when bandwidth is short**, in order: audio of the active speaker, then other audio, then screen
share, then the speaker's video, then thumbnails. People forgive a frozen face; they do not forgive missing
words.

## 12. Deep dive: active speaker and large meetings

A 500-person meeting through a naive SFU would send each person 499 audio and 499 video streams. Nobody can
watch 499 videos, and no laptop can decode them.

**Active speaker detection.** Each audio packet carries a small **audio level** field in its RTP header (a
standard header extension), set by the sender. The SFU can therefore see how loud everyone is **without
decoding any audio**, which also works when media is end-to-end encrypted. It keeps a short moving average per
participant and:

- forwards only the **3 or so loudest** audio streams to each receiver (the rest are silence anyway),
- tells clients who the **active speaker** is, so speaker view can switch,
- uses **hysteresis** (the new speaker must be clearly louder for a short time) so a cough does not flip the
  big picture back and forth.

**Last-N video.** Each receiver gets video only for the tiles actually on its screen: the active speaker plus,
for example, a page of the gallery (Zoom's gallery view shows up to 49 tiles per screen). Turning the page sends
new `subscribe` messages. Everyone else exists only in the roster.

So with $n$ participants, each receiver gets roughly 3 audio streams and up to $N$ videos, **independent of
$n$**. SFU output becomes $n \times (3 + N)$ instead of $n(n-1)$: for 500 people and $N = 9$, 6,000 streams
instead of 249,500.

**The signalling storm.** Large meetings break the control plane too. If 1,000 people join in two minutes and
every join is pushed to everyone, that is about a million roster messages. Fixes: **batch** roster deltas (send
one update every 500 ms listing all changes), send the full participant list **on demand and paginated**, and
make big meetings span several signalling nodes with one owner and the others fanning out.

## 13. Deep dive: choosing and cascading media servers

**Choosing a region.** Clients are steered to a nearby data centre using **GeoDNS** or **anycast** (the same IP
address announced from many places, so the network delivers packets to the closest one), refined by quick
latency probes from the client. The allocator then picks a healthy, lightly loaded SFU in that region.

**One meeting, one server?** Simplest is to host each meeting on a single SFU. That breaks when:

- participants are far apart (an India–US round trip alone can be 200+ ms, so whoever is far from the server
  pays twice),
- the meeting is bigger than one server can serve.

**Cascading** solves both. Each participant connects to the SFU **nearest to them**, and the SFUs forward
streams to each other over the provider's backbone.

[![Cascading: six speakers in India send six streams to the Mumbai SFU, which sends each stream once to Frankfurt and once to Virginia; those SFUs fan out locally to 40 listeners in Europe and 50 in the US](/img/system-design/zoom/08-cascade.png)](/img/system-design/zoom/08-cascade.png)

The arithmetic is the whole point. Without cascading, Mumbai would send each of 6 streams to 90 distant people
across oceans: up to $6 \times 90 = 540$ long-haul streams. With cascading, each stream crosses each ocean
**once**: $6 \times 2 = 12$ long-haul streams, and the fan-out to 40 and 50 people happens locally on short,
cheap links. Users also get a better last mile: a lost packet is retransmitted from a server 20 ms away, not
200 ms away.

Design notes:

- The cascade link carries **all simulcast layers** (or SVC layers) of the streams anyone in the remote region
  needs, so the remote SFU can still tailor quality per receiver.
- Remote SFUs subscribe only to what their local users are watching; a stream nobody abroad is viewing never
  crosses the ocean.
- The **audio level** and active-speaker decisions travel with the streams, so every region switches speaker
  views together.
- Cascades are usually a tree with one origin per meeting; a full mesh between many regions is possible but
  harder to keep consistent.

## 14. Deep dive: recording and live transcription

[![Recording and transcription: a recording worker joins as a hidden participant and receives audio and video from the SFU; speech-to-text receives audio per speaker and sends live captions to participants and text segments to a transcript; after the call the streams are composed and encoded to MP4, and MP4 and VTT files go to the object store for a playback page](/img/system-design/zoom/09-recording.png)](/img/system-design/zoom/09-recording.png)

*Select the diagram to zoom in and move around.*

**Cloud recording.** The cleanest design is a **recording worker that joins like a hidden participant**. It
subscribes to the streams it needs (active speaker video, screen share, all audio) through the normal SFU
interface, so the media plane needs no special case. Two ways to produce the file:

- **Compose live**: the worker decodes and lays out the picture as it goes, like a mini MCU. The file is ready
  minutes after the meeting.
- **Store raw, compose later**: write each stream to disk as received (cheap, no decoding), then a batch job
  composes and encodes the MP4 after the call. Cheaper to run, and you can produce several layouts later.

Either way, finished files go to the **object store**, with a row in `recordings`; playback goes through a CDN
with signed URLs. Recording workers are stateful during a meeting, so if one crashes, a replacement joins and the
recording has a short gap rather than being lost entirely; writing in short chunks keeps the loss small.

**Live transcription.** A speech-to-text service subscribes to **audio, one stream per speaker**. Separate
streams make the transcript's "who said what" trivial, which is much harder from a mixed recording. A streaming
model returns partial text within about a second; captions go back to participants over signalling, and the
final segments, with speaker and timestamps, are stored as a transcript file (for example WebVTT) next to the
recording.

**Chat and screen share** fit the same pieces:

- **Chat** travels over the signalling WebSocket, is ordered by the owning node's sequence number, and is stored
  in `chat_messages` (and optionally saved with the recording).
- **Screen share** is just another video track, tuned differently: **high resolution, low frame rate** (often
  5–15 frames per second) because text must be sharp but slides change rarely. When bandwidth is short, it is
  protected ahead of camera video.

## 15. Deep dive: encryption and end-to-end encryption

**Default: encrypted in transit.** Media is encrypted between each client and the media server (SRTP, or in
Zoom's case its own protocol using AES-256-GCM). The server decrypts the outer layer, forwards, and re-encrypts
for each receiver. Anyone on the network sees only noise, but the **service operator could in principle access
the media**, which is what lets the server record, transcribe and mix.

**End-to-end encryption (E2EE).** The participants' devices hold the keys; servers only ever see ciphertext.
Zoom added an E2EE option in 2020. The building blocks:

- Each client has a key pair. The meeting key is generated by a client (for example the host's) and shared with
  each participant, encrypted to that participant's public key.
- Each media **frame** is encrypted with the meeting key before it is packetised. Packet headers (sequence
  number, timestamp, layer, audio level) stay readable, so an **SFU can still forward, pick layers and detect the
  active speaker**. The IETF standardised this frame-level approach as **SFrame**.
- When someone leaves, the key is **rotated** so they cannot decrypt what follows. In big meetings this rekeying
  is the hard part.
- Users can compare a short **security code** shown on everyone's screen to detect a man-in-the-middle.

**What you give up**, and why it is a trade-off not a default: anything that needs the server to see or hear the
content stops working. Cloud recording, live transcription done in the cloud, MCU-style phone dial-in, and joining
from devices that cannot run the client's crypto are disabled or moved to the device. Zoom's documentation lists
features such as cloud recording and live transcription as unavailable when E2EE is on. This is why E2EE is
usually opt-in for meetings.

## 16. Reliability: failures and how calls survive them

| Failure | What users would see | Defence |
| --- | --- | --- |
| An SFU crashes | Frozen video, silence | Clients notice missing media within ~1–2 s (and ICE consent checks fail); signalling reassigns them to another SFU, the client runs an **ICE restart**, and media resumes. The meeting state lives in signalling, so nothing else is lost |
| A signalling node crashes | Media keeps flowing (separate plane!), but roster and chat stall | Clients reconnect the WebSocket to the new owner, which reloads state from the replicated store and replays missed messages by sequence number |
| UDP blocked or a network change (Wi-Fi to 4G) | Cannot connect, or a drop | TURN over TCP/TLS 443; ICE restart on network change keeps the same meeting session |
| Packet loss or a bandwidth drop | Blocky video, robotic audio | Jitter buffer, NACK, FEC, concealment, and lower layers via bandwidth estimation |
| A region outage | Many meetings at once | The allocator stops placing meetings there; clients move to the next-nearest region; capacity is planned so a region's load fits elsewhere |
| Overload at 9:00 on Monday | Slow joins | Admission control in the allocator; pre-scaled capacity for known peaks; audio-only degradation before refusing anyone |

The pattern to remember: **the control plane remembers, the media plane forgets.** SFUs hold nothing that
cannot be rebuilt in seconds, so any SFU can die and clients simply reattach elsewhere.

## 17. What breaks as it grows, and how to fix it

**The hot meeting.** A company all-hands with 1,000 people overwhelms one SFU and one signalling node. *Fix:*
spread the meeting over several SFUs in the same region (cascaded), batch roster updates, last-N video, and
view-only attendees for very large events.

**The long-haul bill.** Global meetings without cascading send the same stream across oceans many times. *Fix:*
cascade, subscribe remotely only to what is viewed, and keep traffic on a private backbone where possible.

**The Monday-morning peak.** Meetings start on the hour, so joins arrive in sharp spikes. *Fix:* keep the join
path free of database calls (signed tokens, cached settings), pre-warm capacity before known peaks, and make the
allocator spread load instead of filling the "best" server first.

**Weak devices.** A cheap phone cannot decode nine HD streams. *Fix:* clients report their decoding capacity, and
the SFU sends fewer and smaller videos to them; audio always takes priority.

**Packets per second.** A media server can run out of CPU on packet handling long before its network card is full.
*Fix:* kernel-bypass networking, batching system calls, spreading meetings across cores, and keeping SFUs free
of any per-packet work beyond header reads and encryption.

## 18. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Transport for media | TCP | UDP (RTP) | **UDP**: late is lost; TCP's retransmit-and-wait adds unbounded delay. TCP/TLS only as a TURN fallback |
| Topology | Mesh or MCU | SFU | **SFU**: low server CPU, low latency, per-receiver quality, E2EE-compatible. Mesh for 1:1 is a fine optimisation |
| Adapting quality | Server transcodes | Simulcast or SVC | **Simulcast / SVC**: the sender encodes once, the SFU only selects |
| Loss repair | Retransmit everything | NACK + FEC + concealment | **Mixed**: retransmit only when there is time, FEC for audio, conceal the rest |
| Multi-region meetings | One SFU per meeting | Cascaded SFUs | **Cascade** for spread-out or large meetings: each stream crosses an ocean once |
| Meeting state | In a database | In memory on an owning node, replicated | **In memory + replicated log**: fast, single writer, recoverable |
| Encryption | Hop-by-hop (server can see media) | End-to-end | **Hop-by-hop by default, E2EE opt-in**: E2EE disables cloud features |

## Cheat sheet for last-minute revision

- **Live media: late = lost.** Budget ~150 ms mouth to ear. Use **UDP + RTP**, a **jitter buffer**, and repair
  loss with **NACK (when there is time), FEC and concealment**, never TCP-style waiting.
- **WebRTC words:** signalling (WebSocket, SDP offer/answer), **ICE** finds a path using **STUN** (your public
  address) and **TURN** (relay, TCP/TLS 443 fallback); **DTLS** agrees keys, **SRTP** encrypts packets; Opus for
  audio, H.264/VP8/VP9/AV1 for video.
- **Topologies:** mesh = $n(n-1)$ streams, each client uploads $n-1$ (only for 1:1); MCU = server decodes, mixes,
  encodes (CPU heavy, one layout); **SFU = server forwards without decoding** (the default).
- **Simulcast** (3 separate encodings) or **SVC** (one layered encoding): the SFU gives each receiver the layer
  its bandwidth and tile size need; switch on key frames.
- **Bandwidth estimation:** watch the **delay trend**, not just loss; RTCP feedback; back off fast, probe slowly;
  audio first, thumbnails last.
- **Large meetings:** audio levels in RTP headers → forward the ~3 loudest, active-speaker with hysteresis,
  **last-N video** for visible tiles, batched roster updates.
- **Architecture:** control plane (API, meeting DB, signalling that owns each meeting's state) separate from media
  plane (SFUs near users, TURN, **cascading** between regions).
- **Recording/transcription:** a hidden participant subscribes via the SFU; files to object storage; per-speaker
  audio makes transcripts easy.
- **E2EE:** frame-level encryption (SFrame-style) keeps headers readable so SFUs still work; you lose cloud
  recording and cloud transcription.
- **Numbers:** ~2.2 Mbps up and ~2.8 Mbps down per camera-on participant; ~28M peak participants → ~70 Tbps →
  roughly 10,000 media servers at 10 Gbps each with headroom.

## Practice questions

1. **Why not just use TCP and a big buffer, like Netflix?** Netflix can buffer 30 seconds because nobody is
   talking back. A conversation needs ~150 ms end to end; any buffer large enough to hide TCP's retransmission
   stalls is too large for a conversation.
2. **One participant's network suddenly drops to 300 kbps. What happens?** Their downlink estimate falls, so the
   SFU switches them to 180p layers or audio only for video tiles. If it is their uplink, their client stops
   sending the 720p and 360p layers; receivers who wanted those get 180p. Nobody else's quality changes.
3. **How would you add "raise hand" and reactions?** Small signalling messages to the meeting's owning node, which
   updates state and broadcasts a batched `roster_delta`. No media plane involvement.
4. **How do you handle a 1:1 call cheaply?** Try a direct peer-to-peer path with ICE first (no SFU bandwidth at
   all), use TURN if that fails, and move to an SFU when a third person joins.
5. **The host enables end-to-end encryption. Which parts of the design change?** Clients generate and distribute
   the meeting key and encrypt frames; SFUs keep forwarding using headers only; cloud recording, cloud
   transcription and phone dial-in are switched off; keys rotate when participants leave.
6. **How would you add phone dial-in?** A gateway that speaks the telephone network on one side and joins the
   meeting as a participant on the other. It must decode and mix audio (a small MCU for audio only), which is
   another reason that path is unavailable under E2EE.
