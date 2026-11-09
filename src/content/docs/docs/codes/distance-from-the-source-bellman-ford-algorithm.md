---
title: "Bellman-Ford Algorithm"
description: "Find shortest distances from a source in a directed graph with possibly negative edge weights, and detect negative cycles, using Bellman-Ford relaxation."
source: "https://practice.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/0"
difficulty: "Medium"
tags: ["Dynamic Programming", "Graph"]
complexity:
  time: "O(V \\cdot E)"
  space: "O(V)"
---

## Problem

Given a weighted graph with **V** vertices numbered from `0` to `V-1` and edges, represented by a 2d array **`edges[][]`**, where `edges[i] = [u, v, w]` represents a direct edge from node `u` to `v` having `w` edge weight. You are also given a source vertex **`src`**.

Compute the shortest distances from the `src` to all other vertices. If a vertex is unreachable from the `src`, its distance should be marked as $10^8$. Additionally, if the graph contains a negative weight cycle, return `[-1]` to indicate that shortest paths cannot be reliably computed.

Complete the function `bellmanFord()` which takes `V`, `edges` and `src` and returns the list of distances.

**Example 1:**

![Graph for Example 1](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/893096/Web/Other/blobid0_1744455175.jpg)

```text
Input:  V = 5, edges[][] = [[1, 3, 2], [4, 3, -1], [2, 4, 1], [1, 2, 1], [0, 1, 5]], src = 0
Output: [0, 5, 6, 6, 7]
Explanation: Shortest Paths:
For 0 to 1 minimum distance will be 5. By following path 0 -> 1
For 0 to 2 minimum distance will be 6. By following path 0 -> 1 -> 2
For 0 to 3 minimum distance will be 6. By following path 0 -> 1 -> 2 -> 4 -> 3
For 0 to 4 minimum distance will be 7. By following path 0 -> 1 -> 2 -> 4
```

**Example 2:**

![Graph for Example 2](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/893096/Web/Other/blobid1_1744455218.jpg)

```text
Input:  V = 4, edges[][] = [[0, 1, 4], [1, 2, -6], [2, 3, 5], [3, 1, -2]], src = 0
Output: [-1]
Explanation: The graph contains a negative weight cycle formed by the path 1 -> 2 -> 3 -> 1, where the total weight of the cycle is negative.
```

**Constraints:**

- $1 \le V \le 100$
- $1 \le E =$ `edges.size()` $\le V \times (V-1)$
- $-1000 \le w \le 1000$
- $0 \le$ `src` $\lt V$

## Solution approach

### Intuition

**Relaxing** an edge `u → v` of weight `w` means trying `dist[u] + w` as a better value for `dist[v]`. If there is no negative cycle, every shortest path is simple, so it uses at most $V - 1$ edges. After round $k$ of relaxing **all** edges, every vertex whose shortest path has at most $k$ edges already has its correct distance (by induction: the last edge of that path is relaxed in round $k$ with its predecessor already correct). So $V - 1$ rounds are enough — and unlike Dijkstra, this does not care whether weights are negative.

That same fact gives the negative-cycle test: if after $V - 1$ rounds some edge can **still** be relaxed, distances are still decreasing, which is only possible if a negative cycle is reachable from `src`.

### Algorithm

1. Set `dist[i] = INF` ($10^8$) for every vertex and `dist[src] = 0`.
2. Repeat up to `V - 1` rounds. In each round, for every edge `[u, v, w]` with `dist[u] != INF`, set `dist[v] = dist[u] + w` if that is smaller, and remember that something `changed`. If a whole round changes nothing, the distances are final, so stop early.
3. Do one more pass over the edges. If any reachable edge can still be relaxed, return `{-1}`.
4. Otherwise return `dist`; unreachable vertices still hold `INF` = $10^8$, as required.

### Walkthrough

Example 1, with the edges relaxed in input order. Because the edge `0 → 1` comes **last** in the list, each round only pushes correct distances one edge further — this is exactly why up to $V - 1$ rounds are needed:

![Bellman-Ford distance table, one row per round](/img/codes/distance-from-the-source-bellman-ford-algorithm/rounds.gif)

### Complexity

- **Time:** $O(V \cdot E)$ — at most $V - 1$ rounds plus the check pass, each scanning all $E$ edges.
- **Space:** $O(V)$ — the `dist` array (the edge list is read in place).

### Edge cases

- **Unreachable vertices with negative outgoing edges:** edges are relaxed only when `dist[u] != INF`, so "infinity minus something" never leaks into `dist[v]`, and those vertices stay at $10^8$.
- **Negative cycle not reachable from `src`:** its edges are never relaxed, so it does not cause `{-1}`; the distances from `src` are still well defined.
- **Overflow:** distances are bounded by $(V-1) \cdot 1000$ in absolute value, far within `int`.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> bellmanFord(int V, vector<vector<int>>& edges, int src) {
        const int INF = 100000000;
        vector<int> dist(V, INF);
        dist[src] = 0;

        for (int round = 1; round < V; round++) {
            bool changed = false;
            for (const auto& e : edges) {
                int u = e[0], v = e[1], w = e[2];
                if (dist[u] != INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    changed = true;
                }
            }
            if (!changed) break;  // distances are already final
        }

        // An edge that can still be relaxed means a reachable negative cycle.
        for (const auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != INF && dist[u] + w < dist[v]) return {-1};
        }
        return dist;
    }
};
```
