---
title: "Unique Paths"
description: "Count the right/down paths from the top-left to the bottom-right of an m x n grid, by a rolling DP row or directly as the binomial coefficient C(m+n-2, m-1)."
source: "https://leetcode.com/problems/unique-paths/"
difficulty: "Medium"
tags: ["Math", "Dynamic Programming", "Combinatorics"]
complexity:
  time: "O(\\min(m, n))"
  space: "O(1)"
---

## Problem

There is a robot on an `m x n` grid. The robot is initially located at the **top-left corner** (i.e., `grid[0][0]`). The robot tries to move to the **bottom-right corner** (i.e., `grid[m - 1][n - 1]`). The robot can only move either down or right at any point in time.

Given the two integers `m` and `n`, return _the number of possible unique paths that the robot can take to reach the bottom-right corner_.

The test cases are generated so that the answer will be less than or equal to $2 \times 10^9$.

**Example 1:**

![A 3 x 7 grid with the robot at the top-left and the finish at the bottom-right](https://assets.leetcode.com/uploads/2018/10/22/robot_maze.png)

```text
Input:  m = 3, n = 7
Output: 28
```

**Example 2:**

```text
Input:  m = 3, n = 2
Output: 3
Explanation: From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
1. Right -> Down -> Down
2. Down -> Down -> Right
3. Down -> Right -> Down
```

**Constraints:**

- $1 \le m, n \le 100$

## Solution approach

### Approach 1: Dynamic programming

**Intuition**

The last move into cell `(i, j)` comes either from the cell above, `(i - 1, j)`, or from the cell to the left, `(i, j - 1)`. Those two sets of paths are disjoint, so

$$
\text{paths}(i, j) = \text{paths}(i - 1, j) + \text{paths}(i, j - 1),
$$

with every cell in the first row and first column having exactly one path (all right moves, or all down moves). Each row only needs the row above it, so one array `dp` of length `n` suffices: before the update `dp[j]` still holds the value from the row above, and `dp[j - 1]` already holds the new value to the left.

**Algorithm**

1. Set `dp` to `n` ones (the first row).
2. For each row `i = 1 .. m - 1`, for each `j = 1 .. n - 1`: `dp[j] += dp[j - 1]`. (`dp[0]` stays `1`, the first column.)
3. Return `dp[n - 1]`.

![DP table for m = 3, n = 7 filled row by row; each cell is the sum of the cell above and the cell to the left](/img/codes/unique-paths/dp-grid.gif)

**Complexity**

- **Time:** $O(m \cdot n)$ — one addition per cell.
- **Space:** $O(n)$ — a single row.

### Approach 2: Combinatorics

**Intuition**

The table above is Pascal's triangle turned on its side, and there is a direct reason for that. Every path makes exactly `m - 1` down moves and `n - 1` right moves, `m + n - 2` moves in total, in some order. A path is completely determined by **which** of those positions hold the down moves, so the answer is

$$
\binom{m + n - 2}{m - 1} = \binom{m + n - 2}{n - 1}.
$$

Choosing the smaller of the two (`k = min(m, n) - 1`) means only `k` multiplications.

**Algorithm**

1. Let `total = m + n - 2` and `k = min(m, n) - 1`.
2. Start with `ans = 1`. For `i = 1 .. k`, set `ans = ans * (total - k + i) / i`.
3. After step `i`, `ans` equals $\binom{total - k + i}{i}$, which is an integer, so each division is exact. Return `ans`.

**Complexity**

- **Time:** $O(\min(m, n))$ — `k` iterations.
- **Space:** $O(1)$.

### Edge cases

- **A single row or column** (`m = 1` or `n = 1`): Approach 1 never enters the loop and returns `dp[n - 1] = 1`; in Approach 2 `k = 0`, so `ans` stays `1`.
- **Overflow:** the problem guarantees the answer is at most $2 \times 10^9 \lt 2^{31}$. In Approach 1 every cell is at most the answer (values only grow towards the bottom-right). In Approach 2 the running value is at most the answer before multiplying by a factor of at most $198$, so `long long` holds `ans * (total - k + i)` comfortably.

## Code

```cpp title="Approach 1: Dynamic programming"
class Solution {
   public:
    int uniquePaths(int m, int n) {
        vector<int> dp(n, 1);  // dp[j] = paths to column j of the current row
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++) dp[j] += dp[j - 1];
        return dp[n - 1];
    }
};
```

```cpp title="Approach 2: Combinatorics"
class Solution {
   public:
    int uniquePaths(int m, int n) {
        int total = m + n - 2;
        int k = min(m, n) - 1;
        long long ans = 1;
        for (int i = 1; i <= k; i++)
            ans = ans * (total - k + i) / i;  // now ans == C(total - k + i, i)
        return (int)ans;
    }
};
```
