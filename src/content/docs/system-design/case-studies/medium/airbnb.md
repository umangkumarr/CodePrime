---
title: "Design Airbnb (a lodging marketplace)"
description: "Design an Airbnb-style marketplace: search by place and dates, per-night calendars, booking without double-booking, payments, payouts, reviews and iCal sync."
difficulty: "Medium"
sidebar:
  label: "Airbnb (lodging marketplace)"
tags: ["Marketplace", "Search", "Geospatial", "Transactions", "Payments"]
---

Airbnb looks like a catalogue of homes with a "Reserve" button. Underneath, it is a **two-sided marketplace**:
hosts list places to stay, guests search for them, and the platform sits in the middle. It has to be a
**map-aware search engine** that knows which homes are free on which nights, a **booking system** that never
sells the same night twice, a **payment system** that takes the guest's money now and pays the host later,
and a **trust system** of reviews and messages that lets strangers sleep in each other's homes.

This case study builds that system from the ground up. We start with the vocabulary, design the service layer
by layer, go deep on the parts interviewers push on (availability and double-booking), and finish with what
breaks as it grows and a one-page revision sheet.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. A lodging marketplace in 5 minutes

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Host** | A person (or company) who offers a place to stay | The landlord |
| **Guest** | A person who books a stay | The traveller |
| **Listing** | One bookable place: a flat, a room, a cabin. It has a location, photos, rules, a capacity and prices | One advert in a holiday brochure |
| **Night** | The unit we sell. A stay from 3 June to 6 June is three nights: 3, 4 and 5 June. The check-out day is **not** a night | Hotel rooms are priced per night, not per day |
| **Calendar** | For each listing, the state of every future night: free, blocked by the host, held, or booked | The paper diary by the front desk |
| **Instant book** | The guest books and is confirmed immediately, without waiting for the host | Buying a train ticket |
| **Request to book** | The guest asks; the host has a time limit (24 hours on Airbnb) to accept or decline | Asking a landlord for a viewing |
| **Hold** | A short-lived reservation of nights while payment happens, released automatically if it does not complete | A shop keeping an item behind the counter for ten minutes |
| **Payout** | The money sent to the host, minus the platform's fee, some time after the guest checks in | A shop paying its supplier after the goods are sold |
| **iCal** | A standard text format (`.ics` files, RFC 5545) for sharing calendars. Hosts use it to keep calendars on several booking sites in step | Two diaries photocopied into each other every few hours |

Two facts from this vocabulary shape the whole design:

1. **The thing we sell is a listing-night, and each one is unique.** A shop with 500 identical T-shirts can sell
   any of them. A flat on 4 June exists exactly once. Two guests wanting the same night is a direct conflict,
   so "never sell it twice" is the central correctness rule.
2. **Guests search far more than they book.** Most people look at dozens of homes over days before booking one.
   The system is overwhelmingly read-heavy, but the rare write (a booking) must be perfectly correct.

## 2. Requirements

### Functional (what users can do)

- **Hosts** create and edit listings: description, photos, amenities, house rules, capacity, prices.
- **Hosts** manage the calendar: block nights, set per-night prices, set minimum stay, choose instant book or
  request to book.
- **Guests search** by place (a city, or the map area on screen), dates, number of guests, and filters (price
  range, type of place, amenities), and see results on a list and a map.
- **Guests view a listing page**: photos, details, reviews, the calendar, and the total price for their dates.
- **Guests book**: instant book, or send a request the host accepts or declines.
- **Payments**: charge the guest at booking, refund on cancellation according to the listing's policy, **pay the
  host after check-in**.
- **Reviews**: guest and host review each other, **only after a completed stay**.
- **Messaging** between a guest and a host, before and after booking.
- **Calendar sync** with other booking sites through iCal import and export.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **No double-booking** | Zero: a night is sold at most once, even under races | A family arriving at an occupied flat is the worst failure a marketplace can have |
| **Money correctness** | Never charge twice, never pay a host twice, every cent accounted for | Payments errors destroy trust and break the law |
| **Search latency** | Results in under ~500 ms | Search is the shop window; slow search loses guests |
| **Availability** | 99.95%+ for search and listing pages; booking must degrade safely (refuse rather than oversell) | Search down = no revenue; oversell = broken promises |
| **Freshness** | Search may be a few seconds stale; booking is always checked against the source of truth | Stale search is a small annoyance; a stale booking check is a double-booking |
| **Scale** | Millions of listings worldwide, many times more searches than bookings | Marketplace-sized |

The key idea is in the "Freshness" row: **search can be eventually consistent, booking must be strongly
consistent.** Much of the design follows from keeping those two worlds separate.

### Out of scope

Experiences and activities, host insurance and damage claims, identity verification, fraud detection, tax
calculation per country, and the customer-support tools. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to learn **which resources dominate**. These are assumptions for the
exercise, not Airbnb's real figures.

**Assumptions:** 8 million active listings. 100 million searches a day. 300 million listing-page views a day.
1 million reservations a day, averaging 4 nights. Calendars are open 2 years ahead (about 730 nights). Each
listing has about 25 photos.

**Traffic**

- Searches: $100\text{M} / 86{,}400 \approx$ **1,200 per second**, about **3,500 per second** at peak (3×).
- Listing pages: $300\text{M} / 86{,}400 \approx$ **3,500 per second** on average.
- Bookings: $1\text{M} / 86{,}400 \approx$ **12 per second**. Even at 10× peak, about 120 per second.
- Look-to-book ratio: $100\text{M} / 1\text{M} = 100$ searches per booking. **Reads dominate by two orders of
  magnitude.**

**Calendar storage**

- One row per listing-night: $8\text{M} \times 730 \approx 5.8\text{B}$ rows. At about 40 bytes each, that is
  roughly **230 GB**. Large, but easily handled by a sharded database.
- The same data as a **bitmap** (1 bit per night: free or not): $730 / 8 \approx 92$ bytes per listing, so
  $8\text{M} \times 92\text{ B} \approx$ **730 MB**. The availability of every listing on Earth fits in the
  memory of one machine. Remember this; it matters for search.

**Calendar change rate**

- Bookings change about $1\text{M} \times 4 = 4\text{M}$ nights a day. Add host edits, cancellations and iCal
  imports, and assume about **30 million night changes a day**, roughly **350 per second**. The search index
  must absorb this stream, which is modest.

**Photos**

- $8\text{M} \times 25 = 200\text{M}$ photos. Stored in several sizes (thumbnail to full screen), about 1 MB per
  photo in total, so about **200 TB**, served through a **CDN** (content delivery network: servers near users
  that cache images).

Three conclusions follow:

1. **Search is the scaling problem**, not booking. It must be cheap per query and served from a read-optimised
   index, not the booking database.
2. **Booking is the correctness problem.** Twelve writes a second is easy for one database; the hard part is
   making each one race-free.
3. **Availability is small enough to keep in memory** as bitmaps, which makes the hardest search filter cheap.

## 4. The API

Clients (web, iOS, Android) talk to us over HTTPS with a JSON API.

| Method and path | What it does |
| --- | --- |
| `GET /v1/search?place=Lisbon&check_in=2027-06-03&check_out=2027-06-06&guests=2&price_max=150&cursor=...` | Search. Instead of `place`, the client may send the map's bounding box `bbox=lat1,lng1,lat2,lng2`. Returns listings with a **total price for those dates** and a cursor for the next page. |
| `GET /v1/listings/{id}?check_in=...&check_out=...&guests=2` | The listing page: details, photos, review summary, and a **price quote** (nightly prices, fees, total) with a `quote_id`. |
| `GET /v1/listings/{id}/calendar?from=2027-06-01&to=2027-08-31` | Free and unavailable nights, for the date picker. |
| `POST /v1/reservations` | Book. Body: `listing_id`, `check_in`, `check_out`, `guests`, `quote_id`, payment method. Header: `Idempotency-Key`, so a retry never books twice. |
| `POST /v1/reservations/{id}/accept` and `/decline` | The host answers a request to book. |
| `POST /v1/reservations/{id}/cancel` | Cancel; the refund follows the listing's cancellation policy. |
| `PATCH /v1/listings/{id}/calendar` | Host blocks or unblocks nights, or sets prices: `{"nights": ["2027-06-10"], "status": "BLOCKED"}`. |
| `POST /v1/reservations/{id}/reviews` | Write a review. Allowed only after check-out, once per side. |
| `GET` / `POST /v1/threads/{id}/messages` | Read and send messages between guest and host. |
| `GET /v1/ical/{listing_id}/{secret_token}.ics` | The listing's calendar as an iCal feed, for other sites to import. |

Two details worth saying out loud in an interview:

- **Dates are half-open ranges** `[check_in, check_out)`: check-in is the first night, check-out is not a night.
  This makes back-to-back stays (one guest leaves on the 6th, the next arrives on the 6th) work naturally.
- **The quote** fixes the price the guest saw. Prices can change while the guest reads reviews; booking with a
  `quote_id` lets the server honour the price shown, or refuse clearly if the quote has expired.

## 5. High-level design

[![High-level architecture: guest and host apps reach an API gateway; search, listing, booking, payment and messaging services each own their store; the calendar and listing databases emit change events on an event bus that update the search index and feed async workers; a calendar sync worker polls other booking sites and blocks nights](/img/system-design/airbnb/01-architecture.png)](/img/system-design/airbnb/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **API gateway:** checks who you are (login tokens), applies rate limits, routes to the right service.
- **Search service:** turns "Lisbon, 3–6 June, 2 guests" into an index query, then ranks the matches.
- **Search index:** a read-optimised copy of every listing (location, filters, prices, free nights). Never the
  source of truth.
- **Listing service + Listing DB:** listing details, rules and photo references. Photos themselves sit in an
  **object store** (cheap storage for files, like S3) behind the CDN.
- **Booking service + Calendar and bookings DB:** the **source of truth** for which nights are free. All
  bookings, holds, host blocks and cancellations go through here.
- **Payment service + ledger:** talks to a **payment provider** (a company such as Stripe or Adyen that
  connects to card networks and banks) and records every money movement in a ledger.
- **Messaging service:** guest-host conversations.
- **Event bus** (for example Kafka): every change to listings and calendars is published as an event. The
  search indexer, the payout scheduler, review reminders and notifications all consume it.
- **Calendar sync:** imports and exports iCal feeds from other booking sites.

The single most useful idea in this design: **split the read world from the write world.** Searches hit a fast,
slightly stale index. Bookings hit the strongly consistent calendar database. Change events connect the two.

## 6. Flow 1: searching for a place to stay

A guest searches "Lisbon, 3–6 June, 2 guests, under 150 a night".

[![Search pipeline: the guest's query goes to the search service, which sends a map box and dates to the search index; the index returns about a thousand matches to the ranker, which orders them for the results page along with trip totals from the pricing service; separately, booked nights flow from the calendar DB through change events into the index](/img/system-design/airbnb/02-search.png)](/img/system-design/airbnb/02-search.png)

*Select the diagram to zoom in and move around.*

Step by step:

1. **Prepare.** The search service **geocodes** the place name (turns "Lisbon" into a map area) or takes the map
   box the user is looking at, and works out the list of nights: 3, 4 and 5 June.
2. **Filter by place.** Find listings inside the box. This needs a **geo index**, explained below.
3. **Filter by fit.** Keep listings that take 2 guests, cost under 150 a night, and match the chosen filters.
4. **Filter by availability.** Keep only listings where **every** one of the three nights is free, and where the
   stay obeys the listing's rules (for example, minimum 3 nights). This is the hard filter.
5. **Rank.** Order perhaps a thousand survivors with a ranking model, and return the top 20 for the page, plus
   pins for the map.
6. **Price.** Show the **total for the trip** (nightly prices, cleaning fee, service fee), not just a nightly
   rate, because per-night prices vary by date.

### Geo index: finding homes inside a map box

A normal database index sorts by one value. Location has two (latitude and longitude), and "inside this box" is
not a simple range on either. The common fixes:

- **Geohash:** cut the world into a grid, then cut each cell into smaller cells, and so on. Each cell gets a
  string, and nearby places share a prefix (`eyckq` is a small area of Lisbon; everything inside it starts with
  `eyckq`). "Inside this box" becomes "listings whose geohash starts with one of these few prefixes", which is
  a range lookup an ordinary index can do.
- **Quadtree or S2 cells:** the same idea with squares or spherical cells. S2 handles the curved Earth better.
- **A search engine's geo type** (for example the `geo_point` field in Elasticsearch or OpenSearch), which builds
  such a structure for you.

Listings barely move, so the geo part of the index is easy to keep fresh.

### Why availability is the hard part

Location, price and amenities change rarely. **Availability changes constantly** (about 350 nights a second in
our estimate), and it is a **range** question: "free on all of 3, 4 and 5 June". It also cannot be cached per
query, because every guest asks about different dates. Three ways to store availability in the search index:

| Option | How the query works | Trade-off |
| --- | --- | --- |
| **List of unavailable dates** per listing document | "None of 3, 4, 5 June is in `blocked_nights`" | Simple, works in any search engine; documents are re-indexed on every change |
| **Unavailable date ranges** | "No range overlaps `[3 June, 6 June)`" | Compact for long blocks; overlap queries are a little more complex |
| **Bitmap of 730 bits** per listing, in memory beside the index | Bitwise AND of the requested nights: all free? | Fastest and tiny (730 MB for everyone, see section 3); needs a custom filter |

A typical design keeps the geo and attribute filters in a search engine and applies availability as a
**bitmap filter**, either inside the engine as a plug-in or in an availability service the search service calls
with the candidate IDs.

The index is updated by the **change event stream**: when a night is booked, the calendar database emits
"listing 42, 4 June, booked", and the indexer updates that listing within seconds. So search is **eventually
consistent**: a listing booked a second ago may still appear. That is acceptable because **the booking flow
always re-checks the calendar database**. The worst case for the guest is "Sorry, these dates were just booked",
never a double-booking.

### Ranking, briefly

Matching gives a candidate set; **ranking** decides what the guest sees first, and most guests never scroll
far. Typical signals: the listing's quality (reviews, photos, cancellation history), how well it fits the
query (price relative to the area, distance to the centre of the search), the guest's own behaviour (what they
clicked and saved) and the chance the host accepts. Airbnb has written publicly about moving its search ranking
to machine-learned and deep-learning models. In an interview, describe a **two-stage** ranker: a cheap score to
cut thousands of candidates to a few hundred, then a heavier model on those few hundred.

### The listing page

The listing page is read-heavy and mostly static. Details and photos come from caches and the CDN. Only two
parts are dynamic and computed per request: the **calendar** (from the calendar DB, or a cache in front of it)
and the **price quote** for the chosen dates. Splitting the page this way lets the static part be cached for
minutes while the price stays exact.

## 7. Flow 2: booking without double-booking

The guest presses **Reserve** on a listing with instant book on.

[![Booking sequence: the guest app posts a reservation with an idempotency key; the booking service holds the three nights in the calendar DB, where a unique key on listing and night rejects a clash; the payment service authorises the card through the payment provider; the booking service then flips the nights from HELD to BOOKED, confirms to the guest and notifies the host asynchronously](/img/system-design/airbnb/04-booking.png)](/img/system-design/airbnb/04-booking.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Hold first, then pay.** Charging a card takes seconds and can fail. If we charged first and then found the
  nights gone, we would have to refund. If we checked availability, charged, and only then wrote the booking,
  two guests could both pass the check (a **race**). Holding the nights first, in one database transaction,
  makes the check and the claim a single step.
- **The hold expires.** If payment never finishes (the app crashes, the card is declined), the hold times out
  after about 10 minutes and the nights are free again. No guest can block a listing forever.
- **The idempotency key** protects against the classic mobile bug: the app sends, the network drops, the app
  retries. The booking service remembers the key and returns the first result, so the guest gets one
  reservation, not two.
- **The host hears about it asynchronously.** The booking is done when the database says BOOKED; notifying the
  host, emailing the guest and updating search all happen from the event stream.
- **For request to book**, step 8 is different: the reservation waits for the host (section 11).

## 8. Low-level design: the data model

[![Data model: a user hosts many listings; a listing has many listing_night rows keyed by listing and night; a reservation belongs to a listing and a guest and owns its nights; payments and one payout belong to a reservation; reviews belong to a reservation, at most one per author](/img/system-design/airbnb/03-data-model.png)](/img/system-design/airbnb/03-data-model.png)

*Select the diagram to zoom in and move around.*

Five design decisions hide in this diagram.

**1. One row per listing-night.** `listing_night` has the primary key `(listing_id, night)`. Its `status` is
`HELD`, `BOOKED` or `BLOCKED` (by the host, or `source = 'ical'` from another site). A night with **no row is
free**. This is the heart of the design, and section 9 explains why.

**2. The primary key is the double-booking guard.** Because `(listing_id, night)` is unique, the database itself
refuses a second row for the same night. Correctness does not depend on every piece of code remembering to
check.

**3. Reservations keep their dates; nights point back.** `reservation` stores `check_in` and `check_out` for
display and history; each `listing_night` row carries the `reservation_id` that owns it. Cancelling deletes
those rows and frees the nights in one transaction.

**4. Idempotency keys are unique columns.** `reservation.idempotency_key` and `payment.idempotency_key` are
unique, so a retried request collides with the first one instead of creating a duplicate.

**5. Reviews hang off reservations.** A review needs a `reservation_id`, and `(reservation_id, author_id)` is
unique: you can only review a stay you were part of, once. Fake reviews of places you never stayed at become
impossible by construction.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Calendar, reservations | Small rows, transactions across several nights | Relational DB (MySQL, PostgreSQL), **sharded by `listing_id`** | Unique constraints and multi-row transactions; one listing's nights live on one shard |
| Listings | Documents read far more than written | Relational or document DB, plus caches | Simple; heavy caching |
| Search | Geo + filters + full text + ranking features | Elasticsearch / OpenSearch (or a custom engine) + availability bitmaps | Built for this query shape; rebuilt from events |
| Payments ledger | Append-only money movements | Relational DB with strict transactions | Auditable; balances must always add up |
| Messages | Append-mostly threads | Wide-column store (Cassandra-style) or sharded SQL keyed by thread | Scales with volume; read by thread |
| Photos | Immutable files | Object store + CDN | Cheapest per byte, cached near users |
| Events | Ordered, durable stream | Kafka | Feeds the index, payouts, reviews and notifications |

Why shard the calendar by `listing_id`? **Every booking touches exactly one listing.** All nights of one stay
are then on one shard, so the hold is a single local transaction, never a distributed one.

## 9. Deep dive: storing the calendar

There are three natural ways to store "which nights are taken".

**Option A: a row per booking with a date range.** `reservation(listing_id, check_in, check_out)`. To book, check
"does any reservation overlap `[3 June, 6 June)`?" then insert. The check and the insert are two steps, so two
transactions can both see "no overlap" and both insert. You need a lock on the listing, a `SERIALIZABLE`
transaction, or a special **exclusion constraint** (PostgreSQL can enforce "no overlapping ranges" with a GiST
index). It works, but is easy to get wrong and ties you to one database's features.

**Option B: a row per listing-night (our choice).** Booking three nights inserts three rows. The unique key makes
the database reject any clash, with no extra locking. Per-night data has a natural home too: **per-night price**,
"blocked for cleaning", the iCal source. The cost is more rows (5.8 billion, which section 3 showed is fine) and
writing several rows per booking.

**Option C: a bitmap or array per listing.** A 730-bit availability string per listing, updated with a version
check. Very compact and fast to read, but it is hard to store per-night prices and owners in it. It is the right
shape for the **search index**, not for the source of truth.

A useful rule: **the source of truth is per-night rows; the search index holds a derived bitmap.**

The booking transaction for Option B, in SQL-like pseudo-code:

```sql
BEGIN;
INSERT INTO reservation (id, listing_id, guest_id, check_in, check_out, status, idempotency_key, hold_expires_at)
VALUES (:rid, 42, :guest, '2027-06-03', '2027-06-06', 'HELD', :key, now() + interval '10 minutes');

INSERT INTO listing_night (listing_id, night, status, reservation_id, price)
VALUES (42, '2027-06-03', 'HELD', :rid, 120),
       (42, '2027-06-04', 'HELD', :rid, 120),
       (42, '2027-06-05', 'HELD', :rid, 135);
-- a duplicate-key error on any night = someone else has it: ROLLBACK, tell the guest
COMMIT;
```

Either all three nights are claimed or none is. There is no window between "check" and "claim".

## 10. Deep dive: holds, timeouts and races

### Two guests, one night

Ana and Ben both press Reserve on listing 42 for 4 June at the same moment. Both transactions try to insert
`(42, '2027-06-04')`. The database lets exactly one commit; the other gets a duplicate-key error and rolls back
all its nights. Ben sees "These dates were just booked". No application code had to coordinate them.

### Expiring holds

A hold that is never paid must not block the listing. Two complementary mechanisms:

- **A sweeper job** runs every minute: find reservations with `status = 'HELD'` and `hold_expires_at < now()`,
  mark them `EXPIRED` and delete their `listing_night` rows, in one transaction per reservation.
- **Lazy expiry**: when an insert hits a duplicate key, check whether the existing row belongs to an expired
  hold; if so, delete it and retry. This frees nights immediately even if the sweeper is behind.

The payment must not complete **after** the hold expired. So "confirm" is a conditional update:
`UPDATE reservation SET status = 'CONFIRMED' WHERE id = :rid AND status = 'HELD'`. If it changes zero rows, the
hold was lost, and the payment is voided or refunded.

### Optimistic locking: the alternative

If availability were stored as one value per listing (Option C), you would use **optimistic locking**: read the
calendar with its `version`, change it in memory, and write it back with
`UPDATE ... SET bitmap = :new, version = version + 1 WHERE listing_id = 42 AND version = :old`. Zero rows updated
means someone else changed it first; re-read and retry. It works well when conflicts are rare (they are: two
people booking the same listing in the same second is unusual), but per-night rows with a unique key are simpler
to reason about.

### Why not a distributed lock?

A lock in Redis on "listing 42" would also serialise bookings, but now correctness depends on a second system:
if the lock expires while a slow transaction is still running, two bookings can both proceed. The database
constraint is the **last line of defence** either way, so it is simpler to make it the only one.

## 11. Deep dive: the reservation state machine

[![Reservation states: HELD moves to CONFIRMED on instant book once paid, or to AWAITING HOST for a request to book; the host's acceptance confirms it, while a decline or 24 hours without an answer, or a failed payment or expired hold, end in EXPIRED or DECLINED; CONFIRMED moves to IN STAY on check-in day and COMPLETED at check-out, or to CANCELLED with a refund per policy](/img/system-design/airbnb/05-booking-states.png)](/img/system-design/airbnb/05-booking-states.png)

*Select the diagram to zoom in and move around.*

A **state machine** lists every state a reservation can be in and the only allowed moves between them. Writing it
down prevents nonsense such as reviewing a stay that was cancelled, or paying out a booking that expired.

- **Instant book:** HELD → (payment succeeds) → CONFIRMED.
- **Request to book:** HELD → (card authorised) → AWAITING HOST → CONFIRMED if the host accepts, or
  DECLINED / EXPIRED if the host declines or does not answer in 24 hours. In our design the nights stay held
  while the host decides, so a second guest cannot book them meanwhile. The alternative, leaving the nights open
  until the host accepts, sells more but forces the host to decline requests that became impossible.
- **Card authorisation** reserves the money on the guest's card without taking it. We **capture** (actually take)
  the money when the reservation is confirmed, and **void** the authorisation if it is declined, so a declined
  guest is never charged.
- **CONFIRMED → IN STAY → COMPLETED** happen on dates, driven by a scheduler. COMPLETED unlocks reviews.
- **Cancellation** by the guest or the host moves CONFIRMED to CANCELLED. The refund amount depends on the
  listing's cancellation policy and how close to check-in it is.

Each move is a conditional update (`... WHERE status = 'AWAITING_HOST'`), so two moves cannot both win, and each
move emits an event that drives notifications, payouts and search.

## 12. Deep dive: payments and payouts

[![Money flow: the guest's card is charged the total through the payment provider; the funds are held and recorded in the ledger as owed to the host plus platform fees; after check-in the payout scheduler releases the host's share to the host's bank, fees become platform revenue, and a refund job returns money if the stay is cancelled](/img/system-design/airbnb/06-money.png)](/img/system-design/airbnb/06-money.png)

*Select the diagram to zoom in and move around.*

The platform collects the guest's money at booking but pays the host **later**. Airbnb, for example, typically
releases a payout about a day after the guest's scheduled check-in. This **escrow-like** flow protects both sides:
the guest knows the host is paid only if the stay actually starts, and the host knows the money was already
collected.

**The ledger.** Every money movement is written as a **double-entry** record: each entry debits one account and
credits another, so the totals always balance. When the guest pays 400, the ledger records 400 into "held for
reservation R", split later into "owed to host" (for example 388) and "platform fees" (the guest and host
service fees). The ledger is append-only: a mistake is corrected with a new entry, never by editing an old one.
That makes it auditable.

**The payout scheduler** reads confirmed reservations whose check-in has passed (from events or a query on
`payout.release_at`), and sends payouts through the payment provider or a bank transfer. Payouts are batched per
host and per day to cut fees.

**Idempotent payments.** Networks fail mid-request. If the payment service times out talking to the provider, did
the charge happen? Retrying blindly could charge twice. The fix:

- Every charge and every payout carries an **idempotency key** (the reservation ID plus the operation, for
  example `R123:capture`), stored in a unique column **before** the call.
- The same key is passed to the payment provider, which also deduplicates by it.
- A retry with the same key returns the original result instead of moving money again.
- A **reconciliation** job compares our ledger with the provider's reports every day and flags any mismatch.

Airbnb's engineering blog has described building an idempotency library for exactly this problem in its payments
system. The pattern is general: **at-least-once attempts + idempotent operations = effectively exactly once.**

**Refunds** on cancellation follow the policy and are new ledger entries plus a refund call to the provider, again
with an idempotency key.

## 13. Reviews, messaging and pricing

### Reviews only after a stay

- A review requires a reservation in state COMPLETED, and the unique key `(reservation_id, author_id)` allows one
  review per side.
- Airbnb gives both sides 14 days after check-out, and reveals the reviews when both have been written or the
  window closes. This **double-blind** rule stops one side from retaliating against the other's review. In our
  design: store reviews with `published_at = NULL`; publish both when the second arrives, or publish whatever exists
  when a scheduled job finds the window closed.
- Review summaries (average rating, count) are **precomputed** and stored on the listing, and pushed into the search
  index as a ranking signal. Nobody averages thousands of rows on each page view.

### Messaging, at a high level

Guest-host messaging is a simple chat: a **thread** per guest-listing pair, messages appended in order, stored in
a store keyed by `thread_id`. New messages are pushed to apps over WebSockets when open, and through Apple and
Google push services or email otherwise. Two marketplace-specific rules: messages are scanned for attempts to
take payment off the platform (a common scam), and contact details can be hidden until a booking is confirmed.

### Pricing suggestions

Hosts set a base price and can override individual nights. Many also accept **dynamic pricing suggestions**;
Airbnb's version is called Smart Pricing. At a high level, a model predicts the price at which each night is likely
to be booked, from signals such as the season, day of the week, local events, how far ahead the night is, demand in
the area (searches, bookings) and similar listings' prices. A daily batch job writes suggested prices into the
calendar within the host's minimum and maximum. Because prices are per night, they live naturally in the
`listing_night.price` column and in the quote.

## 14. Deep dive: calendar sync with other sites (iCal)

Many hosts list the same flat on several sites. If a guest books it elsewhere, our calendar must learn quickly, or
we will sell a night that is already gone. The common, simple standard for this is **iCal**: each site publishes a
listing's calendar as an `.ics` file at a secret URL, and imports the other sites' files.

[![iCal sync sequence: another site fetches our .ics feed and gets booked and blocked nights; our sync worker fetches the other site's feed every few hours, receives blocked date ranges, blocks new nights and frees removed ones in the calendar DB without touching nights booked on our site, and the change flows to the search index](/img/system-design/airbnb/07-ical-sync.png)](/img/system-design/airbnb/07-ical-sync.png)

*Select the diagram to zoom in and move around.*

- **Export** is easy: a read-only endpoint renders the listing's unavailable nights as iCal events. It is cached,
  because other sites poll it often.
- **Import** is polling: a scheduler puts each linked feed on a timer (every few hours; we cannot be told
  instantly, iCal has no push). The sync worker downloads the feed, sending `If-None-Match` so an unchanged feed
  costs almost nothing.
- **Diff, don't replace.** The worker compares the feed's events with the nights it imported last time. New
  ranges become `BLOCKED` rows with `source = 'ical'`; ranges that disappeared are freed. It **never touches nights
  booked on our site**.
- **The gap is real.** Between two polls, both sites may sell the same night. iCal reduces double-bookings but
  cannot prevent them. Sites that need real-time sync use **channel managers** (software that connects to each
  site's API and pushes changes instantly). In an interview, name the gap and how it is handled: shorter polling for
  busy listings, and a cancellation-and-rebooking process for the rare conflict.
- At our assumed scale (say 2 million listings with imported calendars, polled every 3 hours), that is
  $2\text{M} \times 8 = 16\text{M}$ fetches a day, about **185 per second**: a modest fleet of workers.

## 15. Reliability and failure handling

| Failure | What happens and how we handle it |
| --- | --- |
| The app retries a booking after a timeout | The `Idempotency-Key` matches the first reservation; the same result is returned |
| Payment succeeds but the booking service crashes before confirming | The payment row (with its idempotency key) exists; a recovery job finds HELD reservations with a successful payment and confirms them, or refunds if the hold was lost |
| Payment provider is down | Holds expire safely; no nights are lost; we show "try again" rather than confirming unpaid bookings |
| Search index lags or is down | Search shows slightly stale results, or falls back to a degraded mode; booking still checks the calendar DB, so nothing is oversold |
| A calendar shard fails | A replica is promoted; bookings for listings on that shard pause briefly. Search keeps working from its own copy |
| An event is processed twice | Consumers are idempotent: "set night 4 June of listing 42 to booked" applied twice is the same as once |
| The sweeper falls behind | Lazy expiry on insert frees expired holds anyway |

The pattern to remember: **the calendar database's unique key is the single guard against overselling**; every
other component may be stale, slow or retried, and the worst outcome is a polite "no longer available".

## 16. What breaks as it grows, and how to fix it

**Hot cities on hot dates.** New Year's Eve in a popular city, or a big festival: searches for one area and one set
of dates explode. *Fix:* shard the search index by region and add replicas for hot regions; cache result pages for
popular (place, dates) pairs for a few seconds.

**Hot listings.** A viral listing gets thousands of booking attempts for the same weekend. *Fix:* most attempts fail
fast on the unique key; a short per-listing queue or rate limit in the booking service smooths the burst so the
shard is not hammered.

**The index rebuild.** Re-indexing 8 million listings with new ranking features takes hours. *Fix:* build a new
index in the background from a snapshot plus the event log, then switch an alias atomically.

**Global users, one database.** Guests book across the world. *Fix:* shard by `listing_id` and place shards in the
region where the listing is (most writes for a listing come from one region's hosts and its calendar). Search
replicas can live in every region.

**Long calendars.** Two years ahead times millions of listings. *Fix:* only store rows for nights that are not free
(free is the default), and archive past nights into cold storage for history and analytics.

**Payout volume.** Millions of payouts a day in many currencies. *Fix:* batch per host per day, partition the
payout scheduler by host, and reconcile against providers daily.

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Calendar storage | Range per booking | Row per listing-night | **Per-night rows**: a unique key prevents overlap with no extra locking; holds per-night prices |
| Search consistency | Query the calendar DB live | Derived index, seconds stale | **Derived index**: 100× more searches than bookings; booking re-checks the truth |
| Availability in search | Date list in the document | In-memory bitmap | **Bitmap** for speed and size, once scale demands it; a date list is fine to start |
| Concurrency control | Distributed lock | Database constraint | **Constraint** (or optimistic locking): one system to trust |
| When to charge | At request | Authorise at request, capture on confirm | **Authorise, then capture**: a declined request costs the guest nothing |
| When to pay the host | At booking | After check-in | **After check-in**: protects guests; matches the escrow-like model |
| Request-to-book nights | Held while the host decides | Left open | **Held**: simpler for guests; costs the host some flexibility |
| Cross-site sync | iCal polling | Channel-manager APIs | **iCal** as the universal baseline; APIs for partners who support them |

## Cheat sheet for last-minute revision

- **What we sell:** listing-nights. Each exists once. Dates are half-open: `[check_in, check_out)`.
- **Two worlds:** search = eventually consistent derived index (geo + filters + availability); booking = strongly
  consistent calendar DB. Change events (CDC / outbox → Kafka) connect them.
- **Geo:** geohash / quadtree / S2 cells, or a search engine's geo type. Map box → a few cell prefixes.
- **Availability is the hard filter:** changes constantly, range query, per-user dates. Bitmap of 730 bits per
  listing = ~730 MB for 8M listings, fits in memory.
- **No double-booking:** `listing_night` with primary key `(listing_id, night)`; insert all nights in one
  transaction; duplicate key = taken. Shard by `listing_id` so it is a local transaction.
- **Holds:** HELD with `hold_expires_at` (~10 min); sweeper + lazy expiry; confirm is a conditional update.
- **State machine:** HELD → CONFIRMED (instant) or → AWAITING HOST → CONFIRMED / DECLINED / EXPIRED (24 h);
  CONFIRMED → IN STAY → COMPLETED, or → CANCELLED.
- **Money:** authorise, capture on confirm, ledger (double-entry, append-only), payout after check-in, idempotency
  keys everywhere, daily reconciliation.
- **Reviews:** only for COMPLETED stays, one per side, double-blind reveal.
- **iCal:** export a feed, poll others every few hours, diff not replace, never touch our own bookings; polling leaves
  a gap.
- **Numbers:** ~1,200 searches/s, ~12 bookings/s, 100:1 look-to-book, ~5.8B listing-night slots (~230 GB).

## Practice questions

1. **A guest says they were charged but have no booking. How would you investigate?** Look up the payment by its
   idempotency key and the reservation ID: was the reservation HELD then EXPIRED before confirmation? Check the
   recovery job's logs; it should either have confirmed (if the hold was still valid) or refunded. Then check the
   ledger and the provider's report for the same key.
2. **How would you support "flexible dates" (any weekend in June)?** Expand the request into a small set of date
   ranges, run the availability bitmap check for each (cheap bitwise operations), and show each listing with its best
   matching range. Cap the number of ranges to keep the query bounded.
3. **A host has the same flat on two sites and gets double-booked. What would you change?** Shorten the iCal poll
   interval for listings with frequent bookings, integrate with channel managers or partner APIs for push updates,
   and add a support flow that finds the guest an equivalent place.
4. **How would you add a "hotel" listing with 20 identical rooms?** The night is no longer unique. Store a
   **count** per (listing, night) with capacity, and book with a conditional update:
   `UPDATE ... SET booked = booked + 1 WHERE booked < capacity`. Zero rows updated means sold out.
5. **Why not just query the calendar database for search?** Searches outnumber bookings 100 to 1 and need geo and
   full-text queries the transactional DB is not built for. Running them there would slow down bookings, the one
   operation that must never fail. A derived index scales reads independently, and the booking re-check keeps
   correctness.
