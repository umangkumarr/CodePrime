---
title: "Design a Load Balancer"
description: "Design a load balancer step by step: L4 vs L7, balancing algorithms, health checks, stickiness, TLS termination, draining and a highly available balancer tier."
difficulty: "Easy"
sidebar:
  label: "Load balancer"
tags: ["Load balancing", "Networking", "High availability", "Consistent hashing"]
---

One server can only do so much. When a website outgrows it, we run ten or a thousand copies of the server, and
something has to decide which copy handles each request. That something is a **load balancer**. Think of the
host at a busy restaurant: guests queue at one door, and the host walks each party to a table that is free,
skips the section whose waiter has gone home sick, and keeps a family together at the same table all evening.

A load balancer looks like a small, almost boring box. In an interview it opens a surprising number of doors:
networking layers, hashing, failure detection, encryption, and the classic puzzle of how to make the thing
that removes single points of failure not become one itself. This case study builds one from the ground up.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Load balancing in 5 minutes

A load balancer sits between **clients** (browsers, phones, other services) and a group of identical
**backends** (the servers that do the real work). Clients only ever see the balancer's address. It gives us
three things at once:

1. **Scale:** add servers behind it and capacity grows, with no change for clients.
2. **Availability:** if a server dies, the balancer stops sending it traffic, and users never notice.
3. **Flexibility:** we can deploy, resize or move servers behind it without anyone changing an address.

| Term | What it is | Restaurant analogy |
| --- | --- | --- |
| **Backend** (target, upstream) | One server that can handle a request | A table with a waiter |
| **Pool** (target group, cluster) | The set of interchangeable backends for one service | One section of the restaurant |
| **VIP** (virtual IP) | The public address clients connect to; it belongs to the service, not to any one machine | The restaurant's front door |
| **Health check** | A regular probe ("are you alive and well?") the balancer sends to each backend | The host glancing at each table |
| **Reverse proxy** | A server that accepts a client's connection and opens its own connection to a backend | A waiter who takes your order to the kitchen for you |
| **5-tuple** | Source IP, source port, destination IP, destination port and protocol: what identifies one TCP connection | One party's booking |
| **L4 / L7** | Balancing at the transport layer (TCP/UDP) or at the application layer (HTTP) of the OSI model; see section 7 | Seating by party size vs reading each order |

The two numbers in "L4" and "L7" come from the **OSI model**, the textbook stack of network layers. Layer 4 is
TCP and UDP: addresses and ports. Layer 7 is the application protocol: HTTP methods, paths, headers, cookies.
The higher the layer, the more the balancer understands, and the more work it does per request.

## 2. Requirements

Interviewers usually mean one of two things by "design a load balancer": **build the balancer software** (like
NGINX, HAProxy or Envoy), or **design the load-balancing tier** for a large website. We cover both: the logic
inside one balancer node, and how many nodes work together.

### Functional (what it must do)

- Accept client connections on one or more **listeners** (for example HTTPS on port 443) at a stable VIP.
- **Distribute** requests across the healthy backends of a pool, using a configurable **algorithm**.
- **Route** by content at L7: `/api/*` to the API pool, `/images/*` to the image pool, by host name too.
- **Health-check** backends and stop sending traffic to unhealthy ones within seconds.
- **Add and remove backends** at any time without dropping in-flight requests (**connection draining**).
- **Terminate TLS** (decrypt HTTPS) so backends do not have to, with certificate management.
- Optional **session stickiness**: keep one user on the same backend when the application needs it.
- **Protect backends** from overload: connection limits, rate limits, load shedding.
- Expose **metrics and logs** for every request and every backend.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Availability** | 99.99% or better; no single point of failure | Every request passes through it: if it is down, the whole site is down |
| **Latency** | Adds under 1 ms at L4 and a few ms at L7 (p99) | It is on every request's path, so its cost is paid millions of times |
| **Throughput** | Hundreds of thousands of requests per second, tens of Gbit/s | It must never be the bottleneck |
| **Scalability** | Add balancer nodes horizontally | Traffic grows; one box cannot keep up |
| **Fast failure detection** | Stop using a dead backend within about 10–15 s | Users should see at most a few errors |
| **Security** | Hold TLS private keys safely; absorb floods | It is the front door facing the internet |

### Out of scope

Building routers and switches, DDoS scrubbing at the network edge, a full API gateway (auth, request
transformation) and a service mesh. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

The point is to learn **how many balancer nodes** we need and **what limits each one**.

**Assumptions:** 50 million daily active users, each making **200** requests a day. Peak is **3×** the
average. An average request is **2 KB** and an average response **20 KB**. At peak, **5 million** users are
online, each holding **2** open connections (browsers keep connections alive and reuse them).

**Traffic**

- Requests per day: $50\text{M} \times 200 = 10\text{B}$, about **115,000 per second** on average and
  roughly **350,000 per second** at peak.
- Bandwidth at peak: requests $350\text{K} \times 2\text{ KB} = 0.7\text{ GB/s}$ (about 5.6 Gbit/s) in;
  responses $350\text{K} \times 20\text{ KB} = 7\text{ GB/s}$ (about **56 Gbit/s**) out.
- Concurrent connections: $5\text{M} \times 2 = 10\text{M}$.

**What this means per tier (illustrative capacities)**

- **L7 proxies** do the heavy lifting: TLS, HTTP parsing, routing. Assume one 16-core node handles
  **50,000 requests per second**. Then $350\text{K} / 50\text{K} = 7$ nodes at peak. We must survive losing a
  whole zone (a third of the fleet if we use three zones) and still have headroom, so run about **12**.
- **Connection state:** if each connection costs the proxy about **10 KB** of buffers, 10 million
  connections need $10\text{M} \times 10\text{ KB} = 100\text{ GB}$ of memory spread across the fleet, about
  8 GB per node. Comfortable, but memory, not CPU, often limits how many idle connections a proxy can hold.
- **L4 balancers** only forward packets, so they are much cheaper. With **direct server return** (section 7),
  responses skip them entirely and they carry only the 5.6 Gbit/s of requests; two or three nodes are plenty,
  and we run more for redundancy.

Three conclusions follow:

1. **Responses are 10× bigger than requests.** Letting responses bypass the L4 tier saves most of its bandwidth.
2. **TLS and HTTP parsing cost CPU**, so the L7 tier is the one we scale most.
3. **One box is never enough**, not for capacity but for availability. The design of the balancer tier
   itself is half the problem.

## 4. The API (the control plane)

Clients never call an API on a load balancer; they just connect. The API here is for **operators and
automation** (deploy tools, autoscalers) to configure it. This is the **control plane**: it decides the
rules. The **data plane** is the part that moves packets and requests using those rules.

| Method and path | What it does |
| --- | --- |
| `PUT /v1/listeners/{id}` | Create or update a listener: port, protocol (`TCP`, `HTTPS`), certificate, routing rules such as `path /api/* → pool api`. |
| `PUT /v1/pools/{pool}` | Create or update a pool: algorithm, health-check settings, slow-start time, draining timeout. |
| `POST /v1/pools/{pool}/targets` | Register a backend: `{"ip": "10.0.3.7", "port": 8080, "weight": 2}`. |
| `DELETE /v1/pools/{pool}/targets/{id}` | Deregister a backend. It enters **draining** first; it is not cut off mid-request. |
| `GET /v1/pools/{pool}/targets` | Each backend's current state: healthy, unhealthy, draining, with reasons. |

The control plane stores this configuration in a small, strongly consistent store (for example etcd or a
replicated database) and **pushes** it to every balancer node. Two rules make this safe:

- **The data plane must keep working if the control plane is down.** Each node keeps its last good
  configuration in memory and carries on. A broken control plane can stop changes, never traffic.
- **Changes are validated and rolled out gradually** (a few nodes first), because a bad routing rule pushed
  to every node at once is one of the fastest ways to take a whole site offline.

## 5. High-level design

[![High-level architecture: clients resolve the name in DNS, connect to a virtual IP owned by the active L4 balancer, which has a standby taking heartbeats; the L4 tier picks an L7 proxy node, and the L7 fleet routes /* to the web pool and /api/* to the API pool, using the list of healthy backends from the control plane](/img/system-design/load-balancer/01-big-picture.png)](/img/system-design/load-balancer/01-big-picture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **DNS:** turns `shop.example.com` into the VIP. For several regions, it can also choose the region
  (section 13).
- **L4 balancer pair:** owns the VIP and spreads TCP connections over the L7 nodes. It never looks inside a
  request, so it is very fast. A standby takes over the VIP if the active one fails (section 12).
- **L7 proxy fleet:** terminates TLS, reads each HTTP request, picks a pool by path or host, picks a backend
  with the pool's algorithm, and forwards the request.
- **Server pools:** the actual application servers, grouped by service.
- **Control plane:** holds the configuration and the current list of healthy backends, and pushes it to the
  proxies.

Why **two tiers** (L4 in front of L7) instead of one? Each does what it is good at. The L4 tier is cheap per
packet and gives us one stable VIP for the whole fleet. The L7 tier is expensive per request, so it must
scale out to many nodes, and the L4 tier is what lets us add and remove L7 nodes freely behind a single
address. Small systems can skip the L4 tier and put two L7 proxies behind a VIP; large ones nearly always
end up with both.

## 6. Flow: one HTTPS request

A browser asks for `GET /api/cart`.

[![Sequence: the client sends a TCP SYN to the VIP; the L4 balancer hashes the 5-tuple to pick L7 node l7-3 and forwards packets; the client and the L7 proxy complete a TLS handshake; the encrypted GET /api/cart reaches the proxy, which picks the API pool by path and api-07 by least requests, adds X-Forwarded-For and forwards it; the response returns through the proxy](/img/system-design/load-balancer/02-request-path.png)](/img/system-design/load-balancer/02-request-path.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The L4 balancer decides once per connection, the L7 proxy once per request.** All packets of one TCP
  connection must reach the same L7 node, or the connection breaks. The L4 balancer guarantees this by hashing
  the 5-tuple and remembering its choice in a **connection table**. Every later packet of the TLS handshake and
  the request still flows through it, untouched.
- **The L7 proxy holds two connections:** one with the client, one with the backend. It reuses backend
  connections across many client requests (**connection pooling**), so backends do not pay for a new TCP and
  TLS handshake each time.
- **The backend no longer sees the client's IP address**, only the proxy's. The proxy adds the original one in
  an `X-Forwarded-For` header (or the **PROXY protocol** for non-HTTP traffic) so logs and rate limits
  still work.
- **One slow backend does not hold the client hostage.** The proxy applies a timeout and can retry a safe
  (idempotent) request on another backend.

## 7. Deep dive: L4 vs L7

| | L4 (transport layer) | L7 (application layer) |
| --- | --- | --- |
| **Sees** | IP addresses, ports, TCP flags | Full HTTP: method, path, host, headers, cookies, body |
| **Decides** | Once per connection | Once per request (many per connection) |
| **Routing options** | By destination port and a hash of the 5-tuple | By path, host, header, cookie, method, weights for canary releases |
| **TLS** | Passes encrypted bytes through untouched | Usually decrypts (terminates) TLS |
| **Cost** | Very low: no parsing, can run in the kernel or in hardware | Higher: TLS crypto and HTTP parsing per request |
| **Extras** | Works for any TCP/UDP protocol (databases, games, DNS) | Retries, compression, caching, header rewriting, per-request metrics |
| **Examples** | Linux IPVS, AWS Network Load Balancer, Google Maglev, Meta Katran | NGINX, HAProxy, Envoy, AWS Application Load Balancer |

A subtle but important L7 advantage: with **HTTP/2 and gRPC**, a client sends thousands of requests over one
long-lived connection. An L4 balancer pins that connection to one backend, so one backend gets all of that
client's load. An L7 proxy spreads each request separately.

### How an L4 balancer forwards packets

There are three common ways, and interviewers like to hear them:

- **NAT** (network address translation): the balancer rewrites the destination address from the VIP to the
  backend's address, and the response comes back through the balancer, which rewrites it again. Simple, but
  every response byte passes through the balancer.
- **DSR** (direct server return): the balancer forwards the packet unchanged in its IP addresses; the backend
  also owns the VIP (on a loopback interface) and **replies straight to the client**. Since responses are about
  10× bigger than requests (section 3), the balancer carries a tenth of the traffic. The catch: balancer and
  backends usually need to share a network segment, and the balancer never sees responses.
- **Tunnelling** (IP-in-IP, GRE or GUE encapsulation): like DSR, but the packet is wrapped in an outer packet
  addressed to the backend, so backends can be anywhere in the data centre. Google's Maglev and Meta's Katran,
  both publicly documented, work this way.

## 8. Deep dive: balancing algorithms

The algorithm answers one question: **which backend gets this request?** A good one keeps every backend
about equally busy, reacts to slow or broken ones, and is cheap to compute.

| Algorithm | How it picks | Good for | Weak spot |
| --- | --- | --- | --- |
| **Round robin** | Next backend in turn: 1, 2, 3, 1, 2, 3… | Identical servers, similar requests | Ignores how busy each server is |
| **Weighted round robin** | In turn, but a weight-2 server gets twice as many | Mixed machine sizes, canary releases (weight 1 of 100) | Weights are static guesses |
| **Least connections** | Backend with the fewest open connections (or in-flight requests) | Requests of very different cost | Needs an accurate, up-to-date count |
| **Power of two choices** | Pick 2 backends at random, send to the less loaded one | Many balancer nodes, each with a partial view | Slightly less even than a perfect global choice |
| **Consistent hashing** | Hash a key (user ID, URL) to a backend; same key, same backend | Caches, sticky sessions, sharded data | Hot keys; uneven without virtual nodes |
| **Random** | Uniformly at random | Huge pools, as a simple baseline | Uneven over short periods |

[![Decision flow for choosing an algorithm: if the same key must reach the same server use consistent hashing; else if servers differ in size use weighted round robin; else if request cost does not vary use round robin; else if there are many balancers with a partial view use power of two choices, otherwise least connections](/img/system-design/load-balancer/03-choose-algorithm.png)](/img/system-design/load-balancer/03-choose-algorithm.png)

*Select the diagram to zoom in and move around.*

The questions combine in practice: **weighted least connections** exists for mixed hardware with uneven
requests, and most proxies apply weights to every algorithm.

### Why "least connections" can go wrong, and how two random choices fix it

Imagine 20 L7 proxy nodes, each running least connections on its own. A new backend joins with zero
connections. **All 20 proxies** see it as the least loaded and send it their next requests at the same
moment: a **thundering herd** that can knock it straight over. The proxies' views are stale and identical.

**Power of two choices** breaks the herd. Each proxy picks two backends at random and sends to the less
loaded of the two. Different proxies pick different pairs, so they spread out, yet always avoiding the worse
of two is enough to keep load remarkably even. The classic result from probability ("balls into bins") is
that the busiest bin becomes dramatically less overloaded with two random choices than with one, and a third
choice adds little. Envoy's "least request" balancer and NGINX's `random two least_conn` both use this idea.

### Consistent hashing

Plain hashing, `server = hash(user_id) % N`, keeps a user on one server, but when N changes from 10 to 11
almost every user moves (a key stays put only if its hash gives the same remainder for both, about 1 in 11).
For a pool of caches, that empties every cache at once.

**Consistent hashing** places both servers and keys on a circle of hash values (a **ring**). Each key goes
to the first server clockwise from it. Adding a server only takes over the keys between it and its
neighbour, about $1/N$ of them; removing one hands its keys to the next server along. Two refinements make it
work in practice:

- **Virtual nodes:** each server appears at 100 or more points on the ring, so the arcs even out and a
  failed server's keys spread over many servers instead of landing on one.
- **Bounded loads:** cap each server at, say, 125% of the average; if the chosen server is full, the key
  moves on to the next one clockwise. This stops one hot key range from overloading a server.

The [distributed cache](/system-design/case-studies/easy/distributed-cache/) case study walks through the ring
with a worked example.

**Maglev hashing** (from Google's Maglev paper) is a variant built for L4 balancers: it fills a large lookup
table so a pick is one array read, spreads load very evenly, and moves few connections when backends
change.

### Slow start

A backend that just started has cold caches and, in languages with a JIT compiler such as Java, cold code.
Giving it a full share at once makes it slow and can trip its health checks. **Slow start** ramps its weight
from near zero to full over, for example, 30–60 seconds.

## 9. Deep dive: health checks and connection draining

The balancer must know which backends can take traffic. It learns this in two ways.

**Active health checks:** every few seconds the balancer calls each backend, for example `GET /healthz`, and
expects `200 OK` within a timeout. Typical settings: every **5 s**, timeout **2 s**, mark unhealthy after
**3** failures in a row, healthy again after **2** successes. Requiring several results in a row
(**hysteresis**) stops a backend from flapping in and out on one lost packet. Worst case, a dead backend
is detected in about $3 \times 5\text{ s} = 15\text{ s}$; shorter intervals detect faster but cost more probes.

**Passive health checks (outlier detection):** the balancer watches real traffic. If a backend returns, say,
5 errors in a row or its error rate jumps above its peers', it is **ejected** for a short time even though its
health endpoint still says "OK". This catches what probes miss: a server that answers `/healthz` but fails
real requests.

What should `/healthz` check? Only what **this** server needs to serve requests: the process is up, it has
loaded its config, it can reach its own critical dependencies. Be careful with shared dependencies: if every
backend's health check fails when the shared database is slow, the balancer removes **all** backends, and a
partial outage becomes a total one. Many balancers therefore **fail open** (Envoy calls this its panic threshold): if too many backends (say more
than half) look unhealthy at once, assume the checks are wrong and keep sending traffic to all of them.

[![Lifecycle of a backend: Registered, then Slow start after 2 checks pass, Healthy when the ramp is done, Draining on deploy or scale-in, Removed when idle or after a timeout; from Healthy, 3 failed checks lead to Unhealthy, which returns to Slow start after 2 passing checks, and a burst of 5xx errors leads to Ejected, which returns to Healthy when its timer expires](/img/system-design/load-balancer/04-backend-states.png)](/img/system-design/load-balancer/04-backend-states.png)

*Select the diagram to zoom in and move around.*

### Connection draining

During a deploy, we replace servers one by one. If the balancer simply forgot a server, every request it was
in the middle of would fail. **Draining** retires it politely:

1. The deploy tool deregisters the backend; it enters **Draining**.
2. The balancer sends it **no new** requests or connections, but lets in-flight requests finish.
3. For long-lived HTTP keep-alive connections, the proxy closes them after their current request (HTTP/1.1
   `Connection: close`, or an HTTP/2 `GOAWAY` frame), so clients reconnect and land on another backend.
4. When the backend has no open connections, or a **draining timeout** expires (AWS defaults to 300 seconds;
   many teams use 30–60 s), it is **Removed** and can be shut down.

WebSockets and other long streams are the hard case: they may never finish on their own. The timeout bounds
the wait, and well-behaved clients reconnect automatically.

## 10. Deep dive: session stickiness

Some applications keep a user's state in one server's memory: a shopping cart, a login session, a half-filled
form. Then every request from that user must reach the same server. This is **session affinity**, or
**sticky sessions**.

| Method | How it works | Problem |
| --- | --- | --- |
| **Source-IP hash** | Hash the client's IP address to a backend (at L4 or L7) | Many users behind one office or mobile carrier NAT share an IP and all land on one server; a phone switching from Wi-Fi to 4G changes IP and loses its server |
| **Balancer cookie** | On the first response the L7 proxy sets a cookie, for example `lb=api-07`; later requests carrying it go to `api-07` | Only works at L7 and for clients that keep cookies |
| **Application key hash** | Consistent hashing on a user ID or session ID from a header or cookie | The key must be readable by the proxy |

Stickiness is a trade-off, not a feature to switch on by default. It **unbalances load** (one heavy user
stays on one server), makes **draining slow** (sticky users keep returning) and **loses state when the server
dies** anyway. The better fix is usually to make servers **stateless**: keep sessions in a shared store such
as Redis or in a signed cookie, so any server can handle any request. Use stickiness where it is a
performance win, such as routing a user to the cache server that already holds their data, not where
correctness depends on it.

## 11. Deep dive: TLS termination

HTTPS wraps HTTP in **TLS**, the protocol that encrypts traffic and proves the server's identity with a
**certificate**. Someone has to do the TLS work. There are three choices:

| Mode | Where TLS ends | Pros | Cons |
| --- | --- | --- | --- |
| **Termination** | At the L7 proxy; plain HTTP to backends | Proxy can read and route requests; certificates managed in one place; backends save CPU | Traffic inside the data centre is unencrypted |
| **Re-encryption** (bridging) | At the proxy, which opens a new TLS connection to the backend | Proxy can still route, and traffic stays encrypted end to end | Twice the TLS work (though backend connections are pooled and reused) |
| **Passthrough** | At the backend; the balancer forwards encrypted bytes at L4 | Private keys never leave the backends | No L7 routing, no cookies, no per-request metrics |

Most modern designs **terminate at the edge and re-encrypt inside**, often with **mutual TLS** (both sides show
certificates) between services, because "the internal network is safe" is no longer a safe assumption.

Two details worth knowing:

- **SNI** (Server Name Indication) is the host name the client sends in plain text at the start of the TLS
  handshake. It lets one VIP serve many sites with different certificates, and it lets even an L4 passthrough
  balancer route by host name.
- **The TLS handshake is the expensive part**, not encrypting the bytes afterwards (modern CPUs have AES
  instructions). **Session resumption** lets a returning client skip most of the handshake, and keeping
  connections alive avoids repeating it at all. Private keys are the crown jewels: keep them in memory only,
  rotate them, and for the most sensitive keys use a hardware security module.

## 12. Making the balancer itself highly available

We added a balancer to remove single points of failure, and created a new one. Three techniques fix this,
often used together.

### Active-passive pair with a floating VIP

Two balancer machines share one VIP. The **active** one answers for it; the **passive** (standby) one waits.
They run **VRRP** (Virtual Router Redundancy Protocol), usually through the `keepalived` daemon: the active
node sends a small "I'm alive" advertisement about once a second.

[![Failover sequence: normally LB A sends VRRP adverts every second and the router forwards packets for the VIP to A's MAC address; when A crashes, packets to it are lost, LB B hears no advert for about 3 seconds and promotes itself, sends a gratuitous ARP saying the VIP is now at its MAC, and the router sends retried packets to B](/img/system-design/load-balancer/05-failover.png)](/img/system-design/load-balancer/05-failover.png)

*Select the diagram to zoom in and move around.*

The trick is the **gratuitous ARP**. On a local network, the router finds which machine owns an IP address
with ARP ("who has 203.0.113.10?"). The new active node announces, unasked, "203.0.113.10 is at **my**
hardware address", and the router updates its table at once. Failover takes a few seconds; clients see a
brief stall and TCP retransmits cover most of it, but connections that held state on A (such as TLS
sessions) must reconnect unless the pair synchronises its connection table.

The weakness: half the hardware sits idle, and one active node caps capacity.

### Active-active with ECMP and BGP

Larger systems run many balancer nodes, **all active**. Each one announces the same VIP to the router using
**BGP** (the routing protocol of the internet). The router now has several equal routes and uses **ECMP**
(equal-cost multi-path): it hashes each packet's 5-tuple to pick a node, so all packets of one connection
take the same path. If a node dies, its BGP session drops and the router stops using it (within a second or so with fast
failure detection such as BFD; default BGP timers are far slower), and capacity scales by adding nodes.

The catch: when the set of nodes changes, the router's hash changes and some existing connections land on a
different node, which has never seen them. This is why large L4 balancers (Maglev, Katran) use **consistent
hashing** to choose the backend, so every node independently makes the same choice for the same 5-tuple, and
keep a connection table as a second line of defence.

### Anycast and DNS

- **Anycast** takes the same idea worldwide: many sites announce the same IP address over BGP, and the
  internet's routing delivers each user to the nearest site. If a site goes down, its announcement is
  withdrawn and traffic flows to the next nearest. CDNs and public DNS resolvers rely on this.
- **DNS** can return several VIPs (one per site or per balancer pair). It is simple and works everywhere, but
  resolvers and clients **cache** answers for the record's **TTL** (time to live) and sometimes longer, so a
  failed address can keep receiving traffic for minutes. Use short TTLs (30–60 s), and never rely on DNS
  alone for fast failover.

## 13. Global vs local load balancing

**Local** load balancing spreads traffic **within** one region or data centre: everything in sections 5–12.
**Global** load balancing (often called **GSLB**, global server load balancing) decides **which region** a user
goes to in the first place.

[![Global and local balancing: a user in Paris and a user in Mumbai ask the global balancer, GeoDNS or anycast, which skips unhealthy regions and sends each to the nearest healthy region; in the Europe and Asia regions a regional L4 + L7 balancer picks a server](/img/system-design/load-balancer/06-global.png)](/img/system-design/load-balancer/06-global.png)

*Select the diagram to zoom in and move around.*

A global balancer weighs several signals:

- **Proximity:** the nearest region gives the lowest latency. **GeoDNS** guesses the user's location from
  the IP address of their DNS resolver; **anycast** lets internet routing decide.
- **Health:** each region reports whether it is up; an unhealthy region is skipped and its users go to the
  next nearest.
- **Capacity:** if Europe is full, overflow to the next best region rather than overload it.
- **Rules:** data-residency law may require that some users are served only in their own region.

| | Local (in a region) | Global (across regions) |
| --- | --- | --- |
| Decides | Which server | Which region or data centre |
| Mechanisms | L4/L7 balancers, ECMP, VRRP | GeoDNS, anycast, latency-based DNS |
| Reaction time | Seconds | Seconds (anycast) to minutes (DNS caches) |
| Granularity | Per connection or request | Per DNS answer or per network route |

A region failover must also be **planned for capacity**: if Europe's users move to Asia, Asia must have room
for them. A common rule is to run each region at most at about 60–70% of capacity, or keep spare capacity
that can scale up quickly.

## 14. Observability

The balancer sees every request, which makes it the best place to measure the whole service. Watch it at
three levels:

- **Per request (logs):** time, client IP, method, path, chosen backend, status code, bytes, and the timings
  of each phase (connect to backend, wait for first byte, total). Add a **request ID** header and pass it to
  the backend so one request can be traced end to end. At 350,000 requests a second, sample or aggregate
  logs; do not keep everything forever.
- **Per backend and pool (metrics):** requests per second, error rate (4xx and 5xx separately), latency
  percentiles (p50, p99), open and pending connections, health state, ejections. A backend whose p99 is twice
  its peers' is a problem even if its health check is green.
- **Per balancer node:** CPU, memory, connection table size, new connections and TLS handshakes per second,
  dropped packets, configuration version. The **configuration version** matters: a node stuck on an old
  config is a classic hidden fault.

A simple framework for alerts is **RED**: **R**ate, **E**rrors and **D**uration of requests, per pool. Alert
on what users feel (error rate, latency), and use the per-backend detail to find the cause.

## 15. Overload protection

When demand exceeds capacity, a system that tries to serve everyone often serves no one: queues grow,
latency climbs, clients time out and **retry**, which adds even more load. The balancer is the right place to
stop this spiral, because rejecting a request there costs almost nothing.

[![Overload protection: a request is checked against the node's connection cap, the client's rate limit and whether the pool has room in its pending queue and circuit breaker; if all pass it is forwarded with a timeout, otherwise it is refused, answered with 429 Too Many Requests, or answered with 503 and Retry-After](/img/system-design/load-balancer/07-overload.png)](/img/system-design/load-balancer/07-overload.png)

*Select the diagram to zoom in and move around.*

The tools, from the outside in:

- **Connection limits:** each node accepts at most N connections, so a flood cannot exhaust its memory.
- **Rate limits** per client IP or API key: one misbehaving client gets `429 Too Many Requests`, not everyone.
- **Bounded queues:** if all backends are busy, wait in a short queue; when the queue is full, fail fast with
  `503` and a `Retry-After` header. A fast "no" is better than a slow timeout.
- **Circuit breakers:** if a pool's errors or pending requests cross a threshold, stop sending to it for a
  while instead of piling on.
- **Retry budgets:** let retries be at most, for example, 10–20% of requests, so retries cannot double the load
  during an outage.
- **Timeouts** on every backend call, so slow servers release the proxy's resources.
- **Priority shedding:** under pressure, drop low-value traffic first (prefetches, analytics beacons) and keep
  checkout and login working.

## 16. What breaks as it grows, and how to fix it

**The single balancer.** One box limits both capacity and availability. *Fix:* an active-passive pair first,
then many active nodes behind ECMP, and anycast across sites.

**Long-lived connections.** HTTP/2, gRPC and WebSockets keep one connection open for hours; an L4 balancer
or a new backend sees load arrive unevenly and old backends keep their connections forever. *Fix:* balance
per request at L7, and have proxies or servers close connections after a maximum age so clients spread out
again.

**The thundering herd.** A new or recovered backend is flooded by every proxy at once. *Fix:* power of two
choices and slow start.

**Health-check storms.** 50 proxies each checking 2,000 backends every 2 s is 50,000 probes a second, a load
of its own. *Fix:* longer intervals plus passive outlier detection, or a central health service that checks
each backend once and shares the results through the control plane.

**Configuration churn.** In a large fleet with autoscaling, backends change every second. *Fix:* push
incremental updates (only what changed) from the control plane instead of full configs, as Envoy's xDS
APIs do.

**Hot keys with consistent hashing.** One celebrity's user ID sends a flood to one server. *Fix:* bounded-load
consistent hashing, or detect hot keys and spread them over several servers.

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Layer | L4 only | L7 only | **Both**: L4 in front for a stable VIP and cheap scale-out, L7 behind for routing and TLS |
| L4 forwarding | NAT | DSR / tunnelling | **DSR or tunnelling**: responses skip the balancer, saving most bandwidth |
| Algorithm | Round robin | Least requests | **Least requests with two random choices**: adapts to slow servers, no herd |
| Stickiness | Sticky sessions | Stateless servers | **Stateless**: even load, easy draining; stickiness only as a cache optimisation |
| TLS | Terminate at the edge | Passthrough | **Terminate and re-encrypt**: routing and metrics at the edge, encryption inside |
| Balancer HA | Active-passive (VRRP) | Active-active (ECMP + BGP) | **Active-passive** for small setups; **active-active** at scale for capacity |
| Health checks | Active probes | Passive outlier detection | **Both**: probes find dead servers, real traffic finds broken ones |
| Global routing | DNS | Anycast | **Depends**: DNS is simple and flexible; anycast fails over in seconds |

## Cheat sheet for last-minute revision

- **What it does:** spreads requests over a pool of identical backends behind one stable VIP, for scale,
  availability and freedom to change servers.
- **L4 vs L7:** L4 sees IPs and ports, decides per connection, cheap, any protocol. L7 sees HTTP, decides per
  request, routes by path/host/header, terminates TLS. Big systems run L4 in front of L7.
- **L4 forwarding:** NAT (responses return through it), DSR and tunnelling (responses go straight to the client).
- **Algorithms:** round robin (equal servers), weighted (unequal servers), least connections (uneven requests),
  power of two choices (many balancers, no herd), consistent hashing (same key, same server; moves about
  $1/N$ of keys on change; use virtual nodes and bounded loads).
- **Health:** active probes (every 5 s, 3 fails out, 2 passes in) plus passive outlier detection; fail open if
  most backends look dead; slow start for new backends.
- **Draining:** stop new requests, finish in-flight ones, close keep-alives, remove after idle or timeout.
- **Stickiness:** source-IP hash or cookie; prefer stateless servers with shared session storage.
- **TLS:** terminate, re-encrypt, or pass through; SNI routes by host name; handshakes are the CPU cost.
- **Balancer HA:** active-passive with VRRP and a floating VIP (gratuitous ARP), active-active with ECMP + BGP,
  anycast across sites, DNS with short TTLs.
- **Global vs local:** GSLB picks the region (GeoDNS, anycast, health, capacity); local picks the server.
- **Overload:** connection caps, rate limits (`429`), bounded queues (`503` + `Retry-After`), circuit breakers,
  retry budgets, timeouts.
- **Numbers:** 10B requests a day ≈ 115K/s average, 350K/s peak; responses ≈ 10× requests; about 12 L7 nodes.

## Practice questions

1. **After a deploy, one backend gets far more traffic than the others. Why might that be?** Likely causes:
   least connections with a thundering herd onto the fresh backend, long-lived HTTP/2 or gRPC connections
   balanced at L4, sticky sessions concentrated on it, or a hot key under consistent hashing. Check the
   per-backend request and connection metrics, then fix with two random choices, slow start, per-request L7
   balancing or connection max age.
2. **How would you do a canary release with a load balancer?** Put the new version in its own pool and route
   a small weight (1%, then 5%, 25%…) to it with weighted routing, or route by header for internal testers.
   Compare its error rate and latency with the old pool before raising the weight.
3. **Your health check says every backend is down, but they are serving fine. What happened, and what should
   the balancer do?** Perhaps the check depends on a shared dependency, or the network path between balancer
   and backends is broken. The balancer should fail open (keep sending traffic when too many look unhealthy)
   and rely on passive outlier detection; the health check should test only what the server itself needs.
4. **How do you balance WebSocket connections fairly when servers are added?** New connections go to the
   least loaded server, but old ones stay put. Cap connection age so clients reconnect gradually (with
   jitter, so they do not all reconnect at once), and drain servers before removing them.
5. **Why not just use DNS round robin and skip the load balancer?** DNS answers are cached for minutes, so a
   dead server keeps receiving traffic; DNS cannot see server load or health per request; and clients pick
   addresses unevenly. DNS is good for choosing a region, not for balancing within one.
