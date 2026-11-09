---
title: "House Robber"
description: "Find the largest sum of non-adjacent house values with a rob-or-skip dynamic programme that keeps only the last two best totals."
source: "https://leetcode.com/problems/house-robber/"
difficulty: "Medium"
tags: ["Array", "Dynamic Programming"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.

Given an integer array `nums` representing the amount of money of each house, return *the maximum amount of money you can rob tonight **without alerting the police***.

**Example 1:**

```text
Input:  nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount you can rob = 1 + 3 = 4.
```

**Example 2:**

```text
Input:  nums = [2,7,9,3,1]
Output: 12
Explanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).
Total amount you can rob = 2 + 9 + 1 = 12.
```

**Constraints:**

- $1 \le$ `nums.length` $\le 100$
- $0 \le$ `nums[i]` $\le 400$

## Solution approach

### Intuition

Let `best(i)` be the most money obtainable from the first `i + 1` houses (`0..i`). For house `i` there are only two choices:

- **Skip it.** Then the best we can do is whatever was best for houses `0..i-1`: `best(i - 1)`.
- **Rob it.** Then house `i - 1` must stay untouched, so we add `nums[i]` to the best for houses `0..i-2`: `best(i - 2) + nums[i]`.

So `best(i) = max(best(i - 1), best(i - 2) + nums[i])`, with `best(-1) = best(-2) = 0` (no houses, no money). An optimal plan for the first `i + 1` houses must end in one of these two ways, and in each case the rest of the plan must itself be optimal — that is why the recurrence is correct.

Each value depends only on the two before it, so instead of a whole table we keep two numbers: `prev1 = best(i - 1)` and `prev2 = best(i - 2)`.

### Algorithm

1. Set `prev2 = 0` and `prev1 = 0`.
2. For each amount `x` in `nums`:
   - `cur = max(prev1, prev2 + x)` — skip this house, or rob it on top of the best total two houses back.
   - Shift the window: `prev2 = prev1`, `prev1 = cur`.
3. Return `prev1`, the best total for all the houses.

### Walkthrough

Example 2, `nums = [2,7,9,3,1]`. The second row is `best(i)`; blue is the house being decided, orange the two earlier totals it is computed from, and green the new total:

![House Robber DP on [2,7,9,3,1]](/img/codes/house-robber/house-robber-dp.gif)

### Complexity

- **Time:** $O(n)$ — one pass with constant work per house.
- **Space:** $O(1)$ — two running totals instead of a DP array.

### Edge cases

- **A single house:** the loop runs once with `prev2 = prev1 = 0` and returns `nums[0]`.
- **Houses with `0` money:** `max` simply prefers skipping them when that is at least as good; no special case is needed.
- **Two houses:** the result is `max(nums[0], nums[1])`, as it must be.

## Code

```cpp title="C++"
class Solution {
  public:
    int rob(vector<int>& nums) {
        int prev2 = 0, prev1 = 0;  // best totals up to house i - 2 and up to house i - 1
        for (int x : nums) {
            int cur = max(prev1, prev2 + x);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
};
```
