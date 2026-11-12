---
title: "Design an Email Service (like Gmail)"
description: "Design a Gmail-scale email service step by step: SMTP and IMAP, sending and receiving, mailbox storage, threading, search, spam filtering and multi-device sync."
difficulty: "Medium"
sidebar:
  label: "Email service (like Gmail)"
tags: ["Email", "Storage", "Search", "Queues", "Real-time sync"]
---

Email looks simple: you type a message, press **Send**, and it appears in someone's inbox. Underneath, an email
service is several hard systems in one. It is a **post office** that must never lose a letter, a **filing
cabinet** holding decades of mail for a billion people, a **search engine** over all of it, a **security
guard** turning away spam and malware, and a **live feed** that keeps your phone, laptop and tablet in step.

This case study builds that system from the ground up. We start with how email works on the internet, then
design the service layer by layer, and finish with what breaks as it grows and a one-page revision sheet.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Email in 5 minutes: how mail moves across the internet

Before designing anything, we need the vocabulary. Email is an open, decades-old system: Gmail must talk to
Outlook, Yahoo and millions of small company mail servers, so it has to speak the same **protocols**.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **MUA** (mail user agent) | The app you read mail in: the Gmail web app, Apple Mail, Outlook | You, writing a letter |
| **MTA** (mail transfer agent) | A server that relays mail to other servers using SMTP | The postal truck between cities |
| **MDA** (mail delivery agent) | Puts an arriving message into the right mailbox | The postman at your door |
| **SMTP** | *Simple Mail Transfer Protocol*: how servers **send** mail to each other (port 25), and how apps submit mail (port 587, or 465 with TLS from the start) | The rules every post office agrees on |
| **IMAP / POP3 / JMAP** | How an app **reads** a mailbox from its server. IMAP and JMAP keep mail on the server and sync; POP3 downloads and usually deletes | Checking your PO box |
| **MX record** | A DNS entry saying which servers accept mail for a domain (`othermail.com` → `mx.othermail.com`) | The address of the town's post office |
| **SPF, DKIM, DMARC** | Ways to prove a message really came from the domain it claims | The postmark and a wax seal |

Here is the journey of one message from `alice@ourmail.com` to `bob@othermail.com`:

[![How one email travels: Alice's app submits to our outbound server, which looks up othermail.com's MX record in DNS, delivers over SMTP to their inbound server, which files it in Bob's mailbox for Bob's app to sync](/img/system-design/email-service/01-journey.png)](/img/system-design/email-service/01-journey.png)

*Select the diagram to zoom in and move around.*

Two facts from this picture shape the whole design:

1. **We are on both sides.** Our service receives mail from strangers on the internet (inbound) and delivers
   mail to strangers (outbound). Both directions need their own pipelines.
2. **SMTP is a hand-off, not a phone call.** When a server answers `250 OK`, it has accepted responsibility for
   delivering the message (the SMTP standard's own wording). So we must **write the message durably before saying OK**. If we crash
   after saying OK and lose it, the mail is gone forever and the sender never knows.

## 2. Requirements

### Functional (what users can do)

- **Send** an email to one or many recipients (To, Cc, Bcc), inside or outside our service.
- **Receive** email from anyone on the internet.
- **Attachments** up to 25 MB per message (bigger files go as a link to cloud storage).
- **Read and organise**: inbox, sent, drafts, trash, archive, star, read/unread, and user-created **labels**.
- **Conversations (threads)**: replies grouped with the message they answer.
- **Search** across all of a user's mail, by words, sender, date, label, "has attachment".
- **Spam and malware protection**, with "Report spam" / "Not spam" buttons.
- **Multi-device sync**: read a message on your phone and it shows as read on your laptop within seconds.
- **Notifications** for new mail.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Durability** | Never lose an accepted message (11 nines for stored mail) | Email is a record: contracts, receipts, password resets |
| **Availability** | 99.99% for reading and sending | People rely on email to do their jobs |
| **Latency** | Inbox opens in under 200 ms; internal mail arrives in under 1 s; search under 500 ms | It should feel instant |
| **Scale** | ~1.5 billion accounts, ~500 million daily active users | Gmail-sized |
| **Consistency** | Your own actions are visible to you immediately (read-your-writes); other devices catch up within seconds | Eventual consistency between devices is fine, but you must never "lose" a label you just added |
| **Security and privacy** | Encryption in transit (TLS) and at rest; strict per-user isolation | A mailbox is one of the most sensitive things a person owns |

### Out of scope

Calendar, chat, contacts sync, ads, end-to-end encryption (like ProtonMail), and the mail-composer UI. Mention
them in an interview, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resources dominate**.

**Assumptions:** 500 million daily active users. Each receives **40** emails and sends **10** a day.
Average message (headers + body) is **50 KB**; **20%** of messages carry attachments averaging **500 KB**.
Each user opens their inbox or a message about **20** times a day.

**Traffic**

- Messages received per day: $500\text{M} \times 40 = 20\text{B}$, about **230,000 per second** on average
  and roughly **700,000 per second** at peak (3× average).
- Messages sent per day: $500\text{M} \times 10 = 5\text{B}$, about **58,000 per second**.
- Reads: $500\text{M} \times 20 = 10\text{B}$ a day, about **115,000 per second**. That is fewer than the
  deliveries (much mail is never opened on its own), but every read is a person waiting, while deliveries can
  queue for a second, so reads must be cheap and fast.

**Storage per day (before compression and deduplication)**

- Bodies: $20\text{B} \times 50\text{ KB} = 1\text{ PB}$.
- Attachments: $20\text{B} \times 20\% \times 500\text{ KB} = 2\text{ PB}$.
- Metadata (sender, subject, labels, flags, roughly 1 KB per message per mailbox): about **20 TB**.
- Search index: often 20–30% of the text it indexes, so a few hundred TB.

So we add about **3 PB of raw mail per day**, over an exabyte a year, and more again for replicas. Three
conclusions follow:

1. **Blob storage dominates cost.** Bodies and attachments belong in a cheap, durable object store, not in a
   database.
2. **Metadata is small but hot.** Inbox listing reads metadata only, so that must live in a fast database.
3. **Deduplication and compression pay off hugely.** A newsletter sent to 2 million of our users, or the same
   PDF forwarded around an office, should be stored once.

## 4. The API

Clients (web, Android, iOS) talk to us over HTTPS with a JSON API. Old desktop apps can still use IMAP and SMTP
through a protocol gateway that translates to the same internal services.

| Method and path | What it does |
| --- | --- |
| `POST /v1/messages/send` | Send a message (or a saved draft). Body: recipients, subject, body, attachment IDs, and an `Idempotency-Key` header so a retried request is not sent twice. |
| `POST /v1/attachments` | Get a pre-signed upload URL; the client uploads the file straight to blob storage and gets an `attachment_id`. |
| `GET /v1/threads?label=INBOX&cursor=...&limit=50` | List conversations under a label, newest first, with a **cursor** (not a page number) for the next page. |
| `GET /v1/threads/{thread_id}` | All messages in a conversation, with bodies. |
| `PATCH /v1/messages/{id}` | Change flags and labels: `{"addLabels": ["Work"], "removeLabels": ["UNREAD"]}`. |
| `GET /v1/search?q=from:alice has:attachment invoice` | Search the user's own mail. |
| `GET /v1/changes?since=<state>` | Everything that changed since the client's last known state (the heart of sync, see section 10). |
| `WSS /v1/stream` | Live push: "something changed, fetch the changes". Mobile apps use APNs / FCM instead. |

Why a **cursor** instead of `?page=37`? An inbox changes constantly. With page numbers, a new message arriving
shifts everything by one and you see a duplicate or miss one. A cursor says "continue after the message with
this timestamp and ID", which is stable and lets the database jump straight there instead of counting rows.

## 5. High-level design

[![High-level architecture: clients reach the API and protocol gateways; mailbox, search, sync and send services sit behind them; mail flows through inbound and delivery queues, spam filters and delivery workers into the metadata DB, blob store and search index; outbound mail leaves through the outbound MTA pool](/img/system-design/email-service/02-architecture.png)](/img/system-design/email-service/02-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **API gateway:** checks who you are (OAuth tokens), applies rate limits, routes to the right service.
- **Inbound SMTP edge:** the servers listed in our MX records. They speak SMTP to the world and do the cheapest
  checks (IP reputation, connection limits) before accepting anything.
- **Queues** (for example Kafka or a replicated in-house queue): the shock absorbers. Accepting mail and
  processing it are decoupled, so a spam wave or a slow database never makes us refuse mail.
- **Spam + malware filtering:** decides inbox, spam folder, or reject.
- **Delivery workers:** write the message into each recipient's mailbox (metadata + blob) and emit a change event.
- **Outbound MTA pool:** delivers to other providers, with retries and per-domain politeness.
- **Mailbox service:** everything about reading and organising: list threads, open a message, add labels.
- **Search service + indexer:** builds and queries a per-user full-text index.
- **Sync + notification service:** tells every open device that something changed.
- **Metadata DB:** small, hot, structured data. **Blob store:** large, cold, immutable bytes.

The single most useful idea in this design: **separate metadata from content**. Listing an inbox reads 50 tiny
rows from the metadata DB and never touches the multi-petabyte blob store. Opening a message fetches one blob.

## 6. Flow 1: sending an email

Alice sends a message to Bob (also on our service) and to Carol at `othermail.com`.

[![Sequence for sending: Alice's app calls the send service, which validates, stores the body once, enqueues both recipients and replies 200 OK; a delivery worker files Bob's copy, and the outbound MTA signs and delivers Carol's copy with retries](/img/system-design/email-service/03-send.png)](/img/system-design/email-service/03-send.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The user gets "sent" as soon as the message is durably queued**, not when every recipient has it. Delivery
  to slow external servers can take minutes; the user should not wait.
- **The idempotency key** protects against the classic mobile bug: the phone sends, the network drops before
  the reply, the app retries, and Bob gets the message twice. The send service remembers each key for a day and
  returns the first result for any repeat.
- **Internal recipients take a fast path.** No SMTP, no internet: the delivery worker writes straight into
  Bob's mailbox. Bob typically sees it in well under a second.
- **The body is stored once.** Alice's Sent copy and Bob's Inbox copy are two small metadata rows pointing at
  one blob. With a 10,000-person company announcement, that is one blob and 10,000 rows, not 10,000 copies.
- **Bcc** recipients are delivered individually so their addresses never appear in anyone else's copy.

## 7. Flow 2: receiving an email from the internet

Dave at `othermail.com` writes to Bob.

[![Sequence for receiving: othermail.com connects to our SMTP edge, which checks reputation and the recipient, writes the message to a replicated queue and only then replies 250 OK; filters check it, a delivery worker files it and Bob's devices are pushed](/img/system-design/email-service/04-receive.png)](/img/system-design/email-service/04-receive.png)

*Select the diagram to zoom in and move around.*

The key rule is step 6 before step 7: **write to a replicated, durable queue, then answer `250 OK`**. If our
edge server dies before the write, we never said OK, so the sending server simply retries later (SMTP senders
retry for days). If it dies after, the message is safe in the queue. Either way, nothing is lost.

Notice also what we can reject **cheaply and early**: unknown recipients (`550`) and known-bad IP addresses
are turned away during the SMTP conversation, before we spend any storage or CPU on them. Most spam dies here.

## 8. Low-level design: the data model

### What we store

[![Data model: every mailbox table's key starts with user_id; USER owns LABELs and THREADs; a THREAD contains MESSAGEs; MESSAGE_LABEL links messages to labels, including system labels such as UNREAD; MESSAGE has ATTACHMENTs, and both point to content-addressed BLOBs with a ref_count](/img/system-design/email-service/05-data-model.png)](/img/system-design/email-service/05-data-model.png)

*Select the diagram to zoom in and move around.*

Five design decisions hide in this diagram.

**1. Every mailbox table starts with `user_id`.** Almost every query is about one user's mailbox ("my inbox", "my
labels", "my search"), so we **shard by `user_id`**. One user's data lives together on one shard, every query
hits exactly one shard, and adding shards adds capacity. Shards are assigned with consistent hashing (or a
lookup directory) so we can move users between machines without downtime.

**2. Labels, not folders.** In Gmail a message can be in Inbox *and* labelled Work *and* starred. "Inbox",
"Sent", "Spam", "Trash", "Starred" and "Unread" are simply **system labels**. Archiving a message just removes
its Inbox label. The `MESSAGE_LABEL` table is the index that makes "show me label X" fast.

**3. The listing index is sorted the way users read.** The key of `MESSAGE_LABEL` is
`(user_id, label_id, received_at DESC, message_id)`. "Newest 50 in my Inbox" becomes one sequential read of
50 rows from a known starting point, no matter whether the mailbox holds 100 or 10 million messages. The
cursor from the API is just the last `(received_at, message_id)` the client saw.

**4. Bodies live in the blob store, addressed by content.** `body_blob_key` is a hash of the content (for
example SHA-256). Identical content gets the identical key, so it is stored once and `ref_count` tracks how
many mailboxes point at it. When the count reaches zero (everyone deleted it), a background job reclaims it.
Blobs are compressed, encrypted, and replicated across zones (or erasure-coded, which gives the same safety for
about half the storage of three full copies).

**5. A `snippet` is stored with the metadata.** The inbox shows "Alice — Lunch tomorrow? — Hey, are you free
at…". Storing the first ~100 characters with the metadata means listing never opens a blob.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Metadata, labels, threads | Billions of small rows, always accessed by `user_id`, sorted ranges | Wide-column store (Bigtable, Cassandra, ScyllaDB) or sharded MySQL / Postgres | Range scans on a sorted key; scales horizontally |
| Bodies, attachments | Immutable bytes, KB to MB, petabytes | Object storage (S3, GCS, or an in-house blob store) | Cheapest per byte, built for durability |
| Search index | Inverted index per user | Search engine (Lucene-based: Elasticsearch, OpenSearch) or a custom index | Full-text queries |
| Queues and events | Ordered, durable streams | Kafka, Pulsar | Replay, back-pressure, fan-out to many consumers |
| Hot data | Recent inbox pages, sessions, unread counts | Redis / Memcached | Most reads are "the top of my inbox" |
| Idempotency keys, rate limits | Short-lived counters | Redis with expiry | Fast, and it's fine if they expire |

### Storage tiers: hot, warm and cold

Most people read mail from the last few weeks; the 2014 newsletters are almost never opened. So bodies move
over time: **hot** (recent, replicated on fast disks or SSD), **warm** (months old, erasure-coded on HDD), and
**cold** (years old, archival storage, slower to open but a fraction of the cost). Metadata stays hot forever,
so old mail still lists and searches instantly; only opening an old body is slightly slower.

## 9. Low-level design: threading (conversations)

How does the service know that a reply belongs with the original message? Every email carries headers made
for this:

- `Message-ID: <abc123@othermail.com>`: a globally unique ID set by the sender.
- `In-Reply-To: <abc123@othermail.com>`: "I am a reply to that message".
- `References: <first@x> <second@y> <abc123@othermail.com>`: the chain of ancestors.

[![Threading decision: join an existing thread if In-Reply-To or References match, otherwise if the normalised subject and a participant match recently, otherwise start a new thread; then update the thread](/img/system-design/email-service/06-threading.png)](/img/system-design/email-service/06-threading.png)

Implementation notes:

- Keep a per-user lookup `(user_id, rfc_message_id) → thread_id`. Checking a reply's `References` is then a few
  point lookups on the same shard.
- "Normalised subject" strips prefixes like `Re:`, `RE:`, `Fwd:`, `AW:` (German) and extra spaces, so
  "Re: RE: Lunch" matches "Lunch".
- The subject fallback is a **guess**, so it is limited (shared participant, recent) to avoid gluing together
  every message titled "Hello".
- Threads are **per user**: Bob's and Alice's copies of the same conversation are separate rows, because they may
  have different messages in it (Bob was not Cc'd on one reply).

## 10. Low-level design: multi-device sync

You read a message on your phone; within a second it should look read on your laptop. A naive design would make
every device re-download the whole inbox every few seconds. Instead, each mailbox keeps a **change log**.

Every change to a mailbox (new message, flag changed, label added, message deleted) is appended to that user's
log with a **sequence number** that only ever increases: 1041, 1042, 1043… Each device remembers the last number
it has seen, its **state**. Syncing is then just: "give me everything after 1041".

[![Sync sequence: the phone marks a message read, the sync service appends entry 1042 to the change log and pushes a nudge to the laptop, which asks for changes since 1041 and applies just that one change](/img/system-design/email-service/07-sync.png)](/img/system-design/email-service/07-sync.png)

*Select the diagram to zoom in and move around.*

Why this works well:

- **The push carries no data**, just a nudge. Devices then pull exactly what they missed. If a push is lost
  (phones sleep, networks drop), nothing breaks: the next pull catches up because the state number says what
  is missing.
- **Offline devices** come back and ask for "changes since 980". If that is too far back (logs are trimmed after
  some weeks), the server answers "too old, resync" and the device reloads its recent mail from scratch.
- **Conflicts** are rare and simple: flags and labels are sets, so "add Work on phone" and "add Travel on
  laptop" merge naturally. For true conflicts (delete on one device, label on another), the last write wins
  with server timestamps, which is acceptable for email.
- IMAP has the same idea (`UIDVALIDITY`, `MODSEQ` with the `CONDSTORE` extension) and so does JMAP (state
  strings), which is why a protocol gateway can serve old clients from the same log.

**Notifications** for phones go through Apple Push Notification service and Firebase Cloud Messaging; the app
wakes up and runs the same "changes since" call. Notification fan-out is filtered by settings (no push for
Promotions, for example).

## 11. Low-level design: search

"from:alice invoice has:attachment" must search years of mail in under half a second.

**One giant index for everyone would be a mistake.** Every query would scan postings from a billion
mailboxes only to throw away all but one user's results, and a privacy bug could leak one person's mail into
another's results. Instead, **each user gets their own logical index**, stored on the search shard for that
user. A query touches exactly one user's index, which is small and fast.

[![Search: the indexer turns each new message into words and adds it to Bob's index; a query is parsed, each word's list is looked up and intersected, ranked, and the top results' metadata is fetched](/img/system-design/email-service/08-search.png)](/img/system-design/email-service/08-search.png)

*Select the diagram to zoom in and move around.*

An **inverted index** is the same idea as the index at the back of a book: for each word, the list of messages
that contain it.

| Word | Messages containing it (Bob's index) |
| --- | --- |
| `invoic` | 17, 230, 4512 |
| `lunch` | 18, 19, 4400 |
| `from:alice` | 17, 18, 4400, 4512 |

Words are stored **stemmed** (cut to a common root), so "invoice", "invoices" and "invoicing" all become `invoic`,
and the query word is stemmed the same way. "from:alice invoice" is then the intersection of two lists: messages 17
and 4512.

Practical details:

- **Indexing is asynchronous.** A new message is searchable a second or two after it arrives. That small lag is
  a fine trade for never slowing down delivery.
- **Attachment text** (PDF, DOCX) is extracted by a separate worker pool because it is CPU-heavy, and indexed
  when ready.
- **Cold mailboxes** (users who have not logged in for a year) can have their index evicted and rebuilt on first
  search, which saves a lot of storage.
- Results are **message IDs**; the display data comes from the metadata DB, so the index stays lean.

## 12. Low-level design: spam and malware filtering

Close to half of all email on the internet is spam. Filtering is a funnel: cheap checks first so expensive checks
see as little traffic as possible.

[![Spam filtering funnel: connection checks, then SPF/DKIM/DMARC, then content classification, then attachment and link scanning, then a spam score that routes mail to Spam or Inbox; a bad IP is rejected in SMTP, a DMARC failure is rejected in SMTP or quarantined after 250 OK, malware is quarantined or dropped; user reports feed back into the content classifier](/img/system-design/email-service/09-spam.png)](/img/system-design/email-service/09-spam.png)

*Select the diagram to zoom in and move around.*

What each authentication check proves:

- **SPF**: the sending server's IP is on the list the domain published in DNS ("these IPs may send for
  `othermail.com`"). It checks the envelope sender (the `MAIL FROM` address used for bounces), not the From
  line the reader sees.
- **DKIM**: the message carries a cryptographic signature from a domain over the body and chosen headers, so
  that domain vouches for it and the signed parts were not altered on the way.
- **DMARC**: ties the two to the visible From address. A message passes only if SPF or DKIM passes **for the
  same domain as the From line** (called alignment), and the domain publishes what to do when neither does:
  `p=none` (just report), `p=quarantine` (spam folder) or `p=reject`. This is what stops someone sending as
  `security@yourbank.com` from a random server.

These checks are cheap, so they can run during the SMTP conversation, before the final `250 OK`, where a
`p=reject` failure is refused outright. If they run after acceptance instead (as in the receive flow in
section 7), a failing message is quarantined or dropped rather than bounced, because bouncing would send mail
to an address that was probably forged.

The **feedback loop** is what makes filtering good over time: millions of "Report spam" clicks a day are labelled
training data. A message many users report is pulled into spam for everyone who received it, sometimes within
minutes of a campaign starting.

We must also be a **good citizen outbound**: rate-limit new accounts, watch for compromised accounts suddenly
sending thousands of messages, and sign everything with DKIM. If our servers send spam, other providers block
our IP addresses and all our users suffer. The big providers now enforce this: since February 2024 Gmail and
Yahoo require bulk senders (for Gmail, more than 5,000 messages a day to its users) to pass SPF and DKIM,
publish a DMARC policy with an aligned From domain, offer one-click unsubscribe, and keep reported spam below
0.3%.

## 13. Low-level design: outbound delivery to other providers

Delivering to the outside world is unreliable by nature: servers are down, busy, or deliberately slow to new
senders ("greylisting").

- **Queue per destination domain.** Mail for `othermail.com` waits in its own lane, so a slow provider does not
  block mail to everyone else.
- **Retries with exponential backoff:** 1 minute, 5, 15, 1 hour, 4 hours… for up to about **5 days**. A `4xx`
  SMTP answer means "try later"; a `5xx` means "never" (for example, the address does not exist).
- **Bounces:** on a permanent failure or timeout, we send the sender a **bounce message** (a delivery status
  notification) explaining what went wrong.
- **Connection reuse and politeness:** keep a few TLS connections open to big providers and send many messages
  over each, but respect each provider's limits on connections and messages per minute.
- **IP reputation:** outbound mail leaves from a pool of IP addresses with good history. New IPs are "warmed up"
  slowly. Bulk mail and suspicious mail use separate pools so they cannot hurt normal users' deliverability.

## 14. Reliability: how we never lose mail

| Risk | Defence |
| --- | --- |
| A server crashes after accepting a message | Only answer `250 OK` / `200 OK` after the message is in a **replicated** queue (written to several machines) |
| A message is processed twice after a retry | **Idempotent** delivery: the delivery worker checks `(user_id, rfc_message_id)` before inserting, so a retry is a no-op |
| A whole data centre fails | Metadata and blobs are replicated across zones and regions; queues are replicated; traffic fails over |
| A bad deploy corrupts data | Blobs are immutable (never edited in place), deletes are soft for 30 days (Trash, then a hidden recovery window), and backups are kept offline |
| One overloaded component | Queues absorb bursts; each stage scales independently; inbound edges shed load with `4xx` "try later", which senders handle by retrying |

The pattern to remember: **at-least-once delivery + idempotent consumers = effectively exactly once.** Queues
may hand the same message to a worker twice; the worker's duplicate check makes the second time harmless.

## 15. What breaks as it grows, and how to fix it

**The giant mailbox.** Some users keep 20 years of mail, millions of messages. Offset pagination
(`LIMIT 50 OFFSET 900000`) and counting rows would crawl. *Fix:* cursor-based listing on the sorted
`MESSAGE_LABEL` key, and store counters (unread count, total) instead of counting on demand.

**The hot shard.** Sharding by user is great until one shard holds several heavy users, or a support mailbox
receives a flood. *Fix:* move users between shards (a directory makes this possible without renaming anything),
and give known giant accounts (shared support inboxes, large organisations) dedicated capacity.

**The fan-out storm.** A company-wide email to 200,000 internal employees, or a newsletter to millions of our
users, arrives in one burst. *Fix:* store the body once (content addressing), write metadata rows in batches
through the queue, and let delivery spread over a few seconds instead of overwhelming one shard.

**The storage bill.** Exabytes add up. *Fix:* compression, deduplication of bodies and attachments, erasure
coding instead of full replicas, and tiering old mail to cold storage. Per-user quotas (for example 15 GB) keep
growth bounded.

**The spam wave.** A botnet suddenly sends hundreds of millions of messages. *Fix:* reject at the connection
layer by IP reputation and per-IP rate limits so most of it never reaches the queue, and auto-scale the
filtering tier from the queue's backlog.

**The search bill.** Indexing everything for everyone is costly. *Fix:* per-user indexes, evicting the indexes
of inactive users and rebuilding them on demand, and indexing attachment text lazily.

## 16. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| When to say "sent" | After all recipients have it | After durably queued | **Queued**: external delivery can take minutes; durability is what matters |
| Where bodies live | In the database with metadata | In a blob store | **Blob store**: far cheaper per byte, keeps the DB small and fast |
| One copy per recipient or shared | Copy per mailbox | Content-addressed, shared | **Shared** with reference counts: huge savings on bulk mail |
| Folders or labels | Folders (one place) | Labels (many tags) | **Labels**: more flexible; folders are a special case |
| Search index | Global | Per user | **Per user**: smaller, faster, and isolates users' data |
| Sync | Clients poll the inbox | Change log + push nudge | **Change log**: cheap, works offline, tolerates lost pushes |
| Consistency across devices | Strong | Eventual (seconds) | **Eventual**, with read-your-writes for the device making the change |

## Cheat sheet for last-minute revision

- **Two directions:** inbound from the internet (SMTP edge → queue → filters → delivery) and outbound to it
  (queue per domain → retries → bounce). Internal mail takes a fast path that skips SMTP.
- **Golden rule:** write durably, then say OK. Queues decouple accepting from processing.
- **Split data by temperature:** metadata (small, hot, sharded by `user_id`) vs bodies and attachments (huge,
  immutable, content-addressed in a blob store, tiered hot → warm → cold).
- **Labels, not folders.** Inbox, Sent, Spam, Unread are system labels. Listing = range scan on
  `(user_id, label_id, received_at DESC)` with a cursor.
- **Threading** uses `Message-ID`, `In-Reply-To`, `References`, with a careful subject fallback.
- **Sync** = per-mailbox change log with increasing sequence numbers; push says "changed", the device pulls
  "changes since N".
- **Search** = per-user inverted index, built asynchronously from change events.
- **Spam** = funnel: IP reputation → SPF / DKIM / DMARC → ML content → attachment scan, improved by user reports.
- **Reliability** = replicated queues + idempotent writes + soft deletes + multi-zone replication.
- **Numbers:** ~20B messages received a day (~230K/s, ~700K/s peak), ~3 PB raw content a day, ~10B reads a
  day (~115K/s).

## Practice questions

1. **A user says an email "disappeared". How would you investigate?** Trace by `Message-ID`: inbound SMTP logs
   (was it accepted?), filter verdict (spam? quarantined?), delivery worker logs, then the user's change log (was
   it deleted or archived, and from which device?).
2. **How would you add "Undo send" (a 30-second window)?** Hold the message in the delivery queue with a delay
   of 30 seconds; "Undo" removes it from the queue before any worker picks it up. Nothing has left our system
   yet, so it is safe.
3. **How would you support "Schedule send" for next Monday?** Store it in a scheduled-messages table keyed by
   send time; a scheduler moves due messages into the normal delivery queue. Same idempotency key, so a
   scheduler retry cannot send twice.
4. **How would you design the "unread count" badge?** Keep a counter per `(user_id, label_id)`, updated in the
   same write as the flag change, and cache it. Recount occasionally in the background to repair drift.
5. **What changes if you must offer end-to-end encryption?** The server can no longer read bodies, so
   server-side search and content-based spam filtering stop working; search moves to the device, and spam
   filtering relies on metadata and sender reputation.
