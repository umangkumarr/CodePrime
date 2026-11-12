---
title: "Design a Ticket Booking System (like BookMyShow / Ticketmaster)"
description: "Design a ticket booking system: cached seat maps, TTL seat holds that never double-book, a hold-pay-confirm saga, waiting rooms for hot on-sales and QR entry."
difficulty: "Hard"
sidebar:
  label: "Ticket booking (like BookMyShow)"
tags: ["Concurrency", "Transactions", "Caching", "Queues", "Rate limiting"]
---

Buying a cinema ticket feels like a small thing: pick a show, tap two seats, pay, get a QR code. Underneath, a
ticket booking system is a **shop that sells things that cannot be copied**. Seat A7 for the 7 pm show exists
exactly once. If two people buy it, one of them will stand in the aisle arguing with an usher. On a normal
evening that is a classic concurrency problem. On the morning a stadium tour goes on sale, it becomes a
problem of millions of people pressing the same button in the same second.

BookMyShow (India's large online platform for cinema and live-event tickets) and Ticketmaster (a large
ticketing company for concerts and sports, part of Live Nation) solve versions of this problem. This case study
builds such a system from first principles: the catalogue and seat maps, seat holds that can never double-book,
the hold, pay and confirm flow, the "hot show" problem, and entry at the venue gate.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Ticket booking in 5 minutes: the vocabulary

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Event** | The thing people come to see: a film, a concert, a match | The title on the poster |
| **Venue** | A place with halls, screens or stands, each with a fixed **seat layout** | The building |
| **Show** | One event at one venue (hall) at one time: "Dune, Screen 3, 7 pm Friday" | One performance |
| **Seat map** | The layout of a hall plus the live status of every seat for one show | The seating chart at the box office |
| **Show seat** | One seat for one show. The thing we actually sell | One specific chair on one specific evening |
| **Hold** | A temporary reservation of seats while the buyer pays, with an expiry time (**TTL**, time to live) | Putting clothes aside at the shop counter for ten minutes |
| **Booking** | The order: who bought which seats for which show, and its state | The receipt |
| **On-sale** | The moment tickets for an event are released, often announced weeks before | Shop doors opening on sale day |
| **General admission** | Tickets without a seat number, just a count (a standing area) | Entry to a festival field |

The fundamental fact: **a seat is a unique item with a deadline**. Unlike a phone in a warehouse there is no
"another one in stock", and after the show starts it is worth nothing. Two consequences shape the whole
design:

1. **Correctness is non-negotiable for one thing only:** never sell the same seat twice. Almost everything
   else (the seat map being a second stale, an email arriving late) can be relaxed.
2. **Demand is wildly uneven.** A Tuesday matinee sells ten tickets an hour. A big concert can see millions of
   fans arrive within minutes for a few tens of thousands of seats. The system must survive both.

## 2. Requirements

### Functional (what users can do)

- **Browse and search** events by city, date, genre, language; see venues and show times.
- **View the seat map** of a show with live availability and price per seat or section.
- **Select seats and hold them** for a short time (say 10 minutes) while paying.
- **Pay** and receive a confirmed booking with an **e-ticket** (a QR code), by app, email and SMS.
- **Cancel** a booking within the organiser's policy and get a refund.
- **Enter the venue** by having the QR code scanned at the gate.
- **Organisers** (cinemas, promoters) create shows, set prices and price tiers, and see sales.
- For **hot on-sales**: a fair **waiting room**, purchase limits per person, and protection from bots.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **No double booking** | Zero seats sold twice, ever | The one failure customers and venues never forgive |
| **Availability** | 99.99% for browsing and booking; the venue gate must work even if our cloud is down | A failed gate on show night is a crowd-safety problem |
| **Latency** | Seat map under 300 ms; hold answer under 500 ms | Fans compete for good seats second by second |
| **Burst tolerance** | Survive 100× normal traffic at an on-sale without falling over | The busiest minutes are the ones that matter most |
| **Fairness** | Earlier arrivals and humans first, bots out | Fans judge the brand by whether the sale felt fair |
| **Consistency** | Strong for seat inventory; eventual (seconds) for seat maps, search and notifications | Spend strictness only where money and seats are at stake |

### Out of scope

Reviews and ratings, recommendations, food and drink add-ons, the organiser's accounting, and the resale
marketplace. Mention them in an interview, then set them aside.

## 3. Back-of-the-envelope estimates

We need two sets of numbers: a normal day, and the worst ten minutes of the year.

### A normal day

**Assumptions:** a national platform sells **1 million tickets a day**, **2.5 tickets per booking**,
**20 million** visitors a day viewing about **10 pages** each.

- Bookings: $1\text{M} / 2.5 = 400{,}000$ a day $\approx$ **5 per second** on average, perhaps **50 per
  second** at the Friday-evening peak (10×).
- Page views: $20\text{M} \times 10 = 200\text{M}$ a day $\approx$ **2,300 per second**, ~23,000 per second at
  the same 10× peak. That is about **500 page views per booking**: this system is overwhelmingly **read-heavy**.
- Inventory: say 10,000 screens × 4 shows a day × 7 days on sale = 280,000 shows. At 250 seats each that is
  **70 million show-seat rows**; at ~100 bytes a row, about **7 GB**. Small. We shard for throughput and
  isolation, not for size.

### An on-sale spike

**Assumptions:** two stadium concerts of **50,000 seats** each, **100,000 tickets** in all, at most **4 per
order** (so at least 25,000 orders). **3 million** fans arrive in the 10 minutes before 10:00.

- Arrivals: 3M in 10 minutes is 5,000 a second on average, but most come in the last few minutes; 3M in ~5
  minutes $\approx$ **10,000 new visitors per second**, all loading the same page.
- Waiting-room polling: each waiting browser asks "where am I in the queue?" every 15 seconds:
  $3\text{M} / 15 = 200{,}000$ **requests per second**. These must be served from the CDN edge or a tiny
  counter service, never by the booking system.
- Shoppers inside: if each admitted fan spends ~4 minutes choosing and paying, and we allow **20,000** at a
  time, we admit $20{,}000 / 240\text{ s} \approx$ **80 fans per second**.
- Seat-map reads: 20,000 shoppers refreshing every 5 seconds = **4,000 reads per second**, from a cache.
- Hold attempts: perhaps 3 per shopper over 4 minutes $\approx$ **250 writes per second**, all aimed at the
  same few thousand "best" seats, so many will collide.

Three conclusions follow:

1. **The writes are tiny; the crowd is huge.** 250 hold attempts per second is easy for one database. Three
   million browsers hammering the origin is not. The fight is about **admission control**, not storage.
2. **Most fans will leave without a ticket.** 3 million people, 100,000 seats: about 97% are disappointed no
   matter what we build. The system's job is to be **fair, stay up, and never sell a seat twice**.
3. **Contention is local.** All the conflict is on one show's seats. If one show's inventory lives on one
   shard, every hold is a single-shard transaction.

## 4. The API

Clients talk to us over HTTPS with a JSON API. Every booking-changing call carries an `Idempotency-Key` header
so that a retried request (the phone lost signal and tried again) does not create a second booking.

| Method and path | What it does |
| --- | --- |
| `GET /v1/events?city=pune&date=2026-11-20&q=dune` | Search events; served from a search index and cache. |
| `GET /v1/events/{event_id}/shows?city=pune` | Shows (venue, hall, time, price range) for an event. |
| `GET /v1/shows/{show_id}/layout` | The static seat layout of the hall: rows, numbers, sections, tiers. Cacheable for days. |
| `GET /v1/shows/{show_id}/availability` | The live status of every seat (available, held, booked), cacheable for a second or two. |
| `POST /v1/shows/{show_id}/holds` | Body `{"seats": ["A7", "A8"]}`. Holds the seats for 10 minutes; returns `booking_id` and `expires_at`, or `409 Conflict` if any seat is taken. |
| `POST /v1/bookings/{booking_id}/payment` | Starts payment; returns the provider's checkout details. |
| `POST /v1/payments/webhook` | Called **by the payment provider** when a payment succeeds or fails. |
| `GET /v1/bookings/{booking_id}` | Booking state and, once confirmed, the e-ticket. |
| `POST /v1/bookings/{booking_id}/cancel` | Cancel within policy; starts the refund. |
| `POST /v1/checkin` | Used by gate scanners: `{"code": "..."}` returns admit or reject. |

Why split **layout** from **availability**? The layout of Screen 3 never changes between shows and is the
bulk of the bytes (hundreds of seats with coordinates). It can sit on a CDN for days. Availability changes
every second but is tiny: a status per seat. Splitting them means the expensive part is cached forever and the
live part is cheap to refresh.

## 5. High-level design

[![High-level architecture: apps reach a CDN and waiting room, then an API gateway; behind it the catalogue, seat-map, booking and payment services; the booking service makes atomic holds in the inventory DB, whose changes update the Redis seat status cache and flow through an outbox to the event bus and async workers; gate scanners also talk to the gateway](/img/system-design/ticket-booking/01-architecture.png)](/img/system-design/ticket-booking/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **CDN + waiting room:** serves static pages, images and seat layouts from servers near the user, and during a
  hot on-sale holds fans in a queue before they reach anything expensive.
- **API gateway:** checks who you are, verifies admission tokens, applies rate limits, routes requests.
- **Catalogue service:** events, venues, shows and prices. Read-mostly, heavily cached, backed by a search index.
- **Seat-map service:** combines the cached layout with live seat status from the **seat status cache** (Redis).
- **Booking service:** the heart. Creates holds, runs the hold, pay and confirm flow, handles cancellations.
- **Inventory DB:** the **source of truth** for `show_seat` and `booking` rows. A relational database
  (PostgreSQL or MySQL) because we need transactions and row locks. Sharded by `show_id`.
- **Payment service:** talks to the payment provider with idempotency keys; handles refunds.
- **Event bus + async workers:** after a booking changes, generate the e-ticket, send email, SMS and push,
  update analytics and search.
- **Gate scanners:** devices at the venue that check QR codes, online or offline.

The single most useful idea in this design: **reads are served from caches that are allowed to be slightly
wrong; writes go to one place that is never wrong.** The seat map may show A8 as free for a second after
someone held it. That is fine, because the hold itself is decided by the inventory database, which cannot be
fooled.

## 6. Browsing and the seat map: heavy caching, live status

Over 99% of requests are reads, so the read path is built in layers.

| Data | Changes | Where it is served from |
| --- | --- | --- |
| Event pages, posters, trailers | Rarely | CDN, cached for hours |
| Show times and price ranges | When organisers edit | Catalogue cache (Redis), invalidated on edit |
| Hall seat layout | Almost never | CDN, keyed by `layout_id` and version |
| Seat status for a show | Every second during a sale | Seat status cache (Redis), one entry per show |

**How live status is kept fresh.** Every change to a `show_seat` row (held, booked, released) is published as an
event, either by the booking service through an outbox table or by reading the database's change log (**change
data capture**, CDC). A small consumer applies it to the show's entry in Redis. A compact way to store it is a
**bitmap**: two bits per seat (available, held, booked, blocked). A 60,000-seat stadium is
$60{,}000 \times 2 / 8 = 15$ KB, small enough to send to every browser in one response.

**How the browser stays current.** Two options:

- **Polling:** the app re-fetches availability every few seconds. Simple, cache-friendly (thousands of fans get
  the same cached answer), and good enough for cinemas.
- **Push:** a WebSocket or server-sent events stream sends "A7 and A8 just went to held". Nicer during a hot
  sale, but costs a long-lived connection per fan.

Either way, the seat map is a **hint**, not a promise. If a fan taps a seat that was taken half a second ago,
the hold fails with a clear "just taken, pick another" message and the map refreshes. Trying to make the map
perfectly consistent for millions of viewers would cost far more than an occasional polite refusal.

## 7. Deep dive: seat holds that never double-book

This is the part interviewers push on hardest. Asha and Ravi both see seat A8 as free and tap it at the same
moment: Asha asks for A7 and A8, Ravi for A8 and A9.

### The race

The naive code reads, decides, then writes:

```sql
SELECT status FROM show_seat WHERE show_id = 42 AND seat_id = 8;   -- both see 'AVAILABLE'
-- application: "it's free, so take it"
UPDATE show_seat SET status = 'HELD', booking_id = :me WHERE show_id = 42 AND seat_id = 8;
```

Both requests run the `SELECT` before either runs the `UPDATE`. Both see `AVAILABLE`. Both write. The second
write silently overwrites the first, and both fans are told "your seat is held". This is a **check-then-act**
race (also called time-of-check to time-of-use): the fact you checked was no longer true when you acted on it.

The fix in every approach below is the same idea: **make the check and the write one atomic step**, so that
exactly one request can win.

### Approach 1: a conditional update (compare-and-set in SQL)

Put the condition inside the `UPDATE` itself and count how many rows changed:

```sql
BEGIN;
UPDATE show_seat
SET    status = 'HELD', booking_id = :booking_id,
       hold_expires_at = now() + interval '10 minutes'
WHERE  show_id = 42
  AND  seat_id IN (7, 8)
  AND  (status = 'AVAILABLE'
        OR (status = 'HELD' AND hold_expires_at < now()));   -- an expired hold counts as free
-- rows affected must equal 2; otherwise ROLLBACK and answer 409
COMMIT;
```

[![Sequence: Asha and Ravi both ask to hold seat A8; the booking service sends two conditional UPDATEs; row locks make them take turns, Asha's changes 2 rows and wins, Ravi's changes only 1 of 2 and is rolled back, so Ravi gets 409 and A9 stays available](/img/system-design/ticket-booking/02-seat-hold.png)](/img/system-design/ticket-booking/02-seat-hold.png)

*Select the diagram to zoom in and move around.*

Why this is safe: an `UPDATE` takes a **row lock** on each row it changes. Ravi's update reaches row A8, finds
Asha's transaction holding the lock, and waits. When Asha commits, both PostgreSQL (at its default `READ
COMMITTED` level) and MySQL (InnoDB) re-check Ravi's `WHERE` clause against the **newly committed** row, see `HELD`, and skip it. Ravi's statement changes 1
row instead of 2, so the application rolls back, which also frees A9. No double booking, no extra round trip,
no separate lock service.

Two practical details:

- **All or nothing.** A fan wants A7 and A8 together, not one of them. Checking "rows affected = number of
  seats" inside one transaction gives exactly that.
- **Lock in a fixed order.** If Asha locks A7 then A8 while Ravi locks A8 then A7, each can hold one row and wait
  for the other: a **deadlock**. The database detects it and aborts one (the application retries it), but it is
  cleaner to always lock seats sorted by `seat_id`. A single `UPDATE` usually visits rows in index order, but
  that is not guaranteed; to be certain, lock first with `SELECT ... ORDER BY seat_id FOR UPDATE`.

A variation is **optimistic concurrency** with a `version` column: read the row with its version, then
`UPDATE ... WHERE version = :v_read`. Same principle: the write only succeeds if nothing changed since you read.

### Approach 2: a unique constraint

Let the database's uniqueness guarantee do the work. Keep a separate table of claims:

```sql
CREATE TABLE seat_claim (
  show_id    bigint,
  seat_id    bigint,
  booking_id bigint      NOT NULL,
  expires_at timestamptz,               -- NULL once the booking is confirmed
  PRIMARY KEY (show_id, seat_id)        -- at most one claim per seat per show
);

INSERT INTO seat_claim (show_id, seat_id, booking_id, expires_at)
VALUES (42, 7, :b, now() + interval '10 minutes'),
       (42, 8, :b, now() + interval '10 minutes');
-- a second INSERT for (42, 8) fails with a duplicate-key error: someone else has it
```

Why this is safe: the primary key index can hold only one row per `(show_id, seat_id)`, and the database
enforces that even when two inserts arrive in the same millisecond. The loser gets an error instead of a silent
overwrite. The catch is **expiry**: an expired claim is still a row, so before inserting we delete expired
claims for those seats in the same transaction, and a background sweeper removes the rest.

### Approach 3: Redis with atomic set-if-absent and an expiry

For very hot shows we may want holds out of the database entirely:

```text
SET hold:42:A8 booking-91 NX EX 600
```

`NX` means "only set if the key does not exist" and `EX 600` means "delete it after 600 seconds". Redis runs
commands one at a time, so of two simultaneous `SET ... NX` calls exactly one succeeds. The expiry is
automatic: no sweeper needed. To hold several seats at once, run the checks and sets inside one **Lua script**,
which Redis also executes atomically, so you never end up holding A7 but not A8. Releasing early (payment failed)
must also be a script that deletes the key **only if it still holds your booking ID**; a plain `DEL` arriving
after your hold expired would delete someone else's hold.

Redis is fast, but on its own it is **not a safe source of truth**. Its replication is asynchronous, so if the
primary fails right after granting a hold, the new primary may not know about it and can grant the same seat
again. The usual design: Redis absorbs the stampede of hold attempts, and the **final confirm** is still a
conditional update in the inventory database (`BOOKED` only if the seat is not already `BOOKED`). Redis is the
bouncer; the database is the ledger.

### Which to choose

| Approach | Strength | Weakness | Use when |
| --- | --- | --- | --- |
| Conditional `UPDATE` | One statement, no extra system, holds and bookings in one place | All writes for a show hit one database primary | The default for almost everything |
| Unique constraint | Very hard to get wrong; works for general-admission claims too | Needs cleanup of expired rows | Teams that prefer inserts to updates |
| Redis `SET NX EX` | Very high write rate, automatic expiry | Can lose holds on failover, so still needs a database check at confirm | Extreme on-sales, as a front filter |

**Releasing holds.** A hold must disappear when its timer runs out, even if the fan just closes the app. With
approach 1, an expired hold is already treated as free by the `WHERE` clause (**lazy expiry**), and a sweeper
job flips stale `HELD` rows back to `AVAILABLE` every few seconds so the seat map shows them again.

## 8. Deep dive: the booking saga (hold, pay, confirm)

A booking touches two systems we cannot put in one database transaction: our inventory and an external payment
provider. The standard pattern is a **saga**: a sequence of local steps, each with a **compensating action** that
undoes it if a later step fails.

| Step | Action | Compensation if a later step fails |
| --- | --- | --- |
| 1. Hold | Conditional update: seats `HELD`, booking `HELD` with an expiry | Release the seats (or let the hold expire) |
| 2. Pay | Payment provider charges the fan | Refund |
| 3. Confirm | Seats `BOOKED`, booking `CONFIRMED`, outbox event | (final step) |

[![Booking saga sequence: the app asks to hold A7 and A8 with an idempotency key; the booking service makes a conditional update and a booking row B91 held until 10:05; it creates a payment with key B91 at the provider; the fan pays ₹500 on the provider page; the provider's webhook says P77 succeeded; the booking service marks the seats BOOKED if still held by B91 in one transaction with the outbox row, publishes BookingConfirmed and returns the QR ticket](/img/system-design/ticket-booking/03-booking-saga.png)](/img/system-design/ticket-booking/03-booking-saga.png)

*Select the diagram to zoom in and move around.*

The confirm step is itself a conditional update, guarded by the hold:

```sql
BEGIN;
UPDATE show_seat SET status = 'BOOKED', hold_expires_at = NULL
WHERE  show_id = 42 AND booking_id = :b AND status = 'HELD';      -- must change 2 rows
UPDATE booking   SET status = 'CONFIRMED' WHERE id = :b AND status IN ('HELD', 'PAYMENT_PENDING');  -- must change 1 row
INSERT INTO outbox (topic, payload) VALUES ('BookingConfirmed', :json);
COMMIT;
```

If either count is short (a seat was lost after the hold expired, or the sweeper already marked the booking
`EXPIRED`), the transaction rolls back and the saga refunds. The **outbox** row is written in the same transaction
as the booking, and a relay publishes it to the event bus
afterwards. That way "booking confirmed" and "event sent" can never disagree: either both happened or neither.

[![Booking states: HELD to PAYMENT_PENDING to CONFIRMED to CHECKED_IN; HELD expires when the timer fires, PAYMENT_PENDING expires when the timer fires and the provider says unpaid or fails when declined; an expired booking whose late payment arrives is REFUNDED; a confirmed booking can be CANCELLED and then REFUNDED](/img/system-design/ticket-booking/04-booking-states.png)](/img/system-design/ticket-booking/04-booking-states.png)

*Select the diagram to zoom in and move around.*

The tricky cases are all about **time**:

- **The fan never pays.** The hold expires, the sweeper releases the seats, the booking becomes `EXPIRED`.
- **The payment is declined.** The webhook says "failed"; we release the seats at once (no need to wait for the
  timer) and the booking becomes `FAILED`.
- **The fan pays at 10:04:58 but the webhook arrives at 10:05:30.** The hold has expired and someone else may
  already hold the seats. Two defences: give the hold a short **grace period** once payment has started
  (when the fan starts paying, the booking moves to `PAYMENT_PENDING` and the seats' `hold_expires_at` is pushed
  back a few minutes), and if the confirm
  still finds the seats gone, **refund automatically** and apologise. A late refund is annoying; a double-sold
  seat is a disaster.
- **The webhook never arrives.** A reconciliation job asks the provider about every booking stuck in
  `PAYMENT_PENDING` for more than a few minutes and finishes the saga either way.

### Idempotency with the payment provider

Networks fail in the worst places: the provider charged the card but our request timed out before we saw the
answer. If we simply retried we might charge twice. So:

- Every call to the provider carries an **idempotency key** (here the booking ID, `B91`). The provider
  remembers the key and returns the original result for a repeat, instead of charging again.
- Webhooks can arrive **twice** (providers retry until we answer 200). The confirm step is naturally
  idempotent: the second time, the booking is already `CONFIRMED`, the `UPDATE` changes 0 rows, and we just
  answer 200.
- Our own API is idempotent too: the `Idempotency-Key` on `POST /holds` maps to one booking, so a double tap
  does not hold four seats.

The payment side is a full system of its own (ledgers, captures, refunds, reconciliation with banks). See
[Design a payment system](/system-design/case-studies/medium/payment-system/) for how it works inside.

## 9. Deep dive: the hot-show problem

On a normal evening the design above is plenty. Now a global pop star announces a tour, and at 10:00 on
Saturday 3 million fans press **Buy** for 100,000 seats. Without protection, three things happen at once: the
origin servers drown in connections, the inventory database spends its time on lock queues for the same few
thousand seats, and bots with hundreds of accounts grab the best seats to resell. High-profile on-sales where
demand overwhelmed the ticketing site (the 2022 Taylor Swift Eras Tour presale on Ticketmaster is the best-known
example) show that this is a real design problem, not a thought experiment.

The answer is to **stop treating the crowd as traffic and start treating it as a queue.**

### Virtual waiting room

[![Waiting room flow: the fan opens the sale page minutes before 10:00, enters the waiting room which gives a random order at 10:00, gets a queue position while N fans per second are admitted, receives a signed admission token valid for 15 minutes, then uses the seat map and hold with the gateway checking the token, and pays; bots failing checks are blocked, the queue is told early when inventory is gone, and requests without a valid token are rejected](/img/system-design/ticket-booking/05-waiting-room.png)](/img/system-design/ticket-booking/05-waiting-room.png)

*Select the diagram to zoom in and move around.*

1. **Before the sale**, fans land on a static waiting page served entirely by the CDN. Nothing reaches our
   servers except a cheap "join" call.
2. **At 10:00**, everyone already waiting is given a **random** position. Randomising the early arrivals stops a
   race to refresh at 09:59:59.999 and removes the advantage of a bot that clicks faster. Later arrivals join at
   the back.
3. **An admission controller** lets people in at a fixed rate, for example 80 per second, chosen so that the
   number of shoppers inside stays near what the booking system has been load-tested for (section 3).
4. **The admitted fan gets an admission token**: a small signed message (for example a JWT, a JSON Web Token)
   that says `{user: 123, show: 42, expires: 10:21}`, signed with our secret key. The API gateway checks the
   signature on every request, which needs no database lookup, and refuses booking calls without a valid token.
   One token per account, valid for 15 minutes, so a token cannot be shared or stockpiled.
5. **When inventory runs out**, the waiting room says so immediately instead of letting people wait an hour for
   nothing. It can also show "about 40,000 people ahead of you" to set expectations.

The queue itself is simple: a counter of "admitted up to position N" in a replicated store, which every
waiting browser polls through the CDN. The waiting room is deliberately **dumb and cacheable**, because it
carries 200,000 requests per second.

### Rate limiting and bot defence

Even inside the room, protect the booking system:

- **Rate limits** per account, per device and per IP address (for example 10 hold attempts a minute), enforced
  at the gateway with a token bucket. See [Design a rate limiter](/system-design/case-studies/medium/rate-limiter/).
- **Purchase limits** per account and per payment card for the event (for example 4 tickets), enforced in the
  booking service at hold time.
- **Bot checks** at the waiting-room door: CAPTCHA, device and browser signals, account age, phone
  verification. Some platforms go further and ask fans to **pre-register**, then invite a vetted subset;
  Ticketmaster's "Verified Fan" programme is a public example of this.
- **Identity-bound tickets**: tie the ticket to the account so mass resale is harder (see section 11).

### Isolating the hot show

- **Its own shard.** All seats of a show live on one inventory shard (sharding by `show_id`). For a mega event,
  give that shard dedicated hardware so a stadium sale cannot slow down cinema bookings in another city.
- **Pre-warm everything.** Create every `show_seat` row, fill the seat status cache and scale the services
  **before** 10:00. Autoscaling that reacts after the spike arrives is too late.
- **Shrink contention.** Offer "best available" seats (the system picks a block in a chosen section) alongside a
  free seat map. Picking is spread across seats instead of everyone tapping row A.
- **General admission counters.** A 20,000-person standing area is not seats but a count. A single row
  `UPDATE ga SET sold = sold + 4 WHERE id = 1 AND sold + 4 <= capacity` is correct but becomes one hot row that
  every buyer queues on. Split the capacity into, say, 20 **buckets** of 1,000 and let each buyer try a random
  bucket (moving on to another if it is full), or keep the count in Redis with an atomic decrement and confirm in the database.

## 10. Low-level design: the data model

[![Data model: the catalogue has event, venue and seat; the inventory has show (pointing to event and venue) and show_seat, keyed by show_id and seat_id with price tier, price, status, booking_id and hold expiry; bookings have booking (pointing to show, with a unique idempotency key), payment and ticket, each pointing to booking](/img/system-design/ticket-booking/06-data-model.png)](/img/system-design/ticket-booking/06-data-model.png)

*Select the diagram to zoom in and move around.*

Design decisions hiding in this diagram:

**1. `show_seat` is the unit of sale.** The `seat` table describes the physical chair once (row F, number 12,
section Gold). `show_seat` has one row per seat per show, created when the show is published. Its primary key
`(show_id, seat_id)` makes "all seats of show 42" one range scan and makes a seat for a show unique by
construction.

**2. Shard by `show_id`.** Every hold and confirm touches one show, so with this key every transaction stays on
one shard. The `booking` row lives on the same shard as its show for the same reason. "My bookings" (by
`user_id`) is served from a separate index, updated asynchronously from booking events.

**3. Status and hold in the same row.** `status`, `booking_id` and `hold_expires_at` sit on `show_seat`, so a
single conditional `UPDATE` can claim, check and expire in one place (section 7). An index on
`(status, hold_expires_at)` lets the sweeper find expired holds on its shard quickly, without scanning every show.

**4. Money is stored as exact decimals** (`numeric`), never floating point, and the price is **copied** into
`show_seat` and the booking at hold time. If the organiser changes prices later, existing bookings keep the price
the fan agreed to.

**5. Unique keys guard retries.** `booking.idempotency_key` and `payment.idempotency_key` are unique, so a
duplicate request hits a constraint instead of creating a second booking or charge. `ticket.code` is unique so a
QR code identifies exactly one ticket.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Shows, show seats, bookings, payments | Rows that need transactions and row locks | PostgreSQL / MySQL, sharded by `show_id` | Conditional updates, unique constraints, ACID |
| Events, venues, layouts | Read-mostly documents | Relational DB or document store + CDN | Rarely written, cached everywhere |
| Search ("comedy in Pune this weekend") | Full text + filters | Elasticsearch / OpenSearch | Fed asynchronously from catalogue changes |
| Live seat status | Small bitmap per show, many reads | Redis | Thousands of reads per second per hot show |
| Waiting-room state, rate limits | Counters with expiry | Redis | Fast, and fine to lose a little |
| Events between services | Ordered, durable stream | Kafka | Outbox relay, replay, fan-out to workers |

## 11. Pricing, cancellations, notifications and entry

### Pricing tiers and dynamic pricing

A **price tier** is a group of seats sold at one price: recliner, gold, silver in a cinema; floor, lower bowl,
upper tier in a stadium. The organiser sets tiers per show, and `show_seat.price_tier` and `price` record them.
Other price factors (weekend, morning show, convenience fee, taxes) are rules applied by a **pricing service**
when the seat map and the hold are produced.

**Dynamic pricing** changes prices with demand, like airline fares: as seats sell faster than expected, the
price of the remaining ones rises. Ticketmaster, for example, publicly sells some concert seats at
demand-based prices. At a high level the pricing service watches signals (sell-through rate, time left before
the show, queue length) and updates tier prices within limits the organiser sets. The one hard rule: **the
price is fixed at hold time.** The hold stores a quote, and the fan pays that quote even if the price moves
while they type their card number.

### Cancellations

A cancellation is a small saga in reverse. In one transaction: check the policy (for example, not within 2
hours of the show), mark the booking `CANCELLED`, put its seats back to `AVAILABLE`, invalidate the tickets and
write an outbox event. Then the payment service issues the refund with its own idempotency key
(`refund:B91`), so a retried cancel never refunds twice. The released seats appear on the seat map within
seconds and can be sold again. For a show the organiser cancels, the same steps run in bulk from a job.

### Notifications and e-tickets

Nothing the fan receives after paying is on the critical path. The `BookingConfirmed` event goes to the bus,
and workers:

- generate the e-ticket: a QR code, plus a PDF and a mobile wallet pass;
- send email, SMS and push (retries, templates, provider fail-over: see
  [Design a notification service](/system-design/case-studies/medium/notification-service/));
- schedule reminders ("your show starts in 2 hours") and feed analytics.

If the email provider is down, the booking is still confirmed and the ticket is in the app. That is the point of
doing it asynchronously.

### QR tickets at the venue

What is inside the QR code? Not just a random number, but a **signed** message:
`{ticket: T123, show: 42, seat: A7}` plus a digital signature made with our private key. Scanners hold the
matching public key, so they can tell a genuine ticket from a forged one **without any network**.

[![Gate scan sequence: the phone shows a QR with ticket T123, show 42 and a signature that the scanner checks offline; the scanner asks the check-in service to check in T123, which sets checked_in_at only if it is null, gets 1 row changed and answers green; the same QR scanned again changes 0 rows and is answered red, already used at 18:42](/img/system-design/ticket-booking/07-ticket-scan.png)](/img/system-design/ticket-booking/07-ticket-scan.png)

*Select the diagram to zoom in and move around.*

The signature proves the ticket is **real**; it cannot prove it has **not been used**. A screenshot shared with
a friend is a perfectly valid signature. So check-in is, once again, a conditional update:

```sql
UPDATE ticket SET checked_in_at = now()
WHERE  code = :code AND checked_in_at IS NULL;    -- 1 row: admit. 0 rows: already used.
```

Venue networks are unreliable (a stadium full of phones), so scanners download the list of valid tickets for
the show before doors open and can work **offline**, recording scans locally and syncing them. With several
offline gates, a screenshot could get in twice; the usual mitigations are syncing scans between gates on the
venue's local network whenever possible, and **rotating codes**: the app shows a QR that changes every few
seconds (derived from a secret stored in the app, similar to an authenticator app), so a screenshot goes stale
almost at once. Ticketmaster's SafeTix is a public example of a rotating ticket barcode.

## 12. What breaks as it grows, and how to fix it

**The stampede.** Millions arrive at once. *Fix:* the waiting room on the CDN, admission tokens checked at the
gateway, and a fixed admission rate based on load tests, not hope.

**The hot row.** Everyone wants row A, or one general-admission counter. *Fix:* "best available" allocation,
seats locked in a fixed order, counters split into buckets, and Redis in front for the extreme case.

**The hot shard.** A mega event shares a shard with a thousand cinema shows. *Fix:* move that show to a
dedicated shard before the on-sale; the shard directory makes this a config change.

**Zombie holds.** The sweeper falls behind and seats look held long after their owners left. *Fix:* lazy expiry
in the `WHERE` clause means correctness never depends on the sweeper; the sweeper only keeps the seat map tidy,
and it is scaled per shard.

**Payment provider slowdown.** Payment calls back up and holds expire while fans are paying. *Fix:* a grace
period for bookings in `PAYMENT_PENDING`, a second provider to fail over to, and reconciliation that finishes
every stuck saga.

**The cache lie.** The seat map says "free" for seats that are long gone, so fans hit endless `409`s. *Fix:*
watch the lag of the status consumer; when it grows, shorten the cache TTL or fall back to reading a replica.

## 13. Reliability: how we never double-book or lose a booking

| Risk | Defence |
| --- | --- |
| Two buyers claim the same seat | Atomic conditional update or unique key in the source-of-truth DB; Redis only as a front filter |
| Charged but no ticket | Saga with idempotent confirm, webhook retries, reconciliation job, automatic refund if the seats are gone |
| Charged twice | Idempotency keys on our API and on every provider call; unique `payment.idempotency_key` |
| Confirmed but no email | Outbox in the same transaction; workers retry from the event bus |
| Inventory DB primary fails | Synchronous replica in another zone and automatic fail-over; holds in flight fail cleanly and fans retry |
| Redis fails | Seat maps fall back to the DB replica (slower); holds fall back to the conditional update path |
| Venue loses internet | Offline scanners with signed QR codes and a pre-downloaded ticket list |

The pattern to remember: **one atomic write decides, everything else follows from events and can be retried.**

## 14. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Seat map freshness | Strongly consistent | Cached, seconds stale | **Cached**: the hold is the real check; the map is a hint |
| Where holds live | Database row | Redis key with TTL | **Database** by default; Redis in front only for extreme on-sales |
| Hold length | Short (5 min) | Long (15 min) | **About 10 min** plus a payment grace period: long enough to pay, short enough not to starve others |
| Payment flow | Two-phase commit with the provider | Saga with compensation | **Saga**: external providers do not join our transactions |
| On-sale fairness | First come, first served | Randomised waiting room | **Randomised start**, then first come first served: removes the refresh race |
| Shard key | `user_id` | `show_id` | **`show_id`**: every contended write stays on one shard |
| Gate checks | Always online | Signed codes, offline capable | **Offline capable**: the venue network is the least reliable part |

## Cheat sheet for last-minute revision

- **Entities:** event → show (event + venue hall + time) → `show_seat` (one row per seat per show, the unit
  of sale) → booking → payment and ticket.
- **Reads vs writes:** ~500 page views per booking. Layout on the CDN, live status as a small Redis bitmap per
  show, updated from change events. The seat map is a hint, not a promise.
- **No double booking:** never check-then-write. Use `UPDATE ... WHERE status = 'AVAILABLE'` and count rows,
  or a unique key on `(show_id, seat_id)`, or Redis `SET NX EX` with a database check at confirm. Lock seats
  in sorted order.
- **Holds:** about 10 minutes, lazy expiry in the `WHERE` clause plus a sweeper to tidy the map.
- **Saga:** hold → pay → confirm, with compensation (release seats, refund). Confirm = seats `BOOKED` + booking
  `CONFIRMED` + outbox row in one transaction. Handle late webhooks with a grace period and auto-refund.
- **Idempotency:** keys on our API, on every provider call, and an idempotent webhook handler.
- **Hot show:** CDN waiting room, randomised start, admit N per second, signed admission tokens checked at the
  gateway, rate limits, purchase limits, bot checks, dedicated shard, pre-warmed caches.
- **Numbers (on-sale):** 3M fans, 100k seats; 200k status polls/s at the edge; ~80 admissions/s; ~250 hold
  writes/s. The crowd is huge, the writes are tiny.
- **Entry:** signed QR (proves real) + `checked_in_at IS NULL` update (proves unused); offline scanners;
  rotating codes against screenshots.

## Practice questions

1. **A fan says they were charged but got no ticket. How would you investigate and fix it?** Find the booking
   by payment reference. Check its state history: was it stuck in `PAYMENT_PENDING` (webhook lost;
   reconciliation should have caught it), or `EXPIRED` before the payment arrived (late payment; an automatic
   refund should have been issued)? The systemic fix is the reconciliation job that queries the provider for
   every stuck booking and either confirms or refunds, plus alerts on its backlog.
2. **How would you let a group of friends each pay for their own seat in a block of six?** Hold all six seats
   under one "group booking" with a longer timer, then create six payment requests, one per friend. Confirm
   the whole block only when all have paid; if the timer expires first, refund the ones who paid and release
   the seats. It is the same saga with several payments as one step, and the hard question is what happens
   when only five pay.
3. **Why not simply use SELECT ... FOR UPDATE?** It also works: it locks the rows on read, so the second buyer
   waits until the first commits and then sees `HELD`. It costs an extra round trip and holds locks while the
   application thinks, which hurts under heavy contention. The single conditional `UPDATE` does the check and
   the write in one statement and holds locks for the shortest possible time. Never hold a database lock while
   waiting for the user or the payment provider; that is what the `HELD` status with an expiry is for.
4. **How would you design "notify me if seats free up" for a sold-out show?** Store subscriptions per show.
   When a cancellation or expired hold releases seats, the inventory change event triggers a worker that
   notifies a batch of subscribers, perhaps first-come-first-served and a few at a time, so that 50,000 people
   do not stampede for 2 seats. For very popular shows this becomes a small waiting room of its own.
5. **How would you support a resale marketplace where fans resell tickets at face value?** The seller lists a
   ticket; a buyer pays; in one transaction the old ticket code is invalidated and a new one is issued to the
   buyer, and the seller is paid out after the event or after the buyer checks in. Because the platform
   reissues the code, a seller cannot sell a screenshot and then use the ticket themselves.
