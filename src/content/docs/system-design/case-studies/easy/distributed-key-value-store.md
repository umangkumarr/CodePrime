---
title: "Design a Distributed Key-Value Store (like Dynamo / Cassandra)"
description: "Design a Dynamo-style key-value store: consistent hashing, N/R/W quorums, hinted handoff, vector clocks, Merkle-tree repair, gossip and an LSM storage engine."
difficulty: "Easy"
sidebar:
  label: "Key-value store (like Dynamo)"
tags: ["Databases", "Replication", "Consistent Hashing", "Consistency", "Storage"]
---

A key-value store is the simplest database there is. It remembers one thing: for a **key** (`cart:42`), a
**value** (the bytes of that shopping cart). You can `put` a value, `get` it back, and `delete` it. That is the
whole interface. A hash map in your favourite language already does this on one machine.

The interview question is what happens when one machine is not enough: too much data to fit, too many requests to
serve, and a business that loses money every second the store is down. Spread the hash map over a hundred
machines and, suddenly, you must decide which machine holds which key, how many copies to keep, what to do when a
machine dies mid-write, and what "the latest value" even means when two machines disagree. Amazon's Dynamo paper
(2007) answered these questions in a way that shaped Cassandra, Riak, ScyllaDB and many others. This case study
rebuilds that design from first principles.

It is a favourite question because almost every idea in it (consistent hashing, quorums, gossip, Merkle trees,
LSM trees, Bloom filters) appears again in other designs. Learn them here once.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Key-value stores in 5 minutes

On one machine, a key-value store is a hash map plus a file so data survives a restart. Distributing it adds a
handful of words you will use in every sentence of the interview:

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Node** | One server in the cluster, holding part of the data | One branch of a library |
| **Partitioning** (sharding) | Splitting the keys so each node holds only some of them | Books A–F in one branch, G–M in another |
| **Replication** | Keeping several copies of each key on different nodes | Three branches each keep a copy of a popular book |
| **Replica** | One node that holds a copy of a given key | A branch that has the book |
| **Coordinator** | The node that receives a client's request and talks to the replicas for it | The librarian at the front desk who phones the other branches |
| **Quorum** | The number of replicas that must answer before a request counts as done | "Two of the three branches confirmed" |
| **Eventual consistency** | Replicas may disagree for a short while, but converge if writes stop | A news story that reaches every branch's noticeboard within minutes |

The rest of the design answers three questions: **where does a key live** (partitioning), **how many copies and
who must agree** (replication and quorums), and **how do copies get back in step** after failures (hinted handoff,
read repair, anti-entropy).

## 2. CAP and PACELC in plain words

Before any boxes and arrows, an interviewer wants to know you understand the trade-off that shapes the whole
store.

**CAP.** A network **partition** is when some nodes cannot talk to others: a switch fails, a cable is cut, a data
centre link drops. During a partition, a replicated store must choose between two behaviours:

- **Consistency (C):** every read sees the latest write. To guarantee that, a node cut off from the others must
  refuse requests (it cannot know whether it has missed a write).
- **Availability (A):** every request to a working node gets an answer. To guarantee that, a cut-off node must
  answer with whatever it has, which may be stale.

Partitions are not optional in a real network, so the real choice is **C or A when a partition happens**. Think of
two bank branches whose phone line is cut. Either they stop serving customers until the line is back (consistent),
or they keep serving and reconcile the books later (available).

**PACELC** adds the other half of life. **If** there is a **P**artition, choose **A** or **C**; **E**lse (normal
operation), choose between **L**atency and **C**onsistency. Even with a healthy network, waiting for every replica
to confirm a write makes it slower. Dynamo and Cassandra default to **PA/EL**: stay available during partitions
and favour low latency normally, accepting that replicas may briefly disagree. A store like Google's Spanner is
**PC/EC**: it pays latency for consistency.

Our store is for things like shopping carts, session data, user preferences and device state: data where "always
accept the write" matters more than "never show a slightly old value". So we design an **AP, tunable** store: the
default favours availability, and each request can ask for stronger consistency when it needs it.

## 3. Requirements

### Functional (what clients can do)

- `put(key, value)`: store a value (up to, say, 1 MB) under a key.
- `get(key)`: read the value back.
- `delete(key)`.
- Optional **time to live** (TTL): the key expires on its own.
- **Tunable consistency** per request: "answer fast" or "answer only when a majority agrees".

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Availability** | Always accept writes, even when nodes or a whole zone fail | A cart that refuses "Add to basket" loses a sale |
| **Latency** | Single-digit milliseconds at the median, tens of milliseconds at p99 | The store sits on the hot path of every page |
| **Scalability** | Add nodes to add capacity, roughly linearly, with no downtime | Data and traffic only grow |
| **Durability** | An acknowledged write survives machine failures | Losing a cart is losing money |
| **Consistency** | Eventual by default; read-your-writes possible with quorums | Most data tolerates a brief disagreement |
| **No single point of failure** | Every node has the same role; no master | One machine dying should never stop the cluster |

### Out of scope

Queries by value (secondary indexes), joins, multi-key transactions, and SQL. Mention them, then set them aside: a
key-value store is fast precisely because it only does lookups by key.

## 4. Back-of-the-envelope estimates

**Assumptions:** 10 billion keys; an average key plus value of **1 KB**; a peak of **1 million operations per
second**, 70% reads and 30% writes; **3 copies** of every key; each node has **2 TB** of usable disk and handles
about **25,000** simple operations per second (an assumption for commodity servers; measure your own hardware).

**Storage**

- Raw data: $10\text{B} \times 1\text{ KB} = 10\text{ TB}$.
- With 3 replicas: $30\text{ TB}$. Leave half the disk free for compaction and growth (section 13), so
  $30 / (2 \times 50\%) = 30$ nodes for storage.

**Throughput**

- Writes: $300{,}000$ per second, each sent to 3 replicas: $900{,}000$ replica writes per second.
- Reads: $700{,}000$ per second; with a read quorum of 2 (section 8): $1{,}400{,}000$ replica reads per second.
- Total: about $2.3\text{M}$ replica operations per second, $2.3\text{M} / 25{,}000 \approx 92$ nodes.

Two conclusions follow:

1. **Throughput, not storage, sets the cluster size here** (about 100 nodes versus 30). That is common for hot,
   small values, and it is why a cache often sits in front of the store.
2. **With 100 nodes, something is always broken.** If each server fails about once every three years, a
   100-node cluster sees a failure roughly every 11 days. Failure handling is the normal path, not an edge case.

## 5. The API

The interface is deliberately tiny:

| Call | What it does |
| --- | --- |
| `get(key, consistency)` | Returns the value, or several **sibling** values if replicas hold conflicting versions (section 10), plus an opaque **context** (the version information). |
| `put(key, value, context, consistency, ttl?)` | Stores the value. Passing back the context from the last `get` tells the store which version this write replaces. |
| `delete(key, context, consistency)` | Writes a deletion marker (a **tombstone**, section 13). |

`consistency` is how many replicas must answer, such as `ONE`, `QUORUM` or `ALL`. Over the network this is usually
a compact binary protocol rather than JSON, because the store is called millions of times a second and every byte
of overhead counts.

## 6. High-level design

[![High-level design: a client sends get or put to a coordinator, which checks the ring map learned by gossip to find the key's three replicas, sends the request to all three, and hands writes for a down replica to a stand-in node; each replica writes to its own storage engine](/img/system-design/distributed-key-value-store/01-architecture.png)](/img/system-design/distributed-key-value-store/01-architecture.png)

*Select the diagram to zoom in and move around.*

The striking thing about this design is what is **missing**: there is no master, no central directory, no
special node. Every node runs the same software and can play every role.

- **Client:** an application using `get` and `put`. A smart client library may already know the ring and send
  requests straight to a replica; otherwise a load balancer sends them to any node.
- **Coordinator:** whichever node receives the request. It hashes the key, looks up the three replicas, forwards
  the request, waits for enough answers, and replies.
- **Ring map:** every node's copy of "which node owns which range of keys". It is spread by **gossip**
  (section 12), not stored in a central server.
- **Replicas:** the N nodes that hold copies of the key (here N = 3).
- **Stand-in node:** when a replica is down, another node temporarily accepts its writes with a note saying whose
  they really are (**hinted handoff**, section 9).
- **Storage engine:** on each node, a log-structured engine that turns random writes into fast sequential disk
  writes (section 13).

## 7. Partitioning: consistent hashing and virtual nodes

### Why not `hash(key) % N`?

The obvious way to spread keys over N nodes is `node = hash(key) % N`. It works perfectly until N changes. Go from
4 nodes to 5 and a key moves unless `hash % 4` happens to equal `hash % 5`, which is true for only about one key in
five. So **about 80% of all keys move** to a different node. In general, going from N to N + 1 nodes moves about
$N / (N + 1)$ of the data. Adding one server to a 100-node cluster would reshuffle 99% of 10 TB. That is a disaster.

### The ring

**Consistent hashing** fixes this. Picture the output of the hash function as a circle (the **ring**): hash values
start at 0, grow clockwise, and wrap around to 0 again. Each node is placed on the ring at one or more positions
called **tokens**. To find a key's home:

1. Hash the key to a position on the ring.
2. Walk **clockwise** to the first token. That node is the key's first replica.
3. Keep walking to collect N **distinct physical nodes**: the key's **preference list**.

[![A consistent hashing ring with positions 0 to 99 and eight virtual nodes belonging to four physical nodes A, B, C and D; key cart:42 hashes to 75, walks clockwise to node D at token 83 for replica 1, then node B at 95 for replica 2, then wraps around to node A at 8 for replica 3](/img/system-design/distributed-key-value-store/02-ring.png)](/img/system-design/distributed-key-value-store/02-ring.png)

*Select the diagram to zoom in and move around.*

In the picture the ring has only 100 positions so the numbers stay readable; a real store uses a 64-bit or 128-bit
hash (Cassandra uses Murmur3, for example). Key `cart:42` hashes to 75. Walking clockwise, the first token is
83 (node D), then 95 (node B), then the ring wraps to 8 (node A). So the preference list is **D, B, A**. If the
walk had met a second token of node D before finding three different machines, it would skip it: two copies on
the same machine protect against nothing.

Now add a fifth node E with a token at 65. Only the keys hashing between 58 and 65 change hands: their walk used to
start at token 70 (node C) and now stops at E first. (With three copies, E also becomes the second or third
replica of a few neighbouring ranges, still a small slice.) Every other key stays where it was. With N nodes, adding one moves only about $1/(N+1)$ of the data,
the theoretical minimum.

### Virtual nodes

With one token per machine, two problems appear. Random token positions leave some nodes with much bigger arcs
than others, and when a node fails, all its load lands on the single neighbour after it on the ring.

**Virtual nodes** (vnodes) fix both: each physical machine owns **many** small tokens scattered around the ring
(Cassandra's default was 256 per node and is 16 in recent versions). In the diagram, each of A, B, C and D owns two.
Now:

- **Load evens out**, because each machine owns many small slices and the sizes average out.
- **Failure load spreads**: when A dies, its many small ranges are picked up by many different neighbours.
- **Bigger machines can own more tokens**, so a server with twice the disk gets twice the share.
- **Joining and leaving are spread out**: a new node takes small slices from every existing node, so the data
  streams in from many machines in parallel.

## 8. Replication and quorums: N, R and W

Each key is stored on **N** replicas (the first N distinct nodes on its preference list). Two more numbers decide
how a request behaves:

- **W**: how many replicas must confirm a write before the coordinator tells the client "OK".
- **R**: how many replicas must answer a read before the coordinator returns a value.

### A quorum write

[![Quorum write with N equals 3 and W equals 2: the client sends put to the coordinator, which hashes the key to preference list D, B, A and sends the write to all three; each replica appends to its commit log then memtable; after acks from D and B the coordinator replies OK, and A's late ack arrives afterwards](/img/system-design/distributed-key-value-store/03-write.png)](/img/system-design/distributed-key-value-store/03-write.png)

*Select the diagram to zoom in and move around.*

The coordinator sends the write to **all N** replicas at once but waits for only **W** of them. The slowest
replica (here A) still applies the write; the client simply does not wait for it. This is how the store keeps
latency low: one slow or overloaded machine does not slow down the request.

### A quorum read, and read repair

[![Quorum read with R equals 2: the coordinator reads from nodes D and B, D returns v2 written at time 105 and B returns the older v1 written at time 100; the coordinator returns v2 to the client and then writes v2 back to B as a read repair](/img/system-design/distributed-key-value-store/04-read.png)](/img/system-design/distributed-key-value-store/04-read.png)

*Select the diagram to zoom in and move around.*

When the R answers disagree, the coordinator returns the newest version and, in the background, writes it back to
the stale replica. This is **read repair**: every read quietly fixes the copies it touched, so frequently read keys
heal themselves.

### What R + W > N guarantees

If $R + W > N$, every read set and every write set **overlap in at least one replica**. With N = 3, W = 2 and
R = 2: the write reached at least 2 of the 3 replicas, the read asks 2 of the 3, and you cannot pick 2 and 2 out of
3 without sharing one. So the read always sees at least one copy of the latest acknowledged write, and picks it
by its version.

| Setting (N = 3) | R + W | Behaviour | Good for |
| --- | --- | --- | --- |
| W = 1, R = 1 | 2 | Fastest, most available; a read may miss a recent write | Metrics, logs, caches |
| W = 2, R = 2 | 4 | Quorum: reads see the latest acknowledged write; survives one replica down | The usual default |
| W = 3, R = 1 | 4 | Fast reads, but a write fails if any replica is down | Read-heavy data that rarely changes |
| W = 1, R = 3 | 4 | Writes never wait; reads are slow and fail if any replica is down | Rarely sensible |

A senior-level caveat: **quorum overlap is not the same as full consistency.** Clock skew under last-write-wins
(section 10), a write that failed after reaching only one replica, and the sloppy quorums of the next section can
all produce surprising reads. Quorums give strong *probabilistic* guarantees, not transactions.

Picking replicas across **failure domains** matters as much as picking N. Real stores place the N copies in
different racks or availability zones, so a single power or network failure cannot take out every copy.

## 9. Sloppy quorum and hinted handoff

Suppose replica A is down when a write for `cart:42` arrives, and W = 2. D and B can still confirm, so the write
succeeds. But A now misses the write. And if two replicas were down, a **strict quorum** could not reach W at all
and would have to refuse the write, which breaks our "always accept writes" goal.

A **sloppy quorum** relaxes the rule: the write goes to the first N **healthy** nodes on the ring, even if some
of them are not the key's usual replicas. The stand-in keeps the write with a **hint** attached: "this really
belongs to A".

[![Hinted handoff: while node A is down, the coordinator writes to D and B, the write to A times out, so it sends the write with a hint for A to node C, the next healthy node; all three acknowledge; later, when A is back, C replays the write to A, A acknowledges and C deletes the hint](/img/system-design/distributed-key-value-store/05-hinted-handoff.png)](/img/system-design/distributed-key-value-store/05-hinted-handoff.png)

*Select the diagram to zoom in and move around.*

When gossip (section 12) reports that A is back, C replays the hinted writes to A and deletes them. This is
**hinted handoff**. It is like a neighbour accepting a parcel while you are out and handing it over when you get
home.

Points interviewers like:

- **The hint is kept apart** from C's own data, so C does not start answering reads for A's keys as if it owned them.
- **Sloppy quorums weaken the R + W > N guarantee.** The W acknowledgements may come from stand-ins that a later
  read will not ask, so a read can miss the write until the hint is delivered. This is the price of availability.
- **Hints are not kept forever.** Stores keep them for a limited window (Cassandra's default is a few hours). A node
  down longer than that must be repaired with anti-entropy (section 11) instead.
- **Implementations differ.** The Dynamo paper sends the hinted copy to the next healthy node on the ring, as drawn.
  Cassandra keeps hints on the coordinator itself and does not count them towards the consistency level by
  default. The idea is the same: remember the write for the missing replica and deliver it later.

## 10. Conflict resolution: last-write-wins and vector clocks

Because we accept writes during failures, two replicas can end up with **different** values for the same key.
Something must decide which one wins.

### Last-write-wins (LWW)

Attach a timestamp to every write and keep the value with the highest timestamp. Cassandra does this, per column.
It is simple, needs no client involvement, and the comparison is one number.

The catch is that **LWW silently throws writes away**. If two users update the same key "at the same time" on
different replicas, one update disappears. And it trusts the clocks: if one server's clock runs 2 seconds fast,
its writes beat later writes from correct clocks. LWW is perfect for data where the latest value really is the
right one (a user's profile picture, a sensor reading) and dangerous for data built up by many writers (a cart).

### Vector clocks

A **vector clock** records **which node has seen how many updates** of a value, as a list of
`[node: counter]` pairs. Each time a node coordinates an update, it increments its own counter. Comparing two
clocks tells you their **causal** relationship, without trusting wall clocks:

- If every counter in clock X is less than or equal to the matching counter in clock Y, then **Y descends from
  X**: Y already includes X's changes, so X can be discarded.
- If neither descends from the other, the versions are **concurrent**: they were made without knowledge of each
  other, and the store must keep both.

[![Vector clock example with a shopping cart: version 1 is milk with clock A:1; version 2 adds eggs via A, clock A:2; then two concurrent updates: adding bread via B gives A:2 B:1, while dropping milk via C gives A:2 C:1; the client merges them by union into milk, eggs and bread with clock A:3 B:1 C:1](/img/system-design/distributed-key-value-store/06-vector-clocks.png)](/img/system-design/distributed-key-value-store/06-vector-clocks.png)

*Select the diagram to zoom in and move around.*

Walk through it. `[A:2]` descends from `[A:1]`, so version 1 is safely forgotten. But `[A:2, B:1]` and
`[A:2, C:1]` are concurrent: B's version has a B update that C's lacks, and the other way round. Neither may be
thrown away, so a `get` returns **both siblings** to the client. The application merges them (for a cart, a union
of items) and writes the result back with the merged context; node A coordinates that write, so the new clock is
`[A:3, B:1, C:1]`, which descends from both siblings and replaces them.

Notice the classic flaw in the merge: the union brings **milk back**, even though one user removed it. A plain
union cannot tell "removed" from "never added". Fixes include storing removals explicitly, or using **CRDTs**
(conflict-free replicated data types), data structures such as sets and counters designed so that merging any
two versions always gives the right answer.

| | Last-write-wins | Vector clocks |
| --- | --- | --- |
| Who resolves conflicts | The store, automatically | The application, on read |
| Lost updates | Possible, silently | None: concurrent versions are kept |
| Needs synchronised clocks | Yes | No |
| Complexity | Low | Higher: siblings, merge code, clock pruning |
| Used by | Cassandra, ScyllaDB | The Dynamo paper, early Riak |

Vector clocks grow by one entry per node that has coordinated a write, so stores **prune** the oldest entries
beyond a size limit, accepting a small chance of a false conflict.

## 11. Anti-entropy with Merkle trees

Read repair fixes keys that are read; hinted handoff fixes short outages. But a key nobody reads, on a node that
was down for a day, can stay wrong forever. **Anti-entropy** is the background process that compares whole
replicas and fixes every difference.

Comparing two replicas key by key would mean sending billions of keys across the network. A **Merkle tree** (a
hash tree) makes it cheap. Each leaf is a hash of all the keys and values in a small range. Each parent is a hash
of its children. The root is therefore a fingerprint of the entire range: if any single value differs, the root
differs.

[![A Merkle tree over keys 0 to 99: the root hash combines H01 and H23; H01 covers keys 0 to 49 and combines H0 for keys 0 to 24 and H1 for keys 25 to 49; H23 covers keys 50 to 99 and combines H2 for keys 50 to 74 and H3 for keys 75 to 99](/img/system-design/distributed-key-value-store/07-merkle.png)](/img/system-design/distributed-key-value-store/07-merkle.png)

Two replicas of the same range compare trees from the top:

1. Exchange root hashes. Equal? The ranges are identical. Done, after sending one hash.
2. Different? Exchange the two children. Suppose H01 matches but H23 does not: keys 0–49 are fine, skip them.
3. Go down H23: H2 matches, H3 differs. Only keys 75–99 need to be compared and streamed.

The work is proportional to **how much differs**, not to how much data there is. Real trees have many more levels
(Cassandra's repair builds trees with up to tens of thousands of leaves per range), but the descent is the same.

The cost is building the trees: hashing a whole range reads all of its data from disk. Stores therefore run repair
on a schedule (for example once a week per node), spread across the cluster, rather than continuously.

## 12. Gossip membership and failure detection

With no master, how does every node learn who is in the cluster, who owns which tokens, and who is down?

### Gossip

Every second, each node picks a few random peers and exchanges what it knows: the members it has heard of, their
tokens and status, and a **heartbeat counter** per member that its owner increases all the time. For each member,
the newer information wins. Like a rumour in an office, news reaches everyone fast: the number of rounds needed
grows only with the **logarithm** of the cluster size, so even a 1,000-node cluster spreads a change in a handful
of seconds.

Gossip is cheap (small messages, a few per node per second), has no single point of failure, and keeps working when
some nodes are unreachable. Most stores also configure a few **seed nodes**: well-known addresses that a new node
contacts first to join the conversation. Seeds are not special in any other way.

### Failure detection

A node is suspected when its heartbeat stops increasing. A fixed timeout ("dead after 10 seconds") is fragile: too
short and a garbage-collection pause marks healthy nodes dead; too long and requests keep going to a dead node.

Cassandra uses a **phi accrual failure detector**. Each node records how long the gaps between heartbeats from a
peer usually are. Instead of "alive" or "dead", it outputs a **suspicion level** (phi) that grows the longer the
current silence lasts compared with that history. Each node then acts on the level: above a threshold (Cassandra's
default is 8, roughly "a one in a hundred million chance this is just a slow heartbeat"), it marks the peer down.
A peer on a jittery network link naturally gets more slack than one on a quiet link.

Two important subtleties:

- **Down is a local opinion.** Node B may think A is down while node D still reaches it. That is fine: each
  coordinator just routes around nodes it considers down and uses hints for them.
- **Down is not removed.** A temporary failure only stops traffic. Taking a node out of the ring, which moves data,
  is an explicit operator action. Otherwise a network blip would trigger huge, needless data movement.

## 13. Inside one node: the storage engine

Each node needs a local engine that accepts a flood of writes. Updating a B-tree in place means random disk
writes. Dynamo-style stores (Cassandra, ScyllaDB, and RocksDB-based ones) use a **log-structured merge tree (LSM
tree)**, which turns every write into sequential appends.

[![The LSM storage engine inside one node: a put first appends to the commit log on disk, then inserts into the in-memory memtable; a full memtable is flushed to an immutable SSTable; compaction merges SSTables in the background; a get checks the memtable first, then asks the Bloom filters which SSTables may hold the key and reads only those](/img/system-design/distributed-key-value-store/08-storage-engine.png)](/img/system-design/distributed-key-value-store/08-storage-engine.png)

*Select the diagram to zoom in and move around.*

**The write path**

1. **Commit log:** append the write to a log file on disk. Appending is the fastest thing a disk can do, and it
   means a crash loses nothing: on restart, the node replays the log.
2. **Memtable:** insert the write into a sorted in-memory structure (a skip list or balanced tree). The write is
   now acknowledged.
3. **Flush:** when the memtable is full (tens to hundreds of MB), write it to disk in one sequential pass as an
   **SSTable** (sorted string table): an immutable file of key-value pairs sorted by key, with a small index. The
   matching commit log segment can then be deleted.

**The read path**

1. Check the memtable: the newest data is there.
2. Otherwise check SSTables from newest to oldest. A key may appear in several (older versions), and the newest
   one wins.
3. To avoid opening every file, each SSTable has a **Bloom filter**: a compact bit array that answers "is this key
   possibly in this file?". It can say "maybe" for a key that is absent (a false positive, tuned to around 1%),
   but it **never** says "no" for a key that is present. So most files are skipped without touching the disk.

**Compaction**

Flushes keep creating new files, so reads would get slower and old versions would pile up. **Compaction** merges
several SSTables into one, keeping only the newest version of each key and dropping expired data. Because the files
are sorted, merging is a fast sequential pass, like the merge step of merge sort. Two common strategies:

- **Size-tiered:** merge several files of similar size. Cheap on writes, but reads may check more files and it
  needs a lot of temporary free disk (hence the 50% headroom in section 4).
- **Leveled:** keep files in levels with non-overlapping key ranges. Reads touch few files; compaction rewrites data
  more often. Good for read-heavy data.

**Deletes are writes.** You cannot erase a key from an immutable file, and a replica that missed the delete would
otherwise "resurrect" the old value during repair. So a delete writes a **tombstone**: a marker saying "deleted at
time T". Compaction drops the tombstone and the data it hides only after a grace period (Cassandra's default is 10
days), long enough for repair to spread the tombstone to every replica. Workloads that delete heavily create many
tombstones, and reading through thousands of them is a well-known way to slow such a store down.

## 14. Adding and removing nodes

Because membership changes move data, a node goes through clear states.

[![Life of a node: Joining, where it takes tokens and streams data, then Up, serving reads and writes, then Leaving, handing ranges to neighbours, then Removed; an Up node whose gossip goes quiet becomes Suspected, returns to Up when heard from again, or becomes Down if silent too long; a Down node returns to Up after restarting and replaying hints, or is Removed when an operator replaces it](/img/system-design/distributed-key-value-store/09-node-states.png)](/img/system-design/distributed-key-value-store/09-node-states.png)

*Select the diagram to zoom in and move around.*

**Adding a node (scaling out)**

1. The new node contacts a seed, learns the ring through gossip, and picks its tokens (with vnodes, many small
   ones scattered around the ring).
2. It announces itself as **joining**. Coordinators start sending it copies of new writes for its future ranges, but
   do not read from it yet.
3. It **streams** the data for its ranges from the nodes that currently own them. With vnodes, that is a little
   from many nodes, in parallel.
4. When streaming finishes it becomes **up** and starts serving reads. The old owners delete the ranges they no
   longer own (a "cleanup" step).

**Removing a node**

- **Planned (decommission):** the node streams its ranges to the nodes that will take them over, then leaves the
  ring. No data is ever under-replicated.
- **Unplanned (dead disk, dead machine):** a replacement node takes over the dead node's tokens and rebuilds the
  data from the other replicas. Until then, those keys have one copy fewer, which is exactly why N = 3 and not 2.

Add capacity **before** you need it. Streaming terabytes takes hours and uses the disk and network of the very
nodes that are already busy; scaling during a traffic peak makes the peak worse.

## 15. What breaks as it grows, and how to fix it

**The hot key.** One celebrity's profile or one flash-sale item gets a huge share of reads. Consistent hashing
spreads keys, not requests, so one replica set melts. *Fix:* a cache in front of the store, read from any replica
(R = 1) for that data, or split the key (`item:7#0` … `item:7#9`) and spread its reads.

**The large partition.** A key whose value keeps growing (all events of one device, ever) becomes huge, slow to
read, compact and repair. *Fix:* bucket by time in the key (`device:9:2026-11`) and cap value sizes.

**Tombstone pile-up.** Queue-like workloads (insert, then delete) leave millions of tombstones that every read must
skip. *Fix:* use TTLs and time-bucketed keys so whole files expire together, and pick a better tool for queues.

**Repair that never finishes.** Large clusters with infrequent repair accumulate inconsistency and risk resurrected
deletes. *Fix:* incremental repair (only data written since the last run) and a scheduler that keeps every range
repaired within the tombstone grace period.

**Uneven nodes.** Too few vnodes or very different hardware leave some nodes with far more data. *Fix:* more tokens,
or tokens chosen by an algorithm that balances ownership instead of at random; weight bigger machines with more
tokens.

**Multi-region.** Users in several continents want local latency. *Fix:* keep replicas in each region (for example
3 per region) and use **local quorums**, which wait only for replicas in the coordinator's region; other regions
catch up asynchronously.

## 16. Reliability: how we never lose an acknowledged write

| Risk | Defence |
| --- | --- |
| A node crashes right after acknowledging | The commit log was written first; replaying it on restart rebuilds the memtable |
| A whole node is lost | N = 3 copies on different racks or zones; a replacement node rebuilds from the others |
| A replica is down for a while | Hinted handoff replays missed writes when it returns |
| A replica silently missed writes | Read repair on reads, anti-entropy with Merkle trees on a schedule |
| Two replicas disagree | Version comparison: timestamps (LWW) or vector clocks with siblings |
| A deleted value comes back | Tombstones kept for a grace period longer than the repair interval |
| A slow node drags requests | Wait only for R or W answers; the slow replica catches up in the background |

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| CAP choice | Consistent (refuse during partitions) | Available (accept, reconcile later) | **Available**, tunable per request: a cart must always accept "Add" |
| Partitioning | `hash % N` | Consistent hashing with vnodes | **Ring with vnodes**: adding a node moves only its share |
| Architecture | Leader per partition | Leaderless, any replica accepts writes | **Leaderless**: no failover pause, no single point of failure |
| Quorum | Strict | Sloppy with hinted handoff | **Sloppy** for availability; strict when a read must see the write |
| Conflicts | Last-write-wins | Vector clocks and siblings | **LWW** for overwrite-style data, **vector clocks or CRDTs** for merged data |
| Storage engine | B-tree (update in place) | LSM tree (append, then compact) | **LSM**: fast sequential writes; Bloom filters keep reads quick |
| Membership | Central coordinator (for example ZooKeeper) | Gossip | **Gossip**: nothing central to fail |

## Cheat sheet for last-minute revision

- **CAP:** during a partition choose consistency or availability. **PACELC:** otherwise choose latency or
  consistency. Dynamo / Cassandra are **PA/EL**.
- **Partitioning:** consistent hashing ring. Key → hash → walk clockwise → first N distinct nodes = preference list.
  Adding a node moves about $1/(N+1)$ of the data, versus almost all of it with `hash % N`.
- **Virtual nodes:** many tokens per machine; even load, spread-out failure and rebuild traffic.
- **Quorums:** N copies, wait for W on writes and R on reads. $R + W > N$ means read and write sets overlap. Typical:
  N = 3, R = 2, W = 2.
- **Sloppy quorum + hinted handoff:** write to the next healthy node with a hint; replay when the owner returns.
  Buys availability, weakens the overlap guarantee.
- **Conflicts:** LWW (simple, loses concurrent writes, trusts clocks) versus vector clocks (detect concurrency,
  return siblings, the application merges; CRDTs merge automatically).
- **Repair:** read repair on reads; anti-entropy with **Merkle trees** in the background, work proportional to the
  differences; tombstones must outlive the repair interval.
- **Gossip:** every second, a few random peers; spreads in $O(\log n)$ rounds. **Phi accrual** failure detection
  adapts to each peer's normal heartbeat gaps. Down is temporary; removal is explicit.
- **Storage engine (LSM):** commit log → memtable → flush to immutable SSTables → compaction. Reads: memtable, then
  Bloom filters to skip SSTables. Deletes are tombstones.
- **Numbers:** 10 B keys × 1 KB × 3 copies = 30 TB; 1 M ops/s peak → about 2.3 M replica ops/s → about 100 nodes.

## Practice questions

1. **A client writes with W = 1, then immediately reads with R = 1 and gets the old value. Why, and how do you
   fix it?** R + W = 2 is not greater than N = 3, so the read may hit a replica the write has not reached yet. Use
   R = W = 2 (quorum), or route the client's reads to the same replica it wrote to (session stickiness) for
   read-your-writes.
2. **How would you implement a TTL?** Store an expiry time with each value. Reads treat expired values as absent;
   compaction drops them, so whole SSTables of expired data can be deleted cheaply when every value in them has expired.
3. **Two data centres lose their link for an hour, and both keep accepting writes. What happens when the link
   returns?** Hints (if still within their window), read repair and anti-entropy exchange the missed writes.
   Conflicting versions resolve by LWW timestamps, or come back as siblings with vector clocks for the
   application to merge.
4. **Why does a key-value store need a tombstone instead of just deleting the data?** Because a replica that
   missed the delete still holds the value; without a tombstone that is newer than the value, repair would copy the
   old value back everywhere.
5. **How would you support a compare-and-set (`put only if the value is still X`)?** Quorums alone cannot do it
   safely, because two coordinators can both see X. You need consensus among the replicas, such as Paxos or Raft
   for that key (Cassandra's lightweight transactions use Paxos), at the cost of extra round trips.
