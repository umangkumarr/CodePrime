---
title: "Unique Paths"
description: "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right…"
source: "https://leetcode.com/problems/unique-paths/"
tags: ["Math", "Dynamic Programming", "Combinatorics"]
complexity:
  time: "O(\\min(m, n))"
  space: "O(1)"
---

## Problem

<p>There is a robot on an <code>m x n</code> grid. The robot is initially located at the <strong>top-left corner</strong> (i.e., <code>grid[0][0]</code>). The robot tries to move to the <strong>bottom-right corner</strong> (i.e., <code>grid[m - 1][n - 1]</code>). The robot can only move either down or right at any point in time.</p>

<p>Given the two integers <code>m</code> and <code>n</code>, return <em>the number of possible unique paths that the robot can take to reach the bottom-right corner</em>.</p>

<p>The test cases are generated so that the answer will be less than or equal to <code>2 * 109</code>.</p>

## Solution approach

### Intuition

Every path from the top-left to the bottom-right corner makes exactly $m - 1$ down moves and $n - 1$ right moves, $m + n - 2$ moves in total. A path is fixed by choosing which of those moves go down, so the answer is $\binom{m+n-2}{m-1}$. After swapping so that `m` is the smaller dimension, this needs only $m - 1$ multiplications.

### Algorithm

1. If `m > n`, swap them so `m` is the smaller value.
2. Loop `j` from `m + n - 2` down to `n`. At each step multiply `ans` by `j` and divide by `m + n - 1 - j`, which runs through `1, 2, ..., m - 1`.
3. After $t$ steps `ans` equals $\binom{m+n-2}{t}$, an integer, so every division is exact.
4. Return `ans`.

### Complexity

- **Time:** $O(\min(m, n))$ — the loop runs $\min(m, n) - 1$ times.
- **Space:** $O(1)$ — only a few variables.

### Edge cases

- **A single row or column** (`m = 1` after the swap): the loop does not run and the answer is `1`.

## Code

```cpp title="C++"
class Solution {
   public:
    int uniquePaths(int m, int n) {
        long long ans = 1;
        if (m > n) swap(m, n);
        for (long long j = m + n - 2; j > n - 1; j--) {
            ans *= j;
            ans /= (m + n - 1 - j);
        }
        return ans;
    }
};

```
