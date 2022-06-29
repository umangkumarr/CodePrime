---
sidebar_position : 1
tags: [Array, Two Pointers, Sorting]
---

# 3Sum

## [Problem](https://leetcode.com/problems/3sum/)

<p>Given an integer array nums, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p>

<p>Notice that the solution set must not contain duplicate triplets.</p>

## Solution Approach

Follow a simple Greedy approach. Solve the problem in the following steps:
<li>In Step 1, find all combinations of thoses indexes having different values and sums to 0.</li>
<li>In Step 2, find all combinations of thoses indexes having exactly two same values and sums to 0.</li>
<li>In Step 3, find all combinations of thoses indexes having all values sames (in this case value will be 0) and sums to 0.</li>

Store these combinations in a Hash Map or in a Set to avoid repetition.

Expected Time complexity: $O(n^2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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

        // Step 1
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

        // Step 2
        for (int i = 0; i < n; i++) {
            int sm = 2 * arr[i];
            if (sm != arr[i] && mp[arr[i]] > 1 && mp[-2 * arr[i]] > 0) {
                vector<int> v = {arr[i], arr[i], -sm};
                sort(v.begin(), v.end());
                ans.insert(v);
            }
        }

        // Step 3
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
</TabItem>
</Tabs>

</details>
