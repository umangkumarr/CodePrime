---
title: "Design a Flight Booking System (like an online travel agency)"
description: "Design an online travel agency step by step: GDS, NDC and PNRs, fan-out fare search with short-lived caches, re-price, hold, pay and ticket, and reconciliation."
difficulty: "Medium"
sidebar:
  label: "Flight booking (like an OTA)"
tags: ["Booking", "Caching", "Idempotency", "State machines", "Payments"]
---

Booking a flight feels like buying anything else online: search, pick, pay. Underneath, it is very different.
The online travel agency (OTA) that shows you the flights **owns none of them**. Every seat and every price lives
in an airline's computer, often reached through a middleman, and the price you saw a minute ago may already be
gone. An OTA is a **shop window** over other people's stock, a **broker** that must reserve, pay and ticket
across systems it does not control, and an **accountant** that must prove, every night, that what it sold matches
what the airlines think it sold.

This case study starts with how airline tickets are actually sold, then designs the OTA layer by layer: search,
booking, seats, failures, refunds and flash sales.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Air travel in 5 minutes: how a seat gets sold

Before designing anything, we need the vocabulary. Airline distribution is decades old, and an OTA has to plug
into it rather than replace it.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **PSS** (passenger service system) | The airline's core software: **inventory** (how many seats are left in each price bucket), **reservations** (who booked what) and check-in | The warehouse and its stock ledger |
| **GDS** (global distribution system) | A network that connects travel agents to hundreds of airlines through one interface. The big three are **Amadeus**, **Sabre** and **Travelport** | A wholesale market where shops buy from many farms |
| **NDC** (New Distribution Capability) | An IATA data standard (from the 2010s) for selling directly from the airline's own systems as *offers* and *orders*, often with richer content such as bundles and dynamic prices | Buying straight from the farm's own shop |
| **Fare filing (ATPCO)** | Airlines publish their fares and fare rules to a clearing house such as ATPCO, which passes them on to GDSs | The farm's printed price list, sent to every market |
| **PNR** (passenger name record) | The booking record: passenger names, flight segments, contact details and how it will be ticketed. Identified by a 6-character **record locator** such as `ABC123` | The reservation slip at a restaurant |
| **Booking class** | A single letter (Y, B, M, Q…) for a price bucket inside a cabin. Economy may have ten or more | Different shelves of the same product at different prices |
| **Fare basis** | The code naming the exact fare and its rules: refundable or not, change fee, minimum stay | The small print on the price tag |
| **E-ticket** | Proof that the trip is **paid for**: a 13-digit number (a 3-digit airline code plus 10 digits) | The receipt, not the reservation |
| **BSP / ARC** | Settlement systems through which agents report sales and pay airlines (BSP in most countries, ARC in the USA) | The clearing house that moves money between shops and farms |
| **LCC** (low-cost carrier) | Budget airlines; many sell mainly through their own website and APIs, not GDSs | A farm that only sells at its own gate |

Here is how the parties connect:

[![Who sells a flight: the traveller and metasearch sites reach the online travel agency, which books full-service airlines through a GDS or directly over NDC and low-cost carriers through their own APIs; airlines file fares to ATPCO, which feeds the GDS](/img/system-design/flight-booking/01-ecosystem.png)](/img/system-design/flight-booking/01-ecosystem.png)

*Select the diagram to zoom in and move around.*

Three facts from this picture shape the whole design:

1. **The airline is the source of truth.** Seats and tickets exist only when the airline's system says so. Our
   database is a *copy* of what we believe, which is why reconciliation (section 10) is not optional.
2. **A reservation is not a ticket.** A PNR **holds** seats; an e-ticket **pays** for them. Airlines cancel
   unticketed PNRs automatically after a **ticketing time limit** (minutes to days, depending on the fare).
3. **We talk to many suppliers, each with its own protocol, speed and price per call.** GDS messages
   (historically EDIFACT, now also XML and REST APIs), NDC offers and orders, and each LCC's own API. The design
   must hide that behind one internal interface.

### Why the price keeps changing

An airline does not sell a seat at one price. It splits the cabin into **booking classes** and its **revenue
management** system keeps deciding how many seats each class may sell. A simplified economy cabin for one
flight might look like this:

| Booking class | Fare | Seats it may still sell |
| --- | --- | --- |
| Q (cheapest, non-refundable) | ₹4,800 | 0 (closed) |
| M | ₹6,200 | 2 |
| B | ₹6,450 | 9 |
| Y (full fare, flexible) | ₹14,900 | 9 |

You search and see ₹6,200 (class M). While you type passenger names, two other people buy the last two M
seats. Class M closes and the cheapest available fare is now B at ₹6,450. Nothing was "wrong"; the price you
saw was a **snapshot** of fast-moving stock. Prices also change because revenue management re-opens or closes
classes as demand changes, airlines refile fares several times a day, taxes and currency rates change, and NDC
lets airlines price offers dynamically per request.

So a flight price has two halves: the **fare** (published rules, changes slowly) and the **availability** of
its booking class (changes every second). Search can cache the first comfortably; the second goes stale fast.

## 2. Requirements

### Functional (what users can do)

- **Search** one-way, return and multi-city flights by origin, destination, dates, passengers and cabin.
- **Filter and sort** by price, duration, stops, airline and departure time.
- **Book**: confirm the price, enter passenger details, pay, and receive an e-ticket.
- **Choose seats** and add extras (bags, meals) where the airline allows.
- **Manage the booking**: view it, cancel it, get a refund according to the fare rules.
- **Notifications**: confirmation, e-ticket, payment receipts, and airline schedule changes or cancellations.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Correctness of bookings** | Never charge without a ticket (or a refund); never issue a ticket we did not get paid for | Money and travel plans are on the line |
| **Search latency** | Results in 2–4 seconds, first results sooner | Suppliers are slow; users leave if search takes 15 seconds |
| **Availability** | 99.9%+ for search and booking | Every minute down is lost sales |
| **Consistency** | Bookings and payments strongly consistent; search results may be minutes old | Stale search is fine **if** we re-check before booking |
| **Scale** | Peak traffic many times average during sales and holidays | Flash sales concentrate demand into minutes |
| **Supplier cost** | Keep paid supplier calls within budget and quotas | GDS and airline APIs charge or throttle per request |

### Out of scope

Hotels and packages, loyalty programmes, airline check-in and boarding passes, fraud scoring in depth, and the
airline's own inventory system. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resource dominates**.

**Assumptions:** a large OTA makes **100,000 bookings a day**. People search a lot before they buy: we assume a
**look-to-book ratio** (searches per booking) of **1,000 : 1**. Each uncached search asks **5** supplier sources.
Peak traffic is **5×** average, and a flash sale briefly reaches **100×** average bookings.

**Search**

- Searches per day: $100{,}000 \times 1{,}000 = 100\text{M}$, about **1,160 per second** on average and about
  **5,800 per second** at peak.
- Without a cache, supplier calls at peak: $5{,}800 \times 5 \approx 29{,}000$ **per second**. Suppliers would
  throttle us and the bill would be huge.
- With an 80% cache hit rate, only about **5,800 supplier calls per second** at peak remain.

**Booking**

- $100{,}000$ bookings a day is only about **1.2 per second**, and about **120 per second** in a flash sale.
- But each booking makes several slow supplier calls (re-price, hold, ticket: often 2–10 seconds each). If a
  booking takes ~20 seconds end to end, a flash sale has $120 \times 20 = 2{,}400$ bookings **in flight at once**.

**Storage**

- One booking with passengers, segments, payments and its event history: ~20 KB.
  $100{,}000 \times 20\text{ KB} = 2\text{ GB}$ a day, under **1 TB a year**. Small.
- Fare cache: entries live a few minutes. Even if all ~3.5 million searches in a 10-minute peak window
  ($5{,}800 \times 600$) were distinct, at ~20 KB each that is about **70 GB**. It fits in memory on a small
  cluster, and in practice many searches repeat, so the real figure is far lower.

Three conclusions follow:

1. **Search is the heavy part**, by roughly three orders of magnitude. It must be cached and must protect
   suppliers.
2. **Booking is low volume but high stakes.** Optimise it for correctness and recovery, not throughput.
3. **The bottleneck is outside our walls.** Supplier latency, quotas and cost limit us more than our own servers.

## 4. The API

Clients (web, Android, iOS) use HTTPS with JSON.

| Method and path | What it does |
| --- | --- |
| `GET /v1/flights/search?from=DEL&to=BOM&date=2026-12-12&adults=1&cabin=economy` | Returns **offers**. Each has an `offer_id`, flights, fare rules summary and an indicative price. |
| `POST /v1/offers/{offer_id}/price` | **Re-price**: ask the supplier for the live price and rules of this offer. Returns a `priced_offer_id` valid for a few minutes. |
| `POST /v1/bookings` | Create a booking from a `priced_offer_id` and passenger details. Requires an `Idempotency-Key` header. |
| `POST /v1/bookings/{id}/payment` | Pay for a held booking (redirects to the payment page if needed). Also idempotent. |
| `GET /v1/bookings/{id}` | Status (`HELD`, `TICKETED`…), PNR, e-ticket numbers. Clients poll this or receive a push. |
| `GET /v1/flights/{segment_id}/seatmap` | The seat map for one flight of a booking. |
| `POST /v1/bookings/{id}/seats` | Choose seats: `{"passenger": 1, "segment": 1, "seat": "14C"}`. |
| `POST /v1/bookings/{id}/cancel` | Cancel; the response shows the refund amount from the fare rules before the user confirms. |

Why is re-price its own step? Because search results are **allowed to be stale** (they come from a cache), the
user must see the **real** price before entering card details. Separating the two lets search stay cheap.

## 5. High-level design

[![High-level architecture: apps call the API gateway; the search service reads the fare cache and on a miss asks the supplier gateway; the booking service uses the supplier gateway to re-price, hold and ticket, stores state in the booking DB, and calls the payment service; an outbox relay feeds the event bus, whose async workers send email, SMS and push](/img/system-design/flight-booking/02-architecture.png)](/img/system-design/flight-booking/02-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **API gateway:** authentication, rate limits per user and per IP (bots love flight search), routing.
- **Search service:** turns a query into supplier requests, merges and de-duplicates the answers, ranks them.
- **Fare cache:** recent search results with a short **TTL** (time to live, here a few minutes), for example Redis.
- **Supplier gateway:** one **adapter** per supplier (each GDS, each NDC airline, each LCC API) behind one
  internal interface. It enforces per-supplier quotas, timeouts and circuit breakers.
- **Booking service:** owns the booking **state machine** (section 8): re-price, hold, pay, ticket, cancel.
- **Booking DB:** a relational database (for example PostgreSQL or MySQL) for bookings, passengers, payments
  and idempotency keys. Transactions matter more than scale here.
- **Payment service:** talks to the payment gateway; authorises, captures and refunds, each idempotently.
- **Event bus + async workers:** every state change is published (via an **outbox**, section 10); workers send
  notifications, run reconciliation and process refunds.

The single most useful idea in this design: **search and booking are two different systems.** Search is
high-volume, read-only and allowed to be slightly wrong. Booking is low-volume, writes money and must be exactly
right. They share the supplier gateway and nothing else.

## 6. Flow 1: searching for flights

A traveller searches Delhi (DEL) to Mumbai (BOM) for 12 December.

[![Flight search sequence: the app asks the search service, which checks the fare cache; on a miss it asks the supplier gateway with a 3-second deadline, which calls each supplier in parallel within its quota; offers come back normalised, slow suppliers are dropped, results are stored with a short TTL and ranked results are returned](/img/system-design/flight-booking/03-search.png)](/img/system-design/flight-booking/03-search.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The cache key is the whole question:** route, date, cabin and passenger mix (`DEL-BOM|2026-12-12|Y|1A`).
  Prices depend on all of them, so leaving one out returns wrong answers.
- **Fan out in parallel with a deadline.** We ask every supplier at once and stop waiting after ~3 seconds.
  A supplier that answers late is dropped from this response (its answer can still fill the cache for the next
  person). Without a deadline, the slowest supplier decides how slow every search is.
- **De-duplicate.** The same flight often arrives from two sources (a GDS and the airline's NDC API) at different
  prices. Merge by flight number and date and keep the best offer, remembering which supplier it came from.
- **Stream results.** The app can show the first supplier's flights while the rest arrive, so the page feels fast.

### How long to cache a fare, and why the cache lies

A short TTL is a trade-off between **freshness** and **supplier cost**:

- **Longer TTL:** more cache hits, fewer paid calls, but more "price changed" surprises at re-price.
- **Shorter TTL:** fresher prices, but more supplier calls and slower searches.

A sensible policy varies the TTL by how fast that market moves: seconds to a few minutes for flights in the next
few days (availability changes constantly), longer for dates months away. Some OTAs also refresh popular routes
in the background so the cache is warm before anyone asks.

Whatever the TTL, a cached price is a **snapshot of availability that may already be gone**. That is why the
booking flow always starts with **re-price**: one live call for the one offer the user chose. If the price went
up, we show the new price and let the user accept or go back. If the class has sold out, we say so and suggest
the next fare. We never charge a price we have not just confirmed with the supplier.

## 7. Flow 2: booking (re-price, hold, pay, ticket)

The traveller chooses the ₹6,200 flight and presses **Book**.

[![Booking sequence: the app sends the booking with an idempotency key; the booking service re-prices the offer (now 6,450), creates a PNR to hold seats with a ticketing deadline, authorises the payment with the booking ID as key, asks the airline to issue the ticket, captures the payment once ticketed and confirms to the app](/img/system-design/flight-booking/04-booking.png)](/img/system-design/flight-booking/04-booking.png)

*Select the diagram to zoom in and move around.*

Why this order?

1. **Re-price first**, so the user pays the real price.
2. **Hold before pay.** Creating the PNR reserves the seats. If we took money first and then found the seats
   gone, we would have to refund, which is slow and annoys users.
3. **Authorise, then ticket, then capture.** An **authorisation** reserves money on the card without moving it;
   a **capture** actually takes it. Issuing the ticket commits *us* to paying the airline (through BSP/ARC or the
   airline's API), so we want the money secured first. We capture only once the ticket exists, so a ticketing
   failure costs the user nothing: we simply release the authorisation. (Payment methods without a separate
   authorisation, such as many wallets, are charged up front and refunded automatically on failure.)

Every step can fail or time out, and each needs its own answer:

| Step | What can go wrong | What we do |
| --- | --- | --- |
| Re-price | Price rose or class sold out | Show the new price or the next fare; the user decides |
| Hold (create PNR) | Seats gone between re-price and hold; supplier timeout | Sold out: offer alternatives. Timeout: **do not blindly retry**; look up whether a PNR exists (section 10) |
| Payment window | User never pays (closes the tab) | Our own timer (say 15 minutes, always before the airline's ticketing deadline) cancels the PNR and releases the seats |
| Pay | Card declined, 3-D Secure abandoned | Booking stays `HELD`; the user may retry with another card until the window ends |
| Ticket | Airline refuses (fare changed, PNR problem) | Release the authorisation, cancel the PNR, tell the user; booking becomes `FAILED` |
| Ticket | **Timeout: we do not know if it worked** | Mark `TICKETING_UNKNOWN` and reconcile (section 10). Never charge again, never re-issue blindly |
| Capture | Payment gateway hiccup | Retry with the same idempotency key; the gateway returns the earlier result |

The user sees **"Booking confirmed"** only after ticketing. Until then the app shows "processing" and polls
`GET /v1/bookings/{id}` (or waits for a push). Most bookings finish in seconds; a few take minutes, and the
honest status is better than a false "confirmed".

## 8. The booking state machine

A booking is a **state machine**: a fixed set of states and allowed moves between them. Writing it down
explicitly is what keeps a multi-step, multi-system process safe.

[![Booking states: INITIATED to HELD to PAID to TICKETED to COMPLETED; INITIATED can fail when sold out, HELD expires when the timer fires, PAID can fail when ticketing is refused or go to TICKETING_UNKNOWN on a timeout, which resolves to TICKETED or FAILED; TICKETED can be CANCELLED by the traveller and then REFUNDED](/img/system-design/flight-booking/05-booking-states.png)](/img/system-design/flight-booking/05-booking-states.png)

*Select the diagram to zoom in and move around.*

Rules that make it robust:

- **Every transition is a conditional update.** Moving from `HELD` to `PAID` is
  `UPDATE booking SET status='PAID', version=version+1 WHERE id=? AND status='HELD' AND version=?`. If two
  workers race (say the payment callback and the expiry timer), exactly one update succeeds and the other sees
  zero rows changed and stops. This is **optimistic concurrency control**.
- **Timers are data, not sleeping threads.** `hold_expires_at` is stored on the booking; a scheduler regularly
  picks up rows whose time has passed and moves them to `EXPIRED`. A restart loses nothing.
- **Every state has an owner and an exit.** `TICKETING_UNKNOWN` is a real state with a worker that resolves it,
  not a log line someone might read.
- **Every transition is recorded** in a `booking_event` row in the same transaction (section 10), which gives an
  audit trail for support and the feed for notifications.

## 9. Deep dive: seat selection without double allocation

Seat maps look like a classic concurrency problem: two people tap seat 14C at the same moment. Who gets it?

First, be precise about **who decides**. For airline flights, the seat belongs to the airline's system. When we
send "assign 14C to this passenger", the airline either accepts or refuses, and it will never give one seat to
two passengers. So double allocation *across the world* is the airline's job. Ours is to avoid a poor
experience and wasted supplier calls when many of **our** users chase the same seat.

[![Seat selection: the traveller taps 14C, the seat service serves a map cached for about a minute and tries to lock 14C with set-if-absent and a 10-minute TTL; if the lock is won the airline assigns the seat in the PNR and it is confirmed; if already locked the user picks another; if the airline says the seat is gone we unlock and refresh the map](/img/system-design/flight-booking/06-seat-selection.png)](/img/system-design/flight-booking/06-seat-selection.png)

*Select the diagram to zoom in and move around.*

- **Short-lived lock:** `SET seat:XY865:2026-12-12:14C <booking_id> NX EX 600` in Redis. `NX` means "only if
  nobody holds it", so one request wins atomically. The TTL means an abandoned lock frees itself.
- **The airline still has the last word.** Another agency or the airline's own website may take 14C. If the
  airline refuses, we release our lock (deleting it only if it still holds our booking ID, so we never remove
  a lock another booking took after ours expired), refresh the seat map and ask the user to choose again.
- **Paid seats** are extras the airline sells with their own document (an EMD, electronic miscellaneous
  document). Treat them like a small booking: hold, pay, issue, with the same idempotency rules.

When **we own the inventory** (for example a charter flight or a block of seats an OTA has bought outright),
there is no airline to arbitrate, so the database must. Make the rule a constraint:

```sql
CREATE TABLE seat_assignment (
  flight_id    bigint,
  seat_no      varchar(4),
  passenger_id bigint NOT NULL,
  PRIMARY KEY (flight_id, seat_no)      -- one passenger per seat, enforced by the database
);
```

Two concurrent inserts for `(flight, '14C')` cannot both succeed; the loser gets a key violation and is told
the seat is taken. For a seat **count** (not a specific seat) use a conditional decrement:
`UPDATE seat_block SET seats_left = seats_left - 1 WHERE flight_id = ? AND seats_left > 0`.

## 10. Deep dive: idempotency and reconciliation with suppliers

Networks fail at the worst moment. The most dangerous moment is a timeout on a call that **changes the world**:
create PNR, issue ticket, charge card. Did it happen or not? We cannot tell from a timeout.

**Rule 1: separate safe calls from unsafe ones.** Search, re-price and "retrieve PNR" only read; retry them
freely. Creating a PNR and issuing a ticket create things; many supplier APIs have **no idempotency keys**, so
retrying blindly can create two PNRs or two tickets.

**Rule 2: be idempotent ourselves.**

- The client sends an `Idempotency-Key` with `POST /v1/bookings`. We store it with a unique constraint; a
  retried request returns the existing booking instead of starting a second one. A double-tap on "Book" is
  harmless.
- Payment calls use the booking ID (plus the step) as their key, so the payment gateway never charges twice.
- Every PNR we create carries **our own reference** (for example in a remark field, or the supplier's
  client-reference field where one exists). It lets us search the supplier for "the PNR with our reference X".

**Rule 3: when unsure, ask, do not repeat.** On a timeout we move the booking to an "unknown" state and find out.

[![Reconciliation: when a ticket call times out the booking becomes TICKETING_UNKNOWN; a worker retrieves the PNR by record locator and checks for a ticket number; if present the booking becomes TICKETED and payment is captured, otherwise the PNR is cancelled and the booking fails with money released; nightly, the sales report is compared with our bookings and mismatches go to a queue](/img/system-design/flight-booking/07-reconciliation.png)](/img/system-design/flight-booking/07-reconciliation.png)

*Select the diagram to zoom in and move around.*

- **Within minutes:** retrieve the PNR (by record locator, or by our reference if even the create call timed
  out). A ticket number on it means the ticket exists: mark `TICKETED` and capture. No ticket and the hold still
  valid: we may try ticketing once more, but only after waiting long enough that the timed-out request cannot
  still be in progress on the supplier's side (and, if the supplier offers it, checking its transaction status);
  otherwise a slow first request and the retry could both issue a ticket. Otherwise
  cancel the PNR and release the money.
- **Nightly:** compare three ledgers: our bookings, the tickets the suppliers report (and the BSP/ARC sales
  report), and the payment gateway's settlement file. Every ticket must match a captured payment and vice versa.
  Mismatches (a ticket we think failed, a payment with no ticket) go to a queue for an automated fix or a human.

**The outbox pattern** keeps our own database and the event bus in step. When the booking changes state, we
write the new state **and** a `booking_event` row in **one transaction**. A relay process reads unpublished events
and sends them to the event bus, marking them published. If the service crashes between the two, the event is
still in the table and is sent later. Consumers may see an event twice, so they are idempotent too (a
notification worker remembers which event IDs it has sent).

## 11. Low-level design: the data model

[![Data model: booking has passengers and segments; supplier_booking holds the PNR locator, our reference and ticketing deadline per supplier; booking_event is the audit trail and outbox; payment belongs to a booking and refund belongs to a payment](/img/system-design/flight-booking/08-data-model.png)](/img/system-design/flight-booking/08-data-model.png)

*Select the diagram to zoom in and move around.*

Design decisions hidden in the diagram:

**1. A booking can have several supplier bookings.** A return trip on two different airlines, or a "virtual
interline" itinerary we stitch together from two LCCs, means two PNRs with two deadlines. `supplier_booking`
keeps one row each, and the booking is only `TICKETED` when all of them are.

**2. Unique keys are business rules.** `booking.idempotency_key` stops duplicate bookings;
`payment.idempotency_key` stops duplicate charges; `supplier_booking.our_reference` lets reconciliation find a
PNR; `passenger.ticket_number` stops one ticket being attached twice. (One ticket number per passenger fits the
common single-PNR booking. With several supplier bookings each passenger gets one ticket per PNR, so the ticket
number moves to its own `ticket` table keyed by supplier booking and passenger, still unique.)

**3. `version` on the booking** supports the conditional updates from section 8.

**4. Copy what you sold.** `segment` stores the flight, booking class and fare basis *as sold*. If the airline
later changes the schedule, we still know exactly what the customer bought, which decides their refund rights.

**5. Shard later, if ever.** At ~2 GB a day, one primary database with replicas lasts years. If it ever needs
sharding, `booking_id` (or `user_id`) is the natural key, since every query is about one booking or one user.

| Data | Good fit | Why |
| --- | --- | --- |
| Bookings, payments, events | PostgreSQL / MySQL | Transactions, unique constraints, conditional updates |
| Fare cache, seat locks, rate limits | Redis | Fast, expiring keys |
| Events | Kafka or a similar log | Fan-out to notifications, reconciliation, analytics |
| Search analytics, price history | Columnar store or data lake | Cheap scans for "which routes to pre-warm" |

## 12. Deep dive: cancellations, refunds and changes

A cancellation is a small booking flow in reverse, with its own rules:

- **Void vs refund.** A ticket cancelled very soon after issue (typically the same day, before it is reported in
  the sales report) can be **voided**: it is as if it was never sold, and the full amount comes back. After that
  it must be **refunded** according to the fare rules: a non-refundable fare may return only taxes; a flexible
  fare may return everything minus a fee.
- **Quote before you act.** `POST /cancel` first asks the supplier what the refund would be and shows it. The
  user confirms; then we cancel.
- **Refunds are asynchronous.** The airline or BSP/ARC settles the refund, then we refund the user's original
  payment method. The booking moves `CANCELLED → REFUNDED` only when money has actually left. Refund amounts are
  stored separately from the original payment (the `refund` table), never by editing the payment row.
- **Regulations matter.** For example, the US Department of Transportation requires airlines to let travellers
  cancel without penalty within 24 hours of booking (when booked at least 7 days before departure), or to hold
  the fare for 24 hours. Rules like this belong in the fare-rules engine, not scattered through the code.
- **Involuntary changes.** The airline may change the schedule or cancel the flight. Suppliers report these as
  PNR updates or messages on a queue; a worker reads them, updates our segments, and triggers notifications
  and, where the rules allow, a free change or full refund.

## 13. Notifications

Every state change becomes an event on the bus; a notification worker turns events into messages:

| Event | Message | Channel |
| --- | --- | --- |
| `TICKETED` | Confirmation, e-ticket PDF, receipt | Email + SMS + push |
| `EXPIRED` | "Your hold ended; seats released" | Push + email |
| `TICKETING_UNKNOWN` lasting over a few minutes | "We are confirming your ticket" | Push |
| Schedule change from the airline | New times, options to change or refund | Email + SMS + push |
| `REFUNDED` | Amount and expected arrival date | Email |

Two details: the worker records which event IDs it has sent, so a redelivered event does not send a second
SMS; and urgent messages (a cancelled flight tomorrow morning) skip the queue for marketing traffic.

## 14. Deep dive: flash traffic (sales and peak season)

An airline announces a sale at noon, or the festival season opens. Search traffic jumps tenfold and bookings even
more. Our servers can scale; the **suppliers cannot**, and they will throttle us.

- **Protect suppliers with quotas.** The supplier gateway gives each supplier a request budget (a token bucket).
  When it is spent, search answers from the cache, even if slightly old, rather than calling again. A degraded
  but fast answer beats an error.
- **Pre-warm the cache** for the sale routes and dates before the sale starts, and lengthen TTLs during the peak
  for far-off dates. Re-price still guarantees the final price.
- **Collapse duplicate requests.** If 500 people search DEL-BOM for the same date in the same second, make **one**
  supplier call and share the answer (request coalescing, also called single-flight).
- **Shed load in order of value.** Booking and payment traffic gets priority over search; bots and scrapers are
  rate-limited at the gateway; a **waiting room** can admit users to the booking flow at a steady rate.
- **Keep booking asynchronous.** The booking request is accepted and stored quickly; workers then drive the
  slow supplier steps from a queue at a pace the suppliers accept, while the app shows "processing".
- **Circuit breakers.** If one supplier starts timing out, stop calling it for a while (and hide or mark its
  flights) so its slowness does not tie up threads that serve everyone else.

## 15. What breaks as it grows, and how to fix it

**The supplier bill.** Searches grow faster than bookings, and every uncached search costs money. *Fix:* smarter
caching (TTL by market), coalescing, pre-warming popular routes, and monitoring the look-to-book ratio per
supplier, since some contracts limit it.

**The slow supplier.** One adapter with 10-second latency drags down every search. *Fix:* per-supplier deadlines,
separate thread or connection pools per supplier (bulkheads), and circuit breakers.

**Stuck bookings.** Thousands of bookings in `HELD` or `TICKETING_UNKNOWN` after an outage. *Fix:* the expiry
scheduler and reconciliation workers are first-class services with alerts on "bookings older than N minutes in a
non-final state".

**Drift between us and the airline.** Schedule changes, manual changes by airline agents, voids we did not see.
*Fix:* subscribe to supplier change messages and run the nightly three-way reconciliation.

**Many airlines, many formats.** Each new NDC airline has its own variations. *Fix:* the adapter pattern in the
supplier gateway; the rest of the system sees only our internal offer and order model.

## 16. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Search freshness | Live supplier call every time | Cache with short TTL | **Cache**, plus a mandatory re-price before booking: search is cheap, booking is correct |
| Order of hold and pay | Pay, then hold | Hold, then pay | **Hold first**: no charge for seats that are already gone |
| Payment timing | Capture before ticketing | Authorise, ticket, then capture | **Authorise first** where possible: a ticketing failure costs the user nothing |
| On a timeout | Retry the call | Mark unknown and look up | **Look up**: supplier write calls are often not idempotent |
| Booking API | Synchronous until ticketed | Accept, then process asynchronously | **Async with polling or push**: survives slow suppliers and flash traffic |
| Seat conflicts | Trust our lock | Lock plus airline as final judge | **Both**: our lock reduces collisions, the airline decides |
| Consistency with suppliers | Assume our DB is right | Reconcile continuously | **Reconcile**: the airline is the source of truth |

## Cheat sheet for last-minute revision

- **Ecosystem:** airline PSS (inventory + PNRs) ← GDS (Amadeus, Sabre, Travelport) or NDC (direct offers/orders)
  or LCC APIs ← OTA. Fares filed through ATPCO; money settled through BSP/ARC.
- **PNR = hold, e-ticket = paid.** Unticketed PNRs expire at the ticketing time limit.
- **Prices change** because booking classes open and close every second; fares and rules change more slowly.
- **Search:** cache key = route + date + cabin + passengers, TTL of minutes (shorter near departure); fan out in
  parallel with a deadline; de-duplicate; stream results.
- **Booking:** re-price → hold (PNR) → authorise → ticket → capture → confirm. Our payment window ends before the
  airline's ticketing deadline.
- **State machine:** INITIATED → HELD → PAID → TICKETED → COMPLETED, plus FAILED, EXPIRED, TICKETING_UNKNOWN,
  CANCELLED, REFUNDED. Transitions are conditional updates.
- **Idempotency:** client key on booking, booking ID as payment key, our reference inside every PNR.
- **Timeouts on writes:** never retry blindly; retrieve and reconcile. Nightly three-way reconciliation:
  bookings ↔ tickets/sales report ↔ payment settlement.
- **Seats:** Redis `SET NX EX` lock to reduce collisions; the airline decides; own inventory uses a unique key.
- **Flash traffic:** supplier quotas, pre-warm, coalesce, prioritise booking over search, waiting room, circuit
  breakers.
- **Numbers:** 100K bookings/day × 1,000 look-to-book = 100M searches/day (~1,160/s, ~5,800/s peak);
  bookings ~1.2/s (~120/s in a flash sale); data ~2 GB/day.

## Practice questions

1. **The user paid but the app shows "processing" for 10 minutes. What happened and what do you do?** Probably a
   ticketing timeout: the booking is in `TICKETING_UNKNOWN`. The reconciliation worker retrieves the PNR; if a
   ticket exists, capture and confirm; if not and the hold is valid, retry ticketing once (after the wait described in section 10); otherwise cancel and
   release the authorisation, and tell the user. Alert if many bookings sit in this state.
2. **How would you show a price calendar ("cheapest fare each day this month")?** Do not run 30 live searches.
   Build it from cached and recently seen prices (a price-history store), label the numbers as "from" prices, and
   re-price when the user picks a day.
3. **How would you offer "hold this fare for 48 hours for a small fee"?** Only where the fare's ticketing time
   limit allows it, or by taking the price risk yourself: charge the fee, and if the fare rises before the user
   pays, the OTA covers the difference (priced into the fee). A timer moves the booking to `EXPIRED` when the
   window ends.
4. **Two suppliers return the same flight at different prices. Which do you show?** Merge by flight number,
   date and cabin; show the best price, but also consider reliability (a supplier with frequent ticketing
   failures may not deserve the sale) and the fare rules (refundable or not), which may differ.
5. **How would you build a combined itinerary from two low-cost carriers that do not cooperate?** Book two
   separate PNRs, ticket them one after the other, and handle partial failure: if the second fails, cancel or
   void the first. Tell the user that a missed connection is not protected by either airline, and consider
   offering your own protection product.
