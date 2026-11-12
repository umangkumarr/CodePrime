---
title: "Design Google Docs (real-time collaborative editing)"
description: "Design a real-time collaborative editor like Google Docs: operations, Operational Transformation and CRDTs with worked examples, one owner per document, presence and offline sync."
difficulty: "Hard"
sidebar:
  label: "Google Docs (collaborative editing)"
tags: ["Real-time sync", "OT and CRDTs", "WebSockets", "Storage", "Sharding"]
---

Open a Google Doc with two colleagues and type at the same time. You see their coloured cursors move, their
words appear a fraction of a second after they type them, and nobody's sentence is ever lost, even when all three
of you edit the same line. If your train goes into a tunnel, you keep typing, and your words merge in when you
come back. It feels like one shared sheet of paper, but it is not: every person has **their own copy** of the
document, and the system's whole job is to make those copies end up identical without anyone waiting for anyone.

That one requirement is what makes this a hard design problem. Storage, sharding and APIs matter, but the heart of
the interview is a small, sharp question: **when two people change the same text at the same moment, what should
the result be, and how does every copy agree on it?** We answer it from first principles, with two exactly worked
examples (Operational Transformation and CRDTs), then build the service around the answer.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one. Sections 5 and 6 are the
core; read them slowly.
:::

## 1. The problem in 5 minutes: why naive approaches fail

First, the vocabulary.

| Term | What it means | Everyday analogy |
| --- | --- | --- |
| **Replica** | One copy of the document: each open browser tab holds one, and so does the server | Each person's photocopy of a contract |
| **Operation (op)** | One small change, such as "insert `C` at position 0" or "delete 3 characters at position 10" | A margin note: "add the word *not* here" |
| **Concurrent ops** | Two ops made without either author having seen the other's | Two people editing their photocopies at the same time |
| **Convergence** | After everyone has received every op, all replicas hold exactly the same text | All photocopies end up word-for-word identical |
| **Intention preservation** | Each op still does what its author meant after other people's edits are merged | Your note still lands next to the word you meant |
| **Revision** | A counter the server bumps by one for every op it accepts: revision 5, 6, 7… | The page number of a ledger |

Why not simply use what ordinary apps do? Three obvious ideas, and why each fails.

**Idea 1: save the whole document, last write wins.** Each editor sends the full text when it saves; the server
keeps whichever arrives last. Here is what happens when Alice and Bob both start from `"HAT"`:

[![Last write wins: Alice and Bob both load "HAT"; Alice saves the whole file "CHAT", then Bob saves the whole file "HATS", silently overwriting Alice's C](/img/system-design/google-docs/01-lost-update.png)](/img/system-design/google-docs/01-lost-update.png)

Alice's `C` is gone and nobody was told. This is the classic **lost update**. With people typing several
characters a second, it would happen constantly.

**Idea 2: locking.** Only one person may edit at a time (or one person per paragraph). This is correct but feels
terrible: you wait for a lock, a lock holder who walks away blocks everyone, and a slow network turns every
keystroke into a round trip. Paragraph locks reduce the pain but do not remove it, and two people fixing the same
typo is exactly when collaboration matters.

**Idea 3: merge like Git.** Compare both versions to their common ancestor and combine the differences. That works
when changes are far apart, but when they touch the same spot Git stops and asks a human to resolve a conflict.
A live editor cannot show a conflict dialog several times a second.

What we actually want has three properties, often called **CCI** in the research literature:

1. **Convergence:** every replica ends up identical.
2. **Causality preservation:** if op B was made after its author saw op A, every replica applies A before B.
3. **Intention preservation:** an op keeps its meaning. If Bob added `S` after `HAT`, it must still land after
   `T`, wherever the text has shifted.

And it must feel **instant**: your own keystroke appears on your screen immediately, without waiting for the
server. That last point forces the whole design: since every replica applies its own edits first, replicas
**will** see ops in different orders, and we need a rule that still makes them converge.

## 2. Requirements

### Functional (what users can do)

- **Create, open and edit** rich-text documents: text, bold and italics, headings, lists, tables, images.
- **Real-time collaboration**: many people edit at once; each sees others' changes within a fraction of a second.
- **Cursors and presence**: see who is in the document, where their cursor is and what they have selected.
- **Offline editing**: keep typing without a connection; changes merge when you reconnect.
- **Version history**: see who changed what and when, name versions, restore an old version.
- **Comments**: attach comments and replies to a range of text; resolve them.
- **Sharing and permissions**: owner, editor, commenter, viewer; share with people or with "anyone with the link".

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Local latency** | Your own keystroke appears in under 50 ms, with no network wait | Typing must never lag |
| **Remote latency** | Others see your edit in a few hundred ms (well under a second) in the same region | It must feel live |
| **Convergence** | All replicas identical once ops stop flowing; no edit ever silently lost | The whole point of the product |
| **Durability** | An acknowledged op is never lost | People write theses and contracts here |
| **Availability** | 99.99% for opening and editing; offline editing covers short outages | Work cannot stop |
| **Scale** | Hundreds of millions of users, billions of documents | Google-sized |
| **Concurrency per document** | Typically 1 to 10 editors; must survive around 100 | Google's own help pages state that about 100 people can work in one file at the same time; beyond that, only the owner and some editors can edit |

### Out of scope

Spreadsheets and slides (same ideas, different data models), the editor UI and layout engine, spell check,
full-text search across Drive, real-time voice or video, and end-to-end encryption. Mention them, then move on.

## 3. Back-of-the-envelope estimates

**Assumptions** (round numbers for an example design, not Google's figures): 100 million daily active users, each
with a document open for about 1 hour a day. While a document is open, its editor sends on average **1 op per
second** (bursts of typing, long pauses for reading; keystrokes are batched, see section 4). An op is about
**100 bytes**. There are 5 billion documents averaging **50 KB** each.

**Connections and traffic**

- Average open sessions: $100\text{M} \times \frac{1}{24} \approx 4.2\text{M}$; at peak (3× average) about
  **12.5 million** open WebSocket connections.
- If one server holds 50,000 connections, that is $12.5\text{M} / 50\text{K} = 250$ servers just for sockets.
- Ops: about **4.2 million per second** on average and **12.5 million per second** at peak.
- Ops per day: $4.2\text{M} \times 86{,}400 \approx 3.6 \times 10^{11}$.

**Storage**

- Op log: $3.6 \times 10^{11} \times 100\text{ B} = 36\text{ TB}$ of raw ops per day, before compaction.
- Document snapshots: $5\text{B} \times 50\text{ KB} = 250\text{ TB}$, about 750 TB with three replicas.

**Per document**

- A normal document with 3 active editors sees about 3 ops per second. Any single server can order that easily.
- A "hot" document with 100 editors sees 100 ops per second, and each op must reach 99 other people:
  $100 \times 99 \approx 10{,}000$ messages per second from one document. That is the case to design for.

Three conclusions:

1. **Bandwidth is not the problem; ordering is.** Ops are tiny, but every op in one document must be put into one
   agreed order, quickly. That points to **one owner per document**.
2. **The op log grows fast**, so it must be compacted into snapshots, and old history coarsened.
3. **Connection count matters as much as request rate.** Long-lived WebSockets need their own fleet and careful
   failover.

## 4. Operations, not documents

The first fix for the lost update is to stop sending documents and start sending **operations**: "insert `C` at
position 0" is about 20 bytes, while the document might be 50 KB. More importantly, an operation says **what
changed**, so two changes can be combined instead of one overwriting the other.

For plain text, three kinds of op are enough. Positions count characters from 0.

```text
ins(p, s)   insert string s before the character at position p   ins(0, "C") on "HAT" → "CHAT"
del(p, n)   delete n characters starting at position p           del(0, 1)   on "CHAT" → "HAT"
retain(n)   skip n characters (used to build multi-part ops)
```

Rich text adds **attributes**: "retain 5 characters and set bold" is a formatting op. Many real editors describe a
change as one sequence such as `retain 3, insert "big " {bold}, retain 10, delete 2`, which walks the document once
from start to end. The ideas below work the same way for these longer ops; we use single inserts to keep the
arithmetic visible.

Two practical details:

- **Batching.** Sending one network message per keystroke is wasteful. The client groups keystrokes typed within
  a short window (for example 100 to 200 ms) into one op. The user still sees each key instantly, because the
  local copy is updated immediately.
- **Every op carries an identity**: the author's `client_id`, a per-client sequence number `seq`, and the
  **base revision** it was made on. The pair `(client_id, seq)` lets the server spot a duplicate after a retry.

Sending ops is necessary but not sufficient. In the example above, Alice's op is `ins(0,"C")` and Bob's is
`ins(3,"S")`. If Alice simply applies Bob's op to her `"CHAT"`, she gets `"CHAST"`, because position 3 meant "after
`T`" in Bob's copy but means "before `T`" in hers. The positions are relative to a document state that no longer
exists. There are two well-known families of fixes:

- **Operational Transformation (OT):** keep positions as numbers, and **adjust** (transform) an incoming op against
  the ops it has not seen. Google has described publicly that Docs uses OT.
- **CRDTs:** give every character a **permanent, unique ID** so an op never needs adjusting at all.

## 5. Operational Transformation from first principles

### The idea

When an op arrives that was made on an older version of the document, ask: "**what would this op have been if its
author had already seen the ops I have applied?**" Then apply that adjusted op instead. The function that answers
the question is called `transform`.

### Worked example: two concurrent inserts

Both replicas hold `"HAT"` (positions: `H`=0, `A`=1, `T`=2). At the same moment:

- Alice types `C` at the start: `ins(0,"C")`. Her copy becomes `"CHAT"`.
- Bob types `S` at the end: `ins(3,"S")`. His copy becomes `"HATS"`.

Each now receives the other's op.

[![OT diamond: from "HAT", Alice applies ins(0,"C") to get "CHAT" and Bob applies ins(3,"S") to get "HATS"; Alice then applies Bob's op shifted to ins(4,"S") and Bob applies Alice's op unchanged, so both reach "CHATS"; replaying Bob's raw ins(3,"S") on "CHAT" would give the wrong "CHAST"](/img/system-design/google-docs/03-ot-diamond.png)](/img/system-design/google-docs/03-ot-diamond.png)

**At Alice's replica.** Bob's `ins(3,"S")` was made without seeing Alice's insert at position 0. Alice's insert
is **before** position 3, so it pushed every later character one place to the right. Bob's target moves from 3 to
$3 + 1 = 4$. Applying `ins(4,"S")` to `"CHAT"` (`C`=0, `H`=1, `A`=2, `T`=3) puts `S` after `T`: **`"CHATS"`**.

**At Bob's replica.** Alice's `ins(0,"C")` was made without seeing Bob's insert at position 3. Bob's insert is
**after** position 0, so it does not shift anything before it. Alice's op stays `ins(0,"C")`. Applying it to
`"HATS"` gives **`"CHATS"`**.

Both replicas converge on `"CHATS"`, and both intentions survive: `C` at the start, `S` after `T`. Without the
transform, Alice would have `"CHAST"` and Bob `"CHATS"`: the copies would diverge forever.

### The transform rules for single characters

`transform(a, b)` returns a version of `a` that can be applied **after** `b`, where `a` and `b` were made
concurrently on the same state.

| `a` (to adjust) | `b` (already applied) | Rule |
| --- | --- | --- |
| `ins(p, s)` | `ins(q, t)` | If `q < p`, or `q == p` and `b`'s author wins the tie: `p += len(t)`. Otherwise unchanged. |
| `ins(p, s)` | `del(q, 1)` | If `q < p`: `p -= 1`. Otherwise unchanged. |
| `del(p, 1)` | `ins(q, t)` | If `q <= p`: `p += len(t)`. Otherwise unchanged. |
| `del(p, 1)` | `del(q, 1)` | If `q < p`: `p -= 1`. If `q == p`: both deleted the same character, so `a` becomes a no-op. Otherwise unchanged. |

**Ties need a deterministic rule.** If Alice and Bob both insert at position 0 of `"HAT"` (Alice `C`, Bob `T`),
both replicas must agree whose character goes first. Any fixed rule works as long as everyone uses the same one,
for example "the lower user ID goes first". If Alice wins: Alice's replica turns `"CHAT"` into `"CTHAT"` (Bob's op
shifts to position 1), and Bob's replica turns `"THAT"` into `"CTHAT"` (Alice's op stays at 0). Same result.

Real editors need the same rules for multi-character deletes that overlap, for inserts inside a deleted range,
and for formatting ops. Each case is simple, but there are many, and they must all agree. OT has a reputation for
being hard to get right: several algorithms in the research literature were later shown to diverge in rare
corner cases.

### Why a central server makes OT much simpler

In a fully peer-to-peer system, three people's ops can arrive at each replica in any of many orders, and the
transform functions must give the same answer along **every** path. That extra mathematical property (often
called TP2) is exactly where many published algorithms broke.

A **central server** removes the problem. The server puts all ops for a document into **one total order** and
numbers them: revision 6, 7, 8… This approach dates back to the Jupiter system from Xerox PARC in the mid-1990s,
and Google Wave and Google Docs both used a server-ordered design. With a server:

- The server only transforms an incoming op against the ops **it has already accepted since the op's base
  revision**, one simple path.
- Each client only transforms incoming ops against **its own unacknowledged ops**, also one simple path.
- Only the basic property (TP1: transform both ways, end in the same state) is needed, which the table above
  satisfies.

Section 10 shows the full message flow with revisions, using the same `"HAT"` example.

## 6. CRDTs: positions that never move

### The idea

OT's trouble comes from positions being **indexes**: insert a character and every index after it changes. A
**CRDT** (Conflict-free Replicated Data Type) takes the opposite approach: give each character a **unique,
permanent identifier** that also defines its order. An insert says "put `S` with ID such-and-such"; it never says
"at index 3". Because IDs never shift, ops can be applied in **any order** and every replica still sorts the
characters the same way. No transform is needed.

Think of a library shelf where every book has a call number. Adding a new book between `500.1` and `500.2` is done
by giving it `500.15`; nobody else's call number changes.

### Worked example: dense position IDs (Logoot-style)

Each character gets an ID of the form `(position, site)`. `position` is a sequence of numbers compared like words
in a dictionary (`[2] < [2,5] < [3]`), and `site` is the author's unique ID, used only to break ties. The
document is the characters **sorted by ID**.

Start with `"HAT"`, written by site `o`:

| Character | ID |
| --- | --- |
| `H` | `([10], o)` |
| `A` | `([20], o)` |
| `T` | `([30], o)` |

**Concurrent inserts.** Alice (site `alice`) types `C` before `H`: she needs a position below `[10]` and picks
`[5]`. Bob (site `bob`) types `S` after `T`: he picks `[40]`.

| Replica | Applies | Sorted IDs | Text |
| --- | --- | --- | --- |
| Alice | own `C ([5], alice)`, then Bob's `S ([40], bob)` | `[5] [10] [20] [30] [40]` | `"CHATS"` |
| Bob | own `S ([40], bob)`, then Alice's `C ([5], alice)` | `[5] [10] [20] [30] [40]` | `"CHATS"` |

Each replica just inserts the received character where its ID sorts. Same set of IDs, same order, same text.

**A tie.** Now Alice types `x` and Bob types `y`, both between `A` and `T`, and both happen to pick `[25]`. The IDs
are `([25], alice)` and `([25], bob)`. Positions are equal, so the site breaks the tie: `alice` sorts before `bob`
alphabetically, so `x` sorts first on **every** replica, giving `"HAxyT"` everywhere.

**Running out of room.** If two neighbours are `[20]` and `[21]`, there is no whole number between them, so the
new ID extends the list: `[20, 5]` sorts after `[20]` and before `[21]`. IDs can always be made, at the cost of
growing longer in heavily edited spots.

**Deletes** name the ID to remove ("delete `([30], o)`"), so a delete also needs no adjusting.

### Other sequence CRDTs

- **RGA** (Replicated Growable Array): each character gets an ID `(counter, site)` and records the ID of the
  character it was inserted **after**. Concurrent inserts after the same character are ordered by ID. Deleted
  characters stay as invisible **tombstones** so that later inserts can still find their anchor. Automerge's text
  type is based on this idea.
- **YATA**, used by the open-source library Yjs, is a close relative of RGA with a different tie-breaking rule.

### The costs

- **Metadata.** Every character carries an ID, often 10 to 30 bytes for a 1-byte letter. Libraries compress runs
  of characters typed in one go, but memory and storage are still several times the plain text.
- **Tombstones.** RGA-style CRDTs keep deleted characters forever unless every replica agrees they can be
  garbage-collected, which is hard when some replicas are offline.
- **Interleaving.** If Alice types `"cat"` and Bob types `"dog"` at the same spot, some algorithms (Logoot among
  them) can mix the letters, such as `"cdaotg"`. Newer designs avoid this; check the algorithm before choosing it.

## 7. OT or CRDT?

| Question | OT (with a central server) | CRDT |
| --- | --- | --- |
| Needs a central server? | Yes, to order ops | No; peers can sync directly, or through any relay |
| Offline and peer-to-peer | Works offline, but must rebase against the server on reconnect | Natural: merge in any order, any time |
| Size of document data | Plain text plus formatting | Text plus an ID per character, plus tombstones |
| Server CPU | Transforms each op against concurrent ops | Server just stores and relays ops (it may still merge to build snapshots) |
| Correctness risk | Many transform cases to get exactly right | The merge rule is proved once; IDs and garbage collection are the hard part |
| Rich text and complex structures | Mature in production editors | Mature libraries now exist (Yjs, Automerge) |
| Used by | Google Docs (OT, as Google has described) | Many newer collaborative and local-first apps |

**What to say in an interview:** for a Google Docs-style product with a server always in the loop, **OT with a
central server** is the classic, proven choice: small documents, one simple ordering point, and the server is
anyway needed for permissions and storage. Choose a **CRDT** when peer-to-peer or long offline editing is a core
feature. The rest of this design uses server-ordered OT, but almost everything around it (sharding, presence,
storage, scaling) is the same with a CRDT.

## 8. The API

Opening, sharing and history are ordinary request-response calls over HTTPS. Live editing uses a **WebSocket**: a
long-lived, two-way connection, so the server can push other people's edits without the client asking.

| Call | What it does |
| --- | --- |
| `POST /v1/docs` | Create a document; returns `doc_id`. |
| `GET /v1/docs/{id}` | The latest content and its `revision`, so the client can start editing. |
| `WSS /v1/docs/{id}/live` | The editing session (messages below). |
| `GET /v1/docs/{id}/revisions?cursor=...` | Version history, newest first. |
| `POST /v1/docs/{id}/restore` | Restore an old revision (applied as new ops, history is kept). |
| `PUT /v1/docs/{id}/permissions` | Share: `{"principal": "bob@x.com", "role": "editor"}` or link sharing. |
| `POST /v1/docs/{id}/comments` | Add a comment anchored to a text range. |

Messages on the WebSocket:

```text
client → server  hello    {doc_id, last_rev}                    "I have everything up to last_rev"
client → server  op       {client_id, seq, base_rev, op}        one batched edit
server → client  ack      {seq, rev}                            "your op seq is now revision rev"
server → client  remote   {rev, author, op}                     someone else's edit, already ordered
both ways        presence {user, cursor, selection}             cursor moves (not stored)
```

## 9. High-level design

[![High-level architecture: editors connect over HTTPS and WebSocket to an edge gateway that checks permissions with the document service and asks the coordination service which collab server owns the document; the owning collab server appends ops to the op log before acknowledging, loads snapshots on open, and a snapshotter tails the op log to write snapshots; the document service keeps sharing and comments in the metadata DB](/img/system-design/google-docs/02-architecture.png)](/img/system-design/google-docs/02-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does:

- **Edge gateway:** terminates TLS and WebSockets, checks who you are, checks your role on this document, and
  forwards your session to the server that owns the document.
- **Coordination service** (a strongly consistent store such as ZooKeeper or etcd, or an in-house equivalent):
  records which collab server holds the **lease** for each open document.
- **Collab server:** the heart. For each document it owns, it keeps the current text and revision in memory,
  transforms incoming ops, appends them to the op log, acknowledges the author and broadcasts to everyone else.
  It also relays presence.
- **Op log:** an append-only, replicated table keyed by `(doc_id, revision)`. The source of truth for edits.
- **Snapshot store:** the full document at some revision N, so opening a document does not replay years of ops.
- **Snapshotter:** a background job that reads new ops and writes fresh snapshots.
- **Document service + metadata DB:** everything that is not live text: titles, owners, permissions, comments,
  the list of your documents.

The key idea: **one owner per document**. All ops for document 42 flow through the single collab server that owns
it. That server is the "central server" OT needs, and because it handles thousands of other documents too, the
fleet scales by spreading documents, not by splitting any one of them.

## 10. Flow: an edit, end to end

Same example as section 5, now with the server. Both editors are at revision 5 with `"HAT"`. Alice's op happens to
reach the server first.

[![Sequence: Alice sends ins(0,"C") with base 5 and Bob sends ins(3,"S") with base 5; the server appends Alice's op as revision 6 without transforming, acknowledges Alice and broadcasts it to Bob, who applies it and shifts his pending op to ins(4,"S"); the server then transforms Bob's op to ins(4,"S"), appends revision 7, acknowledges Bob and broadcasts it to Alice, so both reach "CHATS" at revision 7](/img/system-design/google-docs/04-edit-flow.png)](/img/system-design/google-docs/04-edit-flow.png)

*Select the diagram to zoom in and move around.*

Step by step:

1. Alice's editor applies `ins(0,"C")` locally (she sees `"CHAT"` at once) and sends it with `base_rev = 5`.
2. Bob's editor does the same with `ins(3,"S")` (he sees `"HATS"`).
3. The server takes Alice's op. Its base is 5 and the server is at 5, so nothing to transform. It **appends it to
   the op log as revision 6** and only then answers.
4. Alice gets `ack rev 6`. Her op is now permanent.
5. Bob gets `remote rev 6: ins(0,"C")`. Bob still has his own op in flight, so he transforms the incoming op
   against it: position 0 comes before his 3, so it stays `ins(0,"C")`, and he sees `"CHATS"`. He also transforms
   his **pending** op against the incoming one: an insert before position 3 shifts it, so it becomes `ins(4,"S")`.
   That is exactly what the server will make of it.
6. The server takes Bob's op. Its base is 5, but the server is at 6, so it transforms Bob's op against revision 6:
   `ins(3,"S")` becomes `ins(4,"S")`. It appends revision 7.
7. Bob gets `ack rev 7`.
8. Alice gets `remote rev 7: ins(4,"S")`. She has nothing pending, so she applies it as is: `"CHATS"`.

Everyone is at revision 7 with `"CHATS"`. Three rules made this work:

- **Write, then acknowledge.** The server acks and broadcasts only after the op log has stored the op on several
  machines. If the server crashes, every acknowledged op survives.
- **The server's order is the truth.** Revision numbers are the single history everyone eventually agrees on.
- **At most one op in flight per client.** The client waits for the ack before sending its next op, and collects
  new keystrokes into a buffer meanwhile. This keeps the client-side transform to a simple two-way case.

That last rule gives the client a small state machine:

[![Client sync states: Synchronised moves to Awaiting ack when a local edit is sent; another local edit moves it to Awaiting plus buffer; an ack returns to Synchronised, or sends the buffer and stays awaiting; a lost connection leads to Offline, then Rebasing on reconnect, then resending pending ops](/img/system-design/google-docs/05-client-states.png)](/img/system-design/google-docs/05-client-states.png)

In **every** state, a `remote` op from the server is transformed against the in-flight op and the buffer (if
any), then applied to the screen, and the in-flight op and buffer are transformed against it in turn.

## 11. Cursors and presence

Coloured cursors are what make collaboration feel alive, but they are **not document content**, and treating them
differently keeps the system cheap.

- **A cursor is just a position**, so it is transformed like a zero-length insert. Bob's cursor sits at position 3
  in `"HAT"` (after `T`). When Alice's `ins(0,"C")` arrives, his cursor moves to 4, still after `T`. A selection
  is two such positions.
- **Presence is ephemeral.** Cursor moves go through the collab server's memory and straight out to the other
  editors. They are never written to the op log and never acknowledged. If one is lost, the next one fixes it.
- **Throttle it.** A cursor can move dozens of times a second. Send at most a few updates a second per user, and
  only the latest position (drop stale ones).
- **Who is here** is a set of sessions in the collab server's memory, with a heartbeat. A session that misses
  heartbeats for a few seconds is removed and its cursor disappears for everyone.
- Each user gets a stable colour and their name label, decided on the client from the user ID.

## 12. Offline editing and reconnect

Your laptop loses Wi-Fi at revision 7 (`"CHATS"`). You keep typing an exclamation mark at the end,
`ins(5,"!")`, which the client keeps in its buffer (and saves to local storage so a closed tab does not lose it).
Meanwhile Bob deletes the `C`, which becomes revision 8: `del(0,1)`, leaving `"HATS"`.

[![Reconnect sequence: Alice reconnects saying she has revision 7 with offline op alice#12 ins(5,"!") pending; the server reads revision 8 del(0) from the op log and sends it; Alice rebases her op to ins(4,"!") and sees "HATS!"; she resends alice#12 with base 8; the server checks it is not a duplicate, appends revision 9 and acknowledges](/img/system-design/google-docs/06-reconnect.png)](/img/system-design/google-docs/06-reconnect.png)

1. On reconnect, the client says "I am at revision 7".
2. The server sends every op after 7: here just revision 8, `del(0,1)`.
3. The client **rebases**: it transforms its pending op against the missed ones. Bob deleted a character before
   position 5, so `ins(5,"!")` becomes `ins(4,"!")`. The incoming delete is unaffected by the insert after it.
   Alice's screen shows `"HATS!"`.
4. The client resends its pending op, now based on revision 8. The server appends it as revision 9.

**Duplicates.** Suppose Alice's op had actually reached the server just before the connection dropped, but the ack
was lost. The client cannot tell, so it resends. The server checks `(client_id, seq) = (alice, 12)` against the
log: if it is already there, it replies with the original revision instead of applying it twice. **Retries are
safe because ops are idempotent by ID.**

**Long offline periods.** If Alice was away for a week and the document saw 50,000 ops, transforming her op
against all of them still works but is slow and the result may surprise her. Two common choices: transform anyway
(fine for small offline edits), or if the gap exceeds a limit, load the latest snapshot and re-apply her offline
edits as a fresh change, warning her if the text she edited was deleted. This is where CRDT-based editors shine:
merging after a long separation is their normal case.

## 13. Data model and storage

### Snapshots plus an op log

Storing only the op log would make opening an old, busy document replay millions of ops. Storing only snapshots
would lose history and make every edit rewrite the whole file. So we keep both.

[![Storage flow: the collab server appends each op at revision r to the append-only op log; a snapshotter replays every N ops into a snapshot of the document at revision N; a history builder groups ops by author and time into the version list; opening a document reads the latest snapshot plus the ops after it](/img/system-design/google-docs/07-storage.png)](/img/system-design/google-docs/07-storage.png)

*Select the diagram to zoom in and move around.*

- **Opening a document** = load the latest snapshot (say revision 12,000) + replay the ops after it (say 12,001 to
  12,340). If snapshots are taken every 1,000 ops, a load replays at most 1,000 small ops, which takes
  milliseconds.
- **Version history** is built from the op log: consecutive ops are grouped by author and time into the entries
  you see in the history panel ("Alice, 10:42"). Users can also **name** a version, which pins a revision.
- **Restoring** an old version does not delete history. The server computes the ops that turn today's text into
  the old text and appends them as a new revision, so the restore itself can be undone.
- **Compaction.** Very old ops can be squashed: keep snapshots at the history points users can see, and drop the
  keystroke-level ops between them. This is what keeps 36 TB a day of raw ops from growing forever.

### Tables

```sql
documents   (doc_id PK, owner_id, title, created_at, updated_at, latest_rev, link_sharing)
doc_ops     (doc_id, revision, client_id, seq, author_id, op BLOB, created_at,
             PRIMARY KEY (doc_id, revision), UNIQUE (doc_id, client_id, seq))
snapshots   (doc_id, revision, blob_key, PRIMARY KEY (doc_id, revision))
permissions (doc_id, principal_id, role, PRIMARY KEY (doc_id, principal_id))
comments    (doc_id, comment_id, thread_id, author_id, body, anchor_start, anchor_end,
             anchor_rev, resolved, created_at, PRIMARY KEY (doc_id, comment_id))
versions    (doc_id, revision, name, created_by, created_at)   -- named versions
```

Every table starts with `doc_id`, because almost every query is about one document. The op log fits a
wide-column store (Bigtable, Cassandra, ScyllaDB) or sharded MySQL / Postgres: rows are small, keyed by
`(doc_id, revision)`, and read as a range ("everything after 12,000"). Snapshot contents go in a blob store with
the key in the table. A per-user index `(user_id, updated_at, doc_id)` serves the "my documents" list.

The `UNIQUE (doc_id, client_id, seq)` constraint is the duplicate check from section 12, enforced by the database.

## 14. Comments, permissions and sharing

**Comments anchor to a range that moves.** A comment on the words "big idea" stores the range's start and end
positions at some revision. As ops arrive, the collab server transforms the anchors exactly like cursors, so the
comment stays attached to the same words. If the commented text is deleted entirely, the comment is kept but
shown as detached. (A CRDT design would anchor to character IDs instead, which never move.) Comment text and
replies live in the metadata DB, not the op log; they are ordinary rows with their own API.

**Roles:** owner (can delete and transfer), editor, commenter, viewer. **Sharing** adds a row to `permissions`, or
sets link sharing ("anyone with the link can view").

**Enforcement happens in two places:**

- **On connect:** the gateway checks the user's role before opening the session.
- **On every op:** the collab server rejects text ops from commenters and viewers. A client is never trusted.

**Revocation mid-session.** When an owner removes Bob, the document service publishes a permission-change event;
the collab server receives it, closes Bob's session (or downgrades it to view-only), and his next op is rejected.
Permission checks are cached for speed, so the change event is what keeps the cache honest.

## 15. Scaling to billions of documents

**Shard by document ID.** All state for one document (its in-memory text, its op log rows, its snapshots) is
keyed by `doc_id`, so documents are independent. Spread them across thousands of collab servers.

**Assigning an owner.** Two common approaches:

- **Consistent hashing** of `doc_id` onto the ring of collab servers. Simple, but when servers join or leave some
  documents move, and two servers might briefly both believe they own a document.
- **Leases in a coordination service** (the design in section 9). When document 42 is opened, a collab server
  takes a lease "doc 42 → server 17, epoch 9" that expires unless renewed every few seconds. Gateways look up the
  lease (and cache it) to route sessions.

**Never two owners.** Networks partition; a paused server may wake up still believing it owns document 42. The
defence is in the op log: appending revision 341 is a **conditional write**, "insert `(42, 341)` only if it does
not exist" (optionally also checking the epoch). If two servers race, only one write succeeds, and the loser
discovers it is no longer the owner and drops its sessions. This is the **fencing** pattern.

**Failover.** If server 17 dies, its leases expire. The next connection for document 42 triggers a new owner,
which loads the latest snapshot plus later ops. Clients reconnect, say "I am at revision N", and resend unacked ops,
as in section 12. Users see a short "reconnecting" notice, and nothing acknowledged is lost.

**Idle documents cost nothing.** Most of the billions of documents are closed. Only open documents occupy collab
server memory; an owner unloads a document a few minutes after its last session leaves.

**Regions.** A document's owner lives in one region, ideally near most of its editors. Someone on another continent
pays a longer round trip for acks, but because every client applies its own edits immediately, typing still feels
instant; only the arrival of others' edits is slightly slower.

## 16. The hot document: hundreds of people in one file

A company all-hands agenda or a live class worksheet can attract hundreds of people. One owner server is still the
single ordering point, and the cost per op is now dominated by **fan-out**: each op must reach every other person.

[![Hot document: editors 1 to 50 and 51 to 100 connect to relays A and B, which batch ops and sample cursors and keep one stream each to the owner server; the owner orders and transforms ops, appends batches to the op log, and sends ordered ops to a read-only fan-out tier that streams to viewers beyond 100](/img/system-design/google-docs/08-hot-document.png)](/img/system-design/google-docs/08-hot-document.png)

*Select the diagram to zoom in and move around.*

Each arrow between editors, relays and the owner carries traffic both ways: ops in, ordered ops and presence out.

| Problem | Fix |
| --- | --- |
| 100 editors × 99 recipients ≈ 10,000 messages a second from one server | **Batch outgoing ops**: send each client at most one message every ~200 ms containing all new revisions. That is $100 \times 5 = 500$ messages a second. |
| One server holding hundreds of sockets for one document | **Relay tier**: editors connect to relays near them; each relay keeps one stream to the owner and fans out locally. The owner sends one copy per relay, not per person. |
| Cursor updates outnumber edits | **Sample presence**: relays forward at most a few cursor updates a second per user, and drop updates for users not visible on screen. |
| Many ops in flight means more transforming | The owner transforms each incoming op against the ops since its base revision. Batching keeps that list short, and clients that fall far behind are told to reload. |
| The op log write per op | **Group commit**: append the ops that arrived in the last few milliseconds in one write. |
| Too many people editing at once | **Cap editors**: beyond a limit, extra people join as viewers. Google does this at around 100 and suggests publishing to the web for bigger audiences. |
| Thousands of viewers | **Read-only fan-out**: viewers receive the ordered op stream (or periodic snapshots) through a separate broadcast tier that can lag by a second without harm. |

If a single document still overwhelms one server, the last resort is to split it by structure, for example one
owner per section or per sheet in a spreadsheet, with cross-section operations coordinated separately. That is
rarely worth the complexity for text documents.

## 17. Reliability: never lose an edit

| Risk | Defence |
| --- | --- |
| Collab server crashes after acking | Ack only after the op is in the **replicated** op log; the new owner rebuilds from snapshot + log |
| Client's network drops before the ack | Client keeps the op and resends it on reconnect; `(client_id, seq)` makes the retry harmless |
| Browser tab closed while offline | Pending ops are saved to local storage (for example IndexedDB) and sent next time |
| Two servers both think they own a document | Conditional append on `(doc_id, revision)` plus lease epochs (fencing) |
| A transform bug makes replicas diverge | Clients periodically send a checksum of their text at a revision; on mismatch the client reloads from the server, and the event is logged for engineers |
| A bad deploy corrupts documents | Snapshots and ops are immutable; history allows restoring any revision; canary deploys per shard |
| A region fails | Op log and snapshots replicated across regions; leases move to the surviving region; clients reconnect and rebase |

## 18. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| What to send | Whole document | Operations | **Operations**: tiny, and they can be merged instead of overwriting |
| Conflict handling | Locks | Optimistic merge | **Optimistic**: nobody ever waits; locks feel broken for live typing |
| Merge algorithm | OT | CRDT | **OT with a central server**: smaller data, one simple ordering point; CRDT if peer-to-peer or long offline editing is core |
| Who orders ops | Any server (consensus per op) | One owner per document | **One owner**: no consensus on the hot path; a lease plus fencing gives safety |
| When to ack | On receipt | After durable append | **After durable append**: an ack must mean "never lost" |
| Presence | Stored like ops | Ephemeral, throttled | **Ephemeral**: cursors are useless a second later |
| Storage | Ops only or snapshots only | Snapshots + op log | **Both**: fast open and full history |
| Huge audiences | Let everyone edit | Cap editors, stream to viewers | **Cap + read-only stream**: protects the ordering point |

## Cheat sheet for last-minute revision

- **The core problem:** every client edits its own copy instantly, so copies see ops in different orders. We need
  **convergence** without losing anyone's **intention**.
- **Last write wins loses edits; locking blocks people; Git-style merge needs humans.** Send **operations** instead.
- **OT:** adjust an op against ops its author had not seen. Worked example: `"HAT"`, Alice `ins(0,"C")`, Bob
  `ins(3,"S")`; Bob's op becomes `ins(4,"S")` at Alice's, Alice's stays `ins(0,"C")` at Bob's; both get
  `"CHATS"`. Ties need a fixed rule (for example lower user ID first).
- **Central server makes OT simple:** one total order (revisions), transform along one path, TP1 is enough.
- **CRDT:** each character has a permanent unique ID (`([10], o)`, or `(counter, site)` in RGA); sort by ID; ops
  commute, no transform. Costs: per-character metadata, tombstones, possible interleaving.
- **Collab server per document** (lease in a coordination service): transform, **append to op log, then ack**,
  broadcast. Ops carry `client_id`, `seq`, `base_rev`; the client keeps one op in flight plus a buffer.
- **Presence** is ephemeral, throttled, transformed like a zero-length insert, never stored.
- **Offline:** buffer ops locally; on reconnect fetch ops after `last_rev`, rebase, resend; dedupe by
  `(client_id, seq)`.
- **Storage:** op log keyed `(doc_id, revision)` + snapshots every N ops; open = snapshot + tail; history from the
  log; restore = new ops.
- **Scale:** shard by `doc_id`; fencing with conditional appends; hot doc = batching, relays, sampled cursors,
  group commit, editor cap (~100 in Google Docs), read-only stream.
- **Numbers (example):** ~12.5M peak sockets, ~12.5M ops/s peak, ~36 TB/day raw ops, ~250 TB of snapshots.

## Practice questions

1. **Both Alice and Bob delete the same character at the same time. What does OT do?** The transform rule for
   two deletes at the same position turns the second one into a no-op. In the server design, the server accepts
   the first delete as revision N; the second arrives with an older base, is transformed against revision N,
   becomes a no-op, and is still acknowledged (the author's intent, "that character is gone", is satisfied).
   Without this rule, the second delete would remove an innocent neighbouring character.
2. **How would you add "suggesting" mode, where edits appear as proposals the owner accepts or rejects?** Make a
   suggestion an ordinary op with an attribute: an insert marked "suggested by Bob", and a delete that does not
   remove text but marks it "suggested deletion". They travel, transform and store like any other op, so
   everyone sees them live. Accepting a suggestion is another op that clears the mark (or truly deletes the
   text); rejecting it removes the suggested insert or clears the deletion mark.
3. **A user reports that their copy shows different text from a colleague's. How do you detect and recover?**
   Clients periodically send a hash of their text together with the revision it represents. The server compares
   it with its own hash at that revision. On a mismatch, the client discards its state and reloads the snapshot
   plus ops (keeping its unacknowledged local ops to re-apply), and the event, with both op histories, is logged
   so engineers can find the transform bug.
4. **Would you choose OT or a CRDT for a notes app that must sync between a user's phone and laptop without a
   server, for weeks offline?** A CRDT. There is no central server to order ops, and long offline periods mean
   merging large sets of concurrent changes, which is exactly what CRDTs are designed for: ops can be exchanged
   in any order and both devices converge. The costs (larger metadata, tombstone cleanup) are acceptable for one
   user's notes.
5. **How would you show "Alice is typing…" and keep it accurate when Alice's laptop goes to sleep?** Treat it as
   presence: Alice's client sends a typing flag with her cursor updates, and the collab server forwards it
   without storing it. Every presence entry has a short expiry refreshed by heartbeats. When the laptop sleeps,
   heartbeats stop, the entry expires after a few seconds, and the server tells the others to remove her cursor
   and the typing indicator.
