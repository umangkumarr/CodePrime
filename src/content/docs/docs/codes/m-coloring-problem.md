---
title: "M-Coloring Problem"
description: "Decide whether a graph's vertices can be coloured with at most m colours so that no edge joins two equal colours, using backtracking over vertices."
source: "https://www.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1"
difficulty: "Medium"
tags: ["Backtracking"]
complexity:
  time: "O(V \\cdot m^V)"
  space: "O(V + E)"
---

## Problem

Given an undirected graph consisting of **V** vertices and edges represented as a 2d array **edges[][]**, along with an integer **m**. Find if it is possible to color the graph using at most `m` different colors such that no two adjacent vertices share the same color.

**Note:** The graph is indexed with 0-based indexing.

Complete the function `graphColoring()` which takes `v`, `edges` and `m` and returns `true` if such a colouring exists, otherwise `false`.

**Example 1:**

![Graph with 4 vertices coloured with 3 colours](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/893404/Web/Other/blobid3_1746162701.jpg)

```text
Input:  V = 4, edges[][] = [[0, 1], [1, 3], [2, 3], [3, 0], [0, 2]], m = 3
Output: true
Explanation: It is possible to color the given graph using 3 colors, for example, one of the possible ways vertices can be colored as follows:
Vertex 0: Color 1
Vertex 1: Color 2
Vertex 2: Color 2
Vertex 3: Color 3
```

**Example 2:**

```text
Input:  V = 3, edges[][] = [[0, 1], [1, 2], [0, 2]], m = 2
Output: false
Explanation: It is not possible to color the given graph using only 2 colors because vertices 0, 1, and 2 form a triangle.
```

**Constraints:**

- $1 \le V \le 10$
- $1 \le E =$ `edges.size()` $\le V(V-1)/2$
- $0 \le$ `edges[i][j]` $\le V - 1$
- $1 \le m \le V$

## Solution approach

### Intuition

The problem is NP-complete in general, but with $V \le 10$ an exhaustive search is fine — as long as it abandons hopeless partial colourings early.

Colour the vertices one at a time in index order. Before giving vertex `v` colour `c`, check only the neighbours of `v`: if one of them already has colour `c`, that choice can never be completed, so skip it. If no colour works for `v`, the colours of the earlier vertices are to blame, so return `false` and let the caller try its next colour (**backtracking**). Reaching `v == V` means every vertex got a colour with no conflict.

Because each check happens as soon as a colour is placed, an invalid prefix is cut off immediately instead of being extended into $m^{V - v}$ full assignments.

### Algorithm

1. Build the adjacency list `adj` from `edges` (both directions) and a `color` array of `0`s (uncoloured).
2. `solve(v)`:
   - If `v == V`, return `true`.
   - For each `c` from `1` to `m`: if no neighbour `u` of `v` has `color[u] == c`, set `color[v] = c` and return `true` if `solve(v + 1)` does.
   - Reset `color[v] = 0` and return `false`.
3. Return `solve(0)`.

### Walkthrough

Example 2 (triangle, `m = 2`). Red leaves are rejected by the neighbour check; once both colours fail for vertex `2`, the search backtracks:

[![Backtracking tree for the triangle with m = 2: v0 = 1, then v1 = 1 clashes with v0; v1 = 2, then v2 = 1 clashes with v0 and v2 = 2 clashes with v1; v0 = 2 fails symmetrically](/img/codes/m-coloring-problem/backtracking-tree.png)](/img/codes/m-coloring-problem/backtracking-tree.png)

Every branch fails, so the answer is `false`. In Example 1 the first successful path is `v0 = 1, v1 = 2, v2 = 2, v3 = 3`, exactly the colouring in the statement.

### Complexity

- **Time:** $O(V \cdot m^V)$ in the worst case — at most $m^V$ partial assignments, each colour check scanning at most `V - 1` neighbours. Pruning makes the real count much smaller.
- **Space:** $O(V + E)$ — the adjacency list, plus `color` and a recursion stack of depth `V`.

### Edge cases

- **Isolated vertices:** they have no neighbours to clash with, so they take colour `1` immediately.
- **`m = 1`:** any edge makes the first colour fail for its second endpoint, so the answer is `false` whenever there is at least one edge.

## Code

```cpp
class Solution {
    vector<vector<int>> adj;
    vector<int> color;  // 0 = uncoloured, otherwise 1..m
    int m;

    bool solve(int v) {
        if (v == (int)adj.size()) return true;
        for (int c = 1; c <= m; c++) {
            bool clash = false;
            for (int u : adj[v])
                if (color[u] == c) {
                    clash = true;
                    break;
                }
            if (clash) continue;
            color[v] = c;
            if (solve(v + 1)) return true;
        }
        color[v] = 0;
        return false;
    }

   public:
    bool graphColoring(int v, vector<vector<int>>& edges, int m) {
        adj.assign(v, {});
        for (auto& e : edges) {
            adj[e[0]].push_back(e[1]);
            adj[e[1]].push_back(e[0]);
        }
        color.assign(v, 0);
        this->m = m;
        return solve(0);
    }
};
```

```java
class Solution {
    private List<List<Integer>> adj;
    private int[] color;  // 0 = uncoloured, otherwise 1..m
    private int m;

    private boolean solve(int v) {
        if (v == adj.size()) return true;
        for (int c = 1; c <= m; c++) {
            boolean clash = false;
            for (int u : adj.get(v))
                if (color[u] == c) {
                    clash = true;
                    break;
                }
            if (clash) continue;
            color[v] = c;
            if (solve(v + 1)) return true;
        }
        color[v] = 0;
        return false;
    }

    boolean graphColoring(int v, int[][] edges, int m) {
        adj = new ArrayList<>();
        for (int i = 0; i < v; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        color = new int[v];
        this.m = m;
        return solve(0);
    }
}
```

```python
class Solution:
    def graphColoring(self, v, edges, m):
        adj = [[] for _ in range(v)]
        for a, b in edges:
            adj[a].append(b)
            adj[b].append(a)
        color = [0] * v  # 0 = uncoloured, otherwise 1..m

        def solve(x):
            if x == v:
                return True
            taken = {color[u] for u in adj[x]}  # colours of x's neighbours
            for c in range(1, m + 1):
                if c in taken:
                    continue
                color[x] = c
                if solve(x + 1):
                    return True
            color[x] = 0
            return False

        return solve(0)
```
