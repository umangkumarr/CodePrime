---
title: "Design a Distributed Job Scheduler (cron at scale)"
description: "Design cron at scale: one-off and recurring jobs, finding due runs fast, partitioned schedulers, queues, leases, retries, DAGs, fairness and catch-up."
difficulty: "Medium"
sidebar:
  label: "Distributed job scheduler (cron)"
tags: ["Scheduling", "Queues", "Distributed Systems", "Fault Tolerance", "Databases"]
---

Every large company runs millions of small tasks on a timer. Send the daily summary email at 08:00. Retry
a failed payment in 10 minutes. Rebuild the search index every night. Delete unconfirmed accounts after 7 days.
On one Linux machine, the old tool **cron** handles this: you write "run this script at 08:00" and the machine
does it. At scale, one machine is not enough. It can die, it cannot run millions of jobs, and nobody notices
when it silently stops.

A **distributed job scheduler** is cron rebuilt for that world. Think of it as an **alarm clock** that never
forgets an alarm, a **dispatcher** that hands each ringing alarm to a free worker, and a **supervisor** that
notices when a worker falls asleep on the job and gives the task to someone else.

This case study builds that system from first principles: what a job is, how to find the jobs that are due
right now among millions, how to make sure each one runs (and does not run twice by accident), and what
happens when machines, clocks and whole data centres misbehave.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Job scheduling in 5 minutes

First, the vocabulary. These words will appear in every section.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Job** | The definition: *what* to run, *when*, and with which settings ("send the report, every day at 08:00") | A recurring entry in your calendar |
| **Run** (or execution) | One concrete occurrence of a job ("the report for 12 March, 08:00") | One particular meeting from that calendar entry |
| **One-off job** | Runs once, at a given time ("charge this card at 10:30 tomorrow") | A single reminder |
| **Recurring job** | Runs repeatedly on a schedule, usually written as a cron expression | A weekly alarm |
| **Cron expression** | A compact schedule: five fields for minute, hour, day of month, month and day of week | "Every weekday at nine" written in shorthand |
| **Scheduler** | The part that decides *when* a run is due and hands it out | The alarm clock |
| **Worker** | A machine or process that actually *does* the work | The person who answers the alarm |
| **Lease** | A time-limited claim: "worker 12 owns this run until 10:00:30" | Borrowing a library book with a due date |
| **Heartbeat** | A small "I am still alive and working" message that renews a lease | Renewing the book before it is due |
| **Idempotent** | Doing it twice has the same effect as doing it once | Pressing a lift button twice still calls one lift |
| **Dead-letter queue (DLQ)** | Where runs go after they have failed too many times, for a human to inspect | The "returned to sender" pile at a post office |

A cron expression reads left to right as **minute, hour, day of month, month, day of week**. A `*` means
"every". So:

| Expression | Meaning |
| --- | --- |
| `0 8 * * *` | 08:00 every day |
| `*/15 * * * *` | Every 15 minutes |
| `0 9 * * 1-5` | 09:00 Monday to Friday |
| `30 2 1 * *` | 02:30 on the first day of every month |

Two facts shape the whole design:

1. **A recurring job is a generator of runs.** The scheduler never "runs a job"; it creates and dispatches
   *runs*, one at a time, each with its own state, attempts and result. Keeping job and run separate is the
   first thing an interviewer looks for.
2. **"When" and "how" are different problems.** Deciding *when* something is due is a timing and indexing
   problem. *Doing* the work is a capacity problem. We split them into the **scheduler** and the **workers**,
   joined by a **queue**, so each side can scale and fail on its own.

## 2. Requirements

### Functional (what users can do)

- **Create, update, pause, resume and delete jobs**, either one-off (a timestamp) or recurring (a cron
  expression plus a **time zone**).
- **Run each job at its scheduled time** on a pool of workers, passing a payload (for example the HTTP
  endpoint to call or the task name and arguments).
- **Retries** with a configurable limit and backoff; after the last attempt, move the run to a dead-letter queue.
- **Timeouts**: a run that takes longer than its limit is treated as failed.
- **Dependencies**: "run job C only after A and B both succeed" (a DAG, explained in section 12).
- **Priorities** and **per-tenant quotas**, so one team cannot starve everyone else.
- **Catch-up policy**: what to do with runs that were missed during an outage.
- **History and monitoring**: see every run's status, attempts, duration and error; get alerted on failures.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Timeliness** | A run starts within about 1–2 seconds of its scheduled time (p99) | "Charge at 10:30" should not mean 10:34 |
| **Reliability** | Never silently drop a run; every due run is executed or visibly failed | A missed nightly backup is discovered only when you need it |
| **Execution guarantee** | At least once, with tools that make duplicates harmless | Exactly once is impossible across machines that can crash (section 10) |
| **Availability** | 99.99% for scheduling; no single point of failure | Every team's automation depends on it |
| **Scale** | Tens of millions of jobs, about a billion runs a day | Company-wide shared platform |
| **Isolation** | One tenant's flood or broken job cannot hurt others | Shared platforms fail on noisy neighbours |

### Out of scope

Writing the job code itself, a full workflow language (like Airflow's or Temporal's), sub-second scheduling
for real-time systems, and the UI. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** 50 million active recurring jobs, each running on average 20 times a day, plus 100 million
one-off jobs a day. An average run takes 30 seconds. A run record is about 500 bytes; a job definition about
2 KB.

**Runs**

- Recurring: $50\text{M} \times 20 = 1\text{B}$ runs a day. One-off: $0.1\text{B}$. Total about **1.1 billion
  runs a day**.
- Average rate: $1.1\text{B} / 86{,}400 \approx$ **13,000 runs per second**.
- **The peak is not 3× the average; it is a spike.** People love round times: `0 0 * * *` (midnight),
  `0 * * * *` (top of every hour). If just 5 million jobs say "midnight UTC", 5 million runs become due in the
  same second. Section 15 deals with this "thundering herd".

**Workers**

- Concurrent runs = rate × duration (Little's law): $13{,}000 \times 30\text{ s} \approx 390{,}000$ runs in
  flight. At 20 runs per worker process, about **20,000 worker processes**.

**Heartbeats**

- If every running run sends a heartbeat every 10 s: $390{,}000 / 10 =$ **39,000 writes per second** just to
  say "still alive". If each *worker* sends one heartbeat covering all its runs, it is $20{,}000 / 10 =$
  **2,000 per second**. Batching heartbeats per worker is a 20× saving.

**Storage**

- Job definitions: $50\text{M} \times 2\text{ KB} = 100\text{ GB}$. Small; fits in a sharded database easily.
- Run history: $1.1\text{B} \times 500\text{ B} \approx 550\text{ GB}$ a day, about **16 TB per 30 days**.
  Keep recent history hot and move older runs to cheap storage.

Conclusions:

1. **Finding due runs must be an index lookup, not a scan.** Scanning 150 million rows every second is
   impossible; reading "the runs due in this second" must be cheap.
2. **Dispatch must be spread over many scheduler nodes**, especially for midnight spikes.
3. **Run history, not job definitions, dominates storage.** Partition it by time so old data is easy to drop.

## 4. The API

Clients (other services, a CLI, a web UI) use an HTTPS JSON API.

| Method and path | What it does |
| --- | --- |
| `POST /v1/jobs` | Create a job. Body: `name`, `schedule` (`{"cron": "0 8 * * *", "timeZone": "Asia/Kolkata"}` or `{"runAt": "2026-03-12T10:30:00Z"}`), `target` (HTTP endpoint or task name), `payload`, `priority`, `maxAttempts`, `timeoutSeconds`, `catchUpPolicy`, `dependsOn`. Takes an `Idempotency-Key` header so a retried create does not make two jobs. |
| `GET /v1/jobs/{job_id}` | The job definition and its next run time. |
| `PATCH /v1/jobs/{job_id}` | Change the schedule or settings; `{"status": "paused"}` pauses it. |
| `DELETE /v1/jobs/{job_id}` | Delete; future runs are cancelled. |
| `POST /v1/jobs/{job_id}/trigger` | Run it now, once, outside its schedule. |
| `GET /v1/jobs/{job_id}/runs?cursor=...` | Run history, newest first, with a cursor. |
| `POST /v1/runs/{run_id}/retry` | Replay a dead-lettered run after fixing the cause. |

Workers use a separate internal API: **claim** a run, **heartbeat**, and **complete** (success or failure with
an error). Each of these carries the run's **fencing token** (section 10).

## 5. High-level design

[![High-level architecture: clients call the job API, which saves jobs to the job store; scheduler nodes, each owning partitions leased from a coordinator, claim due runs from the job store and enqueue them on the run queue; the worker pool pulls runs, heartbeats to the execution store and sends runs that give up to the dead-letter queue; the scheduler requeues expired leases and metrics read lag and failures from the execution store](/img/system-design/distributed-job-scheduler/01-architecture.png)](/img/system-design/distributed-job-scheduler/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Job API:** validates schedules (is the cron expression legal? is the time zone real?), checks permissions
  and quotas, and writes the job plus its **first run**.
- **Job store:** the durable source of truth for job definitions and the **due-run index**: "which runs are due
  at time *t*?". Split into **partitions** (shards) by a hash of `job_id`.
- **Coordinator** (ZooKeeper or etcd): a small, strongly consistent service that decides which scheduler node
  owns which partitions, using leases.
- **Scheduler nodes:** each one watches only its own partitions, claims runs as they become due, creates the
  next run of recurring jobs, and puts due runs on the queue. They also **requeue** runs whose lease expired.
- **Run queue** (for example Kafka, SQS or RabbitMQ): the buffer between "it is time" and "someone is free".
  Separate queues per priority, and fairness between tenants (section 13).
- **Worker pool:** pulls runs, executes the job code, heartbeats, and reports the result.
- **Execution store:** each run's state, attempt number, lease and result. In a small system it is the same
  database as the job store; at scale it is often separate because it is written far more often.
- **Dead-letter queue:** runs that failed every attempt, kept for humans to inspect and replay.
- **Metrics and alerts:** schedule lag, queue depth, failures, DLQ size.

The single most useful idea in this design: **the scheduler only decides *when*; it never does the work.**
Dispatching a run is a few milliseconds of database and queue work, so a few scheduler nodes can keep up
with a billion runs a day, while the heavy lifting scales separately in the worker pool.

## 6. Low-level design: the data model

[![Data model: a tenant owns many jobs; a job has many executions and many job_dependencies rows; each execution has one row in due_runs, keyed by partition and time bucket](/img/system-design/distributed-job-scheduler/02-data-model.png)](/img/system-design/distributed-job-scheduler/02-data-model.png)

*Select the diagram to zoom in and move around.*

Five decisions hide in this diagram.

**1. Jobs and executions are separate tables.** A job is a template; an execution (run) is one occurrence.
A job that runs every minute produces 1,440 executions a day, each with its own status, attempt count and
error. Mixing them would mean overwriting yesterday's history every time the job runs.

**2. Recurring jobs keep exactly one future run.** When the job is created, the API computes the next fire time
from the cron expression and inserts **one** execution with status `scheduled`. When that run is dispatched,
the scheduler creates the next one. We never pre-create a year of runs: that would be 525,600 rows for an
every-minute job, and every schedule change would mean deleting them.

**3. `run_key` makes runs unique.** It is `job_id + scheduled_for` (for example `job42@2026-03-12T08:00Z`), with
a unique constraint. If a scheduler crashes and a second one tries to create the same next run, the insert fails
harmlessly. The same key is passed to the job so *it* can be idempotent (section 10).

**4. `due_runs` is the "what is due now?" index.** Its key is `(partition, time_bucket, execution_id)`, where
`time_bucket` is the scheduled time rounded down to the second (or minute). "What is due in partition 7 at
10:05:00?" is a single range read of one small slice, no matter how many jobs exist. Section 8 compares this
with other ways of finding due work.

**5. `lease_expires_at` and `fencing_token` live on the execution.** They are how we detect dead workers and
reject their late writes (section 10). `version` on the job supports optimistic locking: two people editing the
same job at once cannot silently overwrite each other.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Jobs, dependencies | Tens of millions of rows, point reads by `job_id`, needs constraints | Sharded MySQL / Postgres, or a distributed SQL store (CockroachDB, Spanner) | Transactions for "create job + first run" |
| Due-run index | Range reads by `(partition, time)`, rows inserted and deleted constantly | Same SQL store with an index, a wide-column store (Cassandra), or Redis sorted sets for the near future | Sorted by time, cheap range scans |
| Executions (history) | A billion inserts a day, read mostly recently | Wide-column store or SQL partitioned by day | Old days are dropped as whole partitions |
| Leases, heartbeats | Very frequent small updates | The execution row, or Redis with expiry for the hot part | Fast writes |
| Run queue | Ordered, durable, many consumers | Kafka, SQS, RabbitMQ | Buffering and back-pressure |
| Coordination | A few keys, strong consistency | ZooKeeper, etcd | Leader election and partition ownership |

## 7. Flow: dispatching one due run

The nightly report job has a run `r1` due at 10:05:00 in partition 7.

[![Sequence: the scheduler that owns partition 7 asks the job store for runs due in bucket 10:05, gets r1, claims it with a conditional update that only succeeds if r1 is still scheduled, creates the next run r2, and enqueues r1; the queue delivers r1 to a worker, which marks it running with a 30 second lease and token 8, heartbeats every 10 seconds, records success with token 8 and acknowledges the queue message](/img/system-design/distributed-job-scheduler/03-dispatch.png)](/img/system-design/distributed-job-scheduler/03-dispatch.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Step 3 is a conditional update**, a compare-and-set:

  ```sql
  UPDATE executions SET status = 'queued'
  WHERE id = 'r1' AND status = 'scheduled';
  ```

  If two schedulers ever look at the same run (for example during a partition handover), only one gets
  "1 row updated". The other sees 0 rows and moves on. Correctness never depends on there being exactly one
  scheduler.
- **Step 4 creates the next run before the current one even starts.** The schedule keeps ticking whether this run
  succeeds, fails or takes an hour. Steps 3 and 4 go in one transaction so we never lose the next run.
- **Order matters between step 3 and step 5.** We mark the run `queued` *before* enqueuing. If the scheduler
  crashes in between, the run sits in `queued` but was never sent. A sweeper finds runs stuck in `queued` for
  longer than, say, a minute and enqueues them again. (The reverse order would risk a run that is in the queue
  but still `scheduled`, which the next poll would enqueue a second time.)
- **The worker takes a lease** (step 7) and keeps renewing it (step 8). The lease is how the system learns,
  without any explicit "I died" message, that a worker is gone.
- **The queue message is acknowledged last** (step 10), only after the result is durably recorded. If the worker
  dies before acking, the queue redelivers. This is **at-least-once** delivery.

## 8. Deep dive: finding due jobs efficiently

The core question, asked every second: *which runs are due now?* With 150 million future runs, the answer must
come from an index, not a scan. There are four common approaches, and real systems often combine two.

| Approach | How it works | Strengths | Weaknesses |
| --- | --- | --- | --- |
| **Database index on `next_run_at`** | `SELECT ... WHERE next_run_at <= now() ORDER BY next_run_at LIMIT 500 FOR UPDATE SKIP LOCKED` | Simple, transactional, one store | One hot index; polling load grows with nodes |
| **Time-bucketed table** | Rows keyed by `(partition, time_bucket)`; read exactly the current bucket | Spreads load across partitions; works on wide-column stores | Must handle late buckets after a pause |
| **Sorted set (Redis)** | `ZADD due <timestamp> r1`; poll with `ZRANGEBYSCORE due 0 <now>`, claim with `ZREM` | Very fast, sub-second precision | Memory-bound; Redis is not the durable record |
| **Delay queue** | Put the run on a queue with "deliver after *t*" (SQS delay, RabbitMQ delayed messages) | No polling code at all | Short maximum delays (SQS: 15 minutes); hard to cancel or reschedule |

`FOR UPDATE SKIP LOCKED` (Postgres, MySQL 8) deserves a word: it lets several pollers each lock a *different*
batch of due rows instead of queuing behind each other's locks. It is the simplest correct design for a
small or medium scheduler.

**The two-tier pattern** is a good answer at scale. Think of a hotel's wake-up calls: the full list for the
year sits in a ledger, but each evening the receptionist copies tomorrow morning's calls onto a small card by
the phone.

1. **The durable tier** (the job store) holds every future run, indexed by time bucket.
2. **A loader** runs every minute and moves runs due in the **next few minutes** into a fast in-memory
   structure: a Redis sorted set, or an in-process priority queue (a min-heap ordered by time) or a
   **timing wheel** inside the scheduler node.
3. **The dispatcher** pops from that fast structure at the exact second.

A **timing wheel** is like a clock face with 60 slots, one per second. Each slot holds a list of the runs due
in that second; a pointer advances one slot per second and fires everything in it. Adding and firing are both
$O(1)$, which is why network stacks and Kafka use it for timeouts. Runs further away go into a coarser wheel
(minutes, hours) and move down as their time approaches.

If a scheduler node crashes, the fast tier is simply rebuilt from the durable tier. **The durable tier is the
truth; the fast tier is a cache of the next few minutes.**

## 9. Deep dive: who runs the scheduler?

One scheduler process would be simple, but it is a single point of failure and a throughput ceiling. There are
two standard ways to run many.

### Option A: one leader, hot standbys

All scheduler nodes compete for a **leader lease** in ZooKeeper or etcd. The winner dispatches; the rest wait.
If the leader stops renewing its lease (it crashed, or is cut off from the network), the lease expires and a
standby takes over within seconds.

- Good for small and medium systems: easy to reason about, one place makes decisions.
- Limit: one node's throughput. A midnight spike of millions of runs would overwhelm it.

### Option B: partitioned schedulers (the scalable answer)

Split all runs into, say, **1,024 partitions** by `hash(job_id) mod 1024`. The coordinator assigns partitions
to scheduler nodes, each with a lease: node 1 owns partitions 0–255, node 2 owns 256–511, and so on. Each node
only polls its own partitions.

- Adding a node: the coordinator moves some partitions to it. Partition count stays fixed, so no data moves;
  only *ownership* moves.
- A node dies: its leases expire, and its partitions are reassigned to survivors.
- Use **many more partitions than nodes** so load can be rebalanced in small steps.

### Split brain: why leases are not enough

Imagine node 1 freezes for 20 seconds (a long garbage-collection pause). Its lease expires and node 2 takes
partition 7. Then node 1 wakes up, still believing it owns partition 7, and dispatches the same runs. Two
schedulers, one partition: **split brain**.

We defend in depth instead of trusting the lease:

1. **The conditional claim** from section 7 (`... AND status = 'scheduled'`) means only one node can move a run
   to `queued`.
2. **The partition lease carries an epoch number** that increases on every handover. Writes include the epoch,
   and the store rejects an old one.
3. **The `run_key` unique constraint** stops a duplicate "next run" from being created.

The lesson for interviews: **leader election reduces duplicate work; it does not guarantee it never happens.**
Correctness must come from the data layer.

## 10. Deep dive: at-least-once execution, leases and idempotency

### Why "exactly once" is impossible

A worker runs a job that charges a card, and then crashes before it can report "done". From the outside, we
cannot tell "crashed before charging" from "crashed after charging". We have two choices:

- **Never retry:** at-most-once. Some runs are silently lost. Unacceptable for most jobs.
- **Retry:** at-least-once. Every run happens, but occasionally twice.

Schedulers choose **at-least-once**, and then make the second execution harmless. That pair is often called
"effectively once".

### Making duplicates harmless

- **Pass the `run_key` to the job** as an idempotency key. The payment service stores keys it has seen and
  returns the first result for a repeat. Same for "send email for run `job42@2026-03-12T08:00Z`".
- **Write results with upserts keyed by run**, not blind inserts.
- **Design jobs as "make it so" rather than "do it again"**: "set the report for 12 March to *X*" is naturally
  idempotent; "append a row" is not.

### The life of a run

[![Lifecycle of a run: scheduled, then queued when its time is reached, then running when a worker claims it, then succeeded; a scheduled run that is too late is skipped; a queued run can be cancelled; a running run that errors or loses its lease goes to retry wait and back to queued after backoff, or to dead-lettered when no attempts are left](/img/system-design/distributed-job-scheduler/04-run-states.png)](/img/system-design/distributed-job-scheduler/04-run-states.png)

*Select the diagram to zoom in and move around.*

Every state change is a conditional update from an expected state ("set `running` where status is `queued`"),
so two actors can never both move a run.

### Leases, heartbeats and dead workers

A worker that crashes cannot tell anyone. So we turn silence into a signal:

- When a worker claims a run, it gets a **lease** (say 30 seconds) and a **fencing token**, a number that
  increases every time the run is handed out.
- While working, it **heartbeats** every 10 seconds, pushing the lease forward. Heartbeat interval is usually
  a third of the lease, so two missed heartbeats in a row do not kill a healthy run.
- A **lease reaper** (part of the scheduler) regularly looks for runs where `lease_expires_at < now()` and puts
  them back into retry, with the attempt number and fencing token increased.

[![Sequence: worker A claims r1 with a lease to 10:00:30 and token 8, heartbeats once, then freezes; at 10:00:45 the lease reaper finds the expired lease, sets attempt 2 and token 9, and re-enqueues r1; worker B claims it with token 9; when A wakes up and reports success with token 8 the execution store rejects it as stale](/img/system-design/distributed-job-scheduler/05-dead-worker.png)](/img/system-design/distributed-job-scheduler/05-dead-worker.png)

*Select the diagram to zoom in and move around.*

The last two steps are the subtle part. Worker A was not dead, only frozen. When it wakes it tries to report
success. Without protection, two workers would both believe they own the run. The **fencing token** fixes
this: every write says which token it holds, and the store accepts it only if it matches the current one.

```sql
UPDATE executions SET status = 'succeeded', finished_at = now()
WHERE id = 'r1' AND fencing_token = 8;   -- 0 rows: token 9 is current
```

The token can also be passed to downstream systems, so they reject writes from a "zombie" worker too.

**Choosing the lease length** is a trade-off. Short leases detect dead workers fast but risk killing healthy
runs during a brief network blip. Long leases are safe but leave a dead worker's runs stuck for longer. 30–60
seconds with 10-second heartbeats is a sensible default; long batch jobs keep heartbeating for hours.

**Heartbeat cost** matters at scale (section 3): one heartbeat per *worker* listing all its run IDs is 20×
cheaper than one per run.

## 11. Deep dive: retries, backoff and dead-letter queues

Not every failure deserves a retry, and retrying too eagerly can turn a small outage into a big one.

[![Failure handling: when a run fails by error, timeout or lost lease, check whether the error is retryable and whether attempts are left; if both, wait an exponential backoff with jitter and re-enqueue with attempt plus one; otherwise send it to the dead-letter queue, mark it failed and alert the job owner](/img/system-design/distributed-job-scheduler/06-failure.png)](/img/system-design/distributed-job-scheduler/06-failure.png)

*Select the diagram to zoom in and move around.*

- **Retryable or not?** A timeout, a `503` or a lost lease is probably temporary: retry. A `400 Bad Request` or
  "job code threw a validation error" will fail every time: retrying only wastes capacity. Jobs report which
  kind of error they hit.
- **Exponential backoff:** wait `base × 2^attempt`, capped. With a 10-second base: 10 s, 20 s, 40 s, 80 s… This
  gives a struggling dependency room to recover instead of being hammered.
- **Jitter:** add a random amount (for example a random value between 0 and the computed delay). Without it,
  a thousand runs that failed together at 10:00 all retry together at 10:00:20 and fail together again.
- **Retry scheduling reuses the scheduler.** A retry is just the same run put back into `due_runs` with a new
  time. No special retry machinery is needed.
- **Dead-letter queue:** after `max_attempts`, the run moves to the DLQ with its last error. Humans fix the
  cause and replay it with `POST /v1/runs/{id}/retry`. A growing DLQ is an alert, not a log.
- **Poison jobs:** a run that crashes the worker process itself (out of memory, segfault) shows up as repeated
  lost leases. Counting those as attempts stops one bad run from killing workers forever.
- **Timeouts:** a run past `timeout_seconds` is cancelled by its worker (or its lease is simply not renewed),
  and counts as a failed attempt.

## 12. Deep dive: job dependencies (DAGs)

Real pipelines are chains: export orders and export payments, then join them, then build a report, then email
it. The dependencies form a **DAG**, a *directed acyclic graph*: arrows point from a job to the jobs that wait
for it, and there are no loops.

[![A job DAG: export orders and export payments both run at 02:00; join and clean waits for both to succeed; then build report; then email report and refresh dashboard both follow](/img/system-design/distributed-job-scheduler/07-dag.png)](/img/system-design/distributed-job-scheduler/07-dag.png)

How a scheduler supports this, at a high level:

- **Reject cycles at creation time.** When `dependsOn` is set, run a depth-first search from the new job; if it
  reaches itself, refuse. A cycle would mean jobs waiting for each other forever.
- **Track one DAG run, not just job runs.** Tonight's pipeline is a *DAG run* with an ID (say the date). Each
  node gets an execution tied to it, so tonight's "join" waits for *tonight's* exports, not last night's.
- **Count unmet dependencies.** Each waiting execution stores how many parents are still unfinished (its
  in-degree). When a parent succeeds, decrement each child's counter in a transaction; a child whose counter
  hits zero is put into `due_runs` for "now".
- **Failure propagation:** if a parent fails for good, its descendants are marked `upstream_failed` instead
  of waiting forever. Optional "run even if a parent failed" flags cover clean-up jobs.

Full workflow engines (Airflow, Argo Workflows, Temporal) add much more. In an interview, this level is
usually enough: cycle check, per-run counters, and failure propagation.

## 13. Deep dive: priorities and fairness between tenants

A shared scheduler serves many teams (**tenants**). Two problems appear.

**Priorities.** A payment retry should not wait behind a million analytics jobs. Use **separate queues per
priority** (for example high, normal, low) and have workers pull from high first. Pure strict priority can
**starve** low-priority work forever, so either reserve a share of workers for each level (say 60 / 30 / 10%)
or use **aging**: a run's effective priority rises the longer it waits.

**Fairness.** Team A schedules 2 million runs at midnight; team B schedules 50. With one shared first-in,
first-out queue, team B waits behind all of team A's work. Fixes, from simple to complete:

- **Quotas at creation time:** each tenant has a maximum number of jobs and runs per minute
  (`runs_per_minute` in the data model).
- **Per-tenant concurrency limits:** at most `max_concurrent_runs` running at once. A worker that picks a run
  from a tenant at its limit puts it back with a short delay.
- **Fair dispatch:** keep a logical queue per tenant and have the dispatcher take from tenants in
  **round-robin** (or **weighted fair queueing**, where bigger tenants get a larger but bounded share). This is
  like a supermarket opening one till per customer group and serving them in turn, so a trolley-load customer
  cannot block someone buying milk.
- **Dedicated pools** for the largest or most critical tenants, so their load is physically isolated.

## 14. Deep dive: time zones, daylight saving and clock skew

Time is where schedulers quietly go wrong.

**Store instants in UTC, schedules in the user's zone.** "Every day at 09:00 in Asia/Kolkata" must be stored
as the cron expression **plus** the IANA zone name (`Asia/Kolkata`, `Europe/London`), never as a fixed
UTC offset like `+05:30`. Offsets change with daylight saving time (DST); zone names carry the rules. Compute
each next run in the local zone, then convert to UTC for `scheduled_for`.

**Daylight saving creates two awkward cases** (in zones that use it, such as `Europe/London`):

- **Spring forward:** clocks jump from 01:00 to 02:00. A job at 01:30 has no such time that day. Common
  policy: run it at the first valid time after (02:00), so it is not skipped.
- **Fall back:** 01:00–02:00 happens twice. A job at 01:30 would match twice. Common policy: run once, on the
  first occurrence.

Interval schedules ("every 15 minutes") are best computed in UTC, so they never stretch or shrink across a DST
change. Whatever the policy, document it and test it; it is a classic source of "the job ran twice on Sunday".

**Clock skew.** Every machine's clock drifts. NTP keeps them within milliseconds usually, but a bad host can be
seconds off. Rules that keep us safe:

- **Only the scheduler's clock decides when a run is due.** Never trust a client's clock or a worker's clock
  for scheduling.
- **Leases are compared by the store that holds them**, ideally using its own time (`now()` in the database),
  so one fast-clocked worker cannot think its lease is still valid.
- **Fencing tokens, not timestamps, decide who wins** (section 10). Time is used only to *detect* problems.
- Monitor clock offset on every host and take hosts with large skew out of service.

## 15. Deep dive: missed runs after an outage (catch-up)

Suppose the scheduler, or a downstream system, is down from 02:00 to 05:00. An every-15-minutes job missed 12
runs. What should happen at 05:00? It depends on the job, so it is a per-job **catch-up policy**:

| Policy | What happens at 05:00 | Good for |
| --- | --- | --- |
| **Run all missed** (backfill) | All 12 runs are dispatched, oldest first | Jobs that process "the data for that interval", like hourly billing |
| **Run once** (latest only) | One run now; the other 11 are marked `skipped` | "Refresh the cache", "sync the latest state" |
| **Skip** | Nothing now; wait for 05:15 | Time-sensitive jobs: "send the 08:00 reminder" is pointless at 11:00 |

Supporting details:

- **Misfire threshold:** a run is "late but fine" if it starts within, say, 60 seconds of its time; beyond that
  the catch-up policy applies. Quartz (a Java scheduler) uses this idea under the name misfire threshold, and
  Kubernetes CronJobs have a similar `startingDeadlineSeconds`.
- **Overlap (concurrency) policy:** if the 05:00 run is still going at 05:15, should the 05:15 run start?
  Kubernetes CronJobs name the options well: **Allow** (run both), **Forbid** (skip the new one), **Replace**
  (stop the old one, start the new one).
- **Throttle the backfill.** Catching up hundreds of thousands of jobs at once is itself a thundering herd.
  Release missed runs at a controlled rate, with fair sharing between tenants.
- **How the scheduler notices:** each partition remembers the last time bucket it fully processed. On restart
  it resumes from there, not from "now", so nothing is lost silently.

## 16. Monitoring: knowing it works

A scheduler's worst failure is silent: a job that simply stops running. Monitoring must catch absence, not
only errors.

| Metric | What it tells you | Alert when |
| --- | --- | --- |
| **Schedule lag** (start time − scheduled time) | Are we on time? The key health signal | p99 above a few seconds |
| **Due-but-unclaimed runs** per partition | Is a partition orphaned or stuck? | Any partition grows for a minute |
| **Queue depth and age** | Do we have enough workers? | Oldest message older than a threshold |
| **Success / failure rate** per job and tenant | Is a job or dependency broken? | Failure rate jumps |
| **Lease expiries** | Workers crashing or freezing | Spike above baseline |
| **Dead-letter queue size** | Runs needing humans | Any growth for critical jobs |
| **Run duration** | Jobs getting slower, risk of overlap | Above the job's timeout or its history |

Two habits make this robust:

- **"Did not run" alerts.** For critical jobs, alert if no successful run has happened by an expected time,
  like a **dead man's switch**: the alarm goes off unless something keeps pressing the button.
- **Every run is traceable.** Each run carries its `run_key` in logs and traces, from the scheduler through the
  queue to the worker and the job's own downstream calls.

## 17. What breaks as it grows, and how to fix it

**The midnight thundering herd.** Millions of runs due at `00:00:00`. *Fix:* partitioned schedulers so the work is
spread; pre-load the spike into the fast tier minutes early; and, where the job allows it, let users opt into a
**jitter window** ("any time between 00:00 and 00:10"), spreading runs deterministically by hashing `job_id`.

**The hot partition.** One partition holds a tenant with a million jobs that all fire together. *Fix:* hash by
`job_id` (not tenant), use many partitions, and let the coordinator move busy partitions to quieter nodes.

**The growing history table.** 550 GB a day never stops growing. *Fix:* partition `executions` by day and drop or
archive old partitions to object storage; keep a compact summary (last success, failure counts) per job.

**Slow downstream systems.** A job calls a service that is down; thousands of retries pile on it. *Fix:* backoff
with jitter, per-target concurrency limits, and a **circuit breaker** that pauses dispatching to a target that
keeps failing.

**Very long jobs.** A 6-hour job on a worker that gets redeployed loses all progress. *Fix:* jobs checkpoint
progress, workers drain gracefully (stop taking new runs, finish current ones) before shutdown, and long runs
keep heartbeating so they are not falsely declared dead.

**Region failure.** *Fix:* replicate the job store to a second region; the coordinator there can take over
partitions. Accept that a few runs near the failover may execute twice, which idempotency already covers.

## 18. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Execution guarantee | At most once | At least once | **At least once** + idempotent jobs: losing runs silently is worse than rare duplicates |
| Scheduler topology | Single leader | Partitioned | **Partitioned**: scales out and spreads spikes; data-layer claims keep it correct |
| Finding due runs | Poll a DB index | Fast in-memory tier | **Both**: durable DB is the truth, a sorted set / timing wheel serves the next few minutes |
| Future runs | Pre-create many | Keep only the next one | **Next one only**: cheap, and schedule edits are trivial |
| Dead-worker detection | Explicit "I'm leaving" | Leases + heartbeats | **Leases**: crashes never say goodbye; fencing tokens stop zombies |
| Retry timing | Fixed interval | Exponential backoff + jitter | **Backoff + jitter**: avoids hammering a sick dependency in lockstep |
| Missed runs | Always backfill | Per-job policy | **Per-job**: billing needs backfill, reminders need skip |
| Fairness | One FIFO queue | Per-tenant queues + quotas | **Per-tenant**: a shared platform must survive its noisiest user |

## Cheat sheet for last-minute revision

- **Job vs run:** a job is the template (what + when); a run is one occurrence with its own state. Keep only the
  **next** run of a recurring job; create the following one when it is dispatched.
- **Split "when" from "how":** schedulers find due runs and enqueue them; workers execute; a queue sits between.
- **Finding due runs:** index by `(partition, time_bucket)`, or `next_run_at` with `SKIP LOCKED`. At scale, a
  durable tier plus a fast tier (Redis sorted set, min-heap or timing wheel) for the next few minutes.
- **Many schedulers:** partition by `hash(job_id)`; a coordinator (ZooKeeper / etcd) leases partitions to nodes.
  Leader election reduces duplicates; **conditional updates and unique `run_key`** guarantee correctness.
- **Execution:** at-least-once + idempotency (`run_key` as idempotency key) = effectively once.
- **Dead workers:** lease (30 s) + heartbeat (every 10 s, batched per worker) + reaper; **fencing tokens** reject
  zombie writes.
- **Failures:** retry only retryable errors; exponential backoff + jitter; `max_attempts`; then DLQ + alert.
- **DAGs:** reject cycles at creation, per-DAG-run dependency counters, propagate upstream failures.
- **Fairness:** priority queues with aging; per-tenant quotas, concurrency limits and round-robin dispatch.
- **Time:** store IANA zone + cron, compute in local time, store UTC; define DST rules; only the scheduler's (or
  store's) clock decides.
- **Outages:** per-job catch-up policy (run all / run once / skip), misfire threshold, overlap policy
  (allow / forbid / replace), throttled backfill.
- **Monitor** schedule lag, unclaimed due runs, queue age, lease expiries, DLQ size, and "did not run" alerts.
- **Numbers:** ~1.1B runs/day ≈ 13K/s average, midnight spikes of millions; ~390K runs in flight; ~550 GB of run
  history a day.

## Practice questions

1. **A team says their daily job "didn't run yesterday". How do you investigate?** Look up the run by
   `run_key`: was it created (was the job paused, or the schedule wrong in that time zone)? Was it claimed and
   enqueued (schedule lag, partition ownership at that time)? Did a worker pick it up, and what happened
   (lease expiry, error, DLQ)? Then add a "did not run" alert for that job.
2. **How would you let users cancel a run that is already running?** Mark the execution `cancelling`; the
   worker sees it on its next heartbeat reply and stops the job. If the worker is gone, the lease expires and the
   reaper sees `cancelling` and marks it `cancelled` instead of retrying.
3. **A user changes a job from `0 8 * * *` to `0 9 * * *` at 08:30. What happens to today's run?** In one
   transaction: bump the job's `version`, delete the future `scheduled` run (if it has not been claimed) and
   insert the newly computed next run (09:00 today). Runs already queued or running finish under the old
   definition.
4. **How would you support "run at most once per hour, but as soon as possible after an event"?** Debounce: on
   the event, insert a run with `run_key = job + hour`. The unique constraint makes every extra event in the same
   hour a no-op.
5. **Could you build this on Kafka alone?** Kafka has no per-message delay, so you would still need a store for
   future runs and a dispatcher. Kafka works well as the run queue; the "when" part needs an index sorted by time.
