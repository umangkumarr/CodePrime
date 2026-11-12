---
title: "Design Google Maps (maps, routing, ETAs, live traffic)"
description: "Design Google Maps: map tiles and CDN, routing with Dijkstra, A* and contraction hierarchies, live traffic from phones, ETAs and rerouting."
difficulty: "Hard"
sidebar:
  label: "Google Maps (routing, ETAs, traffic)"
tags: ["Geospatial", "Graphs", "Routing", "CDN", "Streaming"]
---

A maps app looks like one product: you open it, see the streets, type a place and press **Directions**. Under
the surface it is four very different systems glued together. It is a **picture library** that serves trillions
of possible map images, a **road atlas** stored as a giant graph that answers "fastest way from A to B" in a
few milliseconds, a **traffic sensor network** made of millions of phones that tells us how fast every road is
moving right now, and a **co-driver** that sits in your pocket, watches where you are and says "turn left in
200 metres".

This case study builds that system from first principles. We start with how a map is drawn and how roads become
a graph, then design the service layer by layer, go deep on the parts interviewers push on (tiles, routing
algorithms, live traffic and ETAs), and finish with what breaks as it grows and a one-page revision sheet.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one. Section 8 (routing) is
the heart of the problem and worth reading slowly.
:::

## 1. Maps in 5 minutes: the vocabulary

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Tile** | A small square piece of the map (traditionally 256 × 256 pixels) for one area at one zoom level | One page of a road atlas |
| **Zoom level** (`z`) | How far in you are. At zoom 0 the whole world is one tile; each level up doubles the detail in both directions | Turning the atlas from "Europe" to "your town" |
| **Web Mercator** | The map projection almost every web map uses: it flattens the globe into a square, so it can be cut into square tiles | Peeling an orange and pressing the peel flat |
| **Raster tile / vector tile** | A raster tile is a ready-made picture (PNG, JPEG). A vector tile is the raw shapes (lines, polygons, labels) that the phone draws itself | A photo of a page vs the instructions to draw it |
| **Road graph** | Junctions are **nodes**, road pieces between them are **edges**, each edge has a **weight** (usually travel time) | The atlas with every road drawn as a line between dots |
| **Segment** | One edge of the road graph: a stretch of road between two junctions | One block of a street |
| **Geocoding** | Turning text ("10 Downing Street") into coordinates; **reverse geocoding** goes the other way | Looking up an address in the atlas index |
| **Map-matching** | Snapping a noisy GPS trace onto the roads the device was really on | Guessing which road a friend took from blurry photos along the way |
| **ETA** | Estimated time of arrival | "We'll be there in 23 minutes" |
| **Polyline** | A route sent to the app as a compact list of points to draw | The highlighter line on the atlas |

Two facts shape the whole design:

1. **The map is mostly static; traffic is not.** Streets change slowly (a new road opens, a shop closes), so
   map images can be built in advance and cached for days. Road speeds change every minute, so anything that
   depends on traffic (routes, ETAs, the red and green overlay) must be computed fresh.
2. **Routing is a graph problem at continental scale.** Textbook shortest-path algorithms are correct but far too
   slow on a graph with hundreds of millions of junctions. The interesting engineering is the
   **preprocessing** that makes them fast.

## 2. Requirements

### Functional (what users can do)

- **View the map**: pan and zoom anywhere on Earth, smoothly, with roads, labels, buildings and satellite imagery.
- **Search** for a place or address and see it on the map (**geocoding**), and see "what is here" when you
  long-press the map (**reverse geocoding**).
- **Directions** from A to B by car (walking, cycling and transit work the same way with different graphs and
  weights), with two or three **alternative routes** and an **ETA** for each.
- **Live traffic**: the coloured overlay on roads, and routes and ETAs that account for current traffic.
- **Turn-by-turn navigation**: voice prompts, a live ETA, automatic **rerouting** when you miss a turn, and
  offers of a faster route if traffic changes.
- **Offline maps**: download an area and still see the map, search and get driving directions without signal.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Latency** | Map tiles under 100 ms (from a nearby cache); a route with ETAs under ~500 ms end to end | Panning must feel instant; directions should appear as you tap |
| **Availability** | 99.99% for tiles, routing and navigation | People rely on it while driving, often in unfamiliar places |
| **Scale** | Public figures put Google Maps at over a billion monthly users; we design for ~300 million daily users | Planet-sized |
| **Freshness** | Traffic reflected in routes within about a minute; map edits visible within hours to days | Old traffic is useless; a closed road must stop being suggested |
| **Accuracy** | Routes must be truly shortest by the current weights; ETAs within a few minutes on typical trips | A wrong ETA breaks trust faster than a slow app |
| **Privacy** | Location data used for traffic is anonymised and aggregated; no one's trips can be reconstructed | Location history is extremely sensitive |
| **Cost** | Serve most traffic from caches and precomputed data | Billions of requests a day must be cheap per request |

### Out of scope

Collecting map data itself (Street View cars, satellite imagery, surveying), public transport timetables, ride
hailing (see the [Uber case study](/system-design/case-studies/hard/uber/)), ads, reviews and photos of places.
Mention them in an interview, then set them aside.

## 3. Back-of-the-envelope estimates

Round numbers are fine; the goal is to find **which resources dominate**. Every number below is an assumption
for practice, not a published figure.

**Assumptions:** 300 million daily active users. Each loads about **100 tiles** a day while browsing. There are
**300 million** route requests a day, and **100 million** navigation sessions averaging **20 minutes**, during
which the ETA and traffic are refreshed about **once a minute**. Peak traffic is **3×** the average.

**Tiles (the biggest request volume)**

- Requests: $300\text{M} \times 100 = 30\text{B}$ tiles a day, about **350,000 per second** on average and roughly
  **1 million per second** at peak.
- A phone screen of about 400 × 850 logical pixels needs roughly 2 × 4 tiles of 256 px, plus a ring of partly
  visible ones: about **12 tiles per screen**.
- With a **95%** CDN hit rate, the origin sees about $1\text{M} \times 5\% = 50{,}000$ requests per second at
  peak. The CDN does almost all the work.

**How many tiles exist?** At zoom $z$ the world is a $2^z \times 2^z$ grid, so it has $4^z$ tiles.

| Zoom | Tiles at this level | Roughly shows | Metres per pixel at the equator |
| --- | --- | --- | --- |
| 0 | 1 | The whole world | ~156,000 |
| 5 | 1,024 | Large countries | ~4,900 |
| 10 | ~1 million | A city | ~150 |
| 15 | ~1.07 billion | Streets | ~4.8 |
| 18 | ~69 billion | Buildings | ~0.6 |
| 20 | ~1.1 trillion | Individual houses | ~0.15 |

The total for all levels from 0 to $z$ is $(4^{z+1} - 1)/3$, about **one third more** than the last level alone.

- **Vector tiles up to zoom 16:** $(4^{17} - 1)/3 \approx 5.7\text{B}$ tiles. About 70% of Earth is ocean and
  much of the land is empty, so assume only **30%** have content (empty tiles are stored once and shared):
  $5.7\text{B} \times 30\% \times 20\text{ KB} \approx 34\text{ TB}$. Small enough to rebuild often. The phone
  draws deeper zooms by **over-zooming** the zoom-16 shapes, because vector shapes scale without blurring.
- **Satellite raster tiles to zoom 18 over land:** $69\text{B} \times 30\% \times 20\text{ KB} \approx 400\text{ TB}$
  per imagery layer. Raster cannot be over-zoomed without blurring, so every deep level must be stored.

**Routing**

- Route requests: $300\text{M} / 86{,}400 \approx 3{,}500$ per second, about **10,000 per second** at peak.
- ETA refreshes during navigation: $100\text{M} \times 20 = 2\text{B}$ a day, about **23,000 per second**
  and roughly **70,000 per second** at peak.
- With preprocessing (section 8) a route query takes about **1 ms of CPU**, plus a few ms for alternatives and
  ETA scoring. Even 10 ms per request at 10,000 requests per second is only 100 busy CPU cores. **Routing is
  not CPU-bound once preprocessed; it is memory-bound**, because the whole graph lives in RAM.
- Graph size: assume **500 million** junctions and **1.2 billion** directed road segments worldwide. Each edge
  needs a target node and a weight (8 bytes), and preprocessing roughly doubles the edge count with shortcuts:
  $1.2\text{B} \times 2 \times 8\text{ B} \approx 19\text{ GB}$, plus node coordinates and IDs
  ($500\text{M} \times 12\text{ B} = 6\text{ GB}$). Around **30–50 GB** for the world: it fits in one large
  server's memory, and we keep many copies (replicas) in every region.

**Live traffic**

- Assume **20 million** phones are contributing at peak, each recording a position every **5 seconds** and
  uploading a batch every 30 seconds: $20\text{M} / 5 = 4\text{M}$ positions per second in about 670,000
  uploads per second. At ~50 bytes a position that is about **200 MB/s** of incoming data.
- Live speed table: say **1 billion** road segments × 16 bytes ≈ **16 GB**, comfortably in memory.
- Speed history: one typical speed per segment for each of the **168 hours of the week**, 2 bytes each:
  $1\text{B} \times 168 \times 2\text{ B} \approx 340\text{ GB}$.

Three conclusions follow:

1. **Tiles are a caching problem.** They are precomputed, immutable and cache-friendly, so a CDN serves them.
2. **Routing is an algorithm and memory problem.** The graph must sit in RAM, and precomputation turns seconds
   of search into a millisecond.
3. **Traffic is a streaming problem.** Millions of noisy positions per second must become one clean speed per
   road segment, every minute.

## 4. The API

Clients talk to us over HTTPS. Tiles are plain, cacheable `GET` requests; everything else is a JSON API.

| Method and path | What it does |
| --- | --- |
| `GET /tiles/{layer}/{z}/{x}/{y}?v=2026-11-10` | One tile (vector or raster) of a layer: roads, satellite, traffic. Served by the CDN. The version in the URL changes when the tile is rebuilt, so the cache never serves a stale one. |
| `GET /v1/geocode?q=Central+Station&near=53.35,-6.26` | Text to places: a list of candidates with a place ID, name, address and coordinates. |
| `GET /v1/reverse-geocode?lat=53.35&lng=-6.26` | Coordinates to the nearest address or place. |
| `POST /v1/routes` | Body: origin, destination (coordinates or place IDs), optional waypoints, mode (`drive`, `walk`, `bike`), options (avoid tolls, depart at). Returns up to three routes, each with an encoded polyline, step-by-step instructions, distance and ETA. |
| `POST /v1/navigation/{session_id}/refresh` | During navigation: "here is where I am on route R"; returns an updated ETA, traffic along the rest of the route, and a faster route if one exists. |
| `POST /v1/locations/batch` | Opted-in phones upload a batch of anonymised positions (time, latitude, longitude, speed, heading, accuracy). |
| `GET /v1/offline/regions/{region_id}` | A manifest of files for an offline area: tiles, routing graph, search index, and their versions. |

Why are tiles addressed as `z/x/y`? Because the address *is* the cache key. Any client asking for the same area
at the same zoom asks for exactly the same URL, so one copy at a CDN edge serves everyone nearby.

## 5. High-level design

[![High-level architecture: the maps app fetches tiles from a CDN backed by a tile store that an offline tile builder fills from the map database; route and search requests go through the API gateway to the routing service (with the ETA service) and to search and geocoding over a places index; opted-in phones send pings into a location stream that the traffic pipeline map-matches and averages into live speeds and new routing edge weights](/img/system-design/google-maps/01-architecture.png)](/img/system-design/google-maps/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Map database:** the source of truth for roads, turn restrictions, speed limits, place names, building outlines
  and land areas. It changes slowly, through edits and data imports.
- **Tile builder:** an offline batch job that cuts map data into tiles for every zoom level and writes them to
  the **tile store** (object storage keyed by `layer/z/x/y/version`).
- **CDN:** caches tiles at edges close to users. Tiles are immutable per version, so they can be cached for days.
- **API gateway:** authentication, rate limits and routing of API calls to the right service.
- **Routing service:** holds the road graph in memory, with precomputed shortcuts, and finds the best routes.
  The graph is rebuilt from the map database regularly (the dashed arrow) and its **weights** are updated from
  live traffic every minute or so.
- **ETA service:** predicts the travel time of each candidate route from historical speeds, live speeds and a
  machine-learned model.
- **Search and geocoding:** turns text into places using a **places index**; covered in depth in the
  [Yelp case study](/system-design/case-studies/hard/yelp/).
- **Location stream** (for example Kafka): the shock absorber for millions of incoming positions a second.
- **Traffic pipeline:** map-matches positions to road segments, averages speeds per segment and publishes **live
  speeds** and new **edge weights**.

The single most useful idea in this design: **split by rate of change**. The map picture changes over days, so it
is precomputed and cached at the edge. The road graph's *shape* changes over days, so its expensive preprocessing
runs offline. Only the *weights* (traffic) change every minute, so only they are recomputed online.

## 6. Deep dive: drawing the map with tiles

### Why tiles?

Sending "the map of London" as one picture is hopeless: it would be gigabytes, and you only look at a phone-sized
window of it. Instead the world is cut into a fixed grid of squares at each zoom level, and the app asks only for
the squares it can see. Two people looking at the same street ask for the **same** tiles, which is what makes
caching work.

### The tile pyramid

At zoom 0 one tile shows the whole (Web Mercator) world. Each tile at zoom $z$ is split into **four** tiles at
zoom $z+1$, each showing a quarter of the area at twice the detail. Tile `z/x/y` has children
`(z+1)/(2x)/(2y)`, `(z+1)/(2x+1)/(2y)`, `(z+1)/(2x)/(2y+1)` and `(z+1)/(2x+1)/(2y+1)`. Here `x` counts columns
from the west and `y` counts rows from the north.

[![The tile pyramid as a tree: tile 0/0/0 is the whole world; it splits into four zoom-1 tiles (north-west 1/0/0, north-east 1/1/0, south-west 1/0/1, south-east 1/1/1); 1/1/0 splits into four zoom-2 tiles 2/2/0, 2/3/0, 2/2/1 and 2/3/1, and so on down to zoom 20 and beyond](/img/system-design/google-maps/02-tile-pyramid.png)](/img/system-design/google-maps/02-tile-pyramid.png)

*Select the diagram to zoom in and move around.*

This is a **quadtree**, the same structure the [Yelp case study](/system-design/case-studies/hard/yelp/) uses to
index places. Finding the tile for a point is pure arithmetic, no lookup needed:

```text
n = 2^z
x = floor((lng + 180) / 360 * n)
y = floor((1 - ln(tan(lat) + 1/cos(lat)) / π) / 2 * n)      # lat in radians
```

Web Mercator stretches areas near the poles and cannot show them at all beyond about 85° north or south, which
is why it is cut off there. It is used anyway because it keeps shapes locally correct (a crossroads still looks
like a right angle) and makes the world a square.

### Raster or vector tiles?

| | Raster tiles (images) | Vector tiles (shapes) |
| --- | --- | --- |
| What is sent | A finished PNG or JPEG | Compressed geometry and labels (for example the Mapbox Vector Tile format, Protocol Buffers) |
| Who draws | The server, once, at build time | The phone or browser, every frame, usually on the GPU |
| Size | Larger; one image per style and language | Smaller; one tile serves every style |
| Rotation and tilt | Labels rotate with the map and become unreadable | Labels stay upright; 3D tilt and smooth zoom are possible |
| Deeper zooms | Must be stored for every level | The client **over-zooms**: it reuses the deepest tile and scales the shapes |
| Dark mode, language | A separate set of images for each | Same tile, different style sheet applied on the device |
| Best for | Satellite and aerial photos, old or weak devices | Streets, labels, buildings, navigation |

Modern apps use **vector tiles** for the street map and **raster tiles** for satellite imagery, which is a
photograph and has no shapes to send. Google's mobile app moved from image tiles to drawing vectors on the
device around 2010, for exactly the reasons in the table.

### Building and serving tiles

[![Tile pipeline: the map database feeds a vector builder that cuts and simplifies shapes per zoom level into versioned vector tiles; imagery is resampled per zoom into raster tiles; both are served through the CDN edge on a cache miss; the app fetches z/x/y and downloads region packs for offline use](/img/system-design/google-maps/03-tile-pipeline.png)](/img/system-design/google-maps/03-tile-pipeline.png)

*Select the diagram to zoom in and move around.*

- **Generalise per zoom level.** At zoom 5 a motorway is a single line, small streets are dropped, and a
  coastline with a million points is simplified to a few hundred (for example with the Douglas–Peucker
  algorithm). Each tile then stays small, typically tens of kilobytes. Tile builders also include a small
  **buffer** around each tile's edge so lines and labels join without seams.
- **Pre-render, do not render on demand.** Building every tile in a batch job means a request never waits for
  rendering. For the deepest raster levels over empty land or ocean, one shared "blank" tile is stored once.
- **Rebuild only what changed.** When a road is edited, only the tiles that contain it (at every zoom) are
  rebuilt. Because a tile and its parent nest exactly, the affected set is easy to compute: the edit's tile at
  zoom 16 and its ancestors.
- **Version the URL.** A rebuilt tile gets a new version in its URL, so the CDN can cache every tile "forever"
  with no purges, and clients switch to new tiles by fetching a new manifest. The alternative, purging the CDN,
  is slow and unreliable at this scale.
- **Prefetch.** The app also requests the ring of tiles just outside the screen and the parent tiles, so panning
  and zooming out show something instantly while sharper tiles arrive.

**Traffic colours** are a separate layer: either small raster tiles regenerated every minute with a short cache
lifetime, or (better) the app gets a compact list of `segment_id → speed class` for the visible area and colours
the roads itself, since the vector tile already contains the road shapes.

## 7. Deep dive: the road network as a graph

To route, we turn the map into a **directed weighted graph**:

- **Nodes** are junctions (and points where a road's properties change, such as a speed limit).
- **Edges** are road segments between nodes. A two-way street is **two** directed edges; a one-way street is one.
- **Weights** are what we minimise. For "fastest route" the weight is **travel time** in seconds: segment length
  divided by expected speed. For walking it is distance at walking speed; for "avoid tolls" a toll edge is
  removed or penalised.

Real roads need a few extra rules:

- **Turn restrictions** ("no left turn") and **turn costs** (a left turn across traffic takes longer). The usual
  trick is an **edge-based graph**: make each road segment a node, and each allowed turn an edge from one segment
  to the next with the turn's cost. A forbidden turn simply has no edge.
- **Time-dependent weights**: the same road is slow at 08:30 and fast at 03:00. We keep a **typical speed per
  hour of the week** per segment, and a **live speed** when we have recent data.
- **Snapping**: you rarely start exactly on a node. The start and end points are snapped to the nearest
  suitable road segment (not the motorway behind a wall if you are on the side street), and the search starts
  part-way along that edge.

## 8. Deep dive: routing from first principles

### Dijkstra's algorithm: correct, but too slow

**Dijkstra's algorithm** finds the shortest path when all weights are non-negative (travel times always are).
It keeps a **priority queue** of nodes ordered by their best known distance from the start:

1. Set `dist[start] = 0` and every other distance to infinity. Put `start` in the queue.
2. Take the node `u` with the **smallest** distance out of the queue. Its distance is now final ("settled"):
   because weights are non-negative, no path through a farther node can come back cheaper.
3. For each edge `u → v` with weight `w`: if `dist[u] + w < dist[v]`, set `dist[v] = dist[u] + w`, remember
   `u` as `v`'s parent, and put `v` in the queue with its new distance (this is called **relaxing** the edge).
4. Repeat until the destination is settled. Follow the parents back to read off the path.

Its running time is $O((V + E) \log V)$ with a binary heap. The real problem is *which* nodes it settles:
everything closer to the start than the destination. The search grows like a ripple in a pond, a disc around the
start, so the number of settled nodes grows with the **area** of that disc. For a 10-minute trip that is fine;
for Paris to Berlin it settles a large fraction of Europe's millions of junctions. Research benchmarks on the
European road network (about 18 million nodes) put plain Dijkstra at around a second or more per long query.
At 10,000 queries a second, that is far too slow.

### Two cheap improvements: bidirectional search and A*

**Bidirectional Dijkstra** runs one search forwards from the start and one **backwards** (on reversed edges)
from the destination, alternating between them. Each keeps `μ`, the best total `dist_forward[v] + dist_backward[v]`
over any node `v` seen by both. It can stop once the two smallest queue keys add up to at least `μ`; at that
point no undiscovered path can be shorter. Two discs of half the radius cover about half the area of one big
disc, so it settles roughly half as many nodes. A useful 2×, nowhere near enough.

**A*** ("A star") steers the search towards the destination. Instead of ordering the queue by `dist[u]`, it uses
`dist[u] + h(u)`, where `h(u)` is an **estimate** of the remaining cost from `u` to the destination. If `h` never
overestimates (it is **admissible**) and satisfies `h(u) ≤ w(u, v) + h(v)` for every edge (it is
**consistent**), A* still returns the exact shortest path, and settles fewer nodes the closer `h` is to the
truth.

For travel time, the obvious estimate is the straight-line distance divided by the **highest speed allowed
anywhere** (say 130 km/h). It must use the highest speed, or it could overestimate on a motorway and break
correctness. But most trips run well below that speed, so the estimate is far too low and A* still explores a
wide area: a typical speed-up of only a few times. A* helps much more with better estimates such as
**landmarks** (ALT: precompute exact distances to a dozen chosen landmark nodes and use the triangle inequality),
which is already a form of precomputation. And precomputation is where the big wins are.

### The key idea: precompute the road hierarchy

Think about how you actually drive from a house in one town to a house in another: small street → main road →
motorway → main road → small street. You **never** need to consider the side streets of the towns you pass
through. Fast routing algorithms turn that intuition into a guarantee. The best known one is the **contraction
hierarchy** (CH).

**Preprocessing (offline, minutes to hours):**

1. Rank every node by **importance**. Nodes on quiet residential streets get low ranks, motorway junctions get
   high ranks. Ranking uses heuristics, such as how many shortcuts removing the node would create.
2. **Contract** nodes one by one, least important first. To contract node `v`, remove it from the graph. For
   every pair of a neighbour `u` with an edge into `v` and a neighbour `w` with an edge out of `v`: if
   `u → v → w` is the **only** shortest path from `u` to `w`, add a **shortcut** edge `u → w` with weight
   `w(u, v) + w(v, w)`, and record that it goes "via `v`". To check, run a small local Dijkstra from `u` that
   avoids `v` (a **witness search**). If it finds another path at most as short, no shortcut is needed.
3. Keep all the original edges and all the shortcuts, and remember each node's rank.

[![Contraction example: junctions A, B, C, D, E in a row with travel times A to B 4 min, B to C 2 min, C to D 3 min, D to E 5 min, plus a detour B to F 6 min and F to D 4 min; contracting C, the least important junction, adds the shortcut B to D of 5 min via C because the only other way, through F, takes 10 min](/img/system-design/google-maps/04-shortcut.png)](/img/system-design/google-maps/04-shortcut.png)

*Select the diagram to zoom in and move around.*

In the example (arrows show the direction of travel), contracting C removes the path `B → C → D` of
$2 + 3 = 5$ minutes. The witness search from B, avoiding C, finds only `B → F → D` at $6 + 4 = 10$ minutes, which
is longer, so we must add the shortcut `B → D` = 5 minutes. Had the detour taken 5 minutes or less, no shortcut
would be needed. On real road networks only a modest number of shortcuts is created, roughly as many as there
are original edges.

**Query (online, under a millisecond):**

1. Run a bidirectional Dijkstra, with one restriction: the forward search from the start only follows edges
   that go **up** to a higher-ranked node, and the backward search from the destination also only goes **up**
   (on reversed edges).
2. Both searches climb the hierarchy and meet near the top, around the motorway junctions. Each search stops when
   its smallest queue key is at least the best total `μ` found so far. The meeting node with the smallest total
   gives the answer.
3. **Unpack** the shortcuts: replace each shortcut by the two edges it stands for, recursively (via the stored
   middle node), to recover the real road-by-road path for the polyline and the turn instructions.

**Why is this exact, not an approximation?** Take any shortest path and look at its highest-ranked node. Every
lower-ranked node on the path was contracted at some point while its neighbours on the path were still present,
so either a shortcut was added that skips it, or the witness search found another path that is just as short.
Repeating this, there is always an equally short path that only goes up in rank from the start to the top node
and then only down to the destination. The upward-only searches are guaranteed to find it.

**Why is it so fast?** Each upward search sees only a few hundred nodes, because there are few important nodes
and the shortcuts jump straight past the unimportant ones. On continental road networks, CH queries are reported
in research to run in well under a millisecond, thousands of times faster than plain Dijkstra, after a few
minutes of preprocessing.

### The catch: traffic changes the weights

Shortcuts store **sums of weights**. When traffic slows a segment, every shortcut that passes over it is now
wrong, and a full re-contraction takes too long to run every minute. Three standard answers:

1. **Customisable preprocessing.** Split preprocessing into a slow part that depends only on the graph's *shape*
   and a fast part that plugs in the *weights*. In **Customizable Route Planning** (CRP), the map is partitioned
   into cells (several levels: neighbourhood, city, region). For each cell, the shortest distances between its
   **boundary nodes** are precomputed. A query searches the start and destination cells in full detail and the
   rest of the way only over these boundary-to-boundary shortcuts. When traffic changes, only the affected
   cells' tables are recomputed, in parallel, which takes seconds for a continent. **Customizable contraction
   hierarchies** apply the same split to CH. Microsoft has publicly described using CRP in Bing Maps.
2. **Route on typical weights, then re-score.** Generate a few good candidate routes on the stable weights
   (fast), then compute each candidate's ETA with **live** and predicted speeds and pick the best. This is cheap
   and robust, but can miss a route that is only good *because* of today's traffic.
3. **Combine them.** Customise weights every minute or so, and still re-score candidates with the full ETA
   model.

Google has not published exactly which routing technique it uses, so in an interview present these as options
and justify your choice: **partition-based customisable routing for live weights, plus candidate re-scoring with
the ETA model** is a strong, defensible answer.

**Alternative routes.** Users expect two or three choices. A common method generates candidates through
different intermediate "via" nodes (or by penalising the edges of the best route and searching again), then keeps
those that are not much longer, share little with the best route, and have no silly detours.

**Scaling the routing tier.** Every routing server holds a full copy of the graph for its region (tens of GB,
from section 3) and is stateless otherwise, so we add replicas for throughput. A very large graph can be split
by geography, with cross-region trips using the top levels of the hierarchy, which are small.

### Flow: getting directions

[![Directions sequence: the app geocodes 'Central Station' and gets a place ID and coordinates; it asks the routing service for a route by car, which snaps both points to road segments and runs the bidirectional hierarchy search; routing asks the ETA service for three candidates, the ETA service reads live and typical speeds for their segments, returns ETAs of 23, 26 and 31 minutes, and routing returns three routes with polylines, steps and ETAs](/img/system-design/google-maps/05-route-request.png)](/img/system-design/google-maps/05-route-request.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Geocoding is its own step.** The routing service works only with coordinates and road segments, never with
  text.
- **Routing finds the shape; the ETA service sets the time.** Separating them lets each improve independently.
- **The reply is compact.** The route is an **encoded polyline** (coordinates as small deltas packed into short
  text) plus a list of steps such as "turn left onto High Street in 300 m". The app draws it on the vector map it
  already has.

## 9. Deep dive: live traffic from phones

Google has described publicly that its traffic layer is built from **aggregated, anonymised location data**
from phones whose users have turned location sharing on, along with other sources such as incident reports
from drivers. No cameras or road sensors are needed: millions of phones moving at car speed *are* the sensors.

[![Live traffic pipeline: opted-in phones send latitude, longitude and time into a location stream that strips identity; the map matcher turns short traces into road segments and speeds; an aggregator per segment and per minute writes current speeds to the live speeds store, sends new edge weights to routing, archives into speed history by hour of week, and the live speeds colour the traffic layer green, amber or red](/img/system-design/google-maps/06-traffic.png)](/img/system-design/google-maps/06-traffic.png)

*Select the diagram to zoom in and move around.*

### Step 1: collect, with privacy built in

Phones record a position every few seconds and upload in batches to save battery. Before anything else, a
typical design:

- Replaces any account identity with a **random ID that changes every trip** (or every few minutes), so traces
  cannot be linked into a history.
- **Trims the start and end** of each trip, where people live and work.
- Only publishes a segment's speed when **several different devices** contributed (a k-anonymity threshold), so
  one person's speed is never visible.
- Keeps raw positions only briefly; what is kept long term is the averaged speed per segment.

### Step 2: map-matching (which road was this?)

GPS is noisy, often by 5–20 metres, and worse between tall buildings. A point next to a motorway might really be
on the frontage road beside it. **Map-matching** finds the most likely sequence of road segments for a trace.

The standard approach models it as a **hidden Markov model**: the true road positions are hidden, the GPS
points are what we observe.

- For each GPS point, take the **candidate** segments within, say, 30 metres.
- **Emission score:** how likely this GPS point is if the car was on that candidate. Closer is more likely
  (modelled as a bell curve of the distance).
- **Transition score:** how plausible it is to go from a candidate at point *i* to a candidate at point *i+1*.
  If the driving distance between them along the roads is close to the straight-line distance between the GPS
  points, it is plausible. If it would need a 2 km detour in 5 seconds, it is not.
- The **Viterbi algorithm** (dynamic programming) picks the sequence with the best combined score. Its time is
  linear in the number of points (times the square of the few candidates per point).

From the matched trace, each segment's travel time is simply the time between entering and leaving it, and its
speed is length divided by that time.

### Step 3: aggregate into one speed per segment

Every minute or so, the aggregator combines all recent samples on each segment:

- **Robust averages** (a median or trimmed mean), so one parked car, one bus at a stop or one cyclist in a bike
  lane does not drag the speed down. Samples moving at walking pace on a motorway for ten minutes are likely a
  traffic jam; the same on a residential street with one device are likely a pedestrian.
- **Blend with history when data is thin.** A quiet road at 03:00 might have no samples. The estimate then leans
  on the typical speed for that hour of the week, and moves towards live data as samples arrive.
- **Detect sudden changes.** A segment that drops from 100 km/h to 5 km/h with many devices agreeing is a jam or
  an incident, and is pushed out immediately.

### Step 4: use it

- **Live speeds store:** an in-memory table of `segment_id → (speed, confidence, updated_at)` read by the ETA
  service and the traffic layer.
- **Routing weights:** new travel times per segment feed the routing tier's customisation step (section 8).
- **Speed history:** archived speeds build the "typical speed by hour of week" table, used for future
  predictions and for routes that start later ("depart at 08:00 tomorrow").

## 10. Deep dive: ETA prediction

The simplest ETA is the sum of each segment's length divided by its current speed, plus turn delays. It has a
classic flaw: on a two-hour drive, the segment you reach in 90 minutes will not have *today's* speed at the
moment you leave; it will have the speed **90 minutes from now**. A good ETA predicts the future.

[![ETA prediction: the candidate route's segments, live speeds from the last few minutes and speed history for this hour and day go into a feature builder; the features feed an ETA model, for example a graph network, which outputs the predicted time; finished trips with real travel times are used offline to train new model weights](/img/system-design/google-maps/07-eta.png)](/img/system-design/google-maps/07-eta.png)

*Select the diagram to zoom in and move around.*

The three ingredients:

1. **History:** the typical speed for each segment at that hour of that day of the week, plus known patterns
   such as school holidays.
2. **Live:** speeds from the last few minutes. They matter most for the near part of the route and fade in
   importance further ahead, where history becomes a better guess.
3. **Learned corrections:** a machine-learned model trained on millions of **finished trips**, where we know the
   real arrival time. It learns things simple sums miss: traffic lights, how jams spread backwards along a road,
   how long a left turn really takes at a given junction. Google and DeepMind have publicly described using
   **graph neural networks** for this, working on groups of adjacent segments.

In practice: walk along the route, and for each segment predict the speed **at the time you will reach it**,
then let the model correct the total. Report the ETA, not a range, to the user, but keep the uncertainty
internally: it decides how often to refresh and when to suggest a different route.

**Checking quality.** Every completed navigation is a free test case: compare the predicted ETA at the start with
the real arrival. Track the error by region, time of day and trip length, and roll out new models only if they
beat the old one on held-out trips.

## 11. Deep dive: turn-by-turn navigation and rerouting

Once you press **Start**, most of the work moves onto the phone. It already has the route (polyline, steps, the
segment IDs) and the vector tiles along it.

[![Navigation session states: ROUTE_PREVIEW shows routes and ETAs; Start moves to NAVIGATING with turn prompts and a live ETA; near the destination it becomes ARRIVED; if GPS leaves the route it goes to OFF_ROUTE, which returns to NAVIGATING when back on route or moves to REROUTING when still off, and a new route returns to NAVIGATING; Exit ends the session](/img/system-design/google-maps/08-navigation.png)](/img/system-design/google-maps/08-navigation.png)

**On the phone, every second:**

- **Map-match on the device** against the current route, so the blue dot sits on the road, not in a field.
- **Pick the next instruction** and time the voice prompt by **distance and speed**: "in 500 metres" on a
  motorway is announced earlier than "in 100 metres" in a town.
- **Dead reckoning** in tunnels: with no GPS, keep moving the dot along the route at the last known speed, using
  the phone's motion sensors where available.

**Off-route detection and rerouting.** One bad GPS fix must not trigger a reroute, so the app waits until several
consecutive fixes are far from the route (for example more than 30–50 metres, adjusted for the reported GPS
accuracy) or the heading clearly disagrees. Then it asks the server for a new route **from the current position
and heading**, so it does not tell you to make a U-turn on a motorway. If there is no signal, an app with offline
data reroutes on the device.

**Periodic refresh.** About once a minute the app sends its position and route ID to the navigation refresh
endpoint. The server returns the updated ETA and traffic ahead, and checks whether another route is now clearly
faster (say by more than a few minutes). If so, the app **offers** it rather than silently switching, because
surprise route changes confuse drivers.

**Keeping the server side light.** The server stores almost nothing per session: the route and the last position
arrive with each refresh, so any routing server can answer. This makes navigation easy to scale and to fail over.

## 12. Geocoding and place search

Search turns "central stn" into one precise point. It has three parts:

- **Parsing:** split the text into parts (house number, street, city, postcode) or recognise it as a place name
  or category ("coffee"). Addresses differ by country, so parsers are per-country.
- **Lookup:** an **inverted index** from words (with typo tolerance and abbreviations: "stn" → "station") to
  places, plus a **geospatial index** to rank by distance from the user or the visible map area.
- **Interpolation:** not every house is stored. If a street segment is known to hold the even numbers 2–100 on one
  side, number 40 is placed about 40% of the way along it.

Ranking blends text match, distance, and popularity. **Reverse geocoding** finds the nearest address point or
street segment to a coordinate with the same spatial index. The full design of a places index (geohashes,
quadtrees, S2 and H3 cells, sharding and ranking) is in the
[Yelp case study](/system-design/case-studies/hard/yelp/).

## 13. Offline maps

An offline area is a **bundle of the same data the servers use**, cut to a region:

- **Vector tiles** for the area, up to a moderate zoom (the app over-zooms beyond it).
- **The routing graph** for the area with its precomputed shortcuts, so the phone can route and reroute by
  itself. Without live data it uses **typical** speeds, so offline ETAs ignore today's traffic.
- **A small search index** of the area's places and addresses.

Design points:

- **Region packs** are prebuilt per region and version, stored in object storage and served by the CDN, so a
  million downloads of the same city cost almost nothing at the origin.
- **Updates as diffs:** when a pack's version changes, download only changed tiles and graph cells, ideally on
  Wi-Fi and while charging.
- **Expiry:** maps go out of date (new roads, closures), so packs expire after some months unless updated.
- **Edges of the area:** a route that leaves the downloaded region cannot be computed offline; the app says so
  instead of guessing.

## 14. What breaks as it grows, and how to fix it

**The tile build.** Re-rendering the whole world for one edit would take days. *Fix:* incremental builds of only
the tiles that contain changed features, versioned URLs, and a manifest so clients pick up new versions.

**The cold cache after a style change.** A new map style changes every tile at once, and the CDN goes cold.
*Fix:* vector tiles (the style is applied on the device, so tiles do not change), and pre-warming the CDN with the
most popular tiles before switching.

**The graph outgrows memory.** *Fix:* partition by geography (continents or large regions), keep the top levels
of the hierarchy small and shared, compress node and edge arrays, and reorder nodes so neighbours sit close
together in memory (fewer cache misses).

**Rush-hour ETA load.** At 17:30 every navigating phone refreshes. *Fix:* compute ETAs from shared per-segment
speed tables (cheap reads), cache route ETAs for popular corridors for a few seconds, and let the refresh interval
grow when the uncertainty is low.

**Sparse traffic data.** A rural road has one sample an hour. *Fix:* blend with history and confidence weighting;
never mark a road as jammed from one phone.

**Location ingest storms.** A popular event or a city-wide outage reconnects millions of phones at once.
*Fix:* batch uploads with random jitter, rate-limit per device, and let the stream buffer; traffic data a minute
late is acceptable.

**Map errors.** A closed road or a wrong turn restriction sends thousands of drivers into a dead end. *Fix:*
detect it from data (many drivers who are routed through a segment do not take it), let users report closures,
and route around low-confidence segments until they are checked.

## 15. Reliability and failure handling

| Failure | What happens | Defence |
| --- | --- | --- |
| Origin tile store down | CDN keeps serving cached tiles | Long cache lifetimes on immutable versioned tiles; a second origin region |
| A routing server crashes | Requests fail on that server | Stateless replicas behind a load balancer; the client retries on another |
| The traffic pipeline stalls | Live speeds grow old | Every speed carries `updated_at`; past a few minutes, routing and ETA fall back to **historical** speeds automatically |
| A bad graph or weight push | Absurd routes or ETAs everywhere | Validate new graphs with thousands of known test routes before rollout; canary to a few servers; keep the previous version to roll back |
| A region's data centre fails | Users there lose service | Graph and speed tables replicated to other regions; DNS or anycast moves traffic |
| The phone loses signal mid-navigation | No server refreshes | The route and nearby tiles are already on the phone; offline data allows rerouting on the device |

The pattern to remember: **always have a slower, older, but safe answer**. Cached tiles over no tiles, historical
speeds over no speeds, the current route over no route.

## 16. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Tile format | Raster images | Vector shapes | **Vector** for streets (smaller, restylable, rotate and tilt); **raster** for satellite imagery |
| Tile generation | Render on request | Pre-render in batch | **Pre-render** and cache at the CDN; versioned URLs avoid purges |
| Routing algorithm | Dijkstra or A* on demand | Precomputed hierarchy | **Hierarchy** (CH or partition-based): thousands of times faster, still exact |
| Live traffic in routing | Re-contract everything | Customisable weights, or re-score candidates | **Customise weights every minute and re-score candidates** with the ETA model |
| ETA | Sum of segment times | Historical + live + ML model | **Model**, with speeds predicted for when you reach each segment |
| Navigation state | Server tracks each session | Phone holds the route; server is stateless | **Phone**: works offline, easy to scale and fail over |
| Traffic data | Keep raw traces | Aggregate per segment, discard raw | **Aggregate** with anonymisation and minimum-count thresholds: privacy first |
| Faster route found | Switch automatically | Offer to the driver | **Offer**: predictable for drivers, avoids flip-flopping between routes |

## Cheat sheet for last-minute revision

- **Split by rate of change:** map pictures (days) are prebuilt and cached; the graph's shape (days) is
  preprocessed offline; only weights (minutes) are updated online.
- **Tiles:** quadtree pyramid, $4^z$ tiles at zoom $z$, address `z/x/y` is the cache key. Vector tiles for
  streets (draw on device, over-zoom), raster for satellite. Pre-render, version URLs, serve from the CDN.
- **Graph:** junctions are nodes, directed segments are edges, weight = travel time; turn restrictions via an
  edge-based graph.
- **Dijkstra** settles everything within the answer's radius: correct but seconds per long query. **Bidirectional**
  halves it; **A*** with a straight-line / max-speed estimate helps only a little for travel time.
- **Contraction hierarchies:** rank nodes, contract least important first, add a shortcut `u → w` only if
  `u → v → w` is the only shortest path (witness search). Query = bidirectional upward-only search, then unpack
  shortcuts. Exact, under 1 ms.
- **Live traffic vs shortcuts:** customisable routing (CRP / customisable CH: partition once, recompute cell
  tables in seconds) and/or re-score candidate routes with live ETAs.
- **Traffic:** opted-in phones → strip identity, trim trip ends → HMM map-matching (Viterbi) → robust average per
  segment per minute, blended with history → live speeds, weights, history.
- **ETA:** speed at the time you reach each segment, from history + live + an ML model trained on finished trips.
- **Navigation:** on the phone; off-route after several bad fixes; reroute from current position and heading;
  offer, do not force, faster routes.
- **Numbers:** ~1M tile requests/s at peak (mostly CDN), ~10K route requests/s, world graph ~30–50 GB in RAM,
  ~4M location positions/s.

## Practice questions

1. **Why can't you just run A* with a straight-line estimate and skip preprocessing?** For travel time the
   estimate must assume the highest possible speed to stay admissible, so it badly underestimates most remaining
   time and A* still explores a large area. On a continent that is still far slower than the sub-millisecond
   queries a hierarchy gives.
2. **A road closes because of an accident. How quickly is it avoided, and how?** Phones on it slow to zero and the
   aggregator sees many devices agree within a minute or two (user reports can be faster). Its weight becomes
   very high (or the edge is disabled), the routing tier re-customises the affected cells, and navigation
   refreshes offer drivers already heading there a new route.
3. **How would you support "depart at 08:00 tomorrow"?** Use time-dependent weights: for each segment, the
   typical speed for the hour you are predicted to reach it, rather than live speeds. Candidate routes are
   generated on these weights and scored with the ETA model given the departure time.
4. **How would you add walking and cycling?** Same machinery, different graphs and weights: include footpaths and
   bike lanes, exclude motorways, ignore one-way rules for pedestrians, use walking or cycling speeds and add a
   cost for hills. Each mode gets its own preprocessed graph.
5. **How do you know your ETAs are good?** Every finished navigation is a labelled example. Track the error
   between the starting ETA and the real arrival by region, time of day and trip length; ship new models only
   when they win on held-out trips, and alert when the error drifts.
