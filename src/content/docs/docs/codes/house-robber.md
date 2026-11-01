---
title: "House Robber"
description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you…"
source: "https://leetcode.com/problems/house-robber/"
tags: ["Array", "Dynamic Programming"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and <b>it will automatically contact the police if two adjacent houses were broken into on the same night</b>.</p>

<p>Given an integer array <code>nums</code> representing the amount of money of each house, return <em>the maximum amount of money you can rob tonight <b>without alerting the police</b></em>.</p>

## Solution approach

### Intuition

At each house there are only two states that matter: we rob it, or we don't. If we rob house `i`, house `i - 1` must have been skipped. If we skip it, the best total is simply the best total up to house `i - 1`, whatever we did there. Keeping both states for every house lets us build the answer from left to right without trying every subset.

### Algorithm

1. If `n == 1`, return `nums[0]`.
2. `v[i].f` is the best total when house `i` is robbed; `v[i].s` is the best total when it is not.
3. Initialise `v[0].f = nums[0]`, `v[1].f = nums[1]` and `v[1].s = nums[0]`.
4. For `i >= 2`: `v[i].f = nums[i] + v[i - 1].s` and `v[i].s = max(v[i - 1].f, v[i - 1].s)`.
5. Return `max(v[n - 1].f, v[n - 1].s)`.

### Complexity

- **Time:** $O(n)$ — one pass over the houses.
- **Space:** $O(n)$ — the array `v` of pairs.

### Edge cases

- **One house:** returned directly.
- **Two houses:** the loop does not run and the larger of the two is returned.

## Code

```cpp title="C++"
#define f first
#define s second

class Solution {
   public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        vector<pair<int, int>> v(n);
        v[0].f = nums[0];
        v[1].f = nums[1];
        v[1].s = nums[0];
        for (int i = 2; i < n; i++) {
            v[i].f = nums[i] + v[i - 1].s;
            v[i].s = max(v[i - 1].f, v[i - 1].s);
        }
        return max(v[n - 1].f, v[n - 1].s);
    }
};
```
