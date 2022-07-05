---
displayed_sidebar: null
sidebar_position : 16
tags: [Array, Hash Table, Sorting, Counting]
---

# Majority Element II

## [Problem](https://leetcode.com/problems/majority-element-ii/)

<p>Given an integer array of size <code>n</code>, find all elements that appear more than <code>&lfloor; n/3 &rfloor;</code> times.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
