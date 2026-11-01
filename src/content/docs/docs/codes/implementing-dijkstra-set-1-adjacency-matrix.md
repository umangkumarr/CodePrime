---
title: "Dijkstra Algorithm"
description: "Given a weighted, undirected and connected graph of V vertices and E edges, Find the shortest distance of all the vertex's from the source vertex S. Note:…"
source: "https://practice.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1"
tags: ["Graph", "Dynamic Programming", "Heap(Priority_Queue)"]
complexity:
  time: "O((V + E) \\log V)"
  space: "O(V + E)"
---

## Problem

Given a weighted, undirected and connected graph of V vertices and E edges, Find the shortest distance of all the vertex's from the source vertex S.
<strong>Note:</strong> The Graph doesn't contain any negative weight cycle.

## Solution approach

### Intuition

With non-negative weights, the unvisited vertex with the smallest tentative distance already has its final distance: any other route to it would go through a vertex that is at least as far. Dijkstra's algorithm repeatedly finalises that vertex using a min-heap.

This code writes the usual loop recursively. The heap `q` is a class member shared by all calls, so every call to `dfs` pops the globally smallest entry next. The first time a vertex is popped, its distance is final; later, larger entries for it are ignored by the `vis` check.

### Algorithm

1. Size `vis` to `V` and `wt` to `V` with `INT_MAX`, then call `dfs(S, -1, adj, 0)`.
2. In `dfs(cur, par, adj, wth)`, return if `cur` is already visited. Otherwise set `wt[cur] = wth` and mark it visited.
3. For each edge `i` of `cur` (`i[0]` is the neighbour, `i[1]` the weight), except the one back to `par`, push `{wt[cur] + i[1], i[0]}` into `q`.
4. While `q` is not empty, pop the smallest pair and call `dfs` on its vertex with that distance.
5. Return `wt`.

### Complexity

- **Time:** $O((V + E) \log V)$ — every edge pushes at most one heap entry, and each push or pop costs $O(\log E) = O(\log V)$.
- **Space:** $O(V + E)$ — the heap can hold one entry per edge, and the recursion can be up to $V$ calls deep.

### Edge cases

- **Unreachable vertices** keep the value `INT_MAX`.
- Despite the title, the input is an adjacency list, not an adjacency matrix.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> vis;
    priority_queue<pair<int, int>, vector<pair<int, int>>,
                   greater<pair<int, int>>>
        q;
    vector<int> wt;
    void dfs(int cur, int par, vector<vector<int>> adj[], int wth) {
        if (vis[cur]) return;
        wt[cur] = wth;
        vis[cur] = 1;
        for (auto i : adj[cur]) {
            if (i[0] != par) {
                q.push({wt[cur] + i[1], i[0]});
            }
        }

        while (!q.empty()) {
            pair<int, int> p = q.top();
            q.pop();
            dfs(p.second, cur, adj, p.first);
        }
    }

    vector<int> dijkstra(int V, vector<vector<int>> adj[], int S) {
        vis.resize(V);
        wt.resize(V, INT_MAX);
        dfs(S, -1, adj, 0);
        return wt;
    }
};

```
