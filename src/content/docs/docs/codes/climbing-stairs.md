---
title: "Climbing Stairs"
description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to…"
source: "https://leetcode.com/problems/climbing-stairs/"
tags: ["Math", "Dynamic Programming", "Memoization"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>You are climbing a staircase. It takes <code>n</code> steps to reach the top.</p>

<p>Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct ways can you climb to the top?</p>

## Solution approach

### Intuition

The last move to reach step `i` is either one step from `i - 1` or two steps from `i - 2`. So the number of ways to reach step `i` is the sum of the ways to reach those two steps, which is the Fibonacci recurrence. Plain recursion would recompute the same steps exponentially many times; storing each result in a table avoids that.

### Algorithm

1. Create `dp` of size `n + 1` with `dp[0] = 1` and `dp[1] = 1`.
2. For `i` from `2` to `n`, set `dp[i] = dp[i - 1] + dp[i - 2]`.
3. Return `dp[n]`.

### Complexity

- **Time:** $O(n)$ — one loop over the steps.
- **Space:** $O(n)$ — for the `dp` table.

## Code

```cpp title="C++"
class Solution {
   public:
    int climbStairs(int n) {
        vector<int> dp(n + 1);
        dp[0] = 1;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
        return dp[n];
    }
};
```
