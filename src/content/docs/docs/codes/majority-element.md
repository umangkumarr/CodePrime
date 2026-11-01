---
title: "Majority Element"
description: "Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that…"
source: "https://leetcode.com/problems/majority-element/"
tags: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Counting"]
complexity:
  time: "O(n \\log n)"
  space: "O(1)"
---

## Problem

<p>Given an array <code>nums</code> of size <code>n</code>, return <em>the majority element</em>.</p>

<p>The majority element is the element that appears more than <code>&lfloor;n / 2&rfloor;</code> times. You may assume that the majority element always exists in the array.</p>

## Solution approach

### Intuition

The majority element appears more than $n/2$ times. After sorting, its copies form one contiguous block longer than half the array, so that block must cover the middle index `n / 2` whatever its position.

### Algorithm

1. Sort `nums`.
2. Return `nums[n / 2]`.

### Complexity

- **Time:** $O(n \log n)$ — dominated by the sort.
- **Space:** $O(1)$ extra — the array is sorted in place (apart from the sort's internal $O(\log n)$ stack).

## Code

```cpp title="C++"
class Solution {
   public:
    int majorityElement(vector<int>& nums) {
        int n = nums.size();
        sort(nums.begin(), nums.end());
        return nums[n / 2];
    }
};

```
