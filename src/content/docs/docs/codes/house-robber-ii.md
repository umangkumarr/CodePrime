---
title: "House Robber II"
description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are…"
source: "https://leetcode.com/problems/house-robber-ii/"
tags: ["Array", "Dynamic Programming"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are <strong>arranged in a circle.</strong> That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and&nbsp;<b>it will automatically contact the police if two adjacent houses were broken into on the same night</b>.</p>

<p>Given an integer array <code>nums</code> representing the amount of money of each house, return <em>the maximum amount of money you can rob tonight <strong>without alerting the police</strong></em>.</p>

## Solution approach

### Intuition

The houses form a circle, so the first and last house cannot both be robbed. Everything else is the plain House Robber problem. For each house the code keeps two values: `f`, the best total if this house **is** robbed, and `s`, the best total if it is **not**. That gives the recurrences `f = nums[i] + prev.s` and `s = max(prev.f, prev.s)`.

The circle is handled with two runs. The first run allows house `0`, so its answer is only safe if the last house is skipped (`a.s`). The second run forbids house `0`, so the last house is free to be robbed.

### Algorithm

1. If `n == 1`, return `nums[0]`.
2. First run: `ans[0].f = nums[0]`, `ans[1].f = nums[1]`, `ans[1].s = nums[0]`; fill `ans[i]` for `i >= 2`. Save `a = ans[n - 1]`.
3. Second run: set `ans[1].s = 0` (house `0` is not robbed) and recompute `ans[i]` for `i >= 2`. Let `b = max(ans[n - 1].f, ans[n - 1].s)`.
4. Return `max(b, a.s)`. The `if` before it only returns early when this is already `b`.

### Complexity

- **Time:** $O(n)$ — two linear passes.
- **Space:** $O(n)$ — the `ans` array of pairs.

### Edge cases

- **`n == 2`:** neither loop runs; `b = nums[1]` and `a.s = nums[0]`, so the larger of the two houses is returned.
- **`n == 1`:** handled separately, since there is no second house.

## Code

```cpp title="C++"
#define f first
#define s second

class Solution {
   public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        vector<pair<int, int>> ans(n);
        ans[0].f = nums[0];
        ans[1].f = nums[1];
        ans[1].s = nums[0];
        for (int i = 2; i < n; i++) {
            ans[i].f = nums[i] + ans[i - 1].s;
            ans[i].s = max(ans[i - 1].f, ans[i - 1].s);
        }
        auto a = ans[n - 1];
        ans[1].s = 0;

        for (int i = 2; i < n; i++) {
            ans[i].f = nums[i] + ans[i - 1].s;
            ans[i].s = max(ans[i - 1].f, ans[i - 1].s);
        }
        int b = max(ans[n - 1].f, ans[n - 1].s);
        if (max(a.f, a.s) == b) return b;
        return max(b, a.s);
    }
};
```
