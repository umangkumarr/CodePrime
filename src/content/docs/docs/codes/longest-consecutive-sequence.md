---
title: "Longest Consecutive Sequence"
description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n)…"
source: "https://leetcode.com/problems/longest-consecutive-sequence/"
tags: ["Array", "Hash Table", "Union Find"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>Given an unsorted array of integers <code>nums</code>, return <em>the length of the longest consecutive elements sequence.</em></p>

<p>You must write an algorithm that runs in&nbsp;<code>O(n)</code>&nbsp;time.</p>

## Solution approach

### Intuition

The length of the consecutive run that **ends** at value `a` is `1` plus the length of the run ending at `a - 1`, or `0` if `a` is not in the array. That recurrence can be memoised, so each value's answer is computed once, and the longest run is the maximum over all values.

### Algorithm

1. Count every number into the map `mp`.
2. `findlongestConsecutive(a)`:
   - if `mp1[a]` is already set, return it (memoised);
   - if `a` is not present (`mp[a] == 0`), return `0`;
   - otherwise set `mp1[a] = 1 + findlongestConsecutive(a - 1)` and return it.
3. Call it for every distinct key in `mp` and keep the maximum in `ans`.

### Complexity

- **Time:** $O(n \log n)$ — each distinct value is solved once, and every step does ordered `map` lookups.
- **Space:** $O(n)$ — the two maps, plus a recursion stack that can be as deep as the longest run.

### Edge cases

- **Duplicates** are counted once, because the loop iterates over distinct keys of `mp`.
- **Empty array:** the loop never runs and `0` is returned.

## Code

```cpp title="C++"
class Solution {
    map<int, int> mp, mp1;

   public:
    int findlongestConsecutive(int a) {
        if (mp1[a]) return mp1[a];
        if (mp[a] == 0) return 0;
        mp1[a] = 1;
        mp1[a] += findlongestConsecutive(a - 1);
        return mp1[a];
    }

    int longestConsecutive(vector<int>& nums) {
        int n = nums.size();
        for (int i = 0; i < n; i++) {
            mp[nums[i]]++;
        }

        int ans = 0;
        for (auto i : mp) {
            ans = max(ans, findlongestConsecutive(i.first));
        }
        return ans;
    }
};

```
