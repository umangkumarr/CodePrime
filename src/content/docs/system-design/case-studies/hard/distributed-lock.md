---
title: "Design a Distributed Locking Service (like Chubby / ZooKeeper / etcd locks)"
description: "Design a distributed lock service: leases, process pauses and fencing tokens, the Redlock debate, Raft consensus, ZooKeeper and etcd lock recipes, sessions and scaling."
difficulty: "Hard"
sidebar:
  label: "Distributed lock (like Chubby)"
tags: ["Consensus", "Raft", "Leases", "Coordination", "Fault tolerance"]
---

On one computer, a lock is easy. Two threads want to change the same thing, so the first one takes a **mutex**
(a "mutual exclusion" lock), the second waits, and the operating system guarantees that only one of them is
inside at a time. The operating system can make that promise because it sees everything: every thread, every
clock tick, and it knows instantly when a thread dies.

A **distributed lock** makes the same promise across many machines that share nothing but a network. Now nobody
sees everything. Messages are delayed or lost, machines crash and come back, clocks disagree, and a process can
freeze for seconds without knowing it froze. Building a lock that stays correct under all of that is one of the
classic hard problems of distributed systems, and it is a favourite senior interview question because it tests
whether you really understand failure.

This case study builds a lock service from first principles: a naive Redis lock first, then why it breaks, then
leases, fencing tokens, consensus, and the real designs behind Google's Chubby, Apache ZooKeeper and etcd.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one. Sections 5 to 7 (pauses,
fencing tokens and the Redlock debate) are the part interviewers push on hardest.
:::

## 1. Why lock across machines?

Most services run as many identical copies (replicas) for capacity and fault tolerance. Usually that is exactly
what we want. Sometimes, though, **exactly one** copy must do something at a time:

| Use case | What goes wrong without a lock | Example |
| --- | --- | --- |
| **Leader election** | Two replicas both act as "the primary" and give conflicting orders | One scheduler instance decides which jobs run; one database replica accepts writes |
| **Exclusive jobs** | A nightly job runs twice | Two cron hosts both charge every customer's monthly subscription |
| **Protecting a shared resource** | Two writers interleave and corrupt the data | Two workers rewrite the same file in object storage; two services resize the same disk |
| **Configuration and membership** | Machines disagree about who is in the cluster or which shard lives where | Which server owns shard 17 right now? |

Leader election is just a lock that is held for a long time: whoever holds the lock named `/service/leader` is
the leader, and everyone else watches it so they can take over when it is released.

### Efficiency locks versus correctness locks

Before designing anything, ask **what happens if two clients hold the lock at once**. The answer splits locks
into two kinds, and the rest of the design depends on it.

- **Efficiency lock.** The lock only saves work. If it fails occasionally and two workers both regenerate the
  same cache entry or send the same report email, the cost is some wasted CPU or one duplicate email. A simple,
  fast lock is fine.
- **Correctness lock.** The lock protects an invariant. If two holders overlap, money is charged twice, a file is
  corrupted, or two primaries accept conflicting writes ("split brain"). Here "usually works" is not good
  enough: the lock must be **safe** under crashes, network delays, pauses and clock problems.

Everyday analogy: a "please don't disturb, I'm cleaning" sign on a hotel door is an efficiency lock (if it fails,
two cleaners waste time). The key card system on a bank vault is a correctness lock.

## 2. Requirements

### Functional

- **Acquire** a named lock, such as `/locks/billing/nightly-run`. Blocking (wait until free) and **try-lock**
  (give up after a timeout) variants.
- **Release** a lock. Only the holder may release it.
- **Automatic release** if the holder crashes or disappears, so a dead client cannot block everyone forever.
- **Renew** (keep alive) a lock while the holder is still working.
- **Watch** a lock: get notified when it is released, so waiters do not have to poll.
- **Fencing token**: every successful acquire returns a number that increases with every grant, so resources can
  reject stale holders (section 6).
- **Leader election** on top of the same primitive, plus small key-value storage for configuration (who is
  leader, which address to call).

### Non-functional

| Property | Target | Why it matters |
| --- | --- | --- |
| **Safety** (mutual exclusion) | Never grant the same lock to two live sessions at once, even during crashes and network partitions | This is the whole point |
| **Liveness** | A lock whose holder died becomes free within a bounded time (seconds) | Otherwise one crash stops the system |
| **Availability** | Keep working if a minority of lock servers fail (2 of 5) | The lock service is a dependency of many critical systems |
| **Latency** | Acquire and release in a few milliseconds inside a data centre | Locks sit on the critical path of other work |
| **Scale** | Tens of thousands of clients, millions of lock names, mostly idle | Many systems share one lock service |
| **Durability** | Lock state survives a server restart | A restart must not forget who holds what |

Notice the trade-off already: when the cluster loses its majority, we prefer to **stop granting locks** (lose
availability) rather than risk granting a lock twice (lose safety). We return to this in section 13.

### Out of scope

Fine-grained locks taken thousands of times per second per object (those belong inside a database), distributed
transactions, and general-purpose bulk storage. Chubby's own paper makes the same choice: it was built for
**coarse-grained** locks held for seconds to hours, not for locking every row.

## 3. Back-of-the-envelope estimates

**Assumptions:** 50,000 client processes use the service. Each holds a **session** that sends a keep-alive every
**3 seconds**. Together they acquire and release about **5,000 locks per second**. There are **1 million**
lock names, each with about 200 bytes of metadata. Clients also read small configuration values (who is the
leader?) about **50,000 times per second**.

- **Keep-alives:** $50{,}000 / 3 \approx 17{,}000$ per second. They are cheap (no disk write) but they are the most
  common message, which matches what Chubby reported: most of its traffic was keep-alives.
- **State-changing writes:** acquire and release are $2 \times 5{,}000 = 10{,}000$ writes per second. Every write
  goes through consensus, which means a disk sync on a majority of servers. A single consensus group on SSDs can
  handle a figure of this order, but it is the number to watch.
- **Reads:** 50,000 per second. Too many to send all through the leader, so clients **cache** values and the
  service tells them when a cached value changes (section 14).
- **Storage:** $1\text{M} \times 200\text{ B} = 200\text{ MB}$. All lock state fits **in memory** on every
  server, with a write-ahead log and periodic snapshots on disk.

Conclusions: the data is tiny; what is hard is **agreement and failure handling**, not storage. The bottlenecks
are consensus write throughput and the number of sessions, so the design must keep writes rare and make
keep-alives cheap.

## 4. First attempt: a lock in a single Redis

Many teams start with Redis, an in-memory key-value store. One command takes a lock:

```text
SET lock:report  client-a-7f3c  NX  PX 30000
```

- `NX` means "only set it if the key does **not** exist". If two clients race, Redis runs commands one at a
  time, so exactly one gets `OK` and the other gets nothing.
- `PX 30000` gives the key a 30,000 ms **time to live (TTL)**: Redis deletes it after 30 seconds even if the holder
  crashes. This is the automatic release.
- The value `client-a-7f3c` is a **random token unique to this holder**, so that release can check ownership.

Releasing must delete the key **only if it is still ours**. A plain `DEL` is a bug: if our lock already expired
and client B took it, we would delete B's lock. The check and the delete must happen together, so they run as one
small Lua script, which Redis executes atomically:

```text
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end
```

This is a perfectly good **efficiency** lock. It is not a correctness lock, because of these failure modes:

1. **Single point of failure.** If the one Redis server is down, nobody can take any lock.
2. **Failover loses the lock.** Add a replica for availability and a manager (Redis Sentinel) to promote it.
   Redis replication is **asynchronous**: the primary answers `OK` before the replica has the key. If the
   primary crashes in that gap, the promoted replica has never heard of the lock and gives it to someone else.
3. **Restart without persistence.** If Redis restarts and did not save the key to disk, the lock is forgotten.
4. **Expiry while still working.** If the holder's work takes longer than 30 seconds, the key expires and a
   second client gets the lock while the first is still writing. Section 5 shows that this cannot be fully
   prevented by choosing a longer TTL.

[![Single-Redis lock failure: client A sets the lock on the Redis primary and gets OK; the primary crashes before replicating; Sentinel promotes the replica; client B sets the same lock on the new primary and also gets OK, so both hold it](/img/system-design/distributed-lock/01-redis-failover.png)](/img/system-design/distributed-lock/01-redis-failover.png)

*Select the diagram to zoom in and move around.*

## 5. Leases, and the pause that breaks them

### Leases and TTLs

Every practical distributed lock is a **lease**: a lock that is granted **for a limited time**. The holder must
renew it before it runs out. If the holder crashes, the lease simply expires and the lock becomes free. Leases
solve the "dead holder" problem without anyone having to decide whether a silent machine is dead or just slow,
which over a network is impossible to know for sure.

The **TTL** (time to live) of a lease is a trade-off:

- **Short TTL** (a few seconds): a crashed holder blocks others only briefly, but a holder that is merely slow, or
  a short network glitch, loses the lock by mistake.
- **Long TTL** (a minute): fewer false expiries, but a crash leaves the lock stuck for a minute.

Lock services typically use TTLs of around 10 seconds and renew every third of the TTL, so two renewals can be
lost before the lease is in danger.

### The fundamental problem: the holder cannot know it lost the lock

A lease makes a quiet assumption: that the holder **notices** when its lease runs out and stops working. In a
real process, that is not guaranteed. Between checking "do I still hold the lock?" and actually writing, a process
can be stopped for an unbounded time by:

- a **garbage-collection pause** (a "stop-the-world" GC in Java or Go can freeze every thread for seconds on a
  large heap);
- the operating system **swapping** the process's memory to disk, or the virtual machine being paused or
  live-migrated;
- a **network packet being delayed**: the write was sent in time but arrives at the storage server much later;
- **clock problems**: the holder's clock runs slow, or a clock is stepped by NTP (the time-sync protocol), so
  the holder thinks it has more time left than the lock service gives it.

Here is the precise timeline, with a 10-second lease:

| Time | Client 1 | Lock service | Client 2 | Storage |
| --- | --- | --- | --- | --- |
| t = 0 s | Acquires the lock, lease until t = 10 s | Records holder = client 1 | | |
| t = 0.1 s | Checks "I hold the lock", prepares to write, then a GC pause freezes it | | | |
| t = 10 s | (frozen, sends no keep-alive) | Lease expires; lock is free | | |
| t = 11 s | (frozen) | Grants the lock to client 2 | Acquires the lock | |
| t = 12 s | (frozen) | | Writes version B | Stores B |
| t = 15 s | Wakes up, continues exactly where it stopped and writes version A | | | **Overwrites B with A** |

[![Timeline of the pause problem: client 1 gets a lease until t = 10 s and then freezes for 15 s; at t = 11 s client 2 gets the lock and writes version B; at t = 15 s client 1 wakes and writes version A, overwriting B](/img/system-design/distributed-lock/02-pause.png)](/img/system-design/distributed-lock/02-pause.png)

*Select the diagram to zoom in and move around.*

Client 1 did nothing wrong by its own reckoning: it checked the lock, then wrote. The pause happened **between
the check and the write**, and from inside the process, a pause is invisible. No amount of care in the client
fixes this:

- **Checking the lease again before writing** only moves the gap; the pause can happen after the second check.
- **A longer TTL** only makes the pause need to be longer. GC pauses of tens of seconds have been seen in
  production.
- **Measuring time carefully** helps against clock drift (use a **monotonic clock**, which only ever moves forward
  at a steady rate, instead of wall-clock time; start counting from when the request was *sent*, not when the
  reply arrived; stop working a safety margin before expiry), but it cannot help against a pause or a delayed
  packet.

The conclusion is the most important sentence in this case study: **a lease-based lock cannot, on its own,
guarantee mutual exclusion at the resource.** The lock service can guarantee that it never grants the lock to
two clients at once. It cannot guarantee that an old holder has stopped acting. Something at the resource must
check.

## 6. Fencing tokens: making the resource enforce the lock

The fix is a **fencing token**: a number that the lock service hands out with every grant, and that **only ever
increases**. Grant 33 goes to client 1; the next grant of the same lock gets 34, and so on.

The holder attaches its token to every write. The storage service remembers the **highest token it has
accepted** for that resource and rejects any write carrying a lower one. An old holder carries an old token, so
its late write bounces off. It is "fenced off", like a fence keeping out someone whose access has been revoked.

[![Fencing tokens: client 1 gets token 33 and pauses; its lease expires and client 2 gets token 34 and writes; storage records 34 as the highest token; client 1 wakes and writes with token 33, which storage rejects because 33 is lower than 34](/img/system-design/distributed-lock/03-fencing.png)](/img/system-design/distributed-lock/03-fencing.png)

*Select the diagram to zoom in and move around.*

Why this works where the client-side tricks failed: the check happens **at the resource, at the moment of the
write**, and both the token comparison and the write are done by the same server atomically. Pauses and slow
networks no longer matter, because the decision is no longer made by the party that might be stale.

In practice:

- **Where tokens come from.** The token must come from something the lock service already orders. In a
  consensus-based service, every change gets a position in the replicated log, so that position is a natural
  token: ZooKeeper's `zxid` (transaction ID) of the lock node's creation, or etcd's **revision** number of the
  lock key. Chubby calls its version a **sequencer**: an opaque string containing the lock name, mode and a
  lock generation number.
- **How the resource checks.** A database can do it with a conditional write:

  ```sql
  UPDATE reports
  SET    body = :body, fence = :token
  WHERE  id = :id AND fence < :token;   -- 0 rows updated = stale holder
  ```

  An object store can use a conditional put (write only if the stored version tag still matches), and another
  etcd or ZooKeeper cluster can compare revisions inside a transaction.
- **When the resource cannot check.** Some resources (an email provider, a payment gateway, an old file system)
  cannot compare tokens. Then the lock alone cannot be safe, and you should make the action **idempotent** instead
  (section 16), or accept that the lock is only an efficiency lock. Chubby offered a fallback for such servers, the
  **lock-delay**: when a holder vanishes without releasing, the lock stays unavailable for a short period (up to a
  minute) so that most delayed requests from the old holder land before a new holder starts. It reduces the risk;
  it does not remove it.

A random value, like the Redis token in section 4, cannot be a fencing token on its own: the resource cannot tell
whether `9b1e` is newer than `7f3c`. Ordering is the point.

## 7. Redlock, and the debate about it

### What Redlock is

**Redlock** is an algorithm proposed by Salvatore Sanfilippo (antirez), the creator of Redis, to avoid the
single-server weakness in section 4 without consensus. It uses $N$ fully independent Redis masters (typically
5, with no replication between them):

1. Note the current time.
2. Try `SET lock value NX PX ttl` on all $N$ servers in turn, with a short per-server timeout so a dead server
   does not hold everything up.
3. The lock is acquired only if a **majority** ($N/2 + 1$, so 3 of 5) said `OK` **and** the total time spent
   acquiring is less than the TTL.
4. The lock's remaining validity is the TTL minus the time spent acquiring, minus an allowance for clock drift.
5. On failure, release on all servers (with the compare-and-delete script).

Any two majorities of 5 overlap in at least one server, and that server will refuse the second `SET NX`. That is
the intuition for why two clients cannot both win.

### The criticism

In 2016 Martin Kleppmann, a distributed-systems researcher, published a widely read critique. In short:

- **No fencing tokens.** Redlock's values are random, not increasing, so the resource cannot reject a paused
  client. Everything in section 5 still applies. For correctness, he argued, you need fencing, and once you need a
  monotonic counter you need consensus anyway.
- **It depends on timing assumptions.** Safety relies on bounded network delay, bounded process pauses and
  bounded clock drift. If one Redis server's clock jumps forward (for example, an administrator or NTP steps it),
  that server can expire the key early. Then a second client can gain a majority that includes it while the first
  client still believes it holds the lock.
- **Wrong tool either way.** For efficiency, one Redis is simpler and good enough. For correctness, Redlock is not
  safe. So it sits in an awkward middle.

### The response

Sanfilippo replied in a post of his own. Fairly summarised:

- **Pauses hit every lease-based lock.** Any lock with automatic release has the problem in section 5, including
  ones built on consensus. Redlock re-checks the elapsed time after acquiring, which catches pauses and delays
  that happen *during* acquisition; pauses after that are a problem for every such system.
- **The unique value can play a fencing role.** If the resource can do a check-and-set, it can store the holder's
  unique value and refuse writes from anyone else; an increasing number is not strictly required for that.
- **Clocks are an operational matter.** Redlock needs clocks that tick at roughly the right *rate*, not clocks
  that agree; operators should avoid large clock steps (slew time gradually instead), and servers that restart
  without persistence should wait one TTL before rejoining.

### What to say in an interview

Both sides agree on more than it seems: **no lease-based lock can protect a resource against a paused holder by
itself.** The disagreement is about whether Redlock's timing assumptions are acceptable and whether it offers
anything over the alternatives. A balanced, defensible position:

- For **efficiency** locks, a single Redis with `SET NX PX` and a compare-and-delete release is simplest.
- For **correctness** locks, use a **consensus-backed** service (ZooKeeper, etcd, Consul, Chubby-style), take the
  **fencing token** it gives you, and make the resource check it.

## 8. High-level design: a consensus-backed lock service

A correctness-grade lock service is a small cluster, usually **5 servers** (Chubby calls a cluster a **cell**),
that behaves like one reliable machine. It does that with a **replicated state machine**: every server holds the
same in-memory state (the lock table, sessions, small files), and every change is first written to a **log**
that all servers agree on, in the same order. Because every server applies the same changes in the same order,
they all reach the same state.

[![High-level architecture: worker A sends acquire and keep-alive requests to the leader of a five-replica Raft cluster, which replicates every change to four followers; worker B waits for a watch notification that the lock is freed; worker A writes to the shared resource with fencing token 34, and the resource rejects stale tokens](/img/system-design/distributed-lock/04-architecture.png)](/img/system-design/distributed-lock/04-architecture.png)

*Select the diagram to zoom in and move around.*

The pieces:

- **Client library.** Applications never speak the raw protocol. The library finds the leader, keeps the
  session alive in the background, retries safely, caches reads, and tells the application immediately if the
  session is in danger (section 10).
- **Leader.** One server, elected by the others, receives every write and decides its order in the log.
- **Followers.** Keep copies of the log, vote in elections, and take over if the leader dies.
- **The shared resource** is not part of the lock service, but it is part of the design: it checks fencing
  tokens.

Why 5 servers? Agreement needs a **majority** (a quorum). With 5 servers the majority is 3, so the cell keeps
working with **2 servers down**. With 3 servers it survives 1 failure. An even number adds no tolerance (4
servers still need 3, so they survive only 1 failure) and only adds load.

## 9. Deep dive: consensus with Raft

The lock service needs the servers to agree on one ordered log even when some of them crash or are cut off. That
is the **consensus** problem. Chubby uses **Paxos**, ZooKeeper uses its own protocol **ZAB** (ZooKeeper Atomic
Broadcast), and etcd and Consul use **Raft**. Raft was designed to be easier to understand, so we use it to
explain the idea; the others guarantee the same thing.

### Terms and leader election

Raft divides time into numbered **terms**. Each term has at most one leader. Every server is in one of three
roles:

[![Raft roles: a node starts as a follower; if it hears no heartbeat before its election timeout it becomes a candidate, increments the term and asks for votes; with votes from a majority it becomes leader; a candidate that sees a leader or higher term, and a leader that sees a higher term, step back to follower](/img/system-design/distributed-lock/05-raft-roles.png)](/img/system-design/distributed-lock/05-raft-roles.png)

*Select the diagram to zoom in and move around.*

1. **Followers** expect a regular **heartbeat** from the leader. Each follower has an **election timeout**,
   chosen at random (the Raft paper suggests something like 150 to 300 ms) so that followers rarely time out at
   the same moment.
2. A follower that hears nothing before its timeout becomes a **candidate**: it increments the term, votes for
   itself and asks every other server for a vote (`RequestVote`).
3. Each server votes for **at most one candidate per term**, and only for a candidate whose log is at least as up
   to date as its own. That second rule guarantees a new leader already has every committed entry.
4. A candidate with votes from a **majority** becomes leader and starts sending heartbeats. If the vote splits and
   nobody wins, the term ends with no leader, and new random timeouts make a repeat unlikely.
5. Any server that sees a message with a **higher term** immediately steps down to follower. A deposed leader on
   the wrong side of a partition therefore cannot keep acting once it hears from the new term.

Because two majorities always share at least one server, and that server votes only once per term, **two leaders
can never be elected in the same term**.

### Log replication

[![Raft commit: the client asks the leader to acquire /locks/report; the leader appends log entry 7 and sends AppendEntries to both followers; once follower 1 confirms, the leader and follower 1 form a majority, so entry 7 commits and the client is told the lock is granted with revision 7; follower 2's late confirmation is not waited for](/img/system-design/distributed-lock/06-raft-replication.png)](/img/system-design/distributed-lock/06-raft-replication.png)

*Select the diagram to zoom in and move around.*

1. The client sends "acquire `/locks/report`" to the leader.
2. The leader appends it to its log as entry 7 (in term 3) and sends `AppendEntries` to every follower.
3. Each follower writes the entry to disk and replies.
4. When a **majority** (counting the leader) has stored entry 7, it is **committed**: it will survive any future
   leader change. The leader applies it to the state machine ("lock held by session 42") and replies to the client.
   The entry's position, revision 7, becomes the **fencing token**.
5. Slow followers catch up later; the leader does not wait for them.

### Reads must be careful too

A read served by any single server might be stale: a follower may be behind, and even an old leader might not yet
know it has been replaced. For lock checks, reads must be **linearizable** (they reflect every write committed
before the read started). The leader confirms it is still leader before answering, either by exchanging a
heartbeat with a majority (Raft's "read index") or by holding a time-based **leader lease**, which is faster but
relies on bounded clock drift. Configuration reads that may be slightly stale can go to followers and caches.

## 10. Deep dive: sessions, keep-alives and the client's view

A client does not keep a separate lease for each lock. It opens one **session** with the cell and keeps it alive
with periodic **keep-alives**. Every lock the client takes is tied to its session. If the session dies, **all**
its locks are released at once. This is what makes keep-alive traffic proportional to the number of clients, not
the number of locks.

- **ZooKeeper** has sessions with a timeout negotiated at connect time; locks are **ephemeral znodes** that the
  server deletes automatically when the session expires.
- **etcd** has **leases**: a lease has a TTL, the client renews it with a `LeaseKeepAlive` stream, and any key
  attached to the lease is deleted when the lease expires.
- **Chubby** clients renew with `KeepAlive` calls. The master holds each call open until the lease is nearly over,
  then replies with an extended lease, and uses the same reply to deliver events and cache invalidations.

The dangerous moment is when keep-alives stop getting through. The client cannot tell whether the server is gone
or only the network is slow, so a good client library is conservative:

1. It tracks the lease locally with a **monotonic clock**, starting from when the keep-alive was *sent*, so its
   estimate of the deadline is never later than the server's.
2. When the deadline is close and no reply has come, it tells the application **"session in jeopardy: stop
   writing"** (Chubby's name for this state). The application should pause work that needs the lock.
3. If contact comes back in time, work resumes. If the lease ends, the library reports **"session expired: you
   have lost every lock"**, and the application must abort and start again from the top.

A leader change inside the cell should not expire every session. Chubby's approach: the new master extends every
session's lease by a grace period when it takes over, so clients that reconnect quickly lose nothing.

[![Lock states from the holder's view: acquiring a free lock goes straight to held, a taken lock means waiting until the holder leaves; waiting can end in giving up when the try-lock deadline passes; a held lock is kept alive every third of the TTL and ends either in release after the work, or in lease expiry if keep-alives are missed, in which case work must stop at once](/img/system-design/distributed-lock/07-lock-states.png)](/img/system-design/distributed-lock/07-lock-states.png)

*Select the diagram to zoom in and move around.*

## 11. The API

A typical client API (names vary between products):

| Call | What it does |
| --- | --- |
| `session = open(ttl=10s)` | Start a session (or lease); the library sends keep-alives in the background |
| `lock = acquire(name, session)` | Block until the lock is ours. Returns a handle containing the **fencing token** |
| `lock = try_acquire(name, session, timeout=2s)` | As above, but give up after the timeout and return "not acquired" |
| `renew(session)` | Extend the session's lease (normally automatic) |
| `release(lock)` | Give the lock up. Only the holder's session may release it |
| `watch(name, callback)` | Be told when the lock changes holder or is deleted |
| `campaign(election, value)` / `leader(election)` | Leader election built on locks: become leader and publish your address; find the current leader |
| `get(path)` / `set(path, value, if_version=v)` | Small configuration values, with a compare-and-set |

Design points worth stating:

- **Retries must be idempotent.** If the reply to `acquire` is lost, the client retries. The server must
  recognise "this session already holds this lock" and return the same token, not queue the client behind itself.
  etcd's lock key includes the lease ID for exactly this reason.
- **Release is conditional on ownership**, as with the Redis script, so a late release from an expired holder
  cannot free someone else's lock.
- **Hand the token to the application.** The token is useless if the client library hides it.

## 12. Deep dive: how ZooKeeper and etcd implement locks

### ZooKeeper: ephemeral sequential znodes

ZooKeeper stores data in a tree of small nodes called **znodes**, like a file system. Two flags matter:

- **Ephemeral:** the znode is deleted automatically when the session that created it ends.
- **Sequential:** ZooKeeper appends a 10-digit counter to the name, unique and increasing within the parent, so
  `lock-` becomes `lock-0000000042`.

The naive lock ("create `/locks/report`; if it already exists, watch it and try again when it is deleted") has a
**herd effect**: when the holder releases, every waiter is woken at once and they all stampede to create the
node, though only one can win. With 1,000 waiters, that is 1,000 notifications and 1,000 writes for one hand-over.

The standard ZooKeeper recipe forms a **queue** instead:

[![ZooKeeper lock recipe: create an ephemeral sequential znode such as lock-0000000042, list the children sorted by sequence; if yours is lowest you hold the lock, do the work and delete your znode (or the session expires); otherwise watch only your immediate predecessor and, when its delete event fires, list the children again](/img/system-design/distributed-lock/08-zk-lock.png)](/img/system-design/distributed-lock/08-zk-lock.png)

*Select the diagram to zoom in and move around.*

1. Create `/locks/report/lock-` with the ephemeral and sequential flags. Suppose you get `lock-0000000042`.
2. List the children of `/locks/report` and sort them by sequence number.
3. If yours is the **lowest**, you hold the lock.
4. Otherwise, set a watch on the znode **just before yours** (for example `lock-0000000041`) with `exists()`. If it
   has already gone, go back to step 2 at once.
5. When the watch fires (watches fire once), go back to step 2. Do not assume you are now first: the predecessor
   may have been a waiter that gave up, not the holder.
6. Release by deleting your own znode. If you crash, the session expires and ZooKeeper deletes it for you.

Each release wakes **exactly one** waiter, and waiters are served in arrival order, so the lock is also **fair**.
The same pattern gives leader election: the lowest znode is the leader, and each candidate watches the one before
it.

For fencing, use the transaction ID at which your znode was created (its `czxid`). ZooKeeper's transaction IDs
increase with every write to the whole ensemble, so a later lock holder always has a higher one.

### etcd: leases and revisions

etcd is a key-value store in which **every write increments a single cluster-wide 64-bit revision** number.
Every key remembers the revision at which it was created (`create_revision`) and last modified
(`mod_revision`). etcd's lock recipe mirrors the ZooKeeper one:

1. Grant a **lease** with a TTL and keep it alive.
2. Put a key `/locks/report/<lease-id>` attached to that lease. Its `create_revision` is its place in the queue.
3. If no other key under `/locks/report/` has a lower `create_revision`, you hold the lock. Otherwise watch the
   key with the next-lower revision until it is deleted.
4. Release by deleting the key, or let the lease expire.

The `create_revision` is a ready-made **fencing token**: it is unique, and it is larger for every later holder.
Because etcd also supports **transactions** with comparisons ("only do this if `mod_revision` of key X is still
N"), a resource stored in etcd can check the token in the same atomic step as the write. Kubernetes controllers
use leases stored in the cluster's API server, which itself sits on etcd, for leader election in the same spirit.

## 13. Availability versus safety

The **CAP theorem** says that when the network **partitions** (some servers cannot reach others), a system must
choose between staying **available** (answering everyone) and staying **consistent** (never giving conflicting
answers). A lock service must choose consistency, because two holders is exactly the failure a lock exists to
prevent.

What that means in practice:

- **The majority side keeps working.** In a 5-server cell split 3 and 2, the 3 elect a leader and continue. The
  2 cannot form a majority, so they refuse writes; clients connected to them must reconnect to the other side.
- **A full outage stops lock grants.** If 3 of 5 servers are down, nobody can acquire or release a lock until a
  majority is back. That is the price of safety.
- **Hold-and-continue is a trap.** While the cell is unreachable, existing holders' leases are ticking. When they
  expire, holders must stop. An application that "keeps going because the lock service is down" has turned a
  correctness lock into no lock.
- **Placement.** Put the 5 servers in different failure domains (racks, or 3 availability zones as 2 + 2 + 1) so
  one zone failure leaves a majority. Spanning distant regions makes every write pay cross-region latency; most
  designs keep one cell per region and use a separate global cell only for rare, global decisions.

## 14. Scaling the service

**Many locks, few writes.** One consensus group handles all writes, so its write rate is the ceiling. Most lock
services are deliberately used for **coarse-grained** locks (held for minutes, not milliseconds), which keeps writes
rare. If a team needs a lock per order or per row, the right answer is usually a database row lock or a
conditional write, not the lock service.

**Hierarchical namespaces.** Names like `/ls/payments/billing/leader` (Chubby) or `/locks/billing/...` group locks
by team. Access control is applied per directory, and quotas can stop one team from flooding the cell.

**Sharding by namespace.** When one cell is not enough, run **several independent cells** and assign each top-level
directory to one of them (a small directory says which cell owns `/payments`). Every individual lock still lives
in exactly one consensus group, so safety is unchanged.

**Read-heavy use as a name service.** Chubby's best-known lesson is that it became more popular as a **name
service** than as a lock service: systems such as GFS and Bigtable used it to store and find "who is the current
master". Lookups vastly outnumber changes, so:

- clients **cache** file contents and metadata, and the master sends **invalidations** before any change takes
  effect, so caches are never served stale data (the write waits until invalidations are acknowledged or the
  leases of the caches expire);
- **proxies** can sit in front of the cell to absorb keep-alives and reads from many clients;
- ZooKeeper offers **observers**, non-voting servers that receive the log and serve reads without slowing down
  writes (adding voters would make every commit wait for more servers).

**Session storms.** After a cell failover, thousands of clients reconnect at once. Spread reconnects with jittered
backoff, and give the new leader a grace period (section 10) so sessions do not expire during the switch.

## 15. Reliability: what can go wrong

| Failure | What happens | Defence |
| --- | --- | --- |
| Lock holder crashes | Its session stops sending keep-alives | Lease expires, ephemeral keys are deleted, the next waiter is notified |
| Holder pauses (GC, VM stall) past its lease | Two clients believe they hold the lock | **Fencing tokens** checked by the resource; client library stops work on "jeopardy" |
| Network delays a write past the lease | Old write arrives after the new holder's | Same: the resource rejects the lower token |
| Leader server crashes | Writes stop for one election timeout | Raft elects a new leader from the up-to-date majority; sessions get a grace period |
| Network partition | Minority side cannot commit | Majority side continues; minority refuses writes rather than risk two holders |
| Clock jumps on a server | Time-based expiry could fire early or late | Leases measured with monotonic clocks; servers do not rely on clocks agreeing |
| Disk loss on one server | That server's log is gone | It rejoins as an empty follower and copies a snapshot plus the log from the leader |
| Client retries an acquire | Could appear to queue behind itself | Idempotent acquire keyed by session (or lease) ID |
| Bug in a client that never releases | Lock held forever while the session lives | Maximum hold time, monitoring of lock age, admin tools to revoke a session |

## 16. Best practices: often the best lock is no lock

A lock service is a powerful but heavy dependency. Before reaching for one, ask whether the problem can be solved
without it:

- **Conditional writes (optimistic concurrency).** Read a row with its version, write back "only if the version is
  still 7". If someone else changed it, retry. Most "two workers update the same record" problems disappear.
- **Idempotent operations.** Give each action a unique ID (an idempotency key) and record it. Then running the same
  job twice does no harm, which is often easier than guaranteeing it runs once.
- **Single-writer partitioning.** Route all work for one key to one consumer (for example a Kafka partition), so
  nobody else is ever competing for it.
- **Database-native locks.** If the protected data lives in one database, its own transactions and row locks (or
  `SELECT ... FOR UPDATE`) are simpler and safer than an external lock.

If you do need a lock: use a consensus-backed service for correctness, use the fencing token, keep locks
coarse-grained, keep critical sections short, never assume the lock is still held after a pause, and make the
protected action idempotent anyway as a second line of defence.

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Lock store | Single Redis | Consensus cluster (Raft / Paxos / ZAB) | **Consensus** for correctness locks; Redis is fine for efficiency locks |
| Redlock | Use it for safety | Avoid it for safety | **Avoid** for correctness: no fencing tokens and relies on timing; prefer consensus + fencing |
| Crash handling | Locks held until released | Leases with TTL | **Leases**: a dead holder cannot block everyone |
| TTL length | Short (seconds) | Long (minutes) | **About 10 s**, renewed every third: fast recovery, tolerant of a lost keep-alive |
| Stale holders | Trust the client to stop | Fencing tokens at the resource | **Fencing**: only the resource can see the stale write in time |
| Waiting | Everyone watches the lock | Each waiter watches its predecessor | **Predecessor**: no herd effect, and fair ordering |
| Partition | Stay available | Stay consistent | **Consistent** (CP): two holders is worse than a short outage |
| Cluster size | 3 servers | 5 servers | **5**: survives 2 failures; even sizes add nothing |
| Read scaling | All reads via leader | Client caches + invalidation, observers | **Caching with invalidation** for name-service lookups; linearizable reads for lock checks |

## Cheat sheet for last-minute revision

- **First question:** efficiency lock (duplicates waste work) or correctness lock (duplicates corrupt data)? Redis
  is fine for the first; the second needs consensus and fencing.
- **Single Redis:** `SET key random NX PX ttl`; release with a compare-and-delete Lua script. Breaks on async
  failover, restarts without persistence, and expiry during long work.
- **Lease** = lock with a TTL, renewed by keep-alives (every TTL / 3). Solves dead holders.
- **The core problem:** a holder can be paused (GC, VM stall), delayed (network) or misled (clock) between checking
  the lock and writing. It cannot detect this from inside. **No lease-based lock is safe on its own.**
- **Fencing token:** a number that increases with every grant; the resource rejects writes with a token lower than
  the highest it has seen. Use ZooKeeper's `czxid`, etcd's revision, Chubby's sequencer.
- **Redlock:** majority of 5 independent Redis masters. Critique: no fencing, depends on timing and clocks.
  Response: all leases share the pause problem; elapsed time is checked; unique values allow check-and-set.
  Interview answer: consensus + fencing for correctness.
- **Consensus:** replicated state machine on 5 servers (survives 2 failures). Raft: terms, random election
  timeouts, one vote per term, majority wins; leader appends to log, commits on majority, then applies.
- **Sessions:** one session per client, all locks tied to it; keep-alives; "jeopardy" means stop writing;
  expiry releases everything.
- **ZooKeeper recipe:** ephemeral sequential znodes, lowest holds the lock, each waiter watches only its
  predecessor (no herd effect, fair). **etcd:** lease + key with lowest `create_revision` wins.
- **CAP:** a lock service is CP. Minority side refuses; holders must stop when their lease ends.
- **Scale:** coarse-grained locks, hierarchical namespaces, separate cells per namespace, client caching with
  invalidation and observers for read-heavy name-service use.
- **Best practice:** prefer conditional writes, idempotency or single-writer partitioning when they solve it.

## Practice questions

1. **Your nightly billing job uses a Redis lock with a 60-second TTL. One night customers are charged twice. What
   probably happened, and how do you fix it?** The job (or a GC pause, or a slow payment call) outlived the TTL, so
   a second instance acquired the lock; or the Redis primary failed over before replicating the key. Fix the
   root: make each charge idempotent with a key like `(customer_id, billing_month)`, and if a lock is still
   wanted, use a consensus-backed lock and pass its fencing token to the billing database.
2. **Why does a 5-server cluster tolerate 2 failures but a 6-server cluster still only 2?** A majority of 6 is 4,
   so only 2 may fail. The sixth server adds load to every commit without adding tolerance.
3. **Explain to a junior engineer why checking "do I still hold the lock?" right before writing is not enough.**
   The process can be paused, or the write delayed in the network, after the check and before the write lands.
   Only the resource sees the write at the moment it happens, so only the resource can reject a stale one.
4. **A thousand workers wait for the same ZooKeeper lock. What happens on release with the naive recipe and with the
   sequential recipe?** Naive: all 1,000 watches fire and 1,000 clients race to create the node (herd effect).
   Sequential: only the next waiter's watch on its predecessor fires, so one notification and one hand-over.
5. **The lock-protected resource is a third-party email API that cannot check tokens. What can you do?** Accept the
   lock as an efficiency lock and make the action idempotent instead: store a "sent" record keyed by message ID in
   your own database with a conditional insert before calling the API, and use the provider's idempotency key if it
   offers one.
6. **How would you build leader election for a scheduler fleet on etcd, and how do followers learn the leader's
   address?** Each instance campaigns by putting a key under `/election/scheduler/` with its lease; the lowest
   `create_revision` is leader and stores its address as the value. Others watch the key just before theirs. Clients
   read the lowest key (or watch the prefix) to find the leader, and the leader passes its `create_revision` as a
   fencing token to anything it writes.
