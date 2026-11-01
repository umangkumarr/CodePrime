---
title: "3Sum"
description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] ==…"
source: "https://leetcode.com/problems/3sum/"
tags: ["Array", "Two Pointers", "Sorting"]
complexity:
  time: "O(n^2 \\log n)"
  space: "O(n + k)"
---

## Problem

<p>Given an integer array nums, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p>

<p>Notice that the solution set must not contain duplicate triplets.</p>

## Solution approach

### Intuition

Duplicate triplets are the main difficulty, so the code works with the **distinct values** of `nums` and a frequency map `mp`. Every valid triplet falls into exactly one of three shapes: three different values, two equal values plus a third, or `{0, 0, 0}`. Each shape can be checked separately using the counts in `mp`.

For three different values, fixing a pair `arr[i]`, `arr[j]` determines the third value `-(arr[i] + arr[j])`, which a hash lookup checks in $O(1)$. This avoids the $O(n^3)$ brute force over all triples. Each triplet is sorted and stored in a `set` so repeats are dropped.

### Algorithm

1. Count every value in `mp`, copy the distinct values into `arr`, and sort `arr`.
2. **All different:** for every pair `i`, `j` of distinct values, let `sm = arr[i] + arr[j]`. If `-sm` differs from both and `mp[-sm] > 0`, sort the triplet and insert it into `ans`.
3. **Two equal:** for every `arr[i] != 0` with `mp[arr[i]] > 1`, check whether `-2 * arr[i]` exists; if so, insert `{arr[i], arr[i], -2 * arr[i]}`.
4. **All equal:** if `mp[0] > 2`, insert `{0, 0, 0}`.
5. Copy the set `ans` into the vector `vv` and return it.

### Complexity

- **Time:** $O(n^2 \log n)$ — $O(n^2)$ pairs of distinct values, and each insertion into the ordered `set` costs $O(\log n)$ or more.
- **Space:** $O(n + k)$ — the map and `arr` hold up to $n$ values and the set holds the $k$ unique triplets.

### Edge cases

- **Many zeros** such as `[0, 0, 0, 0]`: steps 2 and 3 skip zero, and only step 4 adds `{0, 0, 0}`, once.
- **A value used twice** such as `[-1, -1, 2]`: handled by step 3, because step 2 never pairs a value with itself.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        int n = nums.size();
        unordered_map<int, int> mp;
        for (int i = 0; i < n; i++) {
            mp[nums[i]]++;
        }

        vector<int> arr;
        for (auto i : mp) {
            arr.push_back(i.first);
        }

        set<vector<int>> ans;
        n = arr.size();
        sort(arr.begin(), arr.end());
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int sm = arr[i] + arr[j];
                if (-sm != arr[i] && -sm != arr[j] && mp[-sm] > 0) {
                    vector<int> v = {arr[i], arr[j], -sm};
                    sort(v.begin(), v.end());
                    ans.insert(v);
                }
            }
        }

        for (int i = 0; i < n; i++) {
            int sm = 2 * arr[i];
            if (sm != arr[i] && mp[arr[i]] > 1 && mp[-2 * arr[i]] > 0) {
                vector<int> v = {arr[i], arr[i], -sm};
                sort(v.begin(), v.end());
                ans.insert(v);
            }
        }

        if (mp[0] > 2) {
            ans.insert({0, 0, 0});
        }
        vector<vector<int>> vv;
        for (auto i : ans) {
            vv.push_back(i);
        }
        return vv;
    }
};

```
