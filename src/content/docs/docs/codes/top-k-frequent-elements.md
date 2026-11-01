---
title: "Top K Frequent Elements"
description: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order."
source: "https://leetcode.com/problems/top-k-frequent-elements/"
tags: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Bucket Sort", "Counting", "Quickselect"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the</em> <code>k</code> <em>most frequent elements</em>. You may return the answer in <strong>any order</strong>.</p>

## Solution approach

### Intuition

Count how often each value appears, then sort the distinct values by frequency and take the first `k`. Storing each entry as a `(frequency, value)` pair makes the default pair ordering sort by frequency first.

### Algorithm

1. Count frequencies of `nums` into the ordered map `mp`.
2. Push each entry into `distinct` as `make_pair(count, value)`.
3. Sort `distinct` and reverse it, so the highest frequencies come first.
4. Return the `.second` (value) of the first `k` pairs as `ans`.

### Complexity

- **Time:** $O(n \log n)$ — building the ordered map costs $O(n \log n)$, and sorting the distinct pairs costs at most the same.
- **Space:** $O(n)$ — the map and `distinct` hold up to $n$ entries.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        int n = nums.size();
        map<int, int> mp;
        vector<pair<int, int>> distinct;
        for (int i = 0; i < n; i++) {
            mp[nums[i]]++;
        }

        for (auto i : mp) {
            distinct.push_back(make_pair(i.second, i.first));
        }

        sort(distinct.begin(), distinct.end());
        reverse(distinct.begin(), distinct.end());
        vector<int> ans;
        for (int i = 0; i < k; i++) {
            ans.push_back(distinct[i].second);
        }
        return ans;
    }
};

```
