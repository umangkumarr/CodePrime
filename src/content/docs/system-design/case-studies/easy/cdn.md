---
title: "Design a Content Delivery Network (CDN)"
description: "Design a CDN step by step: edge PoPs, DNS and anycast routing, cache keys and TTLs, origin shield, purging, TLS at the edge, video delivery and DDoS absorption."
difficulty: "Easy"
sidebar:
  label: "Content delivery network (CDN)"
tags: ["Caching", "Networking", "DNS", "Scalability", "Security"]
---

When you open a news site in Mumbai, the article's images, scripts and fonts usually do not come from the
newspaper's own servers in another continent. They come from a machine a few kilometres away that kept a copy.
That machine is part of a **content delivery network (CDN)**: a worldwide fleet of caching servers that sits
between users and a website's own servers and answers most requests from close by.

A CDN is a good first system design problem because it is built from a few ideas you will reuse everywhere:
**caching**, **routing users to the right server**, **keeping copies fresh**, and **spreading load so no single
machine falls over**. This case study builds one from the ground up.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. CDNs in 5 minutes: why distance matters

### Light is fast, but not fast enough

Data in optical fibre travels at about two thirds of the speed of light, roughly **200,000 km per second**, or
**200 km per millisecond**. Mumbai to a data centre in Virginia (USA) is about 13,000 km in a straight line, and
cables never run in straight lines.

- One way: $13{,}000 \div 200 = 65$ ms at the very least. A **round trip** (RTT: there and back) is at least
  **130 ms**, and over 200 ms is common in practice.
- Opening a fresh HTTPS connection costs about **3 round trips** before the first byte of the page arrives: one
  for the TCP handshake, one for the TLS handshake (TLS 1.3), and one for the request itself.
- So the user waits $3 \times 200 = 600$ ms just for the first byte, before any downloading. A page that needs
  more files over more connections waits longer still.

Now put a server **in Mumbai** that already holds a copy. The round trip falls to perhaps 5–20 ms, and the same
3 round trips cost well under 100 ms. No amount of faster code at the origin can beat that, because the delay is
physics, not computation. **The only way to cut distance latency is to move the content closer to the user.**

Distance is not the only win. A CDN also:

- **Offloads the origin.** If 95% of requests are answered by the CDN, the website's own servers handle 1 in 20.
- **Absorbs traffic spikes** (a sale, a viral video, a software release) across thousands of machines.
- **Absorbs attacks.** A flood of junk traffic is spread over many locations instead of hitting one data centre.
- **Cuts bandwidth bills.** Serving from a nearby cache is cheaper than shipping every byte across oceans.

### The vocabulary

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Origin** | The website's own servers (or storage bucket) that hold the master copy of every file | The factory |
| **PoP** (point of presence) | A CDN site in a city: a rack or a room of servers connected to local networks | A local shop |
| **Edge server** | One caching server inside a PoP; it answers users directly | The shop counter |
| **Cache hit / miss** | Hit: the edge already has a valid copy. Miss: it must fetch from further up | In stock / must order from the warehouse |
| **TTL** (time to live) | How long a cached copy may be served before it must be checked again | The "best before" date |
| **Origin shield** | A middle caching tier between the edges and the origin | A regional warehouse |
| **Purge** (invalidation) | Removing a copy from caches before its TTL runs out | A product recall |
| **Anycast** | Announcing the same IP address from many PoPs so the internet delivers each user to a nearby one | One phone number that rings at the nearest branch |

## 2. Requirements

### Functional (what the CDN does)

- **Serve content** for many customer websites (each one a "property", such as `www.shop.com`) from the PoP
  nearest to each user.
- **Route** every user to a healthy, nearby PoP.
- **Cache** responses according to rules the website controls (`Cache-Control` headers and per-path rules), and
  fetch from the origin on a miss.
- **Invalidate** content on demand (purge by URL, by prefix or by tag) within seconds.
- **Terminate HTTPS** at the edge, with the customer's certificate.
- **Serve large files and video** efficiently, including partial downloads (range requests).
- **Protect** origins from overload and attacks (DDoS absorption, rate limits).
- **Report** traffic, hit ratio, errors and latency to each customer, and provide raw logs.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Latency** | Cache hits answered in tens of milliseconds for most users; first byte from the edge in under 50 ms | Speed is the whole point of a CDN |
| **Availability** | 99.99% or better; losing a server, or a whole PoP, must not take a site down | Customers put the CDN in front of everything; if it fails, they fail |
| **Scale** | Millions of requests per second and terabits per second of traffic at peak | Video and software downloads are enormous |
| **Hit ratio** | High (often 90%+ for static content) | Every miss is slower for the user and costs origin capacity |
| **Freshness** | Serve within the TTL the site asked for; purges take effect everywhere within seconds | A stale price or a deleted image must not linger |
| **Isolation and security** | One customer's traffic, keys and cache never leak into another's | Thousands of sites share the same machines |

### Out of scope

Running customers' code at the edge ("edge functions"), image resizing, a full web application firewall rule
engine, and the billing system. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to see **which resource dominates**.

**Assumptions:** at peak the whole CDN serves **10 million requests per second**, with an average response of
**100 KB** (a mix of small scripts, larger images and video segments). There are **200 PoPs**. One edge server
can push about **20 Gbps** of traffic (a well-tuned machine with fast network cards). The overall hit ratio
is **95%**.

**Bandwidth**

- $10\text{M req/s} \times 100\text{ KB} = 1\text{ TB/s} = 8\text{ Tbps}$ at peak.
- Servers needed just for bandwidth: $8\text{ Tbps} \div 20\text{ Gbps} = 400$ servers. Traffic is uneven
  (evening peaks differ by time zone), PoPs need spare capacity for failures and attacks, so plan for
  **3×**, about **1,200 edge servers**, an average of 6 per PoP (big cities have far more, small ones fewer).

**Origin load**

- At a 95% hit ratio, $5\%$ of 10M = **500,000 requests per second** reach upstream, carrying about
  $5\% \times 8 = 0.4$ Tbps.
- An origin shield (section 9) catches most of those, because the 200 edges often miss on the *same* objects.
  If the shield answers 80% of them, the origins see about **100,000 requests per second**: 1% of the traffic.

**Storage**

- Caches hold the **working set**: the content people actually ask for, not everything that exists. If a large
  PoP needs the most popular 100 TB of content, that is a few dozen servers with a few TB of SSD each.
- Hot objects also sit in **RAM** (hundreds of GB per server) because a memory read is far faster than SSD.

Three conclusions follow:

1. **Bandwidth, not CPU, is the bottleneck.** Edge servers are designed around network cards and disks.
2. **Hit ratio is the most important number.** Going from 95% to 99% cuts origin traffic **five times**
   (from 1 in 20 requests to 1 in 100).
3. **Caches can be small compared with the origin** because popularity is very skewed: a small share of objects
   gets most of the requests.

## 4. The API

A CDN has two very different interfaces.

**The data plane** is plain HTTP. Users' browsers send ordinary `GET` requests to `www.shop.com`; they do not
know a CDN exists. The contract with the origin is a set of **HTTP headers**:

| Header | Who sets it | What it means |
| --- | --- | --- |
| `Cache-Control: public, max-age=86400` | Origin | Any cache may store this for one day |
| `Cache-Control: s-maxage=600` | Origin | Shared caches (the CDN) use 10 minutes; browsers still use `max-age` |
| `Cache-Control: private` or `no-store` | Origin | Never store in the CDN (personal pages, account data) |
| `ETag: "v42"` / `Last-Modified` | Origin | A version label, used later to ask "has it changed?" cheaply |
| `Vary: Accept-Encoding` | Origin | Keep separate copies per value of this request header (gzip vs Brotli) |
| `Age: 1350` | CDN | How many seconds this copy has been in cache |
| `X-Cache: HIT` / `Cache-Status` | CDN | Whether this response came from cache (handy for debugging) |

**The control plane** is a management API used by the website's owner or deploy scripts:

| Method and path | What it does |
| --- | --- |
| `POST /v1/properties` | Create a property: hostname, origin address, default cache rules |
| `PUT /v1/properties/{id}/rules` | Change behaviour per path, for example "cache `/static/*` for a year, never cache `/api/*`" |
| `PUT /v1/properties/{id}/certificate` | Upload or auto-issue the TLS certificate for the hostname |
| `POST /v1/purge` | Invalidate by URL list, prefix, or cache tag. Returns a `purge_id` |
| `GET /v1/purge/{purge_id}` | Progress: how many PoPs have confirmed the purge |
| `GET /v1/stats?property=...&from=...` | Requests, bytes, hit ratio, error rates, latency |

Config changes are **versioned and rolled out gradually**, PoP by PoP, because a bad rule pushed everywhere at
once can break thousands of sites at the same moment.

## 5. High-level design

[![High-level CDN architecture: users resolve the name through CDN DNS or anycast, then make HTTPS requests to the nearest edge PoP; misses go to a regional origin shield and then to the origin; the site owner drives the control plane, which pushes config and purges to the edges; edges send access logs to a logs and metrics pipeline](/img/system-design/cdn/01-architecture.png)](/img/system-design/cdn/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Request routing (CDN DNS or anycast):** decides which PoP a user talks to. Section 6.
- **Edge PoP:** terminates TLS, looks up the cache, answers hits, and forwards misses. There are hundreds of
  them, in as many cities and internet exchange points as possible.
- **Origin shield:** a bigger cache in a few regions. Edges ask the shield before the origin, so the origin is
  asked for each object roughly once per region instead of once per PoP.
- **Origin:** the customer's servers or storage bucket. The CDN never owns the master copy.
- **Control plane:** stores each customer's configuration, certificates and purge requests and pushes them to
  every PoP. It is **not** on the request path: if it goes down, edges keep serving with the last config.
- **Logs and metrics:** every edge ships access logs to a pipeline that computes hit ratio, latency and errors.

The most useful idea in this design: **the data plane and the control plane are separate.** The data plane
(edges and shields) must be fast and survive anything. The control plane can be slower and centralised, because
users never wait on it.

## 6. Flow 1: sending each user to the right PoP

Before an edge can help, the user's request must reach a **nearby, healthy, not overloaded** PoP. Two techniques
are used, often together.

### DNS-based routing

The website points its hostname at the CDN with a **CNAME** (a DNS alias: "`www.shop.com` is really
`shop.cdn.net`"). The CDN runs the authoritative DNS servers for `cdn.net`, so it gets to choose which IP
address each user receives.

[![DNS-based routing sequence: the browser asks its DNS resolver for www.shop.com; shop.com's nameserver answers with a CNAME to shop.cdn.net; the CDN's DNS picks a healthy PoP near the resolver and returns its address with a 30-second TTL; the browser then fetches app.js over TLS from the Mumbai edge and gets a cache hit](/img/system-design/cdn/02-dns-routing.png)](/img/system-design/cdn/02-dns-routing.png)

*Select the diagram to zoom in and move around.*

How the CDN's DNS decides:

- **Where is the user?** It sees the **resolver's** IP address, not the user's, so it maps that address to a
  location. A user on a public resolver far away could be misrouted, which is why many resolvers send a shortened
  form of the user's subnet (the **EDNS Client Subnet** extension) to help.
- **Which PoPs are healthy and have spare capacity?** A monitoring system constantly measures each PoP's load
  and health, and DNS stops handing out a PoP that is overloaded or down.
- **Which PoP is actually fastest?** Real measurements from users ("real user monitoring") beat a map: the
  closest city is not always the fastest network path.

The answer has a **short TTL** (for example 30 seconds) so that when a PoP fails, users move elsewhere quickly.
The cost is more DNS lookups, which is acceptable because resolvers cache answers for that window.

### Anycast routing

With **anycast**, every PoP announces the **same IP address range** to the internet using **BGP** (Border
Gateway Protocol, the system networks use to tell each other which addresses they can reach). Each user's
packets naturally follow the shortest network path to *one* of those PoPs.

[![Anycast: users in Mumbai, Paris and Sao Paulo all connect to 203.0.113.7; BGP delivers each to the nearest PoP announcing that range (Mumbai, Frankfurt, Sao Paulo); a botnet flood near Sao Paulo is absorbed by that PoP alone; the origin sees only cache misses](/img/system-design/cdn/03-anycast.png)](/img/system-design/cdn/03-anycast.png)

*Select the diagram to zoom in and move around.*

Notice the Paris user lands in **Frankfurt**: "nearest" means nearest in network terms, which usually but not
always matches geography.

| | DNS-based routing | Anycast |
| --- | --- | --- |
| Granularity | Per resolver (or subnet) | Per network path, automatic |
| Failover speed | Limited by DNS TTL and resolvers that ignore it | Fast: withdraw the BGP route and traffic shifts in seconds to minutes |
| Load control | Fine-grained: send exactly 20% of users elsewhere | Coarse: BGP does not know about server load |
| DDoS | Attackers can target one PoP's address | Attack traffic is split across all PoPs automatically |
| Catch | Depends on resolver location | A route change mid-connection can move a long TCP connection to another PoP |

Many CDNs combine them: anycast to reach a PoP, then a **load balancer inside the PoP** (often using consistent
hashing, section 10) to pick a server.

## 7. Flow 2: serving a request (hit, miss and revalidation)

Once the request reaches an edge server, it follows the same decision every time.

[![How an edge server answers a request: build the cache key and look it up; if found and still fresh, respond with a HIT; if stale, revalidate with an If-None-Match request and either reuse it on 304 or store the new body on 200; if not found (MISS), fetch from the shield and then origin, store it if cacheable, and respond](/img/system-design/cdn/04-cache-lookup.png)](/img/system-design/cdn/04-cache-lookup.png)

The three outcomes:

1. **Hit.** The copy exists and its age is below its TTL. Answer from memory or SSD. This is the fast, cheap path
   and should be the common one.
2. **Stale, then revalidate.** The copy exists but its TTL has run out. Instead of downloading the whole file
   again, the edge sends a **conditional request**: `If-None-Match: "v42"` (or `If-Modified-Since`). If the file
   has not changed, the origin replies **`304 Not Modified`** with no body, and the edge resets the TTL. Checking
   a 5 MB image costs a few hundred bytes.
3. **Miss.** No copy. Fetch from the shield (which may itself fetch from the origin), store the response if its
   headers allow it, and send it to the user.

Two refinements keep users fast even on the slower paths:

- **Stream while storing.** The edge forwards bytes to the user as they arrive from upstream, while writing them
  to cache. The user does not wait for the whole file.
- **`stale-while-revalidate`.** With `Cache-Control: max-age=60, stale-while-revalidate=300`, for five minutes
  after expiry the edge serves the stale copy immediately and refreshes it in the background. The user never
  waits for revalidation. Its sibling **`stale-if-error`** lets the edge keep serving the old copy if the origin
  is down, which turns an origin outage into a non-event for cached pages.

## 8. Deep dive: cache keys and Cache-Control

### The cache key

The **cache key** is the string the edge uses to decide whether two requests want "the same thing". The default
is roughly `scheme + host + path + query string`:

```text
scheme=https  host=www.shop.com  path=/img/logo.png  query=v=3
```

Getting the key right matters more than almost anything else for hit ratio:

- **Too specific, and the hit ratio collapses.** Marketing links add `?utm_source=newsletter` and
  `?fbclid=...`. If those are in the key, every campaign creates a new copy of the same image. Fix: **normalise**
  the key by dropping tracking parameters and sorting the rest (`?b=2&a=1` equals `?a=1&b=2`).
- **Too broad, and users get the wrong content.** If the page differs by language but the key ignores the
  `Accept-Language` header, a French user may receive the German page. Fix: include exactly the request headers
  the content varies by. This is what `Vary` tells the cache.
- **`Vary` with care.** `Vary: Accept-Encoding` is fine (a few values: gzip, Brotli, none). `Vary: User-Agent` is
  a disaster: there are thousands of user-agent strings, so every copy is nearly unique. Normalise first (for
  example to "mobile" or "desktop"), then key on the normalised value.
- **Never cache personal responses.** A response that depends on the user's cookie must be `private` or
  `no-store`. Caching a logged-in page under a shared key would show one user's account to everyone; this is one
  of the classic CDN incidents.

### Choosing TTLs

TTL is a trade-off between **freshness** and **hit ratio**. Long TTLs mean more hits and less origin load, but
changes take longer to appear.

| Content | Typical choice | Why |
| --- | --- | --- |
| Versioned static files (`app.3f9a2c.js`) | `max-age=31536000, immutable` (one year) | The name changes whenever the content changes, so the old file never needs updating |
| Images and fonts without versions | Hours to days, plus purge when changed | Changes are rare and a purge handles them |
| HTML pages | Seconds to minutes, with `stale-while-revalidate` | Pages change often, but even a 10-second TTL absorbs a traffic spike |
| API responses for everyone (a price list) | A few seconds | "Micro-caching" turns 10,000 requests per second into one origin request per few seconds |
| Personal data, carts, account pages | `private, no-store` | Must never be shared |

A useful header split: `s-maxage` (or the newer `CDN-Cache-Control` header) controls the CDN, while `max-age`
controls browsers. A site can let the CDN cache HTML for a minute but tell browsers to always revalidate, so a
purge takes effect for everyone.

## 9. Deep dive: tiered caching and the origin shield

With 200 PoPs, a newly published video segment could be requested from the origin **200 times**, once by each
PoP's first miss. Worse, within each PoP several servers might each miss on it. A popular new release can melt
an origin this way even though "the CDN is caching it".

Two techniques fix this.

**Tiered caching (origin shield).** Edges do not go to the origin directly; they ask a **shield**, a large cache
in a region near the origin (or one per continent). Only the shield talks to the origin. Now the origin sees about
one request per object per shield, and the shield's hit ratio is high because it serves the misses of many PoPs.

**Request collapsing (coalescing).** If 1,000 users ask the same PoP for an object it does not have, only the
first request goes upstream; the other 999 wait for that one response and are all served from it. Without this, a
cache miss during a traffic spike becomes a **thundering herd** (also called a cache stampede) on the origin.

[![Tiered miss with request collapsing: User A requests a video segment and the edge misses, asking the origin shield; User B asks for the same file and is collapsed onto the fetch already in flight; the shield misses and fetches from the origin, which returns 200 with max-age 86400; the shield and then the edge store a copy, and both users get the same bytes](/img/system-design/cdn/05-tiered-miss.png)](/img/system-design/cdn/05-tiered-miss.png)

*Select the diagram to zoom in and move around.*

The trade-off: a miss now makes **two hops** (edge to shield to origin) instead of one, so a true miss is a little
slower. In return the origin load drops sharply and overall hit ratio rises. For content that is popular in one
place only, or for very small sites, the shield may add latency without much benefit, so it is usually an option
the customer can turn on.

## 10. Deep dive: inside a PoP (storage and eviction)

A large PoP has dozens of servers. If every server cached everything independently, each popular object would be
stored dozens of times and each server's cache would effectively be tiny.

- **Consistent hashing across servers.** The PoP's load balancer hashes the cache key to choose **which server
  owns** that object. Every request for `logo.png` goes to the same server, so the PoP stores one copy and its
  total cache is the sum of all servers' disks. Consistent hashing means adding or removing a server moves only
  that server's share of keys, not everything. Extremely hot objects can be copied to several servers so one
  machine is not overwhelmed.
- **Two storage tiers per server.** RAM for the hottest few hundred GB, SSD for the long tail. Spinning disks are
  sometimes used for very large, rarely watched video.
- **Eviction.** Caches are always full, so adding an object means removing one. **LRU** (least recently used)
  evicts what has not been asked for longest. Plain LRU is easily fooled: one crawler scanning millions of
  rarely wanted files pushes out the popular ones. Real caches use smarter variants that only admit an object
  after it has been requested more than once, or that weigh frequency as well as recency. Size matters too: one
  10 GB file can displace 100,000 small images that serve far more requests.

Put together, every object in an edge cache moves through a small set of states:

[![Life of one cached object: Not cached, then Fetching on a miss, then Fresh after a cacheable 200; Fresh becomes Stale when max-age passes; the next request starts Revalidating, which returns to Fresh on a 304 or new 200, or stays Stale and is served when the origin is down; a non-cacheable response is Not stored, a cold object can be Evicted, and a purge removes it](/img/system-design/cdn/06-object-lifecycle.png)](/img/system-design/cdn/06-object-lifecycle.png)

*Select the diagram to zoom in and move around.*

The per-object metadata the edge keeps is small:

| Field | Example | Used for |
| --- | --- | --- |
| `cache_key` | `https://www.shop.com/img/logo.png` | Lookup (hashed into an in-memory index) |
| `location` | RAM, or SSD file and offset | Reading the bytes |
| `size_bytes` | 48,213 | Eviction decisions |
| `stored_at`, `expires_at` | Timestamps | Freshness check and the `Age` header |
| `etag`, `last_modified` | `"v42"` | Revalidation |
| `tags` | `product-123`, `homepage` | Purge by tag |
| `vary_values` | `br` | Picking the right variant |

## 11. Deep dive: invalidation (purging and versioned URLs)

There is a well-known joke that the two hardest problems in computer science are naming things and cache
invalidation. A CDN has to solve the second one across hundreds of cities.

### Purging

When the owner changes something, they call `POST /v1/purge`. The control plane turns it into an event and fans it
out to every PoP and shield.

[![Purge fan-out: a deploy or CMS change calls POST /purge with URLs or tags; the purge API publishes a purge event to a fan-out channel, which delivers it to every PoP (Mumbai, Frankfurt, Virginia) and the origin shields, each of which drops the object or marks it stale; the API tracks acknowledgements per PoP](/img/system-design/cdn/07-purge.png)](/img/system-design/cdn/07-purge.png)

*Select the diagram to zoom in and move around.*

Design points:

- **Purge kinds.** By exact URL (simple), by **prefix** (`/products/*`), or by **tag**: the origin labels
  responses with tags (for example a `Surrogate-Key` or `Cache-Tag` header: `product-123 homepage`), and one purge
  of `product-123` removes every page that shows that product. Tags are the most useful for real sites.
- **Shields first or together.** If an edge drops its copy but the shield still has the old one, the edge's next
  miss brings the old version straight back. Purge the shield tier too, before or along with the edges.
- **Soft purge.** Instead of deleting, mark the object stale. The next request revalidates with the origin
  (cheap if unchanged), and if the origin is down the stale copy can still be served.
- **PoPs that miss the message.** A PoP that was unreachable must not keep stale content forever. Each purge has a
  sequence number; a PoP that reconnects asks for every purge since the last one it applied, and the API reports
  a purge "complete" only when every PoP has acknowledged it.
- **Speed.** Global purges are expected in seconds; some CDNs advertise well under a second.

### Versioned URLs: avoid needing purges

For static assets the best invalidation is **none at all**. Put a hash of the file's content in its name:
`app.3f9a2c.js`. A new deploy produces `app.81bd07.js` and the HTML points to the new name. The old file can be
cached for a year with `immutable`, and no user can ever see a mix of old and new because the names differ. Only
the small HTML page needs a short TTL or a purge.

### Push versus pull

| | Pull CDN (the default) | Push CDN |
| --- | --- | --- |
| How content gets there | The edge fetches from the origin on the first miss | The owner uploads content to the CDN in advance |
| Good for | Websites with many files and unpredictable popularity | Large files known ahead of time: game patches, software releases, a video premiere |
| Downside | The first user in each region pays the miss | The owner manages uploads, storage and deletion |

Most CDNs are pull-based, with **prefetching** (warming caches before a big launch) as a push-like option.

## 12. Deep dive: TLS at the edge

Almost all traffic is HTTPS, so the edge must complete the TLS handshake for `www.shop.com`. That means the edge
needs a valid **certificate** for that hostname.

- **Certificates per hostname.** A PoP serves thousands of sites on the same IP addresses. The browser sends the
  hostname it wants in the TLS handshake (**SNI**, Server Name Indication), and the edge picks the matching
  certificate. Certificates are issued automatically (for example through ACME, the protocol Let's Encrypt
  uses) and pushed from the control plane.
- **Private keys are the crown jewels.** They are encrypted at rest, only decrypted in memory on edge servers, and
  access is tightly logged. Some CDNs offer a "keyless" mode in which the customer's private key stays on the
  customer's own server, and the edge asks it to perform just the one signing operation each new handshake needs.
- **Why terminating TLS at the edge is fast.** The expensive handshake round trips happen over the short hop to
  the nearby PoP. The edge then keeps a few **long-lived, already warm connections** to the shield and origin, so
  a miss does not pay a new handshake across the ocean either.
- **Modern protocols at the edge.** HTTP/2 and HTTP/3 (over QUIC, which combines the transport and TLS handshakes)
  can be offered to users even if the origin speaks only HTTP/1.1. TLS session resumption makes repeat visits
  cheaper.
- **Edge to origin is encrypted too.** The edge opens HTTPS to the origin and checks its certificate. Otherwise
  the traffic is protected only for the first hop.

## 13. Deep dive: video and large files

Video is a large share of internet traffic, and it behaves differently from web pages.

**Streaming video is chopped into small files.** Formats such as **HLS** and **MPEG-DASH** split each video into
segments of a few seconds each, at several quality levels, plus a small **manifest** listing them. The player
downloads the manifest, then segment after segment, switching quality as bandwidth changes. For the CDN, a
two-hour film becomes thousands of ordinary, cacheable files.

- **Segments** never change once written: cache them for a long time.
- **Live manifests** change every few seconds: give them a TTL of about a second, and rely on request
  collapsing, because millions of viewers request the same manifest at the same moment.

**Large single files use range requests.** A client can ask for part of a file:
`Range: bytes=0-1048575` (the first 1 MiB). The server answers **`206 Partial Content`**. Players use this to
seek, and download tools use it to resume or fetch in parallel. For the CDN:

- **Cache the file in chunks** (for example 1–10 MB slices), each with its own cache key such as
  `/game-patch.bin#chunk-17`. A request for any byte range fetches and caches only the chunks it touches.
- Without chunking, a request for the last 1 MB of a 20 GB file would force the edge to download all 20 GB from
  the origin, or to skip caching altogether.
- Chunks also spread a huge file across many servers in the PoP (each chunk hashes to its own owner).

## 14. Deep dive: absorbing DDoS attacks

A **DDoS** (distributed denial of service) attack floods a target from thousands or millions of hijacked devices
(a **botnet**). A CDN is naturally good at absorbing them:

- **Sheer capacity.** The CDN's total bandwidth is far larger than any single website's, and with anycast an
  attack is split across every PoP near the attacking devices instead of hitting one place (diagram in section 6).
- **Layer 3/4 floods** (junk packets, SYN floods) are dropped at the network edge by filters on routers and on the
  servers' network cards, before they reach the HTTP software. TCP SYN cookies let a server survive a flood of
  half-open connections without storing state for each.
- **Layer 7 floods** (real-looking HTTP requests) are harder. Defences: per-IP and per-path **rate limits**,
  challenges for suspicious clients, and blocking request patterns seen across many PoPs at once.
- **The cache itself is a shield.** Requests for cached content never reach the origin. Attackers know this and
  add random query strings (`/?x=91834`) to force misses ("cache busting"). Counter it by normalising or ignoring
  unknown query parameters for static paths, and by rate-limiting misses per client.
- **Hide the origin.** If attackers learn the origin's IP address, they bypass the CDN completely. The origin
  should accept traffic **only from the CDN's addresses** (or over an authenticated tunnel).

## 15. Reliability: what happens when things fail

| Failure | What the CDN does |
| --- | --- |
| One edge server dies | The PoP load balancer stops sending it traffic; consistent hashing hands its keys to the others, which refill their caches from the shield |
| A whole PoP goes down or is overloaded | DNS stops returning it, or it withdraws its anycast routes; users shift to the next nearest PoP within seconds to minutes |
| The shield is unreachable | Edges fall back to fetching from the origin directly (with care, because this removes the origin's protection) |
| The origin is down or slow | Serve stale content (`stale-if-error`), return a friendly error page, and use timeouts and circuit breakers so slow origins do not tie up edge connections |
| The control plane is down | Edges keep serving with the last known config; new config and purges wait |
| A bad config is pushed | Configs are validated, versioned and rolled out to a few PoPs first, with automatic rollback if errors rise |

The pattern to remember: **a CDN degrades gracefully.** It prefers serving a slightly stale copy over serving an
error, and every layer has a fallback to the layer above it.

## 16. Measuring a CDN: the metrics that matter

- **Cache hit ratio** = hits ÷ all requests. The headline number. Measure it per property and per path, because one
  uncacheable API path can drag the average down.
- **Byte hit ratio** = bytes served from cache ÷ all bytes. It can differ a lot from request hit ratio: many tiny
  misses and a few huge video hits give a low request ratio but a high byte ratio. Bandwidth bills follow bytes.
- **Origin offload** = share of requests or bytes that never reached the origin. With a shield, this is higher than
  the edge hit ratio.
- **Time to first byte (TTFB)** and total download time, as **percentiles** (p50, p95, p99), per country. Averages
  hide the slow users.
- **Error rates** split by cause: edge errors (5xx from the CDN itself) versus origin errors passed through.
- **Purge latency**: time from request to the last PoP acknowledging.

Edges write access logs (time, PoP, cache status, bytes, status code, latency) into a streaming pipeline that
aggregates them per minute for dashboards and alerts, and delivers raw logs to customers who want them.

## 17. What breaks as it grows, and how to fix it

**The long tail.** Millions of rarely requested objects (old product images, deep archive pages) miss almost
every time and churn the cache. *Fix:* tiered caching so at least the shield keeps them, admission policies so
one-off requests do not evict popular objects, and bigger SSD tiers in large PoPs.

**The viral object.** One file is suddenly requested millions of times per second (a live sports manifest, a
celebrity post). The single server that owns it by consistent hashing overheats. *Fix:* detect hot keys and
replicate them to several servers in the PoP, and keep them in RAM.

**The new release.** A game patch or OS update goes live and millions of devices request it at once, all misses.
*Fix:* request collapsing, chunked caching, shields, and prefetching to PoPs before the launch.

**Cache-key mistakes at scale.** One customer forgets to strip tracking parameters, or adds `Vary: User-Agent`,
and their hit ratio drops to near zero, multiplying origin load. *Fix:* sensible defaults, warnings in the control
plane when a property's hit ratio collapses, and clear per-path rules.

**Config and purge fan-out.** Thousands of customers changing settings and purging content, multiplied by hundreds
of PoPs. *Fix:* a reliable publish-subscribe channel with sequence numbers, so each PoP applies changes in order and
catches up after an outage, and batching of purges.

**Growing PoP count.** More PoPs mean lower latency but each has a smaller share of traffic, so a lower hit ratio.
*Fix:* tiered caching (small PoPs lean on a bigger regional tier), and placing PoPs where the traffic is.

## 18. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Routing users | DNS-based | Anycast | **Both**: anycast for simple, fast failover and DDoS spreading; DNS where fine-grained load steering matters |
| Content arrival | Push | Pull | **Pull** by default: no upfront work for the customer; push or prefetch for known large releases |
| Miss path | Edge to origin | Edge to shield to origin | **Shield**: one extra hop on a true miss, but far less origin load and a higher overall hit ratio |
| TTL length | Short (fresh) | Long (more hits) | **Long for versioned assets, short for HTML**, with `stale-while-revalidate` to hide refreshes |
| Invalidation | Purge everything when it changes | Versioned file names | **Versioned names** for static files, **tag purges** for pages |
| Within a PoP | Every server caches everything | Consistent hashing | **Hashing**: one copy per PoP, larger effective cache, plus replication for hot keys |
| Origin down | Return an error | Serve stale | **Serve stale** with `stale-if-error`: users rarely notice a short origin outage |

## Cheat sheet for last-minute revision

- **Why a CDN:** latency is physics (fibre ≈ 200 km/ms, an HTTPS request costs about 3 round trips), so move
  copies near users. Also origin offload, spike and DDoS absorption, lower bandwidth cost.
- **Pieces:** request routing → edge PoPs (TLS + cache) → origin shield → origin. The control plane (config,
  certificates, purges) is off the request path.
- **Routing:** DNS (CNAME to the CDN, short TTL, picks a PoP by resolver location, health and load) and/or anycast
  (same IP announced by every PoP, BGP picks the nearest; spreads DDoS).
- **Request path:** cache key → lookup → fresh? HIT → stale? conditional GET (`304` reuses) → miss? fetch from
  shield/origin, store if cacheable, stream to the user.
- **Cache key:** host + path + normalised query; strip tracking params; `Vary` only on low-cardinality headers;
  never cache personal responses.
- **Headers:** `max-age`, `s-maxage`, `private`, `no-store`, `immutable`, `ETag`, `stale-while-revalidate`,
  `stale-if-error`, `Age`.
- **Origin protection:** origin shield + request collapsing stop thundering herds.
- **Inside a PoP:** consistent hashing so each object lives on one server; RAM + SSD; LRU-style eviction with
  admission control.
- **Invalidation:** versioned URLs for assets; purge by URL, prefix or tag; purge shields too; sequence numbers so
  disconnected PoPs catch up.
- **Video and big files:** HLS/DASH segments are ordinary cacheable files; range requests (`206`) with chunked
  caching.
- **Numbers:** 10M req/s × 100 KB = 8 Tbps; 95% → 99% hit ratio cuts origin traffic 5×.

## Practice questions

1. **A customer says their site got slower after joining the CDN. What do you check?** The hit ratio first:
   uncacheable responses (`private`, cookies, `no-store`), cache keys exploded by query strings or `Vary`. Then
   routing: are users reaching a distant PoP because of their resolver? Finally the miss path: is the shield far
   from the origin, or are edge-to-origin connections being reopened for every miss?
2. **How would you cache an API that returns the same product list to everyone but changes every few seconds?**
   Micro-caching: a TTL of 1–5 seconds with request collapsing. The origin then sees roughly one request per
   object per few seconds per shield, however many users ask. Add `stale-while-revalidate` so users never wait.
3. **A user logged in and saw someone else's account page. What went wrong and how do you prevent it?** A
   personalised response was cached under a shared key, usually because the origin sent a cacheable header or a
   rule cached `/account/*`. Prevent it with `Cache-Control: private` from the origin, a default of never caching
   responses that set cookies, and rules that bypass the cache for authenticated paths.
4. **How would you prepare for a game patch that millions of players will download at 6 pm?** Prefetch it to
   shields and large PoPs beforehand, cache it in chunks so range requests and parallel downloads hit the cache,
   enable request collapsing, and check capacity per region. Use a versioned file name so no purge is needed.
5. **Attackers send random query strings to bypass your cache and overload the origin. What do you do?** Ignore or
   strip unknown query parameters on static paths so the cache key stays the same, rate-limit cache misses per
   client and per path, and make the origin accept traffic only from the CDN.
