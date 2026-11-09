---
title: "BFS of graph"
description: "Return the breadth-first traversal of a connected undirected graph from vertex 0, in adjacency-list order, using a queue and marking vertices when enqueued."
source: "https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1"
difficulty: "Easy"
tags: ["Graph", "Breadth-First Search"]
complexity:
  time: "O(V + E)"
  space: "O(V)"
---

## Problem

Given a connected undirected graph containing **V** vertices, represented by a 2-d adjacency list **`adj[][]`**, where each `adj[i]` represents the list of vertices connected to vertex `i`.

Perform a Breadth First Search (BFS) traversal starting from vertex `0`, visiting vertices from left to right according to the given adjacency list, and return a list containing the BFS traversal of the graph.

**Note:** Do traverse in the same order as they are in the given adjacency list.

Complete the function `bfs()` which takes the adjacency list `adj` and returns the BFS traversal as a list of vertices.

**Example 1:**

![Graph for Example 1](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/700217/Web/Other/blobid0_1728648582.jpg)

```text
Input:  adj[][] = [[2, 3, 1], [0], [0, 4], [0], [2]]
Output: [0, 2, 3, 1, 4]
Explanation: Starting from 0, the BFS traversal will follow these steps:
Visit 0 → Output: 0
Visit 2 (first neighbor of 0) → Output: 0, 2
Visit 3 (next neighbor of 0) → Output: 0, 2, 3
Visit 1 (next neighbor of 0) → Output: 0, 2, 3, 1
Visit 4 (neighbor of 2) → Final Output: 0, 2, 3, 1, 4
```

**Example 2:**

![Graph for Example 2](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/700217/Web/Other/blobid1_1728648604.jpg)

```text
Input:  adj[][] = [[1, 2], [0, 2], [0, 1, 3, 4], [2], [2]]
Output: [0, 1, 2, 3, 4]
Explanation: Starting from 0, the BFS traversal proceeds as follows:
Visit 0 → Output: 0
Visit 1 (the first neighbor of 0) → Output: 0, 1
Visit 2 (the next neighbor of 0) → Output: 0, 1, 2
Visit 3 (the first neighbor of 2 that hasn't been visited yet) → Output: 0, 1, 2, 3
Visit 4 (the next neighbor of 2) → Final Output: 0, 1, 2, 3, 4
```

**Constraints:**

- $1 \le V =$ `adj.size()` $\le 10^4$
- $0 \le$ `adj[i][j]` $\le 10^4$

Expected time complexity: $O(V + E)$. Expected auxiliary space: $O(V + E)$.

## Solution approach

### Intuition

Breadth-first search visits vertices in order of their distance (number of edges) from the start: first `0`, then all neighbours of `0`, then all vertices two edges away, and so on. A FIFO queue produces exactly this order — vertices discovered earlier are expanded earlier, and the neighbours of a vertex are appended in the order they appear in `adj[u]`, which is the left-to-right order the problem asks for.

The graph is undirected and may contain cycles, so a vertex can be discovered many times. Mark it as `visited` **when it is pushed** into the queue, not when it is popped. Then every vertex enters the queue at most once, the queue never holds more than `V` entries, and no vertex can be pushed twice by two different neighbours before it is processed.

### Algorithm

1. Create `visited` of size `V`, mark vertex `0` and push it into the queue `q`.
2. While `q` is not empty:
   - pop the front vertex `u` and append it to `order`;
   - for each `v` in `adj[u]`, in order: if `v` is not visited, mark it and push it.
3. Return `order`.

### Walkthrough

Example 1, `adj = [[2, 3, 1], [0], [0, 4], [0], [2]]`:

| Pop `u` | Neighbours of `u` | Newly pushed | Queue after | `order` |
| --- | --- | --- | --- | --- |
| — | — | `0` | `[0]` | `[]` |
| `0` | `2, 3, 1` | `2, 3, 1` | `[2, 3, 1]` | `[0]` |
| `2` | `0, 4` | `4` | `[3, 1, 4]` | `[0, 2]` |
| `3` | `0` | — | `[1, 4]` | `[0, 2, 3]` |
| `1` | `0` | — | `[4]` | `[0, 2, 3, 1]` |
| `4` | `2` | — | `[]` | `[0, 2, 3, 1, 4]` |

### Complexity

- **Time:** $O(V + E)$ — each vertex is pushed and popped once, and each adjacency list is scanned once (every undirected edge appears in two lists).
- **Space:** $O(V)$ — the `visited` array and the queue each hold at most `V` entries; the output list is not counted.

### Edge cases

- **Single vertex** (`adj = [[]]`): `0` is pushed, popped, and the answer is `[0]`.
- **Cycles** (Example 2 has the triangle `0-1-2`): marking on push means `2` is pushed once by `0`, and `1` does not push it again.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> bfs(vector<vector<int>>& adj) {
        int V = adj.size();
        vector<int> order;
        vector<bool> visited(V, false);
        queue<int> q;
        visited[0] = true;
        q.push(0);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            order.push_back(u);
            for (int v : adj[u]) {
                if (!visited[v]) {
                    visited[v] = true;
                    q.push(v);
                }
            }
        }
        return order;
    }
};
```
