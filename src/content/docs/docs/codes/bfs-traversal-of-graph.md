---
title: "BFS of graph"
description: "Given a directed graph. The task is to do Breadth First Traversal of this graph starting from 0. Note: One can move from node u to node v only if there's…"
source: "https://practice.geeksforgeeks.org/problems/bfs-traversal-of-graph/1"
tags: ["Array", "Breadth-First Search", "Graph"]
complexity:
  time: "O(V + E)"
  space: "O(V + E)"
---

## Problem

Given a directed graph. The task is to do Breadth First Traversal of this graph starting from 0.
<strong>Note:</strong>  One can move from node u to node v only if there's an edge from u to v and find the BFS traversal of the graph starting from the 0th vertex, from left to right according to the graph. Also, you should only take nodes directly or indirectly connected from Node 0 in consideration.

## Solution approach

### Intuition

Breadth-first search visits vertices in order of their distance from the start vertex `0`. A queue gives this order: vertices are taken from the front and their neighbours are added at the back. A `vis` array makes sure every vertex is reported only once.

### Algorithm

1. Push vertex `0` into the deque `q`.
2. While `q` is not empty, pop the front vertex `cur`.
3. If `vis[cur]` is already set, skip it. Otherwise append `cur` to `ans` and mark it visited.
4. Push every neighbour `nbr` in `adj[cur]` to the back of `q`.
5. Return `ans`.

The visited check happens when a vertex is **popped**, not when it is pushed, so a vertex can enter the queue several times but is processed only once.

### Complexity

- **Time:** $O(V + E)$ — each vertex is processed once and each edge causes at most one push.
- **Space:** $O(V + E)$ — the queue can hold up to one entry per edge because duplicates are pushed.

### Edge cases

- **Disconnected graph:** only the vertices reachable from `0` are returned, as the problem requires.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> bfsOfGraph(int V, vector<int> adj[]) {
        vector<int> ans;
        vector<int> vis(V);
        deque<int> q;
        q.push_back(0);
        while (q.size()) {
            int cur = q.front();
            q.pop_front();
            if (vis[cur]) continue;
            ans.push_back(cur);
            vis[cur] = 1;
            for (auto nbr : adj[cur]) {
                q.push_back(nbr);
            }
        }
        return ans;
    }
};

```
