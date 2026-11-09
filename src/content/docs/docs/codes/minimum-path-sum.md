---
title: "Minimum Path Sum"
description: "Find the minimum sum of a top-left to bottom-right path in a grid moving only right or down, using dynamic programming with a single rolling row."
source: "https://leetcode.com/problems/minimum-path-sum/"
difficulty: "Medium"
tags: ["Array", "Dynamic Programming", "Matrix"]
complexity:
  time: "O(m \\cdot n)"
  space: "O(n)"
---

## Problem

Given a `m x n` `grid` filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.

**Note:** You can only move either down or right at any point in time.

**Example 1:**

![A 3 x 3 grid with the path 1 → 3 → 1 → 1 → 1 highlighted](https://assets.leetcode.com/uploads/2020/11/05/minpath.jpg)

```text
Input:  grid = [[1,3,1],[1,5,1],[4,2,1]]
Output: 7
Explanation: Because the path 1 → 3 → 1 → 1 → 1 minimizes the sum.
```

**Example 2:**

```text
Input:  grid = [[1,2,3],[4,5,6]]
Output: 12
```

**Constraints:**

- `m == grid.length`
- `n == grid[i].length`
- $1 \le m, n \le 200$
- $0 \le \text{grid[i][j]} \le 200$

## Solution approach

### Intuition

Since we can only move right or down, the last step into cell `(i, j)` comes either from the cell above, `(i - 1, j)`, or from the cell to the left, `(i, j - 1)`. Whatever path is best to `(i, j)`, its part up to that previous cell must itself be a cheapest path to that cell (otherwise we could swap in the cheaper one). So, with `best(i, j)` the minimum path sum ending at `(i, j)`:

$$
\text{best}(i, j) = \text{grid}[i][j] + \min\big(\text{best}(i-1, j),\ \text{best}(i, j-1)\big),
$$

where a neighbour outside the grid is simply not an option. Trying every path recursively is exponential; filling the table row by row computes each cell once, and both neighbours are always ready.

Row `i` only reads row `i - 1` and the cells to its left in row `i`, so one array `dp` of length `n` is enough: before cell `(i, j)` is updated, `dp[j]` still holds `best(i - 1, j)` (the cell above) and `dp[j - 1]` already holds `best(i, j - 1)` (the cell to the left).

### Algorithm

1. Let `dp` be an array of `n` entries, all `INT_MAX` ("unreachable"), except `dp[0] = 0` so the top-left cell starts from cost `0`.
2. For each row `i`, for each column `j`:
   - if `j > 0`, set `dp[j] = min(dp[j], dp[j - 1])` — the cheaper of "from above" (old `dp[j]`) and "from the left";
   - then `dp[j] += grid[i][j]`.
3. Return `dp[n - 1]`.

In row 0, `dp[j]` for `j > 0` is `INT_MAX`, so the `min` picks the left neighbour; in column 0 there is no left neighbour, so only "from above" is used. `INT_MAX` is never added to, because every `min` has at least one finite side.

### Walkthrough

Example 1. Each cell shows `grid | best`; the blue cell is being computed from its orange neighbours (above and left); the `dp` line is the rolling row; at the end the cheapest path is traced back in green:

![Minimum path sum DP on [[1,3,1],[1,5,1],[4,2,1]]](/img/codes/minimum-path-sum/dp.gif)

### Complexity

- **Time:** $O(m \cdot n)$ — each cell is processed once in $O(1)$.
- **Space:** $O(n)$ — one row of `dp` (the 2-D table is not needed). Overwriting `grid` in place would make it $O(1)$ extra, at the cost of destroying the input.

### Edge cases

- **Single row or single column:** only one direction ever contributes, which the `INT_MAX` initialisation and the `j > 0` check handle.
- **`1 x 1` grid:** the answer is `grid[0][0]`.
- **Overflow:** the largest possible sum is $(200 + 200 - 1) \times 200 = 79\,800$, far inside `int`.

## Code

```cpp title="C++"
class Solution {
   public:
    int minPathSum(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        vector<int> dp(n, INT_MAX);
        dp[0] = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (j > 0) dp[j] = min(dp[j], dp[j - 1]);  // from above vs from the left
                dp[j] += grid[i][j];
            }
        }
        return dp[n - 1];
    }
};
```
