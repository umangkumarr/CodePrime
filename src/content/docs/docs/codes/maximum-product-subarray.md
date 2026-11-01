---
title: "Maximum Product Subarray"
description: "Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product. The test cases…"
source: "https://leetcode.com/problems/maximum-product-subarray/"
tags: ["Array", "Dynamic Programming"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Given an integer array <code>nums</code>, find a contiguous non-empty subarray within the array that has the largest product, and return <em>the product</em>.</p>

<p>The test cases are generated so that the answer will fit in a <strong>32-bit</strong> integer.</p>

<p>A <strong>subarray</strong> is a contiguous subsequence of the array.</p>

## Solution approach

### Intuition

Zeros split the array into independent segments, because any subarray that crosses a zero has product `0`. Inside a zero-free segment every value has absolute value at least `1`, so the product of the prefix ending at `i` has the largest absolute value among all subarrays ending at `i`.

If that prefix product is positive, it is the best subarray ending at `i`. If it is negative, remove the shortest prefix that contains exactly one negative number: dividing by the prefix product up to the first negative of the segment flips the sign and keeps as many elements as possible.

### Algorithm

1. Walk the array while keeping the running product `prod` of the current zero-free segment and `p`, the index of the segment's first negative number (`INT_MIN` if none yet).
2. On a zero, store `dp[i] = {0, INT_MIN}` and reset `prod` and `p`.
3. Otherwise multiply `prod` by `nums[i]` and store `dp[i] = {prod, p}`. Only after that, if `nums[i]` is the first negative of the segment, set `p = i`, so `dp[i].second` always points to a negative strictly before `i`.
4. In a second pass, update `ans` with `dp[i].first`. When it is negative and `dp[i].second` exists, also try `dp[i].first / dp[dp[i].second].first`, which is the product of the elements after that first negative.

### Complexity

- **Time:** $O(n)$ — two linear passes.
- **Space:** $O(n)$ — the `dp` array of pairs.

### Edge cases

- **A single negative number** such as `[-2]`: no earlier negative exists, so the answer is `-2` itself.
- **Zeros**: their `dp` entry is `0`, so `ans` is at least `0` whenever the array contains a zero.

## Code

```cpp title="C++"
class Solution {
   public:
    int maxProduct(vector<int>& nums) {
        int prod = 1;
        int n = nums.size(), p = INT_MIN;
        vector<pair<int, int>> dp(n);

        for (int i = 0; i < n; i++) {
            if (nums[i] == 0) {
                p = INT_MIN;
                dp[i] = {0, p};
                prod = 1;
                continue;
            }
            prod *= nums[i];
            dp[i] = {prod, p};
            if (nums[i] < 0 && p == INT_MIN) p = i;
        }
        int ans = INT_MIN;
        for (int i = 0; i < n; i++) {
            if (dp[i].first < 0) {
                if (dp[i].second != INT_MIN) {
                    ans = max(ans, dp[i].first / dp[dp[i].second].first);
                }
                ans = max(ans, dp[i].first);
            } else {
                ans = max(ans, dp[i].first);
            }
        }
        return ans;
    }
};

```
