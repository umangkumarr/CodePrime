---
title: "Design a Code Deployment System (CI/CD at scale)"
description: "Design CI/CD from commit to production: webhooks, hermetic cached builds, immutable artefacts, a pipeline DAG with gates, canary rollouts and automatic rollback."
difficulty: "Hard"
sidebar:
  label: "Code deployment (CI/CD)"
tags: ["CI/CD", "Build systems", "Distributed systems", "Reliability", "Rollouts"]
---

Every change an engineer makes has to travel from their laptop to thousands of servers that real users depend
on. A code deployment system is the **road** that change travels on. It must be fast, because engineers wait on
it all day. It must be safe, because a bad change can take the whole product down in seconds. And it must be
boring, because when it misbehaves, nobody can ship the fix.

Think of it as a **car factory with a test track**. Raw parts (source code) arrive, the factory assembles a car
(the build), inspectors check it (tests), the car gets a serial number and goes into a warehouse (the artefact
store), and only then is it driven onto public roads, first on a quiet street (a canary), then everywhere. If it
misbehaves, it is towed back and the previous model takes its place (rollback).

This case study designs that system for a large company: thousands of engineers, thousands of services and tens
of thousands of hosts in several regions.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. CI/CD in 5 minutes: the vocabulary

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **CI** (continuous integration) | Every change is merged often and automatically built and tested | Checking each part as it arrives at the factory |
| **CD** (continuous delivery / deployment) | Every green build *can* go to production (delivery), or *does* go automatically (deployment) | Cars leave the factory as soon as they pass inspection |
| **Pipeline** | The ordered stages a change goes through: build, test, deploy to staging, deploy to production | The assembly line |
| **Artefact** | The packaged output of a build: a container image, a binary, a tarball | The finished car with a serial number |
| **Environment** | A place the software runs: dev, staging, production (often per region) | Test track vs public roads |
| **Rollout** | Moving hosts or traffic from the old version to the new one | Swapping a fleet of taxis to a new model |
| **Rollback** | Returning to the last version that was known to be good | Recalling the new model |
| **Hermetic build** | A build that depends only on declared, pinned inputs, never on what happens to be installed on the machine | A recipe that lists exact brands and weights |
| **Desired state** | A record of what *should* be running ("service web, version 42, on these hosts") | The timetable the station manager follows |

The journey of one change, in words:

1. An engineer merges a pull request. The **Git host** fires a **webhook** (an HTTP call saying "something
   happened") to our pipeline engine.
2. The **build** compiles the code and runs the tests, reusing everything it can from a cache.
3. The result is pushed to the **artefact store** as an immutable, uniquely identified package.
4. The **release pipeline** deploys that same artefact to staging, checks it, then to a small slice of
   production, checks again, then everywhere, region by region.
5. On every host, an **agent** notices the new desired version, downloads the artefact, restarts the app and
   reports whether it is healthy. If health drops, the system **rolls back** automatically.

Two facts from this journey shape the whole design:

1. **Build once, deploy many times.** The bytes tested in staging must be exactly the bytes that run in
   production. So we never rebuild per environment: we promote the same artefact, identified by its hash.
2. **The deploy system is the most dangerous system in the company.** It can change every server at once.
   Most of the design is about limiting the **blast radius** (how much breaks when something goes wrong).

## 2. Requirements

### Functional (what users can do)

- **Trigger** pipelines automatically on push, pull request and merge (webhooks), on a schedule, or by hand.
- **Build and test** every change, with results reported back on the pull request.
- **Store artefacts** with metadata: which commit, which build, which tests passed, who approved.
- **Define release pipelines** as a graph of stages with **promotion gates** (automatic checks or human
  approvals) between environments.
- **Deploy** a chosen artefact to thousands of hosts across regions, with a chosen **strategy**: rolling,
  blue-green or canary.
- **Watch health** during a rollout and **roll back automatically** when it degrades; one-click manual rollback.
- **Locks and freezes**: one deployment per service and environment at a time; company-wide freeze windows.
- **Secrets and configuration** delivered to the app at deploy time, never baked into the artefact.
- **Audit trail**: who deployed what, where, when and why, kept for years.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Safety** | A bad release reaches at most a few per cent of users before it is stopped | The blast radius is the main risk |
| **Speed** | Commit to green build in under 15 minutes; a full production rollout in under an hour | Slow pipelines make engineers batch changes, and big batches are riskier |
| **Availability** | 99.9% for the deploy system, and above all able to **roll back** during an outage | The fix for an incident ships through this system |
| **Scale** | ~5,000 engineers, ~2,000 services, ~50,000 hosts in 6 regions | A typical large tech company |
| **Reproducibility** | The same commit always builds the same artefact | Otherwise a tested build means nothing |
| **Consistency** | Every host eventually runs the desired version, even if it was down during the rollout | No forgotten servers on old code |
| **Security** | Only reviewed code from the main branch reaches production; secrets reach only the services allowed to use them, never code, images or logs | A deploy pipeline is a prime target for attackers |

### Out of scope

Code review tooling, the Git server itself, the container orchestrator's scheduler internals, and database
schema migrations (we touch them only in the practice questions). Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** 5,000 engineers each merge **3** changes a day, and each merge was preceded by about **2**
pull-request builds. A build without any cache would take **200 CPU-minutes**; with a good cache, **90%** of
the work is reused. A service image is **1 GB**, but only **50 MB** of new layers change per build on average.
2,000 services deploy **twice** a day. The largest service runs on **10,000** hosts.

**Builds**

- Builds per day: $5{,}000 \times 3 \times (1 + 2) = 45{,}000$, about **1,900 per hour** on average and about
  **5,600 per hour** in the busy afternoon peak (3× average).
- CPU with caching: $45{,}000 \times 20 \text{ CPU-min} = 900{,}000$ CPU-minutes a day, about **625 cores busy**
  on average and ~2,000 at peak. Without the cache it would be 10× that: **caching is the difference between a
  small and a huge build farm.**

**Artefacts**

- New bytes per day: $45{,}000 \times 50\text{ MB} \approx 2.25\text{ TB}$ (layers that did not change are
  stored once, see section 8). Keep release artefacts for a year and pull-request artefacts for 30 days:
  a few hundred TB, easily handled by object storage.

**Deployments**

- $2{,}000 \times 2 = 4{,}000$ deployments a day, about **3 a minute**. Each deployment has a few hundred
  state changes, so the control plane handles only **tens of writes per second**. It is small.
- Agents: 50,000 hosts checking for work every 30 s is $50{,}000 / 30 \approx 1{,}700$ requests per second,
  cheap if each check is a "nothing changed" answer.

**The hard part: moving bytes.** In the worst case (a base-image change, or fresh hosts with nothing cached),
rolling the largest service means copying $10{,}000 \times 1\text{ GB} = 10\text{ TB}$. From one origin with a 10 Gbit/s link (1.25 GB/s) that takes $10{,}000 \text{ GB} / 1.25
\text{ GB/s} = 8{,}000\text{ s}$, over **2 hours**, and the origin is saturated for everyone else. Section 15
fixes this with peer-to-peer distribution.

Three conclusions follow:

1. **The control plane is small; the data plane is big.** Decisions are cheap; builds and byte copying are not.
2. **Caching and deduplication dominate build cost.** Design the build system around them.
3. **Fan-out of artefacts must not depend on one server.** It needs regional caches and peer-to-peer sharing.

## 4. The API

Engineers use a web UI and a CLI; the Git host and the host agents call the API too. All of it is HTTPS with
JSON, and every caller is authenticated.

| Method and path | Who calls it | What it does |
| --- | --- | --- |
| `POST /v1/webhooks/git` | Git host | A push, pull request or merge happened. Signed with a shared secret (HMAC) so we can reject forgeries. |
| `POST /v1/pipelines/{id}/runs` | Engineer | Start a run by hand for a commit. |
| `GET /v1/runs/{run_id}` | Engineer, UI | Status of every stage, logs, test results. |
| `GET /v1/artefacts/{digest}` | Anyone | Metadata of an artefact: commit, build, SBOM, signatures, where it is deployed. |
| `POST /v1/deployments` | Pipeline, engineer | Body: service, artefact digest, environment, strategy. `Idempotency-Key` header so a retry does not start a second rollout. |
| `POST /v1/deployments/{id}/pause`, `/resume`, `/rollback` | Engineer, controller | Control a running deployment. |
| `POST /v1/freezes` | Release managers | Block deployments for a scope (service, region, company) and a time window. |
| `GET /v1/agents/{host}/desired?version=<n>&wait=30s` | Host agent | **Long poll**: answer at once if the desired state is newer than `n`, otherwise hold the request up to 30 s. |
| `POST /v1/agents/{host}/status` | Host agent | Report the version actually running and its health. |

Why does the agent **ask** (`GET desired`) rather than wait to be told? Because of the **pull model**, which
section 10 explains. A long poll reacts almost instantly yet costs no more than a 30-second poll: an idle agent
makes just two requests a minute (the ~1,700 per second from section 3), and almost all of them end in a cheap
"nothing changed".

## 5. High-level design

[![High-level architecture: a developer pushes to the Git host, which sends a webhook to the pipeline engine; the engine runs jobs on the build farm, which reuses a remote build cache and publishes to the artefact store; the engine promotes releases to the deploy controller, which records to an audit log and sets the target in the desired-state store; hosts and agents watch it, pull artefacts peer-to-peer, get secrets injected and flag values, and report to metrics, which feed a health verdict back to the controller](/img/system-design/code-deployment/01-architecture.png)](/img/system-design/code-deployment/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Git host:** stores the code and sends webhooks on every push, pull request and merge.
- **Pipeline engine:** turns events into pipeline runs, and walks each run's graph of stages, starting a stage
  when all the stages it depends on have succeeded.
- **Build farm:** a pool of workers that build and test in sandboxes. **Remote build cache:** remembers the
  output of every build step by the hash of its inputs.
- **Artefact store:** immutable packages addressed by their content hash, plus a metadata database.
- **Deploy controller:** runs rollouts: takes the lock, moves waves of hosts forward, watches health, rolls back.
- **Desired-state store:** a small, strongly consistent database (etcd, ZooKeeper or a replicated SQL table)
  saying which version each group of hosts should run.
- **Hosts + agents:** a small daemon on every host makes the host match the desired state.
- **Metrics + health:** the monitoring system the controller reads to decide "healthy or not".
- **Secrets + config** and **feature flags:** values the app needs at run time, delivered separately from code.
- **Audit log:** append-only record of every action.

The single most useful idea in this design: **separate deciding from doing.** The controller only writes
*what should be true* into the desired-state store. The agents, independently, make it true. The controller
never needs a live connection to 50,000 hosts, and a host that was offline simply catches up when it returns.

## 6. Flow 1: from commit to artefact

An engineer merges a change to `main`. Here is what happens until there is a tested artefact.

[![Sequence from commit to artefact: the Git host sends a signed webhook, the pipeline engine accepts it and queues a run; build workers look up 9,000 action hashes in the build cache, get 8,700 hits, store 300 new outputs and run tests in 40 shards; they push an immutable image to the artefact store and report green with the digest; the engine sets the commit status to passed](/img/system-design/code-deployment/02-commit-to-artefact.png)](/img/system-design/code-deployment/02-commit-to-artefact.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Answer the webhook fast, work later.** The engine checks the signature, writes the event durably, replies
  `202 Accepted` and queues the work. Git hosts time out slow webhook receivers and may retry, so the engine
  **deduplicates by delivery ID** to avoid building the same push twice.
- **Webhooks get lost.** Networks fail and the Git host may give up. So the engine also runs a slow
  **reconciliation poll**: every few minutes it lists recent commits on watched branches and starts runs for any
  it has never seen. Webhooks give speed; polling gives correctness. You will see this "push for speed, poll
  for safety" pattern again in the agents.
- **Workers pull jobs from a queue.** Busy workers never get more work pushed onto them, and the farm scales
  by adding workers based on queue length.
- **Most of the build is a cache lookup.** 8,700 of 9,000 steps were already built by someone, somewhere.
- **The artefact is identified by its digest** (`sha256:9f2c...`), not by a name like `latest`. From here on,
  every stage talks about that exact digest.
- **Merge queues** are a common addition for busy repositories: instead of testing each pull request against an
  old `main`, a queue tests it against `main` plus the changes ahead of it, so `main` stays green.

## 7. Deep dive: the build system

[![Inside a hermetic build: source, pinned dependencies and a pinned toolchain are hashed into an action key; a hit in the remote cache reuses the output, a miss runs the step in a sandbox without network and saves the output; the test binaries run in 40 shards in parallel, and all passing shards produce the artefact with an SBOM and provenance](/img/system-design/code-deployment/03-build.png)](/img/system-design/code-deployment/03-build.png)

*Select the diagram to zoom in and move around.*

### Hermetic builds: the same inputs give the same output

A build is **hermetic** when its result depends only on inputs it declares. In practice that means:

- **Pinned dependencies.** A lockfile lists the exact version and checksum of every library. `requests>=2`
  is not allowed; `requests==2.31.0` with its hash is.
- **A pinned toolchain.** The compiler, linker and test runner come from a versioned image, not from whatever
  is installed on the worker.
- **A sandbox.** Each step sees only its declared inputs and has **no network access**, so it cannot quietly
  download something different tomorrow.
- **No hidden variation.** Timestamps, random file ordering and absolute paths are removed from outputs, so two
  builds of the same commit are byte-for-byte identical.

Why go to this trouble? Because it makes caching **safe**. If the output depends only on the inputs, then the
hash of the inputs is a perfect name for the output.

### Caching: never build the same thing twice

The build is split into many small **actions** ("compile `payment.go`", "link the server binary", "run the
tests in `cart_test`"). For each action:

```text
action_key = sha256(command line + hashes of every input file + toolchain digest + env vars)
if remote_cache has action_key:  download the outputs          # a hit
else:                            run in sandbox, upload outputs  # a miss
```

Because the cache is **remote and shared**, a step built by one engineer's pull request is reused by every
later build, by CI and by other engineers' laptops. Google's Bazel (the open-source form of its internal build
tool, Blaze) works this way, with **remote caching** and **remote execution** (running the actions on a shared
farm instead of the local machine).

Two kinds of cache work together:

| Cache | Keyed by | Saves |
| --- | --- | --- |
| **Dependency cache** | Lockfile hash | Downloading thousands of libraries on every build |
| **Action / output cache** | Hash of all inputs of one step | Recompiling and re-testing anything that did not change |

A change to one file invalidates only the actions that depend on it, directly or indirectly. Changing a
README rebuilds nothing; changing a base library rebuilds everything above it, which is correct.

### Parallel test sharding

A large service can have hours of tests. **Sharding** splits them across many machines:

- Split the test list into N **shards** (40 in the diagram). Each shard runs on its own worker at the same time.
- Balance by **past duration**, not by count: one slow integration test can be worth a hundred unit tests.
- Retry a failing test once on a fresh worker. If it then passes, mark it **flaky** and report it to its
  owners instead of blocking every engineer. Flaky tests are the main enemy of a fast pipeline.
- Test results are cached too: if a test target and all its inputs are unchanged, its last pass still holds.

Forty shards turn a 2-hour suite into about 3 minutes plus overhead. The cost is more machines for a short
time, which the shared farm absorbs.

## 8. Deep dive: artefacts and the data model

### Immutable and content-addressed

An artefact is stored under the **hash of its content** (its digest). This gives three guarantees for free:

1. **Immutability.** Changing one byte changes the digest, so "version 42" can never silently become something
   else. Tags like `v42` or `prod` are just labels that point at a digest.
2. **Integrity.** Any host can recompute the hash after download and reject a corrupted or tampered file.
3. **Deduplication.** Container images are made of **layers**. A layer that did not change (the OS, the language
   runtime) has the same digest and is stored and downloaded once.

Each artefact carries metadata: the commit, the build ID, the test results, an **SBOM** (software bill of
materials: the list of every library inside, so we can find everything affected by a new security
vulnerability) and a **signed provenance** record ("built by our CI, from this commit, with this recipe").
Production hosts can refuse any artefact without a valid signature from the CI system. Public frameworks such
as **SLSA** and tools such as **Sigstore** describe this practice.

### What we store

| Entity | Key fields | Notes |
| --- | --- | --- |
| `pipeline_run` | `run_id`, `pipeline_id`, `commit_sha`, `trigger`, `state` | One per trigger event; deduplicated by `(pipeline_id, commit_sha, trigger)` |
| `stage_run` | `run_id`, `stage_id`, `state`, `started_at`, `attempt` | The nodes of the DAG for this run |
| `artefact` | `digest` (PK), `service`, `commit_sha`, `build_id`, `sbom_ref`, `signature`, `created_at` | Bytes live in object storage; this row is the metadata |
| `release` | `release_id`, `service`, `artefact_digest`, `config_version` | **Code + config** together, the unit we deploy and roll back |
| `deployment` | `deployment_id`, `release_id`, `environment`, `strategy`, `state`, `current_wave` | One rollout of one release to one environment |
| `desired_state` | `(service, environment, host_group)` → `release_id`, `generation` | What should run; `generation` increases on every change |
| `host_status` | `host_id`, `service`, `running_release`, `health`, `last_seen` | What is running; written by agents |
| `lock` | `(service, environment)` → `deployment_id`, `lease_expires_at` | One rollout at a time |
| `audit_event` | `event_id`, `actor`, `action`, `target`, `time`, `reason`, `prev_hash` | Append-only |

The control-plane data is small (a few GB), relational and needs transactions, so a replicated SQL database
fits. The desired state lives in a **strongly consistent** store with **watches** (a client can say "tell me
when this key changes"), such as etcd or ZooKeeper. Artefact bytes go to object storage behind a registry.

**Retention:** release artefacts are kept as long as they could be rolled back to, or are needed for audit
(often a year); pull-request artefacts expire after weeks. A garbage collector deletes a layer only when no
remaining artefact refers to it, the same reference counting idea as any content-addressed store.

## 9. Deep dive: the release pipeline as a DAG

A release pipeline is a **DAG** (directed acyclic graph): stages are nodes, and an arrow means "this stage
needs that one to succeed first". "Acyclic" means no loops, so it always finishes. Stages that do not depend
on each other run in parallel.

[![A release pipeline DAG: build and unit tests feed integration tests and a security scan in parallel; deploy to staging waits for both; a promotion gate with smoke tests and a one-hour soak promotes to a production canary in one region at 1% traffic, then a wave rollout region by region; a failed gate or canary halts and alerts the owner](/img/system-design/code-deployment/04-pipeline.png)](/img/system-design/code-deployment/04-pipeline.png)

How the engine runs it:

- **Topological order.** A stage starts when all its parents have succeeded. The engine stores each
  `stage_run` state in the database, so if the engine restarts it simply re-reads the graph and continues.
- **Promotion gates** sit between environments. A gate is a condition that must hold before the same artefact
  may move on: tests passed, a soak period without alerts, a security scan clean, a business-hours window, or a
  **human approval** for sensitive services. Gates are evaluated by the engine, and every decision is recorded.
- **Promotion moves the digest, not the code.** Staging and production run exactly the artefact the tests
  saw. The only differences are configuration and secrets, which are injected at deploy time (section 14).
- **Stages are idempotent.** "Deploy release 42 to staging" run twice has the same effect as once, so the
  engine can safely retry a stage after a crash.
- **Fan-in and fan-out.** One build can feed many deploy stages (every region), and one deploy can wait for
  many checks. A DAG expresses both naturally; a straight list cannot.

Production itself is deployed in **waves**: first a canary in one region, then one small region, then the rest
of the regions one or two at a time, with a **bake time** (a wait while metrics are watched) between waves. A
bug that only shows in one region's traffic is caught while most users are still on the old version.

## 10. Deep dive: deploying to thousands of hosts

### Push or pull?

| | **Push** (a central server SSHes into each host) | **Pull** (an agent on each host fetches its desired state) |
| --- | --- | --- |
| How it works | The deployer runs commands on hosts in batches | The deployer writes the target; agents converge to it |
| A host is down | The deploy fails or skips it; someone must remember | The agent catches up when the host returns |
| Scale | The deployer holds thousands of connections | Each agent does its own work; the server answers small reads |
| Security | The deployer needs root access to every host | Hosts need only read access to their own target |
| Good for | Small fleets, one-off scripts | Large fleets: this is our choice |

### Desired state and reconciliation loops

The pull model is built on a **reconciliation loop** (also called a control loop), the same idea used by a
home thermostat and by Kubernetes controllers:

```text
loop forever:
    desired = read the desired state for this host      (watch, plus a re-read every 30 s)
    actual  = what is running on this host now
    if actual != desired:
        take one step towards desired                  (fetch, verify, stop old, start new)
    report actual and health
```

The loop does not care *how* the host got out of step: a new release, a crash, a reboot, a disk swap, a human
who changed something by hand. It just keeps nudging reality towards the target. That is why this design is so
robust: one mechanism handles every kind of drift.

[![Pull-based deploy sequence: the deploy controller writes wave 3 web = v42 to the desired-state store; the watch fires on the host agent, which also re-reads every 30 seconds; the agent fetches the artefact by digest from peers and verifies it, drains and restarts the app on v42, gets a healthy check, reports actual = v42, and the store tells the controller wave 3 is 99% healthy](/img/system-design/code-deployment/05-reconcile.png)](/img/system-design/code-deployment/05-reconcile.png)

*Select the diagram to zoom in and move around.*

Details that matter in an interview:

- **Drain before stop.** The agent first takes the host out of the load balancer and lets in-flight requests
  finish (say 30 s), then restarts the app. Users never see a connection reset.
- **The controller moves waves, not hosts.** It writes "wave 3 = v42", then watches `host_status` until enough
  of wave 3 is healthy (for example 99%), then writes wave 4. Each wave is limited by a **max unavailable**
  setting such as "no more than 10% of a service's hosts restarting at once", so capacity never drops too far.
- **`generation` numbers** make updates safe: an agent ignores a desired state older than one it has already
  applied, so a delayed message can never move a host backwards by accident.

### Keeping the fleet consistent when a host is down mid-deploy

Say host 7,312 was rebooting when wave 3 went out.

1. The controller counts it as **not yet converged**. If the wave still meets its threshold (99% healthy), the
   rollout continues. One host cannot hold the company hostage, but a whole rack failing can.
2. When the host comes back, its agent reads the desired state, sees v42, and converges. No human action needed.
3. A **drift detector** reports hosts that have been on the wrong version for too long (say 1 hour). Those are
   usually broken machines; the fleet manager replaces them.
4. New hosts get the current desired state on their first boot, so autoscaling never launches old code.

And if the **controller** crashes mid-rollout? Its whole state (`deployment.current_wave`, the lock, the desired
state) is in the database. A standby controller takes over the lease, reads where the rollout stopped, and
continues. Agents keep converging to whatever is already written, so the fleet is never left half-told.

## 11. Rollout strategies and feature flags

[![Three rollout strategies: rolling moves 10% batches of hosts to v42 with a health check between batches until all hosts run v42, with mixed versions meanwhile; blue-green starts a full idle copy on v42, tests it, switches the router to send 100% of traffic to green at once and keeps blue warm for an instant switch back; canary sends 1% of traffic to v42, compares metrics with the baseline, widens through 5%, 25% and 50%, and ends at 100% with few users ever seeing a bug](/img/system-design/code-deployment/06-strategies.png)](/img/system-design/code-deployment/06-strategies.png)

| Strategy | How it works | Extra capacity | Rollback speed | Users exposed to a bug | Watch out for |
| --- | --- | --- | --- | --- | --- |
| **Rolling** | Replace hosts in batches | None (or one batch) | Minutes: roll back batch by batch | Grows with each batch | Old and new versions serve traffic together |
| **Blue-green** | Build a full copy (green), then switch the router | 2× for a while | Seconds: switch back to blue | All of them, at the switch | Cost; database shared by both colours |
| **Canary** | Send a small share of traffic to the new version, widen in steps | Small | Seconds: send canary traffic to 0% | A few per cent at most | Needs good metrics and enough traffic to judge |

All three share one hard rule: **old and new versions run at the same time**, at least for a moment. So every
change must be **backward and forward compatible**: a new API field must be optional, a database column is
added in one release and only used in the next, and messages on a queue must be readable by both versions.

### Canary with automatic analysis

A human staring at dashboards is slow and inconsistent. Automatic canary analysis compares the canary with a
**baseline**: a fresh group of hosts running the *old* version, started at the same time and given the same
share of traffic. Comparing against the baseline rather than the whole fleet removes noise from time of day,
cold caches and freshly restarted processes.

[![Automatic canary analysis: shift traffic in steps of 1%, 5%, 25% and 50%, collect metrics for canary and baseline for 15 minutes, score errors, latency and CPU; a pass moves to the next step until 100% and the release is done, an unsure result waits longer and collects again, and a fail rolls back the canary to 0% and pages the owner](/img/system-design/code-deployment/07-canary.png)](/img/system-design/code-deployment/07-canary.png)

- The scorer compares distributions of key metrics (error rate, p99 latency, CPU, memory, crash count) with a
  **statistical test**, and turns them into a score. Above a threshold: pass. Below another: fail. In
  between: **inconclusive**, so collect for longer instead of guessing.
- Netflix and Google open-sourced this approach as **Kayenta**, part of the Spinnaker delivery platform; Argo Rollouts and
  Flagger offer similar analysis on Kubernetes.
- A canary only helps if it sees enough traffic. A service with 10 requests a minute cannot show a 0.1% error
  rate in 15 minutes; such services use longer windows or synthetic test traffic.

### Feature flags: decouple deploy from release

**Deploying** puts code on servers. **Releasing** lets users see a feature. A **feature flag** is a runtime
switch (`if flags.enabled("new_checkout", user)`) whose value comes from a flag service, not from the code.

- Code ships **dark** (switched off), so a deploy is a non-event for users.
- The feature is then turned on for employees, 1% of users, one country, everyone, all without a deploy.
- If it misbehaves, **turning the flag off takes seconds**, much faster than any rollback.
- Cost: flags are technical debt. Every flag is a branch to test; old flags must be removed once fully on.

Flags and canaries solve different problems: a canary catches **"this build is broken"** (crashes, memory
leaks); a flag controls **"this feature is not ready"** (wrong behaviour, bad user reaction).

## 12. Health checks and automatic rollback

A deployment has a lifecycle. Making it an explicit **state machine** keeps the controller honest: every state
change is a database write, so a crashed controller knows exactly where to resume.

[![States of one deployment: QUEUED waits for the lock, ROLLING OUT moves wave by wave, VERIFYING bakes, SUCCEEDED becomes the new last-good; a newer release cancels a queued one, an operator or freeze pauses a rollout until it resumes, and an unhealthy wave or failed health check leads to ROLLING BACK and then ROLLED BACK once hosts are on the old version](/img/system-design/code-deployment/08-deploy-states.png)](/img/system-design/code-deployment/08-deploy-states.png)

*Select the diagram to zoom in and move around.*

**Three layers of health checks:**

1. **Liveness** (on the host): is the process alive? If not, the agent restarts it.
2. **Readiness** (on the host): can it serve? It has loaded config, connected to its database, warmed its cache.
   Only ready hosts get traffic, and a host that never becomes ready fails its wave.
3. **Service-level health** (from monitoring): error rate, latency and business metrics (orders per minute) for
   the hosts on the new version, compared with the old version.

**Automatic rollback** is simply a new deployment of the **last-good release** (the last one that reached
SUCCEEDED), using a faster strategy: bigger batches and no bake time, because we already trust that version.
Because releases bundle code and config, rolling back restores both together. Rules worth stating:

- **Roll back first, debug later.** Restoring service matters more than understanding the bug.
- **Rollback must not depend on the thing that is broken.** It must work with the artefact store degraded (hosts
  keep the previous artefact on disk), and with the pipeline engine down (the controller can act alone).
- **Not everything can be rolled back.** A database migration that dropped a column cannot be undone by
  redeploying old code. That is why schema changes are made in separate, backward-compatible steps
  ("expand, then contract").

## 13. Locks, freezes and concurrency between pipelines

What if two pipelines try to deploy the same service at once, say release 42 and a hot fix 43?

- **One deployment per (service, environment) at a time.** The controller takes a **lock** row in the
  database before it starts. The lock is a **lease** with an expiry (for example 10 minutes, renewed every
  minute while the rollout makes progress), so a crashed controller cannot hold it forever.
- **Fencing tokens.** Each lease comes with a number that increases every time it is granted. The desired-state
  store rejects writes carrying an older number, so a controller that paused for a long garbage collection and
  wakes up thinking it still holds the lock cannot overwrite the new owner's work.
- **Queue, and let the newest win.** A queued release that is older than one behind it is **cancelled**
  (superseded): deploying 42 just to replace it with 43 a minute later is wasted risk.
- **Hot fixes and rollbacks jump the queue.** A rollback can pre-empt a running rollout: the controller pauses
  it, takes the lock and deploys last-good.
- **Different services deploy in parallel.** Locks are per service, so 4,000 deployments a day do not wait on
  each other. A global limit can still cap how many rollouts run in one region at once, so many small changes
  cannot together cause a large outage.

**Freezes** are company-wide or team-wide windows when deploys are blocked: a holiday sales peak, a big launch,
an ongoing incident. A freeze is a row (`scope`, `start`, `end`, `reason`) that every promotion gate checks.
Rollbacks and approved emergency fixes are allowed through, with an extra approval recorded in the audit log.

## 14. Secrets and configuration at deploy time

The artefact must be **the same in every environment**, so it cannot contain the staging database password
or the production API key.

- **Secrets** (passwords, API keys, certificates) live in a **secrets manager** (for example HashiCorp Vault or a
  cloud key management service). At start-up, the app or the agent proves its identity (a host certificate or a
  workload identity token) and receives only the secrets that service is allowed to see. They are mounted in
  memory or a temporary file, never written into the image, the logs or the pipeline variables.
- **Short-lived credentials** are better still: the secrets manager issues a database password valid for an hour,
  so a leaked copy is soon useless.
- **Configuration** (timeouts, pool sizes, endpoints) is versioned like code. A **release** pins a config
  version along with the artefact digest, so a bad config change is rolled out (and rolled back) with the same
  canary safety as code. Many large outages have been caused by config pushes, not code.
- **The pipeline itself has secrets** (credentials to push to the registry, to call the desired-state store).
  Builds of untrusted pull requests run without them, so a malicious pull request cannot steal them.

## 15. Distributing large artefacts fast

From section 3: copying a 1 GB image to 10,000 hosts from one origin takes over 2 hours and saturates its
network. The fix is to stop treating hosts only as downloaders and let them **share with each other**, the
idea behind BitTorrent.

[![Distributing a large artefact: the artefact store sends one copy per region to a regional seed; each seed sends pieces to the hosts in the first rack, which pass pieces on to the next rack; hosts announce which pieces they hold to a tracker and ask it to find peers](/img/system-design/code-deployment/09-p2p.png)](/img/system-design/code-deployment/09-p2p.png)

*Select the diagram to zoom in and move around.*

How it works:

1. The artefact is split into **pieces** (say 4 MB each), each with its own hash.
2. The origin sends **one copy per region** to a regional **seed** (a cache), so cross-region links carry it
   once, not once per host.
3. Hosts ask a **tracker** "who has which pieces?", download different pieces from different peers at the same
   time, and immediately **upload** the pieces they have to others. Every new downloader is also a new uploader,
   so total bandwidth grows with the number of hosts instead of being fixed by the origin.
4. Every piece is verified by its hash, so a faulty or malicious peer cannot inject bad data.
5. Peers prefer neighbours in the same rack, so most traffic stays on cheap, fast local links.

Rough effect: instead of one 10 Gbit/s origin feeding everyone, thousands of 10 Gbit/s host links work in
parallel. The rollout time becomes close to the time *one* host needs to download the file plus a little per
"hop", typically minutes rather than hours. This is well-trodden ground: Twitter described a BitTorrent-based
deploy tool (Murder) and Facebook described distributing builds with BitTorrent; Uber's **Kraken** and the CNCF
project **Dragonfly** are open-source peer-to-peer distributors for container images.

Two more tricks help:

- **Pre-fetch.** Agents can download the next release while the current wave is still baking, so the actual
  switch is just a restart.
- **Deltas and layers.** If only 50 MB of layers changed, hosts that already have the rest download 50 MB.

## 16. The audit trail

Every action is an `audit_event`: who (a person or the pipeline's identity), what (deploy, rollback, approve,
freeze, flag change), where (service, environment, region), when, why (the pull request, the ticket or the
incident), and the result.

- **Append-only.** Rows are never updated or deleted. Each event includes the hash of the previous one
  (`prev_hash`), so tampering with history breaks the chain and is detectable. A copy goes to separate,
  write-once storage that the deploy system itself cannot modify.
- **Why it matters:** in an incident, the first question is "what changed?". A timeline of every deploy, config
  change and flag flip, joined with the metrics, answers it in seconds. Auditors also ask who approved changes to
  regulated systems.

## 17. What breaks as it grows, and how to fix it

**The slow pipeline.** Builds creep from 10 to 60 minutes and engineers start batching changes. *Fix:* measure
the critical path of the DAG, raise the cache hit rate (often by finding non-hermetic steps that poison the
cache), shard tests further and quarantine flaky tests.

**The monorepo trigger storm.** In a monorepo, every commit could trigger every pipeline. *Fix:* compute which
targets a change affects from the build graph and run only those pipelines.

**The thundering herd of agents.** 50,000 agents reconnect at the same moment after a network blip, or all fetch
the artefact at once. *Fix:* random jitter on every retry and poll, long polls instead of tight loops, and
peer-to-peer distribution with regional seeds.

**The global bad config.** One change reaches every region in seconds and takes them all down. *Fix:* treat
config exactly like code: versioned, canaried, rolled out in waves, with automatic rollback.

**The deploy system deploys itself.** If a bad release of the controller breaks the controller, how do you roll
it back? *Fix:* deploy the deploy system with a separate, simpler path (or the previous version of itself),
and keep a documented manual fallback (`ssh` plus a script) that is tested regularly.

## 18. Reliability: how the deploy system stays safe

| Risk | Defence |
| --- | --- |
| A webhook is lost | Periodic reconciliation poll of the Git host; idempotent run creation |
| A build is not reproducible | Hermetic sandboxes, pinned inputs; rebuild-and-compare checks on a sample |
| A tampered artefact | Content addressing, signed provenance, hosts verify signatures and hashes |
| A bad release | Canary with automatic analysis, waves with bake time, automatic rollback to last-good |
| A host down mid-deploy | Pull model and reconciliation loops; drift detection; wave thresholds below 100% |
| The controller crashes | All state in the database; leases with fencing tokens; a standby takes over |
| Two deploys collide | Per-service leases; newer releases supersede queued ones; rollbacks pre-empt |
| The artefact store is down during an incident | Hosts keep the previous artefact on disk; regional caches; rollback still works |

The pattern to remember: **declare the desired state, converge in small steps, verify at each step, and keep
the way back always open.**

## 19. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Getting work to hosts | Push (SSH from a server) | Pull (agents reconcile) | **Pull**: scales, self-heals and catches up offline hosts |
| What we deploy | Rebuild per environment | Promote one artefact by digest | **Promote**: what was tested is exactly what runs |
| Triggers | Webhooks only | Webhooks + periodic poll | **Both**: webhooks for speed, polling for correctness |
| Rollout strategy | Blue-green | Canary | **Canary** by default (small blast radius, cheap); blue-green where a mixed fleet is not allowed |
| Shipping a feature | Deploy = release | Feature flags | **Flags** for risky features: switch off in seconds without a deploy |
| Artefact distribution | Central registry | Regional seeds + P2P | **P2P** for large fleets and images; plain registry for small services |
| Rollback | Manual decision | Automatic on health | **Automatic**, with humans able to pause or override |

## Cheat sheet for last-minute revision

- **Pipeline:** webhook (signed, deduplicated, backed by polling) → hermetic build → tests in parallel shards →
  immutable artefact → DAG of stages with promotion gates → waves across regions.
- **Hermetic + cached builds:** pinned dependencies and toolchain, sandbox with no network; cache key = hash of
  all inputs; a shared remote cache gives ~90% reuse.
- **Artefacts:** content-addressed by digest, immutable, signed, with SBOM and provenance. **Build once,
  promote the same digest everywhere.** A release = artefact digest + config version.
- **Deploying:** controller writes desired state; agents on every host run a **reconciliation loop** (watch +
  periodic re-read), drain, restart, report health. Offline hosts catch up on return.
- **Strategies:** rolling (no extra capacity), blue-green (instant switch, 2× capacity), canary (smallest blast
  radius, needs metrics). Old and new run together, so changes must be backward compatible.
- **Canary analysis:** canary vs a fresh **baseline**, statistical comparison, pass / fail / inconclusive.
- **Feature flags** decouple deploy from release; turning a flag off is the fastest rollback.
- **Safety:** state machine per deployment, automatic rollback to last-good, per-service leases with fencing
  tokens, freezes, an append-only hash-chained audit log.
- **Secrets** come from a vault at start-up, per service identity, ideally short-lived; never in the artefact.
- **Big artefacts:** one copy per region to a seed, then BitTorrent-style pieces between peers.
- **Numbers:** ~45,000 builds/day, ~4,000 deploys/day; 1 GB to 10,000 hosts = 10 TB, 2+ hours from one origin,
  minutes with P2P.

## Practice questions

1. **A deploy went out and errors rose, but the canary passed. How could that happen, and what would you
   change?** The canary may have had too little traffic, missed a metric (for example a business metric), or the
   bug appears only in one region or only after hours (a memory leak). Add the missing metric, lengthen bake
   times, canary in each region, and correlate alerts with recent deploys so rollback is quick.
2. **How do you deploy a database schema change safely?** Expand, then contract: first add the new column
   (nullable) in a migration, deploy code that writes both and reads old, backfill, deploy code that reads new,
   and only later drop the old column. Each step is compatible with the versions running beside it.
3. **How would you make "deploy" work for a mobile app?** You cannot roll back phones. Use staged rollouts
   through the app stores, server-side feature flags to switch features off, and keep APIs compatible with old
   app versions for a long time.
4. **A host was down for a week. What happens when it comes back?** Its agent reads the desired state, sees it
   is far behind, fetches the current artefact (the old one may have been garbage collected; the current one is
   always kept), converges, passes readiness and only then receives traffic. Drift detection would already have
   flagged it.
5. **How would you stop a compromised engineer laptop from deploying malicious code?** Only artefacts built by
   CI from reviewed commits on `main` carry a valid signature; hosts refuse anything else. Require review by a
   second person for changes, and keep deploy credentials out of laptops entirely.
