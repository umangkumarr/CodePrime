---
title: "Design a Distributed Web Crawler"
description: "Design a crawler for a billion pages a day: the URL frontier, politeness and robots.txt, Bloom filters, simhash dedupe, recrawl scheduling and traps."
difficulty: "Hard"
sidebar:
  label: "Web crawler"
tags: ["Crawling", "Queues", "Bloom filters", "Hashing", "Sharding"]
---

A web crawler sounds like a ten-line script: download a page, find the links, download those, repeat. That
script works for a hundred pages. At a billion pages a day it becomes several hard systems in one. It is a
**to-do list** with tens of billions of entries that must decide, every millisecond, which page is most worth
fetching next. It is a **polite guest** that must never hammer one small website while it races through millions
of others. It is a **memory** that must answer "have I seen this URL before?" billions of times a day without
storing every URL in RAM. And it is a **librarian** who notices when a page has changed and comes back at the
right time.

This case study builds that crawler from first principles. The crawler's output feeds a search engine; what
happens to pages after they are fetched (parsing for the index, ranking, serving queries) is covered in
[Design a Web Search Engine](/system-design/case-studies/medium/google-search/).

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Crawling in 5 minutes: the loop and the vocabulary

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Seed URLs** | The hand-picked starting points: popular sites, directories, submitted sitemaps | The first few books on a reading list |
| **URL frontier** | The data structure holding every URL waiting to be fetched, and deciding the order | A to-do list that sorts itself |
| **Fetcher** | A worker that downloads one URL over HTTP | A courier sent to collect a parcel |
| **Host** | The machine name in a URL (`news.example.com`); politeness is applied per host | One shop on a high street |
| **robots.txt** | A file at the root of each site saying which paths crawlers may visit | The "Staff only" sign on a door |
| **Politeness** | Never sending one host more requests than it can comfortably serve | Not ringing the same doorbell every second |
| **Normalisation** | Rewriting a URL into one standard spelling so that duplicates look identical | Writing every address in the same format |
| **Seen-URL set** | The record of every URL already discovered, so none is queued twice | A guest list at the door |
| **Fingerprint** | A short hash of a page's content, used to spot copies | A thumbprint |
| **Recrawl** | Fetching a known page again to see whether it changed | Re-reading the news board each morning |

Every crawler, from a student project to a search engine, runs the same loop:

[![The crawl loop: seed URLs enter the URL frontier, which hands the next URL to the fetch step; the page is parsed and stored, its links are extracted, normalised and checked for scope and traps, then tested against the seen-URL set; new URLs return to the frontier and the rest are skipped](/img/system-design/web-crawler/01-crawl-loop.png)](/img/system-design/web-crawler/01-crawl-loop.png)

*Select the diagram to zoom in and move around.*

Three facts from this loop shape the whole design:

1. **The loop feeds itself.** Each page yields tens of links, so the to-do list grows far faster than we can work
   through it. The crawler is never short of work; it is always short of **time**, so choosing what to fetch next
   is the central problem.
2. **The bottleneck is other people's servers, not ours.** We could fetch thousands of pages a second from one
   site, but that would knock it over. Speed must come from fetching **many different hosts in parallel**, each
   slowly.
3. **Most discovered links are not new.** Every page links to the site's home page, its menu, its footer. The
   "have I seen it?" check runs on every link, so it must be very cheap.

## 2. Requirements

### Functional (what the crawler does)

- Start from **seed URLs** and discover pages by following links, plus URLs listed in **sitemaps**.
- **Fetch** HTML pages (and, optionally, PDFs and other text documents) over HTTP and HTTPS.
- **Respect robots.txt** and per-host politeness limits.
- **Store** each fetched page with its headers and fetch time, for the indexer and other consumers.
- **De-duplicate**: never queue the same URL twice, and recognise pages whose content is a copy of another.
- **Recrawl** known pages so the stored copies stay fresh, sooner for pages that change often.
- **Prioritise**: important pages first, both for discovery and for recrawls.
- Hand new and changed pages to downstream consumers (search indexing, archiving, analytics).

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Throughput** | About **1 billion pages a day** | Enough to keep a large index fresh |
| **Politeness** | At most one open connection per host, and a pause between requests | Website owners block crawlers that hurt them, and it is the right thing to do |
| **Robustness** | Survive malformed HTML, slow or hostile servers, infinite link mazes | The web is messy and sometimes adversarial |
| **Scalability** | Add machines to crawl more; no single machine holds all state | Linear growth in throughput |
| **Fault tolerance** | A machine dying loses at most a few minutes of work, never the frontier | A crawl runs for months |
| **Freshness** | Popular, fast-changing pages re-fetched within hours; the long tail within weeks | Stale copies mean stale search results |
| **Extensibility** | New content types or new processing steps plug in without a redesign | Requirements change |

### Out of scope

Indexing and ranking (see the [search engine case study](/system-design/case-studies/medium/google-search/)),
images and video, pages behind logins or forms (the "deep web"), and fighting search spam. Mention them, then
set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** we keep a collection of **15 billion pages** fresh, revisiting each on average every **15
days**, which is $15\text{B} / 15 = 1\text{B}$ fetches a day. An average HTML page is **100 KB** (many servers
send it gzip-compressed, but we budget for the full size). Pages compress about **4:1** in storage. We know of
roughly **100 billion URLs** in total (most are never worth fetching). An average fetch takes about **1 second**
from connect to last byte.

**Fetch rate and bandwidth**

- $1\text{B} / 86{,}400 \approx$ **11,600 pages per second** on average. Unlike a user-facing service, we choose
  this rate ourselves, but we provision about **2×** so the crawler can catch up after an outage.
- Bandwidth: $11{,}600 \times 100\text{ KB} \approx 1.16\text{ GB/s} \approx$ **9.3 Gbit/s** sustained, about
  20 Gbit/s with headroom.
- Concurrent connections (Little's law: in flight = rate × time each takes):
  $11{,}600 \times 1\text{ s} \approx 11{,}600$ open connections, more when servers are slow. With asynchronous I/O one machine holds
  thousands, so this is spread over a modest fleet.

**Politeness turns into parallelism**

- If each host is fetched at most once every few seconds, then reaching 11,600 pages per second needs **tens of
  thousands of hosts in flight at any moment**. The frontier must always have many different hosts ready. This is
  why its design (section 7) is the heart of the problem.

**Storage**

- Raw pages per day: $1\text{B} \times 100\text{ KB} = 100\text{ TB}$, about **25 TB compressed**.
- Latest copy of every page: $15\text{B} \times 25\text{ KB} \approx 375\text{ TB}$, about **1.1 PB** with three
  replicas. Keeping history (every version) is an archive's job and multiplies this.
- Seen-URL set, exact: $100\text{B} \times 8\text{ bytes} = 800\text{ GB}$ of 64-bit URL hashes. A Bloom
  filter (section 8) needs about **120 GB** for a 1% false-positive rate.
- URL metadata (status, last fetch, change rate, priority), roughly 200 bytes per URL:
  $100\text{B} \times 200 = 20\text{ TB}$.

Three conclusions follow:

1. **Bandwidth and politeness, not CPU, set the pace.** The design must keep many hosts busy at once.
2. **The seen-URL set and the frontier do not fit on one machine.** Both must be sharded.
3. **Page storage is big but simple**: append-only files in an object store.

## 4. The API

A crawler has no end users, so its "API" is a small **control plane** for operators and an **event stream** for
consumers.

| Method and path | What it does |
| --- | --- |
| `POST /v1/crawls` | Start or update a crawl: seed URLs, scope rules (allowed domains, content types), budget. |
| `POST /v1/urls` | Submit URLs (or a sitemap) for priority fetching, for example "this page just changed". |
| `GET /v1/urls/{url_hash}` | Status of one URL: last fetch, HTTP status, next scheduled visit, why it was skipped. |
| `PUT /v1/hosts/{host}/policy` | Override politeness for one host: slower, faster (for a site that asked), or blocked. |
| Topic `pages.fetched` | One event per fetched page: URL, status, content location, checksum, simhash, whether it changed. |

Consumers read `pages.fetched` instead of calling the crawler. A search indexer, an archive and an analytics job
each read the same stream at their own pace.

## 5. High-level design

[![High-level architecture: seeds and sitemaps feed the URL frontier, which hands the next URL to the fetchers; fetchers look up the DNS and robots cache, fetch from the web, and write pages to the page store, which feeds the indexing pipeline and the parser; the parser checks the fingerprint store for duplicates and sends links to the URL filter, then the seen-URL set; new URLs go into the URL database, and the scheduler enqueues new and due URLs back into the frontier](/img/system-design/web-crawler/02-architecture.png)](/img/system-design/web-crawler/02-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **URL frontier:** holds URLs waiting to be fetched and hands each fetcher a URL that is important **and** whose
  host may be contacted now.
- **Fetchers:** download pages with asynchronous HTTP, at most one connection per host.
- **DNS + robots cache:** host-to-IP answers and each host's robots.txt rules, kept in memory so fetches don't wait
  on them.
- **Page store:** raw responses written to large append-only files in an object store.
- **Parser:** extracts text and links, computes content fingerprints and checks the **fingerprint store** for
  copies.
- **URL filter:** normalises each link and drops out-of-scope URLs and traps.
- **Seen-URL set:** answers "have we ever seen this URL?" for billions of URLs.
- **URL database:** one row per known URL: status, fetch history, change rate, next visit.
- **Scheduler:** decides what goes into the frontier: new URLs and known URLs due for a recrawl.
- **Indexing pipeline:** downstream consumer of new pages (not part of the crawler).

The single most useful idea in this design: **separate "what to fetch" (priority) from "when a host may be
fetched" (politeness)**. Mixing them in one queue either starves important pages or hammers popular hosts.

## 6. Flow: fetching one URL

[![Sequence for fetching one URL: the fetcher asks the frontier for work and receives example.com/a because that host is due; it resolves the host in the DNS cache, asks the robots cache whether /a is allowed (fetching robots.txt first on a miss), sends a conditional GET, receives 200 with HTML or 304, saves the page and headers, and tells the frontier the host's next visit time](/img/system-design/web-crawler/04-fetch.png)](/img/system-design/web-crawler/04-fetch.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The frontier only hands out a URL whose host is due.** The fetcher never has to wait or check politeness itself.
- **DNS is cached.** Every fetch needs an IP address, and a DNS lookup can take tens to hundreds of milliseconds.
  Standard resolver libraries are often blocking, so large crawlers run their own asynchronous resolver and
  cache answers for their **TTL** (time to live, the lifetime the domain owner set). They also resolve hosts
  ahead of time, when a link is first queued.
- **robots.txt is fetched once per host and cached**, not before every page (details in section 9).
- **The GET is conditional.** We send `If-None-Match` with the **ETag** (a version tag the server gave us last
  time) or `If-Modified-Since` with the last fetch date. If nothing changed, the server answers `304 Not Modified`
  with no body: almost free for both sides.
- **The host is released with a delay.** Step 10 tells the frontier when this host may be contacted again. That
  is how politeness is enforced.

## 7. Deep dive: the URL frontier

The frontier must do two jobs at once:

- **Priority:** fetch important pages first (a news home page before a 2009 forum post).
- **Politeness:** never have two requests to one host in flight, and wait between requests.

A single priority queue fails the second job: the top 1,000 URLs might all be on one popular site. A queue per
host fails the first: it treats every host as equally important. The classic answer is the design from the
**Mercator** crawler (Heydon and Najork, 1999), also taught in Manning, Raghavan and Schütze's *Introduction to
Information Retrieval*: **front queues for priority, back queues for politeness**.

[![Mercator-style frontier: new and due URLs pass through a prioritiser into front queues 1 to F by priority; a selector draws from high queues often and low ones rarely; a back router puts each URL into the back queue that holds only its host; a ready heap orders hosts by next allowed fetch time and tells the fetcher thread which back queue's head URL to take](/img/system-design/web-crawler/03-frontier.png)](/img/system-design/web-crawler/03-frontier.png)

*Select the diagram to zoom in and move around.*

**Front queues: priority.** A **prioritiser** scores each URL and appends it to one of **F** front queues, say
F = 10, from most to least important. Signals for the score:

- How important the page probably is: links pointing to it so far, an estimate of PageRank (a link-based importance score), the site's quality.
- For a recrawl: how likely it has changed, and how much a stale copy costs (a busy news page versus an old article).
- Freshness requests from outside, such as a sitemap saying "this changed".

A **selector** takes URLs from the front queues with a **bias**: queue 1 is chosen most often, queue F rarely,
but never zero, so low-priority URLs are not starved forever.

**Back queues: politeness.** There are **B** back queues, and each one holds URLs of **exactly one host**. A small
table maps host to back queue. Alongside them sits a **ready heap** (a priority queue) with one entry per back
queue: the earliest time its host may be contacted again.

The cycle, for one fetcher thread:

1. Pop the top of the heap: the host whose next allowed time is earliest. Wait if that time is in the future.
2. Take the URL at the head of that host's back queue and fetch it.
3. Push the host back on the heap with `next_time = now + delay`. A common rule makes the delay a multiple of how
   long the last fetch took (for example 10×), so a slow, struggling server is automatically visited less often.
4. If that back queue is now empty, refill it: pull URLs from the front queues (through the selector) and route
   each to its host's back queue, until one arrives whose host has **no** back queue yet. That host takes over the
   empty queue.

Why this works: there are always **many hosts** in the heap, so fetchers are never idle while one host waits out
its delay. Mercator's rule of thumb was about **three times as many back queues as fetcher threads**.

**Making it fit in memory.** The frontier holds billions of URLs, far more than RAM. Each queue is a file on disk
with only its **head and tail buffered in memory**: we only ever append to the tail and read from the head, so
disk access stays sequential and fast. On restart, the queues are recovered from disk.

**What order should the crawl take?** A plain breadth-first crawl (fetch everything one link from the seeds, then
two links, and so on) already finds high-quality pages early, because good pages are linked from many places.
Priority scoring improves on it; depth-first is a bad idea because it dives into one site's deepest corners.

## 8. Deep dive: the seen-URL set at billions scale

Every extracted link must be checked: "have we seen this URL before?" At 11,600 pages a second and, say, 50 links
per page, that is **580,000 checks per second**, against 100 billion URLs.

**Step 1: store hashes, not URLs.** URLs average around 80–100 bytes. A 64-bit hash of the normalised URL is 8 bytes.
Collisions are rare but not impossible: with $n = 10^{11}$ URLs, the expected number of colliding pairs is about
$n^2 / 2^{65} \approx 270$. A collision makes one new URL look "seen", so we lose a few hundred pages out of 100
billion, which is acceptable.

**Step 2: a Bloom filter in front of an exact set.**

[![Seen-URL check: an extracted link is normalised and hashed to a 64-bit fingerprint, then tested in the in-memory Bloom filter; if it is definitely new it is inserted into both the filter and the exact set and sent to the frontier; if the filter says maybe seen, the sharded exact set on SSD decides: found means skip, not found means insert and enqueue](/img/system-design/web-crawler/05-seen-check.png)](/img/system-design/web-crawler/05-seen-check.png)

A **Bloom filter** is a bit array of $m$ bits with $k$ hash functions. To add a URL, set the $k$ bits its hashes
point to. To test a URL, check those $k$ bits: if any is 0, the URL is **definitely new**; if all are 1, it is
**probably seen** (the bits might have been set by other URLs). It never gives a false "new", only a false "seen".

The maths, for $n$ items:

- False-positive rate: $p \approx \left(1 - e^{-kn/m}\right)^k$.
- Best number of hash functions: $k = \frac{m}{n} \ln 2$.
- Bits needed per item for a target $p$: $\frac{m}{n} = \frac{-\ln p}{(\ln 2)^2} \approx 1.44 \log_2 \frac{1}{p}$.

| Target false-positive rate | Bits per URL | Hash functions | Size for 100B URLs |
| --- | --- | --- | --- |
| 1% | 9.6 | 7 | 120 GB |
| 0.1% | 14.4 | 10 | 180 GB |

Two ways to use it:

- **Bloom filter alone.** Accept that 1% of genuinely new URLs are wrongly skipped. Many crawlers do this: losing
  1% of the long tail is a fair price for never touching disk.
- **Bloom filter + exact set** (the diagram). The filter answers "definitely new" for most new URLs instantly. Only
  "maybe seen" answers (mostly real repeats) go to an exact set of 64-bit hashes in a sharded key-value store on
  SSD. Nothing is lost, and the expensive lookup is only paid for repeats.

Practical details:

- **Shard by host hash**, the same key as the frontier (section 13), so most checks are local to one machine.
- **Batch** the exact lookups: sort a few thousand pending hashes and look them up together, which turns random
  reads into a sequential scan (Mercator did this against a sorted file on disk).
- A plain Bloom filter **cannot delete**. That is fine: URLs are never "un-seen". Recrawls are driven by the URL
  database, not by rediscovery.
- Keep a small in-memory cache of very popular URLs (home pages, login pages): they make up a large share of
  repeat links.

## 9. Deep dive: politeness and robots.txt

**robots.txt** lives at `https://host/robots.txt` and is standardised as the Robots Exclusion Protocol (RFC 9309,
2022). It groups rules by crawler name (`User-agent`) and lists `Allow` and `Disallow` path prefixes:

```text
User-agent: *
Disallow: /cart/
Disallow: /search
Allow: /search/help
```

The most specific (longest) matching rule wins, so `/search/help` is allowed and `/search?q=x` is not.

How a crawler should handle it:

- **Cache it per host.** RFC 9309 says a cached copy should not be used for more than 24 hours unless the file
  cannot be reached. Store the parsed rules, not the raw text.
- **Status codes matter.** A `4xx` (for example 404, no file) means no restrictions. A `5xx` or a network failure
  means "assume everything is disallowed" for now, because the site might be in trouble; keep using the last good
  copy if there is one.
- **Limit the size**: the RFC asks crawlers to parse at least the first 500 KiB, so a huge file cannot exhaust memory.
- **Crawl-delay** ("wait N seconds between requests") is **not** part of the standard. Some crawlers honour it,
  some ignore it. A careful crawler honours it within sane bounds.
- **Identify yourself**: a clear `User-Agent` with a URL explaining the crawler and how to contact you.

**Politeness beyond robots.txt:**

- **One connection per host at a time**, guaranteed by the back-queue design.
- **A delay between requests**, at least about a second, longer for slow hosts (the 10× rule in section 7).
- **Back off on distress.** `429 Too Many Requests` and `503 Service Unavailable` mean "slow down"; honour their
  `Retry-After` header and lengthen that host's delay.
- **Per-IP limits too.** Thousands of small sites can share one IP address on a shared host. If we only limit per
  host name, we could still overload that one machine, so add a second limit per IP address.
- **Off-peak crawling** of a site in its local night-time is a kindness some crawlers add.

## 10. Deep dive: URL normalisation and traps

### Normalisation: one spelling per page

The same page can be written many ways. Without normalisation, the seen-URL set treats each spelling as new and
we fetch the page again and again.

| Rule | Before | After |
| --- | --- | --- |
| Resolve relative links against the page's URL | `../about` on `https://a.com/x/y` | `https://a.com/about` |
| Lowercase scheme and host | `HTTPS://Example.COM/A` | `https://example.com/A` (the path keeps its case) |
| Drop the default port | `http://a.com:80/` | `http://a.com/` |
| Remove `.` and `..` segments | `/a/./b/../c` | `/a/c` |
| Drop the fragment | `/page#section-2` | `/page` (the server never sees it) |
| Normalise percent-encoding | `%7e`, `%41` | `~`, `A` (unreserved characters decoded, hex in uppercase) |
| Remove tracking and session parameters | `?id=7&utm_source=mail&sid=8f3a` | `?id=7` |

The first six rules are safe: they follow from the URL standard (RFC 3986) and never change which page the
server returns. The last is a **heuristic**:
`sid=` or `utm_source=` almost never change the content, but a site could use any name for anything. Heuristics
are checked against evidence: if two URLs keep producing the same content fingerprint, they are probably
duplicates, and a page's `<link rel="canonical">` tag tells us which spelling the site prefers.

### Traps: links that never end

A **crawler trap** (or spider trap) is a part of a site that generates an endless supply of new URLs. Some are
accidents, some are deliberate.

- **Infinite calendars:** "next month" links forever: `/cal/2026/12`, `/cal/2027/01`, … `/cal/9999/12`.
- **Session IDs in URLs:** every visit gets a new `?sid=...`, so every link on every page looks new.
- **Repeating paths:** a relative-link bug produces `/a/b/a/b/a/b/...`.
- **Faceted search:** a shop with 20 filters has millions of combinations (`?colour=red&size=9&sort=price`).
- **Soft 404s:** a server answers `200 OK` with "page not found" for any URL, so made-up links never fail.

Defences, cheapest first:

- **Hard limits:** maximum URL length (around 2,000 characters), maximum path depth, maximum number of query
  parameters, maximum repeated path segment.
- **A page budget per host**, scaled by the host's importance: a small blog gets thousands of pages, a major news
  site millions. A trap can waste at most its host's budget.
- **Content signals:** if a host keeps producing pages that are near-duplicates of each other (section 11), shrink
  its budget and lower its URLs' priority.
- **Pattern detection:** URLs that differ only by an increasing number or date are flagged.
- **Prioritisation itself:** trap pages have almost no links from other sites, so they sink to the bottom of the
  front queues and are rarely reached.

## 11. Deep dive: content de-duplication

Different URLs often serve the same content: mirrors, `http` and `https` versions, printer-friendly copies, the
same article syndicated to many sites. Large studies of web crawls have found a substantial fraction of pages to be
exact or near copies. Storing and indexing them all wastes money, and showing them all in search results is
useless.

[![Content de-duplication: the page's main text is checksummed for an exact-copy lookup in the checksum index; separately it is cut into weighted 3-word shingles, each hashed to 64 bits, the bits are voted on, and the signs give the simhash, which is looked up in fingerprint tables where pages are near-duplicates if at most 3 bits differ](/img/system-design/web-crawler/06-simhash.png)](/img/system-design/web-crawler/06-simhash.png)

*Select the diagram to zoom in and move around.*

**Exact copies: a checksum.** Hash the page's main text (after removing menus, ads and timestamps that differ on
every load) with a strong hash. Equal checksums mean identical content. One lookup in a checksum index answers it.

**Near copies: simhash.** Two pages that differ only in a date or an advert have completely different checksums.
**Simhash** (Charikar, 2002) produces fingerprints where **similar documents get similar fingerprints**:

1. Split the text into **features**, for example every run of three consecutive words (a **shingle**), each with a
   weight (how often it appears).
2. Hash each feature to 64 bits.
3. Keep 64 counters, one per bit position. For each feature, for each bit: add its weight if the bit is 1,
   subtract it if the bit is 0.
4. The fingerprint's bit $i$ is 1 if counter $i$ ended positive, else 0.

Changing a few words changes a few features, which nudges a few counters, which flips few (often no) bits. The
**Hamming distance** (number of differing bits) between two fingerprints measures how different the pages are.
Google's 2007 paper on near-duplicate detection for crawling (Manku, Jain and Das Sarma) used 64-bit simhashes and
treated pages within **3 bits** as near-duplicates.

**Finding near matches fast.** Comparing a new fingerprint with billions of others is too slow. The trick: split the
64 bits into, say, 4 blocks of 16. If two fingerprints differ in at most 3 bits, at least one block is **identical**
(three differences can touch at most three blocks). So keep tables sorted by each block, look up exact matches on
each block, and only compare the few candidates fully.

What to do with a duplicate: store a pointer to the original instead of a second copy, don't index it again, and
**don't extract its links** if they are the same (that is also a trap defence).

## 12. Deep dive: recrawling and freshness

The web changes constantly: news home pages every few minutes, product prices daily, most old articles never. With a
fixed budget of a billion fetches a day, **when** we revisit each page decides how fresh the collection is.

Two measures:

- **Freshness:** the fraction of our stored copies that still match the live page.
- **Age:** how long a stale copy has been out of date. A copy that went stale a minute ago hurts less than one a
  month out of date.

**Estimating how often a page changes.** Each fetch tells us one bit: changed since last time or not (by checksum, or
a `304`). A simple model treats changes as random events at a page-specific rate $\lambda$ (a Poisson process). The
naive estimate, "changes seen ÷ time watched", is too low: if a page changed three times between two visits we only
see one change. Cho and Garcia-Molina's work on change-frequency estimation gives corrected estimators; a practical
version is simply **adaptive**:

```text
if page changed since last visit:  interval = max(min_interval, interval / 2)
else:                              interval = min(max_interval, interval * 1.5)
next_visit = now + interval × importance_factor
```

The interval homes in on how often the page really changes, clamped between, say, an hour and a few months.

**A counter-intuitive result.** You might expect "visit each page in proportion to how often it changes" to be best.
It is not, for average freshness: a page that changes every few minutes is stale again almost immediately, so
fetching it constantly buys little. Cho and Garcia-Molina showed that under a fixed budget, spending a bit less on
the fastest-changing pages and more on the medium ones gives a fresher collection overall. In practice
**importance** overrides this: a news front page is worth fetching often even if it is never fully fresh.

**Cheap signals that a page changed:**

- **Conditional GETs** (`ETag`, `Last-Modified`) make an unchanged revisit cost a few hundred bytes.
- **Sitemaps** list URLs with a `<lastmod>` date; many sites keep them accurate.
- **RSS and Atom feeds** announce new articles within minutes.
- **Push protocols** such as IndexNow let a site notify participating search engines that a URL changed.

The **scheduler** reads `next_visit` from the URL database (a range scan over a `next_visit` index, one shard at a
time) and feeds due URLs to the frontier with a priority reflecting importance and how overdue they are. Put
together, every URL moves through a small set of states:

[![Life of a URL: DISCOVERED then QUEUED when scheduled, FETCHING when its host is due, FETCHED on 200 or 304, then AWAITING RECRAWL until its due time returns it to QUEUED; from FETCHING a timeout, 5xx or 429 leads to RETRY WAIT which returns to QUEUED after backoff or to GONE when retries are used up; 404 or 410 leads to GONE; a robots.txt disallow leads to BLOCKED](/img/system-design/web-crawler/08-url-states.png)](/img/system-design/web-crawler/08-url-states.png)

*Select the diagram to zoom in and move around.*

## 13. Deep dive: distributing the crawl

One machine cannot fetch 11,600 pages a second, hold the frontier and answer half a million seen-URL checks a
second. We need perhaps a hundred crawler nodes. The question is how to split the work.

**Partition by host.** Each host is assigned to exactly one node by hashing the host name (consistent hashing, so
adding a node moves only a small share of hosts).

[![Distributing the crawl: example.com, news.org and blog.io hash to crawler nodes A, B and C, and each node alone fetches its hosts; when node A finds links to other hosts it sends them to the URL exchange, which routes news.org URLs to node B and blog.io URLs to node C using the host assignment ring](/img/system-design/web-crawler/07-partition.png)](/img/system-design/web-crawler/07-partition.png)

*Select the diagram to zoom in and move around.*

Why by host and not by URL:

- **Politeness stays local.** One node owns all of `news.org`, so its back queue and delay timer are in one place.
  Partitioning by URL would put `news.org` pages on many nodes, and they would need to coordinate on every request.
- **Caches stay local.** DNS answers and robots.txt rules for a host live on its node.
- **Most links are local.** A large share of links point within the same site, so the node that found them owns them.

Links to other hosts go through a **URL exchange**: each node batches the foreign URLs it discovers (thousands per
message) and sends them to the owning node, through a message queue such as Kafka with one topic or partition per
node. Batching matters: one message per URL would swamp the network. Each node then runs the seen-URL check for
its own hosts.

Refinements:

- **Hash the registered domain, not the full host**, if you want `a.blog.io` and `b.blog.io` (often one server) to
  share one politeness budget. The per-IP limit from section 9 catches the rest.
- **Very large sites** (a major platform with billions of pages) may get a dedicated, higher rate negotiated with
  the site and spread over several fetch workers, all still governed by one rate limiter for that host.
- **Geography:** placing crawler nodes in several regions and assigning hosts to the nearest region cuts latency and
  cross-ocean bandwidth.

## 14. Deep dive: storing fetched pages

- **Append-only container files.** Pages are written into large files (hundreds of MB to a few GB), compressed per
  record, in an object store. The **WARC** format (an ISO standard used by the Internet Archive and Common Crawl)
  stores each request, response headers and body as one record. Large files are cheap to write and easy to
  replicate; millions of tiny files are not.
- **A pointer per URL.** The URL database records `(file, offset, length)` for the latest copy, so any page can be
  read back with one ranged read.
- **Only changed content is new.** An unchanged recrawl (`304`, or the same checksum) updates timestamps in the URL
  database and writes no new body.
- **URL database layout:** a wide-column store (Bigtable, HBase or Cassandra style) keyed by the **reversed host**
  plus path, for example `com.example.www/news/1`, so all pages of one site sit together. Columns: status, last
  fetch, ETag, checksum, simhash, change rate, next visit, priority, failure count.

## 15. Deep dive: JavaScript-rendered pages

Many modern sites send an almost empty HTML "shell" and build the page in the browser with JavaScript. A plain
fetcher sees no text and no links.

The usual approach is **two passes**:

1. Fetch the HTML as normal and extract whatever text and links it has.
2. If the page looks JavaScript-dependent (little visible text, a known framework's app shell, important links
   missing), put it in a **render queue**. A pool of **headless browsers** (a browser without a screen, for example
   headless Chromium) loads the page, runs its scripts, waits for network activity to settle, and gives back the
   rendered page. Links and text are extracted from that.

Rendering costs far more than a plain fetch (a browser process, many sub-requests for scripts, much more CPU and
memory), so it is **rationed**: only pages that need it, important pages first. Script and style files are fetched
under the same politeness rules and **cached across pages**, since a site's pages share the same bundles. Google
documents publicly that its own pipeline crawls, then renders in a queue, then indexes, which is the same shape.

## 16. Reliability: failures and retries

| Risk | Defence |
| --- | --- |
| A fetch times out or gets `5xx` | Retry with exponential backoff (for example 1 hour, 4 hours, 1 day), then mark the URL **GONE** for a while |
| `429` or `503` with `Retry-After` | Pause that **whole host**, not just the URL, and lengthen its delay |
| `404` / `410` | Mark the URL gone; recheck rarely in case it returns |
| Redirect chains and loops | Follow up to about five hops; record a `301` target as the canonical URL, treat `302` as temporary |
| A slow or hostile server (drips one byte a second, sends a 10 GB file) | Connect and total-time limits per fetch, a maximum body size, content-type checks |
| A fetcher crashes mid-fetch | URLs are **leased**: if not completed within the lease time, the frontier hands them out again |
| A crawler node dies | Its frontier queues are on replicated disk (or rebuilt from the URL database); the hash ring reassigns its hosts to other nodes |
| A bug floods the frontier with junk | Per-host budgets cap the damage; the URL database lets you rebuild the frontier from scratch |

The state diagram in section 12 shows where each failure leaves a URL. The pattern to remember: **every URL's state lives in the URL database, and the frontier is a fast, rebuildable
view of it.** Losing a node loses a few minutes of fetching, never the crawl.

## 17. What breaks as it grows, and how to fix it

**The giant host.** One site with billions of URLs dominates the frontier. *Fix:* per-host budgets and priority
scoring, so the long tail of that site waits behind everyone else's important pages.

**DNS becomes the bottleneck.** Without a cache, every fetch is a lookup: over ten thousand a second, which
overwhelms ordinary resolvers. *Fix:* a dedicated
asynchronous resolver tier with a large cache, prefetching when links are queued.

**The frontier runs dry of ready hosts.** All due URLs belong to a handful of hosts, so fetchers sit idle waiting on
politeness delays. *Fix:* more back queues and a selector that favours URLs from hosts not already queued.

**The seen-URL set outgrows RAM.** *Fix:* Bloom filters per shard plus an SSD-backed exact set, with batched lookups.

**Duplicate and trap content wastes the budget.** *Fix:* simhash on every page, per-host duplicate rates feeding
budgets, URL pattern rules.

**Cross-node traffic.** Every node sends URLs to every other node. *Fix:* batch and compress the exchange, and drop
already-seen URLs locally with a small cache before sending.

## 18. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Frontier structure | One priority queue | Front (priority) + back (per-host) queues | **Front + back**: priority and politeness are separate concerns |
| Partition key | URL hash | Host hash | **Host**: politeness, DNS and robots stay on one node |
| Seen-URL set | Exact set only | Bloom filter (with optional exact set) | **Bloom in front of exact**: RAM-speed for new URLs, no losses |
| Duplicate detection | Checksum only | Checksum + simhash | **Both**: checksums are cheap and exact; simhash catches near copies |
| Recrawl policy | Fixed interval | Adaptive per page | **Adaptive**, weighted by importance |
| JavaScript | Never render | Render everything | **Render selectively**: rendering is expensive, most pages don't need it |
| Storage | One file per page | Large append-only WARC files | **Large files**: cheap, sequential, easy to replicate |

## Cheat sheet for last-minute revision

- **The loop:** frontier → fetch (DNS, robots, conditional GET) → store → parse → extract links → normalise →
  filter traps → seen-URL check → new URLs back to the frontier.
- **Frontier (Mercator):** **front queues** by priority with a biased selector; **back queues** one host each; a
  **heap** of next-allowed times per host; delay ≈ a multiple of the last fetch time; about 3× back queues per thread.
- **Politeness:** robots.txt cached ≤ 24 h (RFC 9309; `4xx` = allow all, `5xx` = disallow all), one connection
  per host, back off on `429` / `503`, also limit per IP. Crawl-delay is non-standard.
- **Seen-URL set:** 64-bit hashes; Bloom filter $m/n = -\ln p / (\ln 2)^2$ (9.6 bits per URL at 1%, $k = 7$);
  exact sharded set behind it for "maybe seen".
- **Normalisation:** lowercase host, drop default port, `.`/`..`, fragment, tracking and session parameters; use
  `rel=canonical`.
- **Traps:** URL length/depth limits, per-host budgets, near-duplicate rates, low priority for pages nobody links to.
- **Content dedupe:** checksum for exact; **simhash** (64 bits, ≤ 3 bits apart = near-duplicate), block tables
  for fast lookup.
- **Freshness:** adaptive revisit interval (halve on change, grow when unchanged), weighted by importance;
  sitemaps, feeds and `304`s make it cheap.
- **Distribution:** partition **by host hash**; batch foreign links through a URL exchange.
- **Reliability:** leases, backoff, URL database as the source of truth, frontier rebuildable.
- **Numbers:** 1B pages/day ≈ 11,600/s, ≈ 9 Gbit/s, ≈ 25 TB/day compressed; 100B URLs → ~120 GB Bloom filter.

## Practice questions

1. **How would you crawl a single huge site (say a forum with 500 million pages) quickly but politely?** Ask the
   owner for a higher rate or a data dump; otherwise the rate is capped by politeness, so prioritise: sitemaps,
   pages with most in-links, recently changed threads. Use conditional GETs so revisits are cheap.
2. **Your crawl suddenly spends half its fetches on one host. What happened and how do you stop it?** Probably a
   trap (calendar, faceted search, session IDs). Per-host budgets cap it; look at the URL patterns and the
   near-duplicate rate for that host, add a pattern rule, and drop its queued URLs.
3. **How do you make sure a newly published news article is found within minutes?** Recrawl the site's home page,
   section pages, RSS feeds and sitemaps very often (they are cheap with `304`s), and give new URLs found there top
   priority. Accept push notifications (such as IndexNow) where sites offer them.
4. **A node holding 1% of hosts dies. What is lost?** Nothing permanent. Its leased URLs time out, the ring reassigns
   its hosts, and the new owners rebuild those back queues from the URL database. A few minutes of fetching for
   those hosts is delayed.
5. **Why not use a Bloom filter for content duplicates too?** A Bloom filter only answers "exactly this item?";
   near-duplicates differ slightly, so their hashes differ completely. Exact copies can use a checksum set
   (a Bloom filter works there); near copies need a similarity-preserving fingerprint like simhash.
6. **How would you change the design to crawl only one country's web for a local search engine?** Scope rules in the
   URL filter (country-code domains, IP geolocation, language detection on fetched pages), crawler nodes hosted in
   that country, and priority boosted for in-scope pages; out-of-scope links are still recorded but not fetched.
