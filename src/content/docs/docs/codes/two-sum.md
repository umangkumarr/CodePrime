---
title: "Two Sum"
description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input…"
source: "https://leetcode.com/problems/two-sum/"
tags: ["Array", "Hash Table"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Given an array of integers <code>nums</code>&nbsp;and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>

<p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p>

<p>You can return the answer in any order.</p>

## Solution approach

### Intuition

For each element `nums[i]`, the only partner that can complete the pair is `target - nums[i]`. Instead of scanning the array again to look for that partner (which is what makes the brute-force solution $O(n^2)$), we can look it up in a hash table in constant time.

Because the same value may appear more than once (e.g. `nums = [3, 3]`, `target = 6`), the table maps each **value to every index** where it appears, so we can pick an index that is different from `i`.

### Algorithm

1. Build a hash map `mp` from each value to the list of indices where it occurs.
2. For every index `i`, compute the complement `target - nums[i]` and look it up in `mp`.
3. Walk the complement's index list and return the first index `j` with `j != i`, together with `i`.
4. The problem guarantees exactly one answer, so the loop always returns before the end.

### Complexity

- **Time:** $O(n)$ — one pass to build the map and one pass to query it; each lookup is $O(1)$ on average. The inner loop runs at most twice before finding an index other than `i`.
- **Space:** $O(n)$ — the hash map stores every index once.

### Edge cases

- **Duplicate values** such as `[3, 3]` with `target = 6`: both indices sit in the same list, and the `j != i` check selects the other one.
- **Using an element twice** such as `[3, 2, 4]` with `target = 6`: `3 + 3` is rejected because the only index stored for `3` is `i` itself.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> twoSum(vector<int>& nums, int target) {
        int n = nums.size();
        unordered_map<int, vector<int>> mp;
        vector<int> ans(2);
        for (int i = 0; i < n; i++) {
            mp[nums[i]].push_back(i);
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < mp[target - nums[i]].size(); j++) {
                if (mp[target - nums[i]][j] != i) {
                    ans = {i, mp[target - nums[i]][j]};
                    return ans;
                }
            }
        }
        return ans;
    }
};

```
