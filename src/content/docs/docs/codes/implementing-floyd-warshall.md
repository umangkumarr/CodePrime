---
title: "Floyd Warshall Algorithm"
description: "The problem is to find shortest distances between every pair of vertices in a given edge weighted directed Graph. The Graph is represented as adjancency…"
source: "https://practice.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1"
tags: ["Graph", "Dynamic Programming"]
complexity:
  time: "O(V^3)"
  space: "O(1)"
---

## Problem

The problem is to find shortest distances between every pair of vertices in a given edge weighted directed Graph. The Graph is represented as adjancency matrix, and the matrix denotes the weight of the edegs (if it exists) else -1. <strong>Do it in-place.</strong>

## Solution approach

### Intuition

Floyd–Warshall builds shortest paths by allowing more and more intermediate vertices. After processing vertex `k`, `matrix[i][j]` is the shortest path from `i` to `j` that uses only vertices `0` to `k` as stops in between. Adding `k` as a new allowed stop can only help in one way: going `i` to `k` and then `k` to `j`. So one comparison per pair `(i, j)` updates the table.

In this problem, `-1` means there is no edge, so it has to be treated as infinity rather than as a real weight.

### Algorithm

1. For each intermediate vertex `k`, and each pair `i`, `j`:
2. If `matrix[i][k]` or `matrix[k][j]` is `-1`, the path through `k` does not exist, so skip it.
3. Otherwise compute `cur = matrix[i][k] + matrix[k][j]`. If `matrix[i][j]` is `-1`, set it to `cur`; otherwise set it to `min(matrix[i][j], cur)`.
4. The matrix is updated in place.

### Complexity

- **Time:** $O(V^3)$ — three nested loops over the vertices.
- **Space:** $O(1)$ extra — the input matrix is reused as the DP table.

### Edge cases

- **Unreachable pairs** remain `-1` because no valid `k` ever supplies a path.

## Code

```cpp title="C++"
class Solution {
   public:
    void shortest_distance(vector<vector<int>>& matrix) {
        int v = matrix.size();
        for (int k = 0; k < v; k++) {      // vertex as intermediate
            for (int i = 0; i < v; i++) {  // all vertex as source one by one
                for (int j = 0; j < v; j++) {  // destination
                    if (matrix[i][k] == -1 || matrix[k][j] == -1) {
                        continue;
                    }
                    int cur = matrix[i][k] + matrix[k][j];

                    if (matrix[i][j] == -1) {
                        matrix[i][j] = cur;
                    }

                    else
                        matrix[i][j] = min(matrix[i][j], cur);
                }
            }
        }
    };
```
