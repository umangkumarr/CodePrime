---
title: "Majority Element II"
description: "Given an integer array of size n, find all elements that appear more than ⌊ n/3 ⌋ times."
source: "https://leetcode.com/problems/majority-element-ii/"
tags: ["Array", "Hash Table", "Sorting", "Counting"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Given an integer array of size <code>n</code>, find all elements that appear more than <code>&lfloor; n/3 &rfloor;</code> times.</p>

## Solution approach

### Intuition

At most two values can appear more than $\lfloor n/3 \rfloor$ times, but this solution does not need that fact: it counts the occurrences of every value in a hash map and keeps those whose count exceeds `n / 3`.

### Algorithm

1. Count each `nums[i]` in the hash map `mp`.
2. For each `(value, count)` entry, if `i.second > n / 3`, push `i.first` into `ans`.
3. Return `ans`.

### Complexity

- **Time:** $O(n)$ — one counting pass plus one pass over the distinct values, with average $O(1)$ hash-map operations.
- **Space:** $O(n)$ — the map can hold every distinct value.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> majorityElement(vector<int>& nums) {
        unordered_map<int, int> mp;
        int n = nums.size();
        for (int i = 0; i < n; i++) mp[nums[i]]++;

        vector<int> ans;
        for (auto i : mp) {
            if (i.second > n / 3) ans.push_back(i.first);
        }
        return ans;
    }
};

```
