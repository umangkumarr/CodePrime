---
title: "House Robber II"
description: "Rob houses arranged in a circle without taking two neighbours by solving the linear House Robber twice, once without the first house and once without the last."
source: "https://leetcode.com/problems/house-robber-ii/"
difficulty: "Medium"
tags: ["Array", "Dynamic Programming"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are **arranged in a circle.** That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and **it will automatically contact the police if two adjacent houses were broken into on the same night**.

Given an integer array `nums` representing the amount of money of each house, return *the maximum amount of money you can rob tonight **without alerting the police***.

**Example 1:**

```text
Input:  nums = [2,3,2]
Output: 3
Explanation: You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses.
```

**Example 2:**

```text
Input:  nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount you can rob = 1 + 3 = 4.
```

**Example 3:**

```text
Input:  nums = [1,2,3]
Output: 3
```

**Constraints:**

- $1 \le$ `nums.length` $\le 100$
- $0 \le$ `nums[i]` $\le 1000$

## Solution approach

### Intuition

Without the circle this is exactly [House Robber](/docs/codes/house-robber/): walk along the street and, at each house, either skip it or rob it on top of the best total from two houses back.

The circle adds one extra rule: house `0` and house `n - 1` are neighbours, so **at least one of them is not robbed**. That splits every valid plan into two (overlapping) families:

- plans that do not rob house `n - 1` — these are plans for the straight street `0..n-2`;
- plans that do not rob house `0` — these are plans for the straight street `1..n-1`.

Neither straight street contains both end houses, so the circular conflict disappears, and every valid circular plan belongs to at least one of them. The answer is therefore the better of the two linear answers.

### Algorithm

1. If `n == 1`, return `nums[0]` (the single house has no neighbour to conflict with).
2. `robLine(nums, lo, hi)` solves the linear problem on `nums[lo..hi]` with two running totals: for each house, `cur = max(prev1, prev2 + nums[i])`, then shift `prev2 = prev1`, `prev1 = cur`.
3. Return `max(robLine(nums, 0, n - 2), robLine(nums, 1, n - 1))`.

### Walkthrough

Example 1, `nums = [2,3,2]`:

- Street `0..1` = `[2,3]`: best is `3`.
- Street `1..2` = `[3,2]`: best is `3`.

The answer is `3`. Robbing both `2`s would need the first and last house together, which neither street allows.

### Complexity

- **Time:** $O(n)$ — two linear passes.
- **Space:** $O(1)$ — two running totals per pass.

### Edge cases

- **One house:** handled up front; otherwise both ranges below would be empty and the answer `0` would be wrong.
- **Two houses:** each range has a single house, so the result is the larger of the two — they are neighbours and cannot both be robbed.
- **Houses with `0` money:** no special case; `max` simply skips them when that is at least as good.

## Code

```cpp title="C++"
class Solution {
  public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        // House 0 and house n - 1 are neighbours: drop one of them.
        return max(robLine(nums, 0, n - 2), robLine(nums, 1, n - 1));
    }

  private:
    // Linear House Robber on nums[lo..hi].
    static int robLine(const vector<int>& nums, int lo, int hi) {
        int prev2 = 0, prev1 = 0;
        for (int i = lo; i <= hi; i++) {
            int cur = max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
};
```
