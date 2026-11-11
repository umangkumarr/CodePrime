---
title: "Is Graph Bipartite?"
description: "Decide whether an undirected, possibly disconnected graph can be split into two independent sets, by two-colouring each component with BFS."
source: "https://leetcode.com/problems/is-graph-bipartite/"
difficulty: "Medium"
tags: ["Depth-First Search", "Breadth-First Search", "Union Find", "Graph", "Graph Coloring", "Bipartite Graph"]
complexity:
  time: "O(V + E)"
  space: "O(V)"
---

## Problem

There is an **undirected** graph with `n` nodes, where each node is numbered between `0` and `n - 1`. You are given a 2D array `graph`, where `graph[u]` is an array of nodes that node `u` is adjacent to. More formally, for each `v` in `graph[u]`, there is an undirected edge between node `u` and node `v`. The graph has the following properties:

- There are no self-edges (`graph[u]` does not contain `u`).
- There are no parallel edges (`graph[u]` does not contain duplicate values).
- If `v` is in `graph[u]`, then `u` is in `graph[v]` (the graph is undirected).
- The graph may not be connected, meaning there may be two nodes `u` and `v` such that there is no path between them.

A graph is **bipartite** if the nodes can be partitioned into two independent sets `A` and `B` such that **every** edge in the graph connects a node in set `A` and a node in set `B`.

Return `true` _if and only if it is **bipartite**_.

**Example 1:**

![Four nodes where 0, 1, 2 form a triangle](https://assets.leetcode.com/uploads/2020/10/21/bi2.jpg)

```text
Input:  graph = [[1,2,3],[0,2],[0,1,3],[0,2]]
Output: false
Explanation: There is no way to partition the nodes into two independent sets such that every edge connects a node in one and a node in the other.
```

**Example 2:**

![A four-node cycle 0-1-2-3-0](https://assets.leetcode.com/uploads/2020/10/21/bi1.jpg)

```text
Input:  graph = [[1,3],[0,2],[1,3],[0,2]]
Output: true
Explanation: We can partition the nodes into two sets: {0, 2} and {1, 3}.
```

**Constraints:**

- `graph.length == n`
- $1 \le n \le 100$
- $0 \le$ `graph[u].length` $\lt n$
- $0 \le$ `graph[u][i]` $\le n - 1$
- `graph[u]` does not contain `u`.
- All the values of `graph[u]` are **unique**.
- If `graph[u]` contains `v`, then `graph[v]` contains `u`.

## Solution approach

### Intuition

Putting a node in set `A` or `B` is the same as painting it with one of two colours so that every edge joins two **different** colours.

Inside one connected component there is no freedom once the first node is painted: its neighbours must get the other colour, their neighbours the first colour again, and so on. So we paint greedily with a BFS. If we ever find an edge whose two ends already carry the **same** colour, no valid painting exists — the edge closes a cycle of odd length, and an odd cycle can never alternate between two colours. If the BFS finishes without such an edge, the painting itself is the partition.

The graph may be disconnected, so a fresh BFS starts from every node that is still unpainted; each component can choose its colours independently.

[![Example 1 graph two-coloured by BFS: node 0 colour 0, nodes 1, 2, 3 colour 1, with node 2 clashing with neighbour 1](/img/codes/is-graph-bipartite/two-colouring.png)](/img/codes/is-graph-bipartite/two-colouring.png)

Example 1: node `0` gets colour 0 (blue), so `1`, `2` and `3` all get colour 1. When node `1` is processed, its neighbour `2` already has colour 1 — the same as `1` — so the edge `1-2` is a conflict (the triangle `0-1-2` is an odd cycle) and the answer is `false`.

### Algorithm

1. Create `color` of size `n`, filled with `-1` (unpainted).
2. For every node `start` with `color[start] == -1`:
   - paint it `0` and push it into the queue `q`;
   - while `q` is not empty, pop `u`; for each neighbour `v` in `graph[u]`:
     - if `v` is unpainted, set `color[v] = 1 - color[u]` and push `v`;
     - else if `color[v] == color[u]`, return `false`.
3. Return `true`.

### Complexity

- **Time:** $O(V + E)$ — every node is pushed once and every adjacency list is scanned once.
- **Space:** $O(V)$ — the `color` array and the queue.

### Edge cases

- **Disconnected graph / isolated nodes:** the outer loop starts a new BFS for each unpainted node; an isolated node is simply painted `0`.
- **Even cycle** (Example 2): colours alternate around the cycle and no conflict appears.
- **Odd cycle** (Example 1): some edge ends up with equal colours on both ends and `false` is returned.

## Code

```cpp
class Solution {
   public:
    bool isBipartite(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<int> color(n, -1);
        queue<int> q;
        for (int start = 0; start < n; start++) {
            if (color[start] != -1) continue;
            color[start] = 0;
            q.push(start);
            while (!q.empty()) {
                int u = q.front();
                q.pop();
                for (int v : graph[u]) {
                    if (color[v] == -1) {
                        color[v] = 1 - color[u];
                        q.push(v);
                    } else if (color[v] == color[u]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
};
```

```java
class Solution {
    public boolean isBipartite(int[][] graph) {
        int n = graph.length;
        int[] color = new int[n];
        Arrays.fill(color, -1);
        ArrayDeque<Integer> q = new ArrayDeque<>();
        for (int start = 0; start < n; start++) {
            if (color[start] != -1) continue;
            color[start] = 0;
            q.offer(start);
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : graph[u]) {
                    if (color[v] == -1) {
                        color[v] = 1 - color[u];
                        q.offer(v);
                    } else if (color[v] == color[u]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
```

```python
from collections import deque


class Solution:
    def isBipartite(self, graph: list[list[int]]) -> bool:
        color = [-1] * len(graph)
        for start in range(len(graph)):
            if color[start] != -1:
                continue
            color[start] = 0
            q = deque([start])
            while q:
                u = q.popleft()
                for v in graph[u]:
                    if color[v] == -1:
                        color[v] = 1 - color[u]
                        q.append(v)
                    elif color[v] == color[u]:
                        return False
        return True
```
