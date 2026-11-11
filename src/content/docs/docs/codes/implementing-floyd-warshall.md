---
title: "Floyd Warshall Algorithm"
description: "Compute all-pairs shortest path distances in place in a directed graph with possibly negative edges using the Floyd–Warshall dynamic programme."
source: "https://practice.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1"
difficulty: "Medium"
tags: ["Dynamic Programming", "Graph"]
complexity:
  time: "O(V^3)"
  space: "O(1)"
---

## Problem

Given a weighted directed graph, represented by an adjacency matrix **`dist[][]`**, where **`dist[i][j]`** represents the weight of the edge from node **`i`** to node **`j`**. If there is no direct edge, `dist[i][j]` is set to a large value (i.e., $10^8$) to represent infinity.

The graph may contain negative edge weights, but it does not contain any negative weight cycles.

Find the shortest distance between every pair of nodes `i` and `j` in the graph.

**Note:** Modify the distances for every pair in place.

Complete the function `floydWarshall(dist)`.

**Example 1:**

![Input graph with five nodes](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/893245/Web/Other/blobid0_1744701272.jpg)

![Output distance matrix](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/893245/Web/Other/blobid1_1744701370.jpg)

```text
Input:  dist[][] = [[0, 4, 10^8, 5, 10^8], [10^8, 0, 1, 10^8, 6], [2, 10^8, 0, 3, 10^8], [10^8, 10^8, 1, 0, 2], [1, 10^8, 10^8, 4, 0]]
Output: [[0, 4, 5, 5, 7], [3, 0, 1, 4, 6], [2, 6, 0, 3, 5], [3, 7, 1, 0, 2], [1, 5, 5, 4, 0]]
Explanation: Each cell dist[i][j] in the output shows the shortest distance from node i to node j,
computed by considering all possible intermediate nodes.
```

**Example 2:**

![Input graph with three nodes and a negative edge](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/893245/Web/Other/blobid2_1744701698.jpg)

![Output distance matrix](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/893245/Web/Other/blobid3_1744701713.jpg)

```text
Input:  dist[][] = [[0, -1, 2], [1, 0, 10^8], [3, 1, 0]]
Output: [[0, -1, 2], [1, 0, 3], [2, 1, 0]]
Explanation: Each cell dist[i][j] in the output shows the shortest distance from node i to node j,
computed by considering all possible intermediate nodes.
From 2 to 0 shortest distance should be 2 by following path 2 -> 1 -> 0
From 1 to 2 shortest distance should be 3 by following path 1 -> 0 -> 2
```

**Constraints:**

- $1 \le$ `dist.size()` $\le 100$
- `dist[i].size() == dist.size()`
- $-1000 \le$ `dist[i][j]` $\le 1000$, or `dist[i][j]` $= 10^8$ to represent infinity.

**Expected complexities:** Time $O(V^3)$, auxiliary space $O(1)$.

## Solution approach

### Intuition

Number the vertices `0..V-1` and ask a restricted question: what is the shortest path from `i` to `j` if the only vertices allowed **in the middle** of the path are `0..k-1`? Call that `D_k[i][j]`. With no intermediates allowed (`k = 0`) it is just the edge weight — the input matrix. With all `V` vertices allowed it is the answer.

Going from `k` to `k + 1` adds vertex `k` as a possible intermediate. A shortest path that may use `0..k` either

- does not use `k` at all — its length is `D_k[i][j]`; or
- passes through `k` exactly once (a shortest path never repeats a vertex when there are no negative cycles) — it is a path `i → k` followed by a path `k → j`, both using only `0..k-1` inside, of length `D_k[i][k] + D_k[k][j]`.

So `D_{k+1}[i][j] = min(D_k[i][j], D_k[i][k] + D_k[k][j])`.

Only one matrix is needed. During round `k` the entries in row `k` and column `k` do not change (`dist[k][k] = 0`, so `dist[i][k] + dist[k][k]` can never improve `dist[i][k]`), so updating the matrix in place reads exactly the values the recurrence asks for. Negative edges are fine; only negative **cycles** would break the "visits `k` at most once" argument, and the problem rules them out.

`10^8` means "no path". It must be treated as infinity, not as a number: with negative weights, `10^8 + (-5)` would look like a real (and shorter) distance. So a round is skipped for any pair whose `i → k` or `k → j` part is infinite.

### Algorithm

1. For each intermediate vertex `k` from `0` to `V - 1`:
   - For each source `i` with `dist[i][k] != INF`, and each destination `j` with `dist[k][j] != INF`:
     - set `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.
2. The matrix now holds all shortest distances; unreachable pairs keep the value `INF`.

### Walkthrough

Example 2. Orange is row and column `k`, which the round reads; green marks cells that improved:

![Floyd-Warshall rounds on the 3 x 3 example](/img/codes/implementing-floyd-warshall/floyd-warshall/01.webp)

### Complexity

- **Time:** $O(V^3)$ — three nested loops over the vertices, at most $10^6$ updates for $V = 100$.
- **Space:** $O(1)$ extra — the input matrix is updated in place.

### Edge cases

- **Unreachable pairs** stay `10^8`: every candidate through some `k` needs both halves to be finite, and if `j` cannot be reached from `i` one of them is always infinite.
- **Negative edges** (Example 2, `0 → 1` costs `-1`): handled by the recurrence; the `INF` guard prevents `10^8` from being reduced by a negative weight.
- **Single vertex:** the loops run once and `dist[0][0]` stays `0`.

## Code

```cpp
class Solution {
  public:
    void floydWarshall(vector<vector<int>> &dist) {
        const int INF = 1e8;
        int V = dist.size();
        for (int k = 0; k < V; k++) {
            for (int i = 0; i < V; i++) {
                if (dist[i][k] == INF) continue;
                for (int j = 0; j < V; j++) {
                    if (dist[k][j] == INF) continue;
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }
};
```

```java
class Solution {
    public void floydWarshall(int[][] dist) {
        final int INF = 100_000_000;
        int V = dist.length;
        for (int k = 0; k < V; k++) {
            for (int i = 0; i < V; i++) {
                if (dist[i][k] == INF) continue;
                for (int j = 0; j < V; j++) {
                    if (dist[k][j] == INF) continue;
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }
}
```

```python
class Solution:
    def floydWarshall(self, dist):
        INF = 10**8
        V = len(dist)
        for k in range(V):
            row_k = dist[k]
            for i in range(V):
                row_i = dist[i]
                if row_i[k] == INF:
                    continue
                for j in range(V):
                    if row_k[j] != INF and row_i[k] + row_k[j] < row_i[j]:
                        row_i[j] = row_i[k] + row_k[j]
```
