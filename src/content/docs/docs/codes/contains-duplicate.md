---
title: "Contains Duplicate"
description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct."
source: "https://leetcode.com/problems/contains-duplicate/"
tags: ["Array", "Hash Table", "Sorting"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.</p>

## Solution approach

### Intuition

A `set` keeps only distinct values. If we put every element of `nums` into a set and the set ends up smaller than the array, some value must have appeared more than once.

### Algorithm

1. Build the set `st` from all elements of `nums`.
2. Return `true` if `st.size()` differs from `nums.size()`, otherwise `false`.

### Complexity

- **Time:** $O(n \log n)$ — each of the $n$ insertions into the ordered `set` costs $O(\log n)$.
- **Space:** $O(n)$ — the set can hold every element.

## Code

```cpp title="C++"
class Solution {
   public:
    bool containsDuplicate(vector<int>& nums) {
        set<int> st(nums.begin(), nums.end());
        return st.size() != nums.size();
    }
};
```
