---
title: "Bellman-Ford Algorithm"
description: "Given a weighted, directed and connected graph of V vertices and E edges, Find the shortest distance of all the vertex's from the source vertex S. Note:…"
source: "https://practice.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/0/?fbclid=IwAR2_lL0T84DnciLyzMTQuVTMBOi82nTWNLuXjUgahnrtBgkphKiYk6xcyJU"
tags: ["Graph", "Dynamic Programming"]
complexity:
  time: "O(V \\cdot E)"
  space: "O(V + E)"
---

## Problem

Given a weighted, directed and connected graph of V vertices and E edges, Find the shortest distance of all the vertex's from the source vertex S.
<strong>Note:</strong> The Graph doesn't contain any negative weight cycle.

## Solution approach

### Intuition

A shortest path with no negative cycle uses at most $V - 1$ edges. Relaxing every edge once (trying `dist[u] + w` as a better value for `dist[v]`) extends every correct shortest path by at least one edge. So after enough rounds of relaxing all edges, every distance is final. Unlike Dijkstra, this works with negative edge weights.

### Algorithm

1. Initialise `dist` to `100000000` (treated as infinity) for every vertex and `dist[S] = 0`.
2. `edges` is a copy of `adj`, where each entry is `[u, v, w]`.
3. Repeat `V` times: for every edge, set `dist[v] = min(dist[u] + w, dist[v])`.
4. Return `dist`; unreachable vertices keep the value `100000000`.

### Complexity

- **Time:** $O(V \cdot E)$ — `V` rounds, each relaxing all $E$ edges.
- **Space:** $O(V + E)$ — `dist`, plus the copy of the edge list in `edges` (and `adj` itself is passed by value).

### Edge cases

- **Unreachable vertices with negative outgoing edges:** the code relaxes from `u` even when `dist[u]` is still `100000000`, so such an edge can lower `dist[v]` below "infinity" even though `v` is unreachable.
- No negative-cycle detection is done; the code assumes there is none.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> bellman_ford(int V, vector<vector<int>> adj, int S) {
        vector<int> dist(V, 100000000);
        vector<vector<int>> edges = adj;
        dist[S] = 0;
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < edges.size(); j++) {
                int u = edges[j][0];
                int v = edges[j][1];
                int w = edges[j][2];
                dist[v] = min(dist[u] + w, dist[v]);
            }
        }
        return dist;
    }
};
```
