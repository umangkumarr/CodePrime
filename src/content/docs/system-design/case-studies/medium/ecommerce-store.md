---
title: "Design an E-commerce Store (like Amazon)"
description: "Design an Amazon-style store step by step: catalogue and faceted search, cached product pages, carts, stock reservations, the checkout saga, idempotency and flash sales."
difficulty: "Medium"
sidebar:
  label: "E-commerce store (like Amazon)"
tags: ["Microservices", "Sagas", "Caching", "Search", "Consistency"]
---

An online store looks like a website with a list of products and a **Buy** button. Underneath it is several
very different systems glued together. It is a **library** of hundreds of millions of products that must be
searchable in milliseconds, a **shop window** that millions of people look through at once, a **stockroom**
that must never sell the same last unit twice, a **till** that takes money exactly once, and a **dispatch
desk** that hands parcels to warehouses and carriers.

The interesting part is that these pieces need **different guarantees**. Showing a product page a few seconds
out of date is fine. Charging a card twice is not. A good design is mostly about knowing which step needs which
guarantee, and paying for strong consistency only where it matters.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. E-commerce in 5 minutes: the vocabulary

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Product** | The thing as a shopper thinks of it: "Acme running shoe" | The title on a shelf label |
| **SKU** (stock keeping unit) | One buyable variant: "Acme running shoe, blue, size 9". Stock and price live here | The exact box on the shelf |
| **Catalogue** | All products, their attributes, images and descriptions | The shop's printed catalogue |
| **Facets** | Filters with counts shown beside search results: "Brand: Acme (120), Nike (95)" | The signs over each aisle |
| **Cart** | The list of SKUs a shopper intends to buy. It does **not** hold stock | A basket you are still filling |
| **Inventory** | How many units of each SKU are on hand, per warehouse | The stockroom count |
| **Reservation** | A temporary hold on units for one checkout, released if not paid in time | "I'll keep this aside for 15 minutes" |
| **Order** | A confirmed purchase with its own life: paid, packed, shipped, delivered | The receipt and the parcel |
| **Saga** | A long business transaction split into local steps, each with an "undo" step | A holiday booking: flight, hotel, car, and cancel the rest if one fails |
| **Idempotency key** | A unique ID sent with a request so that repeating it has no extra effect | A cheque number: the bank cashes cheque 1042 only once |
| **PSP** (payment service provider) | The outside company that talks to card networks and banks for us | The card machine at the till |
| **CDN** (content delivery network) | Servers around the world that keep copies of images and pages near shoppers | Local newsagents stocking the same magazine |

A little public history helps. Amazon is often cited as an early large-scale example of splitting one big
application into many small services, each owned by a small team behind an API. Its 2007 **Dynamo** paper
described a key-value store designed so that "add to cart" keeps working even while parts of the system fail,
accepting that two versions of a cart may need to be merged later. Both ideas, **service boundaries** and
**choosing availability over consistency where it is safe**, run through this whole design.

## 2. Requirements

### Functional (what users can do)

- **Browse and search** the catalogue by keyword, with **facets** (brand, price range, size, rating) and sorting.
- **View a product page**: images, description, variants, price, "In stock", reviews, recommendations.
- **Cart**: add, remove and change quantities, as a **guest** or **logged in**; a guest cart **merges** into the
  account cart on login.
- **Checkout**: choose address and payment, apply a **coupon**, see the final price, **place the order**.
- **Orders**: track status (paid, shipped, delivered), cancel before shipping, return after delivery.
- **Sellers / admins**: create and edit products, set prices, run promotions and **flash sales**.
- **Reviews and ratings**, and **recommendations** ("customers also bought").

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Availability** | 99.99% for browse, search and cart | Every minute the shop is down is lost sales |
| **Latency** | Product page under 200 ms; search under 300 ms; place order under 2 s | Slow pages lose shoppers |
| **Scale** | ~100 million daily active users, ~500 million SKUs | Amazon-sized, for the exercise |
| **Correctness** | **Never oversell** the last unit; **never charge twice**; never lose a paid order | These are the bugs that make the news |
| **Consistency** | **Strong** for stock reservation, payment and order state; **eventual** for catalogue, search, reviews | Pay for strong consistency only where money or stock is at stake |
| **Peak handling** | Survive flash sales at 10–100× normal traffic on a few items | Sales events are predictable but brutal |

### Out of scope

Warehouse robotics and route planning, seller payouts and accounting, fraud models in depth, advertising, and
the details of tax rules. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** 100 million daily active users. Each views **20** product pages and runs **5** searches a day.
**10 million** orders a day, about 3 items each. Peaks are **3×** average on a normal day, and a flash sale can
send **100×** the usual traffic to a handful of products. 500 million SKUs.

**Traffic**

- Product page views: $100\text{M} \times 20 = 2\text{B}$ a day, about **23,000 per second**, **70,000 per
  second** at peak.
- Searches: $100\text{M} \times 5 = 500\text{M}$ a day, about **5,800 per second**.
- Orders: $10\text{M} / 86{,}400 \approx$ **115 per second** on average, roughly **350 per second** at a
  normal peak, and **thousands per second** for a few minutes in a flash sale.
- Views to orders: $2\text{B} / 10\text{M} = 200$. **Reads dominate by two orders of magnitude.**

**Storage**

- Catalogue: 500 million SKUs × about **10 KB** of text and attributes = **5 TB**. Small enough for a sharded
  database plus a search index.
- Images: say 5 images per product, 3 sizes, about 100 KB each, for 100 million products:
  $100\text{M} \times 5 \times 3 \times 100\text{ KB} = 150\text{ TB}$. This lives in object storage behind a CDN.
- Orders: $10\text{M} \times 5\text{ KB} = 50\text{ GB}$ a day, about **18 TB a year**. Orders are kept for years
  (tax, returns, history), so they are partitioned by time and by customer.

Three conclusions follow:

1. **Browsing must be served from caches.** 70,000 product pages per second should almost never reach a
   database.
2. **The write path is small but precious.** A few hundred orders per second is not much traffic, but each one
   touches stock and money, so it must be correct, not just fast.
3. **Flash sales are the real scaling problem**, because they concentrate traffic on one row: the stock count of
   one SKU.

## 4. The API

Clients (web, Android, iOS) call a JSON API over HTTPS through an API gateway.

| Method and path | What it does |
| --- | --- |
| `GET /v1/search?q=running+shoes&brand=acme&size=9&sort=price&cursor=...` | Search with filters; returns results **and** facet counts |
| `GET /v1/products/{product_id}` | Product page data: attributes, variants (SKUs), images, rating summary |
| `GET /v1/offers?sku_ids=...` | The **dynamic** parts: current price and availability for SKUs (kept separate so the rest can be cached) |
| `PUT /v1/cart/items/{sku_id}` | Set the quantity of a SKU in the cart (works for guests via a `cart_id` cookie) |
| `POST /v1/checkout/quote` | Price the cart with address, shipping and coupon; returns a `quote_id` valid for a few minutes |
| `POST /v1/orders` | Place an order from a quote. Requires an `Idempotency-Key` header |
| `GET /v1/orders/{order_id}` | Order status and tracking |
| `POST /v1/orders/{order_id}/cancel` | Cancel if not yet shipped |

Why is `PUT /cart/items/{sku_id}` a **PUT with a quantity** rather than "add one"? Setting "quantity = 2" is
naturally idempotent: sending it twice leaves the cart the same. "Add one", retried after a timeout, would
silently give the shopper 3 items.

## 5. High-level design

[![High-level architecture: web and mobile apps fetch images and cached pages from the CDN and call the API gateway, which routes to the search, catalogue, cart and order services; search queries the search index, which is fed by change events from the catalogue DB; the cart prices lines through the pricing service; the order service keeps state in the order DB and drives saga steps through the event bus to inventory, payment and shipping, and payment authorises with the external payment provider](/img/system-design/ecommerce-store/01-architecture.png)](/img/system-design/ecommerce-store/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **CDN:** serves images, scripts and cached page shells from near the shopper.
- **API gateway:** checks the login token, applies rate limits, routes each call to the right service.
- **Search service + search index:** keyword search, filters and facet counts.
- **Catalogue service + catalogue DB:** the source of truth for products and SKUs; product pages are built from
  it and cached heavily.
- **Cart service:** carts for guests and users, kept in a fast store with a durable copy.
- **Pricing + promotions:** the one place that knows the price of anything, including coupons and deals.
- **Order service:** runs checkout as a **saga** and owns the order's state.
- **Event bus** (for example Kafka): a durable log of events and commands between services.
- **Inventory, payment, shipping services:** each owns its data and does one job in the saga.
- **Payment provider:** the outside PSP that actually moves money.

Each service **owns its own database**; no service reads another's tables. They talk through APIs and events.
Section 15 explains why the boundaries are drawn exactly here.

## 6. Deep dive: the catalogue and search

### Flexible attributes

A television has screen size and refresh rate; a T-shirt has size and colour; a book has an author and ISBN. A
fixed SQL table with one column per attribute would need thousands of mostly-empty columns. Three common answers:

| Approach | How it works | Good | Bad |
| --- | --- | --- | --- |
| **EAV** (entity–attribute–value) | One row per attribute: `(product_id, 'screen_size', '55')` | Infinitely flexible | Reading one product needs many rows; queries are painful |
| **Document / JSON column** | Common fields as columns, the rest in a JSON document per product | One read per product; flexible | Validation moves into application code |
| **Category schemas + document** | Each category defines which attributes it allows and their types; products are stored as documents validated against it | Flexible **and** consistent; drives facets automatically | A schema registry to maintain |

The third is what most large stores converge on. The category "Shoes" says that `size` is a number and `colour`
is one of a list, so the admin form, validation and search facets all come from the same definition.

The catalogue is split into **product** (shared description, images) and **SKU** (one buyable variant with its
own code, options, stock and price). Searches and pages show products; carts, stock and orders always deal in SKUs.

### Search with facets

A search engine (Elasticsearch, OpenSearch, Solr or an in-house equivalent) keeps an **inverted index**: for
each word, the list of products that contain it, like the index at the back of a book. "Running shoes" is the
intersection of the lists for `running` and `shoe`. Filters ("brand = Acme", "size = 9") are more lists to
intersect. **Facet counts** ("Acme (120)") come from counting, within the matching set, how many products have
each value; search engines do this with **aggregations** over per-field columnar data.

Ranking blends text relevance with business signals: sales, rating, availability, and whether the shopper is
likely to want it. Out-of-stock items sink or disappear.

### Keeping the index in step

The search index is a **copy**. The catalogue DB is the truth. The copy is kept fresh by events:

[![Keeping copies in step: a seller edits a listing, the catalogue service writes the catalogue DB, the change row becomes a change event alongside stock and price changes from other services, and both the search indexer (which upserts the search document) and the cache purger (which invalidates the CDN and page cache) consume it](/img/system-design/ecommerce-store/02-catalogue-search.png)](/img/system-design/ecommerce-store/02-catalogue-search.png)

*Select the diagram to zoom in and move around.*

- **Change events** are produced reliably with either **CDC** (change data capture: a process tails the
  database's write-ahead log and turns each committed row change into an event) or the **outbox pattern** (the
  service writes the change *and* an "event to publish" row in the same transaction; a relay publishes it).
  Either way, an event exists if and only if the change committed.
- The **indexer** flattens product + SKUs + current price + availability + rating into one search document and
  upserts it. Search is therefore **eventually consistent**: a price change appears in results a few seconds
  later, which is acceptable because the price is re-checked on the product page and again at checkout.
- A full **reindex** (new ranking fields, new analyser) is built into a fresh index in the background, then an
  alias is switched to it in one step.

## 7. Deep dive: product pages and caching

A product page is read about 200 times for every order, so it is a caching problem first.

The trick is to **split the page by how fast each part changes**:

| Part | Changes | Where it is served from |
| --- | --- | --- |
| Images, scripts, styles | Almost never (new file name on change) | CDN, cached for a year |
| Title, description, attributes, variants | A few times a month | CDN or page cache, minutes to hours, purged on change |
| Rating summary, review snippets | A few times a day | Cache, refreshed every few minutes |
| **Price and availability** | Any time | Fetched separately (`GET /offers`) from a short-lived cache in front of pricing and inventory |
| Recommendations, "recently viewed" | Per shopper | Fetched per shopper from precomputed results |

So the heavy, shared part of the page comes from the CDN, and only a small, cheap call goes to our services.

Useful caching techniques to name in an interview:

- **Cache-aside with a TTL** (time to live): read the cache, on a miss read the database and fill the cache.
- **Event-driven invalidation**: the cache purger in the diagram above removes a product's entries the moment it
  changes, so TTLs can be long.
- **Stale-while-revalidate**: when an entry expires, keep serving the old copy for a moment while one request
  refreshes it. This also prevents a **cache stampede**, where thousands of requests miss at once and all hit
  the database.
- **Hot keys**: a viral product may get hundreds of thousands of requests a second on one cache key. Keep a tiny
  in-process cache for a second or two on each server, or replicate the key across several cache nodes.

"In stock" on the product page is **advisory**. It may be a few seconds old. The real check happens when stock is
reserved at checkout.

## 8. Deep dive: the cart

The cart is written often (every add or change), read on most pages (the cart badge), and must almost **never
be unavailable**. Losing the ability to add to cart directly loses sales. That is why the Dynamo paper picked the
cart as its example: it is better to accept an occasional merge than to refuse a write.

### Guest and logged-in carts

- A **guest** gets a random `cart_id` in a cookie. The cart is stored server-side under that ID with a TTL of,
  say, 30 days. (Keeping it only in the browser would lose it across devices and makes server-side pricing harder.)
- A **logged-in** user's cart is stored under their `user_id`, so it follows them across devices.

### Merging on login

A shopper fills a guest cart, then logs in to an account that already has items. The cart service merges the
guest cart into the user cart:

1. For each guest line, if the SKU is not in the user cart, add it.
2. If it is in both, keep the larger quantity (not the sum: the shopper probably added the same item twice on
   two devices).
3. Clamp to per-item limits and drop SKUs that no longer exist.
4. Delete the guest cart, and make the merge **idempotent** (record "guest cart X merged") so a retried login
   does not merge twice.

### Storage

A fast key-value store (Redis, DynamoDB, Cassandra) keyed by `cart_id`, holding the cart as one small document.
Writes go to a replicated store so a node failure does not empty carts. Each cart is touched by one shopper, so
contention is low; a version number on the document (**optimistic locking**) stops two tabs from overwriting each
other.

Two things the cart does **not** do:

- It does **not reserve stock**. Millions of abandoned carts would lock up inventory. Stock is held only at
  checkout.
- Its prices are **not final**. The cart shows current prices from the pricing service, and checkout re-prices
  everything.

## 9. Deep dive: inventory without overselling

### The race

Two shoppers try to buy the last unit at the same moment. Both read "1 in stock", both subtract one, both write
0, and both get an order. One of them will receive an apology email. This is the **lost update** problem.

### The fix: one conditional update

Never "read, compute, write" in application code. Make the database check and change in **one atomic statement**:

```sql
UPDATE inventory
SET    reserved = reserved + :qty
WHERE  sku_id = :sku AND warehouse_id = :wh
  AND  on_hand - reserved >= :qty;      -- only if enough is still available
-- 1 row updated: reserved.  0 rows updated: not enough stock.
```

The row lock taken by the update makes concurrent attempts queue up for a moment. When the first commits, the
database re-checks the second update's `WHERE` clause against the new row (PostgreSQL at its default `READ
COMMITTED` level, and MySQL InnoDB, both do this), so the second shopper's update matches 0 rows. Available stock is `on_hand - reserved`; it can never go below zero.
An equivalent alternative is **optimistic concurrency** with a `version` column (`... WHERE version = :v`) and a
retry on conflict.

### Reservations with timeouts

Reserving is not the same as selling. Checkout holds units while the shopper pays, and lets them go if payment
never happens:

[![Life of one stock reservation: after a stock check the units are Held (expiring in 15 minutes), then Committed when payment succeeds and Shipped when picked; a hold that times out or whose payment fails, or a committed order that is cancelled, is Released back to sale](/img/system-design/ecommerce-store/03-reservation.png)](/img/system-design/ecommerce-store/03-reservation.png)

*Select the diagram to zoom in and move around.*

- Each reservation row has an `expires_at`. A sweeper job (or a delayed message) releases expired holds:
  `reserved = reserved - qty`, and the reservation becomes `RELEASED`.
- Releasing must be **idempotent**: the status changes from `HELD` to `RELEASED` with a conditional update, in the
  same transaction as `reserved = reserved - qty`, so a sweeper and a "payment failed" message racing each other
  cannot release the units twice.
- Committing is guarded the same way: `HELD` to `COMMITTED` only if the reservation is still `HELD`. A payment
  that succeeds just after its hold expired finds it `RELEASED`; the orchestrator then tries to reserve again and
  refunds if the stock is gone. While a payment's outcome is unknown (section 11), the sweeper must not release
  its hold: the orchestrator extends `expires_at` until the outcome is known.
- When the warehouse ships, `on_hand` and `reserved` both drop by the quantity.

### When to reserve

| Reserve at… | Good | Bad |
| --- | --- | --- |
| Add to cart | Shopper is never disappointed | Abandoned carts lock stock; easy to abuse |
| **Start of checkout / order placement** | Holds stock only for serious buyers, for minutes | A shopper may see "sold out" at checkout |
| After payment | Simplest | Oversells: money taken for stock you do not have, then refunds |

Most stores reserve when the order is placed (the choice in this design), with a short timeout.

### Consistency per step

| Step | Consistency | Why |
| --- | --- | --- |
| "In stock" badge on the page | Eventual (seconds) | Cheap to be slightly wrong; corrected at checkout |
| Cart contents | Eventual across devices, read-your-writes for the shopper | Availability matters more |
| **Reserve stock** | **Strong**, on the inventory row | This is where overselling is prevented |
| **Payment and order state** | **Strong** within each service, plus idempotency | Money and promises to customers |
| Search index, recommendations, analytics | Eventual | Derived copies |

Inventory is sharded by `sku_id`, so one SKU's rows live on one shard and the conditional update stays a
single-shard operation. A SKU stocked in several warehouses has one row per warehouse; the inventory service picks
a warehouse (nearest with stock) when reserving.

## 10. Deep dive: checkout and the order saga

### Why not one big transaction?

Placing an order touches four services, each with its own database, plus an outside payment provider. A
classic **distributed transaction** (two-phase commit: everyone prepares, then everyone commits) would hold locks
across all of them while waiting on the slowest, and the PSP does not take part in our transactions anyway.

Instead we use a **saga**: a sequence of **local** transactions, one per service. If a later step fails, earlier
steps are undone by **compensating actions** (release the stock, refund the payment). The system is briefly
inconsistent (stock held, payment not yet taken) but always moves to a correct final state.

### The happy path

[![Checkout sequence: the shopper's app posts the order with an idempotency key and the order service saves it as PENDING; inventory holds the items for 15 minutes with a conditional update; payment charges the total using the order ID as the key and the payment provider approves; the order moves to PAID, the reservation is committed, the app gets 201 order confirmed, and shipping is asked asynchronously through the event bus to create a shipment](/img/system-design/ecommerce-store/04-checkout.png)](/img/system-design/ecommerce-store/04-checkout.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The order is written first**, as `PENDING`, together with the idempotency key. From that moment the order
  service is responsible for driving it to a final state, even if it crashes and restarts.
- **Stock is reserved before money is taken.** Refunding because we had no stock is a worse experience than
  saying "sold out" before payment.
- **The shopper waits only for what they need**: reservation and payment. Shipping is arranged asynchronously.
- Each step is a message with a **retry**, and each service handles a repeated message safely (section 11).

### When something fails: compensations

[![Order saga with compensations: forward steps create order, reserve stock, charge payment, confirm order and create shipment; if reserving finds stock is out the order is cancelled; if payment is declined, stock is released and then the order cancelled; if the order cannot be fulfilled, payment is refunded, then stock released, then the order cancelled](/img/system-design/ecommerce-store/05-saga.png)](/img/system-design/ecommerce-store/05-saga.png)

Compensations run in **reverse order** of the steps that succeeded. Two rules make them safe:

- A compensation is a **new forward action**, not a rollback: a refund is a new payment record, not a deleted
  charge. The history stays auditable.
- Compensations must **eventually succeed**. They are retried until they do, and if a human is needed (a refund
  the bank keeps rejecting) the order goes to a manual queue rather than being forgotten.

### Orchestration or choreography?

| Style | How | Good | Bad |
| --- | --- | --- | --- |
| **Orchestration** (our choice) | The order service tells each service what to do next and tracks progress in a saga state row | One place shows where every order is; easy to add timeouts and compensations | The orchestrator is a central component to keep healthy |
| **Choreography** | Each service reacts to the previous service's event ("StockReserved" → payment charges) | No central coordinator | The flow is spread over many services; hard to see and change |

For a flow with money and several failure branches, orchestration is easier to reason about.

### Publishing events reliably: the outbox

The order service must both update its database and send a message. If it commits and then crashes before
sending, the saga stalls; if it sends and then the commit fails, other services act on an order that does not
exist. The **outbox pattern** fixes this: write the state change and an `outbox` row in **one local
transaction**; a relay process reads the outbox and publishes to the event bus, retrying until acknowledged.
Messages may be published more than once, which is fine because every consumer is idempotent.

## 11. Deep dive: idempotency on order placement and payment

Networks fail in the worst place: **after** the server did the work but **before** the client saw the reply. The
app retries, and without protection the shopper gets two orders and two charges.

**Placing the order.** The app generates a random `Idempotency-Key` when the shopper taps **Place order** and
reuses it for every retry of that tap.

```sql
INSERT INTO orders (id, user_id, idempotency_key, status, total, ...)
VALUES (...);              -- UNIQUE (user_id, idempotency_key)
-- On a unique-key violation: load the existing order and return the same response.
```

The unique constraint, not an application-level check, is what makes this safe under concurrency: two retries
arriving at the same instant cannot both insert.

**Taking payment.** The payment service uses a key derived from the order (the `order_id`, or `order_id` plus an
attempt number if the shopper may retry with another card) for its own `payment` row **and** passes an idempotency key to the PSP; major providers such as Stripe
document support for this. A retried "charge" then returns the original result instead of charging again.

**The unknown outcome.** Sometimes the PSP call times out and we do not know whether the card was charged. Never
guess. Mark the payment `UNKNOWN`, then **ask the PSP** for the status of that idempotency key, and rely on the
PSP's **webhook** (a callback it sends when the payment settles) as a second signal. A nightly **reconciliation**
job compares our payment records with the PSP's settlement report and flags any mismatch.

**Consumers.** Every saga step can be delivered twice. Each service records processed message IDs (or makes the
operation naturally idempotent, like "set reservation for order 81 to `COMMITTED`") so a duplicate is a no-op.
The pattern: **at-least-once delivery + idempotent consumers = effectively exactly once.**

## 12. Order states

An order is a **state machine**. Writing the states down prevents impossible transitions such as shipping a
cancelled order.

[![Order states: PENDING to PAID on payment, PACKED, SHIPPED with the carrier, DELIVERED; PENDING goes to CANCELLED when payment fails or times out, PAID goes to CANCELLED when the user cancels with a refund; DELIVERED goes to RETURN REQUESTED and then REFUNDED when the item is received](/img/system-design/ecommerce-store/06-order-states.png)](/img/system-design/ecommerce-store/06-order-states.png)

*Select the diagram to zoom in and move around.*

Each transition is a conditional update, so two events racing each other cannot both win:

```sql
UPDATE orders SET status = 'CANCELLED'
WHERE  id = :id AND status IN ('PENDING', 'PAID');   -- too late once PACKED
```

Every change also appends a row to an `order_events` history table (who, when, from, to). That history powers
the tracking page, customer support, and the "Where is my order?" emails.

## 13. Deep dive: flash sales and hot items

At noon, 2 million people tap **Buy** on a console with 10,000 units. Everything above meets its limit at once:
the product page, the stock row for one SKU, and the order pipeline.

[![Flash sale flow: shoppers hit the CDN and gateway, which applies a per-user limit and turns excess requests away with 429 try later; admitted shoppers wait in a waiting room that admits N per second; on their turn an atomic decrement on the in-memory stock counter either gets a unit, which goes onto a durable order queue for the order service to process at a steady pace, or finds the count below zero and answers sold out at once](/img/system-design/ecommerce-store/07-flash-sale.png)](/img/system-design/ecommerce-store/07-flash-sale.png)

The idea is a **funnel that rejects cheaply and early**:

1. **Static page at the edge.** The sale page is pre-rendered and served by the CDN. The countdown runs in the
   browser, so the origin sees nothing until the sale opens.
2. **Rate limits at the gateway.** Per-user and per-IP limits stop bots and repeated taps. A **token bucket**
   is the usual algorithm: each user's bucket refills at a fixed rate (say 1 token per second, holding at most 5);
   each request spends a token; an empty bucket means `429 Too Many Requests`.
3. **A waiting room.** Admitted shoppers get a place in a queue and are let through at a rate the backend can
   handle, for example 2,000 per second. The shopper sees "You are in the queue" instead of an error page.
4. **Pre-allocated stock in memory.** Before the sale, the sale quantity (10,000) is loaded into a counter in
   Redis. Each buyer runs an **atomic decrement**; a result of 0 or more means "you got one", below 0 means "sold
   out". An in-memory counter handles hundreds of thousands of decrements a second where a database row would
   become a lock queue. For even more throughput, split the stock into several counters (10 buckets of 1,000) and
   send each buyer to one; a buyer whose bucket is empty tries the others before being told "sold out".
5. **A queue for orders.** Winners are put on a durable queue, and the order service creates their orders at a
   steady pace through the normal saga, with the unit already guaranteed.

What keeps this honest:

- The in-memory counter is a **ticket dispenser**, not the source of truth. The database reservation (the
  conditional update of section 9) is still made for each winner, so even a counter bug cannot oversell: the
  database refuses the 10,001st reservation.
- Winners who do not pay within the timeout lose their reservation, and the unit goes back on sale. Careful:
  after the sell-out, losing buyers have pushed the counter below zero, so a plain increment would be swallowed.
  The release sets `count = max(count, 0) + 1` in one script, or hands the unit to a "second chance" queue.
- **One per customer** is enforced with a set of buyer IDs checked in the same atomic step as the decrement
  (in Redis, a small Lua script runs both as one operation).

The same tools help any **hot item** outside a sale: request coalescing and local caching for its page, and
bucketed counters for its stock.

## 14. Deep dive: pricing and promotions

Price looks like one number on a page, but it is computed: list price, then seller or category discounts,
then coupons, then shipping and tax. Putting all of that in one **pricing service** means the product page, the
cart and checkout always agree.

- **Rules engine.** Promotions are data, not code: "10% off Shoes, 1–7 March", "buy 2 get 1 free", "₹200 off
  orders over ₹2,000 with code SPRING". Each rule has a scope (SKU, category, cart), dates, priority and whether
  it **stacks** with others.
- **Quotes.** At checkout the pricing service returns a **quote**: line prices, discounts applied, total, and a
  `quote_id` valid for a few minutes. The order is placed against that quote, so the shopper pays exactly what
  they saw, even if a promotion ends a second later.
- **Snapshots.** `order_item.unit_price` stores the price paid. Orders never re-read today's price; refunds and
  invoices need the price at the time.
- **Limited coupons.** "First 1,000 uses" is the overselling problem again, so it uses the same tool: an atomic
  conditional decrement of the remaining count, and a per-user "already used" record.
- **Money in minor units.** Store `1999` paise or cents as an integer (or a fixed-point decimal), never a
  floating-point number, so totals never drift by a fraction.

## 15. Reviews, recommendations and service boundaries

### Reviews

A separate **review service** with its own store, because reviews have a different shape and lifecycle from
products. New reviews go through asynchronous **moderation** (spam and abuse checks) before appearing. A
"verified purchase" badge comes from checking the order history. The **rating summary** (average and the count
per star) is precomputed and updated incrementally on each new review, never calculated by scanning all reviews
on a page view.

### Recommendations, at a high level

- **Offline:** batch jobs over order and browsing history compute "customers who bought X also bought Y". Amazon
  published its **item-to-item collaborative filtering** approach in 2003: rather than comparing shoppers with
  each other, it precomputes which items are often bought together, which scales with the number of items rather
  than the number of shoppers.
- **Online:** the results are stored in a key-value store (`sku_id → list of related SKUs`), so serving is one
  lookup, then filtered for stock and personalised with recent activity.
- Recommendations are always **optional** on the page: if the service is slow, the page renders without them.

### Where to draw the microservice lines

A boundary is good when one team can change and deploy a service on its own, and when the data it owns has one
clear meaning.

| Service | Owns | Consistency it needs | Talks to |
| --- | --- | --- | --- |
| Catalogue | Products, SKUs, attributes, images | Eventual for readers | Emits change events |
| Search | Search index (a derived copy) | Eventual | Consumes catalogue, price, stock events |
| Pricing | Prices, promotions, coupons, quotes | Strong for coupon limits | Called by cart and checkout |
| Cart | Carts | High availability, merge on conflict | Calls pricing |
| Inventory | Stock and reservations per warehouse | **Strong** per SKU | Saga participant |
| Order | Orders, saga state, outbox | **Strong** | Orchestrates the saga |
| Payment | Payments, refunds, PSP records | **Strong** + idempotent | PSP, saga participant |
| Shipping | Shipments, carriers, tracking | Eventual | Saga participant, carrier APIs |
| Review, Recommendation | Reviews; precomputed suggestions | Eventual | Consume order events |

Rules of thumb: **one database per service** (sharing tables couples deploys); **split where consistency
needs differ** (catalogue reads can be stale, stock cannot); and **do not split too fine**: if two services must
always change together, they are one service.

## 16. Low-level design: the data model

[![Data model: product has many SKUs; cart_item, inventory and order_item each point to a SKU; inventory rows are per SKU and warehouse with on_hand, reserved and version; reservation points to an inventory row (by SKU and warehouse) and an order; order has a unique idempotency key and many order items; payment points to an order and has its own unique idempotency key](/img/system-design/ecommerce-store/08-data-model.png)](/img/system-design/ecommerce-store/08-data-model.png)

*Select the diagram to zoom in and move around.*

The tables are drawn together for clarity; in production each group lives in its own service's database, and
"foreign keys" across groups are IDs, not enforced constraints. A reservation names its warehouse as well as its
SKU, so a release or commit adjusts exactly the inventory row it reserved from. The order's idempotency key is
unique per user, as in section 11.

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Catalogue | Documents with flexible attributes, read-heavy | Document DB or sharded SQL with JSON columns, plus caches | Flexible schema; cache absorbs reads |
| Search | Inverted index with facets | Elasticsearch / OpenSearch | Text relevance and aggregations |
| Carts | Small document per cart, always available | Redis with persistence, DynamoDB, Cassandra | Fast, highly available key-value access |
| Inventory | Counters that must not go negative | Relational DB (Postgres, MySQL), sharded by `sku_id` | Row-level atomic conditional updates |
| Orders, payments | Transactions, history, reporting | Relational DB, sharded by `user_id` and archived by date | ACID transactions, unique constraints |
| Events | Ordered durable streams | Kafka, Pulsar | Replay, fan-out to many consumers |
| Images | Large immutable files | Object storage + CDN | Cheap and durable |

## 17. What breaks as it grows, and how to fix it

**The cache stampede.** A popular product's cache entry expires and 50,000 requests hit the catalogue DB at once.
*Fix:* request coalescing (one request refills, the rest wait), stale-while-revalidate, and slightly randomised
TTLs so entries do not expire together.

**The hot SKU row.** One stock row becomes a lock queue during a sale. *Fix:* the flash-sale funnel: admission
control, pre-allocated in-memory counters split into buckets, and a queue in front of order creation.

**The search lag.** A burst of price changes (a sitewide sale) backs up the indexer, and search shows old prices.
*Fix:* scale indexers by event-bus partitions, apply partial updates for price-only changes, and always re-price
on the page and at checkout so search lag is cosmetic.

**The saga that never ends.** A message is lost or a service is down for an hour, and orders sit in `PENDING`.
*Fix:* the orchestrator stores saga state with deadlines; a timer scans for overdue sagas and retries or
compensates; an alert fires when the count of stuck orders rises.

**Cross-service reads.** "My orders" wants product images, shipment status and payment state from four services.
*Fix:* build a **read model**: a denormalised order-history view kept up to date from events, so one query
serves the page.

## 18. Reliability: never lose an order, never charge twice

| Risk | Defence |
| --- | --- |
| Client retries after a timeout | `Idempotency-Key` + unique constraint on orders; idempotency key to the PSP |
| Service crashes mid-saga | Saga state is stored with the order; on restart, the orchestrator resumes from the last completed step |
| Event published but DB write failed (or the reverse) | Outbox pattern: state and event in one local transaction |
| Duplicate messages | Idempotent consumers keyed by message or order ID |
| Payment outcome unknown | Mark `UNKNOWN`, query the PSP, accept webhooks, reconcile daily |
| Oversold stock | Atomic conditional update on `on_hand - reserved`; reservations expire |
| A dependency is slow | Timeouts, retries with backoff, **circuit breakers**; optional features (reviews, recommendations) degrade gracefully |
| A whole data centre fails | Services and databases replicated across zones; carts and catalogue served from other regions |

## 19. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Checkout transaction | Two-phase commit | Saga with compensations | **Saga**: no cross-service locks, works with an external PSP |
| Saga style | Choreography | Orchestration | **Orchestration**: one place to see and fix every order |
| When to hold stock | Add to cart | At order placement, with timeout | **At placement**: only serious buyers hold stock, for minutes |
| Stock check | Read then write | Atomic conditional update | **Conditional update**: no lost updates, no oversell |
| Cart store | Strongly consistent DB | Highly available KV with merges | **Available KV**: a cart that refuses writes loses sales |
| Search freshness | Synchronous index update | Async via events | **Async**: seconds of lag, re-checked at checkout |
| Flash-sale stock | Database row | Pre-allocated in-memory counter | **Counter** in front of the DB, DB stays the truth |
| Price at checkout | Recompute at payment | Quote with expiry | **Quote**: the shopper pays what they saw |

## Cheat sheet for last-minute revision

- **Two worlds:** browse (huge, read-heavy, eventual, cached) and buy (small, write-path, strong, idempotent).
  Views outnumber orders about 200 to 1.
- **Catalogue:** product vs SKU; category schemas + JSON attributes; changes flow by CDC/outbox events to the
  search index and cache purger.
- **Search:** inverted index; filters are list intersections; facets are aggregations; reindex into a new index
  and switch an alias.
- **Product page:** split by change rate; static parts on the CDN, price and stock fetched separately; purge on
  change; stale-while-revalidate against stampedes.
- **Cart:** guest `cart_id` cookie, user cart by `user_id`, merge on login (max quantity, idempotent); always
  available; does not hold stock; prices not final.
- **Inventory:** `available = on_hand - reserved`; one conditional `UPDATE ... WHERE on_hand - reserved >= qty`;
  reservations expire (about 15 minutes) and release idempotently.
- **Checkout = orchestrated saga:** create order `PENDING` → reserve → charge → confirm → ship (async);
  compensate in reverse: refund → release → cancel. Outbox for reliable events.
- **Idempotency:** `Idempotency-Key` + unique constraint; PSP idempotency keys; unknown outcome → query, webhook,
  reconcile; idempotent consumers.
- **Order states:** PENDING → PAID → PACKED → SHIPPED → DELIVERED, with CANCELLED and RETURN → REFUNDED; every
  transition is a conditional update.
- **Flash sale:** CDN page → token-bucket rate limit → waiting room → atomic Redis decrement (bucketed) → order
  queue → normal saga.
- **Pricing:** one pricing service; rules engine; quotes with expiry; snapshot prices into order items; money as
  integers.

## Practice questions

1. **Two shoppers buy the last unit at the same moment. Walk through exactly what happens.** Both checkouts send
   "reserve 1" to inventory. Each runs the conditional update; the row lock serialises them. The first matches
   the row and sets `reserved = 1`; the second finds `on_hand - reserved = 0`, updates 0 rows, and gets "out of
   stock". Its saga cancels the order before any payment is attempted.
2. **The payment provider timed out. Did we charge the customer?** We do not know yet, so the payment is marked
   `UNKNOWN` and the order stays `PENDING` (the reservation's expiry is extended so the sweeper does not release
   it). We query the PSP using the same idempotency
   key, wait for its webhook, and reconcile. Only a confirmed failure releases stock; a late success completes the
   order. A retry with the same key can never create a second charge.
3. **A shopper's guest cart has 2 of an item; their account cart has 1. What should the merged cart contain,
   and why?** Two, not three: the larger quantity, because the same intent was most likely recorded on two
   devices. Then check the item still exists, is in stock and within purchase limits.
4. **How would you show "Only 3 left!" without hammering the inventory database?** Inventory publishes
   availability changes as events; the offer cache stores a rounded, slightly stale count per SKU. It is
   advisory, and the authoritative check is still the reservation at checkout.
5. **Sellers upload a CSV of 1 million price changes. What could go wrong?** Index and cache invalidation
   floods. Process it as a batch job, write prices in chunks, emit compacted price events (only the latest per
   SKU matters), and let the indexer apply partial updates. Quotes already issued stay valid until they expire.
