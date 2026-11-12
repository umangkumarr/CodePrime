---
title: "How to Answer a System Design Interview"
description: "A step-by-step framework for a 45–60 minute system design interview: requirements, estimates, API, data model, high-level design, deep dives and trade-offs."
sidebar:
  label: "How to answer"
  order: 1
tags: ["Interview Prep", "Estimation", "Scalability", "Fundamentals"]
---

A system design interview gives you a one-line prompt ("Design a URL shortener", "Design WhatsApp") and an empty
whiteboard. There is no single correct answer, and the prompt is vague on purpose. The interviewer is not checking
whether you have memorised how a company built its product. They are watching **how you think**: whether you ask
the right questions, size the problem, make sensible choices, and explain what each choice costs.

That makes it a very learnable interview. Strong candidates are not always the ones who know the most
technologies; they are the ones who follow a clear process, so they never freeze and never run out of time. This
guide gives you that process, a table of numbers worth knowing, a glossary of the building blocks you will reach
for, and a one-page checklist for the night before.

:::tip[How to read this]
If your interview is tomorrow, jump to the [checklist for the night before](#checklist-for-the-night-before). If
you have an hour, read top to bottom, then practise the framework on one of the
[case studies](/system-design/), out loud, with a timer.
:::

## 1. What the interview is really testing

Think of the interviewer as a future teammate who has asked you to design a feature with them. In 45 minutes they
want to see whether you would be good to work with on a real design. That breaks down into a few questions:

- **Do you find out what is actually needed before building?** Engineers who start coding the wrong thing are
  expensive.
- **Can you reason about scale with numbers**, rather than saying "it needs to be scalable"?
- **Can you put together a working system** from standard parts (load balancers, caches, databases, queues)?
- **Do you go deep where it matters**, and know why one option beats another?
- **Do you see what will break**, and can you discuss trade-offs honestly?
- **Can you communicate**: lead the conversation, think out loud, and take a hint?

Notice what is missing: a "correct" architecture. Two candidates can draw quite different designs and both do
well, because each justified their choices. A memorised diagram with no reasons does badly.

## 2. The framework at a glance

The interview has three phases. **Scope** the problem so you know what to build, **design** it, then **defend**
it by finding its weak points before the interviewer does. Inside those phases are six steps, each of which leaves
something on the board.

[![The six steps of a 45-minute interview: clarify (about 5 min), estimate (3-5 min), API and data model (5-8 min), high-level design (10 min), deep dives (12-15 min), bottlenecks and wrap-up (5 min); each step leaves requirements, numbers, endpoints and tables, a box diagram, zoomed parts or risks on the board](/img/system-design/how-to-answer/01-steps.png)](/img/system-design/how-to-answer/01-steps.png)

*Select the diagram to zoom in and move around.*

A time budget keeps you honest. The most common way to fail is to spend 20 minutes on requirements and estimates
and never reach the interesting part. Introductions and your questions at the end usually take 5–10 minutes of the
slot, so plan for the design time you really have.

| Step | 45-minute interview | 60-minute interview | Leaves on the board |
| --- | --- | --- | --- |
| 1. Clarify requirements | ~5 min | 5–8 min | Functional and non-functional lists, out of scope |
| 2. Estimate | 3–5 min | ~5 min | QPS, storage, bandwidth, read/write ratio |
| 3. API and data model | 5–8 min | 8–10 min | A handful of endpoints, the main tables |
| 4. High-level design | ~10 min | 12–15 min | A box diagram with one request traced through it |
| 5. Deep dives | 12–15 min | ~20 min | Two or three components drawn in detail |
| 6. Bottlenecks, trade-offs, wrap-up | ~5 min | 5–8 min | Risks, fixes, a 60-second summary |

Two rules about the budget. First, **say it out loud** at the start ("I'll spend a few minutes on requirements and
numbers, then sketch the design, then go deep wherever you'd like"). The interviewer then knows you have a plan,
and may tell you where they want the time spent. Second, **the interviewer's interests beat your plan**. If they
want to skip estimates and go straight to the database, do that.

## 3. Step 1: Clarify requirements (about 5 minutes)

A prompt like "Design Instagram" could mean a weekend project or a billion-user platform; it could mean photos,
videos, stories, messaging, ads and search. You cannot design all of it in 40 minutes, and you should not try.
Your first job is to **turn a vague prompt into a short, agreed list**.

Split what you learn into three buckets and write them on the board as you go.

**Functional requirements** are *what the system does*: the features a user can see. Aim for three to five core
ones. "Users can upload a photo", "users see a feed of photos from people they follow".

**Non-functional requirements** are *how well it must do it*: scale, speed, availability, consistency,
durability. These decide the architecture far more than the features do. A feed that may be a few seconds stale
allows heavy caching; a bank balance that must be exact does not.

**Out of scope** is what you deliberately leave out. Naming it shows you saw it and made a choice, and it protects
your time.

### Questions worth asking

| About | Example questions | Why it matters |
| --- | --- | --- |
| Users and scale | How many users? How many are active per day? Is it global or one region? | Drives every estimate and whether you need sharding or multiple regions |
| Core features | What are the two or three things a user must be able to do? Who are the users (consumers, businesses, other services)? | Keeps the design focused |
| Read vs write | Is this read-heavy (a news feed) or write-heavy (logging, metrics)? | Caching and replicas help reads; queues and partitioning help writes |
| Latency | What should feel instant? What can be slow or asynchronous? | Decides what goes on the request path and what goes in a queue |
| Consistency | Is it acceptable for users to see slightly stale data for a few seconds? | Strong consistency costs latency and availability |
| Data | How big is one item? How long do we keep it? Can it be deleted or edited? | Storage size, choice of store, retention jobs |
| Availability | What happens if the service is down for a minute? | 99.9% vs 99.99% changes how much redundancy you need |
| Special cases | Are there celebrity users, viral items, flash sales, abuse or spam? | These are the hot spots that break naive designs |

You do not need every question. Ask the ones that change the design, and when the interviewer says "you decide",
**state an assumption and move on**: "I'll assume 10 million daily users, mostly reading, and that a few seconds of
staleness in the feed is fine."

### What it looks like on the board

For a photo-sharing app, five minutes might produce:

```text
Functional:      upload a photo (with caption) · follow users · view a feed of followed users' photos
Non-functional:  10M daily active users · feed loads in < 300 ms · highly available
                 · feed may be a few seconds stale · photos never lost
Out of scope:    comments, likes, stories, video, messaging, ads, search
```

Notice how specific the non-functional list is. "Fast" and "scalable" are not requirements; "feed in under 300 ms
for 10 million daily users" is.

## 4. Step 2: Estimate (3 to 5 minutes)

Back-of-the-envelope estimates turn "a lot of users" into numbers that tell you **which resource will hurt first**:
request rate, storage, or bandwidth. They are deliberately rough. Round aggressively, use powers of ten, and say
your assumptions out loud. Being within a factor of two or three is plenty; what matters is that the conclusion
follows from the arithmetic.

The recipe:

1. **Requests per second (QPS)** = daily actions ÷ ~100,000 seconds per day. Multiply by 2–3 for the **peak**.
2. **Storage** = new items per day × size per item × days kept (× copies, if you mention replication).
3. **Bandwidth** = requests per second × size of each response.
4. **Conclude**: read-heavy or write-heavy? Does the data fit on one machine? What does that imply?

### Handy numbers

**Time.** A day has 86,400 seconds; round to $10^5$. Then **1 million requests a day is about 12 per second**,
and 1 billion a day is about 12,000 per second.

| Period | Seconds | Round to |
| --- | --- | --- |
| 1 day | 86,400 | $10^5$ |
| 1 month | ~2.6 million | $2.5 \times 10^6$ |
| 1 year | ~31.5 million | $3 \times 10^7$ |

**Sizes.** Powers of two line up neatly with powers of ten.

| Power of two | Roughly | Unit |
| --- | --- | --- |
| $2^{10}$ | a thousand ($10^3$) | KB |
| $2^{20}$ | a million ($10^6$) | MB |
| $2^{30}$ | a billion ($10^9$) | GB |
| $2^{40}$ | a trillion ($10^{12}$) | TB |
| $2^{50}$ | a quadrillion ($10^{15}$) | PB |

Typical item sizes to assume when nobody says: a database row of metadata ~1 KB, a short text post ~1 KB, a
compressed photo 200 KB–2 MB, a minute of compressed video a few MB to tens of MB.

**Latency.** These are orders of magnitude, not exact figures; real numbers vary with hardware. What matters is
the ratio between rows.

| Operation | Roughly | What it teaches |
| --- | --- | --- |
| Read from CPU cache | ~1 ns | |
| Read from main memory (RAM) | ~100 ns | Memory is ~100× slower than CPU cache, but still very fast |
| Read 1 MB sequentially from memory | ~10 µs | |
| Random read from an SSD | ~100 µs | ~1,000× slower than memory: why caches exist |
| Network round trip inside one data centre | ~0.5 ms | A call to another service costs about a millisecond |
| Read 1 MB sequentially from an SSD | ~1 ms | |
| Disk seek on a spinning hard drive | ~10 ms | Avoid random reads on HDDs |
| Round trip between continents | ~150 ms | You cannot beat the speed of light: serve users from nearby (CDN, regions) |

**Rough capacity** (for planning only, and very workload-dependent): a single application server handles
hundreds to a few thousand requests per second; a single relational database on good hardware handles thousands
to tens of thousands of simple queries per second; an in-memory cache node handles on the order of 100,000
operations per second.

### A worked mini example

Same photo app. **Assumptions:** 10 million daily active users; each views **50** photos a day and uploads **one
photo every five days** (0.2 a day). An uploaded photo is **2 MB**; the version shown in the feed is compressed
to **200 KB**. We keep photos forever.

- **Reads:** $10\text{M} \times 50 = 500\text{M}$ views a day. $500\text{M} \div 86{,}400 \approx$ **5,800 per
  second**, about **17,000 per second** at a 3× peak.
- **Writes:** $10\text{M} \times 0.2 = 2\text{M}$ uploads a day, about **23 per second**. Read/write ratio is
  $500\text{M} : 2\text{M} =$ **250 : 1**.
- **Storage:** $2\text{M} \times 2\text{ MB} = 4\text{ TB}$ a day, about **1.5 PB a year** (before replicas and
  resized copies). Metadata is $2\text{M} \times 1\text{ KB} = 2\text{ GB}$ a day, which is tiny.
- **Bandwidth out:** $5{,}800 \times 200\text{ KB} \approx 1.2\text{ GB/s}$, about **9 Gbit/s** on average.

What it tells us, which is the whole point of estimating:

1. **It is read-heavy (250 : 1)**, so caching and a CDN will carry most of the load.
2. **Photo bytes dominate storage** and do not belong in a database; they go in object storage. Metadata fits
   comfortably in an ordinary database for a long time.
3. **Outbound bandwidth is large**, which is another reason to serve images from a CDN close to users.
4. **Writes are modest**, so the write path can stay simple.

If you cannot draw a conclusion from a number, you did not need that number. Skip estimates the interviewer
says are unimportant, and keep the arithmetic visible on the board so they can follow it.

## 5. Step 3: Define the API and sketch the data model (5 to 8 minutes)

### The API

The API is the **contract** between clients and your system. Writing it down forces you to be precise about what
each feature needs as input and returns as output, and it gives the rest of the design something to serve.
Pick the two to five endpoints behind your functional requirements; do not list every possible call.

| Method and path | What it does |
| --- | --- |
| `POST /v1/photos` | Upload a photo with a caption. Returns `photo_id`. Large files are usually uploaded straight to object storage with a pre-signed URL. |
| `POST /v1/users/{id}/follow` | Follow a user. |
| `GET /v1/feed?cursor=...&limit=20` | The next 20 feed items, newest first, and a cursor for the page after. |

A few details that impress because they show production thinking:

- **Who is calling?** Authentication (who you are) usually comes from a token in a header, so the user ID does not
  need to be a parameter on most calls.
- **Cursor pagination, not page numbers.** A feed changes constantly; `?page=7` skips or repeats items when new
  ones arrive. A cursor ("continue after this item") is stable and cheap for the database.
- **Idempotency keys on writes.** A phone that retries a timed-out upload should not create two photos. The client
  sends a unique key; the server returns the first result for any repeat.
- **REST is the sensible default.** Mention gRPC for internal service-to-service calls and WebSockets or
  server-sent events when the server must push to clients (chat, live scores).

### The data model

Start from **access patterns**, not from tables: list the queries the API needs, then design storage that makes
those queries cheap. For the photo app:

- "Get photo by ID" → a lookup by primary key.
- "Who does user X follow?" → a lookup by follower.
- "Newest photos from the people I follow" → the expensive one, and a natural deep dive later.

```text
users   (user_id PK, name, created_at)
photos  (photo_id PK, owner_id, caption, storage_key, created_at)     index: (owner_id, created_at DESC)
follows (follower_id, followee_id, created_at)                         PK: (follower_id, followee_id)
```

Then say **where each piece lives and why**. Photo bytes go in object storage (the table only holds
`storage_key`). Users, photos and follows are small structured rows with relationships, so a relational database
is a fine start. If one database will not be enough, say what you would **shard by**: here `user_id` for users and
follows, so each user's data sits together. The [building blocks](#9-building-blocks-glossary) section compares SQL
and NoSQL if the interviewer asks.

## 6. Step 4: The high-level design (about 10 minutes)

Now draw the boxes. **Start simple and make it work end to end**, then add components only when a requirement or
a number from your estimate asks for them. Almost every web-scale design grows from the same skeleton:

[![A generic web-scale architecture: clients fetch static files from a CDN and send API calls over HTTPS to a load balancer, which spreads them over stateless app servers; app servers read a cache first, go to the sharded primary database on a miss or a write, the database replicates to read replicas, and slow work goes through a message queue to workers that store files in object storage](/img/system-design/how-to-answer/02-architecture.png)](/img/system-design/how-to-answer/02-architecture.png)

*Select the diagram to zoom in and move around.*

Read it as a story, because that is how you should present it:

- **Clients** fetch heavy static content (images, video, JavaScript) from a **CDN** near them, and send API calls
  to a **load balancer**.
- The load balancer spreads requests over many identical **app servers**. They are **stateless** (no user session
  stored on the machine), so any server can handle any request and you scale by adding servers.
- App servers read from a **cache** first; on a miss, or for any write, they go to the **database**, which keeps
  **read replicas** to spread read traffic.
- Anything slow that the user does not need to wait for (sending email, resizing images, updating search indexes)
  goes onto a **message queue**, and **workers** do it in the background, storing large files in **object
  storage**.

Then **trace one read and one write** through your boxes. This is the single best way to prove the design works,
and it often reveals a missing piece.

[![Sequence of one read and one write: the read goes client, load balancer, app server, misses the cache, reads the database, fills the cache with a 10-minute expiry and returns 200 OK; the write inserts into the database, deletes the stale cache key, publishes an ItemCreated event to the queue and returns 201 Created](/img/system-design/how-to-answer/03-request.png)](/img/system-design/how-to-answer/03-request.png)

Two habits make this step land well:

- **Name what each box does in a few words** as you draw it, and connect it to a requirement ("CDN, because 9 Gbit/s
  of images should not leave our data centre").
- **Tailor the skeleton to the problem.** A chat app replaces request/response with long-lived WebSocket
  connections; a URL shortener barely needs a queue; an email service needs inbound and outbound pipelines. The
  skeleton is a starting point, not the answer.

## 7. Step 5: Deep dives (12 to 15 minutes)

The high-level diagram shows you can assemble a system; the deep dives show you understand one. Pick **two or
three components** that are hardest or most important for *this* problem, and ask the interviewer which they
prefer: "I'd like to go deeper on feed generation and on photo storage; does that sound right, or is there
something you'd rather see?"

### Choosing what to go deep on

Look for the part where the naive design breaks at the scale you estimated. Some patterns:

| If the problem is about... | The usual deep dives |
| --- | --- |
| Feeds and timelines (Twitter, Instagram) | Fan-out on write vs on read, the celebrity problem, feed caching |
| Short codes and IDs (URL shortener, Pastebin) | Generating unique IDs without collisions, the read cache, hot links |
| Real-time messaging (WhatsApp, Slack) | Connection servers, delivery and read receipts, message ordering, offline users |
| Search and typeahead | Indexes and tries, ranking, how the index is rebuilt and sharded |
| Money and inventory (payments, booking) | Exactly-once processing, idempotency, locking, double-booking |
| Storage-heavy (Dropbox, YouTube) | Chunked upload, deduplication, encoding pipelines, CDN |
| Rate limiting, caches, key-value stores | The algorithm itself, partitioning, replication, consistency |

### How to run one

Use the same four beats every time:

1. **State the problem precisely.** "A celebrity with 50 million followers posts. Writing that post into 50 million
   feeds takes minutes and overwhelms the database."
2. **Give two or three options.** Fan-out on write (push the post into every follower's feed now), fan-out on read
   (build the feed when it is opened), or a hybrid.
3. **Compare them on what matters here**: latency, cost, complexity, consistency.
4. **Choose, and say why.** "Hybrid: push for normal users, pull for the few accounts with huge followings, and
   merge at read time. Feeds stay fast for the 99% case without the write storm."

This structure is what interviewers mean by "discussing trade-offs". Going deep is not listing more technologies;
it is showing that you know **why** one option wins **in this situation**, and what you gave up.

## 8. Step 6: Bottlenecks, trade-offs and wrap-up (about 5 minutes)

Before the interviewer asks "what could go wrong?", ask it yourself. Walk your diagram box by box with these
questions:

- **Single points of failure.** If this box dies, what happens? Run at least two of everything, across zones.
- **Hot spots.** Is there one key, user or shard that gets far more traffic than the rest (a viral post, a
  celebrity, a flash sale item)? Cache it, replicate it, or split it.
- **Growth.** Which number from your estimate grows fastest, and which component hits its limit first? That is
  where sharding or a different store comes in.
- **Failure handling.** Timeouts and retries with backoff on every network call; idempotent writes so retries are
  safe; a queue to absorb bursts; graceful degradation (serve a slightly stale feed rather than an error).
- **Data safety.** Replication and backups; what happens if a region goes down.
- **Operations.** Metrics, logs and alerts: how would you know it is broken?

Common failure modes and their standard answers:

| What fails | Standard defence |
| --- | --- |
| An app server crashes | Stateless servers behind a load balancer with health checks; the balancer stops sending traffic to it |
| The cache node dies or is emptied | Requests fall through to the database; protect it with request coalescing so a thousand misses become one query |
| The primary database fails | Promote a replica (failover); accept a short write outage or a few seconds of lost writes, depending on replication mode |
| A downstream service is slow | Timeouts, retries with backoff and jitter, circuit breakers, and a fallback response |
| A traffic spike | Autoscaling, a queue to absorb writes, rate limiting to protect the system |

### Wrapping up

In the last two minutes, give a **60-second summary**: the requirements you designed for, the main components,
the two or three key decisions and their trade-offs, and what you would do next with more time ("add multi-region
replication, a ranking model for the feed, abuse detection"). Ending with a crisp summary leaves the interviewer
with a clear picture of what you built, which is what they will write up.

### Talking about trade-offs

Almost every choice in system design gives something up. A useful sentence shape is: **"I chose X over Y because
of requirement Z; the cost is W, which is acceptable because..."** The classic trade-offs to have ready:

| Trade-off | One side | Other side |
| --- | --- | --- |
| Consistency vs availability | Every read sees the latest write (banking) | Always answer, possibly stale (feeds, likes) |
| Latency vs freshness | Serve from cache, fast | Read the source of truth, slower but exact |
| Push vs pull | Do the work at write time; reads are fast | Do the work at read time; writes are cheap |
| SQL vs NoSQL | Joins, transactions, a flexible query language | Easy horizontal scaling, flexible schema, simple key access |
| Synchronous vs asynchronous | Simple, the user sees the result now | Resilient to spikes, but the result arrives later |
| Normalised vs denormalised | One copy of each fact, easy to update | Duplicated data, fast reads without joins |

## 9. Building blocks glossary

These are the parts you will assemble in nearly every answer. Know what each is for, its main trade-off, and one
or two details. The linked case studies cover each in depth.

**Load balancer.** Sits in front of a group of identical servers and spreads incoming requests across them, so
you can add servers to handle more traffic and lose one without an outage. It uses an algorithm such as round robin
or least connections, and health checks to stop sending traffic to broken servers. Deep dive:
[Design a load balancer](/system-design/case-studies/easy/load-balancer/).

**Cache.** A fast, in-memory copy of data that is expensive to fetch or compute, such as Redis or Memcached. It
cuts latency and database load dramatically for read-heavy workloads, at the cost of possibly stale data and the
hard question of when to invalidate. The common pattern is **cache-aside**: read the cache, on a miss read the
database and fill the cache. Deep dive: [Design a distributed cache](/system-design/case-studies/easy/distributed-cache/).

**CDN (content delivery network).** A worldwide network of servers that keep copies of static content (images,
video, scripts) close to users. A user in Mumbai downloads from a server in Mumbai instead of crossing an ocean,
which cuts latency and takes most bandwidth off your own servers. Deep dive:
[Design a CDN](/system-design/case-studies/easy/cdn/).

**Message queue.** A durable buffer between a producer of work and the workers that do it, such as Kafka,
RabbitMQ or SQS. It lets the user get a fast reply while slow work happens later, absorbs traffic spikes, and lets
each side scale and fail independently. Most queues deliver **at least once**, so consumers must be idempotent.
Seen in practice: [Design an email service](/system-design/case-studies/medium/email-service/).

**SQL vs NoSQL.** Relational (SQL) databases such as PostgreSQL and MySQL give tables with a fixed schema, joins
and transactions; they are the safe default for structured data with relationships. NoSQL stores (key-value,
document, wide-column such as Cassandra) trade some of that for simple access by key, flexible schemas and easy
horizontal scaling. Choose by access pattern and scale, not fashion. Deep dive:
[Design a distributed key-value store](/system-design/case-studies/easy/distributed-key-value-store/).

**Sharding (partitioning).** Splitting one large dataset across many machines, each holding a slice, so storage
and traffic grow beyond one server. The crucial decision is the **shard key**: a good key (such as `user_id`)
spreads load evenly and keeps each query on one shard; a bad one creates hot shards or forces queries to ask every
shard. Seen in practice: [Design a URL shortener](/system-design/case-studies/easy/url-shortener/).

**Replication.** Keeping copies of the same data on several machines, for durability (a disk dies, the data
survives) and for read scaling (replicas serve reads). With **leader-follower** replication one node takes writes
and copies them to followers; asynchronous copying is fast but a follower may lag a little, so a read right after
a write may look stale. Deep dive: [Design a distributed key-value store](/system-design/case-studies/easy/distributed-key-value-store/).

**Consistent hashing.** A way to map keys to servers so that adding or removing a server moves only a small share
of the keys, instead of reshuffling almost all of them as `hash(key) % N` does. Servers and keys are placed on a
ring, and each key belongs to the next server clockwise; "virtual nodes" smooth out the load. Deep dive:
[Design a distributed cache](/system-design/case-studies/easy/distributed-cache/).

**Rate limiting.** Capping how many requests a client may make in a time window, to protect the system from abuse,
bugs and overload. Common algorithms are the token bucket and the sliding window; the limiter usually sits in the
load balancer or API gateway and answers `429 Too Many Requests`. Seen in practice:
[Design a load balancer](/system-design/case-studies/easy/load-balancer/) and
[Design an authentication system](/system-design/case-studies/easy/authentication-system/).

## 10. Common mistakes

1. **Designing before clarifying.** Jumping straight to "we'll use Kafka and Cassandra" before knowing what the
   system does. Spend the first five minutes on requirements, every time.
2. **Estimating without concluding.** Pages of arithmetic that never change the design. Every number should end in
   "so we need...".
3. **Buzzword architecture.** Adding microservices, Kafka, Kubernetes and three databases to a problem that a load
   balancer, a few servers and one database would solve. Complexity must be earned by a requirement.
4. **Going deep too early.** Twenty minutes on the database schema with no end-to-end design. Get the whole
   picture on the board first, then zoom in.
5. **Staying shallow everywhere.** The opposite failure: a neat diagram of boxes, but no detail on how any of them
   actually works. Pick two and go deep.
6. **Silence.** Thinking quietly for minutes. The interviewer can only score what they hear; think out loud, even
   when unsure ("I'm weighing two options here...").
7. **Ignoring hints.** When the interviewer asks "what happens if this server dies?", that is a direction, not
   small talk. Follow it.
8. **One-sided answers.** Presenting a choice with no downside. Every choice has a cost; name it before you are
   asked.
9. **Forgetting failure.** A design that only works when every machine is healthy. Mention redundancy, retries
   and what degrades gracefully.
10. **Running out of time.** No summary, no bottlenecks. Keep an eye on the clock and use the time budget.

## 11. What interviewers score

Companies use their own rubrics, but most cover the same areas. Here is what tends to separate a strong answer
from a weak one:

| Area | Strong signal | Red flag |
| --- | --- | --- |
| Problem exploration | Asks focused questions, writes down scope, states assumptions | Starts drawing immediately, or asks questions forever |
| Estimation and scale | Rough numbers with clear assumptions that lead to decisions | No numbers, or numbers that change nothing |
| High-level design | A complete, working system that serves every core requirement | Missing pieces, or boxes with no clear purpose |
| Depth | Explains how a component really works and the options for it | Names technologies without explaining them |
| Trade-offs | Compares options and justifies the choice against requirements | "It's the best", or a single option with no alternatives |
| Reliability and scaling | Spots bottlenecks and failure modes unprompted | Only works on the happy path |
| Communication | Leads the conversation, structures the board, adapts to hints | Silent, disorganised, or defensive when challenged |

**Expectations rise with seniority.** A junior candidate is expected to produce a sound working design with some
help. A mid-level candidate should drive most of the interview and go deep on at least one area. A senior or staff
candidate is expected to lead the whole conversation, pick the right deep dives without prompting, and discuss
operations, evolution over time and organisational trade-offs as well as technical ones.

## 12. Practise the framework

The framework only becomes automatic with practice. Take a case study, cover the page, set a 45-minute timer and
answer out loud (or with a friend playing interviewer), then compare your answer with the page. Good ones to start
with:

- [URL shortener](/system-design/case-studies/easy/url-shortener/): the classic first problem; ID generation and caching.
- [Search autocomplete](/system-design/case-studies/easy/search-autocomplete/): tries, precomputation and very low latency.
- [Load balancer](/system-design/case-studies/easy/load-balancer/) and [CDN](/system-design/case-studies/easy/cdn/): the building blocks themselves.
- [Distributed cache](/system-design/case-studies/easy/distributed-cache/) and [distributed key-value store](/system-design/case-studies/easy/distributed-key-value-store/): sharding, replication, consistent hashing.
- [Authentication system](/system-design/case-studies/easy/authentication-system/) and [UPI payments](/system-design/case-studies/easy/upi/): security, correctness and idempotency.
- [Parking garage](/system-design/case-studies/easy/parking-garage/) and [vending machine](/system-design/case-studies/easy/vending-machine/): object-oriented design rounds.
- [Email service](/system-design/case-studies/medium/email-service/): a larger system with several pipelines.

## Checklist for the night before

**The six steps, with a 45-minute budget**

1. **Clarify (5 min):** 3–5 functional requirements, the non-functional ones with numbers, and out of scope.
   State assumptions when told "you decide".
2. **Estimate (3–5 min):** QPS = per day ÷ $10^5$, ×3 for peak. Storage = items × size × retention. Bandwidth =
   QPS × response size. End with a conclusion (read-heavy? fits on one machine?).
3. **API and data model (5–8 min):** a few endpoints with cursor pagination and idempotency keys; tables from
   access patterns; where each piece lives; the shard key.
4. **High-level design (10 min):** start from client → CDN / load balancer → stateless app servers → cache →
   database (+ replicas), queue → workers → object storage. Trace one read and one write.
5. **Deep dives (12–15 min):** two or three components; each one is problem → options → comparison → choice.
6. **Bottlenecks and wrap-up (5 min):** single points of failure, hot spots, growth, failure handling; a
   60-second summary and next steps.

**Numbers to remember**

- 1 day ≈ $10^5$ s; 1M requests a day ≈ 12/s; 1B a day ≈ 12,000/s.
- KB, MB, GB, TB, PB = $10^3, 10^6, 10^9, 10^{12}, 10^{15}$ bytes.
- Memory ~100 ns, SSD read ~100 µs, same data centre round trip ~0.5 ms, cross-continent ~150 ms.

**Sentences that help**

- "Before I design anything, can I check what's in scope?"
- "I'll assume ..., let me know if that's off."
- "So this is read-heavy, which means caching will carry most of the load."
- "There are two options here. X gives us ..., Y gives us .... Given that we need ..., I'd pick X."
- "The weak point in this design is ...; I'd fix it with ...."
- "To summarise: ..."

**Remember:** clarify before designing, numbers must lead to decisions, simple first then deeper, every choice has
a cost, think out loud, and watch the clock.
