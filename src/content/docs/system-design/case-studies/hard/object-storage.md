---
title: "Design Distributed Cloud Object Storage (like Amazon S3)"
description: "Design an S3-like object store: buckets and keys, a sharded metadata service, erasure coding across zones, durability maths, repair, versioning and multipart."
difficulty: "Hard"
sidebar:
  label: "Object storage (like Amazon S3)"
tags: ["Storage", "Erasure coding", "Durability", "Sharding", "Consistency"]
---

Almost every large system you will design keeps its big files somewhere else: photos, videos, backups, logs,
machine-learning datasets, website assets. That "somewhere else" is usually an **object store** such as Amazon
S3, Google Cloud Storage or Azure Blob Storage. From the outside it is the simplest storage there is: put a blob
of bytes under a name, get it back later. On the inside it is one of the hardest systems to build, because it
has to keep exabytes of data safe for decades on hardware that breaks every hour.

This case study builds an S3-like object store from first principles. We start with what an object is and how it
differs from a disk or a file system, then design the metadata service and the data nodes, work through the
durability maths of replication and erasure coding, and finish with repair, garbage collection, versioning,
storage tiers and what breaks as it grows.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one. The durability maths in
[section 7](#7-deep-dive-durability-replication-vs-erasure-coding) is the part interviewers push on hardest.
:::

## 1. Object storage in 5 minutes

There are three common ways to store data on servers. They differ in **what you address** and **what you can
change**.

| | Block storage | File storage | Object storage |
| --- | --- | --- | --- |
| What you address | Numbered blocks on a virtual disk (block 81,920) | Paths in a tree of folders (`/home/ana/report.pdf`) | A key in a flat bucket (`photos/2024/cat.jpg`) |
| How you change data | Overwrite any block in place | Open, seek, write part of a file, append, rename | Replace the whole object; no partial edits |
| Who uses it | One server's file system or database (like a hard drive) | Many servers sharing folders (NFS, SMB) | Any client over HTTPS, from anywhere |
| Scale | Terabytes per volume | Petabytes, but one namespace is hard to grow | Exabytes, trillions of objects |
| Examples | Amazon EBS, a SAN | Amazon EFS, NetApp | Amazon S3, Google Cloud Storage, Azure Blob |
| Everyday analogy | The pages of a notebook | A filing cabinet with drawers and folders | A cloakroom: hand in a coat, get a ticket, swap the ticket for the coat |

The key vocabulary:

- **Object**: the bytes (a few bytes up to terabytes) plus **metadata**: size, content type, a checksum, creation
  time and any custom tags you attach (`x-amz-meta-camera: pixel-8`).
- **Bucket**: a named container of objects, with its own owner, region, access policy and settings (versioning,
  lifecycle rules). In S3, general purpose bucket names are globally unique by default (since March 2026 a bucket
  can instead be created in its account's own regional namespace).
- **Key**: the object's name inside the bucket, for example `photos/2024/cat.jpg`. The namespace is **flat**: the
  slashes are ordinary characters, and "folders" are an illusion created by listing keys that share a prefix.
- **Immutable objects**: you never edit an object in place. A new PUT to the same key **replaces** it as a whole
  (or, with versioning on, adds a new version). This one restriction is what makes the system scalable: no
  locks on byte ranges, no partial-write corruption, and every stored piece of data can be cached or copied
  freely because it never changes.

Why give up in-place edits and real folders? Because those features need coordination. A file system must make
`rename` of a folder holding a million files atomic, and must let two writers update the same file safely. An
object store drops both, and in return it can spread data across hundreds of thousands of disks with almost no
coordination between them.

## 2. Requirements

### Functional (what users can do)

- **Buckets**: create, delete, list, set policy, versioning and lifecycle rules.
- **PUT** an object under a key (up to 5 GiB in one request), **GET** it (whole, or a byte range), **HEAD** it
  (metadata only), **DELETE** it.
- **LIST** the keys in a bucket by prefix, page by page, optionally grouped into "folders" by a delimiter.
- **Multipart upload** for large objects: upload parts in parallel, then combine them into one object (up to
  about 50 TB).
- **Versioning**: keep every version of a key; recover from overwrites and deletes.
- **Storage classes and lifecycle rules**: move old data to cheaper tiers and expire it automatically.
- **Access control**: per-bucket policies, signed requests and time-limited **pre-signed URLs**.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Durability** | 99.999999999% (11 nines) per object per year | Losing a customer's data is the one unforgivable failure |
| **Availability** | 99.99% for the standard tier | Slightly lower than durability: being briefly unreachable is bad, losing data is worse |
| **Consistency** | Strong read-after-write: a GET or LIST after a successful PUT or DELETE sees it | Data pipelines break in confusing ways if a just-written file is invisible |
| **Scale** | Trillions of objects, exabytes of data, millions of requests per second | Object storage is the backing store for everything else |
| **Throughput** | Large objects stream at the speed of the client's network | Analytics jobs read terabytes in parallel |
| **Latency** | Tens of milliseconds to the first byte for the standard tier | Fine for files; object stores are not databases |
| **Cost** | Cents per gigabyte per month, and less for cold tiers | Storage overhead is the biggest lever on cost |

Two different numbers are easy to confuse. **Durability** asks "will my data still exist?". **Availability**
asks "can I read it right now?". A zone outage can make data unavailable for an hour without losing a single
byte.

### Out of scope

Cross-region replication, event notifications, querying inside objects (S3 Select, Athena), static website
hosting, billing and the console UI. Mention them in an interview, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to see **which resources dominate**. These are illustrative assumptions,
not any provider's real figures.

**Assumptions:** 10 trillion objects stored, averaging **1 MB**. Clients make **1,000,000 GETs** and
**100,000 PUTs** per second on average, each moving 1 MB. Data is erasure-coded 6+3 (stored at 1.5× its size,
explained in section 7). Disks hold **20 TB** and **1%** of them fail each year. Metadata is about **500 bytes**
per object.

**Storage**

- Logical data: $10^{13} \times 1\text{ MB} = 10^{19}\text{ bytes} = 10\text{ EB}$.
- Raw disk with 6+3 erasure coding: $10\text{ EB} \times 1.5 = 15\text{ EB}$. With three full copies it would be
  $30\text{ EB}$.
- Disks: $15\text{ EB} \div 20\text{ TB} = 750{,}000$ disks (1.5 million with three copies).
- Metadata: $10^{13} \times 500\text{ B} = 5\text{ PB}$, or $15\text{ PB}$ with three replicas. Small next to
  the data, but far too big for one machine.

**Traffic**

- Incoming: $100{,}000 \times 1\text{ MB} = 100\text{ GB/s}$, so $100\text{ GB/s} \times 86{,}400\text{ s} = 8.64\text{ PB}$
  of new data a day, and $150\text{ GB/s}$ actually written to disks after encoding.
- Outgoing: $1{,}000{,}000 \times 1\text{ MB} = 1\text{ TB/s}$.
- Metadata: every GET and PUT touches it once, so about **1.1 million metadata operations per second**, plus
  LISTs.

**Failures**

- Disk failures: $750{,}000 \times 1\% = 7{,}500$ a year, about **20 a day**, nearly one an hour.
- Repair traffic: rebuilding one lost fragment with 6+3 coding means reading 6 others (section 12), so a dead
  20 TB disk costs $6 \times 20\text{ TB} = 120\text{ TB}$ of reads. At about 20.5 disks a day that is
  $120\text{ TB} \times 20.5 \approx 2.5\text{ PB}$ a day, roughly **28 GB/s** of background traffic, all the time.

Three conclusions follow:

1. **Storage overhead is the cost.** Going from 3× replication to 1.5× erasure coding saves 15 EB of disk, half
   the hardware.
2. **Failure is normal, not exceptional.** A disk dies every hour, so repair is a permanent production workload
   that needs its own bandwidth budget.
3. **Metadata is a large distributed database in its own right**, handling a million operations a second with
   strong consistency. It is the hardest part to scale.

## 4. The API

Clients talk to the store over HTTPS with a REST API. The bucket and key are in the URL; every request is signed
with the caller's secret key (in S3, **Signature Version 4**: an HMAC over the method, path, headers and a hash
of the body), so the server can check who sent it and that nothing was altered on the way.

| Method and path | What it does |
| --- | --- |
| `PUT /{bucket}/{key}` | Store an object (body = bytes). Optional headers: content type, custom metadata, a checksum such as CRC32C or SHA-256, storage class. Returns an `ETag` and, if versioning is on, a version ID. |
| `GET /{bucket}/{key}` | Read the current version. `Range: bytes=0-1048575` reads part of it; `?versionId=` reads an older version. |
| `HEAD /{bucket}/{key}` | Metadata only: size, ETag, content type, storage class. |
| `DELETE /{bucket}/{key}` | Delete it (with versioning on, this adds a **delete marker** instead; see section 13). |
| `GET /{bucket}?list-type=2&prefix=photos/2024/&delimiter=/` | List keys in sorted order, up to 1,000 per page, with a `continuation-token` for the next page. |
| `POST /{bucket}/{key}?uploads` | Start a multipart upload; returns an `uploadId`. |
| `PUT /{bucket}/{key}?partNumber=3&uploadId=u1` | Upload one part. |
| `POST /{bucket}/{key}?uploadId=u1` | Complete: combine the listed parts into one object. (`DELETE` with the same query aborts.) |

Two API ideas are worth explaining in an interview:

- **Pre-signed URLs.** The application server signs a URL that allows, say, "PUT to `uploads/abc.jpg` for the
  next 15 minutes" and hands it to a phone. The phone uploads directly to the object store, so gigabytes never
  pass through the application's own servers.
- **LIST with a delimiter fakes folders.** With `prefix=photos/` and `delimiter=/`, keys like
  `photos/2024/cat.jpg` and `photos/2024/dog.jpg` are rolled up into one entry, `photos/2024/` (S3 calls these
  **common prefixes**). That is how the console shows folders in a flat namespace.

## 5. High-level design

The single most important idea: **separate the metadata from the data.** Metadata (which version of which key
lives where) is small, structured and needs strong consistency. Data (the bytes) is huge, immutable and only
needs to be stored safely and found again. They have completely different scaling problems, so they get
different systems.

[![High-level architecture: clients call the front-end fleet over HTTPS; the front end looks up and commits keys in the metadata service, asks the placement manager which nodes to use, and writes and reads fragments on storage nodes spread across availability zones a, b and c; background workers verify, rebuild and delete fragments and get new homes for rebuilt fragments from the placement manager](/img/system-design/object-storage/01-architecture.png)](/img/system-design/object-storage/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Front-end fleet:** stateless servers behind load balancers. They check the signature and bucket policy,
  route metadata requests, and stream object bytes to and from the storage nodes. Because they are stateless,
  we can add or replace them freely.
- **Metadata service:** a sharded, replicated, strongly consistent database mapping `(bucket, key, version)` to
  the object's size, checksum and **fragment map** (which storage nodes hold its pieces). Sections 9 and 10.
- **Placement manager:** knows every disk's health, free space and location (server, rack, zone) and picks where
  new fragments go. It learns about disks from regular **heartbeats** (small "I am alive, here is my free space"
  messages).
- **Storage nodes:** servers full of hard disks that store **fragments** (pieces of objects) with a checksum next
  to each. They know nothing about buckets or keys; they just store and return fragments by ID.
- **Availability zones (AZs):** separate data centres in one region, with independent power, cooling and
  networking, a few kilometres apart. Spreading each object over three zones means a fire or power cut in one
  zone loses no data.
- **Background workers:** scrubbers that re-check checksums, repairers that rebuild lost fragments, the garbage
  collector that deletes unreferenced data, and lifecycle workers that move or expire objects by rule.

## 6. Flow 1: writing an object (PUT)

A client uploads a 6 MB photo, `photos/cat.jpg`, to a bucket with versioning on.

[![PUT sequence: the client sends PUT photos/cat.jpg of 6 MB to the front end, which checks the signature and policy, asks placement for 9 nodes on different racks, gets n1 to n9 with 3 per AZ, writes 6 data and 3 parity fragments with checksums in parallel, receives 9 acknowledgements that they are on disk, then commits cat.jpg to version v7 with its fragment map in one atomic metadata write, and finally replies 200 OK with the ETag and version v7](/img/system-design/object-storage/02-put.png)](/img/system-design/object-storage/02-put.png)

*Select the diagram to zoom in and move around.*

The rule that makes this safe: **write the bytes first, commit the metadata last.**

- Until step 6, nothing points at the new fragments, so no reader can see a half-written object. Readers keep
  getting the previous version, v6.
- Step 6 is a single atomic write in the metadata service. Before it, the old version is current; after it, the
  new one is. There is no in-between state.
- If the front end crashes after step 5 but before step 6, the fragments are **orphans**: stored but never
  referenced. The client got no `200 OK`, so it retries. The garbage collector later finds and deletes the
  orphans (section 13). Wasted space is cheap; a visible half-object would be a correctness bug.
- **Checksums travel end to end.** The client can send a checksum of the whole body; the front end computes its
  own while streaming and rejects the upload if they differ. Each fragment also gets its own checksum, stored
  with it on disk, so later corruption can be detected (section 12).
- **Acknowledge only after the data is durable.** Each storage node replies only after the fragment is flushed to
  disk (not merely sitting in memory). If we said `200 OK` earlier, a power cut could lose an object we promised
  to keep.

### Choosing where the fragments go

The placement manager picks 9 disks for the 9 fragments with three kinds of rules:

1. **Hard constraints: spread across failure domains.** A failure domain is a set of things that fail together:
   a disk, a server, a rack (shared power and network switch), a zone. No two fragments of one object on the
   same server or rack, and exactly 3 per zone, so losing a whole zone leaves 6 fragments, which is still enough.
2. **Balance:** prefer disks with more free space and less load. A cheap, good trick is the **power of two
   choices**: pick two random eligible disks and take the emptier one. It balances almost as well as checking
   every disk, without a global search.
3. **Avoid hot spots:** never send all of today's writes to the newest (emptiest) disks at once, or those disks
   become the bottleneck and, worse, they will all be the same age and wear out together.

What if one storage node is slow? Waiting for all 9 acknowledgements makes the PUT as slow as the slowest disk.
A common refinement is to commit once, say, 8 of 9 fragments are durable and let the repair system write the
ninth in the background. That is a deliberate trade: slightly lower durability for a short window, in exchange
for much better tail latency.

## 7. Deep dive: durability, replication vs erasure coding

This is the heart of the design. We need to survive disks, servers, racks and even whole zones failing, while
storing as few extra bytes as possible.

### Option A: replication

Store **3 full copies** in 3 different zones. Simple to reason about, fast to read (any copy will do) and fast to
repair (copy one replica). But the cost is brutal: a 6 MB object uses 18 MB of disk.

- **Storage used:** 3× the data.
- **Overhead:** $(3 - 1) \div 1 = 200\%$ extra.
- **Survives:** any 2 lost copies.

### Option B: erasure coding

The idea starts with a puzzle. Take two numbers, $d_1 = 5$ and $d_2 = 3$, and store a third number, their
**XOR** (bitwise "exclusive or"): $p = d_1 \oplus d_2 = 0101 \oplus 0011 = 0110 = 6$. Now lose any one of the
three and you can rebuild it from the other two: $d_1 = p \oplus d_2 = 0110 \oplus 0011 = 0101 = 5$. Three
pieces, any two suffice, and you stored 1.5× the data instead of 2×. This is how RAID 5 works.

**Reed–Solomon codes** generalise the trick. Split the data into $k$ data fragments and compute $m$ parity
fragments using arithmetic over a finite field, so that **any $k$ of the $k + m$ fragments rebuild the
original**. With $k = 6$ and $m = 3$ (written "6+3" or RS(6,3)):

[![Erasure coding 6+3: the 6 MB object cat.jpg is cut into 6 data fragments d1 to d6 of 1 MB each; a Reed–Solomon encoder computes 3 parity fragments p1 to p3 of 1 MB each from the same 6 pieces; d1 to d3 go to 3 nodes in AZ a, d4 to d6 to 3 nodes in AZ b, and p1 to p3 to 3 nodes in AZ c](/img/system-design/object-storage/03-erasure-coding.png)](/img/system-design/object-storage/03-erasure-coding.png)

*Select the diagram to zoom in and move around.*

- **Storage used:** 9 fragments of 1 MB for 6 MB of data: $9 \div 6 = 1.5\times$.
- **Overhead:** $m \div k = 3 \div 6 = 50\%$ extra.
- **Survives:** any 3 lost fragments, including a whole zone (3 fragments).
- **Reads are cheap when nothing is broken.** The data fragments are the original bytes (a **systematic** code),
  so a healthy read just fetches $d_1 \ldots d_6$ and concatenates them; no maths needed.

Side by side:

| Scheme | Disk used per 1 MB | Overhead | Losses survived | Rebuild one lost piece by reading |
| --- | --- | --- | --- | --- |
| 3 copies | 3 MB | 200% | 2 | 1 piece (1×) |
| RS 6+3 | 1.5 MB | 50% | 3 | 6 pieces (6×) |
| RS 10+4 | 1.4 MB | 40% | 4 | 10 pieces (10×) |

Published systems use codes like these: Hadoop HDFS ships an RS 6+3 policy, and Facebook's f4 warm-blob store
used RS 10+4. The wider the code, the lower the overhead but the more expensive every repair and degraded read.

**When replication still wins:**

- **Small objects.** A 4 KB object split into 6 pieces gives fragments of about 683 bytes, and 9 disk seeks to
  read one tiny object. Typical designs either replicate small objects or **pack** many of them into large
  containers (say 64 MB) and erasure-code the container.
- **Very hot or very fresh data**, where a single-copy read and cheap repair matter more than disk cost. Some
  designs write 3 replicas first and convert to erasure coding in the background once the data cools.

### What "11 nines" means

Durability is quoted as a probability that an object survives a year. 99.999999999% (eleven 9s) means a
yearly loss probability of $10^{-11}$ per object. AWS's own way to picture S3's figure: store 10 million objects
and you would expect, on average, to lose one about once every 10,000 years. Check:
$10^{7} \times 10^{-11} = 10^{-4}$ objects lost per year, which is one object per $10^{4}$ years.

| Nines | Durability | Yearly loss chance per object | Out of 1 billion objects, lost per year |
| --- | --- | --- | --- |
| 4 | 99.99% | $10^{-4}$ | 100,000 |
| 8 | 99.999999% | $10^{-8}$ | 10 |
| 11 | 99.999999999% | $10^{-11}$ | 0.01 (one every 100 years) |

### Where the nines come from: a simple model

Data is lost only if **too many pieces fail before repair finishes**. So durability depends on two things: how
many failures a scheme survives, and how short the **repair window** is.

**Assumptions:** each disk fails with probability 1% a year, independently. Repair of a lost piece finishes
within $8.76$ hours, which is $1/1000$ of a year. So the chance that one particular disk fails during a given
repair window is $p = 0.01 \times \frac{8.76}{8760} = 10^{-5}$.

**3 copies.** Some copy of a given object is hit by a disk failure about $3 \times 0.01 = 0.03$ times a year. The
object is lost only if **both other copies** also fail within that repair window: about $p^2 = 10^{-10}$. So:

$$
P(\text{loss per year}) \approx 0.03 \times 10^{-10} = 3 \times 10^{-12}
$$

That is a little better than 11 nines.

**RS 6+3.** A failure hits one of the 9 fragments about $9 \times 0.01 = 0.09$ times a year. The object is lost
only if **3 more** of the remaining 8 fail within the window. There are $\binom{8}{3} = 56$ ways to choose those
3, each with probability about $p^3 = 10^{-15}$:

$$
P(\text{loss per year}) \approx 0.09 \times 56 \times 10^{-15} = 5.04 \times 10^{-15}
$$

That is about 14 nines, **better than three copies at half the disk**.

Three lessons, each a good interview sentence:

1. **Faster repair buys nines.** Halve the repair window and $p$ halves, so the loss rate falls 4× for
   replication ($p^2$) and 8× for 6+3 ($p^3$). This is why repair bandwidth is budgeted, not best-effort.
2. **More tolerated failures buy more nines than more copies do.** Each extra parity fragment multiplies the
   safety by roughly another factor of $p$.
3. **The model is optimistic, and real loss comes from correlation.** It assumes independent failures. In
   reality, disks from one bad batch die together, a rack loses power, a software bug corrupts many nodes, or an
   operator deletes the wrong thing. That is why we spread fragments across racks and zones, keep end-to-end
   checksums, roll out storage software slowly one zone at a time, and offer versioning to protect against human
   mistakes. A design that claims 11 nines must defend against these, not just against random disk deaths.

## 8. Flow 2: reading an object (GET), even with a failed node

The same photo is read while node `n4`, which holds fragment $d_4$, is down.

[![GET sequence with a failed node: the client sends GET photos/cat.jpg; the front end asks the metadata service for the current version and learns v7 with fragments on n1 to n9; its read of d4 from node n4 gets no answer within the deadline; it reads d1 to d3, d5, d6 and parity p1 from the other 8 nodes, since any 6 of the 9 will do; six fragments arrive with good checksums; it decodes d4 from those six and streams 200 OK with 6 MB to the client](/img/system-design/object-storage/04-get.png)](/img/system-design/object-storage/04-get.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The healthy path needs no decoding.** If all of $d_1 \ldots d_6$ answer, the front end just streams them in
  order. Decoding happens only when a data fragment is missing; this is called a **degraded read**.
- **Every fragment's checksum is verified on read.** A fragment that fails its checksum is treated exactly like a
  missing one: skipped, and reported to the repair system.
- **Short deadlines and hedged requests keep reads fast.** Waiting the full network timeout for a dead node would
  add seconds. Instead the front end gives each fragment read a short deadline, and for latency-sensitive reads
  can send a 7th request (say, to a parity fragment) straight away, then use whichever 6 arrive first.
- **Range reads touch only the needed fragments.** `Range: bytes=0-1048575` (the first 1 MiB) of a large object
  maps to one chunk and only the data fragments covering that range.
- **Caching is safe for versions.** The bytes of `cat.jpg` version v7 never change. A cache keyed by
  `(bucket, key, version_id)` can never be stale; only the step "which version is current?" must go to the
  metadata service.

## 9. Low-level design: the data model

[![Data model in three groups: namespace tables bucket and object_version, where object_version is keyed by bucket_name, object_key and version_id and holds size, ETag, storage class, delete-marker flag and a data_id; data layout tables chunk, fragment and storage_node, where each chunk of a data_id has many fragments and each fragment lives on one storage node with its checksum; multipart tables multipart_upload and upload_part, linked to bucket](/img/system-design/object-storage/05-data-model.png)](/img/system-design/object-storage/05-data-model.png)

*Select the diagram to zoom in and move around.*

Five design decisions hide in this diagram.

**1. The primary key is `(bucket_name, object_key, version_id)`, sorted.** Rows are kept in key order, and
version IDs are generated so that newer versions sort first within a key. "Current version of `cat.jpg`" is
then "the first row at or after `(photos-bucket, cat.jpg)`": one seek. LIST is a scan in the same order
(section 10).

**2. Names and bytes are separated by `data_id`.** An object version points to a `data_id`, and the data layout
hangs off that. Renaming would only need a new metadata row; a completed multipart upload simply points the
new version at the parts' existing data, with no copying.

**3. Large objects are cut into chunks.** A 50 TB object cannot be one erasure-coding stripe. It is cut into
**chunks** (for example 64 MB), each erasure-coded into 9 fragments independently. A range read uses the chunk
table to find which chunk holds the bytes it needs.

**4. The fragment table is the repair system's map.** For each chunk, which `frag_index` (0–8) lives on which
node, its checksum, and when it was last verified. "Node 4417 died" becomes a query for every fragment on node
4417, which is what repair needs.

**5. A delete marker is just a row.** With versioning on, DELETE inserts a version with
`is_delete_marker = true`. The older versions stay, which is what makes "undelete" possible (section 13).

In a real system the namespace tables and the data layout tables usually live in **different stores**. The
namespace needs strong consistency and fast range scans. The fragment map is much bigger (one row per fragment)
and is read mainly by readers that already know the `data_id` and by the repair system, so it can be
partitioned by `data_id` or `node_id` instead.

## 10. Deep dive: the metadata service

The metadata service must store trillions of rows, serve a million operations a second, be strongly consistent,
and answer "list keys starting with `photos/2024/`" efficiently. Each of those requirements shapes it.

### Partitioning: range, not hash

We must split the key space across many machines (**partitions**, also called shards). There are two classic
ways:

- **Hash partitioning:** `partition = hash(bucket + key) mod N`. Load spreads perfectly, but neighbouring keys
  land on random partitions. A LIST of `photos/2024/` would have to ask **every** partition and merge the
  results. With thousands of partitions, that is hopeless.
- **Range partitioning:** each partition owns a contiguous, sorted slice of the key space, like the volumes of an
  encyclopedia (A–C, D–F, ...). Keys with a shared prefix sit next to each other, usually on one partition.

LIST by prefix is a core feature, so object stores use **range partitioning**.

[![Metadata range partitions: a client's LIST with prefix photos/2024/ reaches the front end, which asks the partition map which range holds that prefix and then scans partition 2, which owns keys from photos/2023/ to photos/2025/, starting at photos/2024/ and returning up to 1,000 keys; partition 1 holds logs/ to photos/2023/ and partition 3 holds photos/2025/ to videos/, the hot range where new uploads land, which the partition manager splits when hot; each partition is a leader with 2 followers across 3 AZs](/img/system-design/object-storage/06-metadata-partitions.png)](/img/system-design/object-storage/06-metadata-partitions.png)

*Select the diagram to zoom in and move around.*

How LIST works, step by step:

1. Look up the prefix in the **partition map** (a small table of range boundaries, cached in every front end).
2. Seek to the first key at or after `photos/2024/` in that partition and read forward in order, skipping
   noncurrent versions and delete markers, until 1,000 keys or a key that no longer starts with the prefix.
3. Return the page and a **continuation token**: an encoding of the last key returned. The next request seeks
   straight to it. No offsets, no counting; page 5,000 is as fast as page 1.
4. If the range continues on the next partition, the scan simply continues there.
5. With `delimiter=/`, when the scan meets `photos/2024/jan/a.jpg` it emits the common prefix
   `photos/2024/jan/` once and **jumps** past every key starting with it, so a "folder" holding a million
   objects costs one seek, not a million rows.

The price of range partitioning is **hot ranges**. If keys start with a date (`logs/2025-11-12/...`), every new
write lands at the end of the key space, on one partition. The **partition manager** watches load and **splits**
hot partitions at a middle key, and moves partitions between machines (section 15).

### Replication and strong consistency

Each partition is a small **replication group**: one leader and two followers, in three different zones. A
write goes to the leader, which appends it to a log and replicates it with a **consensus protocol** (Raft or
Paxos). It is committed once a **majority** (2 of 3) has it durably. Reads go to the leader, which holds a
time-limited **lease** guaranteeing that no other leader exists, so it can answer from its own state.

That gives **strong read-after-write consistency**: once a PUT returns `200 OK`, the commit is on a majority, and
every later GET or LIST goes through the current leader and sees it. S3 itself was eventually consistent for
some operations (for example, overwrites) for many years, and since December 2020 has provided strong
read-after-write consistency for all GET, PUT, LIST and DELETE operations, at no extra cost.

A few consequences to be ready for:

- **Concurrent PUTs to one key:** both writers store their bytes independently, then each commit is ordered by
  the partition leader. The later commit becomes current ("last writer wins"); with versioning on, both versions
  are kept. No locks on the data path.
- **Conditional writes** close the remaining gap. A request like "create only if the key does not exist"
  (`If-None-Match: *`) or "replace only if the ETag is still `e1`" (`If-Match`) becomes a compare-and-set
  inside the single partition that owns the key. S3 added conditional writes in 2024.
- **Caches must not break consistency.** Front ends may cache the partition map (a stale map just causes a
  redirect) and immutable version bytes, but not "which version is current" unless they have a way to learn of
  every change.

## 11. Large objects and multipart upload

Uploading a 50 GB video in one HTTP request is fragile: a network blip at 49 GB forces starting again, and one
TCP connection cannot use the full bandwidth of a fast link. **Multipart upload** splits the object into parts
that upload independently and in parallel.

[![Multipart upload sequence for a 300 MB video: the client creates an upload for video.mp4, the front end records upload u1 in the metadata service and returns uploadId u1; the client PUTs parts 1, 2 and 3 of 100 MB each in parallel, retrying any failed part alone; the front end stores each part's fragments on storage nodes, records each part's size and ETag in metadata and returns an ETag per part; finally the client sends complete u1 with the list of part numbers and ETags, the front end commits video.mp4 as parts 1 to 3 without copying any bytes, and replies 200 OK](/img/system-design/object-storage/07-multipart.png)](/img/system-design/object-storage/07-multipart.png)

*Select the diagram to zoom in and move around.*

The S3 limits, which are public and worth knowing: parts are **5 MiB to 5 GiB** (only the last part may be
smaller), at most **10,000 parts**, and objects up to **48.8 TiB** (10,000 × 5 GiB, announced as "50 TB" in December
2025; before that the limit was 5 TiB). A single PUT is limited to 5 GiB, and AWS recommends multipart for
objects of 100 MB or more.

Why this design works:

- **Each part is stored like a small object**, with its own chunks and fragments. "Complete" only writes
  metadata: the new version's chunk list is the parts' chunk lists in order. No bytes are copied, so completing a
  50 TB upload is as quick as completing a 10 MB one.
- **Atomic visibility:** until Complete commits, readers see the old version (or nothing). Then the whole
  object appears at once, exactly like a normal PUT.
- **The client chooses the order.** Parts can upload in any order and be retried individually; Complete lists
  the part numbers and ETags the client wants, so a stale retried part is never included by mistake.
- **Abandoned uploads cost money.** Parts of an upload that is never completed still occupy disk. Lifecycle rules
  can abort incomplete uploads after some days, and the garbage collector reclaims their parts.
- **Parallel downloads too:** clients read large objects with many concurrent range GETs, which spread over many
  chunks and so many disks.

One detail interviewers like: the ETag of a multipart object is **not** the MD5 hash of the whole object (no
single server ever saw all the bytes in order). It is derived from the parts' hashes. That is why integrity
checks for large objects use per-part checksums.

## 12. Deep dive: scrubbing and repair

With 20 disk failures a day, the system is always repairing something. And disks do not only die loudly; they
also corrupt data silently (**bit rot**: a sector that reads back wrong bytes without any error). Two background
processes protect against both.

[![Repair workflow: the scrubber re-reads fragments and recomputes their checksums; on a match it records verified_at, on a mismatch it adds the fragment to the repair queue; heartbeats missed by a dead node or disk add all its fragments to the same queue, which serves chunks with the fewest surviving fragments first; a repairer reads 6 healthy fragments from the other 8, rebuilds the lost one, writes the new copy to a fresh node following the same zone rules, and updates the fragment map](/img/system-design/object-storage/08-repair.png)](/img/system-design/object-storage/08-repair.png)

*Select the diagram to zoom in and move around.*

**Scrubbing** is a slow, endless background read of every fragment. Each fragment's checksum was stored when
it was written; the scrubber recomputes it from the bytes on disk and compares. A match updates `verified_at`.
A mismatch means silent corruption, and the fragment is queued for repair exactly as if it were lost. The goal
is to visit every fragment every few weeks, so corruption is found long before a second and third fault hit the
same chunk. Reads by real clients verify checksums too, so popular data is checked constantly for free.

**Failure detection** comes from heartbeats. A node that stops sending them is not declared dead at once (it may
just be rebooting); after a grace period, every fragment it held is queued for repair.

**Repair priority** follows the durability maths. A chunk that has lost 1 of 9 fragments still survives 2 more
failures; one that has lost 3 survives none. So the queue serves chunks with the **fewest surviving
fragments first**. This keeps the dangerous window short exactly where it matters.

**Repair cost** is the weakness of erasure coding: rebuilding one 1 MB fragment of a 6+3 chunk reads 6 MB. For
a dead 20 TB disk that is 120 TB of reads (section 3). Two things keep this manageable:

- **Spread the work.** The dead disk's fragments belong to millions of different chunks whose other fragments sit
  on thousands of different disks. Thousands of repairers each rebuild a little, so a 20 TB disk is rebuilt in
  hours, not the days a single replacement disk would need.
- **Budget it.** Repair runs with a bandwidth limit so it never starves customer traffic, but with a floor so it
  always keeps up with the failure rate.

Codes designed to reduce repair reads exist too, such as the **local reconstruction codes** Azure Storage has
published: extra local parity lets the most common repair (one lost fragment) read fewer fragments.

## 13. Deletes, versioning and garbage collection

### Versioning

With versioning **on**, every PUT creates a new version with its own version ID, and the older one becomes
**noncurrent** (still stored, still billable, still readable by version ID). A DELETE without a version ID does
not remove anything: it adds a **delete marker**, a special version that makes GET return "404 Not Found" and
hides the key from LIST. To undelete, remove the marker. To really delete, call DELETE with a specific version
ID. Versioning is the best protection against the most common cause of data loss: people and programs deleting
or overwriting the wrong thing.

[![Life of one object version in a versioned bucket: Uploading, with bytes written but not visible, becomes Current on commit, where GET returns it; a new PUT or DELETE makes it Noncurrent; if the newer version is removed it becomes Current again; deleting it by version ID or by lifecycle expiry makes it Version deleted, with its metadata row gone; garbage collection then reclaims the space; a current version can move to the cold tier after N days by a lifecycle rule and later expire; an upload that is aborted or never committed goes straight to Space reclaimed](/img/system-design/object-storage/09-version-lifecycle.png)](/img/system-design/object-storage/09-version-lifecycle.png)

*Select the diagram to zoom in and move around.*

### Garbage collection

A DELETE is fast because it only touches metadata. The bytes are reclaimed later by the **garbage collector
(GC)**. Data becomes garbage in three ways: a version is deleted, a PUT crashed before committing (orphans), or a
multipart upload was aborted or abandoned.

A safe GC design:

1. **Find candidates.** Either consume a log of metadata deletions, or periodically compare the storage nodes'
   inventory of `data_id`s against the metadata (a **mark and sweep**: mark everything referenced, sweep the
   rest).
2. **Wait out a grace period.** Never delete data younger than, say, a day. A PUT that is still in flight has
   written its fragments but not yet committed; deleting them would lose an object we are about to acknowledge.
3. **Double-check before deleting** that no metadata row references the `data_id`. GC bugs are a classic way to
   lose data, so the deleting side must be the most conservative code in the system.
4. **Compact.** Storage nodes usually append fragments into large files (extents) rather than one file per
   fragment. Deletes leave holes, so a compactor copies the live fragments of mostly-empty extents into new ones
   and frees the old space.

## 14. Storage classes and lifecycle rules

Most data is read a lot when new and almost never after a few months. Charging the same for both wastes
money, so object stores offer **storage classes**. S3's public line-up includes:

| Class | Use it for | Trade-off |
| --- | --- | --- |
| S3 Standard | Frequently read data | Highest storage price, no retrieval fee, at least 3 AZs |
| S3 Standard-IA (infrequent access) | Backups, older media | Cheaper storage, a per-GB retrieval fee, 30-day minimum storage charge |
| S3 One Zone-IA | Re-creatable data | Cheaper still, but stored in one AZ, so a zone loss can lose it |
| S3 Glacier Instant / Flexible Retrieval / Deep Archive | Archives and compliance copies | Much cheaper; Flexible takes minutes to hours to restore, Deep Archive within 12 hours (48 for bulk); longer minimum durations |
| S3 Intelligent-Tiering | Unknown or changing access patterns | Moves objects between tiers automatically by how often they are read, for a small monitoring fee |

How might a provider make cold tiers cheaper? We cannot see inside S3, but a typical design uses denser, slower
disks, wider erasure codes (more data fragments per parity fragment, so lower overhead), powering down idle
drives, or offline media, and accepts slower reads in return. The minimum storage durations exist because
moving data between tiers costs real work.

**Lifecycle rules** automate tiering and expiry, per bucket and optionally per prefix or tag:

```text
Rule "logs":   prefix logs/
  after 30 days   -> transition to Standard-IA
  after 90 days   -> transition to Glacier Flexible Retrieval
  after 365 days  -> expire (delete)
Rule "cleanup": whole bucket
  noncurrent versions after 30 days -> delete permanently
  incomplete multipart uploads after 7 days -> abort
```

Inside the system, a lifecycle worker scans the metadata partitions (in key order, at low priority), finds objects
whose age matches a rule, and issues the same internal operations a user would: copy the data to the target tier
and commit the new location, or delete. Evaluating rules in bulk once a day is far cheaper than a timer per
object.

## 15. Hot keys and hot prefixes

Two different things can get hot.

**A hot prefix (many keys, one range).** A service writes `logs/2025-11-12T10:00:01/...`,
`logs/2025-11-12T10:00:02/...` and so on. Every write lands at the end of the same key range, so one metadata
partition takes all the load. Fixes:

- **Automatic splitting.** The partition manager watches each partition's request rate and splits a hot range in
  two, then moves one half to another machine. S3 publicly documents that it supports at least 3,500
  PUT/COPY/POST/DELETE and 5,500 GET/HEAD requests per second **per partitioned prefix**, and scales by
  splitting prefixes as load grows. While it splits, it may return `503 Slow Down`, and clients should retry
  with exponential backoff.
- **Spread the key space on purpose.** Writing under several prefixes (`logs/shard-07/2025-11-12/...`) lets
  parallel writers hit different partitions from the start. Splitting is not instant, so a sudden 100× jump on one
  prefix will see throttling until it catches up.

**A hot object (one key, many readers).** A popular video or a software release downloaded by millions. The
metadata lookup is tiny; the bytes are the problem, since each fragment lives on just one disk. Fixes:

- **Cache by version.** Versions are immutable, so front ends can cache hot objects' bytes in memory keyed by
  `(bucket, key, version_id)` and never serve stale data.
- **Put a CDN in front** (CloudFront for S3). Edge caches near users absorb most reads, and the object store
  serves only cache misses.
- **Spread reads over more fragments.** With erasure coding, any 6 of 9 fragments will do, so reads can rotate
  among different subsets.

## 16. What breaks as it grows, and how to fix it

**Billions of tiny objects.** Metadata grows with the object count, not the byte count, and each tiny object
costs as many disk seeks as a big one. *Fix:* pack small objects into large erasure-coded containers, keep
metadata rows compact, and price per request so clients batch.

**The giant bucket.** One bucket with hundreds of billions of keys and heavy LIST traffic. *Fix:* range
partitioning already lets a bucket span thousands of partitions; continuation tokens keep deep pages cheap; for
analytics, offer a daily **inventory** file of all keys instead of repeated full LISTs.

**Repair storms.** A rack or zone outage suddenly queues petabytes of repair. Starting all of it at once would
flood the network and hurt customers, and the "dead" zone may be back in an hour. *Fix:* wait longer before
repairing a whole failed zone (the data is still readable from 6 of 9 fragments), prioritise chunks with the
fewest survivors, and rate-limit the rest.

**Correlated hardware.** Thousands of disks from one batch reach end of life together. *Fix:* mix disk models and
ages in every placement decision, and retire a suspicious batch proactively.

**Metadata hot spots.** A single partition leader saturates. *Fix:* split and move partitions automatically,
keep the partition map cached everywhere, and keep leaders spread evenly over machines and zones.

**Deploying new storage software.** A bug in the storage node code can corrupt data on every node at once, which
no erasure code survives. *Fix:* roll out one zone at a time (never more fragments' worth than a chunk can
lose), with canaries and automatic rollback, and keep the read path verifying checksums.

## 17. Reliability: how we never lose data

| Risk | Defence |
| --- | --- |
| A disk, server or rack fails | 6+3 erasure coding with no two fragments in one failure domain; repair rebuilds elsewhere within hours |
| A whole zone fails | 3 fragments per zone: 6 remain, so reads continue (degraded) and no data is lost |
| Silent corruption (bit rot) | Checksums on every fragment, verified on every read and by the scrubber |
| A crash in the middle of a PUT | Bytes first, metadata commit last; orphans are garbage-collected, never seen |
| Metadata server failure | Each partition is a 3-zone consensus group; a follower becomes leader in seconds |
| A bad software rollout | Zone-by-zone deploys, canaries, rollback; data and checksums are verified independently of the writer |
| A user or program deletes the wrong thing | Versioning with delete markers, and object locks (write-once retention) for compliance data |
| Data stolen from a disk | Encryption at rest (S3 encrypts all new objects by default since January 2023) and TLS in transit |

The pattern to remember: **durability = redundancy across independent failure domains + fast repair +
end-to-end checksums.** Remove any one of the three and the nines collapse.

## 18. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Redundancy | 3 full copies | Erasure coding 6+3 | **Erasure coding** for most data: half the disk and more failures tolerated; replicate small or very hot data |
| Metadata partitioning | Hash | Range | **Range**: LIST by prefix becomes one sorted scan; split hot ranges automatically |
| Metadata and data | Together | Separate services | **Separate**: different sizes, consistency needs and scaling problems |
| When to say `200 OK` | After all 9 fragments | After enough fragments + metadata commit | **All 9 in the common case**, 8 of 9 when a node is slow, then repair fills the gap |
| Consistency | Eventual | Strong read-after-write | **Strong**: consensus per partition makes it affordable, and users stop writing workarounds |
| Mutability | Edit in place | Immutable objects | **Immutable**: no byte-range locks, safe caching by version, simple replication |
| Deletes | Erase bytes immediately | Metadata delete + background GC | **Background GC** with a grace period: fast deletes, crash-safe orphans |
| Repair | Rebuild everything at once | Prioritised, rate-limited | **Prioritised** by fewest surviving fragments, with a bandwidth budget |

## Cheat sheet for last-minute revision

- **Object storage** = flat namespace of buckets and keys, immutable objects with metadata, accessed over HTTPS.
  No in-place edits, no real folders; that is what lets it scale to exabytes.
- **API:** PUT, GET (with ranges), HEAD, DELETE, LIST by prefix and delimiter with continuation tokens (1,000
  keys a page), multipart upload (create, upload parts, complete).
- **Split metadata from data.** Metadata service: `(bucket, key, version)` → size, checksum, fragment map;
  range-partitioned, 3-zone consensus groups, strongly consistent. Storage nodes: dumb fragment stores with
  checksums.
- **PUT:** pick nodes across failure domains → write fragments durably → commit metadata atomically → `200 OK`.
  Crash before commit leaves orphans for GC, never a half-visible object.
- **Erasure coding 6+3:** 9 fragments, any 6 rebuild; 1.5× storage (50% overhead) vs 3× (200%) for three copies;
  survives 3 losses (a whole zone) vs 2. Repair reads 6× the lost data.
- **Durability maths:** loss needs too many failures within one repair window. With $p = 10^{-5}$: 3 copies
  $\approx 0.03 \times p^2 = 3 \times 10^{-12}$; 6+3 $\approx 0.09 \times 56 \times p^3 \approx 5 \times 10^{-15}$.
  Faster repair and failure-domain spreading buy nines; correlated failures are the real enemy.
- **11 nines** = $10^{-11}$ loss chance per object per year: 10 million objects, about one lost per 10,000 years.
- **GET:** metadata lookup → read data fragments → if one is missing or corrupt, read any 6 and decode
  (degraded read). Version bytes are immutable, so caching them is always safe.
- **LIST:** range scan from the prefix in sorted key order; delimiter rolls keys up into common prefixes.
- **Consistency:** S3 has been strongly read-after-write consistent since December 2020; conditional writes give
  compare-and-set.
- **Repair:** scrubber checks checksums; dead nodes detected by heartbeats; fix chunks with the fewest survivors
  first; spread rebuilds over thousands of disks.
- **Versioning:** new version per PUT, delete markers on DELETE; lifecycle rules expire noncurrent versions,
  tier data to cheaper classes and abort incomplete uploads.
- **Multipart:** 5 MiB to 5 GiB parts, up to 10,000 parts, objects up to about 50 TB (5 TiB
  before December 2025); Complete is a metadata-only commit.
- **Hot prefixes:** auto-split ranges (S3: 3,500 writes and 5,500 reads per second per prefix), back off on
  `503 Slow Down`; hot objects go behind a CDN.
- **Numbers (our assumptions):** 10 EB logical, 15 EB raw, 750,000 disks, about 20 disk failures a day, about
  2.5 PB of repair reads a day.

## Practice questions

1. **Why can't we just use hash partitioning for the metadata, like a key-value store?** LIST by prefix would
   have to query every partition and merge the results. Range partitioning keeps keys with a shared prefix
   together so a LIST is one sorted scan. The cost is hot ranges for sequential keys, handled by automatic
   splitting.
2. **A client PUTs an object, gets `200 OK`, and immediately GETs it from a replica bucket in another region. What
   does it see?** Read-after-write is guaranteed only within the bucket's own region, where its metadata lives. The
   replica has the object only once cross-region replication has copied it, which is asynchronous, so it may get
   `404 Not Found` or the previous version for a while.
3. **How would you add "rename a folder"?** There are no folders: renaming `photos/` means rewriting the
   metadata row of every key under it. Because names point to a `data_id`, no bytes move, but it is still one
   metadata write per object and not atomic across partitions. That is why classic object stores do not offer a
   folder rename, and why systems needing it build a file-system layer with its own directory metadata on top.
4. **Two disks holding fragments of the same chunk fail an hour apart. Is the data at risk?** Not yet: 6+3
   survives 3 losses, and this chunk has lost 2. It now has the fewest survivors in the repair queue, so it is
   rebuilt first. Data is lost only if a fourth fragment of this same chunk is lost before repair finishes.
5. **How do you make 6+3 erasure coding work for a 4 KB object?** Do not split it 6 ways. Pack many small objects
   into a large container, erasure-code the container, and store each small object's `(container, offset, length)`
   in its metadata. Deleting small objects leaves holes, which compaction later reclaims.
6. **How would you estimate the repair bandwidth needed?** Disks × annual failure rate ÷ 365 gives failures a day;
   multiply by disk size and by $k$ (fragments read per rebuild). With our numbers: about 20.5 disks a day ×
   20 TB × 6 ≈ 2.5 PB a day, about 28 GB/s, which must fit within the network budget left over by customer
   traffic.
