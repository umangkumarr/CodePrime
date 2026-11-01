---
title: "Is Graph Bipartite?"
description: "There is an undirected graph with n nodes, where each node is numbered between 0 and n - 1. You are given a 2D array graph, where graph[u] is an array of…"
source: "https://leetcode.com/problems/is-graph-bipartite/"
tags: ["Depth-First Search", "Breadth-First Search", "Union Find", "Graph"]
complexity:
  time: "O(V \\cdot (V + E))"
  space: "O(V \\cdot (V + E))"
---

## Problem

<p>There is an <strong>undirected</strong> graph with <code>n</code> nodes, where each node is numbered between <code>0</code> and <code>n - 1</code>. You are given a 2D array <code>graph</code>, where <code>graph[u]</code> is an array of nodes that node <code>u</code> is adjacent to. More formally, for each <code>v</code> in <code>graph[u]</code>, there is an undirected edge between node <code>u</code> and node <code>v</code>. The graph has the following properties:</p>

<ul>
	<li>There are no self-edges (<code>graph[u]</code> does not contain <code>u</code>).</li>
	<li>There are no parallel edges (<code>graph[u]</code> does not contain duplicate values).</li>
	<li>If <code>v</code> is in <code>graph[u]</code>, then <code>u</code> is in <code>graph[v]</code> (the graph is undirected).</li>
	<li>The graph may not be connected, meaning there may be two nodes <code>u</code> and <code>v</code> such that there is no path between them.</li>
</ul>

<p>A graph is <strong>bipartite</strong> if the nodes can be partitioned into two independent sets <code>A</code> and <code>B</code> such that <strong>every</strong> edge in the graph connects a node in set <code>A</code> and a node in set <code>B</code>.</p>

<p>Return <code>true</code><em> if and only if it is <strong>bipartite</strong></em>.</p>

## Solution approach

### Intuition

A graph is bipartite if we can paint every vertex with one of two colours so that no edge joins two vertices of the same colour. A DFS can try this greedily: paint the start vertex colour `1`, then every unvisited neighbour gets the opposite colour. If we ever reach an already painted neighbour with the **same** colour as the current vertex, the two-colouring is impossible.

The graph may be disconnected, so the DFS is started from every vertex that has not been painted yet.

### Algorithm

1. `isBipartite` calls `dfs(graph, n)`, which creates `visited` (0 means unpainted) and starts `dfs_helper` from each unpainted vertex `i` with colour `1`.
2. `dfs_helper` paints `node` with `color`, then looks at each neighbour `nbr`:
   - if `nbr` is not the parent `par` and is unpainted, recurse with colour `3 - color` (switching between `1` and `2`); propagate a `false` result;
   - otherwise, if `visited[nbr] == color`, the edge joins two same-coloured vertices, so return `false`.
3. If every component is painted without conflict, return `true`.

### Complexity

- **Time:** $O(V \cdot (V + E))$ — the DFS itself visits each vertex and edge once, but `dfs_helper` takes `Graph` **by value**, so each of the $V$ calls copies the whole adjacency list.
- **Space:** $O(V \cdot (V + E))$ — the recursion stack can be $V$ frames deep, and each frame holds its own copy of `Graph`.

### Edge cases

- **Disconnected graph:** the loop in `dfs` starts a new DFS for every component.
- **Odd cycle** such as a triangle: the last vertex meets a neighbour painted with its own colour, so the answer is `false`.

## Code

```cpp title="C++"
class Solution {
   public:
    bool dfs_helper(vector<vector<int>> Graph, vector<int>& visited, int par,
                    int node, int color) {
        visited[node] = color;          // painted
        for (auto nbr : Graph[node]) {  // traversing nbrs
            if (nbr != par and visited[nbr] == 0) {
                bool value = dfs_helper(Graph, visited, node, nbr, 3 - color);
                if (value == false) return false;
            } else if (visited[nbr] == color)
                return false;
        }
        return true;
    }

    bool dfs(vector<vector<int>> Graph, int N) {
        vector<int> visited(N + 1);
        int color = 1;
        for (int i = 0; i < N; i++) {
            if (visited[i] == 0) {
                bool ans = dfs_helper(Graph, visited, -1, i, 1);
                if (ans == false) return ans;
            }
        }
        return true;
    }

    bool isBipartite(vector<vector<int>>& graph) {
        int n = graph.size();
        return dfs(graph, n);
    }
};

```
