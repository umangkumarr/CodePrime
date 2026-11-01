---
title: "Minimum Path Sum"
description: "Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.…"
source: "https://leetcode.com/problems/minimum-path-sum/"
tags: ["Array", "Dynamic Programming", "Matrix"]
complexity:
  time: "O(n \\cdot m)"
  space: "O(n \\cdot m)"
---

## Problem

<p>Given a <code>m x n</code> <code>grid</code> filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.</p>

<p><strong>Note:</strong> You can only move either down or right at any point in time.</p>

## Solution approach

### Intuition

Movement is only right or down, so the cheapest path to cell `(i, j)` must arrive from the cell above or the cell to its left. Its cost is therefore `grid[i][j]` plus the cheaper of those two cells' costs. Filling the grid row by row guarantees both neighbours are already computed.

Exploring every path recursively would take exponential time; the table computes each cell once.

### Algorithm

1. Create `cost[n][m]`, fill it with `INT_MAX`, and set `cost[0][0] = grid[0][0]`.
2. Visit every other cell in row-major order. If `i > 0`, try `cost[i - 1][j] + grid[i][j]`. If `j > 0`, try `cost[i][j - 1] + grid[i][j]`. Keep the minimum.
3. Return `cost[n - 1][m - 1]`.

### Complexity

- **Time:** $O(n \cdot m)$ — each cell is processed once.
- **Space:** $O(n \cdot m)$ — the `cost` table.

### Edge cases

- **First row or first column**: only one neighbour exists, and the `i > 0` / `j > 0` checks handle this.

## Code

```cpp title="C++"
class Solution {
   public:
    int minPathSum(vector<vector<int>>& grid) {
        int ans = 0;
        int n = grid.size(), m = grid[0].size();
        int cost[n][m];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) cost[i][j] = INT_MAX;
        }

        cost[0][0] = grid[0][0];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (i == 0 && j == 0) continue;
                if (i > 0)
                    cost[i][j] = min(cost[i][j], cost[i - 1][j] + grid[i][j]);
                if (j > 0)
                    cost[i][j] = min(cost[i][j], cost[i][j - 1] + grid[i][j]);
            }
        }
        return cost[n - 1][m - 1];
    }
};

```
