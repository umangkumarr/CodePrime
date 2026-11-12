---
title: "Design a Food Delivery App (like DoorDash / Swiggy / Zomato)"
description: "Design a three-sided food delivery marketplace: ETA-ranked discovery, an order state machine with timeouts, batched dispatch, tracking and split payments."
difficulty: "Hard"
sidebar:
  label: "Food delivery (like DoorDash, Swiggy)"
tags: ["Marketplace", "Geospatial", "State machines", "Optimisation", "Real-time"]
---

A food delivery app looks like a menu with a **Place order** button and a little scooter moving on a map.
Underneath, it is a **three-sided marketplace**: hungry customers, busy restaurant kitchens and couriers on
bikes, all of whom must act at the right moment for one bag of food to arrive hot. It is a **search engine**
that answers "who can feed me fast?", a **workflow engine** that walks every order through a dozen steps with
deadlines, a **real-time optimiser** that decides which courier collects which bag and when, and a **payment
system** that turns one charge into three payouts.

If you have read the [ride-hailing case study](/system-design/case-studies/hard/uber/), you already know half
of the machinery: live courier locations, a geospatial index, matching a request to a nearby driver. This case
study focuses on what is **different** about food: a third party (the kitchen) that controls when the job can
even start, and a product (hot food) that gets worse every minute it waits.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Food delivery in 5 minutes: three sides and one clock

Every order involves three parties, each using its own app, and the platform in the middle.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Customer** | The person ordering, on the customer app or website | The diner |
| **Merchant** (restaurant) | The kitchen; receives orders on a **tablet** or straight into its **POS** (point-of-sale, the till system) | The kitchen at the back of a restaurant |
| **Courier** (DoorDash calls them Dashers; Swiggy and Zomato say delivery partners) | A gig worker who picks up and drops off orders | The waiter, except the table is 4 km away |
| **Dispatch** | The service that decides which courier gets which order, and when to send them | The head waiter assigning tables |
| **Prep time** | How long the kitchen needs from accepting the order to food being ready | "Your order will be ready in 15 minutes" |
| **Delivery zone** | The area a restaurant serves, often drawn as a polygon or a set of map cells | The pizza shop's "we deliver within 5 km" |
| **ETA** | Estimated time of arrival, promised to the customer before they pay | The time on the receipt |
| **Stacking** (batching) | One courier carrying two or more orders on one trip | A waiter carrying two plates at once |

### How it differs from ride hailing

| Question | Ride hailing (Uber) | Food delivery |
| --- | --- | --- |
| How many parties? | Two: rider and driver | Three: customer, restaurant and courier |
| When can the job start? | Immediately: the rider is waiting at the pickup point | Only when the food is ready, 10 to 30 minutes later |
| Best moment to dispatch | As soon as possible | **Just in time**: the courier should arrive as the food comes out |
| Can one driver serve two jobs at once? | Only in pool rides | Often: stacking two orders from one restaurant is cheap |
| What is searched? | Nothing: the rider names the destination | Thousands of restaurants, ranked by how fast they can deliver here |
| What goes wrong while waiting? | The rider gets bored | The food goes cold, or the courier wastes 10 minutes in a queue |
| Who gets paid? | The driver (and the platform) | The restaurant, the courier and the platform, from one charge |

The single most useful idea in this whole design: **the order has one clock, and three parties must hit it.**
Almost every hard problem below (ETAs, dispatch timing, timeouts, stacking) is about predicting when each
party will be ready and lining them up.

## 2. Requirements

### Functional (what users can do)

**Customers**

- Set a delivery address and **discover** restaurants that deliver there, ranked by ETA, rating and fee.
- Browse a restaurant's **menu**, with prices and items that are actually available right now.
- Place an order and **pay** (card, wallet, UPI, or cash on delivery in some markets).
- See a promised ETA before paying, then **track** the order live: accepted, being prepared, picked up, and
  the courier moving on a map.
- **Cancel**, with a refund that depends on how far the order has gone.

**Restaurants**

- Receive orders on a tablet or in their POS, **accept or reject** them, and set a prep time.
- Mark items **sold out**, pause the store when the kitchen is overwhelmed, and mark food **ready**.
- Get paid out regularly, minus the platform's commission.

**Couriers**

- Go online, receive **offers** (a delivery with pickup, drop-off and pay shown), accept or decline.
- Navigate to the restaurant and the customer, confirm pickup and drop-off (photo or PIN).
- Get paid per delivery plus tips.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Availability** | 99.99% for placing and tracking orders | Every minute of downtime at dinner is thousands of lost meals |
| **Latency** | Restaurant list under 300 ms; order placement under 1 s; tracking updates every few seconds | Hungry people are impatient |
| **ETA accuracy** | Most orders arrive within a few minutes of the promise | The promise drives trust, refunds and support cost |
| **Correctness** | An order is never lost, charged twice, or delivered by two couriers | It is real money and real food |
| **Consistency** | Strong for order state and payments; eventual (seconds) for menus, ratings, search | A stale rating is harmless; a stale order state sends a courier to the wrong place |
| **Peak handling** | Survive dinner rush and sudden weather spikes of 2× or more | Demand is extremely peaky (see section 3) |

### Out of scope

Restaurant onboarding and contracts, grocery and quick-commerce dark stores, ads and promotions engine,
loyalty subscriptions, courier background checks and the support-chat tool. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resources dominate**. These are illustrative, not any
company's real figures.

**Assumptions:** one large country, **5 million orders a day**, **300,000 restaurants** with about **200 menu
items** each. A quarter of the day's orders arrive in the **two-hour dinner peak**. Each order takes about **35
minutes** from placing to doorstep, of which a courier is busy for about **25 minutes**. Couriers send a GPS
ping every **4 seconds**. Customers make about **30 browse requests** (lists, menus, searches) per order placed,
because most sessions do not end in an order.

**Orders**

- Average: $5\text{M} / 86{,}400 \approx 58$ orders per second.
- Dinner peak: $5\text{M} \times 25\% / 7{,}200\text{ s} \approx 175$ orders per second, three times the
  average. Rain can double that again.
- Each order goes through about 8 state changes (placed, accepted, ready, assigned, picked up…), so the order
  database handles roughly $175 \times 8 = 1{,}400$ state writes per second at peak. That is **small**.

**Couriers and GPS**

- Orders in progress at peak (Little's law: arrival rate × time in system):
  $175/\text{s} \times 35 \times 60\text{ s} \approx 370{,}000$ live orders.
- Couriers busy at peak: $175/\text{s} \times 25 \times 60\text{ s} \approx 260{,}000$ courier-deliveries, or
  roughly **220,000 couriers** if stacking lets one courier carry 1.2 orders on average.
- GPS writes: $250{,}000 \text{ couriers online} / 4\text{ s} \approx 62{,}500$ per second. At ~100 bytes each,
  that is about 6 MB/s: modest bandwidth, but a high **write rate** of tiny updates.
- Tracking pushes to customers: $370{,}000 / 4\text{ s} \approx 90{,}000$ map updates per second.

**Browsing**

- $5\text{M} \times 30 = 150\text{M}$ browse requests a day; at peak
  $150\text{M} \times 25\% / 7{,}200 \approx 5{,}200$ per second. Highly cacheable: menus change rarely.

**Storage**

- Orders: $5\text{M} \times 2\text{ KB} = 10\text{ GB}$ a day, under 4 TB a year.
- Menus: $300{,}000 \times 200 \times 1\text{ KB} = 60\text{ GB}$, small enough to cache entirely.
- GPS history (kept for disputes and for training ETA models): about 1–2 billion pings a day, over 100 GB a day.

Three conclusions follow:

1. **Raw throughput is not the hard part.** A few hundred orders per second fits comfortably in a sharded
   database. The difficulty is the **real-time decisions** made for each order.
2. **GPS is the highest-volume write stream**, and it is short-lived: only the latest position matters for
   matching, so it belongs in memory, with history streamed to cheap storage.
3. **Peaks dominate capacity planning.** You size for Friday dinner in the rain, not the daily average.

## 4. The API

Three apps talk to us over HTTPS with JSON. Live updates use WebSockets (or Server-Sent Events) while an app is
open, and push notifications (APNs on iOS, FCM on Android) when it is not.

| Method and path | Who | What it does |
| --- | --- | --- |
| `GET /v1/stores?lat=..&lng=..&cursor=..` | Customer | Restaurants that deliver here, ranked, with ETA and fee per store |
| `GET /v1/stores/{id}/menu` | Customer | Menu with prices and availability; carries a `version` |
| `POST /v1/orders` | Customer | Place an order. Body: store, items, address, payment method, quoted total. `Idempotency-Key` header |
| `GET /v1/orders/{id}` | Customer | Current state, ETA, courier position |
| `POST /v1/orders/{id}/cancel` | Customer | Cancel; the response says how much is refunded |
| `POST /v1/merchant/orders/{id}/accept` | Restaurant | Accept with a prep time: `{"prepMinutes": 15}` |
| `POST /v1/merchant/orders/{id}/ready` | Restaurant | Food is ready for pickup |
| `PATCH /v1/merchant/items/{id}` | Restaurant | `{"available": false}`: sold out |
| `POST /v1/courier/location` | Courier | Batched GPS points: `[{lat, lng, ts, speed}]` |
| `POST /v1/courier/offers/{id}/accept` | Courier | Accept a delivery offer (or `/decline`) |
| `POST /v1/courier/deliveries/{id}/events` | Courier | `ARRIVED_AT_STORE`, `PICKED_UP`, `DELIVERED` with a photo or PIN |
| `WSS /v1/stream` | All | Live updates for whichever orders this app cares about |

Two details worth saying out loud in an interview:

- **The quoted total is sent back with the order.** Prices may have changed since the customer opened the menu.
  The server re-prices the cart; if the result differs from the quote, it rejects the order and the app shows
  the new total. The customer is never charged an amount they did not see.
- **Courier location is sent in batches** (a few points every few seconds), not one request per point. On a
  flaky mobile network this saves battery and survives short dead zones.

## 5. High-level design

[![High-level architecture: customer, restaurant and courier apps reach an API gateway; discovery, menu, order, payment, restaurant intake and location services sit behind it with their stores; the order DB, restaurant intake and live positions publish to an event bus that feeds the ETA service, dispatch and notifications](/img/system-design/food-delivery/01-architecture.png)](/img/system-design/food-delivery/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **API gateway:** checks who is calling (customer, merchant or courier token), rate-limits, holds WebSocket
  connections and routes requests.
- **Discovery service:** "which restaurants deliver to this address, and how fast?" Reads a search index of
  stores, zones and cuisines.
- **Menu service:** menus, prices and item availability. Read-heavy and heavily cached.
- **Order service:** the heart. Owns the **order state machine**, its timers and its database.
- **Payment service:** authorises the card at order time, captures it later, and records the three-way split
  in a ledger. Talks to an external payment provider.
- **Restaurant intake:** delivers orders to tablets and to POS systems through adapters, and collects
  accept / reject / ready signals.
- **Location service:** ingests courier GPS pings and keeps the latest position of every courier in an
  in-memory geospatial index.
- **Event bus** (for example Kafka): every state change and position update becomes an event. Services react to
  events instead of calling each other in long chains.
- **ETA service:** machine-learning models that predict prep time, travel time and hand-off time.
- **Dispatch:** decides which courier takes which order and when to send them. The hardest piece.
- **Notifications:** pushes updates to all three apps.

Two ideas hold the design together. First, **the order service is the single source of truth** for where an
order is; everyone else learns about changes from events. Second, **the order DB publishes events through an
outbox**: the state change and an "event to publish" row are written in one database transaction, and a relay
copies the outbox to the bus. So an event is never lost and never published for a change that did not commit.

## 6. Flow: one order, end to end

A customer orders dinner at 7:00 pm. Follow it across all three parties.

[![Sequence: the customer app places an order with an idempotency key; the order service authorises payment and returns PLACED with a 35-minute ETA; the restaurant tablet is pushed the order and accepts with a 15-minute prep time; dispatch offers the job to a courier timed to arrive at 7:17; the restaurant marks food ready, the courier picks up and delivers, and payment is captured and split three ways](/img/system-design/food-delivery/03-place-order.png)](/img/system-design/food-delivery/03-place-order.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Payment is authorised, not captured, at order time.** An authorisation is a hold on the customer's card: the
  money is reserved but not taken. We capture the exact final amount after delivery, which makes cancellations
  and partial refunds (a missing item) cheap. For methods normally used without a "hold" (most UPI payments in
  India, many wallets), a typical design charges upfront and refunds on cancellation. For cash on delivery, nothing is charged; the courier
  collects cash and the ledger records that the courier now owes it to the platform.
- **The customer gets "Order placed" before the restaurant has accepted.** Waiting for a human in a kitchen
  would leave the app spinning. The ETA shown is a prediction; it is updated when the restaurant accepts.
- **The restaurant has a deadline.** If the tablet does not respond within a few minutes, the platform escalates
  (an automated phone call, then a support agent) and finally cancels with a full refund.
- **Dispatch does not grab a courier the instant the order is accepted.** With 15 minutes of prep and an 8-minute
  drive, sending a courier now means 7 minutes wasted standing in the restaurant. Dispatch waits and sends the
  offer so the courier arrives at about 7:17, just as the food is ready (section 12).
- **Every step is an event.** The customer's "Your food is being prepared" and "Courier is on the way" messages
  are just notifications triggered by state-change events.

## 7. Data model

[![Data model: restaurant has many menu_items; orders belong to a restaurant and optionally a delivery; order_item rows link orders to menu items with the price copied; a delivery belongs to one courier and can carry several orders](/img/system-design/food-delivery/05-data-model.png)](/img/system-design/food-delivery/05-data-model.png)

*Select the diagram to zoom in and move around.*

Five decisions hide in this diagram.

**1. Orders and deliveries are separate.** An **order** is what the customer bought; a **delivery** is a
courier's trip. Normally one delivery carries one order, but with stacking one delivery carries two, so
`orders.delivery_id` is many-to-one. If a courier cancels mid-way, the order gets a **new** delivery while the
order itself keeps its history.

**2. Prices are copied into `order_item.unit_price`.** The restaurant can change the menu tomorrow; the order
must still show what was paid. Never join to the live menu for money.

**3. `state_version` makes state changes safe.** Two events can race: the restaurant presses "ready" just as the
customer presses "cancel". Every update is a compare-and-set:

```sql
UPDATE orders SET status = 'CANCELLED', state_version = state_version + 1
WHERE id = 42 AND status = 'ACCEPTED' AND state_version = 3;
-- 0 rows updated means someone else changed the order first: re-read and decide again.
```

**4. `idempotency_key` is unique.** A retried "Place order" from a flaky phone finds the existing row and returns
it instead of creating, and charging, a second order.

**5. `restaurant.status` and `prep_minutes` are live, fast-changing fields.** They are read on every discovery
request, so the copies used by discovery live in a cache or in-memory store that the restaurant intake updates;
the database row is the durable record.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Orders, deliveries, order items | Transactional, strongly consistent, modest volume | Sharded Postgres / MySQL, or a distributed SQL database (CockroachDB, Spanner) | Transactions and compare-and-set for the state machine |
| Menus | Read-heavy documents, change rarely | A document or relational store + a cache (Redis) + CDN for photos | Read thousands of times per write |
| Store search | Geo + text + filters | Elasticsearch / OpenSearch with geo fields, or a custom index | Geo queries combined with "pizza, open now" |
| Live courier positions | Tiny, overwritten every 4 s | In-memory geo index (Redis geo, or cells in memory), sharded by city | Only the latest position matters |
| GPS history, events | Append-only, huge | Kafka, then a data lake (object storage) | Disputes, analytics, training ETA models |
| Money | Double-entry ledger | Relational database, append-only | Auditable, see the payment system case study |

Sharding: in this design the order DB is sharded by `order_id` (as in the architecture diagram), which spreads
load evenly because almost every order query is by ID. Sharding orders by city also works, since almost nothing
crosses a city boundary. The real-time parts, **dispatch, discovery and live positions, are partitioned by
city**: they are naturally local, and a city is a natural unit for capacity and failure isolation. Very large
cities can be split further.

## 8. Deep dive: discovery by delivery area and ETA

A customer opens the app at home. "Restaurants near me" is the wrong question. The right one is **"which
restaurants will deliver to me, and how fast?"** A pizza place 2 km away across a river may take longer than one
4 km away on a straight road, and a restaurant with no free couriers nearby should drop down the list.

[![Discovery pipeline: the customer's location is mapped to a geo cell; the zone index returns about 500 stores whose zones cover the cell; live status filters to about 200 open stores; an ETA model using courier supply estimates each store's delivery time; the ranked list orders by ETA, rating and fee](/img/system-design/food-delivery/02-discovery.png)](/img/system-design/food-delivery/02-discovery.png)

*Select the diagram to zoom in and move around.*

**Step 1: who delivers here.** Each restaurant has a **delivery zone**. Storing it as a polygon and testing
"is this point inside?" against 300,000 polygons on every request would be slow. Instead, cover the map with
**cells**: geohash squares or hexagons from Uber's open-source H3 library. When a restaurant's zone is saved, we
precompute the set of cells it covers and store `cell → [restaurant IDs]`. Discovery then turns the customer's
address into a cell and does one lookup. That is the same idea as the geospatial index in the ride-hailing case
study, but here we index the **service areas** of restaurants rather than the points of drivers.

**Step 2: filter by live status.** Closed, paused ("we're too busy") and out-of-hours stores are removed using
the live status cache. This must be fresh within seconds: listing a closed restaurant creates an order that is
certain to be rejected.

**Step 3: estimate a delivery time per store.** A light ETA model combines the restaurant's current prep-time
estimate, the travel time from store to customer, and **courier supply** in that zone (if few couriers are free,
pickup will be slow). This runs for a few hundred stores per request, so it must be cheap: precomputed travel
times between cells, cached prep estimates, and a small model rather than a heavy one.

**Step 4: rank.** Sort by a score mixing ETA, rating, delivery fee, the customer's past orders, and business
rules (promotions). Stores whose ETA exceeds a limit, say 60 minutes, are hidden or shown as "far away".

The platform can also **shrink delivery zones dynamically**. When couriers are scarce in an area (rain, a big
match on TV), shrinking zones means fewer long trips and faster deliveries for the orders that are accepted.
This is a supply-and-demand lever, alongside surge fees.

## 9. Deep dive: menus and availability

Menus are the classic **read-heavy** data: read thousands of times, changed a few times a day. They are cached
at every level: a CDN for photos, a cache for the menu document per store, and the app itself caches the last
menu it saw with its `version`.

The awkward part is **availability**. A kitchen runs out of an item ("86'd" in kitchen slang) at 8 pm and taps
"sold out" on the tablet. Three rules keep this safe:

- **Availability is a separate, small, fast-changing field**, not part of the big cached menu document. The
  menu is cached for minutes; the availability map for a store is cached for seconds, or pushed.
- **The order service re-checks availability and price** when the order is placed, using the live data, not
  the client's copy. If an item has just sold out, the customer is asked to change the cart before paying.
- **The kitchen can still reject an item after accepting.** Real kitchens make mistakes. The order then supports
  a partial refund of that line, which is one reason to authorise first and capture later.

For restaurants connected through a **POS integration**, menus and availability are synced from the POS (by
webhook or periodic pull), so the restaurant edits its menu in one place.

## 10. Deep dive: the order lifecycle as a state machine

An order lives for about 35 minutes and passes through many hands. The safest way to model that is an explicit
**state machine**: a fixed list of states and the only transitions allowed between them. Any request that does
not match an allowed transition (for example "picked up" for an order that is still `PLACED`) is rejected.

[![Order state machine: PLACED to ACCEPTED to READY to PICKED UP to DELIVERED; PLACED can be cancelled when rejected, timed out or cancelled by the customer; ACCEPTED can be cancelled with a partial refund; READY can be cancelled when no courier comes in time; PICKED UP can become UNDELIVERABLE when the customer is unreachable](/img/system-design/food-delivery/04-order-states.png)](/img/system-design/food-delivery/04-order-states.png)

*Select the diagram to zoom in and move around.*

The courier's trip has its own, parallel state machine on the **delivery** row (`OFFERED → ASSIGNED →
AT_STORE → PICKED_UP → DELIVERED`, with `DECLINED` and `UNASSIGNED` sending the order back to dispatch). Keeping
the two separate means a courier swap never touches the customer's order history.

### Timeouts and cancellations at each stage

Each waiting state has a **timer**. When it fires, the machine takes a defined action.

| State | Waiting for | If it takes too long | If the customer cancels | If the restaurant or courier backs out |
| --- | --- | --- | --- | --- |
| `PLACED` | Restaurant to accept | After a few minutes: automated call, then cancel with a full refund | Free, full refund | Restaurant rejects: full refund, suggest similar stores |
| `ACCEPTED` | Kitchen to finish | Prep overruns: update ETA, tell the customer, re-time dispatch | Partial refund: the food is already being made | Restaurant cancels: full refund, restaurant penalised |
| `READY` | A courier to collect | No courier after a limit: raise courier pay for this job, then cancel and refund | Usually not refunded: the food exists | Courier cancels: back to dispatch at high priority |
| `PICKED_UP` | Drop-off | Delivery running late: proactive apology or credit | Not allowed (support only) | Courier cannot reach customer: wait a few minutes, then `UNDELIVERABLE`, support decides |

**How the timers are built.** A process sleeping in memory would lose every timer when it restarts. Instead, each
timer is **durable**: when the order enters `PLACED`, we write `(fire_at = now + 5 min, order_id, expected_state
= PLACED)` to a timer store, and a timer service fires due rows. When a timer fires, it uses the same
compare-and-set as everything else: "cancel order 42 **if it is still `PLACED`**". If the restaurant accepted a
second earlier, the update matches zero rows and the timer quietly does nothing. That one rule removes a whole
class of race conditions. Workflow engines such as Temporal or AWS Step Functions package exactly this pattern
(durable state + durable timers) and are a reasonable choice to mention.

## 11. Deep dive: restaurant order intake

The restaurant is the slowest and least reliable party: a human in a noisy kitchen, sometimes on a cheap tablet
on bad Wi-Fi. Intake has three jobs.

**1. Get the order into the kitchen reliably.** Two common channels:

- **Tablet app** supplied by the platform. Orders arrive by a persistent connection or push, the tablet rings
  loudly until someone taps **Accept**, and it acknowledges receipt so we know the order is on screen.
  If there is no acknowledgement, we retry, then fall back to an automated phone call.
- **POS integration**: the order is sent straight into the restaurant's till and kitchen printer through an
  adapter per POS vendor. Large chains prefer this: no extra tablet, no retyping. Each adapter converts our
  order format to the vendor's, and handles that vendor's retries and failures.

Delivery to the kitchen is **at least once** (we retry until acknowledged) with the order ID as the
idempotency key, so a retry never prints the order twice.

**2. Learn the prep time.** On accepting, the restaurant can enter a prep time, but humans round ("15 min") and
are optimistic at peak. So the platform also **predicts** prep time from history: this store, these items, this
hour, how many orders the store has open right now. A good model is the single biggest win for dispatch: if we
think the food will be ready at 7:17 but it is really ready at 7:25, the courier waits eight minutes.

**3. Notice an overloaded kitchen.** If a store has 20 open orders and falling acceptance speed, it is drowning.
The platform can extend its prep estimates, push its ETA up in discovery, or **auto-pause** it for a few
minutes. Letting it keep accepting orders it cannot cook makes everyone's food late.

## 12. Deep dive: courier assignment (dispatch)

In ride hailing, matching is roughly "nearest available driver, now". In food delivery it becomes an
**optimisation problem** with time in it: which courier, which orders together, and **when** to send them.

[![Dispatch round: gather open orders with predicted ready times, find nearby couriers, build single and stacked options, match the whole zone at lowest total cost, check whether the courier should leave now; if too early hold for the next round, otherwise offer; a declined or expired offer returns the order to the pool](/img/system-design/food-delivery/06-dispatch.png)](/img/system-design/food-delivery/06-dispatch.png)

*Select the diagram to zoom in and move around.*

### Batch, don't greedy-match

A **greedy** dispatcher handles each order the moment it arrives and gives it the nearest free courier. That is
simple but poor: the nearest courier for order A may be the only one who could reach order B in time, which
arrives two seconds later. Instead, dispatch runs in **rounds**: every few seconds, per zone (or per city), it
collects all unassigned orders and all available couriers and solves them **together**.

This is a version of the **assignment problem**: given a cost for every (courier, order) pair, choose pairs so
the total cost is lowest and nobody is used twice. Small cases can be solved exactly (the Hungarian algorithm);
real systems with stacking, time windows and thousands of jobs use **mixed-integer programming** solvers or
fast heuristics, with a time limit per round. DoorDash has written publicly about its dispatch engine, which
combines ML predictions with an optimisation step.

### What the cost function contains

For each candidate assignment, the cost adds up things we want to avoid:

- **Customer lateness**: predicted arrival minus promised time, weighted heavily when positive.
- **Food waiting**: minutes the food sits on the counter getting cold.
- **Courier waiting**: minutes the courier stands idle at the restaurant (unpaid or costly time).
- **Distance driven**, which costs the courier fuel and the platform pay.
- **Fairness and acceptance**: a courier who declines most long trips is less likely to accept this one.

### When to dispatch: just in time

Suppose food is predicted ready at 7:17 and the best courier is 8 minutes away. Sending them at 7:02 wastes 7
minutes of courier time; sending at 7:12 makes the food wait 3 minutes. Dispatch aims for the courier to arrive
**slightly before** the food is ready, because a late pickup hurts the customer and an early one only costs
some courier time. If the right moment has not come yet, the order is **held** and reconsidered in the next
round, often with a better courier who has just finished a nearby drop-off.

### Stacking two orders

Two orders from the same restaurant, ready within a few minutes of each other, going in roughly the same
direction, are a gift: one courier, one trip to the restaurant, two deliveries. Two restaurants on the same
street can also be stacked. The rule is that stacking must not make the **first** customer's order unacceptably
late: dispatch only builds a stacked option if both orders still arrive within their promised windows (for
example, at most a few minutes of extra delay). Stacking is used more at peak, when couriers are scarce, and less
in quiet hours, when speed matters more than efficiency.

### Offers, declines and fairness

Couriers are independent workers: they can decline. An offer shows pay, pickup and drop-off and expires after
about 30 seconds. A decline or a timeout puts the order back in the pool for the next round, usually at higher
priority, and the platform may raise the pay for a job that several couriers have declined. To avoid two
couriers getting the same order, the offer is **leased**: the delivery row records `offered_to = courier 7,
expires_at = 7:09:30`, and accepting is a compare-and-set on that row.

## 13. Live tracking

Live tracking is borrowed almost entirely from ride hailing (see the
[Uber case study](/system-design/case-studies/hard/uber/) for the details): the courier app sends batched GPS
points every few seconds, the location service updates the courier's latest position in an in-memory geo index,
and the event is fanned out to whoever is watching that courier.

What is specific to food:

- **Only some people are watching.** Each live order has one customer watching it (and the restaurant, which
  wants to know when the courier is near). The location service keeps a map `courier → order IDs`; a position
  update is pushed only to the subscribers of those orders.
- **Stacked orders reveal less.** If the courier is delivering someone else's order first, showing the exact
  route would reveal another customer's address. Apps typically show "delivering another order nearby" and
  hide the precise path until the courier is heading to you.
- **Smoothing.** GPS jumps around in cities. The client interpolates between points and snaps them to roads so
  the scooter glides instead of teleporting.
- **Arrival detection.** A geofence (a small circle around the restaurant and the customer) automatically
  triggers "arrived at store" and "nearly there", so couriers do not have to tap buttons while riding.

## 14. Deep dive: ETAs from several predicted parts

The ETA promised before payment is not one number from one model. It is a **sum of parts**, each predicted
separately, because each has different causes and different data.

[![Illustrative ETA breakdown for a 35-minute order: restaurant accepts in 2 minutes, kitchen prepares for 15 minutes, dispatch waits then assigns, the courier drives 8 minutes to the store arriving as food is ready, 3 minutes of pickup and hand-off, 12 minutes driving to the customer, and 3 minutes to park and hand over](/img/system-design/food-delivery/07-eta.png)](/img/system-design/food-delivery/07-eta.png)

*Select the diagram to zoom in and move around.*

| Part | Example | What predicts it |
| --- | --- | --- |
| Restaurant acceptance | 2 min | This store's usual response speed, time of day |
| Prep time | 15 min | Store, items, hour, current open orders at the store |
| Courier to store | 8 min (overlaps prep) | Courier supply nearby, road travel time |
| Pickup wait + hand-off | 3 min | Store layout, parking, how busy the counter is |
| Drive to customer | 12 min | Route, traffic, vehicle type, weather |
| Drop-off | 3 min | Building type: a house is quick; a tower with security and lifts is slow |

The total is **not** the sum of every bar: the courier's drive to the store overlaps with cooking. The
customer's arrival time is roughly:

$$
\text{ETA} \approx \max(\text{accept} + \text{prep},\ \text{dispatch} + \text{drive to store}) + \text{pickup} + \text{drive to customer} + \text{drop-off}
$$

In the example, dispatch sends the courier at minute 9 (just in time, section 12):
$\max(2 + 15,\ 9 + 8) + 3 + 12 + 3 = 17 + 18 = 35$ minutes.

Practical points:

- **Predict a distribution, not a single number.** Promising the average means half the orders are late. Many
  platforms show a range ("30–40 min") or promise a high percentile.
- **Update continuously.** After acceptance, after pickup and with every GPS point, re-estimate and push the new
  ETA. A late order that warns you early feels much better than one that silently slips.
- **Close the loop.** Every delivered order gives the true duration of each part. These feed back as training
  data, and monitoring compares predictions with reality per city, per hour.

## 15. Deep dive: payments split three ways

One charge to the customer has to become money for three parties. The mechanics of charging a card safely
(idempotency keys, authorise and capture, webhooks, reconciliation) are covered in the
[payment system case study](/system-design/case-studies/medium/payment-system/). Here the interesting part is
the **split**.

[![Money flow: the customer pays one charge for food, fees and tip to the payment provider; after capture the ledger splits it into the restaurant's share, the courier's share and platform revenue; restaurant and courier payouts are batched and sent by bank transfer](/img/system-design/food-delivery/08-money.png)](/img/system-design/food-delivery/08-money.png)

*Select the diagram to zoom in and move around.*

Take an illustrative order: food ₹500, delivery fee ₹40, platform fee ₹10, tip ₹30, so the customer pays ₹580.
With a 20% commission:

| Party | Gets | Arithmetic |
| --- | --- | --- |
| Restaurant | ₹400 | ₹500 food − 20% commission (₹100) |
| Courier | ₹80 | ₹50 delivery pay (set by the platform) + ₹30 tip |
| Platform | ₹100 | ₹100 commission + ₹40 delivery fee + ₹10 platform fee − ₹50 courier pay |
| **Total** | **₹580** | Matches the charge exactly |

How it is built:

- **A double-entry ledger.** On delivery, one transaction writes balanced entries: debit "customer funds
  received" ₹580, credit "owed to restaurant" ₹400, "owed to courier" ₹80, "platform revenue" ₹100. Every
  transaction's debits equal its credits (₹580 = ₹400 + ₹80 + ₹100), so money can never appear or vanish.
  Refunds are new entries, never edits. A real ledger adds more lines in the same balanced way, such as the
  payment provider's processing fee (an expense that reduces the platform's share) and taxes.
- **Batch payouts.** Restaurants are typically paid daily or weekly by bank transfer, summing all their orders
  minus refunds. Couriers are often paid weekly, with an option to cash out instantly for a small fee. Batching
  saves transfer fees and gives time to handle disputes.
- **Tips go entirely to the courier.** They are a separate ledger line so they can never be mixed into the
  platform's share.
- **Cash on delivery** reverses the direction: the courier now holds the customer's cash and owes the platform,
  which is netted against the courier's earnings in the next payout.
- **Reconciliation.** A daily job matches our ledger against the payment provider's settlement report and the
  bank's payout report. Any mismatch is investigated, never silently corrected.

## 16. Peak hours: the dinner rush and the rain

Food demand is spiky in a way few systems are. Lunch and dinner peaks are predictable; **rain** is not, and it
hits both sides at once: more people order, fewer couriers want to ride, and every trip is slower.

On the **software** side:

- **Scale ahead of the predictable peaks.** Discovery, menu and API fleets scale up before 7 pm every day,
  not after the latency alarm fires.
- **Protect the order path.** If something must be shed, shed the nice-to-haves first: recommendations,
  promotions banners, reviews. Placing, tracking and dispatching orders keep their capacity. Rate limits and
  queues protect the order service and payment provider from bursts.
- **Keep dispatch bounded.** More orders mean a bigger optimisation each round. Give each round a time budget,
  solve zones in parallel, and fall back to a greedy heuristic for a zone whose solve does not finish in time.

On the **marketplace** side, the bigger lever:

- **Raise courier supply:** peak pay or bonuses ("+₹20 per order in this area for the next hour") pull couriers
  online and into the busy zone.
- **Lower or shape demand:** surge delivery fees, longer and honest ETAs, shrinking delivery zones so that only
  nearby restaurants are shown, and temporarily hiding slow restaurants.
- **Use couriers better:** stack more aggressively, since a slightly slower delivery beats no delivery.
- **Throttle restaurants:** busy kitchens get longer prep estimates or are paused, so orders are not accepted
  only to sit on the counter.

The goal at peak is not "accept every order"; it is **"only accept orders we can deliver well"**. A rejected
order is a disappointment; an order that arrives cold 90 minutes later is a refund, a support ticket and a
customer who does not come back.

## 17. What breaks as it grows, and how to fix it

**The city-wide solver.** One optimisation over every order in a city grows quickly and stops finishing within
its round. *Fix:* partition by zone, solve zones in parallel, and let a courier near a border appear in both
neighbouring zones with a rule for conflicts.

**The hot restaurant.** A popular chain on a Friday gets 200 orders an hour from one kitchen. *Fix:* model its
capacity (orders per 10 minutes), extend its prep estimates as the queue grows, stack its orders, and keep a
small pool of couriers near it.

**GPS write storm.** Hundreds of thousands of couriers every few seconds. *Fix:* in-memory positions sharded by
city, batched updates from the app, and history written asynchronously to the event log, never to the order
database.

**Fan-out to watchers.** Pushing every courier's every move to every watcher overwhelms WebSocket servers.
*Fix:* push only to subscribers of that order, lower the update rate when the courier is far away, and let the
client interpolate.

**Multi-region.** A global company runs many countries with different payment methods, tax and rules. *Fix:* a
cell per region (often per country or large city), with its own databases and dispatch, sharing only
global services like identity.

## 18. Reliability: how orders survive failures

| Risk | Defence |
| --- | --- |
| A retried "place order" creates two orders | `Idempotency-Key` stored with a unique constraint; a retry returns the first order |
| Two events race (cancel versus ready) | Every transition is a compare-and-set on `status` and `state_version` |
| A timer is lost when a server restarts | Durable timers in a store; firing is idempotent and checks the expected state |
| State changed but the event was not published | Transactional outbox: state and event committed together, relayed to the bus |
| An event is delivered twice | Consumers are idempotent (they remember processed event IDs, or their writes are compare-and-set) |
| The restaurant tablet is offline | Acknowledgement with retries, then a phone call, then cancel with a full refund |
| The courier's phone dies mid-delivery | Missed heartbeats mark the courier as lost; support contacts them; dispatch can reassign if food was not picked up |
| Dispatch is down | Orders wait in `ACCEPTED`/`READY`; a standby dispatcher resumes from the database. Assignment state lives in the DB, not in dispatch's memory |
| Payment provider outage | Retry with the same idempotency key; a second provider for failover; disable affected payment methods in the app |

The pattern to remember: **the database row is the truth, events are notifications, and every handler checks
the state before acting.** Then retries, duplicates and restarts are all harmless.

## 19. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Courier matching | Greedy: nearest courier, immediately | Batched rounds solved as an optimisation | **Batched**: a few seconds of delay buys much better global assignments and enables stacking |
| When to dispatch | As soon as the restaurant accepts | Just in time for food-ready | **Just in time**: less courier idle time; slightly early rather than late |
| Stacking | Never | When both orders stay within their promise | **Conditional**: more at peak, less when quiet |
| Payment timing | Charge at order time | Authorise at order, capture at delivery | **Authorise then capture** for cards: cheap cancellations and partial refunds |
| Discovery ranking | By distance | By predicted delivery time | **By ETA**: what the customer actually cares about |
| Order workflow | Ad hoc service calls | Explicit state machine with durable timers | **State machine**: every edge case has one defined answer |
| ETA | One end-to-end model | Sum of separately predicted parts | **Parts**: each is explainable, testable and re-estimated as the order moves |
| Partitioning | By order ID | By city / zone | **By city** for dispatch, positions and discovery: they are local by nature |

## Cheat sheet for last-minute revision

- **Three-sided marketplace:** customer, restaurant, courier. The kitchen decides when the job can start; food
  gets worse every minute it waits.
- **Discovery** = address → geo cell → restaurants whose delivery zone covers it → filter open → rank by
  **predicted ETA**, rating, fee. Zones can shrink at peak.
- **Menus** are cached heavily; **availability and price are re-checked** by the order service at checkout.
- **Order state machine:** `PLACED → ACCEPTED → READY → PICKED_UP → DELIVERED`, with `CANCELLED` and
  `UNDELIVERABLE` exits. Every waiting state has a **durable timer**; every transition is a compare-and-set.
- **Restaurant intake:** tablet or POS adapter, at-least-once with acknowledgement, phone-call fallback, predicted
  prep times, auto-pause for overloaded kitchens.
- **Dispatch:** rounds every few seconds per zone, solve all orders and couriers together (assignment problem),
  cost = lateness + cold food + courier idle time + distance. Dispatch **just in time**; **stack** when both
  orders stay on time. Offers are leased and expire.
- **Tracking:** borrowed from ride hailing; in-memory positions, push only to that order's watchers.
- **ETA** = max(accept + prep, dispatch + drive to store) + pickup + drive + drop-off; predict ranges, update live.
- **Payments:** authorise at order, capture at delivery, **double-entry ledger** splits into restaurant, courier
  and platform; batched payouts; daily reconciliation.
- **Peaks:** scale before dinner, shed non-essential features, peak pay for couriers, surge fees, shrink zones,
  stack more, pause slow kitchens.
- **Numbers (illustrative):** 5M orders/day, ~175 orders/s at dinner peak, ~370,000 live orders, ~60,000 GPS
  writes/s.

## Practice questions

1. **The restaurant accepted, but the food is 15 minutes late and the courier is already waiting. What should
   the system do?** Detect it from the prep-time model and the courier's arrival geofence, update the customer's
   ETA, decide whether to keep the courier (pay them waiting time) or release them to another job and dispatch
   again later, and feed the miss into that store's prep-time model.
2. **How would you add scheduled orders ("deliver at 8 pm tomorrow")?** Store the order with a target time and a
   durable timer that releases it to the restaurant at target minus predicted prep and delivery time. From there
   it follows the normal state machine.
3. **A customer reports "never received" but the courier marked it delivered. How do you investigate?** Compare
   the courier's GPS trail and drop-off geofence with the address, check the delivery photo or PIN, and look at
   the courier's and the customer's history of such claims before deciding a refund.
4. **How would you support group orders, where several people add items to one cart?** A shared cart with a
   version number, edited by several users with compare-and-set; the host locks and pays; the rest is a normal
   order.
5. **How is food delivery different from grocery quick-commerce (10-minute delivery)?** The "restaurant" becomes
   the platform's own dark store, so prep time is picking time and is controlled by us; inventory is real stock
   that must be reserved at checkout; and couriers wait at the store, so dispatch is closer to a queue than a
   just-in-time optimisation.
