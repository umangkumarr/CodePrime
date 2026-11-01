---
title: "Kth Largest Element in an Array"
description: "Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order,…"
source: "https://leetcode.com/problems/kth-largest-element-in-an-array/"
tags: ["Array", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Quickselect"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the</em> <code>kth</code> <em>largest element in the array</em>.</p>

<p>Note that it is the <code>kth</code> largest element in the sorted order, not the <code>kth</code> distinct element.</p>

## Solution approach

### Intuition

The $k$-th largest element is the element that would sit at index `n - k` in ascending sorted order. Fully sorting costs $O(n \log n)$, but we only need one position to be correct. `nth_element` (quickselect) places the right element at that index, with smaller-or-equal elements before it and larger-or-equal elements after it, in linear time on average.

### Algorithm

1. Let `n = nums.size()`.
2. Call `nth_element(nums.begin(), nums.begin() + n - k, nums.end())`.
3. Return `nums[n - k]`.

### Complexity

- **Time:** $O(n)$ on average — quickselect discards part of the range at each step.
- **Space:** $O(1)$ — the array is rearranged in place.

### Edge cases

- **Duplicates** count separately, e.g. `[3, 3, 2]` with `k = 2` gives `3`, which matches the "k-th largest in sorted order" definition.

## Code

```cpp title="C++"
class Solution {
   public:
    int findKthLargest(vector<int>& nums, int k) {
        int n = nums.size();
        nth_element(nums.begin(), nums.begin() + n - k, nums.end());
        return nums[n - k];
    }
};

```
