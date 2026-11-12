---
title: "Design WhatsApp (a chat application)"
description: "Design a WhatsApp-scale chat app: persistent connections, delivery receipts, offline inboxes, ordering, group fan-out, end-to-end encryption, media and presence."
difficulty: "Medium"
sidebar:
  label: "WhatsApp (chat application)"
tags: ["WebSockets", "Real-time sync", "Encryption", "Queues", "Storage"]
---

A chat app feels like the simplest product on your phone: type a line, press **Send**, and it pops up on your
friend's screen a moment later with two little ticks. Underneath, it is a system that keeps **hundreds of
millions of phones permanently connected**, routes each message to whichever server its recipient happens to be
on, **holds messages for people who are offline** without ever losing one, keeps messages **in order**, copies
group messages to hundreds of people, and does all of it while the servers **cannot read a single word**,
because the messages are end-to-end encrypted.

This case study builds that system from first principles. We start with why chat is different from an ordinary
web app, then design the service piece by piece, and finish with what breaks as it grows and a one-page
revision sheet.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Chat in 5 minutes: why it is not an ordinary web app

A normal website works by **pull**: your browser asks, the server answers, the connection is done. Chat needs
**push**: when Bob sends you a message, the server must tell *your* phone right away, even though your phone
did not ask for anything. That one difference shapes the whole design.

How can a server push to a phone? There are three classic answers:

| Technique | How it works | Verdict for chat |
| --- | --- | --- |
| **Short polling** | The app asks "anything new?" every few seconds | Wasteful: almost every answer is "no", and messages wait up to one polling interval |
| **Long polling** | The app asks, and the server holds the request open until something arrives (or ~30 s pass), then the app asks again | Works, but every message costs a new HTTP request and headers |
| **Persistent connection** (WebSocket or a long-lived TCP socket) | The app opens one connection when it starts and keeps it open; either side can send at any time | The standard choice: instant in both directions, tiny per-message overhead |

A few more terms we will use throughout:

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **WebSocket** | A protocol that upgrades an HTTP connection into a two-way, always-open channel | A phone call that stays connected, instead of sending letters |
| **Chat server** (or gateway) | A server whose job is to hold thousands of open connections and move messages over them | A switchboard operator with many lines plugged in |
| **Ack** (acknowledgement) | A short reply meaning "I have safely received message X" | Signing for a parcel |
| **Receipt** | A notice back to the sender: **sent** (one tick), **delivered** (two ticks), **read** (blue ticks) | Tracking updates for that parcel |
| **Inbox** (offline queue) | Messages waiting on the server for a device that is not connected | A post office box that holds mail while you are away |
| **APNs / FCM** | Apple Push Notification service and Firebase Cloud Messaging: the only reliable way to wake a sleeping phone app | A doorbell |
| **End-to-end encryption (E2EE)** | Messages are encrypted on the sender's phone and decrypted only on the recipient's; servers relay unreadable bytes | A locked box that only the recipient has a key to |

Two facts from this vocabulary drive every decision below:

1. **The chat servers are stateful.** Each one holds live connections, so "which server is Bob connected to?"
   is a real question that someone must answer for every message.
2. **The server is a relay, not a reader.** With end-to-end encryption, the server stores and forwards opaque
   bytes. It can see *who* talks to *whom* and *when*, but not *what*. Features like server-side search are
   therefore off the table.

## 2. Requirements

### Functional (what users can do)

- **1:1 messaging**: send text to another user; it arrives within a second if they are online.
- **Receipts**: the sender sees **sent**, **delivered** and **read** for each message.
- **Offline delivery**: if the recipient is offline, the message waits and is delivered, in order, when they
  come back. A phone notification tells them something arrived.
- **Group chats** of up to about a thousand members (WhatsApp's own cap has been raised over time and is
  1,024 at the time of writing).
- **Media**: photos, videos, voice notes and documents.
- **Multi-device**: one account used on a phone plus linked devices such as a laptop or web browser.
- **Presence**: "online", "last seen at 21:14", and "typing…".
- **End-to-end encryption** for all messages and media.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Latency** | Under ~500 ms end to end when both people are online; ideally around 100–200 ms within a region | It must feel like a conversation |
| **Reliability** | Never lose a message the server has acknowledged; never show a message twice | A lost "I'm on my way" is worse than a slow one |
| **Ordering** | Messages in a chat appear in the same order for everyone | Replies that jump ahead of their question are confusing |
| **Availability** | 99.99%; a server crash should cost a reconnect, not a message | People rely on chat for everything from family to work |
| **Scale** | ~2 billion users, ~1 billion daily active, hundreds of millions connected at once | WhatsApp-sized |
| **Privacy** | E2EE; store as little as possible, for as short a time as possible | Messages are among the most private things people write |
| **Battery and data** | Small frames, few wake-ups | Most users are on phones, many on slow or expensive networks |

### Out of scope

Voice and video calls (they use a separate real-time media stack), status/stories, payments, channels and
business APIs, spam detection, and the composer UI. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** 1 billion daily active users. Each sends **40** messages a day. An average text message,
encrypted and wrapped in its envelope (IDs, timestamps, routing), is about **1 KB**. **10%** of messages carry
media averaging **200 KB**. At peak, **half** of daily users are connected at the same time. Peak traffic is
about **3×** the average.

**Messages**

- Sent per day: $1\text{B} \times 40 = 40\text{B}$.
- Per second: $40\text{B} / 86{,}400 \approx 460{,}000$ on average, about **1.4 million per second** at peak.
- Every message also produces about two receipts (delivered, read), so the receipt traffic is roughly twice the
  message traffic. Small frames, but a lot of them.

**Connections**

- Concurrent connections at peak: $1\text{B} \times 50\% = 500\text{M}$ open sockets.
- If one chat server holds **500,000** connections, we need $500\text{M} / 500\text{K} = 1{,}000$ servers, plus
  spare capacity. At 100,000 per server it is 5,000 servers. The number of connections per machine is one of
  the most important tuning knobs in the whole system. (WhatsApp's engineers, who use Erlang, once publicly
  reported holding around two million connections on a single server.)
- Memory: if each idle connection costs ~20 KB (TLS state, buffers, session data), 500,000 connections need
  about **10 GB** of RAM on one server. Memory, not CPU, is usually the limit.

**Storage**

- Text written per day: $40\text{B} \times 1\text{ KB} = 40\text{ TB}$. If we kept every message forever, that is
  roughly **15 PB a year** before replication. A WhatsApp-style design **deletes messages from the server once
  they are delivered**, so the inbox only ever holds what is still in flight: usually a tiny fraction of a day.
- Media per day: $40\text{B} \times 10\% \times 200\text{ KB} = 800\text{ TB}$. Media is **20 times** the text
  volume, so it gets its own path (object storage and a CDN) and its own retention rules.

**Bandwidth**

- Media uploads: $800\text{ TB} / 86{,}400 \approx 9\text{ GB/s}$, about 75 Gbit/s on average, and more for
  downloads because one photo in a group is downloaded by many members.

Three conclusions follow:

1. **Connections are the scarce resource**, not storage. The chat tier must hold hundreds of millions of
   mostly idle sockets cheaply.
2. **Messages are small and short-lived on the server.** Store them durably until delivered, then delete.
3. **Media dominates bytes.** It must never flow through the chat servers.

## 4. The API

Most of the traffic flows over **one persistent connection** per device. Over it, client and server exchange
small typed **frames**. Real systems use a compact binary encoding; we show JSON for readability.

| Frame (direction) | What it does |
| --- | --- |
| `send` (client → server) | `{"id": "m42", "to": "bob", "chat": "c7", "body": "<ciphertext>"}`. `id` is chosen by the client (see section 9). |
| `ack` (server → client) | "I have stored `m42`": the sender shows **one tick**. |
| `deliver` (server → client) | A new message for this device, with its inbox sequence number. |
| `ack` (client → server) | "I have stored everything up to sequence 1044": the server may delete those. |
| `receipt` (both ways) | `{"id": "m42", "type": "delivered" \| "read"}`, routed back to the sender. |
| `typing`, `presence` (both ways) | Short-lived signals; never stored (section 12). |
| `ping` / `pong` | Heartbeats that keep the connection alive through mobile networks and NAT routers. |

A few operations are ordinary HTTPS requests, because they are request/response by nature:

| Method and path | What it does |
| --- | --- |
| `POST /v1/media/upload-url` | Returns a short-lived, pre-signed URL; the app uploads the encrypted file straight to object storage. |
| `GET /v1/keys/{user_id}` | Fetch a user's public key bundle to start an encrypted session (section 11). |
| `POST /v1/keys` | Upload this device's public prekeys. |
| `POST /v1/devices/link` | Link a new device (laptop, web) to the account. |
| `POST /v1/groups`, `PATCH /v1/groups/{id}/members` | Create a group, add or remove members. |
| `PUT /v1/push-token` | Register this device's APNs or FCM token. |

Why not send messages over HTTP too? Every HTTP request carries headers, and on mobile networks a new request
can mean a new TLS handshake. On an open socket a message is a few hundred bytes with no setup cost, and the
server can push the reply on the same connection.

## 5. High-level design

[![High-level architecture: phones connect through a load balancer to chat servers that hold live sockets; chat servers look up the session and presence registry, read group member lists, store messages in the inbox until delivered and hand offline recipients to the notification service, which wakes apps through APNs and FCM; media is uploaded through a media service to an object store and downloaded through a CDN; a key server holds only public prekeys](/img/system-design/whatsapp/01-architecture.png)](/img/system-design/whatsapp/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Load balancer:** terminates or passes through TLS and spreads **new connections** across chat servers. It
  works at the connection level (layer 4), because once a socket is open, every frame on it goes to the same
  server.
- **Chat servers:** hold the open sockets. They receive frames, store messages, look up where recipients are,
  forward messages to other chat servers, and push frames down to devices.
- **Session + presence registry:** a fast in-memory key-value store (for example Redis) answering "which chat
  server is this device connected to?" and "when was this user last online?".
- **Message inbox:** a durable, replicated store holding each device's undelivered messages, in order.
- **Group service:** owns group membership and answers "who is in group `g9`?".
- **Notification service:** for recipients with no live socket, asks APNs (iPhone) or FCM (Android) to wake the
  app.
- **Key server:** stores each device's **public** keys so others can start encrypted sessions. Private keys
  never leave the phone.
- **Media service, object store and CDN:** media goes around the chat path entirely: upload to object storage,
  download through a content delivery network (CDN), a fleet of caches close to users.

The single most useful idea in this design: **separate the connection layer from everything else**. Chat
servers are thin, stateful switchboards. Durable state lives in the inbox and the registry, so any chat server
can crash and its users simply reconnect somewhere else.

## 6. Flow 1: a 1:1 message while both are online

Alice sends "On my way" to Bob. Alice is connected to chat server A; Bob happens to be on chat server B.

[![Sequence of a 1:1 message: Alice's phone sends m42 to chat server A, which appends it to Bob's inbox and acks Alice (one tick); server A asks the session registry where Bob is, forwards m42 to chat server B, which pushes it to Bob's phone; Bob acks, server B deletes m42 from the inbox and sends a delivered receipt back to Alice (two ticks); the read receipt later follows the same path](/img/system-design/whatsapp/02-one-to-one.png)](/img/system-design/whatsapp/02-one-to-one.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Store first, then ack.** Server A writes the message to Bob's inbox (step 2) *before* telling Alice "sent"
  (step 4). If server A crashes right after the write, the message is safe; if it crashes before, Alice never got
  the ack and her phone resends. The ack means "the server is now responsible for this message".
- **The registry lookup is the routing step.** Chat servers do not broadcast to each other; they ask the
  registry and forward to exactly one server. Server-to-server forwarding is a direct internal call (or a
  per-server queue), not a trip back through the internet.
- **"Delivered" means a device stored it**, not that the server sent it. Bob's phone must ack (step 9) before
  Alice sees two ticks. The ack is also what lets the server delete its copy (step 10).
- **Receipts are just small messages.** A read receipt travels Bob → B → A → Alice like any message, and is
  stored in Alice's inbox if Alice is offline. Users can turn read receipts off, in which case Bob's app simply
  does not send them.

The sender's view of a message is a small state machine:

[![Life of one message as the sender sees it: Pending (clock icon) becomes Sent on the server ack, Delivered on a device ack and Read when the chat is opened; with no ack in time it goes to Retrying with the same message id and back to Sent; a message whose recipient stays offline too long expires](/img/system-design/whatsapp/03-message-states.png)](/img/system-design/whatsapp/03-message-states.png)

*Select the diagram to zoom in and move around.*

The **Retrying** state is why the client chooses the message ID. A resend carries the *same* `id`, so if the
first attempt actually reached the server and only the ack was lost, the server recognises the duplicate and
just acks again. Bob never sees the message twice.

## 7. Flow 2: the recipient is offline

Most of the time the recipient is *not* connected: the phone is in a pocket, the app is suspended, the train
is in a tunnel. This is where the inbox earns its keep.

[![Offline delivery: Alice sends m43, the chat servers append it to Bob's inbox as sequence 1044 and ack Alice (one tick); the registry shows Bob has no live socket, so a notification without message text goes through APNs or FCM to wake Bob's phone; Bob reconnects saying his last sequence is 1041, receives 1042 to 1044 in order, acks up to 1044, the inbox is trimmed and Alice sees delivered](/img/system-design/whatsapp/04-offline.png)](/img/system-design/whatsapp/04-offline.png)

*Select the diagram to zoom in and move around.*

How the inbox works:

- Each **device** has an inbox: an append-only list of messages with an increasing **sequence number**
  (1042, 1043, 1044…). The sequence number belongs to the inbox, not to the conversation, so it says exactly
  what this device has and has not received.
- The device remembers the last sequence it has stored. On reconnect it says "I have everything up to 1041",
  and the server streams 1042 onwards **in order**. This is the same "changes since N" idea that email sync
  uses.
- After the device acks "up to 1044", the server **deletes** those entries. The inbox is a queue, not an
  archive: it stays small, and the server does not keep a history of anyone's conversations.
- If a device never comes back, messages cannot wait forever. A typical design expires undelivered messages
  after a fixed period (WhatsApp documents 30 days) and the sender keeps one tick.
- **The push notification carries no message text** in this design: it is a doorbell that wakes the app,
  which then connects and pulls from the inbox. (An app can also send the encrypted message in the push
  payload and decrypt it on the phone; either way, Apple and Google never see plaintext.)

The same inbox serves online users too: in Flow 1 the message was appended to Bob's inbox *and* pushed over
his socket. Online delivery is just the fast path; the inbox is the safety net that makes delivery reliable
whichever path succeeds.

## 8. Deep dive: holding hundreds of millions of connections

### Why connections are hard

An open socket is cheap when idle, but it is **state**: it lives on one specific machine. That causes three
problems that ordinary stateless web servers never have.

**1. Finding a user.** Every connect writes `device → chat server` into the registry; every clean disconnect
deletes it. Entries also carry a **time-to-live (TTL)**, refreshed by heartbeats, so a server that dies
without cleaning up does not leave stale routes forever. A message for a device with no entry goes to the
inbox and the notification service.

**2. Keeping connections alive.** Mobile networks and home routers silently drop connections that look idle
(they forget the mapping in their NAT table). The client sends a small `ping` every so often (for example
every 15–30 seconds); the server answers `pong`. If either side misses several, it treats the connection as dead.
Heartbeats are a balance: frequent enough to keep the path open and detect failures, rare enough to save battery.

**3. Servers come and go.** When a chat server crashes or is deployed, all of its connections drop at once.

- The clients reconnect through the load balancer to other servers, and **re-register** in the registry.
- Nothing is lost, because every acknowledged message is already in an inbox, and every unacknowledged one is
  still on the sender's phone, waiting to be retried.
- To avoid a **thundering herd** (half a million phones reconnecting in the same second), clients wait a random,
  growing delay before retrying (**exponential backoff with jitter**), and deploys **drain** servers gradually:
  stop accepting new sockets, then close existing ones in small batches.

### Why Erlang shows up in this story

WhatsApp is well known for running its chat servers on **Erlang**, a language built at Ericsson for telephone
switches. Its runtime can host millions of lightweight processes on one machine (one per connection), isolates
their failures, and was designed for exactly this job: many long-lived, mostly idle conversations. You do not
need Erlang to build chat (Go, Java with Netty, Rust and C++ all work), but the design goal is the same:
**one cheap, isolated unit of work per connection**, with memory per connection kept small.

### Scaling the chat tier

- **Scale out by connections.** Add chat servers when connections per server or memory gets high. The load
  balancer sends new connections to the least-loaded servers.
- **Partition the registry.** Hash the user ID to pick a registry shard; each shard is replicated. It is read on
  every message, so it must be in memory.
- **Go regional.** Users connect to the nearest data centre. A message between continents is forwarded between
  regions over the provider's own backbone; the registry tells server A which region (and server) Bob is in.
- **Keep chat servers thin.** Anything slow (media processing, group expansion for big groups, analytics) goes
  to queues and worker pools, so a slow dependency never stalls the sockets.

## 9. Deep dive: message IDs and ordering

"In order" sounds simple until you ask: in order **according to whom**? Phones' clocks are wrong, messages
take different paths, and two people can press Send at the same instant.

We use **two different identifiers**, for two different jobs:

| Identifier | Who creates it | Job |
| --- | --- | --- |
| `message_id` (random, 128-bit, for example a UUID) | The **sender's phone**, before sending | **Deduplication.** A retry carries the same ID, so the server and the recipient can drop duplicates. |
| `seq` (increasing integer) | The **server**, when it appends to an inbox or a group log | **Ordering and sync.** Strictly increasing per inbox, so "give me everything after 1041" is exact. |

What ordering do we actually guarantee?

- **Per sender, per chat: strict order.** Alice's messages to Bob arrive in the order she sent them. Her phone
  sends them over one connection, the server appends them to Bob's inbox in arrival order, and the inbox is
  delivered in sequence order. If a message is retried, the app does not send the next one until the earlier
  one is acked (or it sends them with their own sequence numbers so the server can put them back in order).
- **Between two senders in a 1:1 chat: arrival order at the server.** If Alice and Bob both send at the same
  instant, each sees their own message first for a moment; when the server assigns order, the apps settle on it.
  This is acceptable for chat, and nobody can do better without making one of them wait.
- **In a group: one order for everyone.** Each group has a log owned by one place (the shard that owns the
  group), and that owner stamps every message with the next group sequence number. All members then sort by it,
  so everyone sees the same conversation.

Why not just sort by timestamp? A phone whose clock is five minutes fast would put its messages in the future.
Server timestamps are better but differ slightly between servers. Timestamps are fine for **display** ("21:14");
a single sequencer is what gives a **reliable order**. (Time-ordered IDs such as Twitter's Snowflake scheme
combine both: a timestamp in the high bits plus a counter, so sorting by ID is roughly chronological.)

## 10. Deep dive: group chats

When Alice writes to a 200-person group, who copies the message 200 times, and when?

[![Group message fan-out on write: Alice's phone encrypts once, the chat server stores one copy and reads the group member list, then a fan-out queue creates one job per member; online members' chat servers route it to their phones, which decrypt locally; offline members get a pointer in their inbox and a push notification](/img/system-design/whatsapp/05-group-fanout.png)](/img/system-design/whatsapp/05-group-fanout.png)

*Select the diagram to zoom in and move around.*

### Fan-out on write vs fan-out on read

| | **Fan-out on write** (push) | **Fan-out on read** (pull) |
| --- | --- | --- |
| How | When the message arrives, put a reference to it in **every member's inbox** and push to online members | Store the message **once in the group's log**; each member keeps a cursor and pulls "messages after N" |
| Reads | Cheap: each device just drains its own inbox | Each device must check every group it is in |
| Writes | One message → *N* inbox writes | One message → one write |
| Good for | Small and medium groups (up to a few thousand) where members want instant delivery | Huge audiences: broadcast channels, communities with 100,000 followers |

A chat app with a group cap around a thousand uses **fan-out on write**: 1,000 small writes are cheap and give
every member the same instant, push-based delivery as 1:1 chat. Two tricks keep it efficient:

- **Store the body once, fan out pointers.** Each inbox entry is a small reference to the stored message, not a
  copy of it.
- **Fan out asynchronously.** The chat server stores the message, acks Alice, and hands fan-out to a queue and
  worker pool. A burst into a large group then cannot stall Alice's connection.

For very large audiences, systems switch to **fan-out on read**, or a **hybrid**: push to members who are
online right now, and let everyone else pull from the group log when they open the app. The same hybrid is
used by social feeds for celebrity accounts.

### Group receipts

In a group, "delivered" and "read" mean "delivered to / read by **everyone**". The server (or Alice's app)
counts receipts per member; the ticks change only when the last member's receipt arrives. "Message info"
shows the per-member list.

### Encryption in groups (sender keys)

With pairwise encryption, a 200-member group would make Alice encrypt every message 200 times. The Signal
protocol's **sender keys** avoid that: each member creates a group key for *their own* messages and sends it
once to each other member over their existing pairwise encrypted sessions. After that, Alice encrypts each
group message **once** with her sender key, and the server fans out the single ciphertext. When someone leaves
the group, everyone rotates to new sender keys so the leaver cannot read future messages.

## 11. Deep dive: end-to-end encryption (the idea)

The goal: only Alice's and Bob's devices can read their messages. Not the chat servers, not the database, not
an attacker who breaks in, not the company itself. WhatsApp uses the **Signal protocol** for this; here is the
idea without the maths.

[![End-to-end encryption: at install Bob's phone uploads its public identity key and prekeys to the key server; for the first message Alice fetches Bob's key bundle, derives a shared secret on her phone and sends ciphertext plus her public keys through the chat server, which cannot decrypt it; Bob derives the same secret and decrypts; every later message moves the keys forward (the ratchet)](/img/system-design/whatsapp/06-e2ee.png)](/img/system-design/whatsapp/06-e2ee.png)

*Select the diagram to zoom in and move around.*

Step by step:

1. **Keys are born on the device.** At install, each device generates a long-term **identity key pair** and a
   batch of one-time **prekeys**. The private halves never leave the phone. The public halves are uploaded to
   the key server, which is just a directory: knowing public keys does not let you decrypt anything.
2. **Starting a session works even if Bob is offline.** Alice downloads Bob's public **key bundle** and combines
   it with her own keys (a key agreement called X3DH, built on Diffie-Hellman). Diffie-Hellman's trick is that
   two parties can each compute the **same secret** from their own private key and the other's public key, while
   someone who sees only the public keys cannot. Bob's one-time prekey is used once and then deleted from the
   server, which is why Bob's phone tops them up from time to time.
3. **Every message gets a fresh key (the ratchet).** From the shared secret, both phones derive a new message
   key for every message and throw old ones away. If an attacker steals today's key, they cannot read yesterday's
   messages (**forward secrecy**), and the session heals itself after new keys are exchanged.
4. **You can check you are talking to the right person.** The "security code" (a QR code or 60 digits) is a
   fingerprint of both identity keys. If it matches on both phones, no one swapped keys in the middle.

What this means for the system design:

- The server stores and forwards **ciphertext only**. It still sees metadata: sender, recipient, time, size.
- **No server-side search, no server-side history.** Search runs on the phone over its local database.
  Backups are the phone's job (optionally encrypted with a key only the user knows).
- **Multi-device means multi-encryption** (section 13): each device has its own keys, so the sender encrypts
  once per recipient device.
- **Media is encrypted too**, with a separate key that travels inside the encrypted message (next section).

## 12. Deep dive: media, presence and typing

### Media: send a pointer, not the bytes

[![Sending a photo: Alice's phone, which has already encrypted the photo with a random key K, asks the media service for an upload URL, uploads the encrypted blob straight to the object store, then sends an end-to-end encrypted message holding the media id, K, a hash and a thumbnail through the chat server; Bob downloads the blob through the CDN, which fetches it from the object store on a miss, checks the hash and decrypts with K](/img/system-design/whatsapp/07-media.png)](/img/system-design/whatsapp/07-media.png)

*Select the diagram to zoom in and move around.*

- **Encrypt, then upload.** The phone encrypts the file with a fresh random key `K` and uploads the encrypted
  blob directly to object storage using a **pre-signed URL** (a link that allows one upload, for a few minutes).
  The chat servers never touch the megabytes.
- **The key travels in the message.** The chat message carries the media ID, `K`, a hash of the encrypted file
  (so Bob can detect tampering or corruption), and a tiny blurred thumbnail so the chat shows something at once.
- **Download through a CDN.** Bob's phone fetches the blob from a nearby CDN cache; only the first download in a
  region goes back to the object store. In a 500-person group, that saves the origin 499 downloads.
- **Retention.** Since the server cannot see the photo, it cannot do anything useful with it after delivery.
  A typical design keeps media for a limited time, long enough for every recipient to download it, then deletes
  it. Forwarding an already uploaded file can reuse the same blob (same ID and key), which saves re-uploading
  viral videos millions of times.
- **Large files** use **resumable, chunked uploads**, so a dropped connection resumes instead of restarting.

### Presence: "online" and "last seen"

Presence is the user's connection state, tracked by the server:

[![Presence of one user: Connecting becomes Online when authentication succeeds; if no ping arrives within 30 seconds it becomes Unsure, then Offline when the grace period ends (last seen is recorded), or back to Online if pings resume; a clean socket close goes straight to Offline, and opening the app again starts Connecting](/img/system-design/whatsapp/08-presence.png)](/img/system-design/whatsapp/08-presence.png)

*Select the diagram to zoom in and move around.*

- The **Unsure** state is a grace period. Phones switch between Wi-Fi and mobile data constantly; without it,
  contacts would see you flicker between online and offline.
- On going offline, the server writes `last_seen_at`. Privacy settings decide who may see it.
- **Do not broadcast presence to everyone.** A user with 500 contacts going online would generate 500 updates,
  and at a billion users that is a storm of messages nobody looks at. Instead, presence is **subscribed on
  demand**: when Bob opens his chat with Alice, his app subscribes to Alice's presence, and unsubscribes when he
  leaves the screen. Only people actually looking get updates.
- Presence lives in the in-memory registry with a TTL. It is **soft state**: if it is lost, the next heartbeat
  rebuilds it, so it does not need a durable database.

### Typing indicators

"typing…" is the most ephemeral data in the system: it is useful for a few seconds and worthless after.

- It is sent only to the people in the open chat, **never stored**, never queued for offline users, and never
  retried. If it is lost, nothing is lost.
- The app sends "typing" at most every few seconds while keys are pressed, and the indicator **expires on its
  own** (for example after 5 seconds) unless refreshed, so a crash never leaves someone "typing" forever.

## 13. Deep dive: multi-device and push notifications

### Multi-device

In the old model the phone was the only real device, and the web app was a window onto it. Modern multi-device
(WhatsApp, for example, lets you link up to four companion devices) gives **every device its own identity
keys** and its own inbox.

- **The sender encrypts per device.** To message Bob, who has a phone and a laptop, Alice's app encrypts the
  message twice, once for each of Bob's devices, and also for Alice's own other devices so her laptop shows the
  sent message. This is **client-side fan-out**: the server just delivers each copy to the right device inbox.
- **The device list is part of the key bundle.** Alice's app fetches the list of Bob's devices with their keys,
  and caches it. When Bob links or removes a device, the list changes and Alice's app picks it up.
- **History for a new device.** The server has no history to give (it deleted delivered messages, and could not
  read them anyway). The primary phone sends an encrypted bundle of recent history to the newly linked device.
- **Receipts and read state sync between your devices** as small encrypted messages, so reading on the laptop
  clears the unread badge on the phone.

### Push notifications

Phones aggressively suspend background apps, so an open socket cannot be relied on when the screen is off.

- When the registry has no live connection for a device, the notification service sends a push through **APNs**
  or **FCM** using the device's push token.
- Pushes are **collapsed and rate-limited**: 50 messages in a busy group should produce one notification, not 50
  vibrations.
- Muted chats still deliver messages but send no visible notification.
- A push is a hint, not a delivery. It can be delayed or dropped; the inbox sync on reconnect is what
  guarantees the message arrives.

## 14. Low-level design: the data model and storage choices

[![Data model: groups have group_members; users create groups and join them; users have devices; devices publish prekeys and have pending inbox entries keyed by user_id, device_id and seq, each holding a unique message_id, the sender, the chat and the ciphertext](/img/system-design/whatsapp/09-data-model.png)](/img/system-design/whatsapp/09-data-model.png)

*Select the diagram to zoom in and move around.*

Design decisions hidden in this diagram:

**1. The inbox is keyed by device, then sequence.** The key `(user_id, device_id, seq)` makes the two hot
operations trivial: *append* at the end, and *read everything after N* as one sequential range scan. All of a
device's pending messages live in one partition, on one set of replicas.

**2. `message_id` is unique.** The delivery path checks it before inserting, so a retried send cannot create a
second copy. This is how we get "never twice" on top of "at least once" delivery.

**3. The inbox is a queue, so it stays small.** Rows are deleted after the device acks them, with a TTL as a
backstop. Deletes create **tombstones** (markers that the data was removed) in wide-column stores like
Cassandra, so a real design trims in batches ("delete everything up to seq 1044" as one range delete) and tunes
compaction for a queue-like workload.

**4. Users, devices and groups are small, hot metadata.** They are read on every message (whose devices? which
members?) and change rarely, so they are cached heavily.

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Inbox (pending messages) | Append, range-read, delete; partitioned by device | Wide-column store (Cassandra, ScyllaDB, HBase) or a replicated log | Fast appends and range scans on a sorted key; scales horizontally |
| Session registry, presence | Tiny, very hot, soft state with TTL | In-memory key-value store (Redis, Memcached-style) | Read on every message; can be rebuilt from heartbeats |
| Users, devices, groups, members | Small rows, read-heavy | Sharded SQL (MySQL, Postgres) or a key-value store, plus a cache | Relationships and uniqueness (one account per phone number) |
| Public keys | Key-value by `(user_id, device_id)` | Key-value store | Simple lookups; one-time prekeys are popped and deleted |
| Media | Immutable encrypted blobs, KB to GB | Object storage + CDN, with expiry | Cheapest per byte; edge caching for group downloads |
| Fan-out jobs, push jobs | Ordered, durable work | A message queue (Kafka or similar) | Absorbs bursts; lets workers scale separately |

**If the product keeps history on the server** (like Slack, Discord or Telegram's cloud chats, which do not
use end-to-end encryption by default), the main table changes: messages are stored **once per chat**, keyed by
`(chat_id, time bucket, message_id)` so a chat's recent history is one range scan, and devices fetch history by
paging backwards. Storage then grows by tens of terabytes a day and becomes the dominant cost. That is a good
point to raise in an interview: the privacy choice changes the storage design.

## 15. Reliability: how we never lose (or duplicate) a message

| Risk | Defence |
| --- | --- |
| Chat server crashes after receiving a message | Ack the sender only after the message is in a **replicated** inbox; without an ack, the phone retries |
| The ack is lost and the phone retries | Same `message_id` on the retry; the inbox rejects the duplicate and the server acks again |
| Recipient's phone crashes before storing a message | The server deletes only what the device has **acked**; unacked messages are redelivered on reconnect |
| Chat server dies with 500,000 sockets | Clients reconnect elsewhere with jittered backoff; stale registry entries expire by TTL |
| Push notification is lost | Not a problem: the next app open syncs the inbox from the last acked sequence |
| A whole region fails | Inbox and metadata are replicated across zones and regions; clients reconnect to another region |
| A burst into a large group | Fan-out goes through a queue; workers drain it at their own pace while senders get acked at once |

The pattern to remember: **at-least-once delivery + idempotent receivers = effectively exactly once.** Every
hop retries until it gets an ack, and every receiver drops IDs it has already seen.

## 16. What breaks as it grows, and how to fix it

**The reconnect storm.** A network blip or a bad deploy drops millions of sockets at once; they all reconnect
in the same second and overload the load balancers, authentication and the registry. *Fix:* exponential
backoff with jitter on clients, slow draining during deploys, and connection-rate limits on each chat server.

**The hot registry key.** Every message does a registry lookup, so the registry carries more reads than any
other store. *Fix:* shard it by user, replicate each shard, and let chat servers cache "Bob is on server B"
briefly, falling back to the inbox if the forward fails.

**The giant group.** A message to 1,000 members is 1,000 inbox writes and up to 1,000 pushes; a lively group
can produce dozens a minute. *Fix:* pointer fan-out through a queue, collapsed notifications, and fan-out on
read (or hybrid) for anything channel-sized.

**The long-offline user.** Someone returns after three weeks to thousands of pending messages. *Fix:* deliver
the inbox in pages, newest chats first if the client asks, with a cap and an expiry so inboxes cannot grow
without bound.

**The media bill.** Hundreds of terabytes a day. *Fix:* uploads straight to object storage, CDN for downloads,
reuse of forwarded blobs, client-side compression of photos and videos before upload, and deletion after
delivery or expiry.

**The presence storm.** Broadcasting every online/offline change to every contact grows with users times
contacts. *Fix:* subscribe-on-view presence, a grace period before "offline", and batching.

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| How to push | Long polling | Persistent WebSocket / TCP | **Persistent socket**: instant, tiny per-message cost, works both ways |
| When to say "sent" | After the recipient has it | After stored durably on the server | **Stored**: the recipient may be offline for days |
| Server-side history | Keep every message | Delete after delivery | **Delete** (E2EE design): less to store, less to leak; history lives on devices |
| Who orders messages | Client timestamps | Server sequence numbers | **Server sequence**: clocks lie; one sequencer per inbox or group |
| Group delivery | Fan-out on write | Fan-out on read | **Write** for groups up to ~1,000; **read** or hybrid for huge channels |
| Group encryption | Encrypt per member | Sender keys | **Sender keys**: encrypt once, fan out one ciphertext |
| Presence | Broadcast to all contacts | Subscribe while the chat is open | **Subscribe**: cost grows with viewers, not with contacts |
| Media path | Through chat servers | Pre-signed upload + CDN | **Direct to object storage**: keeps chat servers small and fast |

## Cheat sheet for last-minute revision

- **Push, not pull:** each device keeps **one persistent connection** (WebSocket or TCP) to a stateful **chat
  server**; a layer-4 load balancer spreads new connections.
- **Registry:** in-memory map `device → chat server` with TTL, refreshed by heartbeats. Routing = look up, then
  forward to exactly one server.
- **Golden rule:** store in the recipient's **inbox**, *then* ack the sender (one tick). Device ack → delivered
  (two ticks) → delete from inbox. Read receipt (blue) travels like a message.
- **Offline:** inbox per device with increasing `seq`; on reconnect "give me everything after N"; push via
  APNs/FCM is only a doorbell. Undelivered messages expire (for example 30 days).
- **IDs:** client-made `message_id` for dedup; server-made `seq` for order. Per-sender order is strict; groups
  get one order from a single sequencer per group.
- **Groups:** fan-out on write (pointers through a queue) for groups up to ~1,000; fan-out on read or hybrid for
  huge channels. Sender keys: encrypt once.
- **E2EE (Signal protocol):** private keys stay on devices; key server holds public prekeys; X3DH starts a
  session, the ratchet gives every message a new key. Server relays ciphertext, sees only metadata.
- **Media:** encrypt with random key K → pre-signed upload to object storage → message carries ID + K + hash →
  download through CDN.
- **Multi-device:** every device has its own keys and inbox; sender encrypts per device.
- **Presence:** heartbeats + grace period; subscribe only while a chat is open. Typing: never stored, auto-expires.
- **Numbers:** 1B DAU × 40 = 40B messages/day (~460K/s, ~1.4M/s peak); 500M concurrent sockets → ~1,000
  servers at 500K each; text ~40 TB/day, media ~800 TB/day.

## Practice questions

1. **Alice says her message shows one tick for hours. What could be happening?** One tick means the server
   stored it but no device of Bob's has acked it. Bob may be offline (phone off, no data), his push token may be
   stale so the doorbell never rings, or he may have blocked Alice. Check Bob's registry entry, last connection
   and inbox depth.
2. **How would you implement "delete for everyone"?** Send a special encrypted control message referencing the
   original `message_id`. If the original is still in an inbox, the server can drop it too; otherwise each
   recipient's app removes it locally. It cannot be guaranteed: a recipient may already have read it or taken a
   screenshot.
3. **How would you add disappearing messages?** It is a client-side rule: each message carries a timer, and every
   device deletes it locally when the timer runs out. The server already deletes messages after delivery, so
   nothing changes on the server.
4. **A chat server holding 500,000 connections is about to be deployed. How do you avoid user impact?** Stop
   sending it new connections, then close existing ones in small batches over several minutes with a "please
   reconnect" frame. Clients reconnect with jitter to other servers; inboxes guarantee no message is lost.
5. **What changes if the product must support server-side search and history (like Slack)?** Messages are stored
   per chat, permanently, in a wide-column store keyed by `(chat_id, time bucket)`, and indexed by a search
   engine. That requires the server to read the messages, so end-to-end encryption by default is no longer
   possible; storage grows by tens of terabytes a day.
6. **How would you show "online" for 1,000 group members?** You would not push all of them. Show presence only
   in 1:1 chats, or fetch it once when the group info screen is opened, rather than subscribing to 1,000
   presence streams.
