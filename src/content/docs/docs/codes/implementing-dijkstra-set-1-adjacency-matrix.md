---
title: "Dijkstra Algorithm"
description: "Compute shortest distances from a source in a weighted undirected graph with non-negative weights using Dijkstra's algorithm with an ordered-set priority queue."
source: "https://practice.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1"
difficulty: "Medium"
tags: ["Graph"]
complexity:
  time: "O((V + E) \\log V)"
  space: "O(V)"
---

## Problem

Given a connected, weighted, undirected graph with **V** vertices and no negative edge weights, represented by an adjacency list **`adj[][][]`**, and a source vertex `src`, calculate the shortest distance from **`src`** to every vertex in the graph.

Each `adj[u]` contains pairs `[v, wt]`, where `v` is an adjacent vertex and `wt` is the weight of the edge connecting vertices `u` and `v`.

Return an array of integers where the `i`-th element represents the shortest distance from the source vertex `src` to vertex `i`.

**Note:** It is guaranteed that all the shortest distances will fit in a 32-bit integer.

Complete the function `dijkstra(adj, src)`.

**Example 1:**

![Triangle graph: 0-1 weight 1, 1-2 weight 3, 0-2 weight 6](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/892538/Web/Other/blobid0_1744201836.jpg)

```text
Input:  adj[][][] = [[[1, 1], [2, 6]], [[0, 1], [2, 3]], [[0, 6], [1, 3]]], src = 2
Output: [4, 3, 0]
Explanation: Shortest Paths:
For 2 to 0 minimum distance will be 4. By following path 2 -> 1 -> 0
For 2 to 1 minimum distance will be 3. By following path 2 -> 1
For 2 to 2 minimum distance will be 0. By following path 2 -> 2
```

**Example 2:**

![Five-vertex graph: 0-1 weight 4, 0-2 weight 8, 1-4 weight 6, 2-3 weight 2, 3-4 weight 10](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/935259/Web/Other/blobid1_1792824524.webp)

```text
Input:  adj[][][] = [[[1, 4], [2, 8]], [[0, 4], [4, 6]], [[0, 8], [3, 2]], [[2, 2], [4, 10]], [[1, 6], [3, 10]]], src = 0
Output: [0, 4, 8, 10, 10]
Explanation: Shortest Paths:
For 0 to 1 minimum distance will be 4. By following path 0 -> 1
For 0 to 2 minimum distance will be 8. By following path 0 -> 2
For 0 to 3 minimum distance will be 10. By following path 0 -> 2 -> 3
For 0 to 4 minimum distance will be 10. By following path 0 -> 1 -> 4
```

**Constraints:**

- $1 \le$ `adj.size()` $\le 10^6$
- $0 \le$ `adj[i][j][0]` $<$ `adj.size()` (every listed neighbour is a valid vertex)
- $0 \le$ `src` $<$ `adj.size()`

**Expected complexities:** Time $O((V + E) \log V)$, auxiliary space $O(V)$.

## Solution approach

### Intuition

Grow the set of vertices whose shortest distance is **known**, one vertex at a time, starting from `src`. Every other vertex `v` carries a tentative distance `dist[v]`: the length of the shortest path to `v` found so far.

The key fact is that the unsettled vertex `u` with the **smallest** tentative distance is already final. Any other path to `u` has to leave the settled region at some vertex whose tentative distance is at least `dist[u]`, and the rest of that path cannot make it shorter because edge weights are non-negative. So we settle `u` and **relax** its edges: for each neighbour `v`, a path to `u` followed by the edge `(u, v)` may be shorter than `dist[v]`.

To find the smallest tentative distance quickly we keep the reached-but-unsettled vertices in an ordered `set` of `(dist, vertex)` pairs. When `dist[v]` improves we **erase** its old entry before inserting the new one, so every vertex is in the set at most once — that keeps the extra memory at $O(V)$, as the problem expects. (A `priority_queue` cannot erase, so it leaves stale entries behind and can hold $O(E)$ of them.)

### Algorithm

1. Set `dist[v] = INT_MAX` for every vertex, `dist[src] = 0`, and insert `(0, src)` into `frontier`.
2. While `frontier` is not empty:
   - Take and erase the smallest pair `(d, u)`; `d` is now the final distance of `u`.
   - For each edge `[v, w]` in `adj[u]`: if `d + w < dist[v]`, erase `(dist[v], v)` from `frontier` (if `v` was reached before), set `dist[v] = d + w`, and insert `(dist[v], v)`.
3. Return `dist`.

The comparison `d + w < dist[v]` is done in `long long`, so a large weight added to a large distance cannot overflow; whenever it succeeds the new value is below `dist[v]` and fits in an `int`.

### Walkthrough

Example 2 with `src = 0`:

| Settle `u` (dist) | Relaxed | `frontier` afterwards | `dist` |
| --- | --- | --- | --- |
| 0 (0) | 1 → 4, 2 → 8 | (4, 1), (8, 2) | `[0, 4, 8, ∞, ∞]` |
| 1 (4) | 4 → 10 | (8, 2), (10, 4) | `[0, 4, 8, ∞, 10]` |
| 2 (8) | 3 → 10 | (10, 3), (10, 4) | `[0, 4, 8, 10, 10]` |
| 3 (10) | — (4 via 3 would cost 20) | (10, 4) | `[0, 4, 8, 10, 10]` |
| 4 (10) | — | empty | `[0, 4, 8, 10, 10]` |

### Complexity

- **Time:** $O((V + E) \log V)$ — every vertex is extracted once, and every edge causes at most one erase and one insert, each $O(\log V)$ in the balanced tree.
- **Space:** $O(V)$ auxiliary — `dist` and a `frontier` holding at most one entry per vertex.

### Edge cases

- **Single vertex:** the source is settled with distance `0` and has no edges.
- **Edges back to settled vertices:** they never pass the `d + w < dist[v]` test, because a settled vertex's distance is already minimal, so a settled vertex is never re-inserted.
- **Zero-weight edges:** allowed — the correctness argument only needs weights to be non-negative.

## Code

```cpp
class Solution {
  public:
    vector<int> dijkstra(vector<vector<vector<int>>> &adj, int src) {
        int V = adj.size();
        vector<int> dist(V, INT_MAX);
        set<pair<int, int>> frontier;  // (tentative distance, vertex), at most one entry per vertex
        dist[src] = 0;
        frontier.insert({0, src});

        while (!frontier.empty()) {
            auto [d, u] = *frontier.begin();
            frontier.erase(frontier.begin());
            for (const auto& edge : adj[u]) {
                int v = edge[0], w = edge[1];
                if ((long long)d + w < dist[v]) {
                    if (dist[v] != INT_MAX) frontier.erase({dist[v], v});
                    dist[v] = d + w;
                    frontier.insert({dist[v], v});
                }
            }
        }
        return dist;
    }
};
```

```java
class Solution {
    public ArrayList<Integer> dijkstra(ArrayList<ArrayList<ArrayList<Integer>>> adj,
                                       int src) {
        int V = adj.size();
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);
        // (tentative distance, vertex), at most one entry per vertex
        TreeSet<int[]> frontier = new TreeSet<>((a, b) ->
                a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));
        dist[src] = 0;
        frontier.add(new int[] {0, src});

        while (!frontier.isEmpty()) {
            int[] top = frontier.pollFirst();
            int d = top[0], u = top[1];
            for (ArrayList<Integer> edge : adj.get(u)) {
                int v = edge.get(0), w = edge.get(1);
                if ((long) d + w < dist[v]) {
                    if (dist[v] != Integer.MAX_VALUE) frontier.remove(new int[] {dist[v], v});
                    dist[v] = d + w;
                    frontier.add(new int[] {dist[v], v});
                }
            }
        }

        ArrayList<Integer> ans = new ArrayList<>(V);
        for (int x : dist) ans.add(x);
        return ans;
    }
}
```

```python
class Solution:
    def dijkstra(self, adj: list[list[list[int]]], src: int) -> list[int]:
        INF = 2**31 - 1
        V = len(adj)
        dist = [INF] * V
        # Python has no ordered set, so the frontier is an indexed binary min-heap keyed by
        # dist: pos[v] is v's slot in heap (-1 if absent). Decrease-key moves v in place,
        # so every vertex is stored at most once, just like the erase-then-insert above.
        heap = []
        pos = [-1] * V

        def sift_up(i):
            v = heap[i]
            dv = dist[v]
            while i > 0:
                p = (i - 1) >> 1
                if dist[heap[p]] <= dv:
                    break
                heap[i] = heap[p]
                pos[heap[i]] = i
                i = p
            heap[i] = v
            pos[v] = i

        def sift_down(i):
            n = len(heap)
            v = heap[i]
            dv = dist[v]
            while True:
                c = 2 * i + 1
                if c >= n:
                    break
                if c + 1 < n and dist[heap[c + 1]] < dist[heap[c]]:
                    c += 1
                if dist[heap[c]] >= dv:
                    break
                heap[i] = heap[c]
                pos[heap[i]] = i
                i = c
            heap[i] = v
            pos[v] = i

        dist[src] = 0
        heap.append(src)
        pos[src] = 0
        while heap:
            u = heap[0]
            last = heap.pop()
            pos[u] = -1
            if heap:
                heap[0] = last
                sift_down(0)
            d = dist[u]
            for v, w in adj[u]:
                if d + w < dist[v]:
                    dist[v] = d + w
                    if pos[v] == -1:
                        heap.append(v)
                        sift_up(len(heap) - 1)
                    else:
                        sift_up(pos[v])
        return dist
```
