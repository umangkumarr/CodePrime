---
title: "Maximum sum increasing subsequence"
description: "Given an array of n positive integers. Find the sum of the maximum sum subsequence of the given array such that the integers in the subsequence are sorted…"
source: "https://practice.geeksforgeeks.org/problems/maximum-sum-increasing-subsequence4749/1"
tags: ["LIS", "Dynamic Programming"]
complexity:
  time: "O(n^2)"
  space: "O(n)"
---

## Problem

Given an array of n positive integers. Find the sum of the maximum sum subsequence of the given array such that the integers in the subsequence are sorted in increasing order i.e. increasing subsequence.

## Solution approach

### Intuition

This is the longest increasing subsequence DP with sums instead of lengths. Let `dp[i]` be the largest sum of an increasing subsequence that ends at `arr[i]`. Such a subsequence is either `arr[i]` alone or some increasing subsequence ending at an earlier, smaller `arr[j]` with `arr[i]` appended.

### Algorithm

1. Set `dp[0] = arr[0]` and `ans = arr[0]`.
2. For each `i` from `1`, start with `dp[i] = arr[i]`.
3. For every `j` before `i` with `arr[j] < arr[i]`, set `dp[i] = max(dp[i], dp[j] + arr[i])`, and keep `ans` as the largest `dp[i]` seen.
4. Return `ans`.

### Complexity

- **Time:** $O(n^2)$ — for each `i` the inner loop checks every earlier `j`.
- **Space:** $O(n)$ — the `dp` array.

### Edge cases

- **Strictly increasing order** is required: equal values are not chained, because the check is `arr[j] < arr[i]`.

## Code

```cpp title="C++"
class Solution {
   public:
    int maxSumIS(int arr[], int n) {
        vector<int> dp(n);
        dp[0] = arr[0];
        int ans = arr[0];
        for (int i = 1; i < n; i++) {
            dp[i] = arr[i];
            for (int j = 0; j < i; j++) {
                if (arr[j] < arr[i]) {
                    dp[i] = max(dp[i], dp[j] + arr[i]);
                }
                ans = max(ans, dp[i]);
            }
        }
        return ans;
    }
};
```
