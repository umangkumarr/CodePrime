---
title: "Design Shopify (a multi-tenant e-commerce platform)"
description: "Design a Shopify-style multi-tenant platform: pods, tenant isolation, custom domains, cached storefronts, app rate limits and flash sales."
difficulty: "Medium"
sidebar:
  label: "Shopify (multi-tenant e-commerce)"
tags: ["Multi-tenancy", "Sharding", "Caching", "Rate limiting", "Webhooks"]
---

Building one online shop is a well-known problem: a catalogue, a cart, a checkout, a payment. The
[e-commerce store case study](/system-design/case-studies/medium/ecommerce-store/) covers it. A platform like
Shopify is a different problem. It runs **millions of independent shops** for millions of different merchants,
on the **same** servers and databases. Each merchant thinks of the shop as *theirs*: their own domain, their own
design, their own data, their own apps. None of them should ever see another's data, and none of them should be
slowed down because another shop is running a sale.

A good picture is a **shopping mall**. The mall owner builds one building with shared electricity, security,
car park and lifts, and rents units to thousands of shopkeepers. Each shop has its own sign and its own till.
The owner's hard problems are not about selling shoes. They are about **sharing the building fairly**, keeping
one unit's fire from spreading, and handling the day a famous brand opens and ten thousand people queue outside
one door.

This case study designs that mall. We assume you know how a single store's cart and checkout work, and focus on
what changes when the same system must serve millions of tenants at once.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Multi-tenancy in 5 minutes

First the vocabulary. Every term below comes back later.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Tenant** | One customer of the platform whose data must be kept apart. Here, one **shop** (identified by `shop_id`) | One shop unit in the mall |
| **Multi-tenant** | Many tenants share the same code, servers and databases | Many shops in one building |
| **Noisy neighbour** | A tenant whose heavy use slows everyone sharing its resources | The unit with a queue that blocks the corridor |
| **Shard** | One slice of the data, held by one database cluster | One floor of the mall |
| **Pod** (or **cell**) | A complete, self-contained copy of the data stack (database, caches, queues) serving a subset of shops | A self-contained wing with its own fuse box |
| **Blast radius** | How many tenants one failure can affect | How many shops lose power when one fuse blows |
| **Custom domain** | The merchant's own name, such as `mugs.example.com`, instead of a platform subdomain | The shop's own sign over the door |
| **Theme** | The templates and styles that decide how a shop looks | The shop's interior design |
| **App** | Third-party software a merchant installs to add features (reviews, email marketing, accounting) | A contractor given a key to the shop |
| **Webhook** | An HTTP call the platform makes *to* an app when something happens ("order created") | The mall phoning the contractor |

### Three ways to host many tenants

| Model | How it works | Good | Bad |
| --- | --- | --- | --- |
| **Silo** | Every shop gets its own servers and database | Perfect isolation | Millions of tiny databases; hopeless cost and operations |
| **Pool** | Everything is shared; every table has a `shop_id` column | Cheapest, simplest to run | One bad query, hot shop or outage hits everyone |
| **Pods (hybrid)** | Shops are grouped; each group gets its own full data stack, the code is the same everywhere | Failures and load stay inside one pod; scales by adding pods | A routing layer is needed; moving shops between pods is work |

Shopify has written publicly that it uses the third model: shops are spread across **pods**, each pod an isolated
set of data stores, and a routing layer sends every request to the right pod. This case study follows that idea.

## 2. Requirements

### Functional (what users can do)

There are three kinds of user, and they want very different things.

- **Merchants** sign up and get a shop at `<name>.<platform-domain>` within seconds; connect a custom domain;
  manage products, inventory, orders and customers in the **admin**; choose and edit a **theme**; install apps.
- **Buyers** browse a shop's storefront, search, add to cart and check out with card or wallet payments.
- **App developers** build apps that call the shop's data through **APIs** (with the merchant's permission) and
  receive **webhooks** when things change.
- The platform runs **flash sales** on any shop without hurting other shops.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Tenant isolation** | A shop can never read or change another shop's data | One leak breaks every merchant's trust |
| **Performance isolation** | One shop's spike or bad app does not slow other shops | Merchants share infrastructure but pay for their own experience |
| **Availability** | 99.99% for storefront and checkout | Every minute down is lost sales for millions of merchants |
| **Latency** | Storefront pages under ~200 ms at the edge; checkout steps under a second | Slow shops lose buyers |
| **Scale** | Millions of shops; peak shopping days several times normal traffic | Black Friday is the platform's exam |
| **Elasticity** | A single shop can go from 10 to 100,000 buyers in a minute | Product drops and celebrity launches |
| **Compliance** | Payment card data handled under PCI DSS; privacy laws (GDPR and similar) | Legal requirement to take cards |

### Out of scope

The single-store mechanics (cart, inventory reservation, the order saga, shipping) are covered in the
[e-commerce store case study](/system-design/case-studies/medium/ecommerce-store/). We also skip the theme
editor UI, point-of-sale hardware, fraud models, tax engines and the app marketplace itself.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resources dominate**.

**Assumptions:** 5 million shops. An average shop gets 400 storefront page views and 4 orders a day, has 200
products with 3 variants and 3 images each, and has 10 apps installed. Traffic is very **skewed**: most shops are
tiny, a few thousand are huge. Peak days run at about 10× the average.

**Traffic**

- Storefront page views: $5\text{M} \times 400 = 2\text{B}$ a day, about **23,000 per second** on average and
  about **230,000 per second** at peak.
- Orders: $5\text{M} \times 4 = 20\text{M}$ a day, about **230 per second**, a few thousand per second at peak.
- App API calls: if each app makes 500 calls a day per shop, $5\text{M} \times 10 \times 500 = 25\text{B}$ calls a
  day, about **290,000 per second**. **API traffic from apps can exceed buyer traffic.** That is why apps need
  their own rate limits.

**Storage**

- Catalogue rows: $200 \times 3 \times 2\text{ KB} \approx 1.2\text{ MB}$ per shop.
- Orders: $4 \times 365 \times 5\text{ KB} \approx 7.3\text{ MB}$ per shop per year.
- So roughly 10 MB of relational data per shop per year, or $5\text{M} \times 10\text{ MB} = 50\text{ TB}$ a year
  across the platform, before replicas and indexes.
- Images: $200 \times 3 \times 500\text{ KB} = 300\text{ MB}$ per shop, so $1.5\text{ PB}$ in object storage,
  served by a CDN.

**Custom domains**

- If 40% of shops use one, that is **2 million TLS certificates**. Free ACME certificates (explained in section
  10) from Let's Encrypt last 90 days today, so renewing each one every ~60 days is
  $2\text{M} / 60 \approx 33,000$ renewals a day. Let's Encrypt plans to cut the lifetime to 45 days by 2028,
  which roughly doubles that rate: renewal must be automatic and cheap.

Three conclusions follow:

1. **The average shop is tiny.** 10 MB a year fits thousands of shops on one database. Giving each shop its own
   database (the silo model) would waste almost everything.
2. **The biggest shops are not tiny.** A few shops are thousands of times the average, so we must be able to move
   them, isolate them, and absorb their spikes.
3. **Reads dwarf writes.** 23,000 page views a second against a few hundred orders: storefronts must be served
   from caches, and checkout must be protected from browsing traffic.

## 4. The API

Three audiences, three surfaces. All are HTTPS.

| Surface | Example | Who calls it |
| --- | --- | --- |
| **Storefront** (HTML) | `GET https://mugs.example.com/products/blue-mug` | Buyers' browsers. The *host name* says which shop |
| **Storefront API** | `POST /api/storefront/graphql` with a public token | Custom front ends and mobile apps of one shop |
| **Checkout** | `POST /checkouts/{token}/complete` with an `Idempotency-Key` | The buyer's browser during payment |
| **Admin API** | `POST /admin/api/graphql` with `query { orders(first: 50) { ... } }` | The merchant's admin and installed apps, using an access token tied to one shop |
| **Webhooks** (outbound) | `POST https://app.example.net/hooks/orders-create` signed with HMAC | The platform, calling apps |
| **OAuth install** | `GET /admin/oauth/authorize?client_id=...&scope=read_orders` | A merchant installing an app |

Notice that the **shop is never a parameter the caller can freely choose**. On the storefront it comes from the
host name. On the Admin API it comes from the access token, which was issued for exactly one shop. An app cannot
ask for `shop_id=999` and get another merchant's orders, because the server derives the shop from credentials it
issued, not from the request body.

## 5. High-level design

[![High-level architecture: buyers, merchants and third-party apps reach the edge (CDN and TLS), which forwards cache misses to the shop router; the router looks up the shop's pod in the pod directory and sends pages, checkout and admin traffic into pod 1, whose storefront renderer, checkout, admin and job workers use the pod's own caches and MySQL shard; checkout calls a shared payments service and job workers send signed webhooks to apps' servers](/img/system-design/shopify/01-architecture.png)](/img/system-design/shopify/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Edge (CDN + TLS):** terminates HTTPS for millions of domains, serves images and cached pages from locations
  near the buyer, and absorbs attacks.
- **Shop router:** works out which shop a request is for (from the host name or token), looks up that shop's pod,
  applies per-shop rate limits, and forwards the request.
- **Pod directory:** a small, heavily cached table `shop_id → pod_id` (plus `hostname → shop_id`).
- **Pod:** a self-contained slice of the platform for a subset of shops: its own MySQL primary and replicas,
  Redis, Memcached and job queues. Every pod runs the same code.
- **Storefront renderer:** builds shop pages from the shop's theme and data; read-only, so it can use replicas and
  caches freely.
- **Checkout:** turns carts into orders. Write-heavy and the most protected path.
- **Admin + APIs:** the merchant's admin and the Admin API used by apps.
- **Job workers:** everything that can happen later: emails, imports, image processing, webhooks.
- **Shared services:** things that are global by nature (sign-up, billing, the payments service, the app
  registry) live outside pods.

The most useful idea in this design: **stateless code is shared, state is partitioned**. Any web server can run
code for any shop; the data a request touches lives in exactly one pod. That gives us the cheapness of the pool
model and most of the isolation of the silo model.

## 6. Flow 1: how a request finds its shop

A buyer opens `https://mugs.example.com/products/blue-mug`.

[![Routing sequence: the browser's TLS hello names mugs.example.com so the edge picks that certificate; the GET misses the page cache and is forwarded to the shop router, which looks up the host in the pod directory (shop 4821, pod 7) and forwards to pod 7's storefront renderer; the HTML returns through router and edge, which keeps a copy](/img/system-design/shopify/02-routing.png)](/img/system-design/shopify/02-routing.png)

Things worth noticing:

- **The host name is the tenant key.** Before any HTTP is sent, the browser's TLS handshake carries the name it
  wants in the **SNI** field (*Server Name Indication*). That is how one edge IP address can present the right
  certificate for any of two million domains.
- **The lookup must be nearly free.** Every request needs it, so the router keeps `hostname → shop_id → pod_id` in
  memory and refreshes it from the directory. Shopify has described its router (called "Sorting Hat") as running
  inside its load balancers, written as Lua scripts in nginx/OpenResty.
- **From here on, the shop is fixed.** The pod receives `shop_id` from the router, and every query it runs is
  scoped to that shop.

## 7. The data model

[![Data model: a global directory holds shops (with pod_id) and shop_domains; inside pods, products have variants, orders have order_lines that point to variants, and app_installations have webhook_subscriptions; every pod table starts its primary key with shop_id](/img/system-design/shopify/03-data-model.png)](/img/system-design/shopify/03-data-model.png)

*Select the diagram to zoom in and move around.*

Four decisions hide in this diagram.

**1. Every pod table starts with `shop_id`.** The primary key of `products` is `(shop_id, product_id)`, not
`product_id`. All of one shop's rows sit together on disk, every index begins with the shop, and "list this shop's
products" is a single range scan. It also makes moving a shop possible: "copy every row where `shop_id = 4821`" is
a well-defined set.

**2. The directory is global; everything else is per pod.** `shops` (with its `pod_id`) and `shop_domains` must be
readable before we know the pod, so they live in a small global store that is replicated everywhere and cached by
the router. It is read millions of times a second and written only when a shop signs up, adds a domain or moves.

**3. No query may forget the tenant.** One missing `WHERE shop_id = ?` is a data leak. Defences come in layers:

- the application gets the shop from the request context, never from user input;
- the data-access layer adds the `shop_id` condition automatically (a "default scope") and refuses queries without
  one;
- automated tests and static checks flag queries that touch tenant tables without the shop key;
- a pod only holds its own shops, so even a bug can only reach shops on the same pod.

**4. Prefer IDs that are unique globally.** If `order_id` were only unique inside one database, moving a shop to
another pod could collide with an existing ID there. Globally unique IDs (for example from a central ID service
or a time-based scheme) make moves a plain copy.

## 8. Deep dive: pods, sharding and noisy neighbours

### Why not just shard the tables?

Classic sharding splits the **database** only: shop 4821's rows live on shard 7, but the caches, queues and job
workers are shared by all shops. That leaves two problems:

- A shop flooding the shared Redis or job queue still hurts everyone.
- An outage of any shared piece takes down every shop at once.

A **pod** takes sharding to its conclusion: shard *everything stateful* by shop. Pod 7 has its own MySQL, Redis,
Memcached and queues. If pod 7's database fails over, only pod 7's shops notice. The blast radius of any data-layer
failure is one pod, a small fraction of shops.

### Placing shops

New shops go to whichever pod has the most spare room. Placement uses a **directory** (an explicit
`shop_id → pod_id` table), not a hash function. With a hash, the pod is a formula, and changing the number of pods
or moving one heavy shop is hard. With a directory, moving a shop is one row update after the data is copied.

### The noisy neighbour, layer by layer

Isolation is not one mechanism; it is a set of limits at every shared layer.

| Layer | What can go wrong | Defence |
| --- | --- | --- |
| Edge | A bot scrapes one shop at 50,000 requests a second | Per-shop and per-IP rate limits, bot detection, cached responses |
| Router | One shop's sale saturates the web servers | Per-shop concurrency caps and the checkout throttle (section 13) |
| Web workers | Slow requests from one shop hold all workers | Request timeouts; separate worker pools for storefront, checkout, admin and API |
| Database | A merchant exports 2 million orders | Big jobs run in the background, in batches, on replicas, with per-shop job limits |
| Job queues | One shop enqueues a million jobs | Per-shop fair scheduling, so other shops' jobs still run |
| Apps | A badly written app polls non-stop | API rate limits per app per shop (section 12) |
| Pod | One giant shop dominates its pod | Move it to a quieter pod, or give it a pod of its own |

The theme is the same everywhere: **budget per tenant, not just per server**. A server-wide limit protects the
server; only a per-shop limit protects the *other shops*.

### Admin traffic versus buyer traffic

Buyer traffic is huge, bursty and mostly reads. Merchant and app traffic is smaller but write-heavy and full of
expensive operations (bulk edits, reports, imports). Running them in separate worker pools, with separate limits,
means a merchant's CSV import of 50,000 products can never slow the storefront of the shop next door, or even of
that same merchant.

## 9. Deep dive: moving a shop between pods

Pods fill unevenly: shops grow, some explode overnight, new hardware arrives. We need to move a shop from pod 3 to
pod 7 **while it keeps selling**.

[![Shop move lifecycle: planned, then copying (bulk copy while logging changes), catching up (replaying the binlog), cutover (writes paused for seconds) and switched (directory points to the new pod); errors or growing lag during catch-up, or a cutover timeout, lead to aborted, where the old pod still serves the shop, and the move is retried later](/img/system-design/shopify/04-shop-move.png)](/img/system-design/shopify/04-shop-move.png)

*Select the diagram to zoom in and move around.*

Step by step:

1. **Copy.** Read every row with `shop_id = 4821` from the source in batches and write it to the target. The shop
   is still live, so rows change while we copy.
2. **Catch up.** MySQL records every change in its **binary log** (binlog). We started reading it before the
   copy, so we can replay every change to shop 4821's rows on the target until the target is only a moment behind.
3. **Cutover.** Briefly pause writes for this one shop (requests wait or retry for a few seconds), apply the last
   few changes, then flip the shop's row in the directory to pod 7 and clear the router caches.
4. **Clean up.** After verification, delete the old copy from pod 3.

Shopify open-sourced a tool called **Ghostferry** that works in this copy-then-binlog style. The key property is
that **the source stays the truth until the last second**. If anything goes wrong before the directory flip, we
abort, the shop never noticed, and we try again later. Only one shop pauses, and only for seconds.

Two more uses of the same machinery:

- **Rebalancing:** a background planner moves shops from full pods to empty ones.
- **Disaster recovery:** each pod's data is replicated to another data centre, so a whole pod can be failed over
  as a unit.

## 10. Deep dive: custom domains and TLS at scale

A merchant wants `mugs.example.com` to show their shop over HTTPS. We must (1) prove they control the domain,
(2) get a certificate for it, and (3) serve the right certificate for each of millions of domains.

[![Custom domain sequence: the merchant adds mugs.example.com and is told to create a CNAME pointing at the platform; the domain service polls DNS until it resolves to us, places an ACME order with a certificate authority such as Let's Encrypt, the CA checks an HTTP-01 challenge answered by the edge, returns a signed certificate, and the domain service stores the certificate and key at the edge; HTTPS then works, with the certificate chosen by SNI and renewed before expiry](/img/system-design/shopify/05-custom-domain.png)](/img/system-design/shopify/05-custom-domain.png)

Key ideas:

- **DNS does the pointing.** The merchant adds a `CNAME` (an alias) from their name to a platform host, or an `A`
  record to the platform's IP for an apex domain like `example.com`. Our edge now receives traffic for that name.
- **ACME automates certificates.** ACME (*Automatic Certificate Management Environment*, RFC 8555) is the protocol
  certificate authorities like Let's Encrypt use to issue certificates without humans. In the **HTTP-01
  challenge**, the CA gives us a random token and fetches
  `http://mugs.example.com/.well-known/acme-challenge/<token>`. Only whoever controls where that name points can
  answer, so answering proves control.
- **Certificates are data, not config files.** Two million certificates do not fit in a config file reloaded on
  every change. They live in a replicated store keyed by host name; edge servers load a certificate on demand
  during the TLS handshake (using SNI) and keep hot ones in memory.
- **Renewal is a background job.** About 33,000 renewals a day (section 3) run spread over the day, with retries
  and alerts when a domain stops pointing at us. A certificate that silently expires takes a shop offline.
- **Private keys are secrets.** They are encrypted at rest and only decrypted on edge servers.

## 11. Deep dive: storefront rendering and caching

Every shop looks different because of its **theme**. Shopify themes are written in **Liquid**, a template language
Shopify created and open-sourced. A template like `{{ product.title }}` is filled in with the shop's data.

Why a dedicated template language instead of letting merchants run arbitrary code? Because it is **safe to run
untrusted templates for millions of tenants**: Liquid cannot open files, call the network or loop forever, and the
renderer can cap how much work one page does. A merchant's theme cannot take down the server or read another
shop's data.

[![Storefront workflow: a GET for a product page checks the edge cache (hit: send HTML), then the page cache keyed by shop, theme, URL and currency (hit: send HTML); on a miss the renderer loads data from Memcached then a replica, renders the Liquid theme, saves the page and sends the HTML with a short TTL](/img/system-design/shopify/06-storefront.png)](/img/system-design/shopify/06-storefront.png)

The storefront is a read-mostly problem, so it is caches all the way down:

- **Edge cache:** images, scripts and styles always; whole pages for anonymous buyers when the shop allows it.
- **Full-page cache** in the pod: the rendered HTML, keyed by **shop, theme version, URL, currency and language**.
  Forgetting a part of the key shows one buyer another's currency, or worse, another shop's page.
- **Data cache:** product and collection objects in Memcached, so a page miss rarely reaches MySQL, and when it
  does it reads a **replica**.
- **Personal bits stay out of the cached page.** The cart count and "Hi, Sam" are fetched separately by small
  requests, so the main page can be shared by every buyer.

**Invalidation** is the hard part. When the merchant edits a product, every cached page that showed it is wrong.
Two common approaches:

- **Tag-based purge:** each cached page is tagged with what it used (`shop:4821`, `product:991`); an edit purges by
  tag. Precise, but needs bookkeeping.
- **Versioned keys:** each shop has a cache version number in the key; any edit bumps it, and old entries simply
  stop being used and expire. Coarse (one edit invalidates the whole shop's pages) but trivial and safe.

A short TTL (time to live) on top bounds how stale anything can be. Shopify has also written about splitting
storefront rendering into its own read-optimised service, separate from the admin and checkout code, which is the
same idea as the separate worker pools in section 8.

## 12. Deep dive: apps, API rate limits and webhooks

Apps are what turn a shop into a business: reviews, email, accounting, dropshipping. But each app is **someone
else's code** calling our APIs, and the platform must protect itself and every shop from them.

### Access

A merchant installs an app through **OAuth**: the app asks for scopes (`read_orders`, `write_products`), the merchant
approves, and the platform issues an **access token bound to that one shop and those scopes**. Every API call is
checked against both.

### Rate limiting with a leaky bucket

Picture a bucket with a small hole in the bottom. Each request pours a cup of water in. Water leaks out at a fixed
rate. If the bucket is full, the request is refused with `429 Too Many Requests`.

- The **bucket size** allows short bursts (an app syncing 30 products at once).
- The **leak rate** is the sustained limit (for example a few requests per second).
- The bucket is kept **per app per shop**, so one greedy app cannot use up another app's budget, and an app busy
  with one shop is not slowed on another.

```text
on request(app, shop):
    level = bucket[app, shop].level - (now - last_seen) * leak_rate   # drain since last call
    level = max(level, 0)
    if level + cost > capacity:
        return 429, retry_after = (level + cost - capacity) / leak_rate
    bucket[app, shop] = (level + cost, now)
    handle the request
```

| Situation | Bucket (capacity 40, leak 2 per second) |
| --- | --- |
| App sends 40 requests at once | All accepted; bucket now full |
| 41st request a moment later | `429`, retry after about half a second |
| App then sends 2 per second forever | Always accepted: it matches the leak |

The counters live in Redis (fast, shared by every web server) with an expiry, so idle buckets disappear. The
read, check and write must run as **one atomic step** (a small Lua script inside Redis); otherwise two web servers
can both read the same level and both admit a request that only one should get.

For a **GraphQL** API, counting requests is not fair: one query can ask for 5 fields or 50,000. Shopify documents a
**cost-based** variant: each query is given a calculated cost from the fields and page sizes it requests, and the
bucket is filled with *points* instead of requests. Responses report the cost and the bucket level so apps can
pace themselves.

### Webhooks

Polling ("any new orders yet?") wastes everyone's budget. Instead, apps subscribe to topics like `orders/create` and
the platform calls them.

[![Webhook workflow: an order created in the shop's pod writes an event row in the same transaction; it is relayed to a durable event queue, the webhook service finds the subscribed apps, makes one job per app, signs the payload with HMAC-SHA256 and POSTs it; a 2xx means delivered, an error or timeout schedules a retry with exponential backoff, and repeated failures pause the subscription and email the developer](/img/system-design/shopify/07-webhooks.png)](/img/system-design/shopify/07-webhooks.png)

*Select the diagram to zoom in and move around.*

- **Never lose an event:** the event row is written in the **same database transaction** as the order (the
  *transactional outbox* pattern), then relayed to the queue. If the order exists, so does its event.
- **Signed payloads:** the platform signs the body with HMAC-SHA256 using a secret shared with the app, and sends
  the signature in a header. The app recomputes it to know the call really came from us.
- **At-least-once:** retries mean an app may receive the same event twice, so each event carries an ID the app can
  use to ignore duplicates.
- **Slow apps are isolated:** a short timeout and per-endpoint concurrency limits stop one dead app server from
  tying up the delivery workers. Repeated failures pause the subscription instead of retrying forever.

## 13. Deep dive: flash sales on one shop

A sneaker brand announces a drop at 10:00. At 09:59:59, 100,000 people are refreshing one shop, and only 2,000
pairs exist. Everything in the platform is spread across pods to share load, but this load is aimed at **one shop
on one pod**, and it is mostly writes: carts, stock reservations, payments.

[![Flash sale workflow: buyers click checkout; a per-shop checkout throttle checks whether this second's checkout budget has room; if yes the pod reserves stock atomically, takes payment with an idempotency key and confirms the order; if not the buyer waits in a waiting room with a signed ticket and polls until it is their turn; when no stock is left the buyer is told it is sold out at once](/img/system-design/shopify/08-flash-sale.png)](/img/system-design/shopify/08-flash-sale.png)

The defences:

1. **Serve browsing from the edge.** The product page is cached; 100,000 refreshes cost the pod almost nothing.
2. **Throttle checkout per shop.** The router lets a fixed number of checkouts per second into this shop's pod
   (the same leaky-bucket idea as for apps). Shopify has written about doing exactly this inside its scriptable
   load balancers.
3. **A waiting room, not an error.** Buyers above the limit get a "you're in the queue" page holding a **signed
   ticket** with their arrival time. The page polls; tickets are admitted roughly in order. A signature means a
   buyer cannot forge an earlier place. The queue state lives in the ticket, so it costs the platform no storage.
4. **Atomic stock.** Each admitted checkout reserves stock with a conditional update
   (`UPDATE variants SET inventory_qty = inventory_qty - 1 WHERE shop_id = ? AND variant_id = ? AND inventory_qty > 0`),
   and in the same transaction writes a reservation row with an expiry; if the checkout is abandoned or the
   payment fails, the reservation is released and the unit added back. The count can never go below zero, so we
   never oversell. (The reservation and saga details are in the
   [e-commerce store case study](/system-design/case-studies/medium/ecommerce-store/).)
5. **Sold out fast.** When stock hits zero, a flag in cache makes the throttle answer "sold out" immediately,
   instead of letting thousands more into a queue for nothing.
6. **Bots.** Sneaker drops attract bots. Rate limits per IP and per card, challenges, and checkout tokens that
   must be earned on the storefront keep the queue fair for humans.

And the noisy-neighbour rule holds: the throttle is **per shop**. The other shops on the same pod keep their own
budgets, so their checkouts flow normally. A very large, very regular flash-seller can also be moved to a pod with
extra headroom before a big launch, using the mover from section 9.

## 14. Payments and compliance (high level)

- **Keep card numbers out of the main platform.** Anyone who stores or even touches raw card numbers falls under
  **PCI DSS**, a strict security standard. The trick is to shrink that scope: the card fields on the checkout page
  are served from a separate, isolated **card vault** service (often inside an iframe), which swaps the card number
  for a **token**. The rest of the platform, pods included, only ever sees tokens.
- **The payments service is shared, not per pod.** It talks to card networks and payment processors, holds
  provider credentials, and must be audited as one system. Calls to it carry an **idempotency key** (the checkout
  token) so a retried charge is never taken twice.
- **Many providers.** Merchants in different countries need different processors and wallets. A provider
  abstraction lets checkout call "authorise" and "capture" the same way for each.
- **Privacy and data rights.** Buyers' personal data belongs to each merchant's customers, but the platform must
  honour deletion and export requests across the shop's data **and** tell installed apps to do the same. Platforms
  usually require apps to handle mandatory privacy webhooks for this.
- **Data residency.** Some laws require data to stay in a region. Pods make this natural: place a shop on a pod in
  the required region.

## 15. Reliability: failure handling

| Risk | Defence |
| --- | --- |
| A pod's primary database fails | Fail over to a replica inside the pod; only that pod's shops see a few seconds of errors |
| A whole data centre fails | Pods are replicated to another region and fail over as units; the directory says where each pod is active |
| The directory is unavailable | Routers keep the last known `shop → pod` map in memory and keep routing; only new sign-ups and moves wait |
| A bad deploy | Roll out pod by pod (a **canary pod** first), so a bug hits a small slice of shops before it is caught |
| A webhook endpoint is down | Retries with backoff, then pause; events are never lost because of the outbox |
| A certificate fails to renew | Renew well before expiry, alert on failures, and serve the platform subdomain as a fallback |
| A shop is under attack | Edge rate limits and per-shop budgets keep the damage on that shop |

The pattern to remember: **cells contain failures**. Most failures are local to one pod, and the platform is
designed so that "one pod is having a bad day" never becomes "the platform is down".

## 16. What breaks as it grows, and how to fix it

**The whale shop.** One shop grows until it alone overloads its pod. *Fix:* move it to a dedicated pod. If it
outgrows even that, split its biggest tables (orders by date, for example) inside its own pod.

**Uneven pods.** Placement at sign-up cannot predict which shops will explode. *Fix:* continuous rebalancing with
the shop mover, using real load (queries per second, storage, CPU) rather than shop counts.

**The global directory as a single point of failure.** Everything needs it. *Fix:* keep it tiny, replicate it to
every region, cache it in every router, and design routers to keep working on a stale copy.

**Schema changes across hundreds of pods.** Adding a column means running the migration on every pod's
database. *Fix:* online schema-change tools that copy the table in the background, run pod by pod, and code that
works with both the old and new schema during the rollout.

**Cache invalidation storms.** A theme publish or a bulk price update on a large shop purges thousands of pages at
once, and the cold cache stampedes the database. *Fix:* request coalescing (one render per key while others wait),
stale-while-revalidate (serve the old page while one worker renders the new one) and gradual purges.

**Cross-shop features.** Anything that looks across shops (platform-wide analytics, fraud signals, a buyer account
that works in every shop) cannot run inside one pod. *Fix:* stream changes out of every pod into a separate
analytics or global store, and never query pods across the board on a live request.

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Tenancy model | Pool (everything shared) | Silo (stack per tenant) | **Pods**: shared code, partitioned state; isolation without millions of databases |
| Shop placement | Hash of `shop_id` | Directory lookup | **Directory**: shops can move one at a time, whales can get their own pod |
| What to shard | Database only | Every stateful system (pod) | **Pod**: queues and caches are noisy-neighbour risks too, and a failure stays in one pod |
| Tenant key in queries | Trust developers | Enforced by the data layer | **Enforced**: one forgotten `WHERE` is a data leak |
| Storefront | Render each request | Cache pages, render on miss | **Cache**: reads outnumber writes by orders of magnitude; keys must include shop, theme, currency |
| Theme language | Arbitrary code | Sandboxed templates (Liquid) | **Sandboxed**: safe to run millions of untrusted themes |
| App rate limits | Per app, global | Per app per shop | **Per app per shop**: fair to apps and to shops |
| Flash-sale overload | Return errors | Waiting room + per-shop throttle | **Waiting room**: protects the pod and keeps buyers, fair by arrival |
| Card data | In the main database | Isolated vault + tokens | **Vault**: keeps PCI scope small |

## Cheat sheet for last-minute revision

- **The problem:** millions of tenants (shops) on shared infrastructure. Hard parts: **isolation** of data and of
  performance, **routing**, **moving** tenants, and **one-shop spikes**.
- **Pods (cells):** shard every stateful system (MySQL, Redis, Memcached, queues) by shop; share the stateless code.
  Blast radius = one pod.
- **Routing:** host name (via SNI and `Host`) or API token → `shop_id` → `pod_id` from a directory cached in the
  router.
- **Data:** every pod table keyed `(shop_id, ...)`; the data layer adds `shop_id` to every query; globally unique IDs.
- **Moving a shop:** bulk copy → replay binlog → pause writes for seconds → flip directory → clean up. Abort is safe
  until the flip (Ghostferry style).
- **Custom domains:** CNAME to us → ACME (HTTP-01) certificate → store certs in a replicated store → pick by SNI →
  renew in the background.
- **Storefront:** Liquid themes (sandboxed) → edge cache → page cache keyed by shop, theme, URL, currency → data
  cache → replica. Invalidate by tag or versioned key.
- **Apps:** OAuth token per shop with scopes; **leaky bucket per app per shop** (cost-based for GraphQL); webhooks
  via transactional outbox, HMAC-signed, retried, at-least-once.
- **Flash sale:** cache browsing, per-shop checkout throttle, waiting room with signed tickets, atomic stock
  decrement, instant "sold out".
- **Payments:** card vault + tokens to shrink PCI scope; idempotency keys; shared payments service outside pods.
- **Numbers:** 5M shops, ~23K page views/s average (~230K/s peak), ~10 MB data per shop per year, ~2M certificates.

## Practice questions

1. **A merchant reports seeing another shop's product on their storefront. Where do you look?** The cache key
   first: a page or data cache key missing `shop_id` (or the host) would serve one shop's entry to another. Then
   the query layer for a query without the tenant scope, and the router's `hostname → shop` cache for a stale or
   wrong mapping after a domain change.
2. **How would you give a very large merchant "their own" infrastructure?** Put them alone on a dedicated pod. The
   code and routing are unchanged; only the directory row differs. That is the advantage of a directory over
   hashing.
3. **An app is hitting `429` constantly but says it only makes "a few calls". How do you help?** Show it the bucket
   state returned with each response; for GraphQL, the query cost. Usually it requests huge pages or many nested
   fields. Suggest smaller queries, webhooks instead of polling, or bulk export jobs that run in the background.
4. **How would you let a merchant change their shop's domain without downtime?** Issue the certificate for the new
   name first, add it as a second host name for the same shop, then make it primary and redirect the old one with
   `301`. Both names map to the same `shop_id` during the switch.
5. **Why not put each shop in its own database schema inside a shared server?** It isolates data better than a
   column, but millions of schemas strain the database's catalogue, migrations must run millions of times, and it
   does nothing for noisy neighbours, which still share CPU, memory and disk. Pods with a `shop_id` key get most
   of the benefit at far lower cost.
6. **During a flash sale, payments start timing out at the provider. What happens to stock?** A timeout is an
   *unknown* outcome, not a failure: the card may have been charged. So the reservation is kept (its expiry
   extended) while the payments service asks the provider for the result of that idempotency key. A confirmed
   failure releases the stock back on sale; a success completes the order. The checkout's idempotency key means a
   buyer who retries is never charged twice. If timeouts persist, the throttle should also admit fewer checkouts,
   so that stock is not locked up by payments stuck in limbo.
