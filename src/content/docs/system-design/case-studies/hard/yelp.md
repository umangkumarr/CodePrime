---
title: "Design a Location-Based Service (like Yelp)"
description: "Design a Yelp-style 'places near me' service: geohash, quadtree, S2/H3 and R-tree indexes, text + geo search, sharding, caching, reviews and ranking."
difficulty: "Hard"
sidebar:
  label: "Places near me (like Yelp)"
tags: ["Geospatial", "Search", "Caching", "Sharding", "Ranking"]
---

You open an app, type "pizza", and within a fraction of a second you see twenty pizza places within walking
distance, best first, with stars, photos and a map. That one screen hides a question computers are surprisingly
bad at: **"which of 200 million places are close to this point?"** Ordinary database indexes sort data along one
line. Distance on a map lives in two dimensions. Most of this case study is about bridging that gap.

A Yelp-style service is a **map-aware search engine** (find places by distance, text and filters), a **catalogue**
(business details, opening hours, photos), and a **community** (reviews and ratings). It is extremely read-heavy:
millions of people search; very few businesses change on any given day. We build it from first principles, with
worked examples for every spatial index an interviewer may ask about.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one. Section 7 (spatial
indexes) is the heart of the problem.
:::

## 1. Location in 5 minutes: the vocabulary

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Latitude, longitude** | A point on Earth. Latitude runs from $-90°$ (South Pole) to $+90°$ (North Pole); longitude from $-180°$ to $+180°$ around the globe | A seat number: row and column |
| **POI** (point of interest) | Anything with a location people search for: a café, a dentist, a petrol station | A pin on a paper map |
| **Radius search** | "Everything within 2 km of me" | Drawing a circle with a compass |
| **Viewport (bounding box) search** | "Everything inside the part of the map I am looking at", given as two corners | Looking through a window at a map |
| **Haversine distance** | The formula for the shortest distance between two points on a sphere ("as the crow flies") | A taut string across a globe |
| **Spatial index** | A data structure that finds things by position quickly, without checking every row | The grid squares (A1, B4…) on a city map |
| **Geohash, quadtree, S2, H3, R-tree** | Different ways to build a spatial index (section 7) | Different ways of drawing that grid |

Two facts about the Earth matter for the maths later:

- One degree of **latitude** is always about **111 km** (110.57 km to be precise near the equator).
- One degree of **longitude** shrinks as you move away from the equator: it is $111.32\text{ km} \times \cos(\text{latitude})$.
  At San Francisco (latitude 37.77°) that is about **88 km**; near the poles it approaches zero.

So a "box of 0.01° by 0.01°" is not a square, and its size depends on where you are. Every geo system has to
handle this.

## 2. Requirements

### Functional (what users can do)

- **Search nearby:** given a location and a radius (or a map viewport), return businesses, optionally matching
  a text query ("pizza", "vegan brunch") and filters (category, open now, price level, minimum rating).
- **Ranked results**, best first, paged 20 at a time, with distance shown.
- **Map view:** pins for the visible area, re-searched when the user pans or zooms.
- **Business page:** name, address, hours, phone, photos, average rating, review count, reviews.
- **Write reviews** (1 to 5 stars plus text) and **upload photos**.
- **Business owners** add or edit their business (new address, new hours, closed permanently).

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Latency** | Search in under 200 ms at the 99th percentile; business page under 100 ms | People search while walking; slowness feels broken |
| **Availability** | 99.99% for search and business pages | Reads are the product |
| **Scale** | 200 million businesses worldwide; 100 million daily active users | A global, map-app-sized place catalogue |
| **Freshness** | A new or edited business appears in search within minutes; a review within seconds to minutes | Nobody minds a new café showing up a minute late |
| **Consistency** | Eventual for search; read-your-writes for the author's own review | You must see your own review after posting it |
| **Correctness of geo** | Never miss a place that is inside the radius; never show one far outside it | A "nearby" result 30 km away destroys trust |

### Out of scope

Turn-by-turn navigation, live moving objects (that is ride-hailing: drivers move every few seconds, a different
problem), reservations, delivery, ads billing and the moderation pipeline for fake reviews (we mention it).

## 3. Back-of-the-envelope estimates

**Assumptions:** 200 million businesses. 100 million daily active users, each doing **5 searches** and opening
**10 business pages** a day. Peak traffic is **3× average**. 2 million new reviews and 1 million business edits a
day. A business record is about **2 KB**; a review about **1 KB**; 2 billion reviews in total. 1 billion photos,
each about **1 MB** original plus **200 KB** of resized copies.

**Traffic**

- Searches: $100\text{M} \times 5 = 500\text{M}$ a day, $500\text{M} / 86{,}400 \approx$ **5,800 per second**,
  about **17,000 per second** at peak.
- Business page views: $100\text{M} \times 10 = 1\text{B}$ a day, about **11,600 per second** on average.
- Writes: 2M reviews + 1M edits = 3M a day, about **35 per second**.
- Read-to-write ratio: about $5{,}800 + 11{,}600 = 17{,}400$ reads a second against 35 writes, roughly **500 : 1**. This is a read-optimised system: we can
  afford to do extra work on every write (reindexing, recomputing aggregates) to make reads cheap.

**Storage**

- Businesses: $200\text{M} \times 2\text{ KB} = 400\text{ GB}$. Small enough for one sharded database cluster.
- Reviews: $2\text{B} \times 1\text{ KB} = 2\text{ TB}$.
- Photos: $1\text{B} \times 1.2\text{ MB} = 1.2\text{ PB}$. This is the only big number, and it belongs in object
  storage behind a CDN.
- **The geo index itself:** for each business we need an ID (8 bytes) and a latitude and longitude (8 bytes each):
  $200\text{M} \times 24\text{ bytes} = 4.8\text{ GB}$. Even doubled for data-structure overhead, about
  **10 GB fits in the memory of one ordinary server.**

**Bandwidth:** a results page shows 20 thumbnails of about 20 KB each, so 400 KB per search. At peak that is
$17{,}000 \times 400\text{ KB} \approx 6.8\text{ GB/s}$ of images. That must come from a CDN, not our servers.

Three conclusions follow:

1. **The location index is small.** We do not need a distributed geo database to hold it; we need it **fast** and
   **replicated** for throughput and availability.
2. **Reads dominate by 500×.** Precompute everything at write time and cache aggressively.
3. **Photos dominate storage and bandwidth.** Object storage plus CDN, never the database.

## 4. The API

| Method and path | What it does |
| --- | --- |
| `GET /v1/search?lat=37.7749&lng=-122.4194&radius_m=2000&q=pizza&open_now=true&price=1,2&cursor=...` | Radius search with optional text and filters. Returns 20 results and a cursor. |
| `GET /v1/search?bbox=37.70,-122.52,37.83,-122.35&q=pizza&zoom=13` | Viewport search for the map: the two corners (south-west, north-east) of the visible area. |
| `GET /v1/businesses/{id}` | Business details, rating summary, a few top photos. |
| `GET /v1/businesses/{id}/reviews?sort=newest&cursor=...` | Reviews, paged by cursor. |
| `POST /v1/businesses/{id}/reviews` | Post a review: `{"rating": 5, "text": "..."}`, with an `Idempotency-Key` header so a retry does not post twice. |
| `POST /v1/photos/upload-url` | Returns a pre-signed URL; the app uploads the photo straight to object storage. |
| `POST /v1/businesses`, `PATCH /v1/businesses/{id}` | Owners add or edit a business (goes through verification). |

Why a **cursor** and not `?page=7`? Results are ranked by a score that changes (new reviews, places opening and
closing). A cursor encodes "continue after score S and business ID B", so the next page neither repeats nor skips
places, and the search engine can jump straight there.

## 5. High-level design

[![High-level architecture: user apps reach the API gateway, which routes to the search, business and review services; search uses a result cache, a search cluster for text, geo and filters, and an in-memory geo index; business and review services write their databases, whose changes stream through change events to indexers that update the search cluster and geo index; photos are uploaded to object storage and served through a CDN](/img/system-design/yelp/01-architecture.png)](/img/system-design/yelp/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **API gateway:** authentication, rate limiting, routing.
- **Search service:** parses the query, checks the cache, asks the indexes, ranks, pages.
- **Search cluster:** a search engine with geo support (Elasticsearch, OpenSearch or Solr are typical) that can
  answer text + distance + filters in one query.
- **Geo index:** a small, in-memory spatial index (geohash table or quadtree) for pure "what is near here" and
  map-pin queries, which need no text matching and must be extremely fast.
- **Business service + Business DB:** the **source of truth** for business data. Everything else is a copy.
- **Review service + Review DB:** reviews and photo metadata. Photos themselves go to **object storage** (S3,
  GCS) and are served by a **CDN**.
- **Change events + indexers:** every committed change becomes an event; indexers update the search cluster, the
  geo index and the rating aggregates.

The idea to remember: **one source of truth, many read-optimised copies**. The database is organised for safe
writes; the indexes are organised for fast reads; a change stream keeps them in step.

## 6. Why a plain SQL index on latitude and longitude is not enough

The obvious first attempt: store `lat` and `lng` columns, index them, and search a box around the user. For a
1 km radius at San Francisco, 1 km is $1/110.57 \approx 0.00904°$ of latitude and
$1/(111.32 \times \cos 37.77°) \approx 0.01136°$ of longitude:

```sql
SELECT id, name, lat, lng
FROM business
WHERE lat BETWEEN 37.7659 AND 37.7839
  AND lng BETWEEN -122.4308 AND -122.4080;
```

This returns the right answer. The problem is **how much work the database does to find it**.

A B-tree index is sorted along **one** line. An index on `lat` can jump to latitude 37.7659 and read until
37.7839, but that range is a thin **ring around the entire planet**: every business between those latitudes, in
California, Spain, Greece, Turkey, Central Asia, China and Japan. A composite index on `(lat, lng)` does not fix
it: inside the latitude range, rows are sorted by latitude first, so longitudes are scattered and the database
still walks the whole ring, checking `lng` row by row. (Two separate indexes and a bitmap intersection help a
little, but each index still produces a huge list.)

How much bigger is the ring than the box? At latitude 37.77° the circumference of that ring is
$2\pi \times 6{,}371 \times \cos 37.77° \approx 31{,}600\text{ km}$. Our box is about 2 km wide. So the index range
covers a strip roughly **15,800 times longer** than the area we want. Businesses are not spread evenly, but the
point stands: the database reads a large slice of the world to return twenty rows, and it gets worse with every
business we add.

**What we need is an index where "close on the map" means "close in the index".** There are two families of
solutions:

1. **Turn two dimensions into one** so that an ordinary sorted index works: geohash, S2, H3 (section 7.1, 7.3).
2. **Use a tree that divides space itself**: quadtree, k-d tree, R-tree (section 7.2, 7.4).

## 7. Spatial indexes from first principles

### 7.1 Geohash: a grid you can sort

**The idea.** Repeatedly cut the world in half, alternating between longitude and latitude, and write down which
half the point is in: 0 for the lower half, 1 for the upper. After many cuts, the string of bits identifies a
small rectangle. Group the bits five at a time and write each group as one character from a 32-character
alphabet (`0123456789bcdefghjkmnpqrstuvwxyz`, which skips `a`, `i`, `l` and `o` to avoid confusion).

**Worked example: encoding San Francisco (37.7749, -122.4194).**

| Bit | Cuts | Range before | Middle | Point is… | Bit | New range |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | longitude | −180 to 180 | 0 | below (−122.42) | 0 | −180 to 0 |
| 2 | latitude | −90 to 90 | 0 | above (37.77) | 1 | 0 to 90 |
| 3 | longitude | −180 to 0 | −90 | below | 0 | −180 to −90 |
| 4 | latitude | 0 to 90 | 45 | below | 0 | 0 to 45 |
| 5 | longitude | −180 to −90 | −135 | above | 1 | −135 to −90 |
| 6 | latitude | 0 to 45 | 22.5 | above | 1 | 22.5 to 45 |
| 7 | longitude | −135 to −90 | −112.5 | below | 0 | −135 to −112.5 |
| 8 | latitude | 22.5 to 45 | 33.75 | above | 1 | 33.75 to 45 |
| 9 | longitude | −135 to −112.5 | −123.75 | above | 1 | −123.75 to −112.5 |
| 10 | latitude | 33.75 to 45 | 39.375 | below | 0 | 33.75 to 39.375 |

The first five bits `01001` are 9, which is the character `9`. The next five `10110` are 22, which is `q`.
Continuing, the point's geohash is `9q8yyk8yt…`. Every extra character makes the cell 32 times smaller.

**The key property: a shared prefix means a shared area.** Every point whose geohash starts with `9q8yyk` lies
in the same small rectangle. A sorted index on a `geohash` column turns "everything in this cell" into a single
range scan:

```sql
-- every business in cell 9q8yyk (1.2 km by 0.6 km at the equator)
SELECT id, lat, lng FROM business
WHERE geohash >= '9q8yyk' AND geohash < '9q8yyl';
```

The same trick works in any sorted store: a B-tree, a key-value store, or a Redis sorted set (Redis's own `GEO`
commands store a 52-bit geohash as the sorted-set score).

**Precision table.** Width and height of one cell at the equator (widths shrink with $\cos(\text{latitude})$):

| Length | Bits (lng + lat) | Cell size at the equator | Roughly the size of |
| --- | --- | --- | --- |
| 1 | 3 + 2 | 5,000 km × 5,000 km | A continent |
| 2 | 5 + 5 | 1,250 km × 625 km | A large country |
| 3 | 8 + 7 | 156 km × 156 km | A region |
| 4 | 10 + 10 | 39 km × 19.5 km | A large city |
| 5 | 13 + 12 | 4.9 km × 4.9 km | A town |
| 6 | 15 + 15 | 1.2 km × 0.61 km | A neighbourhood |
| 7 | 18 + 17 | 153 m × 153 m | A few blocks |
| 8 | 20 + 20 | 38 m × 19 m | A building |
| 9 | 23 + 22 | 4.8 m × 4.8 m | A room |

(Where do the numbers come from? Length 6 has 30 bits, 15 for each axis. $360° / 2^{15} = 0.011°$ of longitude
$\approx 1.22$ km, and $180° / 2^{15} = 0.0055°$ of latitude $\approx 0.61$ km.)

**Neighbour cells: the boundary problem.** A user standing near the edge of a cell can be 10 metres from a café
in the next cell. So a radius search must look at the user's own cell **and its neighbours**. For `9q8yyk`
the 3 × 3 block is:

| | West | Centre | East |
| --- | --- | --- | --- |
| **North** | `9q8yyj` | `9q8yym` | `9q8yyt` |
| **Centre** | `9q8yyh` | **`9q8yyk`** | `9q8yys` |
| **South** | `9q8yy5` | `9q8yy7` | `9q8yye` |

Notice that neighbouring cells do **not** have neighbouring letters. The order of cells along the index follows
a **Z-shaped curve** (the "Z-order" or Morton curve), so the curve sometimes jumps far away and comes back.
Neighbours are computed with a small lookup table or by decoding to a box, stepping one cell width, and encoding
again; libraries do this for you.

**Edge cases interviewers love:**

- **Close points, totally different hashes.** Points at (0.0001, 0.0001) and (−0.0001, −0.0001) are only 31
  metres apart, but their geohashes are `s00000` and `7zzzzz`: they share **no** prefix, because they sit on
  opposite sides of both the equator and the prime meridian, the very first cuts. "Search by prefix only" would
  miss them; "search the 3 × 3 neighbours" finds them.
- **Shared prefix is not guaranteed even for neighbours.** One step north of `9q8yy` (length 5) is `9q8zn`. The
  prefix shrinks from 5 to 3 shared characters.
- **The 180° meridian.** Fiji and parts of Russia straddle it. The east neighbour of a cell at longitude +179.99
  is at −179.99: neighbour code must wrap around.
- **Near the poles** cells become very thin slivers, so a 3 × 3 block may not cover the radius. Few businesses are
  there, but code must not crash or return wrong results.
- **The radius is bigger than a cell.** A 3 × 3 block only covers a circle of radius $r$ if every cell is at least
  $r$ wide and tall. Otherwise you need more cells.

**Worked example: covering a 1 km circle in San Francisco.** At latitude 37.77°, length-6 cells are
$1.22 \times \cos 37.77° \approx 0.97$ km wide and 0.61 km tall: **smaller** than 1 km, so the 3 × 3 rule fails.

| Strategy | Cells read | Area read | Compared with the circle (3.14 km²) |
| --- | --- | --- | --- |
| 3 × 3 block of length-5 cells (3.9 km × 4.9 km each) | 9 | about 169 km² | **54×** too much |
| Only the length-6 cells that touch the circle | 11 | about 6.5 km² | about 2× |
| Only the length-7 cells that touch the circle | about 200 | about 3.7 km² | about 1.2×, but about 200 lookups |

This is the core trade-off of every grid index: **big cells mean few lookups but many false candidates; small
cells mean few false candidates but many lookups.** A good choice is the precision whose cell is roughly the size
of the radius, plus a "cover" of the cells that actually touch the circle. Because consecutive cells are often
next to each other on the Z-curve, several cells can be merged into one range scan.

Whatever the cells, the last step is always the same: compute the **exact** haversine distance for each candidate
and drop those outside the circle. Cells only make the candidate list short.

[![Geohash nearby search: the user point picks a precision near the radius size, lists its own cell and neighbours, runs one prefix scan per cell, filters candidates by exact distance and ranks the top 20; if fewer than 20 remain, the radius widens to 2 km then 5 km and the search repeats with a shorter prefix](/img/system-design/yelp/02-geohash-search.png)](/img/system-design/yelp/02-geohash-search.png)

*Select the diagram to zoom in and move around.*

**Sparse areas.** In a village a 1 km circle may hold two cafés. The search widens (2 km, then 5 km, using shorter
geohashes) until it has enough results or reaches a maximum radius, and the response says what radius was used.

### 7.2 Quadtree: a grid that adapts to density

A fixed geohash precision treats Manhattan and the Sahara alike: a length-6 cell may hold 3,000 restaurants in one
place and none in another. A **quadtree** adapts.

**The idea.** Start with one square covering the whole map. If it holds more than a threshold (say **100**
businesses), split it into four equal quadrants: north-west, north-east, south-west, south-east. Repeat for each
quadrant until every leaf holds at most 100. Dense cities end up with many small, deep squares; empty areas stay
as a few big ones.

[![Quadtree: the whole map holds 930 places, so it splits into four; NW (20) and SW (80) are leaves; NE (630, a city) splits again and its downtown quadrant (380) splits once more into four leaves of at most 100; SE (200, a town) splits into four leaves](/img/system-design/yelp/03-quadtree.png)](/img/system-design/yelp/03-quadtree.png)

*Select the diagram to zoom in and move around.*

**Worked example (the diagram).** The map holds 930 places, over the limit of 100, so it splits. NW (20) and
SW (80) are small enough and stay as leaves. NE (630, a city) splits again; its downtown quarter (380) is still
over 100 and splits once more into four leaves of 100, 95, 85 and 100. SE (200, a town) splits once. The
city ends up three levels deep; the countryside one level deep.

**Searching.** To find places within a radius, start at the root and descend only into squares that **intersect**
the circle; at each leaf, check the actual points. For "the 20 nearest", find the leaf containing the user, then
visit neighbouring leaves in order of distance until 20 are found.

**How big is it for 200 million businesses?** With at most 100 per leaf there are at least 2 million leaves, and in
practice around 4 million because leaves are rarely full. Internal nodes number about a third of the leaves, so
roughly 1.3 million, each holding four child pointers and a bounding square, say 64 bytes: about **85 MB**. The
points themselves are the 4.8 GB we estimated. The whole tree fits in one server's memory, and building it means
inserting 200 million points at a depth of about 20 levels: minutes, not hours.

**Why a quadtree usually lives in memory, not in a database.** It is a pointer structure, rebuilt or patched by the
service that owns it. Production designs typically build it at startup from a snapshot, then apply updates from the
change stream (section 10).

### 7.3 Google S2 and Uber H3: better cells for a round Earth

Geohash cuts a flat rectangle of latitude and longitude, so cells distort badly towards the poles and the Z-curve
jumps. Two widely used libraries improve on it.

**S2 (Google).** Project the sphere onto the six faces of a cube, then build a quadtree on each face. Cells are
numbered along a **Hilbert curve**, a space-filling curve that, unlike the Z-curve, never jumps: consecutive
numbers are always adjacent cells. Each cell has a 64-bit ID, there are 31 levels (0 to 30), each level splits a
cell into four, and level-30 cells are smaller than a square centimetre. The killer feature is the **region
coverer**: give it a circle or polygon and a budget (say "at most 8 cells") and it returns a small set of cells of
mixed sizes that covers the shape tightly. Each cell becomes one range scan on a sorted index of cell IDs.

**H3 (Uber).** Tile the globe with **hexagons** at 16 resolutions (0 to 15); each step down makes cells about 7
times smaller in area (resolution 9 hexagons are roughly 0.1 km²). Hexagons have one big advantage: all six
neighbours are the same distance from the centre, so "the ring of cells around me" (`gridDisk`, also called k-ring)
is a natural approximation of a circle, and aggregating by cell (demand heat maps, surge pricing) has no awkward
corner neighbours. The price: hexagons do not nest perfectly (a parent's seven children only approximately fill it).

**When to mention them.** Geohash is the simplest to explain on a whiteboard. S2 gives tighter coverings and
better behaviour on a sphere. H3 is ideal for analytics and "equal-distance" neighbourhoods. All three share the
same pattern: **cell ID → sorted index → range scans → exact distance filter.**

### 7.4 R-trees: what spatial databases use

Geohash, S2 and H3 cut space into fixed cells. An **R-tree** instead groups **nearby objects** into boxes.

- Each leaf holds a handful of objects and the **minimum bounding rectangle** (MBR) around them: the smallest box
  that contains them all.
- Each parent holds the MBR of its children, up to the root. Boxes may overlap.
- A query descends only into boxes that intersect the search area, exactly like a quadtree, but the boxes fit the
  data, not a fixed grid.

R-trees shine when the data are **shapes**, not points: delivery zones, neighbourhood boundaries, a park's
outline. "Which delivery zones contain this address?" is natural for an R-tree and awkward for a grid.

**PostGIS** (the spatial extension for PostgreSQL) builds R-tree-style indexes through PostgreSQL's GiST index
framework:

```sql
CREATE INDEX business_geo_idx ON business USING GIST (geog);

-- within 1 km (geography type: distances in metres)
SELECT id, name FROM business
WHERE ST_DWithin(geog, ST_MakePoint(-122.4194, 37.7749)::geography, 1000);

-- the 20 nearest, using the index-assisted distance operator
SELECT id, name FROM business
ORDER BY geog <-> ST_MakePoint(-122.4194, 37.7749)::geography
LIMIT 20;
```

Search engines use a close relative: Lucene (inside Elasticsearch and OpenSearch) indexes `geo_point` fields with
a **BKD tree**, a block-based k-d tree that splits space alternately along each axis.

### 7.5 Choosing an index

| Index | Shape of cells | Adapts to density? | Stored in | Best for |
| --- | --- | --- | --- | --- |
| Plain B-tree on `lat`, `lng` | none | no | any SQL DB | tiny datasets only |
| Geohash | fixed rectangles, Z-order | no (pick a precision) | any sorted store, Redis | simple, easy to shard and cache |
| Quadtree | squares, split by count | **yes** | application memory | in-memory nearby / k-nearest |
| S2 | cube-face quadtree, Hilbert order | via mixed-level coverings | any sorted store | tight coverings, polygons, global data |
| H3 | hexagons | no (pick a resolution) | any store | neighbour rings, aggregation, analytics |
| R-tree (PostGIS GiST) | boxes around the data | **yes** | spatial database | shapes and polygons, ad-hoc SQL |
| BKD tree (Lucene) | k-d splits | **yes** | search engine | combining geo with text and filters |

For our service: the **search cluster** (BKD tree) handles queries with text and filters; a small **in-memory
geo index** (geohash buckets or a quadtree) handles the hottest pure "nearby" and map-pin requests. Interviewers
accept any of these if you can explain the trade-off.

## 8. Flow: a search request

A user in San Francisco searches "pizza, open now, within 2 km".

[![Search sequence: the app calls the search service, which builds a cache key from geohash cell 9q8yyk, the query and filters; on a cache miss it asks the search cluster to match pizza within 2 km and open now, each shard returning its best 100 for a merge; it caches the result for 5 minutes, batch-fetches details for 20 IDs from the business service and replies with 20 results and a cursor](/img/system-design/yelp/04-nearby-search.png)](/img/system-design/yelp/04-nearby-search.png)

*Select the diagram to zoom in and move around.*

The search cluster does **text + geo + filters in one query**. Conceptually (Elasticsearch-style syntax):

```json
{
  "query": {
    "function_score": {
      "query": {
        "bool": {
          "must":   [{ "match": { "name_and_categories": "pizza" } }],
          "filter": [
            { "geo_distance": { "distance": "2km", "location": { "lat": 37.7749, "lon": -122.4194 } } },
            { "term":  { "open_now_bucket": "mon-19" } },
            { "terms": { "price_level": [1, 2] } }
          ]
        }
      },
      "functions": [
        { "exp": { "location": { "origin": "37.7749,-122.4194", "scale": "2km", "decay": 0.5 } } },
        { "field_value_factor": { "field": "bayes_rating" } }
      ]
    }
  },
  "size": 100
}
```

Reading it from the inside out:

- **`filter`** clauses are yes/no and cacheable: inside 2 km, open at this hour, price level 1 or 2. They shrink
  the candidate set without affecting the score.
- **`must`** matches the text "pizza" against names, categories and menu keywords, giving a relevance score.
- **`functions`** blend in distance (closer is better, halving every 2 km) and quality (the Bayesian rating,
  section 12).
- **"Open now"** is hard to filter on the fly across time zones. A common trick is to precompute, at index time,
  the set of weekly hour-buckets each business is open in (`mon-19` means Monday 19:00 to 19:59 local time), so
  the filter is a simple term match.

**How the cluster spreads the work.** The index is split into shards. A coordinating node sends the query to the
relevant shards, each returns its best 100 with scores, and the coordinator merges them (scatter-gather). Section 10
compares sharding strategies.

**Map viewport search.** When the user pans the map, the app sends the visible box instead of a radius, and the
filter becomes a bounding-box filter. Two details matter:

- **Debounce.** The app waits until panning stops (for example 300 ms) and offers "Search this area" instead of
  firing a query on every frame.
- **Zoomed out, show clusters, not pins.** At city or country zoom a box may contain 100,000 places. The server
  returns the top results plus **counts per grid cell** (a geohash-grid aggregation), which the app draws as
  numbered bubbles.

## 9. Data model: businesses, reviews and photos

[![Data model: user owns businesses and writes reviews and photos; business holds lat, lng, geohash, hours, rating_sum and review_count; business_category maps a business to its categories; review links a business and a user with a rating; photo links a business, a user and optionally a review, with its object storage key](/img/system-design/yelp/05-data-model.png)](/img/system-design/yelp/05-data-model.png)

*Select the diagram to zoom in and move around.*

Decisions hidden in this diagram:

**1. The business row is the source of truth for location.** `lat` and `lng` are the real values; `geohash` is a
derived column (computed on write) so that even the database can answer coarse geo queries and so that indexers can
route a business to the right geo shard.

**2. Store the rating as a sum and a count, not an average.** With `rating_sum` and `review_count`, adding a review
is two increments and the average is a division at read time. Example: a café with 120 reviews averaging 4.2 has
`rating_sum = 504`. A new 5-star review makes it $509 / 121 \approx 4.21$. Storing only the average would need the
old count anyway, and concurrent updates on an average are easy to get wrong. Editing a review applies the
difference (a 3 changed to 5 adds 2 to the sum); deleting subtracts.

**3. Reviews are sharded by `business_id`.** The most common review query is "the newest reviews for this
business", so all of a business's reviews live together, sorted by `(business_id, created_at DESC)`. A secondary
index (or a separate table) by `user_id` serves "my reviews".

**4. Photos are metadata rows plus objects.** The row stores who, which business, and the `object_key`; the bytes
live in object storage. On upload, a worker creates resized versions (thumbnail, medium, large) and strips
location metadata from the image file for privacy. The app loads `https://cdn.example.com/<object_key>/thumb.webp`,
so photo traffic never touches our servers.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Businesses | 200M rows, 400 GB, updated rarely | Sharded relational DB (MySQL, PostgreSQL) or a document store | Transactions for owner edits; easy to shard by business ID |
| Reviews | 2B rows, append-mostly, read by business | Wide-column store (Cassandra) or sharded SQL | Sorted ranges per business; scales horizontally |
| Photos | 1 PB of immutable bytes | Object storage + CDN | Cheapest per byte, built for durability and fan-out |
| Search | Text + geo + filters | Elasticsearch / OpenSearch | Inverted index and BKD geo index in one engine |
| Hot geo | 5–10 GB of points | In-memory geo index (or Redis `GEO`) | Sub-millisecond nearby lookups |
| Caches | Search results, business cards | Redis / Memcached | Most traffic is popular places and popular areas |

## 10. Building and serving the in-memory geo index

### Build, load, keep fresh

1. **Snapshot.** A batch job reads all active businesses (ID, lat, lng, a few filter fields) and writes a compact
   file to object storage, together with the **event-stream position** it was taken at.
2. **Load.** A new geo index server downloads the latest snapshot, builds its quadtree or geohash buckets in memory
   (minutes for 200 million points), and only then joins the load balancer.
3. **Catch up.** It replays change events from the snapshot's stream position, applying "add", "move" and "remove"
   operations, and keeps consuming them live. A business that moved is removed from its old cell and inserted
   into its new one.

Because each server builds its own copy from the same snapshot and the same ordered events, all replicas converge
to the same index. A crashed server is simply replaced; it holds no unique data.

### Replicas for throughput and availability

At 17,000 searches per second at peak, if one server handles about 5,000 queries per second, we need 4 servers per
region, plus spares for failures and deploys: say **6 replicas per region**, spread over at least three
availability zones. Every replica holds the full index; the load balancer can send any query to any of them.

### Sharding: by region or by business ID?

If the index outgrows one machine (more data per business, more filter fields, many more places), we split it.
There are two natural ways.

[![Two ways to shard: by region, a geo router sends a query near Denver only to the Central shard, and to the West shard only if the circle crosses the border, while the East shard is not asked; by business ID, an aggregator asks every shard for its top 20 near the point and merges them](/img/system-design/yelp/06-sharding.png)](/img/system-design/yelp/06-sharding.png)

*Select the diagram to zoom in and move around.*

| | **A. Shard by region** (geohash prefix, S2 cell range) | **B. Shard by business ID** (hash of ID) |
| --- | --- | --- |
| A query touches | Usually **one** shard; two or more when the circle crosses a border | **Every** shard (scatter-gather) |
| Load balance | **Uneven**: Manhattan's shard is far hotter and bigger than rural Nevada's | **Even**: hashing spreads data and load |
| Hot spots | Big events (a festival, New Year's Eve in Times Square) melt one shard | Spread across all shards |
| Fix for imbalance | Split dense regions into smaller shards (by density, like a quadtree); add replicas to hot shards | Nothing needed |
| Tail latency | Low: one shard answers | The slowest of N shards decides; more shards, worse tail |
| Moving business | May change shards (delete here, insert there) | Never changes shard |

**What we choose.** Search engines usually shard by document ID (option B) and accept scatter-gather, because it
balances load automatically and each shard's geo filter is fast. For a dedicated geo index the data are small, so the
best first answer is **no sharding: full replicas**. If we must shard, shard **by region with density-based
boundaries** (draw shard borders so each holds a similar number of businesses, exactly like quadtree splits) and
add replicas to hot regions. Users in one city mostly search that city, which also keeps the caches warm.

## 11. Caching: the 500-to-1 advantage

Each layer catches a different kind of repeat.

- **CDN for photos and static map tiles.** The biggest win by bytes.
- **Business card cache** (Redis or Memcached, keyed by business ID): name, rating, top photo. Popular places are
  read millions of times between edits. Invalidated by the change stream when the business or its rating changes,
  with a TTL (say 1 hour) as a safety net.
- **Search result cache.** Every user stands at a slightly different spot, so caching by exact coordinates
  would never hit. Instead **snap the location to a cell**: the key is
  `(geohash 9q8yyk, "pizza", open_now, price 1-2)`. Everyone inside that 1.2 km × 0.6 km cell asking the same
  question shares one cached candidate list (say the top 100, searched from the cell's centre with the radius
  enlarged by the cell's half-diagonal so nobody's circle is cut short). The service then recomputes the exact
  distance from each user's real point and re-sorts. A short TTL (minutes) keeps "open now" and new reviews
  fresh enough.
- **Popular queries at popular places** ("coffee" near a big station) can be pre-warmed.

Typical hit rates are high for the business cache and moderate for search, because the long tail of queries is
long. Even a 50% search hit rate halves the load on the search cluster.

## 12. Ranking: what "best" means

Distance alone is a poor ranking: the nearest pizza place may be awful. Rating alone is also poor: a brand-new place
with one 5-star review would beat a beloved institution. Ranking blends many **signals**:

| Signal | Example |
| --- | --- |
| **Text relevance** | "pizza" in the name or category beats "pizza" mentioned once in a review |
| **Distance** | Closer is better, with a decay curve rather than a hard cut-off |
| **Quality** | Rating adjusted for the number of reviews (below) |
| **Popularity** | Review count, recent check-ins, how often people tap and then call or get directions |
| **Freshness and status** | Open now, recently updated hours, not marked closed |
| **Personalisation** | Your price range, cuisines you like, places you saved |
| **Business rules** | Sponsored results, labelled as ads, in fixed slots |

**Worked example: why a raw average misleads.** A Bayesian average pulls ratings with few reviews towards the
global average $m$ until they earn their score: $\text{score} = \dfrac{C \cdot m + \text{sum}}{C + \text{count}}$.
With $m = 3.8$ and $C = 20$ "virtual reviews", and a distance factor of $0.5^{d / 2\text{ km}}$ (halves every 2 km):

| Place | Distance | Raw rating (reviews) | Bayesian rating | Distance factor | Raw × factor | **Bayesian × factor** |
| --- | --- | --- | --- | --- | --- | --- |
| A | 0.5 km | 5.0 (2) | 3.91 | 0.84 | 4.20 (1st) | **3.29 (2nd)** |
| B | 0.8 km | 4.6 (500) | 4.57 | 0.76 | 3.49 (2nd) | **3.46 (1st)** |
| C | 1.5 km | 4.8 (900) | 4.78 | 0.59 | 2.85 (3rd) | **2.84 (3rd)** |

With raw ratings, two friends' 5-star reviews put place A on top. With the Bayesian rating, B's 500 reviews win.
(For A: $(20 \times 3.8 + 2 \times 5) / 22 = 86 / 22 \approx 3.91$.)

In practice a hand-tuned formula like this is the first version; mature systems train a **learning-to-rank**
model on clicks, calls and direction requests, and run it as a second stage on the top few hundred candidates
the search cluster returns. Expensive scoring on a short list, cheap filtering on the long one.

## 13. Updates: adding and editing businesses, posting reviews

[![Update pipeline: an owner edit updates the Business DB and a new review is inserted into the Review DB, each with an outbox; change events keyed by business feed the search indexer, which upserts documents in the search cluster, the geo updater, which moves points in the geo index replicas, and the rating aggregator, which updates the business row's sum and count and purges the cached card](/img/system-design/yelp/07-updates.png)](/img/system-design/yelp/07-updates.png)

*Select the diagram to zoom in and move around.*

- **Write once to the source of truth.** The owner's edit is a normal database transaction on the business row.
- **Never "write to the DB and then to the index" from the request.** If the service crashes between the two, the
  copies disagree forever. Instead use **change data capture** (CDC: reading the database's own change log) or a
  **transactional outbox** (an `outbox` table written in the same transaction, published by a relay). Either way,
  the event exists if and only if the change committed.
- **Key events by business ID.** All events for one business go to the same stream partition, so they are applied
  in order: "move to Main St" can never be overtaken by an older "move to Oak Ave".
- **Consumers are idempotent.** Each event carries the business's version number; an indexer ignores any event
  older than what it has already applied, so replays and duplicates are harmless.
- **A new review** inserts a row, emits "review added"; the rating aggregator adds to `rating_sum` and
  `review_count` on the business row (an atomic increment, or a small batch per business every few seconds for
  very popular places). That change itself emits "business changed", which reindexes the search document with the
  new rating and purges the cached card. One mechanism, no special cases.
- **New businesses are verified first.** User-submitted places go through checks (duplicates, fake listings,
  address geocoding) with status `pending`; only `active` businesses are indexed. Geocoding turns the typed
  address into latitude and longitude; owners can drag the pin to correct it.
- **Freshness.** Typical end-to-end lag is seconds. Some designs instead rebuild the geo index nightly from a
  snapshot; that is simpler and acceptable if the requirement is "new places within a day", and it is worth stating
  which one you chose.

## 14. What breaks as it grows, and how to fix it

**Dense cities.** A 1 km circle in central Tokyo can hold thousands of restaurants. *Fix:* use finer cells (or the
quadtree's deeper leaves) there, cap candidates per cell by a precomputed quality order, and let ranking work on the
top few hundred, not all of them.

**Hot events.** A stadium concert sends 50,000 people to search "bar" in one cell at once. *Fix:* the cell-snapped
result cache absorbs identical queries; replicas of the hot region scale out; request coalescing makes one cache
miss trigger one backend query, not 50,000.

**Huge viewports.** A user zoomed out to a whole country. *Fix:* cap results, return cell-level counts for clusters,
and only fetch individual pins once zoomed in.

**Reindexing everything.** Changing the ranking schema needs a full rebuild of 200 million documents. *Fix:* build a
new index in the background from a snapshot plus the change stream, then switch an alias atomically; the old index
serves until the new one catches up.

**Review spam and rating attacks.** A business buys fake 5-star reviews, or a rival posts 1-star ones. *Fix:* a
moderation pipeline (account age, burst detection, text similarity) that holds suspect reviews out of the aggregate;
the sum-and-count design makes removing a review an easy subtraction.

**Many countries, many latencies.** *Fix:* deploy the read path (search cluster replicas, geo index, caches) in each
geographic region close to users; a business in Paris is mostly searched from Paris, so each region can hold only its
own businesses plus a global fallback.

## 15. Reliability and failure handling

| Risk | Defence |
| --- | --- |
| A geo index replica crashes | Stateless copy: the load balancer drops it, a new one loads the snapshot and replays events |
| The search cluster is slow or partly down | Shards have replicas; on timeout, return partial results from the shards that answered, or fall back to the geo index for pure "nearby" results without text |
| The event stream lags | Search shows slightly stale data (still correct for the vast majority of places); alert on consumer lag; reads keep working |
| An index and the DB drift apart | Periodic reconciliation compares versions in the DB with the index and re-emits missing changes; a nightly full rebuild is the last resort |
| Cache failure | Requests fall through to the indexes; request coalescing and rate limits protect them from a stampede |
| Duplicate review on retry | `Idempotency-Key` on `POST /reviews`, stored for a day |
| A whole region fails | DNS / global load balancer routes users to the next region, which serves the same global catalogue (a little slower) |

The pattern to remember: **the database is the only thing that must never lose data**; every index and cache can be
rebuilt from it, so they are designed to be disposable.

## 16. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Spatial index | Geohash (fixed grid) | Quadtree (adaptive) | **Either**: geohash for simplicity, sharding and cache keys; quadtree for uneven density in memory |
| Where the geo index lives | Inside the database (PostGIS) | In memory in a dedicated service | **Memory** for the hot path (only ~5–10 GB); PostGIS for admin and ad-hoc queries |
| Text + geo search | Geo index, then filter text in the app | One search engine with geo support | **Search engine**: one query, one ranking, proper text relevance |
| Sharding | By region | By business ID | **Replicate first**; if forced, region with density-based borders for a dedicated geo index, ID hashing inside the search engine |
| Index freshness | Real-time stream | Nightly rebuild | **Stream** (seconds) plus nightly rebuild as a safety net |
| Rating storage | Store the average | Store sum and count | **Sum and count**: exact, cheap to update, easy to correct |
| Search cache key | Exact coordinates | Snapped to a cell | **Cell**: shareable across nearby users; exact distance recomputed per user |

## Cheat sheet for last-minute revision

- **The core problem:** a B-tree sorts along one line; a radius query is two-dimensional. A `lat` range scan reads
  a ring around the planet (about 15,800× the box at 37° latitude).
- **Geohash:** alternate longitude/latitude halving → bits → base32. Shared prefix = shared area. Length 5 ≈ 4.9 km,
  6 ≈ 1.2 × 0.6 km, 7 ≈ 153 m. Always search the cell **and its 8 neighbours** (or a cover of touching cells), then
  filter by exact distance. Edge cases: equator / prime meridian (`s00000` vs `7zzzzz`), 180° wrap, poles, radius
  bigger than a cell.
- **Quadtree:** split any square over a threshold (say 100) into four; adapts to density; ~4M leaves for 200M places;
  fits in memory.
- **S2:** cube faces + quadtree + Hilbert curve, 64-bit cell IDs, region coverer. **H3:** hexagons, equal-distance
  neighbours, great for aggregation. **R-tree:** bounding boxes around data; PostGIS GiST; best for polygons.
- **Search = text + geo + filters** in one search-engine query; precompute "open now" buckets; scatter-gather over
  shards; cursor pagination.
- **Numbers:** 200M businesses; ~17K searches/s at peak; ~500:1 reads to writes; geo index ~5–10 GB (fits in RAM);
  photos ~1 PB (object storage + CDN).
- **Serving:** in-memory geo index built from snapshot + event replay; full replicas first; shard by region with
  density-based borders only if needed.
- **Caching:** CDN for photos, business-card cache, search cache keyed by **snapped cell** + query + filters.
- **Ratings:** store `rating_sum` and `review_count`; rank with a Bayesian average and a distance decay.
- **Updates:** one source of truth → CDC / outbox → events keyed by business → idempotent indexers; seconds of lag.

## Practice questions

1. **Why can't you just add an index on `(lat, lng)`?** A composite B-tree index is sorted by `lat` first, so a
   radius query scans every row in a thin latitude ring around the world and filters `lng` row by row. You need an
   index where nearby points sit close together: geohash or S2 cell IDs (one-dimensional), or a spatial tree.
2. **A user is 10 m from a cell edge and misses a café across the line. What went wrong?** The search looked only
   at the user's own cell. Always include neighbouring cells (or a cover of every cell touching the circle), then
   filter by exact distance.
3. **How would you find the 10 nearest petrol stations, however far?** Start with a small radius (one cell and its
   neighbours), and if fewer than 10 are found, widen step by step (shorter geohash, or visit quadtree leaves in
   order of distance) until 10 are found and the 10th is closer than any unvisited area.
4. **How would you support drivers or friends whose locations change every few seconds?** Different write
   pattern: keep locations only in memory (for example Redis `GEO` or an in-memory grid per city), updated by
   frequent pings with a short TTL, and do not reindex a search engine on every move.
5. **How do you show "open now" correctly for a business in another time zone?** Store hours in the business's
   local time with its time zone; at index time expand them into weekly hour-buckets (in UTC or local time
   consistently) and filter on the bucket for the current moment; handle overnight hours (18:00 to 02:00) and
   daylight-saving changes in that expansion.
6. **How would you add "search along my route"?** Turn the route into a corridor polygon (the path buffered by, say,
   1 km), cover it with S2 or geohash cells, query those cells, and rank by detour time rather than straight-line
   distance.
