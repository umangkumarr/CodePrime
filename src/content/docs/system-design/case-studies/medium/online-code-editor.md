---
title: "Design an Online Code Editor and Judge (like LeetCode / Replit)"
description: "Design a LeetCode-style judge: browser editor and drafts, a queue and worker pool, microVM sandboxes for untrusted code, verdicts, live results and contest spikes."
difficulty: "Medium"
sidebar:
  label: "Online code judge (like LeetCode)"
tags: ["Sandboxing", "Security", "Queues", "Autoscaling", "Real-time"]
---

You open a problem, write twenty lines of C++ in the browser, press **Submit**, and three seconds later a green
**Accepted** appears with "beats 87%". In those three seconds a stranger's program, which could do anything
at all, was compiled and run on our machines against dozens of hidden tests, measured to the millisecond and
the megabyte, and thrown away. An online judge is a **job queue** wrapped around a **security problem**: the
whole product is "run code you do not trust, quickly, fairly, and without it hurting anyone".

This case study builds that system from first principles. We start with what a judge actually does, design the
service around it, then spend most of our time where interviewers push hardest: **sandboxing**, judging,
contest-time spikes and fairness.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. A judge in 5 minutes: what happens when you press Submit

Every coding problem comes with a set of **test cases**: an input file and the expected output for each. A
small number are **samples** shown in the statement; most are **hidden**, so you cannot hard-code answers.
Judging a submission means:

1. **Compile** the code (C++, Java, Go, Rust) or just load it (Python, JavaScript).
2. **Run** it once per test case, feeding the test's input on standard input (stdin).
3. **Measure** each run: how much CPU time it used, how much memory at its peak, how it exited.
4. **Compare** its output with the expected output.
5. Report a **verdict**.

| Verdict | Short form | What it means |
| --- | --- | --- |
| **Accepted** | AC | Every test passed within the limits |
| **Wrong answer** | WA | The program finished, but its output was wrong on some test |
| **Time limit exceeded** | TLE | It ran longer than allowed (for example 2 seconds) |
| **Memory limit exceeded** | MLE | Its peak memory went over the limit (for example 256 MB) |
| **Runtime error** | RE | It crashed: segmentation fault, uncaught exception, non-zero exit code |
| **Compile error** | CE | The compiler rejected it; we show the compiler's message |

On LeetCode you write a **function**, not a whole program. The judge wraps your function in hidden **driver
code** (a `main` that reads the input, calls `twoSum(...)`, and prints the result), so the "program" that runs
is your code plus ours. Competitive programming sites (Codeforces, AtCoder) take whole programs instead. The
pipeline is the same either way.

There are two products under one name, and it helps to say so in an interview:

- **A judge** (LeetCode, HackerRank, Codeforces): short, batch runs. Code goes in, a verdict comes out, nothing
  survives. This is what we design.
- **A cloud IDE** (Replit, GitHub Codespaces): long-lived, interactive environments with a terminal, files that
  persist, packages, sometimes internet access and a web server. Section 13 covers what changes.

The single fact that shapes everything: **we execute arbitrary code written by anonymous people.** Some of them
will try to mine cryptocurrency on our servers, read the hidden expected outputs, attack other users, or break
out onto the host. Every design choice below is weighed against that.

## 2. Requirements

### Functional (what users can do)

- **Edit** code in the browser, in about 15 languages, with syntax highlighting.
- **Drafts:** code is saved automatically per problem and language, and is there when the user returns on
  another device.
- **Run** code on the sample tests or on a custom input ("Run"), and **Submit** it against all hidden tests.
- See a **verdict** live, with runtime, memory and, for a failure, the first failing test (sample tests show
  the input; hidden ones only say which test number).
- **Submission history** per problem.
- **Contests:** timed rounds where thousands of people submit at once, with a live leaderboard.
- **Plagiarism checks** after contests.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Security** | Untrusted code can never reach the host, the network, other users' code or the expected outputs | One escape compromises everything; one leak of test data ruins every contest |
| **Correctness and fairness** | The same code gets the same verdict every time; time measurements are stable to within ~10% | Users argue about TLE by 5 ms; contests must be fair |
| **Latency** | Verdict in 1–5 s for a typical submission; queue wait under 2 s even in a contest | It is an interactive loop; people resubmit a lot |
| **Availability** | 99.9% for submit, higher for the editor and drafts | Losing a draft hurts more than a slow verdict |
| **Elasticity** | Absorb 10–20× normal load when a big contest starts | Contest traffic is extremely spiky |
| **Durability** | Never lose an accepted submission or a draft | They are the user's work and the contest record |

### Out of scope

Problem authoring tools, discussion forums, the payments for premium plans, and the editorial videos. Mention
them, then set them aside.

## 3. Back-of-the-envelope estimates

The goal is to find **which resource dominates**. For a judge, it is CPU-seconds inside sandboxes.

**Assumptions:** 5 million daily active users, each doing **10** runs or submissions a day. A job uses one CPU
core for about **2 seconds** of wall time on average (compile plus all tests, sandbox start included). Peak
is **3×** the average. A big weekly contest has **30,000** participants.

**Execution load**

- Jobs per day: $5\text{M} \times 10 = 50\text{M}$, about **580 per second** on average and roughly
  **1,700 per second** at peak.
- Concurrent sandboxes needed (Little's law: in-flight = arrival rate × time each spends):
  $1{,}700 \times 2\text{ s} \approx 3{,}400$ running at once.
- If one 32-core host runs about 28 sandboxes (leaving cores for the worker and the host), that is
  $3{,}400 / 28 \approx 120$ hosts at peak, and fewer than half that at night.

**Contest spike**

- If 30,000 contestants each submit within the first 10 minutes of the easiest problem, that alone is
  $30{,}000 / 600 \approx 50$ per second on top of normal traffic, and the start of the round is far burstier
  than an even spread: "Run" on samples spikes in the first minutes, and the last five minutes see a
  second wave. Plan for a few hundred extra jobs per second, and for them all to arrive within seconds.

**Storage**

- Stored submissions (runs on custom input are not kept): say 20M a day at about 2 KB of code each, which is
  $20\text{M} \times 2\text{ KB} = 40\text{ GB}$ a day, roughly **15 TB a year**. Small.
- Test data: 3,000 problems × up to 50 MB of tests each is about **150 GB**. It fits on every worker's local
  SSD as a cache.
- Drafts: 5M users × a few problems × 2 KB is a few tens of GB, but they are written often (an autosave every
  few seconds while typing), so they need a store that handles many small writes.

Conclusions:

1. **Compute, not storage, is the cost.** Everything about sandbox start time and packing jobs onto hosts
   matters.
2. **Test data is small enough to cache locally**, so workers never fetch it across the network per job.
3. **The load is bursty**, so the design needs a queue to absorb bursts and a warm pool to absorb them fast.

## 4. The API

The browser talks to us over HTTPS with JSON. Live results come over a WebSocket.

| Method and path | What it does |
| --- | --- |
| `GET /v1/problems/{slug}` | Statement, limits, sample tests, starter code per language. |
| `PUT /v1/drafts/{problem}/{lang}` | Save the draft. Body: `code`, `version`. Returns `409 Conflict` if another tab saved a newer version. |
| `GET /v1/drafts/{problem}/{lang}` | Load the latest draft. |
| `POST /v1/runs` | Run on sample tests or a custom input. Body: `problem`, `lang`, `code`, optional `stdin`. Returns `202 Accepted` with a `run_id`. |
| `POST /v1/submissions` | Submit against all tests. Same body, plus an `Idempotency-Key` header. Returns `202` with a `submission_id`. |
| `GET /v1/submissions/{id}` | Status and verdict (the fallback for polling and for reconnects). |
| `WSS /v1/stream` | Subscribe to `submission:{id}`; the server pushes "compiling", "running test 7 of 40", and the verdict. |

Why `202 Accepted` and not wait for the verdict in the same request? Judging takes seconds and depends on a
queue. Holding an HTTP request open that long ties up a connection per user, breaks on flaky mobile networks,
and turns every slow worker into a timeout at the load balancer. Accept fast, judge in the background, push
the result.

The **idempotency key** is a random ID the browser generates once per click. If the network drops after the
server accepted the submission and the browser retries, the server sees the same key and returns the same
`submission_id` instead of judging twice and counting two attempts against a contest penalty.

## 5. High-level design

[![High-level architecture: the browser editor calls the API gateway, which saves drafts and passes submissions to the submission service; it records them and enqueues an id on the judge queue; judge workers pull jobs and run them in microVM sandboxes that read test inputs only; verdicts go to a result-events pub/sub, which saves them and fans out through a WebSocket gateway to the browser; an autoscaler sizes the workers on queue depth](/img/system-design/online-code-editor/01-architecture.png)](/img/system-design/online-code-editor/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Browser editor:** a code editor component (Monaco, the editor inside VS Code, or CodeMirror) with syntax
  highlighting and autosave.
- **API gateway:** checks who you are, applies rate limits, routes requests.
- **Draft service:** stores the latest draft per (user, problem, language). Cheap, frequent writes.
- **Submission service:** validates (language supported? code under 64 KB?), records the submission as
  `queued`, and puts its ID on the queue.
- **Judge queue** (for example Kafka, RabbitMQ or SQS, with separate lanes by priority): the shock absorber
  between bursty users and a fixed number of sandboxes.
- **Judge workers:** trusted programs on judge hosts. Each takes a job, prepares a sandbox, compiles, runs each
  test, compares outputs and decides the verdict.
- **Sandboxes:** where the untrusted code actually runs, one fresh sandbox per job.
- **Test data store:** object storage (S3 or similar) holding every test; workers cache it on local disk.
  **Only inputs** ever enter a sandbox; expected outputs stay with the worker.
- **Result events + WebSocket gateway:** carry "running test 7" and the final verdict to whichever gateway
  server holds the user's connection. The submission service consumes the same events to save the verdict.
- **Autoscaler:** adds or removes judge capacity based on queue depth and the contest calendar.

The key idea: **the web tier never runs user code, and the judge tier never talks to users.** The two meet only
through the queue and the result events. Judge hosts sit in their own network segment, can reach only the
queue, the test data store and the result bus, and hold no user credentials. If a sandbox were ever broken,
the attacker would land on a machine with very little to steal.

## 6. Flow: one submission from Submit to verdict

[![Sequence: the browser posts the submission with an idempotency key; the API inserts it as queued, enqueues it and replies 202; a worker receives it, compiles in a sandbox, runs each test with limits until one fails, gets back exit code, CPU time, peak memory and output, and publishes a verdict event to a durable log; the API saves the verdict and pushes it over WebSocket, and the worker finally acks the queue](/img/system-design/online-code-editor/02-submit.png)](/img/system-design/online-code-editor/02-submit.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The user gets an answer in tens of milliseconds** (step 4): "we have it, here is its ID". The verdict comes
  later by push.
- **Save before enqueue** (steps 2 then 3). If we enqueued first and the database write failed, a worker would
  judge a submission that does not exist. If we save and then crash before enqueueing, a sweeper that looks for
  submissions stuck in `queued` for more than a minute re-enqueues them.
- **Ack last** (step 12). The worker publishes the verdict to a **durable** result log (for example a Kafka
  topic) and only then acknowledges the queue message. If the worker dies halfway, the message becomes visible
  again and another worker judges it from scratch. Judging is **idempotent**: the same code on the same tests
  gives the same verdict, so doing it twice is harmless. The submission service consumes the result log and
  writes the verdict conditionally (`UPDATE ... WHERE id = s42 AND status <> 'judged'`), so a slow duplicate
  cannot overwrite a finished result.
- **Stop at the first failing test** (step 7). That is how LeetCode-style judges report results and it saves a
  lot of CPU on wrong answers. Contest systems that award partial points per test (like IOI-style scoring) run
  every test instead.
- **"Run" uses the same pipeline** with a lower-priority lane, the sample tests or the user's custom input, and
  no permanent record.

## 7. Deep dive: the sandbox

This is the heart of the interview. Start with **what the attacker wants**, because each defence answers a
specific threat.

| Threat | Example | Defence |
| --- | --- | --- |
| **Escape to the host** | Exploit a Linux kernel bug through an unusual system call | A separate kernel per job (microVM) or a user-space kernel; a tight system-call filter |
| **Steal test data** | Open the expected-output file and print it | Expected outputs never enter the sandbox; inputs arrive on stdin |
| **Use the network** | Mine crypto, attack other sites, fetch answers from a server | No network device at all |
| **Exhaust resources** | Fork bomb, allocate 50 GB, fill the disk, print forever | CPU, wall-clock, memory, process, file-size and output limits |
| **Attack the next user** | Leave a background process or a file behind | A fresh sandbox per job, destroyed afterwards |
| **Attack the compiler** | `#include "/dev/random"` hangs the compiler; `#include "/etc/passwd"` leaks a file into the error message | Compile **inside** the same sandbox, with its own time and memory limits |

### Isolation options, from weakest to strongest

Some vocabulary first. A **system call** (syscall) is how a program asks the operating system kernel to do
something: open a file, allocate memory, start a process. Linux has over 300 of them, and almost all
"escape" attacks work by sending the kernel an unusual syscall that triggers a bug. So the question is
always: **how much of the real host kernel can the untrusted code reach?**

| Option | How it isolates | Strength | Start-up cost |
| --- | --- | --- | --- |
| **Language-level sandbox** (a restricted Python, a JavaScript engine, WebAssembly) | The language runtime refuses dangerous operations | Weak on its own for native languages: one interpreter bug or forgotten module and it is gone. Not applicable to C++ at all | Milliseconds |
| **Process sandbox** (Linux namespaces, cgroups, `setrlimit` per-process limits, seccomp; for example the `isolate` tool used in programming olympiads) | A normal process with a private view of the system and a syscall filter | Good if the filter is tight, but the code still talks to the **shared host kernel** | Milliseconds |
| **Container** (Docker with default settings) | The same kernel features, packaged | The same as above; a container is not a security boundary by default | Hundreds of ms |
| **User-space kernel** (gVisor) | A kernel written in Go intercepts every syscall; only a small, filtered set reaches the host | Strong: the host kernel's attack surface shrinks a lot | Hundreds of ms; slower syscalls |
| **MicroVM** (Firecracker, Kata Containers) | A tiny virtual machine with **its own guest kernel**, using hardware virtualisation (KVM) | Strongest practical option: to escape, you must break the guest kernel **and** the virtual machine monitor | About 125 ms to boot; less with snapshots |

**Namespaces** give a process its own private view: its own process list (it is PID 1 and sees nothing else),
its own file system tree, its own (empty) network. **cgroups** (control groups) put hard caps on CPU, memory
and number of processes for a group of processes. **seccomp-bpf** is a filter, set once and impossible to
remove, that lists which syscalls a process may make; anything else kills it.

Our choice: **one Firecracker microVM per job, with process-level limits inside it as well.** This is defence
in depth: if one layer has a bug, the next still holds. Firecracker was built by AWS for exactly this problem
(running other people's code in Lambda and Fargate): it boots in about 125 ms, costs a few megabytes of memory
per VM, and deliberately emulates very few devices, which keeps its own attack surface small.

[![Inside one judge host: the trusted worker agent boots or restores a Firecracker VMM that runs inside a jailer with chroot, cgroups and seccomp; it sends the job over vsock to a runner inside the microVM, which runs as nobody and execs the user program with rlimits; the program reads a read-only language image, writes a size-capped scratch disk, and makes seccomp-filtered syscalls to its own guest kernel, which reaches the VMM only through virtio disk and vsock; the microVM has no network device](/img/system-design/online-code-editor/03-sandbox.png)](/img/system-design/online-code-editor/03-sandbox.png)

*Select the diagram to zoom in and move around.*

The layers in the picture, from outside in:

1. **The jailer** around the virtual machine monitor (VMM) itself: it runs in a `chroot` (it sees only its own
   directory), in its own namespaces and cgroup, as an unprivileged user, with a seccomp filter. Even if the
   guest broke into the VMM process, it would land in a cage.
2. **The microVM** has no network device configured, so there is no way to send a packet. The guest talks to the
   worker only through **vsock** (a simple host-to-guest socket) and a couple of virtual disks.
3. **The file system:** the language image (compilers, runtimes, standard libraries) is mounted **read-only**.
   The only writable place is a small scratch disk for the compiled binary and temporary files, with a hard
   size cap. Nothing written there survives the job.
4. **The runner** inside the guest drops to an unprivileged user (`nobody`), sets `no_new_privs` (so no
   set-user-ID program can raise its privileges), installs a seccomp allow-list of the syscalls a normal
   program needs, sets resource limits, and only then starts the user's program.

### The limits, precisely

| Limit | How it is enforced | Verdict when hit |
| --- | --- | --- |
| **CPU time** (for example 2 s) | `RLIMIT_CPU` and the cgroup's CPU accounting | TLE |
| **Wall-clock time** (for example 3× the CPU limit) | A watchdog in the runner kills the process group. Needed because a program that calls `sleep` or blocks on input uses no CPU | TLE |
| **Memory** (for example 256 MB) | cgroup `memory.max`; the peak is read from the cgroup afterwards | MLE |
| **Processes and threads** (for example 64) | cgroup `pids.max`; this is what stops a fork bomb | RE |
| **Output size** (for example 64 MB) | The runner stops reading the pipe and kills the process; `RLIMIT_FSIZE` caps files | Output limit exceeded (or RE) |
| **Open files, stack size** | `RLIMIT_NOFILE`, `RLIMIT_STACK` | RE |
| **Compile step** | The same limits with a longer timeout (for example 10 s CPU) | CE |

Two subtleties interviewers like:

- **CPU time vs wall time.** We judge on CPU time because it does not depend on how busy the host is, which
  keeps verdicts fair. The wall-clock limit is only a safety net. To keep CPU time stable we also pin each
  sandbox to dedicated cores and do not overcommit the host.
- **Memory for managed languages.** The Java virtual machine and Python reserve memory up front. Judges usually
  tune the runtime (for example the JVM's maximum heap) and measure resident memory, not reserved address
  space, so a Java "Hello world" is not an MLE. Many judges also give slower languages a time multiplier.

### Why fresh, and how to make fresh fast

Each job gets a **brand-new** sandbox that is destroyed afterwards. Reusing one would let a submission leave a
background process or file behind to spy on the next user. Booting fresh costs time, so judges keep a
**warm pool** (section 10) and can **restore from a snapshot**: boot one VM per language, start the runtime,
pause it, save its memory, then start new VMs from that saved image. Restoring is much faster than booting.
One caution from Firecracker's own documentation: VMs restored from the same snapshot start with identical
memory, including random-number state, so anything secret-dependent must be re-seeded after restore.

## 8. Deep dive: judging and verdicts

The worker drives the sandbox and turns raw measurements into a verdict. The **order of checks** matters: a
program killed for using too much time also "exited abnormally", and we want to call that TLE, not RE.

[![Verdict decision flow: if the code does not compile within 10 s, Compile error; otherwise run test i and check in order within time, within memory, exited cleanly, output correct; a failing check stops with Time limit exceeded, Memory limit exceeded, Runtime error or Wrong answer; if all pass and more tests remain, run the next test, otherwise Accepted](/img/system-design/online-code-editor/04-verdict.png)](/img/system-design/online-code-editor/04-verdict.png)

*Select the diagram to zoom in and move around.*

**Comparing output.** The simplest **checker** compares the program's output with the expected output token
by token, ignoring trailing spaces and the final newline, so `"1 2\n"` and `"1 2"` both pass. Some problems
need a **special checker**: floating-point answers accepted within $10^{-6}$, "return any valid path", or
"print the answers in any order". A special checker is a small program written by the problem setter that reads
the input, the expected answer and the user's output, and says yes or no. It is trusted more than user code,
but it still runs with limits, because a checker bug should not hang a worker.

**The reported runtime** is the maximum (or sum, depending on the site) of the CPU times across tests. The
"beats 87%" figure is the percentile of that runtime among accepted submissions in the same language,
computed from a histogram per problem and language that a background job refreshes.

**Test data integrity.** Each problem has a `test_set_version`. A worker caches tests on local disk keyed by
`(problem, version)` and checks a hash before using them, so a half-downloaded file can never produce a wrong
verdict. When a problem setter fixes a test, the version bumps and **rejudge** jobs re-run affected
submissions.

### States of a submission

[![Submission states: Queued, then Compiling when a worker pulls it, then Running once the binary is ready, then Judged with AC, WA, TLE, MLE or RE; Compiling can end in Compile error; a lost lease while running moves to System error, which retries back to Queued without counting, or becomes Judge failed after three attempts; an admin rejudge moves Judged back to Queued](/img/system-design/online-code-editor/05-states.png)](/img/system-design/online-code-editor/05-states.png)

*Select the diagram to zoom in and move around.*

Keep **user failures** (CE, WA, TLE, MLE, RE) separate from **system failures** (a worker crashed, a host ran out
of disk, a VM failed to boot). A system failure must never be shown as the user's runtime error or counted as a
wrong attempt in a contest. The worker holds a **lease** on the job (a timeout it keeps extending while it
works); if the lease expires, the job is retried on another host, and after three failed attempts it is marked
"Judge failed" and an engineer is alerted.

## 9. Deep dive: streaming results back

The browser needs to learn the verdict without the user refreshing. Three options:

| Option | How it works | Good | Bad |
| --- | --- | --- | --- |
| **Short polling** | `GET /submissions/{id}` every second | Trivial, works everywhere, stateless servers | Wasted requests; up to 1 s extra delay; a contest start multiplies the load |
| **Server-Sent Events** (SSE) | One long HTTP response the server writes events into | Simple, one-way is all we need, auto-reconnects | One open connection per user |
| **WebSocket** | A persistent two-way connection | Lowest delay; the same connection can carry collaborative editing later | Stateful gateway servers; needs reconnection logic |

A typical design uses **WebSocket (or SSE) with polling as the fallback**, and treats the push as a
convenience, not the source of truth. The flow is:

1. After `202 Accepted`, the browser subscribes to `submission:{id}` on its WebSocket.
2. The worker publishes events ("compiling", "running test 7 of 40", the verdict) to the result bus (for example
   Redis pub/sub or Kafka).
3. Each WebSocket gateway server subscribes for the submissions its connected users care about and forwards the
   events.
4. If the connection drops, or the verdict arrived before the subscription did, the browser calls
   `GET /submissions/{id}`. The database always has the final answer.

Because judging usually takes only a few seconds, a pragmatic small site can ship with polling (with back-off:
every 500 ms, then 1 s, then 2 s) and add push later.

## 10. Deep dive: contest spikes, autoscaling and warm pools

A contest starts at 14:30:00 sharp. At 14:30:05 thousands of people press "Run" on the samples of problem A.
Two tools handle this together:

- **The queue** absorbs the burst, so nothing is rejected; jobs simply wait.
- **Capacity** must catch up fast enough that the wait stays short.

Normal autoscaling (watch CPU, add a machine, wait a few minutes for it to boot) is too slow for a spike that
arrives in seconds. So we combine three ideas:

1. **Scale on queue depth, not CPU.** The signal that users feel is "how long will my job wait". The autoscaler
   targets a backlog of under about 2 seconds of work: if 1,000 jobs are queued and each takes 2 s on one core,
   we need about 1,000 more cores to clear them in 2 s.
2. **Pre-scale from the calendar.** Contests are scheduled. The autoscaler reads the contest calendar and
   brings extra hosts online about 15 minutes before the start, sized from past contests of that size. This is
   the cheapest win in the whole design.
3. **Keep a warm pool of sandboxes.** On each host, a few microVMs per popular language are already booted (or
   ready to restore from a snapshot), so a job starts in milliseconds instead of paying the boot cost.
   Rare languages get a smaller pool and accept a slightly slower start.

**Load shedding** is the last line of defence. If the backlog grows anyway, protect what matters most: contest
submissions first, practice submissions next, and "Run" on custom input last. Practice users may see "judging
is busy, your submission is queued" for a minute; contest users should not.

## 11. Deep dive: fairness and per-user limits

A shared queue invites abuse: one user with a script could submit 10,000 times and make everyone else wait.

[![Fairness and scaling: the submission API passes each job through a per-user limiter (token bucket plus one job in flight) into a contest lane, a submit lane or a run lane; a fair dispatcher takes from them with weights 5, 3 and 2 and hands each job a VM from the warm microVM pool; an autoscaler adds or drains VMs, pre-warmed 15 minutes early from the contest calendar](/img/system-design/online-code-editor/06-scheduling.png)](/img/system-design/online-code-editor/06-scheduling.png)

*Select the diagram to zoom in and move around.*

- **Per-user rate limit** with a **token bucket**: each user's bucket holds, say, 10 tokens and refills one every
  6 seconds; each run or submit spends one. Bursts are allowed, sustained flooding is not.
- **At most one or two jobs in flight per user.** A user's second submission waits until the first finishes.
  This alone makes the queue fair, because no single user can occupy more than a slot or two.
- **Separate lanes** for contest, practice submit and run. The dispatcher uses **weighted round robin**: out of
  every 10 jobs it takes 5 from the contest lane, 3 from submit and 2 from run, when they have work. Weights
  (not strict priority) ensure the run lane still moves during a contest instead of starving.
- **Paid tiers** can get a bigger bucket or their own lane, but never a different time limit: verdicts must not
  depend on what you pay.
- **Abuse detection:** accounts whose code repeatedly hits the sandbox's seccomp filter, or tries to open
  network sockets, are flagged and throttled.

## 12. Data model and storage

[![Data model: users edit drafts keyed by user, problem and language; problems have test cases and limits; users submit submissions judged against problems, with status, verdict, runtime and memory; each submission has per-test test_results](/img/system-design/online-code-editor/07-data-model.png)](/img/system-design/online-code-editor/07-data-model.png)

*Select the diagram to zoom in and move around.*

Decisions hiding in this diagram:

- **Drafts are keyed by `(user_id, problem_id, language)`**, so switching from Python to C++ does not lose either
  draft. The `version` column gives **optimistic concurrency**: a save carries the version it was based on, and
  if another tab already saved a newer one, the server answers `409` and the editor offers to reload. The
  browser also keeps a copy in local storage, so an offline laptop or a crash never loses typing. Saves are
  **debounced**: sent a second or two after the user stops typing, not on every keystroke. A key-value store
  (DynamoDB, Cassandra, Redis with persistence) suits this write-heavy, single-key access pattern.
- **Submissions are append-only** and almost always read by user ("my submissions for this problem") or by
  contest (the leaderboard and plagiarism jobs). Shard by `user_id`; keep a secondary index by
  `(contest_id, problem_id)`. A relational database (sharded PostgreSQL or MySQL) is a good fit: rows are small
  and the status update is transactional.
- **Code lives in object storage** behind `code_key`, keeping database rows small and letting batch jobs
  (plagiarism, analytics) read code without touching the live database.
- **Test inputs and expected outputs are objects**, referenced by key and versioned through
  `test_set_version`. They are never served to the browser except the samples.
- **`idempotency_key` is unique**, which is what makes a retried submit return the original row.
- **Contest leaderboards** are a sorted set in Redis (score = solved count, then penalty time), updated from
  verdict events and rebuilt from the submissions table if lost.

## 13. Extensions: collaborative editing, cloud IDEs and plagiarism

### Real-time collaborative editing

Pair-programming interviews (and Replit's multiplayer mode) let two people type in the same file. The hard
part is merging concurrent edits so both screens end up identical. The two standard techniques are
**operational transformation** (OT: a server rewrites each edit against the edits it missed) and **CRDTs**
(conflict-free replicated data types: each character gets a unique, ordered ID, so edits merge in any order).
Both are covered in depth in the [Google Docs case study](/system-design/case-studies/hard/google-docs/).
For a code editor the extra pieces are small: the same WebSocket carries edits and cursor positions, a
document service keeps the authoritative copy and a log of operations, and "Run" sends a snapshot of the
document at a version number so everyone sees which code was judged.

### From a judge to a cloud IDE (Replit-style)

A cloud IDE keeps a **long-lived** sandbox per project: files persist on a volume, a terminal streams over a
WebSocket, and the user may install packages or start a web server. That changes the design:

- Sandboxes live for minutes or hours, so the scheduler places **sessions**, not jobs, and suspends idle ones
  (snapshot the VM, release the host) to bring them back on the next keystroke.
- Projects need persistent storage, mounted when the session starts.
- Network access is usually **allowed but filtered**: outbound only, through an egress proxy with rate limits,
  blocked internal address ranges and abuse detection (crypto mining is the classic problem).
- Isolation must be at least as strong as the judge's, because sessions last longer and have more access.

### Plagiarism checks

After a contest, organisers want to know who copied whom. Comparing raw text fails as soon as someone renames
variables, so detectors compare **structure**.

[![Plagiarism pipeline: accepted code for one contest problem is tokenised to drop names and comments, turned into k-gram hashes with winnowing, stored in a fingerprint index from hash to submissions; pairs sharing many hashes become candidates, with public templates and editorials allow-listed, and flagged pairs go to human review with a side-by-side diff](/img/system-design/online-code-editor/08-plagiarism.png)](/img/system-design/online-code-editor/08-plagiarism.png)

*Select the diagram to zoom in and move around.*

1. **Normalise:** turn code into a stream of tokens, replacing every identifier with a placeholder and dropping
   comments and whitespace. `int total = a + b;` and `int s = x + y;` become the same tokens.
2. **Fingerprint:** hash every run of $k$ consecutive tokens (a **k-gram**) and keep a representative subset
   with **winnowing** (the minimum hash in each sliding window). This is the idea behind the well-known MOSS
   tool.
3. **Match:** an inverted index from hash to submissions finds pairs that share an unusually large fraction of
   fingerprints, without comparing every pair (which would be $O(n^2)$ for $n$ submissions).
4. **Decide:** code from public templates and editorials is allow-listed, and flagged pairs go to a **human**
   with a side-by-side diff. Automated systems produce suspicions, not verdicts: short problems have only a
   few sensible solutions, and false accusations are costly.

## 14. Reliability: what goes wrong and how we survive it

| Risk | Defence |
| --- | --- |
| A worker or host dies mid-judge | The queue redelivers after the lease expires; judging is idempotent; the verdict write is conditional |
| A sandbox escape is discovered | Defence in depth limits the damage; judge hosts are disposable and rebuilt often from a known image; they hold no secrets and sit in an isolated network |
| A bad compiler image or test file | Images and test sets are versioned and checksummed; roll out new images to a small share of workers first and compare verdicts on known submissions |
| Noisy neighbours make timings unstable | Dedicated cores per sandbox, no CPU overcommit on judge hosts, and judging on CPU time |
| The queue backs up during a contest | Pre-scaling from the calendar, warm pools, weighted lanes and load shedding of the run lane |
| The result push is lost | The database is the source of truth; the client falls back to `GET /submissions/{id}` |
| A region fails | The web tier and databases fail over; queued jobs are replayed from the replicated queue; drafts survive in local storage |

A **canary set** of reference submissions (known AC, WA, TLE and MLE solutions for a few problems) is re-judged
every few minutes on every worker pool. If a worker suddenly reports a different verdict for a known solution,
it is taken out of rotation before it judges real users.

## 15. What breaks as it grows, and how to fix it

**The contest start.** A huge burst in a few seconds. *Fix:* calendar-driven pre-scaling, warm pools, separate
lanes, and shedding custom runs first.

**Slow sandbox start.** If start-up takes 1 s and the program runs for 50 ms, most of the cost is overhead.
*Fix:* snapshot restore, warm pools per language, and running all tests of one job in the same VM (still one VM
per job, never shared across users).

**Heavy test sets.** Some problems have hundreds of large tests. *Fix:* local SSD caches on workers keyed by
test-set version, and stopping at the first failure.

**Timing drift.** As the fleet mixes hardware generations, the same code runs at different speeds and verdicts
flip. *Fix:* pin a problem's judging to one hardware class, or calibrate limits per class with reference
solutions.

**Rejudge storms.** Fixing one test can require re-running 2 million old submissions. *Fix:* rejudge in a
separate, lowest-priority lane, and only for submissions whose verdict could change (for example, only the
accepted ones when a test was added).

**Language sprawl.** Every new language is a new image, a new seccomp profile and new limits to tune. *Fix:* one
build pipeline per language image, versioned, with the canary set run against each new version.

## 16. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Return the verdict | In the same request | `202` + push | **`202` + push**: judging takes seconds and depends on a queue |
| Isolation | Containers or a process sandbox | MicroVM (or gVisor) | **MicroVM + process limits inside**: a separate kernel per job, defence in depth |
| Sandbox reuse | Reuse a warm sandbox across jobs | Fresh per job | **Fresh per job** from a warm pool or snapshot: no state leaks between users |
| Timing | Wall-clock time | CPU time | **CPU time** for the verdict, wall-clock as a safety net: fairer under load |
| Test data | Mount everything | Inputs only | **Inputs only**; expected outputs stay with the trusted worker |
| Results | Polling | WebSocket / SSE | **Push with polling fallback**; the database is the truth |
| Scaling | Reactive on CPU | Queue depth + calendar + warm pool | **Queue depth + calendar**: contest spikes are predictable and arrive in seconds |
| Scheduling | One FIFO queue | Lanes + per-user limits | **Lanes with weights and one job in flight per user**: fair and no starvation |

## Cheat sheet for last-minute revision

- **What it is:** a job queue around a security problem. Accept fast (`202`), judge in the background, push the
  verdict.
- **Pipeline:** editor → API → save as `queued` → queue → worker → fresh sandbox → compile → run each test →
  compare → verdict → DB + push.
- **Verdicts:** AC, WA, TLE, MLE, RE, CE. Check in the order time, memory, exit status, output. System errors are
  retried and never blamed on the user.
- **Sandbox (defence in depth):** Firecracker microVM per job (own guest kernel, KVM), VMM in a jailer (chroot,
  cgroups, seccomp), no network device, read-only image, size-capped scratch disk, runner as `nobody` with
  `no_new_privs`, seccomp allow-list, compile inside the sandbox too.
- **Limits:** CPU time, wall clock, memory (cgroup), processes (`pids.max`, stops fork bombs), output size,
  file size, open files.
- **Never** put expected outputs in the sandbox; never reuse a sandbox across users; never rely on a
  language-level sandbox alone.
- **Reliability:** save before enqueue, ack after the verdict is in a durable log, idempotent judging, leases, conditional writes,
  canary submissions.
- **Spikes:** scale on queue depth, pre-scale from the contest calendar, warm pools and snapshots, shed the
  run lane first.
- **Fairness:** token bucket per user, one or two jobs in flight, weighted lanes (contest > submit > run).
- **Numbers:** 50M jobs a day, ~1,700/s peak, ~2 core-seconds each, ~3,400 concurrent sandboxes, ~120 hosts;
  submissions ~15 TB a year; all test data ~150 GB, cached on each worker.
- **Extensions:** collaborative editing with OT or CRDTs over the same WebSocket; plagiarism via tokenise →
  k-gram hashes → winnowing → index → human review.

## Practice questions

1. **A user's C++ solution got TLE but runs in 0.3 s on their laptop. How do you investigate?** Check the CPU
   time actually measured versus the wall time (was the host overloaded, was the job waiting on input?), compare
   with the problem's reference solution on the same worker class, and check whether the user's compiler flags
   or input size differ from the judge's. Re-run it on a canary worker.
2. **Why not run user code in the browser with WebAssembly and skip the servers?** It is fine for "Run" on
   samples as a convenience, but never for judging: the client controls its own browser, so it could fake any
   verdict, and the hidden tests would have to be sent to it.
3. **How do you support interactive problems, where the program talks to a judge program turn by turn?** Run the
   problem's interactor as a second process (in its own sandbox) and connect the two with pipes, user stdout
   to interactor stdin and back. The interactor decides the verdict; the time limit applies to the user's
   process.
4. **A contest has 100,000 participants instead of 30,000. What changes?** Pre-scale larger from the calendar,
   raise warm-pool sizes, consider staggered access to problems, cache the problem statement on a CDN, make
   the leaderboard update in batches every few seconds instead of per verdict, and shed custom runs earlier.
5. **How would you let users run code that needs the internet, like a web scraper?** Not in the judge. In a
   cloud IDE session, give outbound-only access through an egress proxy with an allow-list or rate limits,
   block internal address ranges (including the cloud metadata endpoint), and watch for abuse.
