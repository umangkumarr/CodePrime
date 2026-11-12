---
title: "Design Tinder (a location-based dating app)"
description: "Design a Tinder-style dating app: geo-indexing with geohash, quadtrees and S2, the recommendation deck, high-rate swipes, race-free matching and location privacy."
difficulty: "Medium"
sidebar:
  label: "Dating app (like Tinder)"
tags: ["Geospatial", "Recommendations", "Bloom filters", "Concurrency", "Real-time"]
---

A dating app like Tinder fits on one screen: a stack of profile cards, swipe right for "yes", left for "no", and
when two people both say yes, a **match** opens a chat. Behind that screen sit three hard problems. The app must
find **people near you** among tens of millions of moving users, decide **who to show you next** without ever
repeating someone you already swiped, and record **billions of swipes a day** while never missing, or
double-counting, the moment two people like each other.

This case study builds that system from the ground up. We start with the vocabulary, size the problem, then design
the location index, the recommendation deck, the swipe pipeline and match detection, and finish with location
privacy, what breaks as it grows and a one-page revision sheet.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. The product in 5 minutes

| Term | What it means | Everyday analogy |
| --- | --- | --- |
| **Profile** | Name, age, photos, a short bio, and the user's **preferences**: who they want to see (gender, age range) and how far away (the **radius**, say 30 km) | A personal ad |
| **Deck** (or recommendations, "recs") | The stack of profile cards the app shows you, one at a time | A pile of ads picked for you |
| **Swipe** | Your verdict on one card: right = **like**, left = **pass**. Some apps add a "super like" | Ticking yes or no on each ad |
| **Match** | Two people who have **both** liked each other. Only matched people can message | Two ads that answered each other |
| **Geo index** | A data structure that answers "who is near this point?" quickly | The map with pins on a police-station wall |
| **Geohash / quadtree / S2** | Three ways to cut the map into labelled cells, so "near" becomes "in the same or a neighbouring cell" | Postcodes |
| **Bloom filter** | A compact bit array that answers "have I seen this before?" with no false "no" answers and a few false "yes" answers | A bouncer's rough memory of faces |

Two facts shape the whole design:

1. **Swipes are private until they are mutual.** If Alice likes Bob, Bob must not learn it unless he likes her too.
   So the server, not the app, decides when a match exists.
2. **Your deck depends on where you are, right now.** Users move: they commute, travel and change cities. The
   "who is near me" index must absorb a constant stream of location updates and still answer in milliseconds.

## 2. Requirements

### Functional (what users can do)

- **Create a profile** with up to 9 photos, a bio and preferences (gender shown, age range, maximum distance).
- **Share location**: the app reports where you are, so the deck shows nearby people.
- **Get a deck** of nearby people who fit your preferences, **and whose preferences you fit**, never showing
  someone you have already swiped.
- **Swipe** right or left on each card.
- **Match** when two people both swipe right, with an instant "It's a match!" for both.
- **Chat** with matches; **unmatch**, **block** and **report** at any time.
- **See distance** ("3 km away") without ever learning anyone's exact location.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Latency** | Deck loads in under 300 ms; a swipe feels instant (the card flies away before the server replies) | Swiping is a rhythm; any pause breaks it |
| **Write throughput** | Hundreds of thousands of swipes per second at peak | Swipes are the hottest write in the system |
| **Correctness of matches** | Every mutual like produces **exactly one** match and one notification | A missed match is a lost relationship; a double one looks broken |
| **Availability** | 99.99% for deck and swipes; matches may arrive a second late | Better a short delay than a failed swipe |
| **Freshness** | A location change shows in other people's decks within about a minute | People move, but nobody needs millisecond accuracy |
| **Privacy and safety** | Never reveal exact location; blocks take effect immediately | A dating app can put people in physical danger |

### Out of scope

Payments and subscriptions, photo moderation models, identity verification, ads, video calls, and the details of
chat (we reuse the [WhatsApp design](/system-design/case-studies/medium/whatsapp/)). Mention them, then set them
aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to find **which resources dominate**. These are assumptions for the
exercise, not Tinder's real figures (Tinder has said publicly only that its users make billions of swipes a day).

**Assumptions:** 100 million registered users, **50 million daily active users (DAU)**. Each active user makes
**100 swipes** and sends **10 location updates** a day. Peak traffic is **3×** the average (evenings). A deck page
holds **50 cards**. About **40%** of swipes are likes.

**Traffic**

- Swipes: $50\text{M} \times 100 = 5\text{B}$ a day, which is $5\text{B} / 86{,}400 \approx$ **58,000 per
  second** on average and about **175,000 per second** at peak.
- Location updates: $50\text{M} \times 10 = 500\text{M}$ a day, about **5,800 per second**.
- Deck fetches: one per 50 swipes, so $5\text{B} / 50 = 100\text{M}$ a day, about **1,200 per second** (3,500 at
  peak). Few requests, but each one is expensive: it scans and ranks thousands of candidates.
- Matches: $5\text{B} \times 40\% = 2\text{B}$ likes a day; if 1% of likes are returned, that is **20 million
  matches a day**, about 230 per second. Rare compared with swipes, but each must be detected exactly once.

**Storage**

- Swipes: about 40 bytes each (two 8-byte user IDs, a direction, a timestamp, overhead), so
  $5\text{B} \times 40\text{ B} = 200\text{ GB}$ a day, about **73 TB a year** before replication.
- Profiles: $100\text{M} \times 2\text{ KB} = 200\text{ GB}$. Small.
- Photos: $100\text{M} \times 6\text{ photos} \times 300\text{ KB}$ (all resized versions together) $\approx$
  **180 TB**.
- The geo index: per active user an ID, a cell ID, coordinates and a few filter fields, about 64 bytes, so
  $50\text{M} \times 64\text{ B} = 3.2\text{ GB}$. It **fits in memory** on one machine.

**Bandwidth:** if each card shows about two photos of 100 KB, that is $5\text{B} \times 200\text{ KB} = 1\text{ PB}$
of images a day, roughly **90 Gbit/s** on average. That must come from a CDN, never from our servers.

Three conclusions follow:

1. **Swipes are the write problem.** 175,000 writes per second, forever growing: an append-only, horizontally
   scaled store behind a log.
2. **The geo index is small but very busy.** Size is not the issue; constant updates and many reads are. Keep it in
   memory and split it by geography for throughput.
3. **Photos are the bandwidth problem**, solved by object storage plus a CDN.

## 4. The API

Clients talk to us over HTTPS with a JSON API, plus one WebSocket for live events.

| Method and path | What it does |
| --- | --- |
| `PUT /v1/profile` | Update bio and preferences (age range, distance, who to show). |
| `POST /v1/photos` | Get a pre-signed upload URL; the app uploads straight to object storage. |
| `POST /v1/location` | Report `{lat, lng}`. The app calls this on open and when it has moved more than about 1 km. |
| `GET /v1/recs?count=50` | The next page of the deck: profile summaries, photo URLs and a **rounded** distance. |
| `POST /v1/swipes` | `{"target_id": 42, "direction": "like", "swipe_id": "s9"}`. Can carry a batch. |
| `GET /v1/matches?cursor=...` | The user's matches, newest first. |
| `DELETE /v1/matches/{id}` | Unmatch. `POST /v1/users/{id}/block` and `/report` exist too. |
| `WSS /v1/stream` | Live events: new match, new message, typing. Phones that are asleep get APNs / FCM pushes. |

Two details matter. The **`swipe_id`** is an idempotency key: phones retry on bad networks, and a retried swipe
must not be counted twice. And the swipe call returns **`202 Accepted`** (stored, will be processed), never "you
have a match": the match is detected asynchronously and announced on the stream, which also keeps one person's
like hidden from anyone probing the API.

## 5. High-level design

[![High-level architecture: apps call an API gateway in front of the profile, location, recommendation and swipe services; location updates the geo index, the recommendation service reads the geo index and the per-user seen filter, swipes are appended to a log keyed by pair, match workers update one row per pair and emit new matches to the notify and chat service; photos come from a CDN backed by object storage](/img/system-design/tinder/01-architecture.png)](/img/system-design/tinder/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **API gateway:** checks the login token, applies rate limits, routes requests, and holds the WebSocket.
- **Profile service + Profile DB:** profiles and preferences, sharded by `user_id`.
- **Photo store + CDN:** the app uploads photos straight to object storage; the CDN serves resized copies.
- **Location service + Geo index:** turns coordinates into a map **cell**, and keeps "which users are in which
  cell" in memory.
- **Recommendation service:** builds each user's deck (section 7) and caches it.
- **Seen filter:** a per-user Bloom filter of everyone that user has already swiped.
- **Swipe service + Swipe log:** validates a swipe, appends it to a durable log (for example Kafka) and replies at
  once.
- **Match workers + Swipe/match DB:** read the log, record each vote in one row per pair of users, and create a
  match when both votes are likes.
- **Notify + chat:** tells both people about a match and carries their messages.

The key idea: **the read path (deck) and the write path (swipes) are separate systems**, joined only by the seen
filter and the geo index. Each can scale and fail on its own.

## 6. Deep dive: finding people near you

"Show me people within 30 km" sounds like one SQL query:

```sql
SELECT user_id FROM users
WHERE distance(lat, lng, :my_lat, :my_lng) < 30;   -- scans every row
```

The database must compute the distance for **every** user: 50 million calculations per request, 1,200 requests a
second. An index on `lat` alone helps a little: it narrows the search to a horizontal strip of the planet, but that
strip still crosses whole continents. We need an index on **both dimensions at once**. The trick all geo indexes
share: **cut the map into cells, give each cell a label, and index users by label.** "Near me" becomes "in my cell
or a neighbouring cell", which is a fast lookup.

### Geohash: postcodes made of letters

A **geohash** splits the world in half by longitude (west = 0, east = 1), then the chosen half by latitude, then
by longitude again, and so on, writing down one bit per split. Every 5 bits become one base-32 character. The
result is a short string like `tdr1v`, with a useful property: **places that share a prefix are close together**,
and a longer string is a smaller box.

| Geohash length | Cell size (roughly, at the equator) | Good for |
| --- | --- | --- |
| 4 | 39 km × 19.5 km | A city |
| 5 | 4.9 km × 4.9 km | A dating radius search |
| 6 | 1.2 km × 0.6 km | A neighbourhood |

To find people within a few kilometres, look up your own cell **and its 8 neighbours**. The neighbours matter:
someone 200 m away across a cell border has a completely different label. Geohashes are easy to store (a plain
string column with a normal index answers "starts with `tdr1`"), which is why Redis, Elasticsearch and many
databases support them. Their weakness: cells are a fixed size, so a 5-character cell in central Mumbai holds
far more people than one over the Sahara.

### Quadtree: cells that split where people are

A **quadtree** starts with the whole map as one square. When a square holds more than a limit (say 1,000 users),
it splits into four quarters, and each quarter splits again if it is still too full. Busy cities end up with many
tiny cells; deserts and oceans stay as one big cell.

[![A quadtree: the whole map with 9,000 users splits into four quarters; three hold a few hundred users and stay as leaves, the north-east quarter with 8,000 users splits again, and its busiest quarter with 6,900 users splits into city and suburb cells that split once more](/img/system-design/tinder/02-quadtree.png)](/img/system-design/tinder/02-quadtree.png)

*Select the diagram to zoom in and move around.*

A search walks down the tree to the cells that overlap your circle. The benefit is **even load**: every leaf holds
about the same number of people. The cost: a quadtree is a pointer structure in memory, and moving users means
updating and occasionally re-splitting or merging nodes.

### S2: cells on a sphere

Google's open-source **S2** library avoids the distortions of flat maps. It projects the Earth onto the six faces
of a cube, divides each face like a quadtree, and numbers the cells along a **Hilbert curve**, a line that snakes
through every cell so that cells close on the curve are close on the ground. Every cell gets a 64-bit ID, and there
are 31 levels, from a cube face down to about a square centimetre. A circle on the map is "covered" by a handful of
cells of mixed sizes, and each turns into a numeric range scan.

| Approach | Cells | Strength | Weakness |
| --- | --- | --- | --- |
| **Geohash** | Fixed-size rectangles, string labels | Simple, works in any database with a string index | Uneven density; border cases need 8 neighbours |
| **Quadtree** | Split by density | Even number of users per cell | In-memory structure to maintain |
| **S2** | Hierarchical cells on a sphere, 64-bit IDs | Accurate everywhere, ranges are cheap, mixed sizes | More concepts to learn |

Tinder's engineering blog has described splitting its recommendation index into **geographic shards built from S2
cells**, sized so each shard carries similar load. Our design does the same: the geo index is sharded by cell, a
dense city may be one shard by itself, and a whole sparse country may share one.

### Handling location updates

5,800 updates a second is easy, as long as most of them **do nothing**. A user who moves 100 m almost never
changes cell, so the index only changes when the cell does.

[![Location update: the phone posts its coordinates on app open or after moving about 1 km; the location service reads the user's last cell from the location store, and only if the cell changed removes the user from the old cell and adds them to the new one in the geo index, then saves the new cell and coarse coordinates](/img/system-design/tinder/03-location-update.png)](/img/system-design/tinder/03-location-update.png)

*Select the diagram to zoom in and move around.*

- **The phone throttles first:** it reports on app open or after moving about 1 km, not every few seconds. That
  saves battery and server work.
- **The server throttles too:** at most one update per user every few minutes, which also blocks scripts that
  "teleport" a fake account around to map people (see section 12).
- **An index move is two operations**, remove from cell A and add to cell B. If they are not atomic, a reader may
  briefly see the user in both cells or neither; a deck can tolerate that, and the next deck build is correct.
- Users who have not opened the app for weeks drop out of the index, which keeps it small and decks full of active
  people.

## 7. Deep dive: building the recommendation deck

Building a deck is a **funnel**: start wide and cheap, end narrow and careful.

[![Deck pipeline: the geo index yields about 5,000 nearby users, hard filters using Alice's settings and the block list leave about 1,500 eligible, the seen check against her Bloom filter leaves about 900 unseen, the ranker uses activity and history signals to pick the top 200 into the deck cache, and the app fetches 50 at a time](/img/system-design/tinder/04-deck-pipeline.png)](/img/system-design/tinder/04-deck-pipeline.png)

*Select the diagram to zoom in and move around.*

The numbers are illustrative; they show the shape of the funnel.

**1. Candidate generation.** Cover Alice's 30 km circle with cells and read the users in them from the geo index.
In a big city that is far more than we need, so stop after a few thousand, nearest cells first. In a village it
may be too few, so widen the search (if her settings allow) or simply show fewer cards.

**2. Hard filters, applied both ways.** A candidate must fit **Alice's** preferences (gender, age 25–32, within
her radius) **and Alice must fit theirs**. Showing Alice someone who would never see her wastes her swipes and
can never produce a match. Also drop blocked and banned accounts, and people inactive for weeks. These filters are
cheap field comparisons, so the geo index stores the needed fields (age, gender, preferences) next to each user ID.

**3. Remove people already swiped.** The deck must never repeat a card. An active user may have swiped tens of
thousands of people, and we must check every candidate, so the check must be fast and small.

- **An exact set** (all of Alice's swiped IDs, in a cache or the swipe table) is correct but large: 20,000 IDs ×
  8 bytes = 160 KB per user, read on every deck build.
- **A Bloom filter** is a bit array plus a few hash functions. Adding an ID sets a few bits; checking an ID asks
  "are all its bits set?". If any bit is 0, the ID was **definitely never added**. If all are set, it was
  **probably** added: a small chance the bits were set by other IDs (a **false positive**).

For a dating deck, the mistakes go the right way. A false positive means we skip someone Alice has **not** seen:
nobody notices one missing card among thousands. A false negative, showing someone again, can never happen.

How big is it? For $n$ items and a false-positive rate $p$, the best size is
$m = -\dfrac{n \ln p}{(\ln 2)^2} \approx 9.6\,n$ bits for $p = 1\%$, with about 7 hash functions. For 20,000 swipes:
$9.6 \times 20{,}000 \approx 192{,}000$ bits $\approx$ **24 KB**, under a sixth of the exact set. A Bloom filter
cannot delete entries and gets worse if overfilled, so a background job rebuilds each user's filter from the swipe
table now and then, at a size suited to their history. An "undo last swipe" feature keeps the last swipe outside
the filter until the next one arrives.

**4. Ranking.** Order the survivors by how likely this card is to lead to a **match and a conversation**, not just
by how attractive the person is to Alice. Typical signals: how recently each person was active, distance, whether
their past likes and passes resemble Alice's, profile completeness, and whether they have **already liked Alice**
(a card that can become a match immediately). Tinder once described an Elo-style "desirability" score and said in
2019 that it no longer relies on it; at interview level, "a learned model scores each candidate from these signals"
is enough. Add two guards:

- **Exposure caps:** the most popular profiles would otherwise appear in every deck and drown in likes, while
  others get none. Limit how often one person is shown per day.
- **New-user boost:** a new profile has no history, so give it some exposure to learn from (the **cold start**
  problem).

**5. Serve from a cache.** Building a deck costs tens of milliseconds of CPU, so we build ~200 cards at a time,
store them in a cache (for example Redis) keyed by user, and hand out pages of 50. The cache is thrown away when
Alice changes her preferences or moves to another cell, and refreshed in the background as it runs low, so the
next page is always ready. The app also **prefetches the next few photos**, which is what makes swiping feel
instant.

## 8. Deep dive: taking 175,000 swipes a second

A swipe is tiny, but there are a lot of them, and the user must never wait. The design:

1. **The app is optimistic.** The card flies off the screen immediately; the request goes in the background, and
   the app batches a few swipes per request on slow networks.
2. **The swipe service only validates and logs.** It checks the token and that the target exists, appends the swipe
   to the **swipe log** (replicated to 3 brokers), and replies `202 Accepted`. It also fires off one cheap,
   asynchronous update: add the target to the swiper's **seen filter**, so the next deck page already excludes
   them. No database work on the request path.
3. **Consumers do the real work**, each at its own pace, from the same log:
   - **Match workers** update the pair row and detect matches (section 9).
   - **The swipe archiver** writes the `swipes` table, the permanent history used to rebuild filters and to
     answer "who liked me".
   - **Analytics and model training** read the same stream.

Why a log in the middle? It **absorbs peaks** (Sunday evening is several times a Tuesday morning), it lets several
consumers read the same swipes without the swipe service calling each one, and if a consumer is down it simply
resumes from where it stopped. Nothing is lost.

**Where swipes live.** The `swipes` table is append-only and huge (73 TB a year), so a wide-column store like
Cassandra or ScyllaDB fits: partition by `swiper_id`, cluster by `target_id`. "Did Alice swipe Bob?" is a single
lookup, and "all of Alice's swipes" (to rebuild her filter) is one partition scan. A second table keyed by
`target_id` holds **likes received**, for features like "see who liked you".

**Idempotency.** The log delivers **at least once**: after a crash, a consumer may see the same swipe twice. Every
consumer must make a repeat harmless: the `swipes` row is keyed by `(swiper_id, target_id)`, so writing it twice
leaves one row; adding to a Bloom filter twice changes nothing; and the pair row (next section) records a vote, it
does not count them.

## 9. Deep dive: detecting a match without race conditions

### The naive approach, and how it breaks

"When Bob likes Alice, write Bob's like, then check whether Alice liked Bob. If yes, create a match." Now suppose
Alice and Bob swipe right on each other **at the same instant**, handled by two different servers:

| Time | Server 1 (Alice likes Bob) | Server 2 (Bob likes Alice) |
| --- | --- | --- |
| t1 | writes "Alice → Bob: like" | writes "Bob → Alice: like" |
| t2 | reads "Bob → Alice"? Not visible yet (replication lag): **no match** | reads "Alice → Bob"? Not visible yet: **no match** |

Both people liked each other and **nobody gets a match**. With slightly different timing, both servers see the
other's like and both create a match: **two matches and two notifications**. This is a classic **check-then-act
race**: the check and the action are separate steps, and another writer slips in between.

### The fix: one owner and one row per pair

Two ideas remove the race.

**1. Put both swipes of a pair in the same place.** Name every pair by its **pair key**, the two user IDs in a fixed
order, `(min(id), max(id))`. Alice (ID 17) and Bob (ID 42) are pair `(17, 42)` whoever swipes. The swipe service
uses the pair key as the **partition key** of the swipe log, so both swipes land in the same partition and are
processed **one after the other by the same match worker**. A log partition is consumed in order by exactly one
worker at a time, so there is no "same instant" any more.

**2. Store the pair as one row and change it atomically.** The `pairs` row holds both votes: `low_vote` and
`high_vote`, each empty, like or pass. Recording a vote is a single-row update that **returns the row after the
change**, and almost every database makes a single-row update atomic:

```sql
UPDATE pairs SET high_vote = 'L', updated_at = now()
WHERE user_low = 17 AND user_high = 42
RETURNING low_vote, high_vote;            -- both 'L'?  then it is a match
```

(In a wide-column store the same idea is a lightweight transaction or a compare-and-set; in Redis, a small Lua
script on one hash.) Even if two workers ever touched the same pair, say during a partition hand-over, the second
update would see the first one's vote, because both act on the same row.

[![Match detection for one swipe: compute the pair key, record the vote with an atomic update that returns the row, and if both liked, insert the match only if it does not exist, then emit an event to notify both; if not both liked the worker stops, and if the match already exists it skips](/img/system-design/tinder/05-match-check.png)](/img/system-design/tinder/05-match-check.png)

**3. Create the match exactly once.** The worker inserts the match with **insert-if-absent** (a unique key on
`(user_low, user_high)`). Only the insert that actually creates the row emits the `MatchCreated` event. If a worker
crashes after inserting but before marking the swipe as processed, the swipe is redelivered, the insert finds the
match already there, and the worker skips: **no second notification**.

Here is the whole flow when Bob likes Alice, who liked him yesterday:

[![Bob likes Alice: his app posts the swipe, the swipe service appends it to the log keyed by the pair and replies 202 Accepted; the match worker that owns the pair records Bob's like with an atomic update, sees both likes, inserts the match if it does not exist, and emits an event so the notify service tells Bob and Alice](/img/system-design/tinder/06-swipe-match.png)](/img/system-design/tinder/06-swipe-match.png)

*Select the diagram to zoom in and move around.*

A pair moves through a small set of states, which is also what the `pairs` and `matches` rows record:

[![Pair states: strangers become a one-way like after the first like and matched after the second, then chatting after the first message; a pass from strangers or from a one-way like ends in passed, where no match is possible; unmatch or block from matched or chatting ends in unmatched, which hides the chat for both](/img/system-design/tinder/07-pair-states.png)](/img/system-design/tinder/07-pair-states.png)

*Select the diagram to zoom in and move around.*

Note the privacy rule hiding in "one-way like": that state is visible only to the server (and, if the product sells
it, as a blurred "someone liked you"). The person who liked never learns whether the other side passed.

## 10. Real-time match notification and chat

When a `MatchCreated` event arrives, the notify service tells both people:

- **App open:** push the event down the user's **WebSocket** (a long-lived two-way connection) and the app shows
  "It's a match!" at once.
- **App closed:** send a phone notification through **APNs** (Apple) or **FCM** (Google). Tapping it opens the app,
  which fetches its matches.
- **Missed both?** The match is already stored, so the matches list shows it the next time the app opens. The
  notification is a convenience; the database is the truth.

**Chat** between matches is a one-to-one messenger, and the [WhatsApp case
study](/system-design/case-studies/medium/whatsapp/) covers that design in depth: persistent connections, store
then deliver, per-conversation sequence numbers, delivery and read receipts, push for offline users. Two
dating-specific rules sit on top:

- **Only matched people can message.** The chat service checks that the match exists and is active before
  accepting a message.
- **Unmatch and block are instant and two-sided.** Unmatching sets `unmatched_at`, hides the conversation for both
  people, and adds each to the other's block list so they never appear in each other's decks again.

## 11. The data model

[![Data model: users with preferences have photos and one location; blocks link a blocker to a blocked user; users make swipes keyed by swiper and target; swipes fold into one pairs row holding both votes; a pair becomes at most one match; a match contains messages ordered by sequence number](/img/system-design/tinder/08-data-model.png)](/img/system-design/tinder/08-data-model.png)

*Select the diagram to zoom in and move around.*

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Profiles, preferences, photo list | Small rows, read by `user_id` | Sharded MySQL / Postgres, or DynamoDB | Point reads and simple updates |
| Photos | Immutable files, 100 KB to a few MB | Object storage + CDN | Cheap, durable, cached near users |
| Geo index | Small, in memory, constantly updated | Sharded in-memory index by cell (Elasticsearch geo queries, Redis geo commands, or a custom service) | Fast "who is near" with filters |
| Swipes, likes received | Append-only, billions a day | Cassandra / ScyllaDB | Massive write throughput, partitioned by user |
| Pairs and matches | One row per pair, atomic updates | Wide-column store with compare-and-set, or sharded SQL | Single-row atomicity is all we need |
| Seen filters, deck cache | Per-user blobs, rebuilt freely | Redis | Fast, and safe to lose: rebuilt from the swipe table |
| Swipe log | Ordered, durable stream | Kafka | Partitions by pair key, replay, many consumers |

Why both `swipes` and `pairs`? They answer different questions. `swipes` is partitioned by the **swiper** ("what
has Alice swiped?"), which is what filters and history need. `pairs` is keyed by the **pair** ("what do Alice and
Bob think of each other?"), which is what match detection needs. Storing the fact twice, each shaped for its
reader, is normal at this scale.

## 12. Privacy: never reveal exact location

The app shows "3 km away", so the server must know where both people are. The danger is not that number; it is
what an attacker can compute from many such numbers.

**Trilateration** is how GPS itself works: if you know your distance from three known points, there is only one
place you can be. An attacker can fake their own location (easy with a script), ask "how far is Bob?" from three
spots, and draw three circles; they cross at Bob's home. Researchers have repeatedly shown such attacks on dating
apps that returned precise distances. Defences, all on the server:

1. **Never send coordinates to other users' apps.** The server computes the distance and sends only a number.
2. **Round the distance** to whole kilometres (or miles), with a floor such as "less than 1 km". Rounding alone is
   not enough, though: by moving in small steps an attacker can find exactly where the answer flips from 2 to 3 km.
3. **Snap locations to a grid first.** Compute distance between **cell centres** (for example cells about 1 km
   across), not between true positions. However cleverly the attacker probes, the best they can learn is which
   cell Bob is in, not his front door.
4. **Rate-limit location changes and distance lookups.** A real person cannot move 500 km in a minute; an account
   that "teleports" or views the same profile from dozens of positions is flagged.
5. **Store less.** Keep the current cell and coarse coordinates (about 100 m precision, three decimal places) for
   matching; do not keep a history of precise positions longer than needed.

Travel features (like Tinder's "Passport", which lets you swipe in another city) simply set the location the deck
uses to a chosen city centre, which fits the same rules.

## 13. What breaks as it grows, and how to fix it

**The dense city.** One geo shard for central London or Mumbai gets more reads than all of rural Europe. *Fix:*
size shards by load, not by area (S2 or quadtree cells make this natural), and replicate hot shards so reads spread
over several copies.

**The popular profile.** A few users receive a huge share of likes. Their "likes received" partition grows hot and
large, and they flood the decks. *Fix:* exposure caps in ranking, and split very large partitions by time
bucket.

**The empty deck.** A new user in a small town swipes through everyone in an evening. *Fix:* widen the radius
when allowed, recycle passed profiles after a long time (a product decision), and tell the user honestly that
there is nobody new nearby.

**Users who cross shard borders.** Someone on the edge of a shard needs candidates from two shards. *Fix:* the
recommendation service queries every shard whose cells overlap the search circle, and merges the results.

**The New Year spike.** Swipe traffic jumps several times in a few hours. *Fix:* the log absorbs the burst;
consumers fall behind for a while and catch up, and only matches arrive a few seconds late. Autoscale consumers
from the log's backlog.

**Ever-growing Bloom filters.** A user with 200,000 swipes overflows a filter sized for 20,000, and false positives
climb. *Fix:* rebuild filters at a size matching each user's history, or fall back to the exact swipe table for
heavy swipers.

## 14. Reliability: how we never lose a swipe or a match

| Risk | Defence |
| --- | --- |
| Swipe service crashes after replying | It replies only after the log has stored the swipe on several brokers |
| A swipe is delivered twice | Every consumer is idempotent: keyed rows, set-a-vote updates, insert-if-absent matches |
| Two workers own the same pair during a hand-over | The atomic single-row update still serialises the two votes |
| Match notification lost | The match row is the truth; the app's match list shows it on next open |
| Cache or Bloom filter lost | Rebuilt from the `swipes` table; meanwhile fall back to exact checks |
| Geo shard dies | Replicas take over; the index can also be rebuilt from the location store in minutes, since it is only a few GB |
| A whole region fails | Profiles, swipes and matches are replicated to another region; decks are rebuilt there |

The pattern to remember: **at-least-once delivery + idempotent consumers = effectively exactly once**, and
**one owner per key** (here, per pair) removes check-then-act races.

## 15. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Geo index | Geohash in a normal database | S2 / quadtree cells in a sharded in-memory index | **S2 cells, in memory**: even load per shard, and the data is only a few GB |
| Seen check | Exact set of swiped IDs | Bloom filter | **Bloom filter**, rebuilt from the exact table: ~6× smaller, and its only error (skipping an unseen card) is harmless |
| Swipe write path | Write to the database in the request | Append to a log, process asynchronously | **Log**: absorbs peaks, feeds many consumers, the user never waits |
| Match detection | Check the other side's like on each swipe | One owner per pair + atomic pair row | **Pair key**: no check-then-act race, exactly one match |
| When to tell the user | In the swipe response | Through the event stream | **Stream**: keeps one-way likes private and the swipe call fast |
| Distance shown | Exact | Snapped to a grid and rounded | **Snapped and rounded**: defeats trilateration |
| Deck freshness | Build on every request | Precompute ~200, refresh in the background | **Precompute**: fast pages; slightly stale cards are fine |

## Cheat sheet for last-minute revision

- **Three hard parts:** find nearby people (geo index), pick who to show (deck), record swipes and detect matches
  (write path).
- **Geo indexing = cells:** geohash (fixed boxes, string prefixes, check 8 neighbours), quadtree (split cells where
  people are), S2 (cells on a sphere, 64-bit IDs on a Hilbert curve). Index users by cell; re-index only when the
  cell changes.
- **Deck = funnel:** generate candidates from nearby cells → hard filters **both ways** → drop already-swiped with a
  **Bloom filter** (false positives harmless, no false negatives) → rank (match likelihood, activity, exposure caps,
  new-user boost) → cache ~200, serve 50 at a time, prefetch photos.
- **Bloom filter size:** about 9.6 bits per item at 1% false positives; 20,000 swipes ≈ 24 KB.
- **Swipes:** optimistic UI → validate → append to a replicated log → `202 Accepted`. Consumers: match workers,
  seen filter, swipe archive (Cassandra, by `swiper_id`), analytics.
- **Matches:** pair key `(min id, max id)` as the log partition key, so one worker owns each pair; one `pairs` row
  with both votes, updated atomically; insert-if-absent match; only the creator emits the event.
- **Notify:** WebSocket if online, APNs / FCM if not; the match row is the truth. Chat = the WhatsApp design, only
  between active matches.
- **Privacy:** never send coordinates; snap to ~1 km cells, round distances, rate-limit location changes.
- **Numbers:** 50M DAU × 100 swipes = 5B a day ≈ 58K/s (175K/s peak); 73 TB of swipes a year; geo index ≈ 3 GB in
  memory; ~1 PB of photos served a day, from a CDN.

## Practice questions

1. **Alice and Bob like each other at the same moment. Walk through why they get exactly one match.** Both swipes
   carry the pair key `(17, 42)`, so they land in the same log partition and are handled in order by one worker. The
   first records one like and stops; the second's atomic update returns both likes, the match is inserted if absent,
   and only that insert emits the notification.
2. **How would you build "See who liked you"?** Read the `likes received` table partitioned by `target_id`, newest
   first, and remove anyone you have already swiped or who is now blocked. It is a paid feature in many apps, so
   check entitlement first.
3. **A user complains they keep seeing the same person. What could be wrong?** The swipe never reached the log (the
   app's retry failed), the seen-filter update failed and the deck cache still held the card, the person has two accounts, or the filter was
   rebuilt from a stale table. Check the swipe log by `swipe_id`, then the consumer lag.
4. **How would you implement "Rewind" (undo the last swipe)?** Keep the last swipe pending on the server for a short
   window before its vote counts and before it enters the Bloom filter; rewind deletes it. If it was a like that
   already made a match, either disallow rewind or treat it as an unmatch.
5. **Why not simply run `ORDER BY distance LIMIT 50` in Postgres with PostGIS?** That works for a city-sized app: a
   spatial index (an R-tree, via GiST) answers it well. At 50 million moving users, 6,000 location writes a second
   and heavy filtering, an in-memory index sharded by cell gives steadier latency and lets each region scale alone.
