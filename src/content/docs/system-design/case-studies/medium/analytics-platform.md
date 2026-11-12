---
title: "Design an Analytics Platform for Metrics and Logs (like Datadog / Prometheus + ELK)"
description: "Design a Datadog-style observability platform: agents, a Kafka buffer, a time-series DB with compression and rollups, log indexing, alerting and quotas."
difficulty: "Medium"
sidebar:
  label: "Metrics and logs platform (like Datadog)"
tags: ["Time series", "Logging", "Queues", "Storage", "Alerting"]
---

When a website slows down at 3 a.m., somebody has to find out **what** is wrong, **where**, and **since when**.
An observability platform such as Datadog, or a self-hosted stack such as Prometheus with Grafana and the ELK
stack (Elasticsearch, Logstash, Kibana), is the tool they reach for. It is a **flight recorder** that writes
down everything every server does, a **library** that can find one line among trillions, a **chart engine**
that draws a week of data in a second, and a **smoke alarm** that wakes the right person, once, when something
burns.

The hard part is volume. Every server in a company reports hundreds of numbers every few seconds and writes
thousands of log lines a minute. The data is written constantly and mostly never read, yet when it is read, during
an outage, it must answer fast. This case study designs that system from first principles.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Observability in 5 minutes: metrics, logs and traces

Software tells us about itself in three different shapes of data, often called the **three signals** (or
"three pillars") of observability.

| Signal | What it is | Example | Everyday analogy |
| --- | --- | --- | --- |
| **Metric** | A number measured over time, with a name and some labels | `http_requests_total{service="checkout", status="500"} = 1042` | The speedometer and fuel gauge in a car |
| **Log** | A line of text (often JSON) written when something happens | `2026-11-12T03:04:05Z ERROR payment declined order=981 reason=timeout` | A ship's logbook: one entry per event |
| **Trace** | The path of **one request** through many services, as a tree of timed steps called **spans** | checkout (420 ms) → payments (380 ms) → bank API (350 ms) | A parcel tracking page showing every depot it passed |

They answer different questions, which is why a platform needs all three:

- **Metrics** say **that** something is wrong: "error rate jumped from 0.1% to 8% at 03:02". They are tiny and
  cheap, so we can keep them for months and alert on them.
- **Logs** say **why**: the exact error message and the order ID. They are big and expensive.
- **Traces** say **where**: which of the twelve services in the chain is slow.

A few more words we will use throughout:

- A **time series** (or just **series**) is one metric with one exact set of labels, for example
  `http_requests_total{service="checkout", status="500", pod="checkout-7"}`. Each reading in it is a
  **sample**: a timestamp and a value.
- **Labels** (Datadog calls them tags) are key-value pairs that let you slice data: by service, region, pod,
  status code.
- Common metric **types**: a **counter** only goes up (requests served; you chart its rate of increase), a
  **gauge** goes up and down (memory in use, queue length), and a **histogram** counts values into buckets
  (how many requests took 0–10 ms, 10–50 ms…) so you can estimate percentiles such as p99 latency.
- **Cardinality** is the number of distinct series. It is the single most important number in a metrics system,
  as section 8 shows.

## 2. Requirements

### Functional (what users can do)

- **Send** metrics, logs and traces from servers, containers and applications, through an agent or an API.
- **Query** metrics with aggregation: "p99 latency of checkout, by region, over the last 7 days".
- **Search** logs: "lines from `service=checkout` containing `timeout` in the last hour", and see live tail.
- **View traces** by trace ID and find slow ones.
- **Dashboards**: saved sets of charts that refresh automatically.
- **Alerts**: rules such as "error rate above 5% for 5 minutes" that notify the right team by pager, chat or email.
- **Multi-tenant**: many customer companies (or internal teams) share the platform, each seeing only its own
  data, each with its own limits and bill.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Ingest availability** | Never refuse data in normal operation; survive a zone failure | Data you did not record during an outage is gone forever |
| **Freshness** | New data queryable within ~10–30 seconds | Alerts and live dashboards are useless if they lag minutes behind |
| **Query latency** | Dashboard panels in under 1 s for recent data, a few seconds for months | Engineers query during incidents, under stress |
| **Alert reliability** | Alerts evaluated every 30–60 s, even when ingest is overloaded | The alarm must work during the fire |
| **Durability** | Small loss of in-flight samples is tolerable; losing days of history is not | Metrics are statistical; one missing point rarely matters |
| **Cost** | Storage per GB and per series as low as possible | Telemetry volume grows faster than the business; cost decides the design |
| **Isolation** | One noisy tenant cannot slow down others | Shared platform |

Notice the unusual trade-off: we accept **slightly lossy, eventually consistent** data in exchange for very
high write throughput and low cost. This is not a bank.

### Out of scope

Application performance profiling, real-user browser monitoring, security analytics (SIEM), and the charting UI
itself. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** the platform monitors **200,000 hosts and containers** across all tenants. Each exposes
**500 active series**, scraped every **15 seconds**. Each writes on average **20 log lines per second** of
**250 bytes**. Traffic peaks at about 3× the average.

**Metrics ingest**

- Active series: $200{,}000 \times 500 = 100\text{M}$.
- Samples per second: $100\text{M} / 15\text{ s} \approx 6.7\text{M}$ per second (about 20M at peak).
- Samples per day: $6.7\text{M} \times 86{,}400 \approx 576\text{B}$.

**Metrics storage**

- A raw sample is 16 bytes (8-byte timestamp + 8-byte float): $576\text{B} \times 16\text{ B} \approx 9.2\text{ TB}$ a day.
- With time-series compression (section 8) at roughly **1.5 bytes per sample**: about **0.9 TB a day**, a 10×
  saving. Fifteen days of raw data: about **13 TB**.
- 5-minute rollups keep 4 numbers (min, max, sum, count) per 20 raw samples, about 5× smaller: ~0.18 TB a day,
  ~16 TB for 90 days. 1-hour rollups for 13 months: ~6 TB. **Total: around 35 TB** in object storage. Small.
- Memory: each active series costs a few KB in the ingesters (its open chunk plus its index entry). At ~4 KB,
  $100\text{M} \times 4\text{ KB} = 400\text{ GB}$ of RAM, ×3 if every series is kept on three replicas.
  **Memory scales with the number of series, not with the number of samples.**

**Logs**

- Lines per second: $200{,}000 \times 20 = 4\text{M}$; bytes: $4\text{M} \times 250\text{ B} = 1\text{ GB/s}$
  (3 GB/s at peak).
- Per day: $1\text{ GB/s} \times 86{,}400 \approx 86\text{ TB}$ raw. Log text compresses well, often about
  10×: ~**9 TB a day**, ~**260 TB** for 30 days of retention.

**Traces** (rough): 500,000 requests per second across all tenants, 20 spans of 500 bytes each, is 5 GB/s.
Keeping a **5% sample** brings it to 250 MB/s.

**Queries**

- Dashboards: 10,000 open dashboards × 20 panels, refreshing every minute: $200{,}000 / 60 \approx 3{,}300$
  queries per second.
- Alerts: 1 million rules evaluated every minute: $1\text{M} / 60 \approx 17{,}000$ queries per second.

Four conclusions follow:

1. **This is a write-heavy system.** Millions of writes per second, a few thousand reads. Optimise the write path
   first.
2. **Logs dominate bytes; metrics dominate counts.** Log cost is about storage and indexing; metric cost is
   about the number of series held in memory.
3. **Alerts, not humans, are the biggest query load.** The query engine must be cheap for small repeated queries.
4. **Compression and retention policies are where the money is.**

## 4. The API

Two kinds of clients: **agents** that write, and **users** (or the UI) that read.

| Method and path | What it does |
| --- | --- |
| `POST /v1/metrics` | A batch of samples: `[{name, labels, points: [[ts, value], ...]}]`, compressed (for example snappy or gzip). Authenticated with the tenant's **API key**. |
| `POST /v1/logs` | A batch of log lines, each with a timestamp, labels (`service`, `env`, `host`) and the message. |
| `POST /v1/traces` | A batch of spans in a standard format such as OpenTelemetry (OTLP). |
| `GET /v1/query_range?q=...&start=...&end=...&step=60s` | A metrics query over a time range, one point per `step`. Returns a list of series. |
| `GET /v1/logs/search?q=...&start=...&end=...&limit=100` | Log search with a **cursor** for the next page. |
| `GET /v1/traces/{trace_id}` | Every span of one trace. |
| `POST /v1/alert-rules` | Create a rule: query, threshold, `for` duration, severity, labels for routing. |

Write responses matter: `200` means "accepted and durable", `429 Too Many Requests` means "over your quota, slow
down", and `503` means "try again". Agents keep a **local buffer** (memory, then disk) and retry with backoff, so a
short platform outage does not lose data.

A metrics query language such as PromQL reads like this:

```text
histogram_quantile(0.99,
  sum by (le, region) (rate(http_request_duration_seconds_bucket{service="checkout"}[5m])))
```

In words: for every checkout latency bucket, compute the per-second rate over 5 minutes, add the rates up per
region, and estimate the 99th percentile from the buckets.

## 5. High-level design

[![High-level architecture: agents on your services send batches to an ingest gateway, which appends them to Kafka; metric ingesters, log indexers and trace ingesters consume from Kafka and write the time-series DB, log store and trace store; a query service reads all three for dashboards, and a rule evaluator queries it and sends firing alerts to an alert manager that notifies on-call](/img/system-design/analytics-platform/01-architecture.png)](/img/system-design/analytics-platform/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Agents:** small programs on every host that scrape or receive metrics, tail log files and forward spans,
  batching and compressing everything.
- **Ingest gateway:** a stateless fleet that checks the API key, finds the tenant, enforces quotas, validates
  and normalises data.
- **Kafka** (or a similar replicated log): the **durable buffer** between accepting data and processing it.
- **Metric ingesters:** hold recent series in memory, write a write-ahead log, compress, and upload blocks.
- **Log indexers:** parse lines, attach labels, build the index, write compressed chunks.
- **Trace ingesters:** group spans by trace ID and store sampled traces.
- **Stores:** a time-series database for metrics, a log store, a trace store. All three keep old data in cheap
  **object storage** (S3, GCS).
- **Query service:** splits, fans out, merges and caches queries for dashboards and alerts.
- **Rule evaluator:** runs every alert rule on a schedule. **Alert manager:** de-duplicates, groups, silences and
  routes alerts to people.

The big idea: **three different storage engines behind one ingestion pipeline and one query layer.** Metrics,
logs and traces have such different shapes that a single database would be bad at all of them.

## 6. Collection: agents, and push versus pull

Something on the host has to gather the data. There are two models, and real platforms use both.

| | **Pull (scrape)** | **Push** |
| --- | --- | --- |
| How | The app exposes a `/metrics` page; a scraper fetches it every 15 s | The app or agent sends data to the platform |
| Known for | Prometheus | Datadog agent, StatsD, OpenTelemetry exporters |
| Pros | The monitor controls the rate; a failed scrape **is** a signal ("target down"); easy to debug with a browser | Works through firewalls and NAT; fine for short-lived jobs and serverless; one outbound connection |
| Cons | The scraper must discover and reach every target; short jobs may finish before being scraped | A misbehaving client can flood you; "no data" is ambiguous (dead, or just quiet?) |

A typical modern design **combines them**: an agent on each host **pulls** locally (scrapes the apps next to it,
tails log files, receives spans) and then **pushes** compressed batches to the platform over one outbound HTTPS
connection. Prometheus, for the short-batch-job case, offers a Pushgateway for the same reason.

Agent responsibilities worth naming in an interview:

- **Batching and compression:** send every few seconds, not per sample. Thousands of tiny requests per second per
  host would melt the gateway.
- **Local buffering:** keep minutes of data in memory or on disk when the platform is unreachable.
- **Enrichment:** add `host`, `region`, `k8s_pod` labels once, centrally.
- **Pre-aggregation:** a StatsD-style agent can sum 10,000 counter increments into one sample per 10 seconds.
- **Protecting the host:** strict CPU and memory caps, because the monitor must never take down what it monitors.

## 7. Ingestion: a durable buffer in the middle

Why not write straight from the gateway into the time-series database? Because the two sides fail and slow down
independently. A database compaction, a deploy or a bad query can stall writes for a minute, and agents cannot
buffer forever. A replicated log such as Kafka **decouples accepting from processing**:

[![Write path sequence: the agent posts a batch; the ingest gateway checks the tenant and quota, appends to a Kafka partition chosen by series hash, gets an ack once written to three replicas and returns 200 or 429; the metric ingester consumes, writes a WAL and in-memory chunk, commits the offset, and every two hours uploads a compressed block to object storage](/img/system-design/analytics-platform/02-write-path.png)](/img/system-design/analytics-platform/02-write-path.png)

*Select the diagram to zoom in and move around.*

What the buffer buys us:

- **Absorbs spikes.** A deploy that restarts 10,000 pods, each dumping startup logs, becomes a growing backlog
  instead of rejected writes.
- **Replay.** If a bug in the log parser drops a field for an hour, fix the parser and re-read that hour.
- **Fan-out.** Several independent consumers can read the same stream: the TSDB ingesters, a long-term archive,
  a real-time "live tail" feature, a billing counter.
- **Ordering where it matters.** Partitioning by a hash of `tenant + series labels` sends every sample of one
  series to the same partition and so to the same ingester, in order. Logs can be partitioned by
  `tenant + stream labels`.

The rule from the [email service design](/system-design/case-studies/medium/email-service/) applies here too: **only say `200 OK` after the data is durably in the
log** (written to several brokers). If the gateway dies before that, the agent never got its OK and retries.

**At-least-once delivery.** A consumer that crashes after writing but before committing its offset will read the
same batch again. Duplicates are harmless if writes are **idempotent**: a sample for the same series and the
same timestamp simply overwrites, and log chunks can carry a batch ID.

Inside the ingester, each sample goes first into a **write-ahead log (WAL)** on local disk (a plain append-only
file, so a crashed ingester can rebuild its memory) and then into the series' in-memory chunk. Every couple of
hours the ingester cuts a **block**, compresses it and uploads it to object storage. Recent data is served from
memory; older data from blocks.

## 8. Deep dive: storing metrics in a time-series database

A general-purpose database would store each sample as a row `(name, labels, timestamp, value)`, with the
label text repeated billions of times and a B-tree index updated on every insert. At 7 million inserts per
second, that is hopeless. A **time-series database (TSDB)** exploits three facts: data arrives roughly in time
order, it is almost never updated, and it is read in ranges of one series.

### Series identity and the label index

[![Inside the time-series DB: a sample's sorted labels are hashed to find its series; only a brand-new series is added to the label index; the value is appended to the series' open chunk using delta timestamps and XOR values, and full chunks go into a two-hour block](/img/system-design/analytics-platform/03-series.png)](/img/system-design/analytics-platform/03-series.png)

*Select the diagram to zoom in and move around.*

- A series is identified by its **name plus its sorted labels**. Hash them to get a series ID. For an existing
  series, writing a sample is just "find the series, append two numbers".
- Only a **new** series touches the **label index**, an inverted index from each `label=value` pair to the
  list of series IDs that have it (like the index at the back of a book):

| Label pair | Series IDs |
| --- | --- |
| `service="checkout"` | 7, 9, 12, 40 |
| `status="500"` | 9, 40, 77 |
| `region="eu"` | 7, 9, 81 |

A query for `{service="checkout", status="500"}` intersects the two lists: series 9 and 40. Then it reads only
those series' chunks for the requested time range.

### The cardinality problem

Every distinct label combination is a new series, and series are what cost memory. Labels multiply:

$$
5\text{ methods} \times 10\text{ status codes} \times 200\text{ paths} \times 500\text{ pods} = 5\text{M series}
$$

for one metric. Now a developer adds `user_id` as a label, with a million users. The maximum becomes
5 trillion; even if only a tiny fraction of combinations ever appear, the ingesters run out of memory, the label
index explodes, and every query on that metric slows down. This is a **cardinality explosion**, the most common
way to break a metrics system.

Defences:

- **Rules:** never put unbounded values (user IDs, request IDs, full URLs, email addresses) in metric labels.
  They belong in logs and traces.
- **Per-tenant series limits** enforced at the gateway (section 13): reject new series beyond the limit with a
  clear error, while existing series keep working.
- **Visibility:** a "top metrics by series count" page so teams find the culprit.
- **Drop or relabel** rules at the agent to strip a bad label before it leaves the host.
- **Series churn** counts too: pods that restart every hour each create fresh `pod` label values, so the number
  of series ever seen grows even when the number active at once does not.

### Compression: why a sample costs about a byte and a half

Facebook's Gorilla paper (2015) popularised a simple scheme, and Prometheus uses a similar one. Samples of one
series are stored together in a **chunk** (for example ~120 samples), which makes two tricks possible:

- **Timestamps: delta of delta.** Scrapes arrive every 15 s, so timestamps `1000, 1015, 1030, 1045` have deltas
  `15, 15, 15` and the **delta of the delta** is `0, 0`. A zero is stored in a single bit. Only jitter costs more
  bits.
- **Values: XOR with the previous value.** Consecutive readings are often equal or close. Equal floats XOR to
  zero (one bit). Close ones share sign, exponent and leading bits, so the XOR has long runs of zeros at both ends
  and only the middle bits are stored.

On Facebook's production data the paper reported about **1.37 bytes per sample** instead of 16. That is the 10×
saving in our estimates. The catch: a chunk must be decoded from its start, so you read whole chunks, which is
fine because queries read ranges anyway.

### Downsampling and retention tiers

Nobody needs a 15-second point from last March. A one-year chart has 2.1 million 15-second points per series
but a screen only has about 1,000 pixels across. So a background **compactor** rewrites old data at lower
resolution:

[![Life of metric data: raw points every 15 seconds kept 15 days, rolled up by the compactor into 5-minute min, max, sum and count kept 90 days, rolled up again into 1-hour aggregates kept 13 months, then whole blocks are deleted](/img/system-design/analytics-platform/04-retention.png)](/img/system-design/analytics-platform/04-retention.png)

*Select the diagram to zoom in and move around.*

- A rollup keeps **min, max, sum and count** per window, not just the average. From these you can still compute
  the average (`sum / count`) and you do not hide spikes (`max`). An average alone would smooth away the 30-second
  outage you are looking for.
- Counters and histograms can be rolled up exactly (sum the increases, sum the bucket counts). **Percentiles
  cannot be averaged**: the p99 of a day is not the average of 24 hourly p99s. That is why we store histogram
  buckets and compute percentiles at query time.
- The query layer picks the tier by range: under ~2 days use raw, under ~3 months 5-minute, beyond that hourly.
- Deleting is cheap because data is stored in **time-partitioned blocks**: retention means dropping whole blocks,
  never deleting rows one by one. Thanos, a well-known open-source long-term store for Prometheus, works this way
  with 5-minute and 1-hour downsampled copies.
- Retention is usually a **per-tenant, per-plan** setting: it is one of the main levers on the bill.

## 9. Deep dive: logs, indexing and the cost trade-off

Logs arrive as text. The pipeline turns them into something searchable:

1. **Collect:** the agent tails files or reads the container runtime's output, and attaches stream labels
   (`service`, `env`, `host`, `level`).
2. **Parse:** extract fields from JSON or with patterns (for example "the number after `latency=`"), normalise
   timestamps, and **mask secrets and personal data** (card numbers, tokens) before anything is stored.
3. **Index and store.** Here the two big designs differ.

[![Log pipeline: the log agent sends lines to a Kafka logs topic; a parser extracts fields and masks PII; option A indexes every word into replicated index shards on SSD, option B indexes only stream labels and writes compressed raw lines as chunks in S3 to be scanned at query time](/img/system-design/analytics-platform/05-logs.png)](/img/system-design/analytics-platform/05-logs.png)

*Select the diagram to zoom in and move around.*

**Option A: full inverted index** (the Elasticsearch / OpenSearch approach, built on Lucene). Every word in every
line is indexed: `timeout` → the list of lines containing it. Any search over any word is fast, even across a
month. The cost: the index is large (it can approach the size of the data itself), it lives on fast replicated
disks, and indexing burns a lot of CPU at write time, for data that is mostly never searched.

**Option B: index labels only, scan the rest** (the approach Grafana Loki is known for). Lines are grouped into
**streams** by their label set, compressed into chunks of a megabyte or two, and stored in object storage. The only index
is the tiny one from labels to chunks. A search like `{service="checkout"} |= "timeout"` first uses the labels to
pick the right chunks for the time range, then **decompresses and scans them in parallel** across many workers,
like `grep` at scale.

| | Full inverted index | Label index + brute-force scan |
| --- | --- | --- |
| Write cost | High: tokenise and index every word | Low: compress and append |
| Storage | Data + large index on SSD | Compressed data in object storage + tiny index |
| Needle-in-haystack search ("this order ID, any service, last 30 days") | Fast | Slow and expensive: scans a lot |
| Narrow search ("checkout errors, last hour") | Fast | Fast enough: only a few chunks match |
| Aggregations on parsed fields | Good | Possible, computed during the scan |
| Best for | Heavy, unpredictable search; security investigations | High volume, mostly recent, label-scoped debugging |

There is no universal winner: the trade-off is **paying at write time for every line** versus **paying at query
time only for lines you search**. Since most logs are never read, option B is far cheaper at scale; option A gives
faster answers to unpredictable questions. Many platforms mix them: a short **hot** window fully indexed, older
data as compressed chunks, and **archives** in object storage that can be "rehydrated" on demand.

Two more cost levers interviewers like:

- **Logs to metrics.** Counting `ERROR` lines per service per minute as a metric at ingest time is far cheaper
  than searching the logs every minute for an alert.
- **Exclusion and sampling.** Drop debug lines in production, or keep 1 in 100 health-check lines.

## 10. Traces, briefly

Each request gets a **trace ID** at the edge; every service passes it along in a header (the W3C `traceparent`
standard) and reports a **span** for its own work: start time, duration, parent span, and tags. The trace store
groups spans by trace ID; a lookup by ID is a simple key-value read.

The only hard problem is volume, solved by **sampling**:

- **Head sampling:** decide at the first service ("keep 5% of requests") and pass the decision along. Cheap,
  but it throws away the rare slow or failing request as often as the boring ones.
- **Tail sampling:** buffer all spans of a trace for a few seconds, then decide with the full picture ("keep every
  trace with an error or over 2 s, plus 1% of the rest"). Smarter, but the collector must hold every in-flight
  trace in memory and all spans of one trace must reach the same collector (route by trace ID).

Traces become most useful when linked: a latency spike on a chart links to example traces from that minute
(called **exemplars**), and a span links to the log lines with the same trace ID.

## 11. The query path and dashboards

A dashboard panel asks for "p99 checkout latency per region, last 7 days, one point every 5 minutes". The
**query frontend** makes that cheap with three tricks: **split**, **cache** and **fan out**.

[![Query path sequence: the dashboard asks the query frontend for 7 days; the frontend splits by day and finds days 1 to 6 in the results cache; only today goes to the querier, which reads the last 2 hours from ingesters and the rest of today from object storage, using the label index first; the querier deduplicates replicas and computes, and the frontend returns 7 merged days and caches today's result briefly](/img/system-design/analytics-platform/06-query.png)](/img/system-design/analytics-platform/06-query.png)

*Select the diagram to zoom in and move around.*

- **Split by time.** Seven days becomes seven one-day queries run in parallel. Completed days never change, so
  their results can be **cached** for a long time; only today is computed fresh. A dashboard refreshing every
  minute recomputes minutes, not a week.
- **Align to the step.** Round `start` and `end` to multiples of the step so two people opening the same
  dashboard at 10:00:03 and 10:00:41 hit the same cache entry.
- **Fan out by data location.** Recent data lives in ingesters (memory); older data in blocks in object storage,
  served by store gateways that cache block indexes. Replicas mean the same sample may come back three times, so
  the querier **de-duplicates** before computing.
- **Pick the right resolution.** A 90-day query reads 5-minute rollups, about 20× fewer points.
- **Pre-aggregate expensive queries.** A **recording rule** computes a heavy expression every minute and stores
  the result as a new, small series: `job:http_errors:rate5m` instead of summing 50,000 pod series every time a
  dashboard loads. Alerts and dashboards then read the cheap series.
- **Protect the system.** Limit the number of series and samples one query may touch, set timeouts, and queue
  queries **per tenant** so one tenant's 90-day regex query cannot starve everyone else.

## 12. Deep dive: alerting without alert storms

An alert rule is just a query plus a condition and a duration, evaluated on a schedule:

```text
alert: CheckoutHighErrorRate
expr:  sum(rate(http_requests_total{service="checkout", status=~"5.."}[5m]))
     / sum(rate(http_requests_total{service="checkout"}[5m])) > 0.05
for:   5m
labels: { severity: critical, team: payments }
```

The **rule evaluator** runs every rule every 30–60 seconds. Rules are sharded across evaluators by a hash of
(tenant, rule group), and each evaluator queries the same query service as dashboards. Each rule moves through
a small set of states (Prometheus uses the names inactive, pending and firing):

[![States of one alert rule: inactive while the condition is false; pending once it becomes true; firing if it is still true after 5 minutes, when it is sent to the alert manager; resolved when the condition is false again; a pending alert that clears early goes back to inactive without paging](/img/system-design/analytics-platform/07-alert-states.png)](/img/system-design/analytics-platform/07-alert-states.png)

*Select the diagram to zoom in and move around.*

The **`for: 5m`** clause is the first defence against noise: a one-minute blip goes to pending and back, and
nobody is woken up. The evaluator keeps re-sending firing alerts each cycle, so a lost message is corrected on the
next one.

The **alert manager** then turns raw firing alerts into a small number of useful notifications:

[![Alert manager pipeline: an alert that is already open only updates it; otherwise it is grouped by alert and cluster with a 30 second wait, checked for inhibition by a bigger alert and for silences during maintenance, then routed by team and severity labels and sent as a page if critical or a chat message otherwise](/img/system-design/analytics-platform/08-alert-routing.png)](/img/system-design/analytics-platform/08-alert-routing.png)

*Select the diagram to zoom in and move around.*

- **De-duplication.** Evaluators run as a redundant pair (so one dying does not silence alerts), so each alert
  arrives twice. Alerts with identical labels are the same alert; it is sent once.
- **Grouping.** When a database dies, 300 services fire "high error rate" at once. Grouping by `alertname` and
  `cluster`, and waiting ~30 s for the group to fill, turns 300 pages into **one** message listing 300 services.
- **Inhibition.** If "cluster unreachable" is firing, suppress all "pod down" alerts in that cluster: they are
  symptoms of the same cause.
- **Silences.** Planned maintenance mutes matching alerts for a time window; they are still recorded.
- **Routing.** A tree of rules on labels: `team=payments, severity=critical` → page the payments on-call through
  the paging service; `severity=warning` → their chat channel only.
- **Repeat and resolve.** Re-notify an unacknowledged critical alert every few hours, and send "resolved" when it
  clears.

Beyond the mechanics, good practice also prevents storms: **alert on symptoms users feel** (error rate,
latency against an SLO) rather than on every cause (CPU at 80%), and treat every page that needed no action as
a bug in the rule.

Two failure cases interviewers probe:

- **No data is not "all good".** If a service stops reporting, a rule like `errors > 5%` silently stops firing.
  Add explicit "absent data" rules for critical metrics.
- **Who watches the watcher?** Run a **dead man's switch**: an alert that always fires and is sent to an
  external service. If that external service stops hearing it, the alerting pipeline itself is broken.

## 13. Multi-tenancy and quotas

Many tenants share the same fleet, so every part of the design carries a **tenant ID**.

| Concern | How it is handled |
| --- | --- |
| **Identity** | The API key maps to a tenant at the gateway; the tenant ID travels with every sample, line and query |
| **Isolation of data** | Tenant ID is part of every series key, chunk path and cache key; queries are always filtered by it |
| **Ingest quotas** | Per-tenant limits on samples per second, active series, log bytes per second, label count and label length, enforced at the gateway with token buckets. Over the limit: `429` and a clear message |
| **Query quotas** | Per-tenant query concurrency, maximum series per query, maximum time range, fair queueing |
| **Noisy neighbours** | **Shuffle sharding**: each tenant is assigned a small random subset of ingesters and queriers, so one tenant's overload hits only its subset and few other tenants share exactly the same set |
| **Big tenants** | Dedicated partitions or even dedicated cells for the largest customers |
| **Billing** | Counters per tenant (hosts, series, GB ingested, GB retained) emitted from the gateway into a usage pipeline |

Quotas are not only about fairness. They are the guard rail that turns "one team added `user_id` as a label"
from a platform-wide outage into one rejected metric and an email to that team.

## 14. What breaks as it grows, and how to fix it

**The cardinality bomb.** One deploy creates 50 million new series. *Fix:* per-tenant and per-metric series
limits at the gateway, a top-series report, and agent-side relabelling to drop the offending label.

**Hot partitions.** One huge tenant or one popular metric lands on one Kafka partition and one ingester. *Fix:*
partition by series hash rather than by tenant alone, and shuffle-shard big tenants across more ingesters.

**The thundering dashboard.** During an incident, 500 engineers open the same 30-panel dashboard. *Fix:*
step-aligned results caching, query de-duplication in the frontend (identical in-flight queries share one
execution) and recording rules for the heavy panels.

**The log bill.** Log volume doubles every year. *Fix:* label-only indexing or short hot windows, exclusion rules,
converting log counts to metrics, cheaper object storage tiers and shorter default retention.

**Ingester restarts.** Replaying a large WAL can take minutes, during which recent data is missing. *Fix:*
replicate each series to several ingesters, roll out restarts one zone at a time, and checkpoint the WAL so replay
starts from a snapshot.

**Late and out-of-order data.** An agent that was offline for an hour flushes its buffer. *Fix:* accept samples
inside a bounded out-of-order window, and route very old data to a backfill path that writes separate blocks.

## 15. Reliability: the monitor must outlive what it monitors

| Risk | Defence |
| --- | --- |
| Platform briefly unreachable | Agents buffer locally and retry with backoff; data arrives late but arrives |
| Gateway crashes mid-request | It only answers `200` after Kafka has the data on several brokers; otherwise the agent retries |
| Ingester crashes | Its WAL rebuilds memory; replicas serve queries meanwhile; Kafka still holds unconsumed data |
| Duplicate delivery after a retry | Idempotent writes: same series and timestamp overwrites; consumers commit offsets after writing |
| Zone failure | Kafka, ingesters and stores replicated across zones; object storage is multi-zone by design |
| Ingest overloaded during a big incident | Alerting runs on its own query capacity and gets priority over dashboards; heavy ad-hoc queries are shed first |
| Monitoring itself fails silently | A separate, minimal **meta-monitoring** stack watches the platform, plus the dead man's switch |

A useful principle: **degrade freshness before availability**. During overload, it is better for dashboards to be
two minutes behind than for ingestion to reject data, because a backlog can be caught up and lost data cannot.

## 16. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Collection | Pull (scrape) | Push | **Both**: agent pulls locally, pushes batches to the platform; works across networks and tenants |
| Buffer before storage | Write directly | Kafka-like log | **Log**: absorbs spikes, allows replay and fan-out, at the cost of one more system |
| Metrics storage | General database | TSDB with chunks | **TSDB**: ~1.4 bytes per sample, append-only, range reads |
| Old metric data | Keep raw forever | Rollups + retention | **Rollups** with min/max/sum/count: 20× fewer points, spikes still visible |
| Log indexing | Full inverted index | Labels only + scan | **Depends on the product**: index for fast arbitrary search, labels-only for cost at scale; often hot index + cheap archive |
| Trace sampling | Head | Tail | **Tail** for keeping errors and slow requests, head where memory is tight |
| Consistency | Every sample exact | Small loss tolerated | **Tolerated**: high throughput and low cost matter more than one missing point |
| Alert noise | Page on every rule | Group, inhibit, silence, `for` | **Group and route**: one page per incident to the right team |

## Cheat sheet for last-minute revision

- **Three signals:** metrics (cheap numbers; *that* something is wrong), logs (expensive text; *why*), traces
  (one request across services; *where*).
- **Pipeline:** agents (pull locally, push batches) → ingest gateway (auth, quotas) → Kafka (durable buffer,
  replay, fan-out) → per-signal ingesters → per-signal stores (recent in memory, old in object storage) → query
  layer → dashboards and rule evaluator → alert manager.
- **Golden rule:** answer `200` only once data is durably in the buffer; at-least-once + idempotent writes.
- **Series = name + sorted labels.** Memory scales with active series. **Cardinality explosion** (user IDs as
  labels) is the classic failure; fix with limits, relabelling and education.
- **TSDB:** WAL + in-memory chunks + 2-hour blocks in object storage; label inverted index; Gorilla-style
  compression (delta-of-delta timestamps, XOR values) ≈ 1.4 bytes per sample instead of 16.
- **Retention tiers:** raw 15 days → 5-min rollups 90 days → 1-hour rollups 13 months; keep min/max/sum/count;
  percentiles from histogram buckets, never averaged.
- **Logs:** full inverted index (fast any search, costly writes and storage) vs labels-only + parallel scan of
  compressed chunks (cheap writes, pay at query time).
- **Queries:** split by day, cache completed days, align to the step, pick the rollup tier, recording rules for
  heavy expressions, per-tenant limits.
- **Alerts:** rule + `for` duration, states inactive → pending → firing → resolved; alert manager de-duplicates,
  groups, inhibits, silences and routes; dead man's switch watches the watcher.
- **Multi-tenancy:** tenant ID everywhere, per-tenant ingest and query quotas, shuffle sharding.
- **Numbers:** 100M active series → ~6.7M samples/s → ~0.9 TB/day compressed; logs ~1 GB/s → ~86 TB/day raw,
  ~9 TB compressed; alert queries outnumber dashboard queries.

## Practice questions

1. **A team's dashboards suddenly take 30 seconds to load. How do you investigate?** Check the series count of
   the metrics involved (a new high-cardinality label is the usual cause), whether the query falls back from
   rollups to raw data because of its range or step, the results cache hit rate, and whether the tenant is
   hitting query concurrency limits. Fix with a recording rule or by removing the label.
2. **How would you alert on "a host stopped sending data"?** Absence is not a value, so an ordinary threshold
   rule never fires. Use a rule on the absence of the series (or on the time since its last sample) for each
   expected host, and use the agent's own heartbeat metric.
3. **How would you support a "live tail" of logs?** Add another consumer group on the Kafka logs topic that
   filters by the user's labels and streams matching lines over a WebSocket. It reads the buffer, not the store,
   so it adds no load to the indexers.
4. **A customer wants 2 years of raw-resolution metrics. What does it cost?** Using our numbers, one tenant's
   share of ~0.9 TB a day for 730 days, plus longer queries scanning far more chunks. Offer it as a paid
   retention tier on cheaper object storage, and steer them towards rollups for anything older than weeks.
5. **Why not store logs in the time-series database, or metrics in the log store?** Metrics are small numbers
   that compress to about a byte and a half and are read as ranges of one series; logs are large, varied text searched by
   content. Storing either in the other's engine wastes either compression or search ability. They share the
   ingestion pipeline and query layer, not the storage engine.
