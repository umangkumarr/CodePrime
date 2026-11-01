---
title: "DFS of Graph"
description: "Given a connected undirected graph. Perform a Depth First Traversal of the graph. Note: Use recursive approach to find the DFS traversal of the graph…"
source: "https://practice.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1"
tags: ["Array", "Depth-First Search", "Graph"]
complexity:
  time: "O(V + E)"
  space: "O(V)"
---

## Problem

Given a connected undirected graph. Perform a Depth First Traversal of the graph.
<strong>Note:</strong> Use recursive approach to find the DFS traversal of the graph starting from the 0th vertex from left to right according to the graph.

## Solution approach

### Intuition

Depth-first search goes as deep as possible along one neighbour before backing up and trying the next. Recording a vertex the first time we reach it gives the DFS order. The `vis` array makes sure each vertex is recorded and expanded only once, even though the undirected graph has many paths to it.

### Algorithm

1. Size `vis` to `V` and call `dfs(adj, 0, -1)`, starting from vertex `0`.
2. In `dfs`, return if `cur` is already visited. Otherwise mark it, append it to `ans`, and recurse into each neighbour `nbr` in the order it appears in `adj[cur]`.
3. The `nbr != par` check skips the edge back to the parent; this is just a shortcut, since the parent is already visited anyway.
4. Return `ans`.

### Complexity

- **Time:** $O(V + E)$ — each vertex is expanded once and each adjacency list is scanned once.
- **Space:** $O(V)$ — `vis`, `ans`, and the recursion stack, which can be $V$ deep on a path-shaped graph.

### Edge cases

- Only vertices reachable from `0` are listed, which is what the problem asks for.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> ans;
    vector<int> vis;
    void dfs(vector<int> adj[], int cur, int par) {
        if (vis[cur]) return;
        vis[cur] = 1;
        ans.push_back(cur);
        for (auto nbr : adj[cur]) {
            if (nbr != par) {
                dfs(adj, nbr, cur);
            }
        }
    }

    vector<int> dfsOfGraph(int V, vector<int> adj[]) {
        vis.resize(V);
        dfs(adj, 0, -1);
        return ans;
    }
};
```
