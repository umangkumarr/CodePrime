---
title: "Design Uber (ride hailing)"
description: "Design a ride-hailing service like Uber: live driver locations in an H3 geo index, ETA-based dispatch, the trip state machine, surge pricing."
difficulty: "Hard"
sidebar:
  label: "Uber (ride hailing)"
tags: ["Geospatial", "Real-time", "Matching", "State machines", "Sharding"]
---

Ride hailing looks like a simple app: you tap **Request**, a car turns up, you ride, and the fare comes off your
card. Underneath, it is a **live map** of millions of moving cars that changes every few seconds, a
**matchmaker** that must pair each rider with the right driver in a couple of seconds and never give one driver
to two riders, a **state machine** that tracks every trip from request to payment, a **market** that raises
prices when demand outruns supply, and a **real-time feed** that keeps two phones (the rider's and the
driver's) in step the whole way.

What makes it hard is not storage, which is modest. It is the **write rate of moving things** and the
**correctness of a two-sided match** under time pressure. This case study builds the system from first
principles, then goes deep on the parts interviewers push on.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Ride hailing in 5 minutes: the vocabulary

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Rider** and **driver** | The two sides of the market. Both run an app that stays connected while in use | Passenger and taxi |
| **Supply** and **demand** | Free drivers in an area, and riders asking for cars there | Taxis on the rank, people in the queue |
| **Location ping** | The driver app reporting latitude, longitude, heading and time every few seconds | A lighthouse flashing its position |
| **Geospatial index** | A data structure that answers "which drivers are near this point?" quickly | A city map divided into numbered squares |
| **Cell** | One tile of the map in that index. Uber open-sourced **H3**, which tiles the earth in hexagons | A square on a street atlas page |
| **Dispatch** (matching) | Choosing which driver gets which ride request | The taxi controller on the radio |
| **ETA** | Estimated time of arrival, computed over real roads with live traffic | "About seven minutes, love" |
| **Surge** | A price multiplier for an area when demand is far above supply | Peak-hour train fares |
| **Trip** | One ride, from request to payment, with a **state** (matching, on the way, in progress…) | A parcel's tracking status |

Three facts shape the whole design:

1. **Locations are hot, short-lived data.** A driver's position from 30 seconds ago is almost worthless for
   matching. So the live map belongs **in memory**, not in a database that writes every ping to disk.
2. **Trips are precious, long-lived data.** A trip is a contract with money attached. Its state changes are few
   but each one must be **durable and exactly right**.
3. **Everything is local.** A rider in Mumbai is never matched with a driver in London. A city is a natural
   unit for splitting the system, which makes it far easier to scale than a social network.

## 2. Requirements

### Functional (what users can do)

- **Riders** see nearby cars on a map, get a fare estimate, request a ride, watch the driver approach, ride,
  and pay automatically at the end. They can cancel.
- **Drivers** go online or offline, stream their location, receive ride offers, accept or decline, navigate to
  the pickup and destination, and start and end the trip.
- **Matching:** each request is offered to a good nearby driver (by time to reach the rider, not straight-line
  distance) within a few seconds.
- **Live tracking:** both apps see each other's position and the trip state in real time.
- **Pricing:** an upfront fare, with surge when an area is busy.
- **Payments:** charge the rider when the trip ends; pay drivers later.
- **History and receipts** for both sides.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Matching latency** | A driver offer within ~2 seconds of the request in normal conditions | Riders give up and open a rival app |
| **Freshness** | The live map is at most a few seconds stale | A car 30 seconds away may have turned a corner |
| **Correctness** | Never assign one driver to two trips, or one trip to two drivers | Two cars arriving, or one rider left stranded |
| **Availability** | 99.99% for requesting and for trips in progress | A trip must continue even if a data centre fails |
| **Durability** | Never lose a trip or a payment record | Trips are billing records and safety records |
| **Scale** | Millions of drivers online at peak, hundreds of thousands of location writes a second | See the estimates below |

### Out of scope

Driver onboarding and background checks, ratings, food delivery, shared rides (pooling), fraud detection in
depth, and the routing engine itself (we use it as a service; the [Google Maps case
study](/system-design/case-studies/hard/google-maps/) builds one). Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

Uber does not publish most of these numbers, so these are **assumptions** for a service of that size. The goal is
to learn which resource dominates.

**Assumptions:** 2 million drivers online at the global peak (1 million on average). Each pings every
**4 seconds** with about **100 bytes**. 30 million trips a day, averaging **20 minutes**. Peak traffic is about
3× the daily average.

**Location writes (the big one)**

- Peak: $2\text{M} / 4\text{ s} = 500{,}000$ pings per second, about $500{,}000 \times 100\text{ B} = 50\text{ MB/s}$
  coming in.
- Per day (average 1M drivers): $1\text{M} \times 86{,}400 / 4 \approx 21.6\text{B}$ pings, about **2 TB** raw.

**Memory for the live map**

- One entry per online driver: ID, position, cell, status, vehicle type, timestamp, say **200 bytes**.
- $2\text{M} \times 200\text{ B} = 400\text{ MB}$. The **whole world's live map fits in the RAM of one machine**.

That surprises people. The problem is not the size of the map, it is **500,000 updates a second** plus the
reads, and keeping each city's map close to its riders. We split it by city for throughput and fault isolation,
not because it would not fit.

**Trips**

- $30\text{M} / 86{,}400 \approx 350$ new trips per second on average, about **1,000 per second** at peak.
- Fare estimates are requested several times per trip (people check prices), say 5×: about **5,000 per second**
  at peak.
- Trips in progress at peak: $1{,}000/\text{s} \times 1{,}200\text{ s} \approx 1.2\text{M}$. Each rider watches
  their driver move, so that is another $1.2\text{M} / 4 = 300{,}000$ position pushes per second **out**.

**Storage**

- Trip records with their state history: about 2 KB each, $30\text{M} \times 2\text{ KB} = 60\text{ GB}$ a day.
- Route trail per trip (for fares and disputes): $1{,}200 / 4 = 300$ points, about 6 KB compressed, so
  $30\text{M} \times 6\text{ KB} \approx 180\text{ GB}$ a day.

**Connections**

- About 2 million drivers plus a few million riders with the app open hold a connection. At around 100,000
  connections per gateway server, that is roughly **50 servers**, more for headroom.

Conclusions: the **location path** must be in memory and horizontally split; **trip storage** is small and
ordinary; **fan-out of positions** to riders is as heavy as the pings coming in.

## 4. The API

Apps talk HTTPS for actions and keep **one WebSocket** (a long-lived, two-way connection) open for live
updates. When the app is in the background, phones get push notifications (APNs on iOS, FCM on Android) instead.

| Method and path | Who | What it does |
| --- | --- | --- |
| `POST /v1/quotes` | Rider | Pickup and drop-off in; fare, surge and a `quote_id` valid for a few minutes out |
| `POST /v1/trips` | Rider | Request a ride with a `quote_id` and an `Idempotency-Key`; returns `trip_id`, state `MATCHING` |
| `GET /v1/trips/{id}` | Both | Current state, driver, car, ETA. Used after a reconnect |
| `POST /v1/trips/{id}/cancel` | Both | Cancel, with a fee if past the free window |
| `PUT /v1/drivers/me/status` | Driver | `online` / `offline` |
| `WSS /v1/stream` (driver → server) | Driver | Location pings; `accept` / `decline` for offers; `arrived`, `start`, `end` |
| `WSS /v1/stream` (server → app) | Both | Offers to drivers; driver position and state changes to riders |

Why the **idempotency key** on `POST /v1/trips`? A rider on a weak connection taps Request, the reply is lost,
and the app retries. Without the key the system creates two trips and may send two cars. With it, the server
returns the first trip for any repeat of `k1`.

Why does the **quote** have an ID? The price the rider agreed to (including surge) is locked when they tap
Request. If surge changes a second later, they still pay the quoted fare.

## 5. High-level design

[![High-level architecture: rider and driver apps connect to an edge gateway; the trip service owns the state machine and the trips database, asks pricing for quotes and dispatch for a driver; dispatch reads the in-memory geo index and the ETA service; driver pings flow through the location service into a location stream that updates the geo index, the trail store and pricing's supply counts; payments run when a trip completes](/img/system-design/uber/01-architecture.png)](/img/system-design/uber/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Edge gateway:** terminates TLS, authenticates, holds every app's WebSocket and knows which connection
  belongs to which user, so other services can say "push this to driver D7".
- **Location service:** receives pings, drops stale or impossible ones (a car cannot move 5 km in 4 seconds),
  and publishes them.
- **Location stream** (for example Kafka, partitioned by city): one write, many readers. It decouples the
  firehose of pings from everything that uses them.
- **Geo index:** in memory, per city, "which free drivers are in this cell and the cells around it?"
- **Dispatch:** given a request, finds candidates, ranks them by ETA, offers the trip to drivers one at a time.
- **ETA + routing:** travel time over the road network with live traffic.
- **Trip service:** owns the **trip state machine** and the trips database; the single source of truth for
  "what is happening on trip t9".
- **Pricing:** fare quotes, and surge multipliers computed from supply and demand per cell.
- **Payments:** charges the rider when the trip completes.
- **Trail store:** the history of positions, written in batches, used for fares, receipts and disputes.

The single most useful idea in this design: **keep the fast-moving data (locations) and the slow, precious data
(trips) on separate paths.** Locations live in memory and are allowed to be lost; trips live in a replicated
database and never are.

## 6. Flow 1: driver location updates

Every online driver's app sends a ping every few seconds. Here is where one ping goes.

[![Location pipeline: the driver app sends lat, lng and time to the edge gateway, then to the location service, which publishes a clean ping to the location stream keyed by city; consumers move the driver between cells in the in-memory geo index, push the position to the rider if the driver is on a trip, count supply per cell, and batch-write the trail store](/img/system-design/uber/02-location.png)](/img/system-design/uber/02-location.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **We never write each ping to a database row.** 500,000 random writes a second to disk would need a large,
  expensive cluster, and almost every row would be overwritten 4 seconds later. The geo index keeps only the
  **latest** position, in RAM. Durable history goes to the trail store in **batches** (for example one compressed
  block per trip per minute), which is cheap.
- **Losing a few pings is fine.** If the geo index server restarts, it rebuilds itself within one ping interval:
  every online driver will report again in 4 seconds. That is why in-memory is safe here and would be reckless
  for trips.
- **Stale drivers expire.** Each entry carries a timestamp. A driver who has not pinged for, say, 30 seconds
  (tunnel, dead battery) is treated as unavailable rather than offered rides.
- **Riders only get positions they need.** A rider on a trip receives their own driver's position; a rider
  browsing the map gets a coarse, throttled view of nearby cars. Nobody receives the whole firehose.
- **Adaptive ping rates** save battery and bandwidth: a parked, offline-soon driver can ping less often; a driver
  approaching a pickup pings more often.

## 7. Deep dive: the geospatial index

The question dispatch asks thousands of times a second is: **"which free drivers are within a few kilometres of
this point?"** Scanning 2 million drivers and computing distances is far too slow. We need an index.

### The idea: divide the map into cells

Cut the map into tiles and give each tile an ID. Each driver is stored under the ID of the tile they are in:
`cell → set of driver IDs`. To find drivers near a point, compute the point's cell, then look in that cell and
its neighbours. When a driver moves into a new cell, remove them from the old set and add them to the new one.
That is two small in-memory operations per ping.

### Which cells?

| Scheme | How it works | Strengths | Weaknesses |
| --- | --- | --- | --- |
| **Geohash** | Interleave the bits of latitude and longitude into a string; nearby places share a prefix | Simple; a prefix search in any key-value store | Rectangles of very different sizes by latitude; two points either side of a boundary can share no prefix |
| **Quadtree** | Split a square into 4 whenever it holds too many drivers | Adapts to density (deep in Manhattan, shallow in a desert) | Must be rebalanced as cars move; harder to shard |
| **S2** (Google) | Project the earth onto a cube and number squares along a space-filling curve | Good for covering arbitrary regions | Square cells have unequal neighbour distances |
| **H3** (Uber) | Tile the earth in **hexagons**, at 16 resolutions; each cell has about 7 children at the next finer resolution | Every neighbour's centre is the **same distance** away; rings around a cell are easy | Cells do not nest exactly; a few pentagons exist |

Uber built H3 and open-sourced it in 2018, which is a good reason to pick it in an interview, but the reasoning
matters more than the name. **Hexagons have one kind of neighbour.** A square has 4 edge neighbours and 4
corner neighbours at different distances; a hexagon has 6 neighbours, all with centres the same distance away.
That makes "everything within k steps" a clean, nearly circular ring, which is exactly the shape of "nearby".

### Searching with rings

At a resolution where cells are a few hundred metres across (H3 resolution 8 has an average edge of about
530 m), the search is:

1. Find the rider's cell `c`.
2. Take the **disk** of cells within `k` steps of `c` (H3 calls this `gridDisk`, formerly `kRing`). For `k = 1`
   that is 7 cells, for `k = 2` it is 19: in general $1 + 3k(k+1)$.
3. Read the free drivers in those cells. If there are too few, grow `k`.

```text
candidates = []
for k in 1, 2, 3, ...:
    for cell in gridDisk(rider_cell, k):
        candidates += free_drivers[cell]
    if len(candidates) >= 10 or k == MAX_K: break
```

The cell lookup gives a **rough** shortlist. Ranking the shortlist properly is ETA's job (section 9).

### Splitting the index across machines

Even though one machine could hold the map, one machine cannot handle every city's writes and reads, and one
failure should not blind the whole world. So:

- **Shard by city (or region).** Each city's geo index lives on a small group of servers, with replicas. Pings
  for a city are routed to its owners by the stream's partition key.
- **Huge cities split further** by cell, for example by coarse H3 parent cell, so one busy city is spread over
  several servers.
- **Who owns which shard?** Uber open-sourced **Ringpop**, a library that puts a group of servers on a
  **consistent-hash ring** (each key, such as a city or cell, belongs to one server on the ring) and uses a
  **gossip protocol** (servers tell each other who is alive) so that any server can forward a request to the
  owner. If a server dies, its keys move to its neighbour on the ring. A coordination service such as ZooKeeper
  is the other common answer.
- **Border searches** near a shard boundary query both shards; the disk of cells simply spans two owners.

## 8. Flow 2: requesting a ride and matching

Riya requests a ride. Here is the happy path.

[![Request sequence: the rider app posts the trip with a quote and idempotency key and gets trip t9 in MATCHING; the trip service asks dispatch to find a driver; dispatch reads free drivers near the pickup from the geo index, gets road ETAs for each, offers t9 to driver D7 with a 15-second expiry while holding D7, D7 accepts, dispatch asks the trip service to assign D7 only if the trip is still MATCHING, and the rider is pushed the driver, car and ETA](/img/system-design/uber/03-request.png)](/img/system-design/uber/03-request.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The rider gets an answer immediately** (step 2: "trip t9, MATCHING") and then waits on the WebSocket. The
  search can take a few seconds and must not hold an HTTP request open.
- **Steps 4 to 7 take tens of milliseconds** because both the geo index and the ETA lookups are in memory.
  Most of the wait is the human driver reading the offer.
- **The driver is held during the offer** (step 8). While D7 is looking at t9, no other request can offer D7
  a ride. Without this, two dispatchers could each offer D7 a different trip and D7 could accept both.
- **Assignment is conditional** (step 10): "set the driver to D7 only if the trip is still MATCHING". If the
  rider cancelled a second earlier, the write fails and D7 is released.

## 9. Deep dive: dispatch, offers and timeouts

### Why ETA, not distance

The nearest car in a straight line may be across a river, on a one-way street pointing the wrong way, or on the
other side of a motorway. **Rank candidates by road ETA** to the pickup. The ETA service answers "how long from
each of these 14 candidates to this pickup?" in one batched call (a *one-to-many* query on the road graph).

A good score is mostly ETA, with smaller adjustments, for example: prefer a driver about to finish a trip
nearby over one 10 minutes away, and avoid offering to a driver who has declined many times in a row.

### One driver at a time

[![Dispatch loop: a ride request finds candidates in the pickup cell and rings, ranks them by road ETA, offers the trip to the best driver while holding them for 15 seconds; if accepted, the trip is assigned atomically; if declined or timed out, the driver is released and the next one is offered; if no drivers are free, the search widens and gives up with No cars after about a minute](/img/system-design/uber/04-offer.png)](/img/system-design/uber/04-offer.png)

*Select the diagram to zoom in and move around.*

Why not offer to five drivers at once and take the first to accept? Because four drivers then see an offer
vanish, which is a poor experience and wastes their attention, and because a driver who is being offered your
trip cannot be offered anyone else's. Offering **sequentially with a short timeout** (10–15 seconds) keeps
drivers' trust and keeps supply available. To keep the rider's wait short, dispatch keeps the ranked list, so
the next offer goes out the moment the previous one is declined or expires.

If nobody is free nearby, the search **widens** (more rings, or waits a few seconds for drivers finishing
trips) and, after about a minute, the trip moves to `NO_DRIVERS` and the rider is told.

### Greedy versus batched matching

The simple approach is **greedy**: each request takes the best driver for itself the moment it arrives. In a
busy area this can be wasteful: rider A grabs the driver who was 2 minutes from A but also the *only* driver
near rider B, while another driver 3 minutes from A was free. A **batched** matcher collects requests for a
second or two, then solves the assignment for the whole batch at once to minimise the **total** ETA (this is the
classic *assignment problem* on a bipartite graph of riders and drivers). It costs a second or two of latency
and gains a better market overall. A good interview answer names both and says busy cities benefit from
batching.

## 10. Deep dive: never assign twice

Two kinds of race can break a match:

1. **One driver, two trips.** Two requests near the same driver are matched at the same moment.
2. **One trip, two outcomes.** The driver taps Accept while the rider taps Cancel.

Both are solved the same way: **every state change is an atomic compare-and-set** ("change X to Y only if it is
still X"), so exactly one of the racing writers wins and the other gets a clear failure it can handle.

**For drivers**, each driver's live status (`available`, `offered`, `on_trip`) has **one owner**: the dispatch
server that owns the driver's city or cell on the hash ring. All changes to that driver go through that single
owner, which serialises them in memory, and are persisted as a conditional write:

```sql
UPDATE driver_state SET status = 'offered'
WHERE city_id = 12 AND driver_id = 7 AND status = 'available';   -- 0 rows means someone else got D7
```

(`driver_state` is the driver's live dispatch status, kept on the city's shard next to its trips. It is separate
from the global driver profile in section 16.)

**For trips**, the trip row carries its state and a **version** number (optimistic locking):

```sql
UPDATE trips
SET state = 'DRIVER_ASSIGNED', driver_id = 7, version = version + 1
WHERE city_id = 12 AND trip_id = 't9' AND state = 'MATCHING' AND version = 3;
```

If the rider cancelled first, the trip is `CANCELLED` (version 4), this update touches 0 rows, and dispatch
releases D7 and tells the driver "trip no longer available". Because we **shard by city**, a trip and the live
status of the driver serving it live on the same shard, so both updates can share one local transaction instead of a distributed one.

Retries are safe too: accept messages carry the `trip_id` and an offer ID, so a duplicated Accept from a flaky
phone finds the trip already `DRIVER_ASSIGNED` to the same driver and is simply acknowledged again.

## 11. The trip state machine

Every trip is a small state machine. Writing it down explicitly is what makes the race handling above
possible: each transition is legal only from certain states.

[![Trip states: MATCHING goes to DRIVER_ASSIGNED when a driver accepts, then DRIVER_ARRIVED at pickup, IN_PROGRESS when the trip starts and COMPLETED when it ends; MATCHING can time out to NO_DRIVERS; a driver cancelling from DRIVER_ASSIGNED sends the trip back to MATCHING; a rider cancel from DRIVER_ASSIGNED or a no-show from DRIVER_ARRIVED goes to CANCELLED](/img/system-design/uber/05-trip-states.png)](/img/system-design/uber/05-trip-states.png)

*Select the diagram to zoom in and move around.*

- **Every transition is appended to `trip_events`** (from state, to state, who did it, when). That log is the
  audit trail for support and disputes, and it is the event stream that payments, receipts and analytics
  consume.
- **A driver cancelling is recoverable**: the trip goes back to `MATCHING` and the search starts again, with
  that driver excluded. The rider keeps their place.
- **A rider cancelling while still `MATCHING`** just stops the search, free of charge. After a driver is
  assigned, a fee may apply after a grace period; after a no-show at pickup, the driver is compensated.
- **Illegal transitions are rejected.** "End trip" on a trip that never started fails; this catches app bugs
  and replayed messages.

## 12. Real-time updates to both apps

Both apps need to hear about changes the instant they happen: the rider wants to see the car move, the driver
needs the offer within a second. Polling every second from millions of phones would be wasteful and still
laggy, so:

- **Each open app holds one WebSocket** to the edge gateway. The gateway keeps a map `user → connection` (in a
  shared registry, since the user may be on any gateway server), so the trip service can push "driver arrived"
  to the right phone. The [WhatsApp case study](/system-design/case-studies/medium/whatsapp/) covers this
  connection layer in depth.
- **Messages are small and idempotent:** "trip t9 is now DRIVER_ARRIVED, version 6". A phone that receives an
  older version than it already has ignores it.
- **On reconnect, the app asks for the truth** with `GET /v1/trips/{id}`. Pushes are a fast path; the trip
  service is the source of truth. A lost push never leaves the app wrong for long.
- **Backgrounded apps** get a push notification (APNs, FCM) for important events such as "your driver has
  arrived", because the operating system closes their WebSocket.
- **Driver position to the rider** is forwarded from the location stream at the ping rate, and the rider app
  **animates** the car smoothly between points, so 4-second updates look continuous.

## 13. ETA and routing, at a high level

ETAs appear everywhere: ranking candidates, the "5 min" on the rider's screen, the upfront fare. The routing
engine models the road network as a **graph** (intersections are nodes, road segments are edges weighted by
travel time) and finds shortest paths with speed-up techniques such as **contraction hierarchies**, which
precompute shortcuts so a city-scale query takes milliseconds instead of seconds. The [Google Maps case
study](/system-design/case-studies/hard/google-maps/) goes deep on this.

Three points to make in an interview:

- **Edge weights come from live traffic**, and the best source of live traffic is the fleet itself: every
  driver's trail tells you how fast each road is moving right now.
- **Map-matching**: raw GPS jumps around, especially between tall buildings. Pings are "snapped" to the most
  likely road before they are used for speeds or fares.
- **Routing-engine ETAs are then corrected by machine learning** trained on how long trips really took (Uber has
  written publicly about doing this), because the graph misses things like time spent finding the pickup.

## 14. Surge pricing, at a high level

When a concert ends, 3,000 people want cars and 40 drivers are nearby. Surge raises the price in that area,
which does two things: some riders wait or walk, and drivers in quieter areas head over. It is a way to
**rebalance supply and demand**, not just to charge more.

[![Surge pipeline: rider events such as app opens and requests give demand, driver pings give free drivers as supply; a cell counter aggregates both per H3 cell in one-minute windows; a surge model turns the ratio into a smoothed, capped multiplier; the multiplier cache serves the pickup cell's value to fare quotes and all cells to the driver heat map](/img/system-design/uber/06-surge.png)](/img/system-design/uber/06-surge.png)

*Select the diagram to zoom in and move around.*

- **Per cell, per minute.** A streaming job counts demand (requests, app opens with a destination) and supply
  (free drivers) in each H3 cell over short windows. Cells are a natural unit here too.
- **The multiplier is smoothed and capped.** Raw ratios jump around; smoothing across time and neighbouring
  cells avoids prices flickering between 1.0× and 2.5× every minute, and caps protect riders (some places also
  regulate it, for example during emergencies).
- **It is read, not computed, at request time.** Fare quotes read the pickup cell's multiplier from a cache, so a
  quote is a few microseconds of lookup plus a route estimate.
- **The quote locks the price.** The rider pays what they saw when they tapped Request.

## 15. Payments at trip end

When the trip moves to `COMPLETED`, the final fare is computed (the upfront quote, or time and distance from the
trail for metered products, plus tolls and fees) and a `TripCompleted` event goes to the payments service.

- The rider's card was **authorised** (money held, not taken) when the trip was requested, so the final step is
  a **capture** of the right amount. This also catches a declined card before the driver sets off.
- Payment runs **asynchronously** from the trip: a slow card network must never block "end trip" on the driver's
  phone. The trip is done; the charge follows seconds later.
- The charge uses an **idempotency key derived from the trip ID**, so a retried event can never charge twice.
- Drivers are paid from a **ledger** in periodic payouts, not per trip.

The [payment system case study](/system-design/case-studies/medium/payment-system/) covers authorisation,
capture, ledgers and idempotency in depth.

## 16. Low-level design: data model and sharding

[![Data model: riders, drivers and vehicles (a driver owns many vehicles); trips, sharded by city with a composite key of city_id and trip_id, reference the rider, driver and vehicle and carry state, version, pickup, drop-off, surge and fares; trip_events record each state change; payments link one-to-one to a trip with a unique idempotency key](/img/system-design/uber/07-data-model.png)](/img/system-design/uber/07-data-model.png)

*Select the diagram to zoom in and move around.*

Design decisions in this model:

**1. Trips are keyed by `(city_id, trip_id)` and sharded by city.** Almost everything about a trip happens in
one city: the riders, drivers, dispatch and geo index for it are all there. Keeping the trip on its city's
shard makes the assign-and-hold transaction local. Very large cities get several shards (split by area); many
small cities share one.

**2. `version` on the trip row** enables the compare-and-set updates from section 10.

**3. `trip_events` is append-only.** State changes are never edited, only added, which gives an audit trail
and lets other services rebuild what happened.

**4. Rider and driver profiles are global**, sharded by their own ID, because people travel between cities
(the `status` column there is the account status; the live `available` / `offered` / `on_trip` status is the
per-city `driver_state` row from section 10). A rider's
trip history is served by a secondary index (`rider_id → trip IDs`) or a separate history store built from trip
events.

**5. Live locations are not in this model.** They live in the in-memory geo index and the trail store.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Live driver positions | Latest value per driver, 500K writes/s, lost data rebuilds in seconds | In-memory index per city (custom service, or Redis with geo commands) | Speed; durability not needed |
| Trips, trip events | Small rows, strict state changes, per city | Sharded relational DB (MySQL, Postgres) or a strongly consistent distributed SQL store | Conditional updates and transactions |
| Riders, drivers, vehicles | Profiles, read-heavy | Sharded relational DB plus a cache | Simple, read-mostly |
| Location stream | Ordered firehose | Kafka, partitioned by city | Many consumers, replay |
| Trails | Append-only time series, read rarely | Wide-column store (Cassandra) or object storage in compressed blocks | Cheap per byte |
| Surge multipliers, quotes | Short-lived lookups | In-memory cache with expiry | Microsecond reads |

## 17. Reliability: a data centre fails mid-trip

A rider is halfway across town when the region that runs their city goes dark. The trip must not vanish:
the driver must still be able to end it, and the rider must still be charged correctly.

The usual answer is a **standby region**: trip data is replicated there, and traffic fails over. The catch is
that cross-region replication is **asynchronous** (synchronous replication across continents would add
round trips to every write), so the standby may be a few seconds behind. The last state changes before the
failure could be missing.

A neat fix is to **use the driver's phone as a backup**. Uber's engineers have described a version of this in
public talks. With every acknowledgement, the server sends the driver app a small **encrypted state digest** of
the trip (state, version, key times). The phone cannot read or forge it; it just keeps the latest one. After a
failover, the phone hands it to the new region.

[![Failover sequence: during a normal trip the driver app sends pings to region A, which acknowledges with an encrypted state digest the phone keeps and replicates trips to region B asynchronously; region A then stops replying, the driver app reconnects through the global router, which sends it to region B; the app sends its last digest, region B rebuilds trip t9 from the digest and its replica with the newest version winning, resumes the trip as IN_PROGRESS, and the rider app reconnects and sees the trip and live map](/img/system-design/uber/08-failover.png)](/img/system-design/uber/08-failover.png)

*Select the diagram to zoom in and move around.*

Why this works: the region B replica is **almost** current; the digest fills the gap of the last few seconds;
**the version number decides** which copy is newer. The geo index does not need replicating at all: drivers
ping region B within seconds and its index fills itself.

Other failures and their defences:

| Risk | Defence |
| --- | --- |
| A geo index server dies | Its cells move to another server on the ring; the index refills from the next round of pings |
| A gateway server dies | Apps reconnect to another one and re-fetch trip state; pushes are hints, the trip service is the truth |
| Dispatch dies mid-offer | Offers have a timeout; an expired hold returns the driver to `available` and the trip to the search |
| Duplicate messages (retries, flaky networks) | Idempotency keys on requests; compare-and-set on states; versioned pushes |
| The payment provider is down | The trip still completes; the capture is queued and retried with the same idempotency key |
| A city overloads (New Year's Eve) | Shed non-essential work first (map browsing refresh rates, analytics), keep requests and trips; surge itself reduces demand |

## 18. What breaks as it grows, and how to fix it

**The hot city.** One city, or one airport, gets a burst far above its shard's capacity. *Fix:* split big
cities into several shards by coarse H3 cell; give airports dedicated queues (drivers wait in a virtual
first-in-first-out line rather than being matched by distance).

**The ping firehose.** Doubling drivers doubles writes. *Fix:* the path is already in memory and partitioned
by city, so add partitions and servers; reduce ping frequency for idle drivers; compress and batch on the wire.

**Fan-out to watchers.** Every rider on a trip, plus every browsing rider, wants positions. *Fix:* send
browsing riders a sampled, coarse view (a few cars, updated slowly); only trip riders get every ping.

**Cross-border searches.** A rider on the edge of a shard needs drivers from the next one. *Fix:* the search
asks every shard the disk of cells touches; shards are chosen so that borders fall in quiet areas, not in city
centres.

**Bad greedy matches at peak.** First-come-first-served matching wastes drivers when it is busiest. *Fix:*
batched matching every second or two in dense areas.

**Global features on local shards.** "Show me all my trips across every city" or a company dashboard does not
fit city sharding. *Fix:* stream trip events into a separate history store and a data warehouse, keyed the
other way.

## 19. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Where live locations live | Database row per ping | In-memory index, latest only | **Memory**: 500K writes/s, data is stale in seconds and rebuilds itself |
| Geo index | Geohash or quadtree | H3 hexagons | **H3** (or any cell scheme): equal-distance neighbours make ring search clean |
| Ranking | Straight-line distance | Road ETA | **ETA**: distance ignores rivers, one-way streets and traffic |
| Offers | Broadcast to many drivers | One at a time with timeout | **One at a time**: no wasted offers, driver held cleanly |
| Matching | Greedy per request | Batched every second or two | **Greedy** by default, **batched** in dense areas |
| Concurrency | Distributed locks | Single owner + compare-and-set | **CAS on versioned rows**: simple, no lock to leak |
| Sharding | By user | By city / region | **City**: trips, drivers and riders are local, so transactions stay local |
| Cross-region replication | Synchronous | Asynchronous + phone digest | **Async**, with the digest covering the gap |

## Cheat sheet for last-minute revision

- **Two paths:** fast, lossy **location** path (memory, stream) and slow, precious **trip** path (state
  machine, replicated DB). Never write every ping to a database.
- **Geo index** = map split into cells (H3 hexagons, open-sourced by Uber), `cell → free drivers`, in RAM,
  sharded by city. Search the pickup cell and the rings around it (`gridDisk`, 7 then 19 cells).
- **Dispatch:** shortlist from cells → rank by **road ETA** → offer to **one driver at a time**, held, 10–15 s
  timeout → next on decline. Batched matching in busy areas.
- **No double assignment:** one owner per driver + **compare-and-set** with a `version` on the trip
  (`... WHERE state = 'MATCHING' AND version = 3`).
- **Trip states:** `MATCHING → DRIVER_ASSIGNED → DRIVER_ARRIVED → IN_PROGRESS → COMPLETED`, plus `CANCELLED`,
  `NO_DRIVERS`; driver cancel goes back to `MATCHING`. Every change appended to `trip_events`.
- **Real time:** one WebSocket per app, small versioned pushes, `GET trip` on reconnect, APNs/FCM in background.
- **Surge:** supply and demand per H3 cell per minute → smoothed, capped multiplier → cached; the quote locks
  the price.
- **Payments:** authorise at request, capture at completion, async, idempotency key from the trip ID.
- **Shard by city**; Ringpop-style consistent-hash ring + gossip to find each shard's owner.
- **Region failure:** async replica + encrypted state digest on the driver's phone; newest version wins.
- **Numbers:** 2M drivers / 4 s = **500K pings/s**; live map ≈ **400 MB**; ~1,000 trips/s at peak; ~1.2M trips
  in progress; ~300K position pushes/s out.

## Practice questions

1. **Two riders request at the same moment and the same driver is best for both. What happens?** Both
   dispatchers try to move the driver from `available` to `offered`. The driver has one owner, so the updates
   are serialised: one succeeds, the other affects 0 rows and moves on to its next candidate within
   milliseconds.
2. **How would you add shared rides (pooling)?** A trip becomes a route with several pickups and drop-offs.
   Matching must check that adding a rider keeps every existing rider's detour under a limit, which is a much
   bigger search, so it suits batched matching. The driver's state becomes "on trip, seats free: 2".
3. **A driver's GPS jumps 2 km for one ping. What breaks, and how do you guard against it?** The geo index and
   the fare could both be wrong. The location service drops physically impossible jumps (speed check), the
   trail is map-matched to roads before fares are computed, and the fare for unusual trails is flagged for
   review.
4. **How would you show a rider "3 cars nearby" on the map before they request?** Read the geo index for the
   disk of cells around them, return a handful of cars with coarse, slightly delayed positions, throttled to a
   refresh every few seconds. This protects driver privacy and keeps the load small.
5. **Airport pickups work differently. How would you design them?** Draw a geofence (a set of cells) around
   the airport. Drivers inside join a first-in-first-out queue instead of the distance-based search, and
   requests from the terminal are offered to the head of the queue.
6. **Why not keep the whole world in one geo index, since it fits in memory?** Throughput (500,000 writes a
   second plus reads on one machine), fault isolation (one crash would stop every city) and latency (a rider in
   Sydney should not wait on a server in Virginia). Splitting by city fixes all three.
