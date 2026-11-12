---
title: "Design a Parking Garage System"
description: "Design a parking garage system: the object model, spot allocation without double booking, tickets, pricing, payments, reservations and offline gates."
difficulty: "Easy"
sidebar:
  label: "Parking garage"
tags: ["Object-oriented design", "Concurrency", "State machines", "Databases", "Payments"]
---

A parking garage looks like the simplest system in the world: a barrier goes up, you park, you pay, the
barrier goes up again. That simplicity is exactly why interviewers like it. In 45 minutes you can show that you
can model a real-world domain in clean classes, keep two cars out of the same spot when they arrive at the same
moment, take money correctly, and keep a physical gate working when the internet connection drops.

Interviewers ask this problem in two flavours. In a **low-level design** (LLD, or object-oriented design)
interview they want classes, relationships and states. In a **system design** interview they want the service:
many garages, an app, reservations, payments and availability. This case study does both, because the second
is built on the first.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one. In the interview itself,
ask early which flavour they want, then spend most of your time there.
:::

## 1. The garage in 5 minutes: vocabulary

Before designing anything, agree on the words. Every one of these becomes a class, a table or a component later.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Garage** (or lot, car park) | One building or site with entrances, exits and levels | A hotel |
| **Level** | One floor of the garage | A floor of the hotel |
| **Spot** (or bay) | One painted rectangle that holds one vehicle. Has a **type**: motorcycle, compact, large, EV charging, accessible | A room, with a room type |
| **Ticket** (or parking session) | The record of one visit: which car, which spot, when it came in, whether it paid | The key card and the bill |
| **Gate** | An entry or exit lane: a **boom barrier**, a camera, a ticket printer or card reader | The hotel's front door |
| **ANPR** (automatic number-plate recognition) | A camera plus software that reads the licence plate, so the plate can stand in for a paper ticket | A receptionist who recognises your face |
| **Gate controller** | A small computer on site that drives the gates and talks to the cloud | The night porter who keeps working when head office is closed |
| **Pay-on-foot kiosk** | A machine inside the garage where you pay before walking back to the car | Settling the bill before you check out |
| **Grace period** | Minutes allowed between paying and leaving (for example 15) | Late check-out |
| **Reservation** | A booking for a spot type, garage and time window, made in advance in the app | A room booking |

Two facts shape the whole design:

1. **The physical world does not wait.** A car at a barrier with a queue behind it needs an answer in about a
   second, network or no network. So decisions at the gate must be fast and must still work offline.
2. **A spot is a scarce resource that many actors compete for.** Two entry lanes, the app and an operator can
   all want the same spot at the same instant. The core correctness rule is **one spot, at most one car**.

## 2. Requirements

### Functional (what the system must do)

- **Enter:** a car arrives, the system picks a suitable free spot (or says the garage is full), records a
  ticket and opens the barrier.
- **Exit:** the system finds the ticket (paper ticket, QR code or plate), works out the price, takes payment
  (at the exit, at a kiosk, or in the app) and opens the barrier.
- **Spot types:** motorcycles, compact cars, large vehicles, EV charging and accessible spots, with rules about
  which vehicle may use which spot.
- **Pricing:** configurable per garage: for example free for the first 10 minutes, then 2.00 per started hour,
  capped at 20.00 per day, plus a lost-ticket fee.
- **Payments:** card, wallet or app; refunds; receipts.
- **Availability:** show free spots per type for every garage, on signs at the entrance and in the app.
- **Reservations:** book a spot type in a garage for a time window, cancel it, and be guaranteed a spot on
  arrival.
- **Operations:** mark spots out of service, change prices, see occupancy and revenue reports.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Correctness** | Never put two cars in one spot; never charge twice | Angry drivers, refunds, lost trust |
| **Gate latency** | Barrier decision in under 1 second | A queue forms behind every slow decision |
| **Gate availability** | Gates keep working with no internet | A garage that cannot let cars out is a safety and PR problem |
| **Availability of the service** | 99.9% for the app and APIs | People plan trips around it, but gates do not depend on it |
| **Freshness** | Free-spot counts in the app correct within a few seconds | A count that is a little stale is fine; a reservation is the real guarantee |
| **Security** | Card data never touches our servers; plate data kept only as long as needed | Payment card rules (PCI DSS) and privacy law |

### Out of scope

Parking enforcement on streets, valet parking, monthly subscriptions in depth, and the computer vision inside the
camera. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** an operator runs **2,000 garages** with **400 spots** each on average, so **800,000 spots**.
Each spot is used by about **3 cars a day**. About **10%** of visits are reserved in advance. **1 million** app
users each search for parking about **5 times** a day.

**Traffic**

- Visits: $800{,}000 \times 3 = 2.4\text{M}$ a day.
- Writes: each visit claims a spot, creates a ticket, records a payment and closes the ticket, so about 4 writes:
  $2.4\text{M} \times 4 \approx 10\text{M}$ a day, about **110 per second** on average and roughly **550 per
  second** at the morning peak (5× average).
- Availability searches: $1\text{M} \times 5 = 5\text{M}$ a day, about **60 per second**, maybe **600 per
  second** at a peak (10× average, for example before a concert).
- **Per garage it is tiny.** A 400-spot garage that fills from 30% to 95% in a two-hour morning rush admits
  $400 \times 0.65 = 260$ cars in 120 minutes, about **2 cars a minute**. One lane handles a car every 10–15
  seconds.

**Storage**

- Tickets and payments: about 0.5 KB per visit, so $2.4\text{M} \times 0.5\text{ KB} = 1.2\text{ GB}$ a day,
  roughly **440 GB a year**. Easy for one sharded relational database.
- Spots: 800,000 rows. Tiny.
- Plate photos (if kept as evidence): 2 photos × 100 KB × 2.4M visits = **480 GB a day**. They go in object
  storage with a short retention period (for example 30 days), both for cost and for privacy.

**What the numbers tell us:** this is not a big-data problem. Total traffic is modest, and the contention is
**local**: only cars at the same garage compete for the same spots. The hard parts are correctness (no double
allocation, no double charge) and resilience (gates that work offline). Design for those, not for raw scale.

## 4. Low-level design: the object model

Start the way you would in an LLD interview: nouns become classes, verbs become methods.

[![Class diagram: ParkingGarage is composed of Levels, each composed of ParkingSpots; the garage uses a SpotAllocator interface (implemented by NearestFirstAllocator) and a PricingPolicy interface (implemented by HourlyPricing); a Ticket holds a ParkingSpot, is for a Vehicle and has zero or more Payments](/img/system-design/parking-garage/01-class-model.png)](/img/system-design/parking-garage/01-class-model.png)

*Select the diagram to zoom in and move around.*

What each class is for:

- **`ParkingGarage`** is the entry point. `checkIn(vehicle)` returns a `Ticket`; `checkOut(ticket)` returns a
  `Payment`. It owns its levels (**composition**: a level cannot exist without its garage, shown by the filled
  diamond) and *uses* two pluggable policies.
- **`Level`** owns its spots and can list free spots of a given type.
- **`ParkingSpot`** knows its type and status. `tryHold(ticketId)` is the one method that must be safe when two
  gates call it at the same time (section 10).
- **`Vehicle`** carries a plate and a `VehicleType`. `fits(spotType)` answers "may this vehicle use that spot?".
- **`Ticket`** is one visit: vehicle, spot, entry time and a status that follows a state machine (section 5).
- **`Payment`** is one charge against a ticket: amount, method and status. A ticket usually has one, but can have
  more (a driver who overstays the grace period pays again for the extra time).
- **`SpotAllocator`** and **`PricingPolicy`** are interfaces. This is the **Strategy pattern**: the garage asks
  "which spot?" and "how much?" without knowing the rule. A city-centre garage can use nearest-first
  allocation and hourly pricing; an airport can use a long-stay allocator and daily pricing, with no change to
  `ParkingGarage`.

### Which vehicle fits which spot?

| Vehicle type | May use (in order of preference) |
| --- | --- |
| Motorcycle | Motorcycle, then compact, then large |
| Car | Compact, then large |
| Van or small truck | Large only |
| Electric car | EV charging (if the driver wants to charge), then like a car |
| Any vehicle with an accessibility permit | Accessible, then like its vehicle type |

The "in order of preference" column is itself an allocation rule: **smallest spot that fits first**, so large
spots stay free for the vehicles that need them. Accessible spots are never given to drivers without a permit,
even when everything else is full.

### Design choices interviewers like to probe

- **Enum or subclasses for vehicles?** `Car`, `Motorcycle` and `Truck` subclasses add nothing if they only differ
  in size. A `VehicleType` enum plus the fit table above is simpler and easier to extend. Use subclasses only
  when behaviour really differs.
- **Should `ParkingGarage` be a singleton?** Many textbook answers make it one. Prefer not: a real operator has
  thousands of garages, and singletons make testing harder. Create one instance per garage and pass it around.
- **Where does pricing live?** Outside the ticket, in `PricingPolicy`, as a **pure function** of entry time,
  exit time and the price plan. Pure functions are easy to test and give the same answer on the gate and in the
  cloud.
- **Money** is stored as an integer number of minor units (pence, cents, paise) plus a currency code, never as a
  floating-point number. `0.1 + 0.2` is not `0.3` in binary floating point.

### The check-in method

```java
public Ticket checkIn(Vehicle v) {
    while (true) {
        ParkingSpot spot = allocator.pick(levels, v);   // best free fitting spot, or null
        if (spot == null) throw new GarageFullException();
        String ticketId = ids.next();
        if (spot.tryHold(ticketId)) {                    // atomic: only one caller can win
            return new Ticket(ticketId, v, spot, clock.now());
        }
        // Lost the race: another gate took this spot between pick and hold. Pick again.
    }
}
```

The important line is `tryHold`. "Look for a free spot, then take it" is two steps, and another thread can take
the spot in between. That bug has a name, **check-then-act**, and section 10 is about defeating it.

## 5. Low-level design: states of a spot and a ticket

A **state machine** lists the states an object can be in and the only moves allowed between them. Writing it down
removes whole classes of bugs, such as "a car exited from a spot that was never occupied".

### The spot

[![Spot lifecycle: Available becomes Assigned when allocated atomically, Assigned becomes Occupied when a sensor sees the car, Occupied returns to Available when the car leaves; an Assigned hold that expires returns to Available; operators can move Available to Out of service and back](/img/system-design/parking-garage/02-spot-lifecycle.png)](/img/system-design/parking-garage/02-spot-lifecycle.png)

- **Available → Assigned** is the only move that needs protection against races: it must be atomic.
- **Assigned** exists because a car takes a minute or two to drive from the barrier to the spot. If the garage
  has bay sensors (a light above each spot, green or red), the sensor confirms **Occupied**. Without sensors,
  the system treats Assigned as Occupied.
- **Hold expires:** if the sensor never sees a car (the driver parked somewhere else), the hold times out and
  the spot returns to Available. Real drivers ignore assigned spots, so the sensors are the truth for counts.
- **Out of service** covers repairs, cones and spots blocked for an event. Only an operator moves a spot in or
  out of it.

### The ticket

[![Ticket lifecycle: Active becomes Paid when payment is captured, then Closed when the exit gate opens; if the grace period expires Paid returns to Active; an Active ticket can be reported lost and becomes Paid when the fee is paid; a car that leaves within 10 minutes is Cancelled with no charge](/img/system-design/parking-garage/03-ticket-lifecycle.png)](/img/system-design/parking-garage/03-ticket-lifecycle.png)

- **Paid → Active (grace expired):** you paid at the kiosk at 17:00, then chatted for 40 minutes. The grace period
  (15 minutes here) ran out, so the ticket is active again and the exit gate asks for the extra time.
- **Lost ticket:** with ANPR the plate finds the ticket, so a lost paper ticket costs nothing extra. Without a
  plate match, the garage charges a flat lost-ticket fee, usually the daily maximum.
- **Cancelled:** a driver who drives in and straight back out (garage full, wrong garage) within the free
  period pays nothing.

The **reservation** has a small state machine too: `Booked → CheckedIn → Completed`, with `Cancelled` (by the
driver, before the start) and `NoShow` (the driver did not arrive within, say, 30 minutes of the start).

In code, an enum with a table of allowed transitions is enough. The full **State pattern** (one class per state)
is worth it only when behaviour differs a lot per state.

## 6. The API

Two kinds of clients talk to the cloud: **gate controllers** at each garage, and the **driver app**. Both use
HTTPS with JSON; gate controllers authenticate with a per-device certificate (mutual TLS).

| Method and path | Who calls it | What it does |
| --- | --- | --- |
| `GET /v1/garages?lat=..&lng=..&radius=2km&type=COMPACT` | App | Nearby garages with free counts and prices |
| `POST /v1/reservations` | App | Book a spot type for a window. Body: garage, spot type, start, end, plate. `Idempotency-Key` header |
| `DELETE /v1/reservations/{id}` | App | Cancel a booking |
| `POST /v1/entries` | Gate | Car at entry: plate, gate, size class, gate event ID. Returns ticket and spot, or "full" |
| `GET /v1/tickets/{id}/quote` | Gate, kiosk, app | Amount due right now |
| `POST /v1/tickets/{id}/payments` | Gate, kiosk, app | Pay. `Idempotency-Key` header |
| `POST /v1/exits` | Gate | Car at exit: open or ask for payment |
| `PATCH /v1/spots/{id}` | Operator console | `{"status": "OUT_OF_SERVICE"}` |

An **idempotency key** is a unique ID the client sends with a request so that sending the same request twice has
the same effect as sending it once. Gate networks are flaky: the controller sends `POST /v1/entries`, the reply
is lost, and it retries. Without the key, the second request would allocate a second spot for the same car.
With it, the server sees "gate event `E1-88412` again" and returns the first answer.

## 7. High-level design

[![High-level architecture: inside each garage, the car meets gate hardware driven by an on-site gate controller with a local store; the controller syncs over mTLS to the API gateway, as does the driver app; behind the gateway sit payment, reservation and parking services; the parking service makes atomic updates in the Parking DB, sharded by garage, and publishes events to a stream that feeds the availability service and its count cache; the payment service charges through an external payment provider](/img/system-design/parking-garage/04-architecture.png)](/img/system-design/parking-garage/04-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Gate hardware:** camera (ANPR), ticket printer or QR reader, card reader, barrier, and the "Level 2, C14"
  display.
- **Gate controller:** a small on-site server (often a pair, for failover) that drives every lane of one garage.
  It calls the cloud when it can and decides locally when it cannot (section 12).
- **Local store:** the controller's own database: the garage's spot map, tickets for cars inside, the current
  price plan, upcoming reservations, and an **outbox** of events not yet sent to the cloud.
- **API gateway:** authentication, rate limits and routing.
- **Parking service:** the core. Tickets, spot allocation and pricing. Stateless, so any instance can serve any
  garage; the database provides the atomicity.
- **Reservation service:** bookings and capacity per time slot (section 11).
- **Payment service:** talks to the **payment provider** (a company such as a card acquirer or wallet that
  actually moves money). Card numbers go from the reader straight to the provider; we only see a **token**.
- **Parking DB:** a relational database (PostgreSQL or MySQL), **sharded by `garage_id`**: all of one garage's
  spots and tickets live on one shard, so every allocation is a single-shard transaction.
- **Event stream** (for example Kafka): every entry, exit, hold and status change is published here.
- **Availability service + count cache:** keeps "free spots per garage and type" in Redis for fast app searches.

The most useful idea in this picture: **the gate decision is local-first, and everything else is built from
events.** The barrier never waits for reports, counts or emails.

## 8. Low-level design: the data model

[![Data model: garage has levels, level has spots; garage issues tickets, a spot is parked in by many tickets over time, a ticket is paid by zero or more payments, a reservation is optionally used by one ticket; capacity_slot holds bookable and booked counts per garage, spot type and time slot](/img/system-design/parking-garage/05-data-model.png)](/img/system-design/parking-garage/05-data-model.png)

*Select the diagram to zoom in and move around.*

Decisions hidden in this diagram:

1. **`spot.status` and `spot.ticket_id` are the allocation.** The spot row says who holds it. Claiming a spot is
   one conditional update of that row (section 10).
2. **`spot.rank`** precomputes the allocator's preference (distance to the lift, level), so "best free spot" is
   an indexed query: `WHERE garage_id = ? AND type = ? AND status = 'AVAILABLE' ORDER BY rank LIMIT 1`.
3. **`ticket.price_plan_ver`** records which price plan was in force at entry. If prices change at noon, a car
   that arrived at 09:00 pays the old rates. It is a business choice; recording the version makes it possible.
4. **`payment.idempotency_key` is unique**, so a retried payment request can never create a second charge.
5. **`capacity_slot`** holds, per garage, spot type and time slot (say one hour), how many spots can be booked and
   how many are booked. Reservations count against it; they do not pick a specific spot.
6. **Plate is not a key.** Plates are misread, shared and changed. The ticket ID is the identity; the plate is a
   way to find it.

A second safety net sits in the database itself, so even a bug in the code cannot double-park:

```sql
-- At most one live ticket per spot, and one live ticket per plate per garage.
CREATE UNIQUE INDEX one_live_ticket_per_spot
  ON ticket (spot_id) WHERE status IN ('ACTIVE', 'PAID');
CREATE UNIQUE INDEX one_live_ticket_per_plate
  ON ticket (garage_id, plate) WHERE status IN ('ACTIVE', 'PAID');
```

A **partial unique index** (PostgreSQL syntax shown) enforces uniqueness only over rows matching the `WHERE`
clause, so old, closed tickets for the same spot do not count.

## 9. Request flows

### Flow 1: a car drives in

[![Entry sequence: the driver pulls up, the entry gate sends the plate read to the gate controller, which calls POST /entries with an idempotency key; the parking service checks for a reservation, claims a spot only if it is still available, inserts the ticket and commits, then returns ticket T-981 and spot 2-C14; the controller prints the ticket and opens the barrier](/img/system-design/parking-garage/06-entry.png)](/img/system-design/parking-garage/06-entry.png)

*Select the diagram to zoom in and move around.*

- The **reservation check** comes first: a booked driver gets a spot from capacity that walk-ins could not take.
- The **spot claim and the ticket insert are one transaction**. Either both happen or neither does, so there is
  never a held spot with no ticket, or a ticket with no spot.
- The **entry event** is published after the commit (through an outbox table, so it cannot be lost if the
  service crashes between the commit and the publish). Counts and signs update from it.

### Flow 2: price, pay, leave

[![Exit sequence: the driver pulls up, the exit gate reads the plate, the gate controller asks the parking service for a quote, which finds ticket T-981 at 3h10m with 8.00 due; the driver taps a card, the controller sends pay T-981 with an idempotency key, the parking service charges 8.00 through the payment provider, which approves; the ticket is closed, the spot freed and the barrier opens](/img/system-design/parking-garage/07-exit.png)](/img/system-design/parking-garage/07-exit.png)

*Select the diagram to zoom in and move around.*

With the example plan (2.00 per started hour, first 10 minutes free, 20.00 daily cap), 3 hours 10 minutes is
4 started hours, so $4 \times 2.00 = 8.00$. Things worth noticing:

- **The quote and the charge are separate calls.** The price shown is computed from the same pure function as
  the charge, so they always match.
- **The idempotency key for the payment** is per ticket and attempt. If the gate retries after a network blip,
  the payment service returns the first result instead of charging again.
- **Paying earlier is the fast lane.** If the driver paid at a kiosk or in the app, the exit gate sees a Paid
  ticket within its grace period and opens at once. Pre-payment is what keeps exit queues short at 18:00.

## 10. Deep dive: never allocate one spot twice

This is the question every interviewer asks. Two cars arrive at two entry lanes at 08:59:59. Both requests
read "spot 2-C14 is the best free spot". Both try to take it. How do we make sure only one wins?

[![Allocation workflow: an entry request picks the best free fitting spot, the database applies a conditional update only if the spot is still available; if exactly one row changed the ticket is inserted in the same transaction and the barrier opens; if not, the request lost the race and picks the next candidate; if no candidate is left, the sign shows FULL](/img/system-design/parking-garage/08-allocation.png)](/img/system-design/parking-garage/08-allocation.png)

### Option 1: a conditional update (optimistic)

Let the database decide who wins with one atomic statement:

```sql
UPDATE spot
   SET status = 'ASSIGNED', ticket_id = :ticket_id
 WHERE id = :spot_id AND status = 'AVAILABLE';
-- 1 row changed: the spot is ours.  0 rows changed: someone else won; pick another spot.
```

The `WHERE status = 'AVAILABLE'` is the trick. The database locks the row while it updates it, so the second
request waits, re-checks the condition after the first one commits, finds `ASSIGNED`, and changes 0 rows (this is
the behaviour at the default Read Committed level in PostgreSQL and MySQL; at stricter isolation levels
PostgreSQL raises a serialisation error instead, which you treat as "lost, retry"). This is a
**compare-and-set**: "change it only if it still looks the way I saw it". The in-memory version in the LLD answer
is the same idea with an atomic variable:

```java
private final AtomicReference<String> holder = new AtomicReference<>(null);

public boolean tryHold(String ticketId) {
    return holder.compareAndSet(null, ticketId);   // only one thread can move null -> ticketId
}
```

### Option 2: lock and skip (pessimistic, no retries)

Option 1 has a weakness at rush hour: every request wants the *same* best spot, so many lose and retry. Databases
offer a neat fix:

```sql
SELECT id FROM spot
 WHERE garage_id = :g AND type = :t AND status = 'AVAILABLE'
 ORDER BY rank
 LIMIT 1
 FOR UPDATE SKIP LOCKED;   -- lock the row; rows already locked by others are skipped
-- then UPDATE that row and INSERT the ticket in the same transaction
```

`FOR UPDATE` locks the chosen row until the transaction ends; `SKIP LOCKED` (PostgreSQL 9.5+, MySQL 8.0+) makes a
concurrent request skip that row and take the next best one instead of waiting. Ten simultaneous cars get ten
different spots with no retries.

### Option 3: one writer per garage

Route every allocation for a garage to one place: a single thread, an actor, or one partition of a queue keyed by
`garage_id`. With one writer, there is no race at all. The section 3 numbers say this is cheap (a few requests per
second per garage). The cost is a little latency and the need to fail over that writer carefully.

### What not to do

- **Read, check in application code, then write**, without a condition or lock. That is check-then-act.
- **Use the Redis count cache as the source of truth** for allocation. Caches drift; the database row is the
  truth and the cache is a view.
- **Lock the whole garage table** for every entry. Correct, but it serialises unrelated spot types and makes the
  database lock manager the bottleneck.

A strong answer: **Option 1 or 2 inside one single-shard transaction, plus the partial unique indexes from
section 8 as a safety net.** Mention Option 3 as the alternative when the interviewer asks about scaling writes.

## 11. Deep dive: reservations that are guaranteed

A reservation promises "you will get a compact spot at Garage 7 between 09:00 and 12:00". Two design questions
follow.

**Reserve a specific spot or reserve capacity?** Reserve **capacity**, the way a hotel sells room types and only
picks your room number at check-in. A specific spot would sit empty from 08:00 waiting for you, and one broken-down
car in "your" spot would break the promise. With capacity, any free compact spot will do on arrival.

**How do we prevent overbooking?** The `capacity_slot` table holds one row per garage, spot type and hour. A
booking from 09:00 to 12:00 must increment three rows, and all three must have room:

```sql
UPDATE capacity_slot
   SET booked = booked + 1
 WHERE garage_id = 7 AND spot_type = 'COMPACT'
   AND slot_start IN ('09:00', '10:00', '11:00')
   AND booked < bookable;
-- If fewer than 3 rows changed, roll back: at least one hour is full.
```

The same compare-and-set idea as allocation, applied to counters. A few more rules make the promise real:

- **Not every spot is bookable.** `bookable` is, say, 30% of the compact spots, so walk-ins are never fully
  locked out and there is slack for cars that overstay.
- **Walk-ins respect bookings.** At entry, a walk-in is admitted only if the free spots of that type exceed the
  reservations expected to arrive soon. Otherwise the sign says FULL for walk-ins, even though spots look empty.
- **No-shows** are released after a grace window (for example 30 minutes). The capacity returns, and the policy
  decides whether the driver pays a fee.
- **Payment** is a card **pre-authorisation** (the bank holds the money without moving it), captured at exit for
  the real amount. Holds expire after a few days, so for a booking made weeks ahead, save a card token at booking
  and place the hold shortly before the start.

## 12. Deep dive: gates that work offline

Internet links to garages fail: a cut cable, a router reboot, a cloud outage. The rule is **never trap a car and
never block the entrance because the cloud is unreachable.**

[![Offline gate sequence: with the link down, the gate controller's POST /entries gets no answer within 2 seconds, so it claims a spot in its local store and issues ticket G7-E1-000123, saves it in the outbox and raises the barrier; when the link is back it replays the outbox in order with the same idempotency keys, the parking service accepts and returns fix-ups such as moving a ticket after a spot clash, and sends new prices and bookings](/img/system-design/parking-garage/09-offline-gate.png)](/img/system-design/parking-garage/09-offline-gate.png)

*Select the diagram to zoom in and move around.*

How it works:

- **The controller already has what it needs.** Its local store holds the spot map, tickets for every car inside,
  the price plan and the next day's reservations, refreshed continuously while online.
- **One controller per garage** drives all its lanes, so offline allocation inside one garage is still a single
  writer: two local lanes cannot clash.
- **Ticket IDs are unique without the cloud:** garage, gate and a local counter (`G7-E1-000123`), or a random UUID.
  No central ID service is needed.
- **The outbox** is a local table of events written in the same local transaction as the decision. When the link
  returns, the controller replays it in order, with the original idempotency keys, so a replay that partly
  succeeded before the outage cannot create duplicates.
- **Conflicts are rare and fixable.** While offline, the cloud might have let an operator close a spot that the
  controller then assigned. On replay the server reports the clash and moves the ticket to a free spot in its
  records; the driver is not affected because the car is already parked.
- **Offline exit:** the price is computed locally from the cached plan. Payment depends on the card terminal:
  many support deferred (store-and-forward) authorisation within risk limits; otherwise the policy is to open the
  barrier and bill later by plate. Losing a few fares is cheaper than a queue onto the street.
- **Safety first:** in a fire alarm or power failure, barriers are configured to open.

This is a general pattern worth naming in any interview: **edge autonomy with store-and-forward sync**. The edge
makes decisions with the data it has, records them durably, and reconciles with the centre later.

## 13. Deep dive: availability across many garages

The app shows "Garage 7: 12 compact free" for every garage near you. Counting rows in the database for each
search would be wasteful, and the number only needs to be fresh within seconds.

- **Counters from events.** The availability service consumes entry, exit, hold and status events and keeps
  `free[garage][type]` in Redis. A search is a cache read.
- **Finding nearby garages** uses a geospatial index (for example Redis `GEOSEARCH` or PostGIS): "garages within
  2 km of this point", then one multi-get of their counters.
- **Counters drift** (a lost event, a sensor glitch), so a reconciliation job recomputes them from the database
  every minute or so and overwrites the cache.
- **Signs at the garage entrance** are driven by the gate controller's local counts, not by the cloud, so they keep
  working offline.
- **Stale is acceptable here.** The app may say 3 free and you arrive to a full garage. That is why reservations
  exist: the count is information, the booking is a promise.

## 14. Deep dive: pricing and payments

**Pricing** is a pure function: `price(plan, entry_at, exit_at, extras)`. A plan is data, not code:

| Rule | Example |
| --- | --- |
| Free period | First 10 minutes free |
| Rate | 2.00 per started hour |
| Daily cap | Never more than 20.00 per 24 hours |
| Time-of-day band | Flat 5.00 from 18:00 to 08:00 |
| Extras | EV charging billed per kWh; lost ticket = daily cap |

Store plans with versions and an effective date; the ticket records the version it started under. Test the
function with tricky cases: midnight, daylight-saving changes (use the garage's time zone from the `garage` row),
stays of several days.

**Payments** follow a few rules that apply to any money flow:

- **Payment states:** `PENDING → AUTHORISED → CAPTURED`, or `FAILED`, plus `REFUNDED`. Store every transition.
- **Idempotency key on every charge request**, unique in the database. Retries are safe.
- **The provider is the truth for money.** It notifies us by **webhook** (an HTTP callback) when a payment
  settles; a daily **reconciliation** job compares the provider's settlement report with our payment rows and
  flags mismatches.
- **Never block the barrier on a slow provider forever.** After a timeout, either retry once or fall back to
  "open and bill later by plate", with limits per plate to stop abuse.
- **Card data stays out of our systems.** The card reader encrypts the card and sends it to the provider; we store
  only a token. That keeps most of our system out of PCI DSS scope.

## 15. What breaks as it grows, and how to fix it

**The stadium rush.** 3,000 cars arrive in 40 minutes. The bottleneck is physical lanes, not servers. *Fix:*
pre-booked, pre-paid entry with ANPR so barriers open without a stop, extra lanes opened in event mode, and a
simpler allocation policy (fill levels in order) so drivers do not wander.

**Everyone wants the same spot.** Nearest-first sends every request to spot 1. *Fix:* `SKIP LOCKED`, or choose
randomly among the top few candidates, so concurrent requests spread out.

**Thousands of garages.** One database cannot hold everyone forever. *Fix:* shard by `garage_id`. Every
allocation, ticket and payment for a garage is on one shard, so transactions never cross shards. Reports across
garages read from a separate analytics store fed by the event stream.

**Search spikes.** A concert ends and 50,000 people open the app. *Fix:* serve counts from the cache, never from
the database, and cache search results for a few seconds per area.

**Plate misreads.** ANPR is good but not perfect: dirty plates, unusual fonts, motorcycles. *Fix:* always keep a
fallback (ticket button or QR), allow fuzzy matching at exit ("did you mean KA01AB1234?"), and route unmatched
exits to a help intercom.

**Data that should not be kept.** Plates are personal data in many countries. *Fix:* keep photos for a short,
stated period, keep plates only on tickets for as long as finance and law require, and delete or pseudonymise
afterwards.

## 16. Reliability: what can go wrong

| Risk | Defence |
| --- | --- |
| Two requests claim the same spot | Conditional update or `SKIP LOCKED` in one transaction, plus partial unique indexes |
| A gate retries an entry after a lost reply | Idempotency key = gate event ID; the server returns the first result |
| A payment request is retried | Unique idempotency key on `payment`; the provider also deduplicates by our key |
| The internet link to a garage fails | Gate controller decides locally, writes to an outbox, replays later |
| The gate controller itself fails | A second controller on site takes over (active-passive pair); lanes have a manual override |
| A database primary fails | Synchronous replica in another zone takes over; gates ride out the gap in offline mode |
| Counts in the app drift | Recomputed from the database every minute |
| A car is trapped by a fault | Intercom to an operator who can open the barrier remotely; barriers open on fire alarm |

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Concurrency control | Lock the row (pessimistic) | Compare-and-set (optimistic) | **Either**, inside one transaction. `SKIP LOCKED` avoids retries at rush hour |
| What a reservation holds | A specific spot | Capacity of a spot type | **Capacity**: flexible, survives a blocked spot, no empty reserved bays |
| Where gate decisions happen | Cloud only | Local first, cloud when reachable | **Local first**: a car at a barrier cannot wait for a network |
| Vehicle model | Subclasses | Type enum + fit table | **Enum**: behaviour does not differ, rules stay in data |
| Price changes mid-stay | Charge the new price | Charge the price at entry | **Price at entry** (record the plan version): fewer complaints |
| Availability counts | Count rows per search | Event-driven cache | **Cache**: fast and cheap; a few seconds stale is fine |
| Ticket identity | Plate | Ticket ID (plate as a lookup) | **Ticket ID**: plates are misread and shared |

## Cheat sheet for last-minute revision

- **Classes:** `ParkingGarage` (composes `Level` → `ParkingSpot`), `Vehicle` with a `VehicleType`, `Ticket`,
  `Payment`; **Strategy** interfaces `SpotAllocator` and `PricingPolicy`. No singleton, enum over subclasses.
- **Fit rule:** smallest spot that fits first; motorcycles fit anywhere, cars in compact or large, vans in large
  only; accessible spots only with a permit.
- **Spot states:** Available → Assigned (atomic) → Occupied → Available; hold expiry; Out of service.
- **Ticket states:** Active → Paid (grace period) → Closed; grace expired returns to Active; Lost; Cancelled.
- **No double allocation:** `UPDATE … WHERE status = 'AVAILABLE'` (1 row = you won) or
  `SELECT … FOR UPDATE SKIP LOCKED`; spot claim and ticket insert in one transaction; partial unique indexes as a
  safety net. Shard by `garage_id` so it is always one shard.
- **Reservations** hold capacity per spot type and hour (`booked < bookable`), not a specific spot; walk-ins
  respect upcoming bookings; card pre-authorisation.
- **Offline gates:** on-site controller with spot map, tickets and prices; locally unique ticket IDs; outbox +
  idempotent replay; never trap a car.
- **Availability:** event-driven counters in Redis + geospatial search + periodic reconciliation.
- **Money:** integer minor units, versioned price plans as pure functions, idempotency keys, webhooks and daily
  reconciliation, card data only as provider tokens.
- **Numbers:** 2,000 garages × 400 spots, 2.4M visits a day, about 110 writes per second (550 at peak), about 2
  cars a minute per garage at rush hour. Small scale; correctness and resilience are the real problems.

## Practice questions

1. **How would you support a bus that needs three consecutive large spots?** Model adjacency (each spot knows its
   neighbours on the same row) and claim all three in one transaction with a conditional update over the three
   rows (`WHERE id IN (...) AND status = 'AVAILABLE'`); if fewer than three rows change, roll back and try another
   run of spots.
2. **The sensor says a spot is occupied but no ticket holds it. What happened, and what do you do?** Usually a
   driver ignored the assigned spot and parked elsewhere. Mark the spot Occupied for counting, release the
   originally assigned spot when its hold expires, and record the real spot on the ticket when the sensor events
   can be matched (by time, or by a bay camera).
3. **How would you add monthly subscribers?** A subscription is a plate (or card) plus a garage and validity
   dates. At entry, a subscriber plate skips payment; capacity for subscribers is reserved like bookings, usually
   as a fixed share of spots.
4. **The payment provider is down for an hour at 18:00. What happens at the exits?** Gates time out the charge,
   then apply the fallback policy: open and bill later by plate (or use deferred card authorisation). Every such
   exit is recorded so it can be charged when the provider recovers.
5. **How would you show a driver where their car is?** The ticket already holds the spot, and the spot belongs to
   a level. The app shows "Level 2, bay C14", and a QR code on the pay-on-foot kiosk can do the same from the
   ticket.
