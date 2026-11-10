# CodePrime — guide for contributors and coding agents

CodePrime is a free, open-source DSA interview-prep site: 192 problems (Striver SDE sheet, Striver DP,
Blind 75, company lists and more), DSA fundamentals articles, Project Euler+ and system design. Every
problem page has the full official statement, an explanation that teaches the idea, and **C++, Java and
Python** solutions tested against brute force.

- Live site: https://umangkumarr.github.io/CodePrime/ (GitHub Pages, base path `/CodePrime`)
- Audience: people preparing for coding interviews. Optimise for clarity and trust, not cleverness.
- `AGENTS.md` is a symlink to this file. Edit `CLAUDE.md` only.

## Golden rules

**Always**
- Keep every solution **correct, optimal for the constraints, and tested** before it lands on a page (see [Testing](#testing-solutions)).
- Give every problem the **full official statement**: description, every example, constraints, follow-up.
- Write each solution in **C++, Java and Python**, as consecutive code blocks (they become one tab group).
- Use the **judge's own function signature** in every language.
- Reuse what exists: design tokens, components, helpers in `src/lib`, existing tag names.
- Run `python3 .github/scripts/check_content.py`, `npm run check` and `npm run build` before opening a PR.
- Work on a branch and open a PR into `main` (squash merge). `main` is protected.

**Never**
- Never change a page's **file name / URL** without adding a redirect in `src/data/redirects.json` (search rankings and old links depend on it).
- Never paste raw judge HTML into a statement, or invent constraints. If the source has none, write ones the solution is built for and mark them "Constraints (assumed)".
- Never use MDX `<Tabs>` for solution languages, never convert `.md` pages to `.mdx` without a reason (MDX chokes on `<`, `{`, `}` in prose and maths).
- Never use `innerHTML` (or `set:html`) with anything that isn't build-time, trusted content.
- Never float dependency versions; never add a dependency you don't need; never commit secrets.
- Never edit `dist/`, `.astro/` or `node_modules/`. Never commit `.vscode/` or scratch files.
- Never claim something about the content you haven't verified (e.g. "every problem is animated" — it isn't).

## Stack and commands

Astro 7 + Starlight, static output, deployed by GitHub Actions. Node.js **22.12+**, npm (`package-lock.json`).
KaTeX for maths (`remark-math` + `rehype-katex`), Mermaid for diagrams (`astro-mermaid`), Pagefind search.

```sh
npm install
npm run dev        # http://localhost:4321/CodePrime/  (hot reload)
npm run build      # production build in dist/
npm run preview    # serve dist/ (use this for screenshots: the dev server keeps a websocket open)
npm run check      # astro check (TypeScript) — must report 0 errors
python3 .github/scripts/check_content.py   # content rules for every problem page (also in CI)
```

## Repository map

| Path | What lives there |
| --- | --- |
| `src/content/docs/docs/codes/<slug>.md` | Problem pages (one file each; `minimum-spanning-tree.mdx` is the only MDX one) |
| `src/content/docs/docs/dsa/` | DSA fundamentals articles (bit magic, number theory, trees) |
| `src/content/docs/docs/project-euler/` | Project Euler+ (HackerRank) solutions; `249.md` is a draft |
| `src/content/docs/docs/interviews/` | Company interview lists |
| `src/content/docs/system-design/` | System design overview and case studies |
| `src/content/docs/docs/{dsa,leetcode}.mdx` | Track overview pages (render `TrackOverview`) |
| `src/content/docs/contribute.md` | Public contribution guide (keep in sync with this file) |
| `src/data/sidebar.json` | **Source of truth** for the DSA and LeetCode sidebars, sheet pages and breadcrumbs |
| `src/data/redirects.json` | Old URLs → new pages |
| `src/pages/index.astro` | Home page (also emits the site-level JSON-LD) |
| `src/pages/docs/leetcode/[sheet].astro` | One page per LeetCode sheet, generated from `sidebar.json` |
| `src/pages/docs/tags/` | Topic index and one page per tag |
| `src/routeData.ts` | Starlight route middleware: search titles, `og:type`, per-page JSON-LD + breadcrumbs |
| `src/plugins/rehype-problem-layout.mjs` | Wraps `## Problem` in the statement card; puts `## Solution approach` and `## Code` behind spoiler gates |
| `src/plugins/remark-code-tabs.mjs` | Turns consecutive cpp/java/python fences into one `<cp-code-tabs>` group |
| `src/plugins/rehype-base-links.mjs` | Prefixes `/CodePrime` to root-relative links and image sources |
| `src/components/` | `ProblemHeader`, `Notepad`, `RelatedProblems`, `TrackOverview`, Starlight overrides |
| `src/scripts/reader.ts` | Spoiler gates, language tabs, "mark as solved", ←/→ page navigation |
| `src/scripts/notepad.ts` | Per-problem notes scratchpad |
| `src/lib/` | `tags.ts` (tag slugs/pages), `tracks.mjs` (sidebar helpers), `platform.mjs` (judge names) |
| `src/styles/theme.css`, `content.css` | Design tokens (light + dark) and reading styles |
| `public/img/codes/<slug>/` | Generated walkthrough GIFs / SVGs for that problem |
| `public/` | Favicons, `og.png` (link-preview image), `site.webmanifest` |
| `.github/` | CI (`ci.yml`), deploy (`deploy.yml`), Dependabot, CODEOWNERS, content checker, README images |

## Problem pages

### Front matter

```yaml
---
title: "Two Sum"                       # official problem name; shown as the H1
description: "Return the indices of the two numbers that add up to a target, in one pass using a hash map."
source: "https://leetcode.com/problems/two-sum/"   # canonical URL, no tracking params (utm_*, source=, campaign=, fbclid, topList)
difficulty: "Easy"                     # Easy | Medium | Hard (GfG Basic/School → Easy, Code360 Moderate → Medium)
tags: ["Array", "Hash Table"]          # reuse existing tag names — see below
complexity:
  time: "O(n)"                         # KaTeX; escape backslashes: "O(n \\log n)"
  space: "O(n)"
---
```

- `description` (≤ ~160 characters) says **what is asked and the key technique**. It is the Google snippet.
- Tags: reuse existing names exactly (check `grep -h '^tags:' src/content/docs/docs/codes/*.md`). Canonical
  spellings: `Array` (not Arrays), `Hash Table` (not Hash/Hashing/Hash Maps), `Two Pointers`, `Union Find`,
  `Heap (Priority Queue)`, `Graph`, `Divide and Conquer`, `Stack`. A new spelling creates a new tag page.
- `source` decides the platform label ("Solve on LeetCode") via `src/lib/platform.mjs`.

### Body — sections in this order

1. `## Problem` — the official statement as **Markdown** (no raw HTML, no `###` headings — they pollute the
   table of contents). Then every official example and the constraints:

   ````md
   **Example 1:**

   ```text
   Input:  nums = [2,7,11,15], target = 9
   Output: [0,1]
   Explanation: ...
   ```

   **Constraints:**

   - $2 \le$ `nums.length` $\le 10^4$
   - $-10^9 \le$ `nums[i]` $\le 10^9$

   **Follow-up:** ...
   ````

   Keep official example images (LeetCode/GfG asset URLs) as Markdown images. GfG pages also state the
   function to complete ("Complete the function `foo()` which …") and expected complexity.
2. `## Solution approach` — `### Intuition` (why it works: the invariant, not a code tour), `### Algorithm`
   (numbered steps using the code's real variable names), optional `### Walkthrough` (a visual or a short
   trace of Example 1), `### Complexity` (bullets with reasons), `### Edge cases` (only real ones, and how the
   code handles them). Several approaches (brute force → optimal) use `### Approach 1: <name>` with **bold**
   sub-labels (Intuition / Algorithm / Complexity).
3. `## Code` — see below.

The site adds the rest automatically: the problem header (difficulty, complexity badges, tags, "Solve on …",
"Mark as solved"), the statement card, spoiler gates on the approach and the code, the notes scratchpad,
related problems, search title and structured data.

### Code blocks — three languages, one tab group

````md
```cpp
class Solution { ... };
```

```java
class Solution { ... }
```

```python
class Solution:
    ...
```
````

- Order is always **cpp, java, python**, separated only by blank lines (any text in between breaks the group).
- One approach → no `title`. Several approaches → one run of three fences per approach, every fence carrying
  the same `title="Approach 2: Two pointers"`. A repeated language starts the next group automatically.
- Explanations should be language-neutral ("a hash map", not `unordered_map`).

### Writing style

Plain, precise, teacher-like English. Explain **why** before **how**. Short sentences, no filler, no emojis,
no "Let's dive in". British spelling (colour, optimise). Maths in KaTeX (`$O(n \log n)$`, `$10^5$`); keep `<` and
`>` inside code spans or KaTeX, and escape a literal dollar sign as `\$`.

### Visuals

Add one when pointer movement, windows, DP tables, recursion, or list/tree/graph structure is central to the
idea. Skip it for trivial problems; one good visual beats three mediocre ones.

- **Animated GIF** (arrays, strings, grids, DP tables): `public/img/codes/<slug>/<name>.gif`. Frames must be
  computed by running the algorithm, never hand-typed. ≤ ~15 frames, ≤ ~300 KB, drawn on a **white rounded
  card** (the site has a dark theme), with a caption per frame. Check a couple of frames by eye.
- **Mermaid** (trees, graphs, lists, recursion trees): a ```` ```mermaid ```` block; light fills with dark text
  via `classDef` so it reads in both themes. It must parse (CI builds the site; check it renders).
- **SVG** for anything else, with a solid white background.
- Reference images root-relative: `![What the animation shows](/img/codes/<slug>/<name>.gif)`. Alt text says
  what the image shows.

## Solution code standards

- **Correct and optimal** for the stated constraints and follow-up (e.g. O(1) space when asked). If the
  existing solution is wrong or slow, replace it and say why in the PR.
- **Same algorithm and complexity in all three languages** — idiomatic, not transliterated.
- **Signatures:** copy the judge's starter code (LeetCode/GfG) exactly: class, method, parameter names and
  types. Judges without starter code (InterviewBit, Coding Ninjas) use that judge's usual style. Full-program
  judges (AtCoder, HackerRank Euler) get full programs (`public class Main` / `Solution`, a `sys.stdin` script).
- **Don't include judge-provided types** (`ListNode`, `TreeNode`, GfG `Node`) in page code.
- **C++:** `class Solution` with the judge's signature; `long long` where values can exceed 2^31−1; no
  `#define` hacks, no dead code, no debug output.
- **Java (17+):** no imports (judges import `java.util.*`; use fully-qualified names for anything else, except
  full programs); `ArrayDeque` not `Stack`; `long` wherever C++ uses `long long`.
- **Python 3:** import stdlib modules you use (`heapq`, `collections`, `bisect`…) but not typing helpers or
  judge types; keep the stub's annotations (`list[int]`, `Optional[TreeNode]`). Python's recursion limit is
  1000 — if the C++ recursion can go deeper at max constraints, use an explicit stack (same algorithm and
  complexity). Clamp to 32 bits explicitly where the problem demands it (atoi, reverse integer).
- Comments only where something is non-obvious.

## Testing solutions

Nothing goes on a page untested. For every solution in every language:

1. **Extract the code from the page** (don't retype it) so what you test is byte-identical to what ships.
2. Run **all official examples** with expected outputs.
3. Run **≥ 1,000 random small cases** against a simple brute force (or against the page's tested C++), or
   **every input** when inputs are tiny (e.g. N-Queens n ≤ 9).
4. Run a **max-constraint case** to catch timeouts, overflow and recursion depth.
5. Compile strictly: C++ `g++ -std=c++17 -O2 -Wall -fsanitize=address,undefined`;
   Java `javac --release 17 -Xlint:all`; Python 3 (code must also parse on 3.10+).
6. Design / stateful problems: random operation sequences against a simple model.

State in the PR how each solution was tested. CI checks structure, code-tab grouping, Python syntax, the type
check and the build — it does **not** run solution tests, so this step is on you.

## Other content

- **DSA articles** (`docs/dsa/`): concept-first teaching pages; code as full programs with `main` in the same
  cpp/java/python order (no spoiler gates). Add new ones to `sidebar.json` under the right group.
- **Project Euler+** (`docs/project-euler/NNN.md`): HackerRank full programs reading stdin; `sidebar.label`
  "NNN · Title", `sidebar.order` = problem number.
- **System design** (`system-design/case-studies/<name>.md`): appears in its sidebar automatically; diagrams in Mermaid.
- **Company lists** (`docs/interviews/`): lists linking to problem pages.

## Adding a problem — checklist

1. Fetch the official statement, examples, constraints, difficulty and starter code (LeetCode GraphQL
   `question(titleSlug)` / GfG `practiceapi.geeksforgeeks.org/api/latest/problems/<slug>/` / Code360
   `naukri.com/code360/api/v3/public_section/problem_detail?slug=`).
2. Create `src/content/docs/docs/codes/<slug>.md` (slug = the judge's slug) following the format above.
3. Write and **test** C++, Java and Python. Add a visual if the idea needs one.
4. Add `docs/codes/<slug>` to the right group(s) in `src/data/sidebar.json`.
5. `python3 .github/scripts/check_content.py && npm run check && npm run build`, then check the page in
   `npm run dev` (light + dark, phone width, tabs, gates).
6. Branch → commit → PR into `main` with what you tested.

Editing an existing problem: keep its slug and front-matter keys; re-test any code you touch; update
`complexity` if the algorithm changes.

## How the site works (things that are easy to break)

- `sidebar.json` drives the LeetCode/DSA sidebars, the sheet pages (`/docs/leetcode/<sheet-slug>/`), their
  "All problems / All lists" links, and the breadcrumbs. Group labels become URL slugs — renaming a group
  changes its URL.
- `rehype-problem-layout` keys off the exact headings `## Problem`, `## Solution approach`, `## Code`.
- **Astro caches rendered Markdown.** After changing any remark/rehype plugin, delete `.astro/data-store.json`
  and `node_modules/.astro` before building, or `.md` pages keep the old output.
- Starlight's `.sl-markdown-content` adds top margins between siblings; injected UI needs `class="not-content"`.
- The notepad moves itself to `<body>` because the main column is an isolated stacking context.
- Browser storage keys (keep them stable — users' data lives there): `codeprime:solved`,
  `codeprime:always-show-solutions`, `codeprime:lang`, `codeprime:notes:<permalink>`, `codeprime:notes-open`,
  `codeprime:notes-width`. Every access is wrapped in try/catch.
- Search metadata is automatic: `src/routeData.ts` builds titles ("Two Sum — Solution in C++, Java & Python |
  CodePrime") and JSON-LD from front matter; `index.astro` emits the site-level JSON-LD; the sitemap's
  `<lastmod>` comes from git history (the deploy workflow checks out with full history).
- Google shows one site name and favicon per hostname; on `umangkumarr.github.io` those come from the
  portfolio at the domain root, not from this repo. A custom domain would be needed to change them.

## UI and design principles

Based on Apple's Human Interface Guidelines (purpose, simplicity, familiarity, accessibility, craft):

- **Glass is only for the floating functional layer** (Apple's Liquid Glass rule). `src/styles/glass.css`
  styles the top bar, sidebar, "On this page" panel, phone menu and contents bar, search dialog, spoiler
  gates and the notes scratchpad: they float inset from the window edges over an ambient light field.
  **Never put glass on content** (statements, prose, code, cards, lists) — content stays on calm, near-opaque
  surfaces. Don't add new glass surfaces without a strong reason; reuse the `--glass-*` tokens if you must.
  Reduce Transparency / Increase Contrast / no `backdrop-filter` support fall back to opaque surfaces —
  keep that working. Beware: `backdrop-filter` makes an element the containing block of its `position: fixed`
  children (it once unpinned the phone "On this page" bar).
- **One job per screen**; every element earns its place. Prefer removing to adding.
- **Use the tokens** in `src/styles/theme.css` (`--cp-*`, `--sl-*`); never hard-code new colours or fonts.
  Every colour needs light and dark values.
- **Accent colour (amber) only for primary actions and key status** — not decoration.
- **Contrast ≥ 4.5:1** for text in both themes; **touch targets ≥ 44px** for buttons (chips ≥ 40px);
  visible `:focus-visible` outlines; full keyboard support; meaningful alt text.
- **Motion is optional:** honour `prefers-reduced-motion` (static image fallback for GIFs on the home page).
- **Responsive:** check 390px (phone), 768px, 1440px and 2560px; no horizontal page scroll.
- **Progressive enhancement:** content must work without JavaScript (gates and tabs simply show everything).
- **Labels say what happens** ("Show code", "Start solving"), sentence case, no "Click here".

## Security

- No `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`eval`; build DOM with `textContent` and `createElement`.
  `set:html` is allowed only for build-time output of our own content (KaTeX).
- External links that open a new tab use `rel="noopener noreferrer"`. Use `https://` everywhere.
- Mermaid runs with `securityLevel: 'strict'`.
- Dependencies are pinned to **exact versions**; transitive fixes go in `package.json` `overrides` (e.g.
  `katex`). GitHub Actions are pinned to commit SHAs with a version comment. Dependabot opens weekly update PRs.
- Secret scanning and push protection are on — never commit tokens or `.env` files.

## Git and pull requests

- `main` is protected: changes go through a PR, reviewed by the owner (CODEOWNERS), **squash-merged**.
- Branch names: `feat/…`, `fix/…`, `docs/…`. One coherent change per PR.
- PR description: `## Summary` (what and why) and `## Test plan` (checkbox list of what you actually ran).
- CI (`.github/workflows/ci.yml`) must pass: content check, `astro check`, build.
- Don't commit generated or local files (`dist/`, `.astro/`, `.vscode/`, scratch notes, test harnesses).
