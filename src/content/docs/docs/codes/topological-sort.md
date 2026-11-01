---
title: "Topological sort"
description: "Given a Directed Acyclic Graph (DAG) with V vertices and E edges, Find any Topological Sorting of that Graph."
source: "https://practice.geeksforgeeks.org/problems/topological-sort/1"
tags: ["Hash Table", "Depth-First Search", "Breadth-First Search", "Graph"]
complexity:
  time: "O(V + E)"
  space: "O(V)"
---

## Problem

Given a Directed Acyclic Graph (DAG) with V vertices and E edges, Find any Topological Sorting of that Graph.

## Solution approach

### Intuition

In a DFS, a node finishes only after every node reachable from it has finished. So if we push each node onto a stack when it finishes, every node ends up above all the nodes it points to. Popping the stack then gives an order where each edge `u -> v` has `u` before `v`, which is a topological order.

### Algorithm

1. Mark all nodes unvisited in `vis`.
2. For each node `i` not yet visited, call `findTopoSort(i, vis, st, adj)`.
3. `findTopoSort` marks `node` visited, recurses on every unvisited neighbour in `adj[node]`, and then pushes `node` onto `st`.
4. Pop everything off `st` into `topo` and return it.

### Complexity

- **Time:** $O(V + E)$ — each vertex and each edge is processed once.
- **Space:** $O(V)$ — the `vis` array, the stack `st`, and a recursion depth of up to $V$.

### Edge cases

- **Disconnected graph**: the outer loop starts a new DFS from every unvisited node, so every component is included.

## Code

```cpp title="C++"
class Solution {
   public:
    void findTopoSort(int node, vector<int>& vis, stack<int>& st,
                      vector<int> adj[]) {
        vis[node] = 1;

        for (auto it : adj[node]) {
            if (!vis[it]) {
                findTopoSort(it, vis, st, adj);
            }
        }
        st.push(node);
    }

   public:
    vector<int> topoSort(int N, vector<int> adj[]) {
        stack<int> st;
        vector<int> vis(N, 0);
        for (int i = 0; i < N; i++) {
            if (vis[i] == 0) {
                findTopoSort(i, vis, st, adj);
            }
        }
        vector<int> topo;
        while (!st.empty()) {
            topo.push_back(st.top());
            st.pop();
        }
        return topo;
    }
};
```
