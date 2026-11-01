---
title: Contribute
description: How to add a solution, an explanation or a system design case study to CodePrime.
---

CodePrime is open source, and every page is a plain Markdown file in [the GitHub repository](https://github.com/umangkumarr/CodePrime). Fixing a typo, improving an explanation and adding a new problem are all welcome.

## Run the site locally

You need **Node.js 22.12 or newer**.

```sh
git clone https://github.com/umangkumarr/CodePrime.git
cd CodePrime
npm install
npm run dev
```

The site is then available at `http://localhost:4321/CodePrime/` and reloads as you edit.

## Add a problem

Create `src/content/docs/docs/codes/<problem-slug>.md`. The front matter holds the facts; the body holds the explanation. The page header, the "Solve on LeetCode" button, the complexity badges, the topic chips and the spoiler-safe code panel are all generated from it.

````md
---
title: Two Sum
source: https://leetcode.com/problems/two-sum/
difficulty: Easy            # optional: Easy | Medium | Hard
tags: [Array, Hash Table]
complexity:
  time: O(n)
  space: O(n)
---

## Problem

The problem statement (Markdown or HTML).

## Solution approach

### Intuition
### Algorithm
### Complexity

- **Time:** $O(n)$ — why.
- **Space:** $O(n)$ — why.

### Edge cases

## Code

```cpp title="C++"
// solution
```
````

[Two Sum](/docs/codes/two-sum/) is the reference example. For several languages, rename the file to `.mdx` and wrap the code blocks in Starlight's [`<Tabs syncKey="lang">`](https://starlight.astro.build/components/tabs/).

Finally, add the page's slug to the right group in `src/data/sidebar.json`.

## Add a system design case study

Create `src/content/docs/system-design/case-studies/<name>.md`. It appears in the System Design sidebar automatically. Diagrams can be written as [Mermaid](https://mermaid.js.org/) code blocks:

````md
```mermaid
flowchart LR
  Rider --> Gateway --> Dispatch --> Driver
```
````

## Open a pull request

1. Fork the repository and create a branch.
2. Run `npm run build` to make sure the site still builds.
3. Open a pull request describing what you added or changed.
