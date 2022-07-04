---
sidebar_position : 21
tags: [Array, Hash Table]
---

# Two Sum

## [Problem](https://leetcode.com/problems/two-sum/)

<p>Given an array of integers <code>nums</code>&nbsp;and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>

<p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p>

<p>You can return the answer in any order.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
