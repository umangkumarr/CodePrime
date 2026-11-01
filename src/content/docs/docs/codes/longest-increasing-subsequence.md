---
title: "Longest Increasing Subsequence"
description: "Given an integer array nums, return the length of the longest strictly increasing subsequence. A subsequence is a sequence that can be derived from an…"
source: "https://leetcode.com/problems/longest-increasing-subsequence/"
tags: ["Array", "Binary Search", "Dynamic Programming"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>Given an integer array <code>nums</code>, return the length of the longest strictly increasing subsequence.</p>

<p>A <strong>subsequence</strong> is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements. For example, <code>[3,6,2,7]</code> is a subsequence of the array <code>[0,3,1,6,2,2,7]</code>.</p>

## Solution approach

### Intuition

Keep an array `dp` where `dp[len]` is the **smallest possible last value** of an increasing subsequence of length `len` seen so far. This array is always sorted, so for each new value we can binary-search where it fits. Replacing an entry with a smaller value never hurts: a smaller tail leaves more room for later elements. The answer is the largest `len` whose entry has been filled.

The plain DP that compares every pair of indices is $O(n^2)$; the binary search brings each step down to $O(\log n)$.

### Algorithm

1. `lengthOfLIS` calls `LIS(nums, n)`, which initialises `dp` with `INT_MAX`, and `dp[0] = INT_MIN` as a sentinel.
2. For each `a[i]`, find `indx`, the first position with `dp[indx] > a[i]`, using `upper_bound`.
3. If `dp[indx - 1] < a[i]` (strictly smaller, so equal values do not extend a run), set `dp[indx] = a[i]`.
4. Return the largest `i` in `1..n` with `dp[i] != INT_MAX`.

### Complexity

- **Time:** $O(n \log n)$ — one binary search per element.
- **Space:** $O(n)$ — the `dp` array, plus the copy of `nums` made because `LIS` takes `a` by value.

### Edge cases

- **Repeated values** such as `[7, 7, 7]`: the strict check rejects equal values, so the answer is `1`.

## Code

```cpp title="C++"
class Solution {
   public:
    int LIS(vector<int> a, int n) {
        vector<int> dp(n + 1, INT_MAX);
        dp[0] = INT_MIN;
        for (int i = 0; i < n; i++) {
            int indx = upper_bound(dp.begin(), dp.end(), a[i]) - dp.begin();
            if (dp[indx - 1] < a[i] && dp[indx] > a[i]) {
                dp[indx] = a[i];
            }
        }
        int res = 0;
        for (int i = 1; i <= n; i++) {
            if (dp[i] != INT_MAX) res = i;
        }
        return res;
    }

    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        return LIS(nums, n);
    }
};

```
