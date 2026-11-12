---
title: "Design Google Search (a web search engine)"
description: "Design a web search engine: crawl and de-duplicate pages, build a sharded inverted index, fan out queries, and rank with BM25 and PageRank."
difficulty: "Medium"
sidebar:
  label: "Google Search (web search engine)"
tags: ["Search", "Inverted index", "Sharding", "Ranking", "Caching"]
---

You type `cheap flights to goa` and, in a fraction of a second, get ten useful links chosen from hundreds of
billions of pages. It feels like one lookup. Underneath, a web search engine is three very different systems
joined together: a **librarian** who keeps visiting every shelf of the web to find new and changed books (the
**crawler**), a **cataloguer** who reads every book and writes the giant index at the back of the library (the
**indexer**), and a **reference desk** that answers millions of questions a second by looking things up in that
index (the **serving** system).

This case study builds that system from first principles. We go light on crawling, which has its own case
study, and spend most of our time on the parts interviewers push on: the inverted index, how to split it across
thousands of machines, how one query is answered by all of them at once, and how results are ranked.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Web search in 5 minutes

The whole design rests on one observation: **you cannot search the web when the user asks.** Reading billions of
pages takes days. So all the slow work happens ahead of time, offline, and the online part only does cheap
lookups in a structure prepared for exactly that.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Crawler** | Programs that download pages and follow their links to find more pages | A librarian walking the shelves |
| **Document** | One fetched page, identified internally by a number, its **docID** | One book |
| **Term** | A normalised word (or token) that can be searched for: `flight`, `goa` | A keyword in the book's index |
| **Inverted index** | For every term, the list of documents that contain it | The index at the back of a book: "Goa, pages 12, 87, 301" |
| **Posting list** | One term's entry in the inverted index: sorted docIDs, plus counts and positions | The list of page numbers after "Goa" |
| **Shard** | One slice of the index, held by one group of machines | One volume of a multi-volume encyclopaedia |
| **Ranking** | Ordering matching documents so the most useful come first | A librarian's judgement of which book to hand you first |
| **SERP** | Search engine results page: the ten blue links, titles and snippets | The answer slip the librarian gives you |

The three big parts and how they connect:

[![Architecture of a web search engine: online, the user's query goes to the search front end, which consults query understanding and the results cache, then on a miss to the query root, which fans out to index shards and fetches snippets from doc servers; offline, the crawler fetches the web into a raw page store, doc processing parses, de-duplicates and tokenises, link analysis computes PageRank, and the index builder pushes new index shards and doc copies to the serving system](/img/system-design/google-search/01-architecture.png)](/img/system-design/google-search/01-architecture.png)

*Select the diagram to zoom in and move around.*

Read it as two worlds:

1. **Offline (bottom):** crawl → process → build the index. This runs continuously, takes minutes to days per
   page, and is measured in throughput (pages per second), not latency.
2. **Online (top):** a query arrives, the front end checks a cache, and on a miss asks **every** index shard at
   once, merges their answers and builds the page. This must finish in a couple of hundred milliseconds.

The only things that cross between the worlds are finished index files and document copies. The serving system
never waits for the crawler.

## 2. Requirements

### Functional (what users can do)

- **Search** with a free-text query and get the ten most relevant web pages, each with a title, URL and a
  **snippet** (a few lines of the page with the query words highlighted).
- **Pagination:** see results 11–20, 21–30 and so on.
- **Phrase and operator queries:** `"exact phrase"`, `site:example.com`, `-excluded`.
- **Spelling correction** ("Did you mean: cheap flights") and **autocomplete** while typing.
- **Fresh results:** a news story published ten minutes ago can be found.
- **Language and region:** results suited to the user's language and country.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Latency** | Results in under ~200 ms at the 99th percentile, server side | Users notice and leave when search feels slow |
| **Availability** | 99.99% or better | For many people search *is* the way into the web |
| **Scale** | Billions of queries a day; an index of tens to hundreds of billions of pages | Google-sized |
| **Relevance** | The best answer is usually in the top three | Relevance is the product; everything else serves it |
| **Freshness** | Popular and news pages re-indexed within minutes; the long tail within weeks | Stale results lose trust |
| **Graceful degradation** | Losing a few machines slightly lowers quality instead of failing the query | Thousands of machines means something is always broken |

Notice what is **not** required: strong consistency. If one data centre's index is a few minutes newer than
another's, nobody can tell. That freedom makes the whole design possible.

### Out of scope

Ads, images and video search, maps, the knowledge panel, personalisation beyond language and region, and abuse
of the crawler. The crawler itself is **covered in depth in the
[web crawler case study](/system-design/case-studies/hard/web-crawler/)**; here we treat it as a box that delivers
pages.

## 3. Back-of-the-envelope estimates

Google's own "How Search works" pages say its index holds hundreds of billions of pages and is well over
100 million gigabytes, and that it handles billions of searches a day. We use round numbers of our own; the aim
is to learn **which resources dominate**, not to guess Google's real figures.

**Assumptions:** 10 billion queries a day, peak 2× average. A **serving index of 50 billion pages** (the best
part of what has been crawled). Average page: **100 KB** of HTML, **10 KB** of useful text after parsing. Each
page is re-crawled on average every **30 days** (popular pages far more often, the long tail less).

**Query traffic**

- $10\text{B} / 86{,}400 \approx 116{,}000$ queries per second on average, about **230,000 per second** at peak.
- If the results cache answers half of them, about **115,000 queries per second** reach the index at peak.

**Crawl and storage**

- Pages to fetch: $50\text{B} / 30 \text{ days} \approx 1.7\text{B}$ a day, about **19,000 pages per second**.
- Download bandwidth: $19{,}000 \times 100\text{ KB} \approx 1.9\text{ GB/s}$, roughly **15 Gbit/s** of
  sustained traffic.
- Raw HTML: $50\text{B} \times 100\text{ KB} = 5\text{ PB}$, about 1.25 PB compressed (HTML compresses about 4:1).
- Extracted text: $50\text{B} \times 10\text{ KB} = 500\text{ TB}$.
- Inverted index: a compressed index with word positions is typically a third to a half of the size of the text it
  covers, so about **200 TB**. Compressed
  document copies for snippets add a similar amount.

**Sharding and fan-out**

- With **10 million documents per shard**, we need $50\text{B} / 10\text{M} = 5{,}000$ shards, each holding about
  40 GB of index: it fits on one machine's SSD, with the hottest parts in RAM.
- Every query goes to every shard (section 9 explains why), so at peak the shards together answer
  $115{,}000 \times 5{,}000 \approx 575$ million shard-queries per second.
- If one machine can answer about 1,000 shard-queries per second, that is around **575,000 machines** for one
  copy of the serving capacity. The number is rough, but the lesson is real: **query fan-out is the dominant
  cost**, which is why caching, tiering and early termination (sections 11 to 13) matter so much.

Three conclusions follow:

1. **The index is too big for one machine but small enough per shard.** Split it into thousands of pieces.
2. **Reads dominate.** Each page is indexed once a month but its shard is consulted for every query, so the index
   format should make reading fast even if building it is slow.
3. **Every saved shard lookup is multiplied by 575 million a second.** Small wins in serving are huge wins in cost.

## 4. The API

The public interface is tiny. Almost all of the complexity is internal.

| Method and path | What it does |
| --- | --- |
| `GET /search?q=cheap+flights&start=0&hl=en&gl=in` | Return ranked results 1–10 for the query, in English, for India. `start=10` asks for the next page. |
| `GET /complete?q=chea` | Autocomplete suggestions while typing (a separate service, see section 14). |

Internally, the query root calls each shard with an RPC like:

```text
SearchShard(query_terms, filters, k=10, deadline_ms=60)
  -> [(doc_id, score), ...]   // this shard's best k, best first
GetDocs(doc_ids, query_terms)
  -> [(url, title, snippet), ...]
```

Two details matter. The shard call carries a **deadline**, so a slow shard can be abandoned. And shards return
only **IDs and scores**, never page text: the text is fetched afterwards for just the ten winners.

## 5. Document processing: from HTML to clean terms

The crawler hands us raw HTML. Before anything can be indexed, every page goes through a pipeline:

[![Indexing pipeline: raw pages are parsed into clean text, title and links; a simhash check drops near-duplicates and keeps the canonical copy; unique documents are tokenised into terms with positions and inverted into posting lists in the index shards; out-links form a link graph from which PageRank computes page scores that are also stored in the shards](/img/system-design/google-search/02-indexing.png)](/img/system-design/google-search/02-indexing.png)

*Select the diagram to zoom in and move around.*

### Parsing

The parser turns a messy HTML page into structured fields:

- **Title**, headings and body text, with scripts, styles, menus and boilerplate removed. Words in the title or
  headings are recorded as such, because they count for more in ranking.
- **Out-links** with their **anchor text** (the clickable words). A link saying "best Goa beach guide" that
  points to page X is a strong hint about what X is about, often better than X's own words.
- **Metadata:** language, character encoding, the `<link rel="canonical">` hint, and robots directives such as
  `noindex`.

### Tokenising

**Tokenising** splits text into searchable terms. Then each term is **normalised** so that different spellings
of the same idea meet in one posting list:

- Lower-case: `Flights` → `flights`.
- Strip accents where the language allows: `café` → `cafe`.
- **Stemming** chops words to a shared root: `connected`, `connecting`, `connection` → `connect`. A gentler
  alternative, **lemmatising**, maps words to dictionary forms: `flights` → `flight`, `better` → `good`.
- Record each term's **position** in the document, so phrase queries like `"new york"` can check that the words
  are next to each other.
- Languages without spaces (Chinese, Japanese, Thai) need a dictionary-based word segmenter.

The same normalisation must be applied to queries, or `Flights` would never find `flights`.

### De-duplication: shingles and simhash

A surprisingly large share of the web is copies: mirrors, printer-friendly versions, the same article on
syndication sites, pages that differ only in a date or an ad. Indexing them all wastes space and fills the
results with ten copies of one answer. Exact copies are easy (hash the text, compare hashes). **Near-duplicates**
are the real problem.

**Shingles.** Cut the text into overlapping runs of $w$ words, called **shingles**. With $w = 3$:

| Text | 3-word shingles |
| --- | --- |
| "the cat sat on the mat" | `the cat sat`, `cat sat on`, `sat on the`, `on the mat` |
| "the cat sat on a mat" | `the cat sat`, `cat sat on`, `sat on a`, `on a mat` |

Similarity is the **Jaccard index**: shared shingles divided by all distinct shingles, here $2 / 6 \approx 0.33$.
That looks low only because the text is tiny. On a real page with 2,000 shingles, changing one word alters just 3
of them, so the Jaccard index stays above 0.99. The idea is that similar documents share most of their shingles.

**Simhash.** Comparing shingle sets between every pair of 50 billion pages is impossible, so each page is
condensed into a single 64-bit **fingerprint** with a special property: **similar pages get fingerprints that
differ in only a few bits.** (An ordinary hash does the opposite: one changed word flips half the bits.)

1. Hash every feature (a shingle or a word) to 64 bits.
2. Keep 64 counters. For each feature, for each bit position, add the feature's weight if that bit is 1 and
   subtract it if the bit is 0.
3. The fingerprint's bit $i$ is 1 if counter $i$ ended positive, else 0.

Changing a few words nudges a few counters slightly, so only the counters near zero can flip sign. Google's
published 2007 work on near-duplicate detection for crawling used 64-bit simhash fingerprints and treated pages
within 3 differing bits as near-duplicates.

How do we find "any fingerprint within 3 bits of this one" among billions? The **pigeonhole trick**: split the 64
bits into 4 blocks of 16. If two fingerprints differ in at most 3 bits, those bits fall into at most 3 blocks, so
**at least one block is identical**. Keep 4 tables, each keyed by one block; a lookup checks the few candidates
that match exactly on some block and compares their full fingerprints.

When a near-duplicate is found, we keep one **canonical** version (the one the site marks canonical, or the one
with more links pointing at it) and record the others as aliases, so their links still count.

## 6. The inverted index

### What a posting list holds

For every term, the index stores its posting list: the documents containing it, **sorted by docID**, with how
often the term appears (term frequency, `tf`) and where.

| Term | Posting list: docID (tf: positions) |
| --- | --- |
| `cheap` | 3 (1: 7), 7 (2: 4, 90), 11 (1: 2), 120 (1: 15) |
| `flight` | 7 (3: 5, 30, 91), 11 (1: 3), 56 (2: 1, 9), 120 (1: 16) |
| `goa` | 11 (1: 5), 120 (2: 17, 40) |

Next to it sits a small **lexicon** (term → document frequency and where its list starts on disk) and a
**document table** (docID → URL, title, length, static score such as PageRank, language).

Answering `cheap flight goa` means **intersecting** the three lists. Because each list is sorted, we walk them in
step like the merge in merge sort, always advancing the pointer with the smallest docID: matches are 11 and 120.
Positions then confirm phrases: in doc 120, `cheap` is at 15 and `flight` at 16, so it also matches the phrase
`"cheap flight"`.

Posting lists for common words are enormous (`the` appears in most English pages). Two tricks keep intersection
fast:

- **Start from the rarest term.** Walk the shortest list (`goa`) and only check whether its docIDs appear in the
  longer lists.
- **Skip pointers.** Every few hundred entries, store "docID X starts at byte Y". To check whether doc 5,000,000
  is in a list, jump straight to the nearest skip instead of reading everything before it.

### Compression

An uncompressed docID is 4 or 8 bytes, and the index holds trillions of postings (50 billion pages × hundreds of distinct terms each). Compression makes the
index several times smaller, which means more of it fits in RAM, which makes queries faster. It is not just a
storage saving.

**Delta (gap) encoding.** Store the difference between consecutive docIDs instead of the IDs themselves:

```text
docIDs: 3, 7, 11, 120, 125
gaps:   3, 4,  4, 109,   5      // small numbers, because the list is sorted
```

**Variable-byte encoding** then writes each gap in as few bytes as it needs: 7 bits of data per byte, with the top
bit saying "more bytes follow". All the gaps above fit in one byte each, instead of four. Frequent terms have
small gaps (they appear in nearly every document), so they compress best, exactly where it matters most. Faster
schemes used in practice (such as packing groups of 128 gaps with the same bit width) follow the same idea and
decode with SIMD instructions.

### Building the index

Index building is a classic batch job in the MapReduce style:

1. **Map:** each worker reads documents and emits `(term, docID, tf, positions)` tuples.
2. **Shuffle and sort:** group by term (and by shard), sort by docID.
3. **Reduce:** write each term's sorted, compressed posting list, plus the lexicon and skip pointers.

The output is a set of immutable **index files per shard**, which are copied to the serving machines and swapped
in. Immutability is a gift: no locks, easy caching, easy rollback to yesterday's files if a build is bad.

## 7. Low-level design: what is stored where

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Raw fetched pages | Petabytes of immutable blobs keyed by URL and fetch time | Distributed file system or wide-column store (Bigtable-style) | Cheap, sequential batch reads for the indexer |
| URL table | Billions of rows: URL → docID, simhash, canonical URL, last crawl, status | Wide-column store sorted by reversed host (`com.example.www/...`) | Pages of one site sit together for per-site jobs |
| Inverted index | Immutable, compressed posting lists per shard | Custom files on local SSD, hot parts in RAM | Nothing general-purpose is fast enough at this scale |
| Document store | docID → compressed text, title, URL | Custom files on the doc servers, sharded like the index | Snippets need the text, but only for ten docs per query |
| Link graph | Billions of nodes, hundreds of billions of edges | Files processed by a graph batch system | Only read by the PageRank job |
| Results cache | Normalised query → ranked result IDs | In-memory cache (Memcached-like) | Popular queries repeat constantly |

Note the split: **small and read on every query** (index, top of the document table) lives on fast local storage
next to the CPU; **big and read rarely** (raw HTML, link graph) lives in cheap distributed storage.

## 8. Flow: serving one query

The user types `chep flights`.

[![Sequence for one query: the user sends chep flights to the front end, which fixes the spelling to cheap flights and checks the results cache; on a miss it asks the query root, which sends the same query to all index shards; each returns its local top 10 of ids and scores; the root merges them into a global top 10, asks doc servers for titles, URLs and query-aware snippets, returns ranked results to the front end, which stores them in the cache with a short TTL and returns the results page](/img/system-design/google-search/04-query.png)](/img/system-design/google-search/04-query.png)

*Select the diagram to zoom in and move around.*

Step by step:

1. **Query understanding.** The front end normalises the query exactly as documents were normalised, fixes the
   spelling (section 14), detects language and region, and may add synonyms (`flights` also matches
   `airfare`).
2. **Cache check.** The key is the normalised query plus everything that changes the answer: language, region,
   safe-search setting and result page. A hit returns in a few milliseconds.
3. **Fan-out.** On a miss, the query root sends the query to one replica of **every** shard, in parallel.
4. **Local retrieval and scoring.** Each shard intersects its posting lists, scores the matching documents
   cheaply and returns its **local top 10**: just `(docID, score)` pairs.
5. **Merge.** The root merges thousands of small sorted lists into the **global top 10** with a heap. This is
   correct because the global top 10 must be inside the union of every shard's local top 10: a document that is
   not even in its own shard's top 10 cannot beat ten documents that are.
6. **Snippets.** Only now are page texts touched: the doc servers find the passage that best contains the query
   words and build the snippet for each of the ten winners.
7. **Respond and cache.** The page is returned and cached with a short time to live (TTL).

With 5,000 shards, one root talking to all of them directly would drown in replies. Real systems use a **tree**:
the root talks to, say, 50 mid-level aggregators, each of which talks to 100 shards and merges their answers
first. Each machine then handles a fan-out of about 100.

## 9. Deep dive: sharding by document, not by term

There are two ways to cut the inverted index into pieces.

[![Two ways to shard: by document, the query root sends the whole query to every shard, each holding all terms for its own range of documents, and merges three small top-10 lists; by term, the root fetches the complete posting list for cheap from the a-to-f shard and for flights from the n-to-z shard, leaving the g-to-m shard idle, and must intersect the huge lists itself](/img/system-design/google-search/03-sharding.png)](/img/system-design/google-search/03-sharding.png)

*Select the diagram to zoom in and move around.*

- **By document (local index):** each shard owns a slice of the documents and holds a complete small index for
  them, every term included. A query goes to **all** shards.
- **By term (global index):** each shard owns a slice of the vocabulary and holds the **complete** posting lists
  for its terms, across all documents. A query goes only to the shards owning its terms.

Term sharding looks cheaper (two shards instead of 5,000), but it loses on almost everything that matters:

| Concern | By document | By term |
| --- | --- | --- |
| Network per query | Tiny: each shard sends 10 IDs and scores | Huge: whole posting lists must meet on one machine to be intersected (`flights` alone may list billions of docs) |
| Load balance | Even: every shard does a similar amount of work | Hot spots: the shard holding `the`, `free` or a trending name melts |
| A machine fails | A small slice of documents is missing; results are slightly worse | Every query using those terms fails or loses a term |
| Adding documents | Add new shards; others untouched | Every term's list grows; one document touches hundreds of shards |
| Building the index | Each shard built independently from its own docs | A global shuffle of all postings |
| Ranking | Each shard can score whole documents, with all their terms at hand | Scoring a document needs data spread over many shards |

So web search engines shard **by document** and accept the fan-out. The fan-out's cost is then attacked
directly: replicas to spread the load, tiering so most queries touch only part of the index (section 13), and
hedging to stop the slowest shard from setting the pace (section 10).

**Replicas.** Each shard is copied onto many machines (say 3 to 100, depending on traffic). A query uses one
replica of each shard, so adding replicas adds query capacity, and losing one replica changes nothing.

## 10. Deep dive: tail latency and hedged requests

Fan-out has a nasty statistical side effect. A query is only as fast as its **slowest** shard. Suppose each shard
answers in 10 ms normally but takes over 100 ms 1% of the time (a garbage-collection pause, a busy disk, a noisy
neighbour). Then for a query touching $n$ shards:

$$
P(\text{at least one slow shard}) = 1 - 0.99^{\,n}
$$

- With $n = 100$: $1 - 0.99^{100} \approx 0.63$. **63% of queries are slow.**
- With $n = 5{,}000$: practically every query is slow.

A rare problem on one machine becomes the common case for the system. Jeff Dean and Luiz Barroso's 2013 paper
"The Tail at Scale" describes this effect and the standard fixes:

[![Hedged request: the query root asks replica A of shard 7 for its top 10 and starts a timer at the 95th percentile, 10 ms; A is stalled, so after 10 ms with no answer the root sends the same request to replica B, which answers at 13 ms; the first answer wins and the root cancels the request to A](/img/system-design/google-search/05-hedged.png)](/img/system-design/google-search/05-hedged.png)

- **Hedged requests.** Send the request to one replica. If no answer arrives within the 95th-percentile time, send
  the same request to a second replica and use whichever answers first, then cancel the other. Only about 5% of
  requests get a second copy, so the extra load is small, but the tail shrinks dramatically.
- **Tied requests.** Send to two replicas at once, each knowing about the other; whichever starts work first tells
  the other to drop it. This avoids the wait before hedging.
- **Partial results.** If a shard still has not answered by the deadline, return without it. Missing 1 of 5,000
  shards costs a tiny amount of recall; making every user wait costs much more. Search is one of the rare systems
  where a slightly incomplete answer is better than a late one.
- **Good citizenship on the shard:** short queues, background work (index loading, compaction) kept off machines
  that are serving, and slow machines taken out of rotation automatically.

## 11. Deep dive: ranking

Finding documents that contain the words is retrieval. Choosing the best ten is **ranking**, and it is where search
engines compete. We cover the classic ideas at a high level; modern engines combine hundreds of signals with
machine-learned models.

### Relevance: does the page match the query? (BM25)

The intuition, in three parts:

1. **Term frequency:** a page that mentions `goa` five times is probably more about Goa than one that mentions it
   once. But with **diminishing returns**: the fiftieth mention adds almost nothing (and smells of spam).
2. **Inverse document frequency (IDF):** rare words are more informative. Matching `goa` says much more than
   matching `cheap`, which is in millions of pages. $\text{IDF}(t) \approx \log \frac{N}{n_t}$, where $N$ is the
   number of documents and $n_t$ the number containing term $t$.
3. **Length normalisation:** a 50,000-word page contains every word eventually. Mentions in a short page count
   for more.

**BM25** combines these into one score that is still the standard text-relevance baseline:

$$
\text{score}(q, d) = \sum_{t \in q} \text{IDF}(t) \cdot
\frac{tf_{t,d} \cdot (k_1 + 1)}{tf_{t,d} + k_1 \left(1 - b + b \cdot \frac{|d|}{\text{avgdl}}\right)}
$$

Here $tf_{t,d}$ is how often $t$ appears in $d$, $|d|$ is the document's length and avgdl the average length.
$k_1$ (typically about 1.2) controls how fast extra mentions stop helping, and $b$ (typically 0.75) how strongly
length is penalised. You do not need to memorise it; you need to explain the three ideas it encodes. Matches in the
title, headings, URL and **anchor text** of links pointing to the page are weighted more than body matches.

### Authority: is the page trustworthy? (PageRank)

Text relevance alone is easy to game: write `cheap flights` a thousand times. Larry Page and Sergey Brin's 1998
insight was to use the **links** between pages. A link from page X to page Y is a vote by X for Y. Votes from
important pages count more, and a page splits its vote among all the pages it links to.

Picture a **random surfer** who clicks a random link on every page, and occasionally (15% of the time) gets bored
and jumps to a random page anywhere. A page's **PageRank** is the fraction of time the surfer spends on it in the
long run. With $N$ pages and damping factor $d = 0.85$:

$$
PR(p) = \frac{1 - d}{N} + d \sum_{q \to p} \frac{PR(q)}{\text{outlinks}(q)}
$$

A tiny example with three pages: A links to B and C, B links to C, C links to A.

[![PageRank on three pages: A sends half its vote to B and half to C, B sends all its vote to C, C sends all its vote to A; the resulting scores are A 0.39, B 0.21, C 0.40](/img/system-design/google-search/06-pagerank.png)](/img/system-design/google-search/06-pagerank.png)

Start every page at $1/3$ and repeatedly apply the formula:

| Round | A | B | C |
| --- | --- | --- | --- |
| Start | 0.333 | 0.333 | 0.333 |
| 1 | 0.333 | 0.192 | 0.475 |
| 2 | 0.454 | 0.192 | 0.355 |
| 3 | 0.351 | 0.243 | 0.406 |
| Converged | 0.388 | 0.215 | 0.397 |

What the numbers teach:

- **C ranks highest** because it has two incoming links (from A and B).
- **A is almost equal to C with only one incoming link**, because that link comes from C, an important page, and C
  gives A its *whole* vote.
- **B is lowest:** its only incoming link is half of A's vote.
- The scores always add up to 1. At web scale the same iteration runs as a batch job over the whole link graph,
  converging in a few dozen rounds. The result is a **static score** per page, stored in the document table:
  computed offline, independent of any query.

The `(1 - d)/N` "boredom" term matters: without it, a group of pages linking only to each other would trap the
surfer and soak up all the rank. Link spam (link farms, paid links) is the obvious attack, so in practice links
are also weighted by trust, and PageRank is one signal among many, not the ranking.

### Freshness and everything else

- **Freshness:** for `election results` or `earthquake`, a page from ten minutes ago beats a better page from last
  year. Query classifiers detect such "news-seeking" queries and boost recent documents.
- **Other signals:** language and location match, mobile-friendliness, page speed, safe-search, and click
  behaviour aggregated over many users.

### Ranking in stages

Scoring every match with an expensive model is impossible: `cheap flights` matches millions of documents. So ranking
is a **funnel**:

1. **Retrieval at each shard:** a cheap score (BM25 plus static rank) over matching documents. Shards often order
   documents by static rank, so the best-quality pages come first in every posting list and the shard can **stop
   early** once the remaining documents cannot make the top $k$ (algorithms like WAND formalise this).
2. **Re-ranking:** the few hundred best candidates are re-scored with a heavier machine-learned model using many
   more signals.
3. **Final touches:** remove near-duplicate results, limit how many results come from one site, and mix in fresh
   results.

## 12. Deep dive: caching

Query popularity is very skewed: a small set of queries (`weather`, `facebook`, the news story of the day) makes up
a large share of traffic. That makes caching extremely effective, at several levels:

| Cache | Key → value | What it saves |
| --- | --- | --- |
| **Results cache** (front end) | normalised query + language + region + page → result IDs or the whole page | The entire fan-out |
| **Posting list cache** (shard) | term → decompressed posting list | Disk reads for common terms |
| **Document cache** (doc servers) | docID → text | Disk reads when building snippets |

Points interviewers probe:

- **Freshness vs hit rate.** A cached answer may hide a newer page. Short TTLs (minutes) for normal queries, very
  short or none for news-seeking queries, and an explicit flush when a new index version is swapped in.
- **Not everything is cacheable.** Google has said that around 15% of the queries it sees each day have never
  been seen before. Those always go to the index, so the cache shrinks the load but never removes the need for
  full serving capacity.
- **Stampedes.** When a hot entry expires, thousands of identical requests could all miss at once. Let one request
  recompute while others wait for it (request coalescing), or refresh popular entries just before they expire.

## 13. Deep dive: keeping the index fresh

The simplest way to update the index is to **rebuild it from scratch** and swap it in. That is reliable and
produces a perfectly compact index, but a full rebuild of 50 billion pages takes days, so a news article could not
be found until the next build. The standard answer is **tiers**:

[![Index tiers: the main crawl of the whole web feeds a batch index build that does a full rebuild over days and swaps in the base index of billions of docs on SSD; a fresh crawl of news and changed pages feeds an incremental indexer that adds and deletes single documents in seconds in a small fresh tier held in RAM; the query root searches both and merges, and the fresh tier is folded into the next batch build](/img/system-design/google-search/07-tiers.png)](/img/system-design/google-search/07-tiers.png)

*Select the diagram to zoom in and move around.*

- **Base tier:** the big index, rebuilt in batch every few days, immutable and heavily optimised.
- **Fresh tier:** a small index of recently changed and new pages, updated **one document at a time** within
  seconds to minutes and held in memory.
- **Query time:** the root searches both and merges. If a page appears in both, the fresh version wins.
- **Deletes and changes:** the base index files are never edited. A **deleted-docs list** (a bitmap of docIDs)
  hides removed or replaced documents until the next rebuild drops them for good.
- **Merging:** the fresh tier's contents are folded into the next base build, which keeps the fresh tier small.

This is the same "immutable big part + small mutable part + periodic merge" pattern as LSM trees and Lucene's
segments. Google moved from purely batch-built index layers to continuous incremental indexing with its
**Caffeine** system in 2010; the Percolator paper from the same year describes the incremental processing system
behind it.

A second, related use of tiers is about **cost**, not freshness. Put the best 10% of pages (by static rank) into a
first tier of 500 shards, and send a query to the full 5,000-shard index only when the first tier's results look
weak. If 80% of queries stop at the first tier, peak shard work becomes
$115{,}000 \times 500 + 23{,}000 \times 5{,}000 \approx 173$ million shard-queries per second instead of 575
million: more than three times cheaper.

## 14. Spelling correction and autocomplete

**Spelling correction ("Did you mean").** The best teacher is the query log: when many users type `chep flights`
and immediately retype `cheap flights`, that pair is strong evidence. A typical corrector generates candidates
within a small **edit distance** of each query word (insert, delete, swap or replace a letter), scores each
candidate phrase by how common it is in queries and on the web (a language model), and either silently searches the
correction (when confident) or offers "Did you mean". Correcting whole phrases, not single words, handles cases like
`new yrok` where each word could be corrected several ways.

**Autocomplete** suggests whole queries as you type, from a precomputed structure of popular queries, with its own
latency budget of a few tens of milliseconds per keystroke. It is a separate system with its own design; see the
[search autocomplete case study](/system-design/case-studies/easy/search-autocomplete/).

## 15. What breaks as it grows, and how to fix it

**The fan-out bill.** Every query touching every shard is the dominant cost. *Fix:* results caching, tiering by
static rank, early termination inside shards, and aggregation trees so no single machine merges thousands of
answers.

**The slowest shard.** More shards means more chances that one is slow. *Fix:* hedged and tied requests, per-shard
deadlines with partial results, and automatic removal of sick replicas.

**Hot terms and hot queries.** A breaking news story sends millions of identical queries in minutes. *Fix:* the
results cache absorbs repeats (with request coalescing); posting lists of hot terms stay in RAM; extra replicas
are added to the busiest data centres.

**The index outgrows the hardware.** The web keeps growing. *Fix:* document sharding makes this mostly mechanical:
add shards, rebuild, and the fan-out grows. Compression improvements pay twice, in storage and in how much fits in
RAM.

**Spam and duplicates.** Whole sites generate millions of near-identical pages to catch traffic. *Fix:* simhash
de-duplication at indexing time, spam classifiers, trust-weighted link signals, and collapsing many results from
one site.

**Bad index builds.** A bug in the indexer could ship a broken index to every data centre. *Fix:* immutable,
versioned index files; validate a new build on a few replicas (canary) with automated quality checks before rolling
it out; keep the previous version ready to swap back.

## 16. Reliability: failing soft

| Risk | Defence |
| --- | --- |
| A shard replica dies | Other replicas of the same shard serve; the root stops sending to the dead one |
| All replicas of a shard are slow or gone | Return results without that shard: quality drops slightly, the query still succeeds |
| A whole data centre fails | DNS and load balancers send users to another data centre, each of which holds a full copy of the index |
| A bad index or ranking change | Versioned, immutable index files; staged rollouts with quality metrics; instant rollback |
| Overload | Serve from cache, shed expensive features (fewer re-ranking candidates, no fresh tier) before refusing queries |

The pattern to remember: **search degrades in quality before it degrades in availability.** A slightly worse top
ten served in 200 ms beats a perfect one that never arrives.

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Index partitioning | By term | By document | **By document**: tiny network traffic per query, even load, failures lose a slice of docs not a term |
| Index updates | Full batch rebuild | Incremental | **Both**: a batch-built base tier plus a small incremental fresh tier, merged at query time |
| Slow shards | Wait for all | Deadline + hedging | **Hedge, then cut off**: partial results beat slow results |
| Ranking | One expensive model on all matches | Staged funnel | **Funnel**: cheap scores on millions, expensive model on hundreds |
| Duplicates | Index everything | Detect at index time | **Simhash at index time**: smaller index, cleaner results |
| Cache freshness | Long TTL, high hit rate | Short TTL, fresher | **Short TTL**, shorter still for news queries, flushed on index swap |
| Consistency | All data centres identical | Each converges independently | **Eventual**: nobody can tell if one copy is minutes newer |

## Cheat sheet for last-minute revision

- **Three systems:** crawl (offline, throughput) → index (offline, batch + incremental) → serve (online,
  ~200 ms). Crawling is a separate case study.
- **Processing:** parse (text, title, links, anchor text) → de-duplicate (shingles, 64-bit simhash, pigeonhole
  lookup on 16-bit blocks) → tokenise and normalise (lower-case, stem, positions).
- **Inverted index:** term → posting list sorted by docID with tf and positions. Intersect from the rarest term,
  skip pointers. Compress with delta (gap) + variable-byte encoding: smaller means more in RAM means faster.
- **Shard by document**, not by term: each shard returns a local top-k; the root merges with a heap. Replicas
  for throughput; aggregation trees for big fan-outs.
- **Tail latency:** $1 - 0.99^{n}$ of queries hit a slow shard. Fix with hedged requests (second copy after p95),
  deadlines and partial results.
- **Ranking funnel:** BM25 (tf with diminishing returns, IDF, length normalisation) + PageRank (random surfer,
  $d = 0.85$, votes split across out-links) + freshness, then an ML re-ranker on the top few hundred.
- **Caching:** results cache keyed by normalised query + language + region; short TTLs; around 15% of queries
  are new every day, so the index must still carry full load.
- **Freshness:** big immutable base tier + small in-memory fresh tier + deleted-docs bitmap, merged at the next
  build (LSM pattern).
- **Numbers:** ~10B queries/day (~116K/s, ~230K/s peak); 50B pages × 10 KB text = 500 TB; index ~200 TB in
  5,000 shards of 10M docs; crawl ~19K pages/s.

## Practice questions

1. **Why does each shard only need to return its local top 10 for the root to find the global top 10?** Any
   document in the global top 10 has at most nine documents scoring above it anywhere, so at most nine in its own
   shard: it must be in that shard's top 10. (This assumes scores are comparable across shards, which is why
   statistics like IDF are computed globally and shipped to every shard.)
2. **How would you support `site:example.com cheap flights`?** Index the host as a special term, such as
   `site:example.com`, so the filter becomes one more posting list to intersect, often the rarest one.
3. **A page was deleted an hour ago but still appears in results. Why, and how do you fix it?** It is in the
   immutable base index and possibly in the results cache. Add it to the deleted-docs bitmap, which every shard
   checks while scoring, and let short cache TTLs expire the cached pages.
4. **How would you design result page 2 (`start=10`)?** Ask each shard for its top 20 and take results 11–20 of
   the merge. Deep pages get expensive (page 50 needs the top 500 from every shard), which is one reason search
   engines cap how deep you can page.
5. **How would you add image search?** The same crawl → index → serve shape: index images by the text around them,
   their alt text and anchor text, plus visual features; a separate set of shards; and results blended into the
   main page by the front end.
