---
title: "Design a File Sharing and Sync System (like Dropbox / Google Drive)"
description: "Design Dropbox-style file sync: content-defined chunking, block deduplication, a consistent metadata journal, long-poll sync and conflicted copies."
difficulty: "Hard"
sidebar:
  label: "File sync (like Dropbox / Google Drive)"
tags: ["Storage", "Sync", "Deduplication", "Consistency", "Hashing"]
---

A file sync service feels like magic: you save a spreadsheet on your laptop, and a few seconds later the new
version is on your phone, on your colleague's computer, and safely in the cloud. Underneath, it is several hard
systems in one. It is a **removal company** that moves only the boxes that changed, a **librarian** who keeps a
perfect catalogue of every file and every old version, a **warehouse** that stores each unique box once even if
a million customers own a copy, and a **referee** that decides what happens when two people edit the same file
at the same moment.

This case study builds that system from first principles. We start with the vocabulary, design the service
layer by layer, spend most of the time on what interviewers push on (chunking, deduplication, the sync protocol
and conflicts), and finish with what breaks as it grows and a one-page revision sheet.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. File sync in 5 minutes: the vocabulary

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Sync client** | The desktop app that watches a folder on your disk and keeps it identical to the cloud copy | A personal assistant who copies every change you make into the master binder |
| **Block** (or **chunk**) | A piece of a file, typically a few KB to a few MB. Files are stored and transferred as blocks, never as whole files | Pages of a book, posted one by one |
| **Content hash** | A fingerprint of some bytes, such as SHA-256: 32 bytes that change completely if a single input bit changes | A barcode printed from the page's contents |
| **Deduplication** | Storing identical blocks only once, however many files or users contain them | One copy of a popular book in the library, many borrowers |
| **Metadata** | Everything about a file except its bytes: name, folder, size, version number, and the list of block hashes | The library catalogue card |
| **Namespace** | A self-contained tree of files with its own history: your personal folder is one, every shared folder is another | One binder per project |
| **Journal** and **cursor** | An append-only, numbered log of every change in a namespace; a device's cursor is "the last entry I have seen" | A ship's logbook and a bookmark in it |
| **Long-poll** | A request the server deliberately holds open until something changes (or a timeout passes) | Waiting at the counter instead of phoning every minute |
| **Conflicted copy** | A second file the system creates when two devices changed the same file from the same starting point | "I could not merge your edits, so here are both" |

The single idea that makes everything else work:

> **A file is just an ordered list of block hashes.** `report.docx` = `[h1, h2, h3, h4, h5]`.

Once you see a file this way, the rest of the design falls out. To check whether two files are equal, compare
hash lists. To upload an edit, send only the blocks whose hashes the server does not have. To store a million
copies of the same video, store its blocks once. To keep old versions, keep old hash lists; they are tiny. And
the system splits naturally into two halves: a **metadata service** that manages the small, precious hash lists
and folder trees, and a **block store** that holds the big, dumb, immutable bytes.

## 2. Requirements

### Functional (what users can do)

- **Sync a folder** across all of a user's devices (Windows, macOS, Linux, iOS, Android, web). Edits made on
  one device appear on the others within seconds.
- **Upload and download** files of any size, from a 1 KB text file to a 50 GB video, with resumable transfers.
- **Work offline**: edit files with no connection; changes sync when the device reconnects.
- **Share** a folder with other people (they can view or edit), or share a file or folder by **link**.
- **Version history**: see and restore earlier versions of a file.
- **Recover deleted files** for a retention window.
- **Handle conflicts** when two devices edit the same file at the same time, without ever losing either edit.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Durability** | Never lose a committed file (eleven nines for stored blocks) | People keep their only copy of photos, theses and contracts here |
| **Consistency of metadata** | Strong: every device sees the same file tree in the same order of changes | Two devices must never disagree about which version is the latest |
| **Sync latency** | A small edit reaches other online devices in a few seconds | It should feel like one folder on many machines |
| **Bandwidth efficiency** | Upload only what changed; never re-upload content the server already has | Users are on home broadband and mobile data; we pay for egress too |
| **Availability** | 99.99% for reads and sync; the client keeps working offline during outages | The local folder is always usable |
| **Scale** | ~500 million users, ~100 million daily active, exabytes stored | Dropbox / Google Drive sized |
| **Security** | TLS in transit, encryption at rest, strict per-namespace access control | Files are some of the most private data people have |

### Out of scope

Real-time collaborative editing inside a document (that is the [Google Docs](/system-design/case-studies/hard/google-docs/)
problem: operational transformation or CRDTs), full-text search over file contents, the photo-gallery and
document-preview products, and billing. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resources dominate**.

**Assumptions:** 500 million registered users, 100 million daily active. A user stores **5 GB** on average in
about **2,000 files**. Each daily user changes **20 files** a day, and after deduplication an average change
uploads **500 KB** of new blocks. Each daily user has **2 devices** online.

**Storage**

- Logical data: $500\text{M} \times 5\text{ GB} = 2.5\text{ EB}$.
- Deduplication (assume it saves 25%): about $1.9\text{ EB}$ of unique bytes.
- Erasure coding at 1.5× overhead (explained in section 17): $1.9 \times 1.5 \approx 2.8\text{ EB}$ of raw disk,
  plus some more for old versions and deleted files still inside their retention window.

**Metadata**

- Files: $500\text{M} \times 2{,}000 = 10^{12}$, a trillion file entries.
- At roughly 500 bytes per entry (name, IDs, size, a few hashes), that is $10^{12} \times 500\text{ B} =
  500\text{ TB}$, and more again for old versions and the journal. Small next to the blocks, but far too big
  for one database, so it must be **sharded**.

**Traffic**

- Commits (new file versions): $100\text{M} \times 20 = 2\text{B}$ a day, about **23,000 per second** on
  average and ~70,000 per second at peak (3×).
- Upload bandwidth: $2\text{B} \times 500\text{ KB} = 1\text{ PB}$ a day, about $11.6\text{ GB/s}$, or
  **~93 Gbit/s** on average.
- Download bandwidth is larger: every change is pulled by the user's other devices and by everyone sharing the
  folder, so assume about **2×** the upload volume.

**Open connections**

- $100\text{M} \times 2 = 200\text{M}$ devices waiting for changes at any moment.
- If each long-poll times out after 60 seconds and is re-sent, the empty re-polls alone are
  $200\text{M} / 60 \approx 3.3\text{M}$ requests per second. Stretching the timeout to 5 minutes cuts that to
  about 670,000 per second. So **the notification tier is a connection-holding problem**, not a compute problem.

Three conclusions follow:

1. **Bytes dominate cost, so never move or store a byte twice.** Block-level dedup and "upload only changed
   blocks" are not optimisations; they are the design.
2. **Metadata is small but precious.** It must be strongly consistent and transactional, so it lives in a
   sharded relational-style database, not in the object store.
3. **Waiting is the most common thing clients do.** The notification tier must hold hundreds of millions of
   idle connections cheaply.

## 4. The API

Clients talk to us over HTTPS. The API is built around blocks, commits and a change cursor; there is no
"upload a whole file" call on the main sync path.

| Method and path | What it does |
| --- | --- |
| `POST /v1/blocks/check` | Body: a list of hashes. Returns the ones the server does **not** have. |
| `PUT /v1/blocks/{hash}` | Upload one block (up to 4 MB). The server recomputes the hash and rejects a mismatch. |
| `GET /v1/blocks/{hash}` | Download one block. Needs a short-lived access token issued by the metadata service (section 13). |
| `POST /v1/files/commit` | Body: `namespace_id`, `path`, `parent_rev`, `size`, `block_list`. Creates a new version. Returns the new `rev`, a list of missing blocks, or a conflict. |
| `POST /v1/changes` | Body: `cursor`. Returns the journal entries after it, a new `cursor` and `has_more`. |
| `POST /v1/changes/longpoll` | Body: `cursor`, `timeout`. Hangs until something changes, then returns `{"changes": true}`. Carries no file data. |
| `GET /v1/files/revisions?path=...` | List the versions of a file. |
| `POST /v1/files/restore` | Restore a version or a deleted file (creates a new revision). |
| `POST /v1/sharing/folders`, `POST /v1/sharing/links` | Share a folder with people, or create a link with optional password and expiry. |
| `POST /v1/uploads/start`, `.../append`, `.../finish` | Resumable upload session for clients that cannot chunk and hash (the web uploader, the public API). |

This shape is not invented for the interview. Dropbox's public API offers a folder listing that returns a
**cursor**, a `continue` call to fetch changes after it, a **long-poll** endpoint that waits for changes, and
**upload sessions** for large files. Google Drive's API has a **changes** feed driven by page tokens and a
**resumable upload** protocol. Same ideas, different names.

Two details matter:

- **`parent_rev` in the commit** is how the server detects that two devices edited the same version (section 12).
- **Commits are idempotent**: committing the same `parent_rev` and the same `block_list` twice returns the same
  `rev`, so a client that lost the reply can safely retry.

## 5. High-level design

[![High-level architecture: desktop, web and mobile clients reach the API gateway; the metadata service writes versions and journal entries to the sharded metadata DB; the block service stores blocks by hash in the block store; the notification service holds long-polls and is woken by the change bus; the sharing service keeps ACLs and link tokens in the sharing DB; async workers consume change events](/img/system-design/dropbox/01-architecture.png)](/img/system-design/dropbox/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Desktop client:** watches the synced folder, splits files into blocks, keeps a local index, and runs the
  sync engine (section 6).
- **Web and mobile apps:** browse and download on demand; they do not mirror the whole folder.
- **API gateway:** authenticates every request (OAuth tokens), rate-limits, terminates TLS, routes.
- **Metadata service:** owns the file tree, versions and journal. Every commit goes through it. It is the
  **source of truth** for "what is the latest version of this file".
- **Block service:** stores and serves blocks by hash. It knows nothing about file names or folders.
- **Block store:** object storage holding immutable blocks, with hot and cold tiers.
- **Notification service:** holds every device's long-poll and answers it when that device's namespaces change.
- **Sharing service:** members and roles of shared folders, and link tokens.
- **Change bus** (for example Kafka): carries "namespace N changed" events from the metadata DB to the
  notification service and to **async workers** (thumbnails and previews, search indexing, garbage collection).

The most important idea in this design: **separate metadata from blocks**. The metadata path is small,
transactional and strongly consistent. The block path is huge, simple and embarrassingly parallel. They scale,
fail and cost money in completely different ways, so they are different services with different storage.

## 6. The desktop client

Interviewers often skip the client, but for this problem much of the cleverness lives there.

[![Inside the desktop client: the synced folder raises OS change events to the file watcher, the chunker splits changed files into blocks and hashes them, the local index DB records path, mtime, hashes and rev, the sync engine compares local, synced and remote state and sends new blocks to the block service and the new version to the metadata service](/img/system-design/dropbox/02-client.png)](/img/system-design/dropbox/02-client.png)

*Select the diagram to zoom in and move around.*

**The file watcher.** Scanning a folder of 100,000 files every few seconds would melt the disk. Instead, every
operating system can tell an app what changed: **FSEvents** on macOS, **inotify** on Linux and
**ReadDirectoryChangesW** on Windows. The watcher turns those events into a queue of changed paths. Events can be
dropped (inotify has a queue limit, and changes made while the app was closed produce no events at all), so the
client also runs an occasional **full rescan** as a safety net, comparing size and modification time against
its index and hashing only files that look different.

**The local index database.** A small embedded database (SQLite is a common choice) with one row per file:
path, size, modification time, block hashes, and the server `rev` it was last synced at. It lets the client
answer "has this file really changed?" without re-reading it, and it survives restarts so the client never has to
re-upload or re-download everything after a reboot.

**The three trees.** A robust sync engine keeps three views of the folder:

| Tree | What it says |
| --- | --- |
| **Remote** | What the server says the folder looks like now (from the journal) |
| **Local** | What is on the disk now (from the watcher and the index) |
| **Synced** | What the two last agreed on: the **merge base** |

With a merge base, every decision is mechanical, exactly like a three-way merge in Git:

- Local differs from synced, remote equals synced → **upload** the local change.
- Remote differs from synced, local equals synced → **download** the remote change.
- Both differ from synced → if they are now equal, just record it; otherwise it is a **conflict** (section 12).
- Neither differs → nothing to do.

Without the synced tree, the client cannot tell "I deleted this file" from "the server has a new file I have
not downloaded yet"; both look like "the server has a file I do not". Dropbox's engineering blog describes its
rewritten sync engine (Nucleus) as being built around exactly these three trees.

**Avoiding echoes.** When the client writes a downloaded file to disk, the watcher sees a change and would
happily upload it again. The client prevents this by updating the local index *before* moving the file into
place, so the watcher's event finds a file that already matches the index and is ignored.

## 7. Deep dive: splitting files into blocks

Why split at all? Three reasons. A 2 GB video cannot be sent in one HTTP request reliably; blocks give
**resumable, parallel** transfers. An edit to one part of a file should cost **one block**, not the whole file.
And identical blocks across files and users can be stored **once**.

The interesting question is *where to cut*.

### Fixed-size chunking

Cut every N bytes: bytes 0 to 4 MB are block 1, 4 MB to 8 MB are block 2, and so on. It is simple and fast, and
it works perfectly when a file is **edited in place**: change a byte in the middle of a database file or a
virtual-machine disk image and only the block containing it changes. Dropbox has described splitting files into
**4 MB blocks** identified by their **SHA-256** hash.

Its weakness is an **insertion or deletion**. Insert one byte at the start, and every later byte moves along by
one, so every block boundary now falls in a different place and *every* block gets a new hash.

### Content-defined chunking (CDC)

Instead of cutting at fixed positions, cut where **the content itself** says so. Boundaries then move *with*
the content when bytes are inserted before them.

Here is a toy example. The "file" is the text `the cat sat on the mat`, and someone inserts `a ` at the start.

| Method | Original file | After inserting `a ` | New blocks |
| --- | --- | --- | --- |
| Fixed, 4 bytes | `the ` `cat ` `sat ` `on t` `he m` `at` | `a th` `e ca` `t sa` `t on` ` the` ` mat` | all 6 |
| Content-defined: cut after each space | `the ` `cat ` `sat ` `on ` `the ` `mat` | `a ` `the ` `cat ` `sat ` `on ` `the ` `mat` | 1 (`a `) |

With fixed chunks, the insertion shifted every boundary, so nothing matches. With content-defined chunks, the
cut points are attached to the spaces, so after the inserted block every block is identical to before, and the
client uploads one tiny block. (Notice also that `the ` appears twice: deduplication stores it once.)

Real files do not have convenient spaces, so CDC uses a **rolling hash**:

1. Slide a small window (say 48 bytes) over the file one byte at a time.
2. At each position compute a hash of the window. A **rolling** hash (Rabin fingerprints, or the faster "Gear"
   hash used by FastCDC) can be updated in $O(1)$ when the window moves by one byte: remove the outgoing byte's
   contribution and add the incoming one, instead of rehashing 48 bytes.
3. Cut a boundary wherever the hash matches a pattern, for example "its lowest 13 bits are all zero". That
   happens with probability $1/2^{13}$ at each position, so the gap between cuts averages about **8 KB** (a
   little more once the minimum size below is added). Use more bits for bigger blocks.
4. Enforce a **minimum** size (do not cut in the first 2 KB of a block) and a **maximum** size (force a cut at
   64 KB) so pathological content, like a file of all zeros, does not produce tiny or endless blocks.

Because the boundary decision looks only at the last 48 bytes, an insertion can only change the boundaries
within a block or so of where it happened. Everything after that "resynchronises" to the same cut points as
before. That is why **CDC survives insertions**. The idea goes back to the Low-Bandwidth File System research
project (2001) and is used by backup tools such as restic and Borg.

**rsync** solves a related problem differently: the receiver sends hashes of its fixed blocks, and the sender
slides a cheap rolling checksum over its file to find those blocks at *any* offset. It needs a round trip per
file between two specific copies, so it suits one-to-one transfers better than a shared, deduplicated store.

### Which to choose

| | Fixed-size | Content-defined |
| --- | --- | --- |
| Cost to compute | Just hashing | A rolling hash over every byte, plus hashing (more CPU; Gear-style hashes keep the extra small) |
| Edit in place | One block changes | One block (sometimes two) changes |
| Insert or delete bytes | Every later block changes | Only the nearby block changes |
| Dedup across different files | Only if content is aligned to the same offsets | Finds shared runs at any offset |
| Block count | Predictable | Variable, needs min and max sizes |

A sensible answer in an interview: **CDC for the general case**, because documents, source files and archives
change by insertion all the time; fixed blocks are acceptable if you are optimising for CPU on phones and most
large files (photos, videos) are written once and never edited. Many formats such as ZIP-based `.docx` are
recompressed on every save, so *neither* method finds much reuse in them; that is a limit of the file format,
not of chunking.

Block size is its own trade-off. Small blocks (KBs) find more duplicates and make edits cheaper, but a 1 TB
library becomes hundreds of millions of hashes to store, check and list. Large blocks (MBs) mean less metadata
and fewer requests. A common compromise: CDC with an average of a few hundred KB to a few MB, and the commit
lists hashes, not bytes.

## 8. Deep dive: content hashes and deduplication

Every block is **named by its hash**: the block with hash `h2` is stored at key `h2`. This is called
**content-addressed storage**, and it gives us four things almost for free:

- **Deduplication.** Before uploading, the client asks `POST /blocks/check [h1..h5]`. If the server already has
  `h1`, `h3` and `h4` (from this user, from an earlier version, or from someone else), only `h2` and `h5` travel.
- **Integrity.** The block service recomputes SHA-256 of every uploaded block and rejects a mismatch; the client
  does the same for every download. A flipped bit on a disk or a bad network card cannot silently corrupt a file.
- **Immutability.** A hash names exactly one content forever, so a block is never edited in place. Caches can keep
  blocks indefinitely, replicas can never be "stale", and the block store can be eventually consistent without
  any risk of serving the wrong bytes.
- **Cheap copies.** Copying a 10 GB folder, restoring an old version or moving a file into a shared folder is a
  metadata operation: new rows pointing at the same hashes.

Is SHA-256 safe as an identity? The chance of two different blocks colliding is around $2^{-128}$ even after
storing $2^{64}$ blocks: far smaller than the chance of undetected disk corruption, so the industry treats it as
unique.

### Dedup scope and a security trap

How widely should we deduplicate? Per user is safe and still catches the common cases (old versions, copies,
moves). **Across all users** saves more (the same popular installer or film stored once), but has a known trap:
if the server skips an upload whenever it has seen the hash, then **anyone who learns a file's hash can claim
the file**, just by committing that hash list. It also leaks information: a fast "already have it" answer tells
an attacker that *someone* stored that exact file.

Defences, from simplest to cleverest:

1. Deduplicate only **within a user or a team** (the usual answer).
2. Deduplicate storage across users, but still make the client **upload the bytes** the first time *it* uses a
   block; the server just discards the duplicate. You save disk, not bandwidth.
3. Make the client **prove possession**: the server asks for a hash of the block combined with a random value it
   chooses, which only someone holding the bytes can compute.

### Garbage collection

When the last version that references a block expires, the block's space should be reclaimed. Two common ways:

- **Reference counts** on each block, incremented when a version is committed and decremented when it expires.
  Simple, but a missed decrement leaks space and an extra one destroys data, so counts drift and need repair.
- **Mark and sweep**: periodically scan all live block lists, mark every referenced hash, and delete unmarked
  blocks. Slow, but self-correcting.

Either way, there is a dangerous race: a client checks that `h2` exists, the collector deletes it a moment
later, and the client commits a block list pointing at nothing. The fix is a **grace period**: only delete a
block that has been unreferenced for, say, several days, and have the commit re-check that every block exists.

## 9. Flow 1: uploading an edit

Alice edits `report.docx` on Laptop A. The file was at rev 7; after chunking, its new block list is
`[h1, h2, h3, h4, h5]`.

[![Upload sequence: Laptop A commits report.docx with parent rev 7 and five hashes; the metadata service checks which hashes exist and answers need h2 and h5; the laptop puts those two blocks to the block service, which verifies and stores them; the laptop commits again, the metadata service writes rev 8 and a journal entry in one transaction, replies with rev 8, and the metadata DB emits namespace changed to notifications](/img/system-design/dropbox/03-upload.png)](/img/system-design/dropbox/03-upload.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Commit first, upload second.** The first commit doubles as the "which blocks do you need?" question, saving a
  round trip. If the server already had everything (a copy, a restore, an undo), the first commit simply succeeds
  and no bytes move at all.
- **Blocks before metadata, always.** The new version becomes visible only when every block it references is
  safely stored. A reader can never see a version whose bytes are missing. If the laptop dies between steps 6 and
  7, the uploaded blocks are orphans that garbage collection will reclaim; nothing is corrupted.
- **Step 8 is one transaction**: insert the version row, update the file's `latest_rev`, and append a journal
  entry with the next sequence number. Either all happen or none do, and it only succeeds if the latest version is
  *still* rev 7 (a compare-and-set). That condition is how conflicts are detected.
- **Blocks upload in parallel**, several at a time, each one independently retryable.
- Notification is **asynchronous** (step 10): the commit is acknowledged without waiting for other devices.

## 10. Low-level design: the data model

[![Data model: a namespace has files, journal entries, members, mounts and share links; a file has versions whose block_list holds block hashes; the block table stores size, location, reference count, tier and key ID per hash](/img/system-design/dropbox/04-data-model.png)](/img/system-design/dropbox/04-data-model.png)

*Select the diagram to zoom in and move around.*

Design decisions hidden in this diagram:

**1. Everything is grouped by namespace and sharded by `ns_id`.** A user's personal folder is one namespace; each
shared folder is another. Almost every operation (commit, list changes, list a folder) touches exactly one
namespace, so all its rows live on one shard and one transaction covers them. Shards are assigned through a
lookup directory so a namespace can be moved without changing its ID.

**2. Files have stable IDs, not just paths.** `file` stores `parent_id` and `name`. Renaming a file, or moving a
folder of 10,000 files, changes **one row**; nothing is re-uploaded and the files' version history follows them.

**3. A version is a block list.** `file_version.block_list` is the ordered list of hashes. A 1 GB file with 4 MB
blocks has 256 hashes, about 8 KB of metadata as 32-byte binary hashes. Very large lists can be stored as a separate row set, but the idea
is the same.

**4. The journal is the heart of sync.** Every change in a namespace (add, edit, rename, delete) appends a row
`(ns_id, seq, file_id, rev, op, path)` with `seq` increasing by one each time. `namespace.latest_seq` is the head of
the log. Devices sync by reading the journal from their cursor onwards.

**5. Blocks are global, not per namespace.** The `block` table (really a huge key-value index sharded by `hash`)
records where each block lives, its size, its tier, its reference count and which encryption key protects it.

**6. Sharing is a graph of mounts.** `member` says who may access a namespace and with what `role`; `mount` says
where it appears in each member's tree (Bob may mount the shared folder "Project X" at `/Work/Project X`).

### Why metadata must be strongly consistent

Imagine the metadata DB were eventually consistent. Laptop A commits rev 8. Laptop B reads from a lagging
replica, still sees rev 7, edits it and commits "parent rev 7": a replica may accept it, and now two "latest"
versions exist on different replicas. Or B lists changes and gets journal entries 1041 and 1043 but not 1042, then
moves its cursor past 1042 forever and never learns about that change.

Sync correctness depends on two guarantees: **a total order of changes per namespace** and **compare-and-set on
the latest version**. Both need a single authoritative writer per namespace and transactions, which is why the
metadata store is a sharded relational database or a strongly consistent distributed store (MySQL with
replication behind a sharding layer, Spanner-style systems, or similar), and why each namespace's shard has one
leader that hands out sequence numbers.

The block store, in contrast, can be as relaxed as it likes, because blocks are immutable and named by their
content.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Files, versions, journal | Trillions of small rows, transactional, always accessed by `ns_id` | Sharded MySQL / Postgres, or a Spanner-like store | Transactions, compare-and-set, ordered journal |
| Block index | Point lookups by hash, huge | Distributed key-value store (sharded by hash) | Simple, uniform keys; no joins |
| Block bytes | Immutable, KB to MB each, exabytes | Object storage (S3-like or in-house) | Cheapest per byte, very durable |
| Members, mounts, links | Small, read on every access check | Relational DB plus a cache | Joins, consistency for revocation |
| Change events | Ordered, durable stream | Kafka or similar | Fan-out to notifications and workers |
| Client index | One device's view | SQLite on the device | Fast, local, survives restarts |

## 11. Flow 2: the sync protocol

Laptop B, which also has `report.docx`, now needs Alice's edit.

[![Sync sequence: Laptop B long-polls the notification service with its cursor; the metadata service signals namespace 42 changed and the long-poll returns changes true; B lists changes since its cursor and receives report.docx rev 8 with its block list and a new cursor; B fetches only blocks h2 and h5, verifies their hashes and writes a temp file that it renames into place](/img/system-design/dropbox/05-sync.png)](/img/system-design/dropbox/05-sync.png)

*Select the diagram to zoom in and move around.*

The protocol has three parts.

**1. The cursor.** A device's cursor records, for every namespace it can see, the last journal `seq` it has
applied: for example `{personal: 1041, project-x: 977}`. It is opaque to the client (the server can encode and
sign it). Asking "what changed since my cursor?" returns journal entries after those positions, in order, in pages
(`has_more`). A device that was offline for a week sends the same request and gets a week of changes; it does not
matter how many pushes it missed.

If a cursor is too old (the server compacts the journal after a while), the server answers "reset", and the
client re-lists the current tree and compares it with its local index. Only differing files are fetched, so even
a reset is cheap.

**2. Being told when to look.** Options, from naive to best:

| Approach | How it works | Problem |
| --- | --- | --- |
| Polling | Ask "anything new?" every 30 s | Slow (up to 30 s late) and wasteful: almost every answer is "no" |
| **Long-poll** | Ask, and the server holds the request open until a change or a timeout | Cheap, works through every proxy and firewall, near-instant |
| WebSocket | One persistent two-way connection | Also good; more stateful to load-balance |
| Mobile push (APNs, FCM) | The OS wakes the app | Required on phones, where apps cannot hold connections in the background |

The notification carries **no file data**, just "something changed". The device then pulls through the normal,
authorised `changes` call. If a notification is lost, nothing breaks: the next long-poll or the next pull catches
up, because the cursor says exactly what is missing.

Inside the notification service, each server keeps an in-memory map `ns_id → waiting connections`. It subscribes
to the change bus for the namespaces its connections care about; when "namespace 42 changed" arrives, it answers
every waiting request for namespace 42. A server can hold a few hundred thousand idle connections, so 200
million waiting devices need a fleet of roughly a thousand machines. The response can include a `backoff` hint so
that, under load, clients wait before polling again.

**3. Applying remote changes safely.** The client fetches only missing blocks (it can reuse `h1`, `h3`, `h4` from
the local copy or a local block cache), assembles the file in a hidden **temporary file**, verifies its hashes, and
then **atomically renames** it over the old file. A crash half-way leaves either the old file or the new one,
never a half-written mix. Just before the rename it checks that the local file still matches the synced tree; if
the user edited it in the meantime, that is a conflict, handled next.

Changes are applied **in journal order**, which matters: "create folder `/a`" must happen before "create
`/a/b.txt`", and "rename `x` to `y`" then "create a new `x`" must not be reordered.

## 12. Deep dive: conflicts

Laptop A and Laptop B both start from rev 7 of `report.docx`. Both are offline on a train; both edit it. A
reconnects first and commits rev 8. B then commits with `parent_rev = 7`.

[![Commit handling: if the commit's parent is the latest revision, save the new revision and notify devices; otherwise compare content hashes; if equal, the file is already in sync and the device adopts the latest revision; if different, keep both by saving a conflicted copy, which is committed as a new file and notified](/img/system-design/dropbox/06-conflict.png)](/img/system-design/dropbox/06-conflict.png)

The server notices that B's parent (7) is not the latest (8). What now?

- **Last writer wins** would silently throw away A's edits. For a sync service whose promise is "your files are
  safe", losing work is the worst possible outcome.
- **Automatic merging** works for plain text sometimes, but a sync service stores *any* file: spreadsheets,
  Photoshop files, SQLite databases, encrypted archives. There is no general way to merge two binary files, and a
  wrong merge corrupts silently.
- **Keep both** is always safe. The server keeps rev 8 as `report.docx`, and B's version is saved next to it as a
  new file with a clear name. Dropbox names these like `report (Bob's conflicted copy 2026-11-12).docx`. A human,
  who understands the content, decides what to keep.

That is why sync services choose **conflicted copies**: they never lose data and never guess. The cost is a
little clutter, and conflicts are rare in practice because most files are edited by one person on one device at a
time.

Other cases worth knowing:

- **Same content on both sides** (both devices downloaded the same attachment): compare content hashes; no
  conflict, B simply adopts rev 8.
- **Edit versus delete**: A deletes the file, B edits it. Keeping the edit is the safe choice: the file comes back
  with B's version, because an unwanted file is a small annoyance while lost work is a disaster.
- **Rename versus edit** does not conflict, because renames change the `file` row and edits create versions; both
  apply cleanly. This is a direct benefit of stable file IDs.
- **Folder-level conflicts** (A renames `/Docs` to `/Papers`, B moves a file into `/Docs`): the journal's order and
  file IDs resolve them, since B's file is placed into folder ID 17, whatever that folder is now called.

Collaborative editors such as Google Docs avoid conflicted copies by merging edits character by character in real
time; that only works because they understand the document format and route every keystroke through a server.

## 13. Sharing and permissions

**Shared folders.** When Alice shares `Project X` with Bob and Carol, it becomes (or already is) its own
**namespace**. Each member gets a `member` row with a role (`owner`, `editor`, `viewer`) and a `mount` row saying
where it appears in their tree. A change by Carol is written **once**, to that namespace's journal; Alice's and
Bob's cursors both include that namespace, so their devices pick it up through the normal sync path. Nothing is
copied per member.

When Bob accepts the share, his cursor gains `project-x: 0`, and his devices pull the whole folder's history (or,
better, a snapshot of the current tree) like any other change. Leaving the share deletes his mount; his devices see
the folder removed.

**Checking access on every request.** The metadata service checks membership and role for every list and commit
(viewers cannot commit). For blocks, **a hash alone must never be enough to download data**, because hashes can
leak (logs, a shared screenshot of a debug page). Instead, when the metadata service returns a block list it also
issues a short-lived **signed token** listing the hashes the caller may read; the block service verifies the
signature and expiry without a database lookup.

**Links.** A shared link maps an unguessable token (at least 128 random bits) to a `(ns_id, file_id)` with an
access level, optional password and optional expiry. Because it points at the file ID, the link keeps working after
renames. Revoking it deletes the row; downloads through links are rate-limited to stop a link becoming a free
content-delivery network for pirated files.

**Revocation must be quick.** Membership is cached for speed, but removing someone must take effect within
seconds, so the sharing service publishes "membership changed" events that invalidate caches, and block tokens are
short-lived (minutes) so a revoked user's tokens die soon.

## 14. Version history and deleted-file recovery

Because a version is just a block list, keeping history is cheap: the old hash lists stay, and the blocks they
reference are kept alive by their references.

[![Life of a file version: uploading becomes current when the commit is accepted; a newer revision moves it into history, from which it can be restored as a new revision; a current file can be deleted and restored; history and deleted versions expire when their window ends and their blocks are garbage-collected; uploads never committed are abandoned and their orphan blocks collected](/img/system-design/dropbox/07-version-states.png)](/img/system-design/dropbox/07-version-states.png)

*Select the diagram to zoom in and move around.*

- **Restoring a version** creates a **new** revision whose block list copies the old one. History only ever grows
  forwards, which keeps the journal simple: other devices just see "rev 9 committed".
- **Deleting a file** is a journal entry with `op = delete` and `deleted_at` set on the `file` row. The versions
  and blocks remain, so the file appears in "Deleted files" and can be restored with zero upload.
- **Retention windows** decide when old versions and deleted files really go. Real services offer a fixed window
  (for example, Dropbox documents 30 days of version history on its Basic, Plus and Family plans and 180 or 365
  days on its business plans, and
  Google Drive empties its trash after 30 days). After the window, a background job removes the version rows and
  decrements block references; garbage collection reclaims blocks nothing references.
- **Ransomware recovery** falls out of this design: if malware encrypts every file on a laptop, the client
  dutifully syncs thousands of new versions, but every previous version is still there. A "restore this folder to
  how it was yesterday" feature is a query over the journal plus a batch of restores.

## 15. Large files and resumable upload

A 50 GB video on a hotel Wi-Fi connection will be interrupted. The design handles this in two ways.

**On the desktop client, block upload is resumable by construction.** Each block is an independent `PUT` of at
most a few MB. After a drop, the client simply asks `blocks/check` again and uploads what is still missing. Blocks
go in parallel (say 4 to 8 at once) to fill the pipe, with retries and exponential backoff per block. The commit
happens only at the end, so other devices never see a half-uploaded file.

The client also has to be careful with **files that change during upload** (a growing log file, a video still
being exported). It snapshots the block list it computed, uploads, and before committing checks the file's size
and modification time again; if they changed, it re-chunks and uploads the new blocks.

**For clients that cannot chunk** (a browser upload, a third-party app using the public API), offer an **upload
session**:

1. `start` returns a `session_id`.
2. `append(session_id, offset, bytes)` adds chunks of, say, 8 to 150 MB. The server stores each part.
3. After a disconnect, the client asks for the session's current offset and continues from there.
4. `finish(session_id, path, parent_rev)` makes the server chunk and hash the parts into blocks and commit.

Sessions expire after a day or so, and their parts are garbage-collected. Downloads are resumable too: blocks are
fetched individually, and HTTP range requests cover the web case.

## 16. Bandwidth, LAN sync and on-demand files

**Bandwidth.** Beyond "upload only new blocks":

- **Compress** blocks before sending (skipping formats that are already compressed, such as JPEG, MP4 and ZIP).
- **Batch** small files: committing 5,000 tiny files one request at a time would be dominated by round trips, so
  the client commits many files per request and uploads many small blocks per request.
- **Throttle**: let users cap upload and download rates, and back off automatically when the user is on a metered
  or busy connection.
- **Prioritise**: small recent edits before a giant backlog, so a 50 GB upload does not delay a spreadsheet save.

**LAN sync.** In an office, ten laptops may all need the same new 2 GB file. Instead of downloading it ten times
over the internet, a client can ask other devices **on the same local network** for blocks by hash. Clients
discover peers by broadcasting on the local network, and a peer serves a block only to a device that proves it
has access to that namespace. Because blocks are named by hash, the receiver verifies every block and does not
need to trust the peer. Dropbox has offered LAN sync for many years.

**Selective and on-demand sync.** A 2 TB team folder will not fit on a 256 GB laptop. Clients let users exclude
folders (selective sync), or show every file as a **placeholder** that downloads only when opened (Dropbox calls
these online-only files; Google Drive for desktop streams files by default). Mobile apps work this way all the
time. The metadata sync is unchanged; only the block download becomes lazy.

## 17. Storage tiers and encryption at rest

### Storing exabytes cheaply and durably

Full replication (three copies of every block) costs 3× the data. **Erasure coding** does better: split a group of
blocks into, say, 6 data fragments, compute 3 parity fragments, and spread the 9 fragments across machines,
racks and data centres. Any 6 of the 9 rebuild the data, so it survives 3 simultaneous losses at **1.5×** storage
cost instead of 3×. The price is CPU and extra reads when rebuilding a lost fragment.

Access is very skewed: most reads hit blocks written in the last few weeks, while that 2014 holiday video is
almost never opened. So blocks move between tiers:

| Tier | Holds | Storage | Trade-off |
| --- | --- | --- | --- |
| **Hot** | Recently written or read blocks | Replicated or lightly erasure-coded, fast disks, plus a cache in front | Fast, most expensive per byte |
| **Warm** | Months old | Wider erasure coding on dense hard disks | Slightly slower rebuilds |
| **Cold** | Rarely read, old versions, deleted files in retention | Very wide coding, densest disks, possibly spread across regions | Cheapest; first read takes longer |

Metadata stays hot forever, so browsing old folders is instant; only opening an old file may take a moment longer.
At this scale, the storage layer is a large part of the company's costs, which is why Dropbox publicly described
moving most of its data from Amazon S3 to its own in-house storage system, **Magic Pocket**, around 2016.

### Encryption

- **In transit:** TLS on every connection, including between our own data centres.
- **At rest:** each block is encrypted with **AES-256** (Dropbox states that it encrypts stored files with
  AES-256). We use **envelope encryption**: each block, or group of blocks, has its own data key; data keys are
  encrypted by a key-encryption key held in a key management service (KMS) backed by hardware security modules.
  The `block.key_id` column records which key to use. Rotating the master key re-encrypts small data keys, not
  exabytes of data, and crypto-shredding (destroying a key) makes its data unreadable.

There is a real tension with deduplication. If every user's blocks were encrypted with that user's own key, the
same file would produce different ciphertexts and cross-user dedup would be impossible. Options:

- **Server-side keys** (the common design): the service encrypts and can deduplicate, generate previews and scan
  for malware, but it can technically read the data.
- **Convergent encryption**: the key is derived from the block's own hash, so identical blocks encrypt identically
  and still deduplicate. It leaks *which* users store identical content.
- **End-to-end (client-side) encryption**: only the user holds the key. The strongest privacy, but no cross-user
  dedup, no server-side previews or search, and a lost key means lost files. Some providers offer it as an option
  for specific folders.

## 18. Reliability and failure handling

| Risk | Defence |
| --- | --- |
| Client crashes mid-upload | Blocks are uploaded before the commit; orphan blocks are garbage-collected; the local index remembers progress |
| Client crashes mid-download | Temporary file plus atomic rename; the cursor is advanced only after the change is applied |
| A commit reply is lost and the client retries | Commits are idempotent for the same `parent_rev` and `block_list` |
| A metadata shard leader fails | Synchronous replication to a standby that takes over; the journal's `seq` continues without gaps |
| A disk or rack holding block fragments dies | Erasure coding rebuilds missing fragments from the survivors in the background |
| A data centre fails | Metadata replicated to another region; block fragments spread across regions; clients keep working offline meanwhile |
| A bug corrupts or deletes data | Blocks are immutable, deletes are soft, versions are retained, hashes are verified on every read |
| Notification servers fail | Clients reconnect to another server and re-send their cursor; missed pushes are harmless |
| Corrupted local index | The client rebuilds it by rescanning the folder and re-listing the server tree |

The pattern to remember: **immutable content plus an ordered, transactional log of metadata changes.** Every
failure becomes "retry until the log says it happened", and nothing is ever overwritten in place.

## 19. What breaks as it grows, and how to fix it

**The giant shared namespace.** A company shares one folder with 50,000 employees. Every edit in it is one journal
entry but wakes 100,000 devices, and its shard takes all the commits. *Fix:* jitter and `backoff` hints in
notifications so devices do not stampede, caching of hot journal pages, and splitting a huge team space into many
namespaces (one per team folder) so writes spread across shards.

**The hot block.** A viral installer or a file shared by link is downloaded millions of times. *Fix:* blocks are
immutable, so cache them aggressively at a CDN and in front of the block store; rate-limit public links.

**The trillion-row metadata.** *Fix:* shard by namespace, keep the journal compacted (old entries summarised into a
snapshot), and move cold namespaces' old versions to cheaper storage.

**The rename storm.** A user renames a top-level folder with 200,000 files. With path-based storage that is 200,000
row updates and 200,000 journal entries for every device to process. *Fix:* stable file IDs with `parent_id`, so it
is one row and one journal entry.

**Clients that fall far behind.** A laptop returns after a year away. *Fix:* when the cursor is older than the
compacted journal, send a reset and let the client diff the current tree against its index.

**Thundering herd after an outage.** When service returns, 200 million devices reconnect at once and re-list.
*Fix:* randomised reconnect delays in the client, server-sent backoff, and admission control at the gateway.

**The storage bill.** *Fix:* dedup, compression, erasure coding instead of replication, tiering, and garbage
collection that actually runs.

## 20. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Unit of transfer | Whole file | Blocks | **Blocks**: upload only changes, resumable, dedup |
| Where to cut blocks | Fixed size | Content-defined | **Content-defined** for general files: survives insertions; fixed is cheaper on CPU |
| Dedup scope | Per user / team | Global | **Per user or team** by default: avoids hash-claiming attacks and information leaks |
| Metadata consistency | Eventual | Strong per namespace | **Strong**: sync needs a total order and compare-and-set |
| Block store consistency | Strong | Eventual | **Eventual is fine**: blocks are immutable and content-addressed |
| Change notification | Polling | Long-poll / push | **Long-poll** on desktop, mobile push on phones; data always pulled via the cursor |
| Conflict handling | Last writer wins / auto-merge | Conflicted copy | **Conflicted copy**: never loses data, never guesses about binary formats |
| Delete | Hard delete | Soft delete with retention | **Soft**: recovery from mistakes and ransomware |
| Encryption keys | Server-held | Client-held (end-to-end) | **Server-held** by default, for dedup, previews and recovery; end-to-end as an option |

## Cheat sheet for last-minute revision

- **Core idea:** a file is an ordered **list of block hashes**. Metadata (tree, versions, hash lists) is
  separate from blocks (immutable bytes in object storage, named by SHA-256).
- **Client:** OS file watcher + periodic rescan, local SQLite index, sync engine comparing **local, synced and
  remote** trees (three-way merge); temp file + atomic rename when applying changes.
- **Chunking:** fixed-size is cheap but an insertion shifts every boundary. **Content-defined chunking** cuts where
  a **rolling hash** of the last ~48 bytes matches a pattern, so boundaries move with the content and only nearby
  blocks change. Use min and max block sizes.
- **Dedup:** content-addressed blocks; `blocks/check` before upload; per-user/team scope to avoid hash-claiming;
  reference counts or mark-and-sweep with a grace period.
- **Upload:** commit (hash list) → server says which blocks are missing → upload them → commit again; one
  transaction writes version + journal entry with compare-and-set on `parent_rev`.
- **Sync:** per-namespace **journal** with increasing `seq`; device **cursor**; long-poll carries no data, the
  device pulls "changes since cursor"; too-old cursor → reset and diff.
- **Conflicts:** parent not latest and content differs → **conflicted copy**; never lose an edit.
- **Sharing:** shared folder = its own namespace mounted into members' trees; roles checked on every request;
  signed short-lived tokens for block reads; links = random tokens to file IDs.
- **History:** versions are old hash lists; restore = new rev; delete is soft; retention window then GC.
- **Storage:** erasure coding (~1.5×) instead of 3 copies, hot/warm/cold tiers, AES-256 envelope encryption.
- **Numbers:** ~2.5 EB logical, ~10¹² files, ~23K commits/s, ~1 PB/day uploaded, ~200M open long-polls.

## Practice questions

1. **Why does content-defined chunking survive an insertion when fixed-size chunking does not?** Fixed chunks
   cut at absolute offsets, so inserting bytes shifts every later offset and every later block. CDC decides each
   cut from the last few dozen bytes of content, so after the insertion point the same byte patterns produce the
   same cuts, and every later block is unchanged.
2. **Two devices edit the same file offline. Walk through what happens.** Both commit with `parent_rev = 7`. The
   first wins and becomes rev 8. The second fails the compare-and-set; the server compares content hashes, finds
   they differ, and stores the second as a conflicted copy alongside. Both devices then sync both files.
3. **How would you implement "restore my whole folder to how it was last Tuesday"?** Walk the namespace journal
   backwards to Tuesday to find, for each file, the latest rev at that time (or that it did not exist), then commit
   restores as new revisions in one batch. No blocks are uploaded because they are all still referenced.
4. **A user shares a folder with a team of 20,000. What gets slower, and how do you fix it?** Notification
   fan-out per change and the single shard taking all commits. Use jittered, batched notifications, cache journal
   reads, and encourage splitting into several smaller namespaces.
5. **Why is it unsafe to let anyone download a block if they know its hash?** Hashes are not secrets: they appear
   in logs, client caches and debugging output. Access must come from namespace permissions, so the metadata service
   issues short-lived signed tokens for exactly the blocks a user may read.
6. **How would you add end-to-end encryption for one folder?** Generate a folder key on the client, share it with
   members by encrypting it with each member's public key, and encrypt blocks before hashing and uploading. Accept
   the costs: no cross-user dedup, no server-side previews or search, and lost keys cannot be recovered.
