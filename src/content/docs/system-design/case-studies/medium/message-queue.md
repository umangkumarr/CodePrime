---
title: "Design a Distributed Message Queue (like Kafka)"
description: "Design a Kafka-style distributed log: partitions and keys, segment files, replication with in-sync replicas, consumer groups, offsets and exactly-once delivery."
difficulty: "Medium"
sidebar:
  label: "Message queue (like Kafka)"
tags: ["Queues", "Replication", "Storage", "Streaming", "Consensus"]
---

Almost every large system has a message queue in the middle of it. The orders service publishes "order
placed", and billing, email, analytics and search each react in their own time. A message queue is the
**post room** of a company: senders drop letters in, the post room keeps them safe, and each department
collects its own mail when it is ready, even if it was out for lunch when the letter arrived.

This case study designs a distributed message queue in the style of **Apache Kafka**, the open-source system
created at LinkedIn and now used very widely. We start with why queues exist and the one idea that makes Kafka
different (a queue that is really a **log**), then build the storage, replication, consumer and delivery
layers one at a time.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Message queues in 5 minutes

### Why put a queue between services?

Imagine the orders service calls billing, email and analytics directly, one after the other. Three problems
appear at once:

- **Coupling.** If the email service is down, placing an order fails. Every new consumer means changing the
  orders service.
- **Speed mismatch.** A flash sale produces 50,000 orders a second, but analytics can only handle 5,000. Direct
  calls either time out or overload analytics.
- **Fan-out.** The same event is needed by many teams. Calling each of them is slow and fragile.

A queue fixes all three. The producer writes the event **once** and moves on. The queue stores it durably.
Each consumer reads at its own pace.

| Benefit | What it means | Everyday analogy |
| --- | --- | --- |
| **Decoupling** | Producers and consumers do not know about each other and need not be up at the same time | Leaving a letter at the post room instead of waiting at someone's desk |
| **Buffering** | Bursts are absorbed; consumers catch up later | A reservoir that fills in the storm and drains slowly |
| **Fan-out** | Many independent readers get the same message | A notice pinned to a board that everyone can read |
| **Replay** | A reader can go back and read old messages again (log-style queues only) | Rewinding a recording |

### The vocabulary

| Term | Meaning |
| --- | --- |
| **Message / record** | One event: an optional **key**, a **value** (bytes), a timestamp and optional headers |
| **Producer** | A client that writes records |
| **Consumer** | A client that reads records |
| **Broker** | One server in the queue cluster that stores data and serves clients |
| **Topic** | A named stream of records, such as `orders` or `page-views` |
| **Partition** | A topic is split into partitions; each is an ordered, append-only log stored on brokers |
| **Offset** | The position of a record in its partition: 0, 1, 2, … It never changes |
| **Consumer group** | A set of consumers that share the work of reading a topic |

### Queue or log? The idea that changes everything

There are two families of message systems, and the difference is **what happens after a message is read**.

| | Classic queue (RabbitMQ classic queues, Amazon SQS) | Log (Kafka, Pulsar, Kinesis) |
| --- | --- | --- |
| After a consumer handles a message | It is **acknowledged and deleted** | It **stays**; the consumer just moves its **offset** forward |
| How long data lives | Until consumed | For a configured **retention** (for example 7 days) whether read or not |
| Many readers of the same data | Needs a copy of the queue per reader | Free: each reader keeps its own offset |
| Replay after a bug | Impossible, the messages are gone | Reset the offset and read again |
| Ordering | Usually per queue, weakened by redeliveries and parallel consumers | Strict **within a partition** |
| Per-message work for the broker | Track the state of every message (in flight, acked, redeliver) | Track one number per reader per partition |

A log is like a **book**, and each reader has a **bookmark**. The book does not care who has read which page. A
classic queue is like a **to-do pile**: once a task is done it is thrown away.

[![One orders topic stored as an append-only log with offsets 0 to 1045; three consumer groups read it independently: Billing from offset 1043, Analytics catching up from 981, and the search indexer up to date waiting for new records](/img/system-design/message-queue/01-log-fanout.png)](/img/system-design/message-queue/01-log-fanout.png)

Because the broker only keeps a bookmark per reader, adding a tenth consumer group costs almost nothing, a slow
reader never slows a fast one, and a team that shipped a bug can rewind and reprocess yesterday's data. This
case study designs the **log** style, because that is what "design Kafka" means, but we will point out where a
classic queue would behave differently.

## 2. Requirements

### Functional

- **Produce**: write records to a named topic, optionally with a key.
- **Consume**: read records in order, starting from any offset (oldest, newest, or a saved position).
- **Consumer groups**: many consumers share a topic's partitions; many groups read the same topic independently.
- **Ordering**: records with the same key are read in the order they were written.
- **Retention**: keep data for a time or size limit, or keep only the latest value per key (**compaction**).
- **Delivery guarantees**: at-least-once by default, with an option for exactly-once processing.
- **Admin**: create topics, choose partition count and replication factor, add brokers.

### Non-functional

| Property | Target | Why it matters |
| --- | --- | --- |
| **Throughput** | Millions of records per second per cluster | Clickstreams, logs and metrics are huge |
| **Latency** | A few milliseconds from produce to consume at the median, tens of ms at p99 | Used for real-time pipelines |
| **Durability** | An acknowledged record survives the loss of any one broker (or more, with a higher replication factor) | Lost orders or payments are unacceptable |
| **Availability** | Keep serving when brokers fail | It sits on the critical path of many services |
| **Scalability** | Add brokers and partitions without downtime | Traffic only grows |
| **Ordering** | Strict order per partition | Events about one entity must be applied in order |

### Out of scope

Stream processing frameworks (Kafka Streams, Flink), schema registries, connectors to databases, security
details (TLS, ACLs) and multi-region replication tools. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** **1 million** records per second on average, **1 KB** each, peak **3×** average.
Replication factor **3**. Retention **7 days**. **3** consumer groups read everything.

**Traffic**

- Producer ingress: $10^6 \times 1\text{ KB} = 1\text{ GB/s}$ on average, **3 GB/s** at peak.
- Replication: each byte is copied to 2 followers, so **2 GB/s** flows between brokers.
- Disk writes across the cluster: $1 + 2 = 3\text{ GB/s}$.
- Consumer egress: $3 \text{ groups} \times 1\text{ GB/s} = 3\text{ GB/s}$, mostly served from memory (see
  section 8).

**Storage**

- Per day: $1\text{ GB/s} \times 86{,}400\text{ s} = 86.4\text{ TB}$.
- For 7 days: $86.4 \times 7 \approx 605\text{ TB}$, and with 3 replicas about **1.8 PB**.
- If each broker has about 30 TB of usable disk: $1.8\text{ PB} / 30\text{ TB} = 60$ brokers.

**Is network or disk the limit?** Spread over 60 brokers, each one receives $3\text{ GB/s} / 60 = 50\text{ MB/s}$
of writes on average and sends about $5\text{ GB/s} / 60 \approx 83\text{ MB/s}$ (replication plus consumers).
A 10 Gbit/s network card moves about 1.25 GB/s, so the network is nowhere near full.

Three conclusions follow:

1. **Retention, not traffic, decides the cluster size here.** That is why newer Kafka versions offer
   **tiered storage**: keep the last day on broker disks and move older segments to cheap object storage
   such as S3. With one day local, about $86.4 \times 3 \approx 260\text{ TB}$ stays on brokers, and the
   cluster can shrink until network and CPU become the limit (roughly 20 brokers for the assumed peak traffic).
2. **Compression pays twice.** Producers compress whole batches (gzip, Snappy, LZ4 or zstd), so the saving
   applies to the network, the disk and every replica.
3. **Partition count comes from consumer speed.** If one consumer instance can process 5 MB/s, keeping up with a
   3 GB/s peak needs $3000 / 5 = 600$ partitions in total, because a partition is read by at most one member of
   a group at a time (section 10).

## 4. The API

Clients talk to brokers over a binary protocol on TCP, but the operations are easy to state:

| Operation | What it does |
| --- | --- |
| `produce(topic, key, value, headers)` | Append a record. The client library picks the partition and batches records. Returns `(partition, offset)` once acknowledged. |
| `fetch(topic, partition, offset, max_bytes)` | Return records starting at `offset`. Consumers **pull**; the broker never pushes. |
| `commit(group, {partition: offset})` | Save the group's position: "everything before this offset is done". |
| `join_group(group, topics)` | Join a consumer group and receive a set of partitions to read. |
| `metadata(topics)` | Which brokers lead which partitions. Clients cache this and refresh it on errors. |
| `create_topic(name, partitions, replication_factor, config)` | Admin call. |

Why **pull** instead of push? A consumer asks for more only when it is ready, so a slow consumer can never be
flooded. It also lets a consumer fetch large batches at once, and rewind simply by fetching an older offset.
To avoid busy polling, a fetch can **wait on the broker** for up to a few hundred milliseconds until enough data
arrives (a *long poll*).

## 5. High-level design

[![Architecture following one partition: producers send batches to Broker 1, the leader of partition P0; the KRaft controller quorum tells brokers who leads what; Brokers 2 and 3 replicate P0 as in-sync followers; consumer groups A and B fetch from the leader at their own offsets](/img/system-design/message-queue/02-architecture.png)](/img/system-design/message-queue/02-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does:

- **Producers** batch records, choose a partition by key, and send each batch to that partition's **leader**.
- **Brokers** store partition replicas on local disk. For each partition, one replica is the **leader**
  (handles all writes and, by default, reads) and the others are **followers** that copy it. Every broker leads
  some partitions and follows others, so the load is spread out.
- **Controller quorum** (KRaft): a small group of nodes, usually 3 or 5, that decides cluster metadata: which
  brokers are alive, which replica leads each partition, topic configurations. Section 12 explains it.
- **Consumer groups** pull from leaders. Each group has a **group coordinator** (one of the brokers) that
  tracks members and their committed offsets.

The design rests on three simple ideas, each covered in its own section: **split topics into partitions** to
scale (section 6), **store each partition as an append-only file** to be fast (section 8), and **copy each
partition to several brokers** to be safe (section 9).

## 6. Topics, partitions and keys

One log on one machine cannot take millions of writes a second, and it cannot be read by many machines in
parallel. So a topic is cut into **partitions**, and partitions are spread across brokers. A topic with 600
partitions can be written and read by hundreds of machines at once.

The price: **ordering is only guaranteed within one partition**. Record 7 in partition 0 and record 7 in
partition 1 have no defined order between them.

That is why records carry a **key**. The producer's partitioner sends every record with the same key to the same
partition, usually `hash(key) mod number_of_partitions` (Kafka's default uses the murmur2 hash). All events for
user 42 then land in one partition, in the order they were written, and are read in that order.

[![The producer sends records keyed by user_id to the partitioner, which applies hash(key) mod 3; all of user 42's records go to partition 1; Consumer 1 owns partitions 0 and 1, and Consumer 2 owns partition 2](/img/system-design/message-queue/03-partitions.png)](/img/system-design/message-queue/03-partitions.png)

*Select the diagram to zoom in and move around.*

Choosing keys and partition counts is where interviews often probe:

- **No key**: records are spread for balance (recent Kafka clients fill a batch for one partition, then move to
  the next, the "sticky" partitioner). No ordering across records, best throughput.
- **Key = entity ID** (user, order, account): per-entity ordering. This is the usual answer.
- **Hot keys**: if one key is very busy (a celebrity, a huge customer), its partition becomes a hot spot. Fixes:
  add a suffix to spread that key over a few partitions (giving up strict order for it), or handle it
  separately.
- **Changing the partition count** changes `hash mod N`, so keys move to different partitions and ordering
  breaks during the change. Pick a generous count up front; adding partitions later is possible but should be
  planned.
- **Too many partitions** cost memory, open files and longer failover, so do not create thousands "just in case".

## 7. Producers: batching, acks and idempotence

### Batching

Sending each 1 KB record on its own would mean a million network requests a second. Instead, the producer
library collects records per partition into a **batch** and sends it when it is full (`batch.size`) or after a
short wait (`linger.ms`, a few milliseconds). One request then carries hundreds of records, compressed
together. Batching trades a few milliseconds of latency for a large gain in throughput, and it is the single
biggest reason Kafka is fast.

### acks: when does the producer hear "OK"?

The producer chooses how much durability it wants per write:

| Setting | The leader replies when… | Risk | Typical use |
| --- | --- | --- | --- |
| `acks=0` | Never; the producer does not wait | Lost if anything fails | Metrics where loss is fine |
| `acks=1` | The leader has written it to its own log | Lost if the leader dies before followers copy it | Logs, older default |
| `acks=all` | **Every in-sync replica** has it | Lost only if all in-sync replicas fail together | Anything important; the default since Kafka 3.0 |

`acks=all` is only as strong as the number of replicas still in sync. If both followers fall behind, the
in-sync set shrinks to the leader alone and "all" means "one". The broker setting **`min.insync.replicas`**
closes this gap: with replication factor 3 and `min.insync.replicas=2`, a write is refused unless at least two
replicas have it. This combination, **RF = 3, min ISR = 2, acks = all**, is the standard durable setup: it
survives one broker failure without losing data or stopping writes.

Section 9 shows exactly how an `acks=all` write flows.

### Retries and the idempotent producer

Networks fail in the worst possible place: the leader writes the batch, then the reply is lost. The producer
retries, and without protection the batch is written **twice**.

The **idempotent producer** (on by default since Kafka 3.0) fixes this with two numbers. On start-up the
producer gets a **producer ID** from the cluster. It then numbers every batch it sends to each partition with
a **sequence number**: 0, 1, 2, … The leader remembers the last sequence number it accepted from each producer
for each partition. A retried batch carries the same number, so the leader recognises the duplicate,
acknowledges it, and does not append it again. Sequence numbers also catch gaps, so retries cannot reorder
batches.

Think of it as numbering the pages you post: if page 5 arrives twice, the receiver throws the second copy away.

## 8. Storage: why an append-only log is so fast

Disks are slow at **random** access and fast at **sequential** access. Even a spinning disk can stream
hundreds of MB/s when it reads or writes one long run of bytes, but only a few hundred random operations a
second. A message log only ever **appends to the end** and consumers mostly **read forward**, so almost all
I/O is sequential. That one fact explains most of Kafka's performance.

### Segment files

Each partition is a directory on the broker's disk, for example `orders-0/`. Inside, the log is split into
**segments**, each about 1 GB by default, named after the first offset they hold:

```text
orders-0/
  00000000000000000000.log        records with offsets 0 .. 368,768
  00000000000000000000.index      sparse map: offset -> byte position in the .log
  00000000000000000000.timeindex  sparse map: timestamp -> offset
  00000000000000368769.log        the active segment (the only one being written)
  00000000000000368769.index
  00000000000000368769.timeindex
```

- Only the newest, **active** segment is written to. Older segments are **immutable**, which makes them safe to
  cache, copy and delete.
- **Retention** is cheap: deleting old data means deleting whole old segment files, not rewriting anything.
- **Finding offset 500,000:** pick the segment whose first offset is just below it (a binary search over file
  names), look up the nearest entry in its `.index` (which holds one entry roughly every 4 KB of log, so it is
  small enough to stay in memory), then scan forward a few KB in the `.log`.

### Page cache and zero-copy

[![On a broker, the producer's record batch is appended through a write call into the OS page cache, which flushes to segment files on disk later; a consumer's fetch from offset 500 is served from the page cache straight to the network socket with sendfile, without copying into the broker process](/img/system-design/message-queue/04-storage.png)](/img/system-design/message-queue/04-storage.png)

*Select the diagram to zoom in and move around.*

Two operating-system features do much of the work:

- **The page cache.** When the broker writes, the data lands in the kernel's page cache (RAM) and is flushed to
  disk in the background. Kafka does not keep its own large in-memory cache; it lets the OS do it. Consumers
  that are up to date read records written seconds ago, which are still in the page cache, so most reads never
  touch the disk. Durability comes from **replication to other machines**, not from forcing every write to disk
  (`fsync`), which would be slow.
- **Zero-copy (`sendfile`).** A normal server copies data from the page cache into its own memory, then back
  into a socket buffer. With `sendfile`, the broker tells the kernel "send bytes X to Y of this file to this
  socket", and the data goes from the page cache to the network card without passing through the broker
  process. This works because records are stored on disk in exactly the format sent on the wire. (When the
  connection uses TLS, the bytes must be encrypted in user space, so this shortcut is lost.)

Together, batching, sequential I/O, the page cache and zero-copy let a single broker move hundreds of MB per
second on ordinary hardware.

## 9. Replication: leaders, followers and the high-water mark

Every partition has a **replication factor** (RF), typically 3: one leader and two followers on different
brokers (and ideally different racks or availability zones).

- **Followers pull** from the leader, just like consumers: "give me records from offset 100".
- The **in-sync replica set (ISR)** is the leader plus every follower that has caught up recently. A follower
  that falls behind for longer than `replica.lag.time.max.ms` (30 seconds by default in recent versions) is
  removed from the ISR; when it catches up, it is added back.
- Each replica has a **log end offset (LEO)**: the offset of the next record it will write.
- The **high-water mark (HW)** is the smallest LEO among the ISR: every record below it is on every in-sync
  replica. Records below the HW are **committed**. Consumers can only read committed records, so they never
  see a record that might later disappear.

[![Sequence for acks=all: the producer sends 10 records to the leader, which appends offsets 100 to 109; both followers fetch from 100 and receive the records; when both fetch from 110, the leader knows every in-sync replica has 109, moves the high-water mark to 110 and acknowledges the producer; a consumer fetching from 100 then receives records 100 to 109](/img/system-design/message-queue/05-produce.png)](/img/system-design/message-queue/05-produce.png)

*Select the diagram to zoom in and move around.*

Notice how the leader learns that a follower has a record: the follower's **next fetch** asks for a later
offset. No separate "ack" message is needed. When all ISR members have passed offset 109, the HW moves to 110,
the producer gets its `acks=all` reply, and consumers can read the batch.

### When a leader dies

[![Leader election workflow: the leader fails, the controller notices missed heartbeats and checks whether any in-sync replica is alive; if yes it elects one with no data loss, bumps the leader epoch to fence the old leader and clients refresh metadata; if the ISR is empty and unclean election is enabled it elects a lagging replica and loses records, otherwise the partition stays offline until an ISR replica returns](/img/system-design/message-queue/06-leader-election.png)](/img/system-design/message-queue/06-leader-election.png)

*Select the diagram to zoom in and move around.*

- **Clean election.** The controller picks a new leader **from the ISR**. Every ISR member has every committed
  record, so nothing acknowledged is lost.
- **Leader epoch.** Each new leader gets a higher **epoch** number. If the old leader was only cut off (not
  dead) and comes back, its requests carry an old epoch and are rejected. Followers also use the epoch to cut
  off any uncommitted records the old leader wrote that the new leader never had, so all replicas agree again.
- **Unclean election: the real trade-off.** If every ISR member is gone, the only live replicas are lagging
  ones. Two choices:
  - **Wait** (the default, `unclean.leader.election.enable=false`): the partition is unavailable until an ISR
    replica comes back. **Consistency over availability.**
  - **Elect a lagging replica**: the partition is back at once, but records it never copied are lost forever,
    even ones that were acknowledged. **Availability over consistency.**
  Payment events should wait; a click-stream for dashboards may prefer to keep flowing.

This is the CAP theorem in miniature: during a failure you must pick between refusing service and risking
data.

## 10. Consumer groups and rebalancing

### Sharing the work

A **consumer group** is a team of consumers that split a topic between them. The rule is simple: **each
partition is read by exactly one member of the group** at a time. A member may own several partitions.

- 6 partitions, 3 consumers: 2 partitions each.
- 6 partitions, 6 consumers: 1 each, the maximum parallelism.
- 6 partitions, 8 consumers: 2 consumers sit idle. **The partition count caps a group's parallelism**, which
  is why section 3 sized partitions from consumer speed.

Because one partition goes to one consumer, records with the same key are processed in order by a single
process. Different groups are completely independent: billing and analytics each get every record.

### Rebalancing

When a consumer joins, leaves or crashes (detected by missed **heartbeats**), the partitions must be shared
out again. This is a **rebalance**.

[![Rebalance sequence: Consumer B sends JoinGroup to the group coordinator; Consumer A is told to rebalance in its heartbeat reply, commits its offsets which the coordinator appends to the offsets topic, and rejoins; A is chosen as group leader, computes the plan A gets P0 and P1, B gets P2, and sends it with SyncGroup; B receives P2, asks for its committed offset and resumes from 731](/img/system-design/message-queue/07-rebalance.png)](/img/system-design/message-queue/07-rebalance.png)

*Select the diagram to zoom in and move around.*

In the classic protocol shown above (some replies are left out), one consumer is chosen as the **group leader**
and runs the assignment strategy (range, round-robin or sticky); the coordinator just distributes the result.
The new owner of a partition starts reading from the group's **last committed offset**.

Rebalances used to be painful: in the original "eager" protocol **every** member stopped and gave up **all** its
partitions, even ones that would not move, so the whole group paused. Improvements worth knowing:

- **Cooperative (incremental) rebalancing:** only the partitions that actually move are revoked; the rest keep
  flowing.
- **Static membership:** a consumer with a fixed `group.instance.id` can restart (for example during a rolling
  deploy) without triggering a rebalance, as long as it returns within the session timeout.
- **The newer consumer group protocol (KIP-848),** generally available in Kafka 4.0, moves assignment to the
  broker-side coordinator and makes rebalances incremental by design.

## 11. Offsets and delivery semantics

A consumer's **committed offset** is its bookmark: "I have finished everything before offset 1043 in
partition 0". Kafka stores these bookmarks in an internal, compacted topic called `__consumer_offsets`, so they
are replicated like any other data.

**When** you commit, relative to processing, decides your guarantee:

| Guarantee | Order of steps | If the consumer crashes in the middle | Use when |
| --- | --- | --- | --- |
| **At-most-once** | Commit, then process | Records committed but not processed are **skipped** | Losing a few is fine (metrics sampling) |
| **At-least-once** | Process, then commit | Records processed but not committed are **processed again** | The usual choice; make processing idempotent |
| **Exactly-once** | Process and commit **atomically** | Nothing lost, nothing applied twice | Read from Kafka, write to Kafka, money-like counts |

### At-least-once plus idempotence

The practical default is at-least-once with an **idempotent consumer**: processing the same record twice has the
same effect as once. Examples: an upsert keyed by `order_id` instead of an insert, or storing processed record
IDs (or the offset itself) in the same database transaction as the result.

### Exactly-once with transactions

For pipelines that **read from Kafka, process, and write back to Kafka**, Kafka offers exactly-once semantics
built from the idempotent producer plus **transactions**.

[![Exactly-once sequence: the stream app initialises with its transactional.id, fencing older copies; it begins a transaction and writes pending results to the output partition, which a read_committed downstream consumer cannot see yet; it adds its input offsets to the transaction and commits; the transaction coordinator writes a COMMIT marker, committing the offsets atomically, and the downstream consumer then receives the committed results](/img/system-design/message-queue/08-transactions.png)](/img/system-design/message-queue/08-transactions.png)

*Select the diagram to zoom in and move around.*

How it works, at a high level:

1. The app has a stable **`transactional.id`**. On start, the **transaction coordinator** (a broker) bumps its
   epoch, which **fences** any older "zombie" copy of the app still running somewhere.
2. The app writes its output records and, in the same transaction, the **offsets of the input records** it
   consumed.
3. On commit, the coordinator writes **commit markers** into every partition the transaction touched. Its own
   state lives in another internal topic, `__transaction_state`.
4. Downstream consumers with `isolation.level=read_committed` only see records from committed transactions.
   Aborted records are skipped.

Either the outputs **and** the input offsets are committed together, or neither is. A crash before the commit
means the transaction is aborted and the input is read again, with no duplicate output visible.

The honest caveat for interviews: this is exactly-once **inside Kafka**. If processing also sends an email or
charges a card, those side effects can still happen twice; they need their own idempotency keys.

## 12. The controller and metadata: from ZooKeeper to KRaft

Someone must decide which broker leads each partition, notice dead brokers, and store topic configurations.
This is the **controller**.

- **Before:** Kafka used **Apache ZooKeeper**, a separate coordination service, to store metadata and elect one
  broker as controller. This meant running and securing a second distributed system, and on failover the new
  controller had to load all metadata from ZooKeeper, which was slow for clusters with many partitions.
- **Now: KRaft** (Kafka Raft, KIP-500). A small quorum of **controller nodes** runs the **Raft consensus
  algorithm** over an internal **metadata log**. Every metadata change (a new topic, a new leader, an ISR
  change) is a record in that log. Brokers follow the log and keep an up-to-date copy in memory, the same way
  followers replicate a partition. Raft elects one **active controller**; if it dies, another quorum member
  that already has the whole log takes over quickly.

KRaft became production-ready in Kafka 3.3, and Kafka 4.0 removed ZooKeeper support entirely. The lesson is
general: **Kafka now stores its own metadata as a replicated log**, using the same idea as everything else in the
system.

In KRaft, brokers send **heartbeats** to the active controller. A broker that misses them for longer than its
session timeout is **fenced**, and the controller moves leadership of its partitions to other ISR members, as in
the leader-election diagram.

## 13. Retention and log compaction

A log cannot grow forever. Each topic chooses a **cleanup policy**:

| Policy | What is kept | Example |
| --- | --- | --- |
| **delete** (default) | Everything newer than the time limit (default **7 days**) or size limit; whole old segments are deleted | Click events, logs, orders stream |
| **compact** | At least the **latest record for every key**; older values of the same key are removed in the background | Current price per product, user settings, a database change stream |
| **compact + delete** | Latest per key, and nothing older than the time limit | Session state that expires |

**Log compaction** turns a topic into a durable table. A background cleaner rewrites old (non-active) segments,
keeping only the newest record for each key. A new service can read the compacted topic from offset 0 and
rebuild the **full current state** without replaying years of history. To delete a key, a producer writes a
**tombstone**: the key with a `null` value. The tombstone is kept for a while (`delete.retention.ms`) so readers
see the delete, then it is removed too. Offsets never change during compaction; some offsets simply have no
record any more.

`__consumer_offsets` is itself a compacted topic: only the latest committed offset per group and partition
matters.

## 14. Back-pressure: when consumers cannot keep up

A log handles slow consumers better than most systems, because the broker does not care how far behind a reader
is. Still, every layer needs a plan:

- **Consumers pull**, so a slow consumer is never pushed more than it asks for. Its **lag** (the newest offset
  minus its committed offset) grows instead. **Consumer lag is the key health metric**: alert when it keeps
  growing, then add consumers (up to the partition count) or speed up processing.
- **Retention is the real deadline.** If a consumer is more than 7 days behind, the records it needs are
  deleted. Size retention with the longest outage you want to survive.
- **Producers** have a bounded memory buffer (`buffer.memory`). If brokers are slow and the buffer fills,
  `send()` blocks for up to `max.block.ms` and then fails, pushing the problem back to the application instead
  of using unlimited memory.
- **Brokers** enforce **quotas** per client: a client that exceeds its byte rate gets its responses delayed, so
  one noisy team cannot starve others.
- **Poison messages:** a record that always fails processing blocks its partition. Retry a few times, then move
  it to a **dead-letter topic** and continue.

Compare a classic queue: there, unread messages pile up on the broker itself, and a big backlog can slow the
broker down for everyone. In a log, a backlog is just a larger distance between two numbers.

## 15. What breaks as it grows, and how to fix it

**The hot partition.** One key (a viral product, a huge tenant) sends far more traffic than others. *Fix:* better
keys, a salted key for the hot entity, or a dedicated topic for it.

**Too few partitions.** Consumers cannot keep up because a group has more members than partitions. *Fix:* plan
partitions from target throughput; adding partitions later moves keys, so do it during a quiet period and
accept a short ordering break.

**Too many partitions.** Every partition replica is open files, memory and metadata. Failover of a broker
leading thousands of partitions takes longer. *Fix:* fewer, larger topics; KRaft also makes metadata
changes much faster than ZooKeeper did.

**Disk full from retention.** As section 3 showed, retention, not traffic, often sizes the cluster. *Fix:*
compression, shorter retention for low-value topics, and tiered storage to object storage.

**Uneven brokers.** New brokers start empty; old ones keep their partitions. *Fix:* reassign partitions in the
background with a throttle, so the copying does not hurt live traffic.

**Rebalance storms.** Large groups with frequent deploys pause constantly. *Fix:* cooperative rebalancing,
static membership, or the new consumer protocol; keep processing per poll short so heartbeats are not missed.

**A whole zone goes down.** *Fix:* rack-aware replica placement, so the three replicas of a partition sit in
three different availability zones. Cross-region copies are done by separate replication tools (such as
MirrorMaker 2) and are asynchronous.

## 16. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Consumed messages | Delete (queue) | Keep, track offsets (log) | **Log**: free fan-out, replay, simple broker |
| Ordering | Global | Per partition | **Per partition (per key)**: global order cannot scale |
| Delivery to consumers | Push | Pull | **Pull**: natural back-pressure, batching, rewind |
| Durability | `fsync` every write | Replicate, flush lazily | **Replicate**: several machines in RAM beat one disk in speed and survive machine loss |
| Producer acks | `acks=1` | `acks=all` + min ISR 2 | **all**: no loss on one failure, a few ms slower |
| Leader with empty ISR | Wait | Elect lagging replica | **Wait** by default; allow unclean per topic only where loss is acceptable |
| Delivery guarantee | At-least-once | Exactly-once transactions | **At-least-once + idempotent consumers** by default; transactions for Kafka-to-Kafka pipelines |
| Metadata | External ZooKeeper | Built-in Raft log (KRaft) | **KRaft**: one system to run, faster failover |
| Old data | All on broker disks | Tiered to object storage | **Tiered** when retention is long |

## Cheat sheet for last-minute revision

- **Why a queue:** decoupling, buffering bursts, fan-out to many readers.
- **Queue vs log:** a queue deletes after ack; a log keeps records for a retention period and each consumer
  group keeps an **offset** (a bookmark). Logs give replay and cheap fan-out.
- **Topic → partitions → segments.** Order is guaranteed **per partition**; `hash(key) mod N` keeps one key in
  one partition.
- **Fast because:** batching + compression, append-only sequential I/O, OS page cache, zero-copy `sendfile`.
- **Producer:** `acks=0/1/all`; durable setup is **RF 3, `min.insync.replicas=2`, `acks=all`**. The idempotent
  producer (producer ID + per-partition sequence numbers) removes duplicates from retries.
- **Replication:** leader + followers that pull; **ISR** = caught-up replicas; **high-water mark** = smallest
  LEO in the ISR, the limit of what consumers can read. Leader epochs fence old leaders.
- **Unclean leader election:** off = wait (consistency); on = elect a lagging replica (availability, data loss).
- **Consumer groups:** one partition → one member; partitions cap parallelism; rebalances on join/leave;
  cooperative rebalancing and static membership reduce pauses.
- **Semantics:** commit before = at-most-once; commit after = at-least-once; transactions (outputs + input
  offsets atomically, `read_committed`) = exactly-once inside Kafka.
- **Retention:** delete by time/size (default 7 days) or **compact** (latest value per key, tombstones delete).
- **Metadata:** ZooKeeper replaced by **KRaft**, a Raft-replicated metadata log; ZooKeeper removed in 4.0.
- **Back-pressure:** pull + consumer lag monitoring, producer buffer limits, broker quotas, dead-letter topics.
- **Numbers:** 1M msg/s × 1 KB = 1 GB/s; 86 TB a day; 7 days × RF 3 ≈ 1.8 PB; partitions ≥ peak throughput ÷
  per-consumer throughput.

## Practice questions

1. **How do you guarantee that all events for one order are processed in order?** Use `order_id` as the key so
   they land in one partition; one consumer in the group owns that partition, so it processes them in sequence.
   Keep the idempotent producer on so retries cannot reorder batches.
2. **A consumer group's lag keeps growing. What do you do?** Check whether lag is on all partitions (consumers
   too slow: add members up to the partition count, or speed up processing) or on one (a hot key or a poison
   message: fix the key or send the bad record to a dead-letter topic).
3. **Why can't you simply add consumers to go faster?** A partition is read by only one member of a group, so
   members beyond the partition count sit idle. You must add partitions, which remaps keys.
4. **A producer gets a timeout. Was the message written?** Maybe. Without idempotence, retrying may create a
   duplicate; with the idempotent producer, the retry carries the same sequence number and the broker discards
   the duplicate.
5. **How would you build delayed messages ("deliver in 30 minutes")?** A log has no per-message timers. Write
   to topics by delay bucket (1 minute, 5 minutes, 30 minutes); a consumer reads each bucket and only forwards a
   record when its due time has passed, otherwise it pauses that partition until then.
6. **When would you choose a classic queue (RabbitMQ, SQS) over a log?** For task queues where each job is done
   once and then forgotten, with per-message acknowledgements, retries, delays and priorities, and no need for
   replay or many independent readers. (Kafka is adding queue-style "share groups", KIP-932, to cover part of
   this case.)
