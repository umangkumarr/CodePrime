---
title: "Maximum Subarray"
description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. A subarray is a…"
source: "https://leetcode.com/problems/maximum-subarray/"
tags: ["Array", "Divide and Conquer", "Dynamic Programming"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Given an integer array <code>nums</code>, find the contiguous subarray (containing at least one number) which has the largest sum and return <em>its sum</em>.</p>

<p>A <strong>subarray</strong> is a <strong>contiguous</strong> part of an array.</p>

## Solution approach

### Intuition

This is Kadane's algorithm. Scan the array while keeping the best sum of a subarray that ends at the current position. If that running sum ever becomes negative, it can only make any later subarray smaller, so it is better to drop it and start fresh from the next element.

Checking every subarray would take $O(n^2)$ time; Kadane's algorithm needs only one pass.

### Algorithm

1. Store the largest element in `ans`. It is needed when every number is negative.
2. Keep `max_till_here` (the running sum of the current subarray) and `max_so_far` (the best sum seen), both starting at `0`.
3. For each `nums[i]`, add it to `max_till_here`, update `max_so_far` if the running sum is larger, and reset `max_till_here` to `0` if it drops below zero.
4. If `ans < 0`, every element is negative and the best subarray is the single largest element, so return `ans`. Otherwise return `max_so_far`.

### Complexity

- **Time:** $O(n)$ — one pass for `max_element` and one for the scan.
- **Space:** $O(1)$ — only a few variables.

### Edge cases

- **All negative numbers** such as `[-3, -1, -2]`: `max_so_far` would stay `0`, so the code returns `ans = -1` instead.

## Code

```cpp title="C++"
class Solution {
   public:
    int maxSubArray(vector<int>& nums) {
        int ans = *max_element(nums.begin(), nums.end());
        int n = nums.size();
        int max_so_far = 0, max_till_here = 0;

        for (int i = 0; i < n; i++) {
            max_till_here += nums[i];
            if (max_till_here > max_so_far) max_so_far = max_till_here;
            if (max_till_here < 0) max_till_here = 0;
        }
        if (ans < 0) return ans;
        return max_so_far;
    }
};

```
