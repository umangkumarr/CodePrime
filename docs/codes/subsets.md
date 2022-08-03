---
sidebar_position : 176
tags: [Array, Backtracking, Bit Manipulation]
---

# Subsets

## [Problem](https://leetcode.com/problems/subsets/)

<p>Given an integer array <code>nums</code> of <strong>unique</strong> elements, return <em>all possible subsets (the power set)</em>.</p>

<p>The solution set <strong>must not</strong> contain duplicate subsets. Return the solution in <strong>any order</strong>.</p>

## Solution Approach

Expected Time complexity: $O(2^n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<vector<int>> subsets(vector<int>& nums) {
        set<vector<int>> st;
        for (int i = 0; i < (1ll << nums.size()); i++) {
            vector<int> subset;
            for (int j = 0; j < nums.size(); j++) {
                int bit = (1ll << j) & i;
                if (bit) subset.push_back(nums[j]);
            }
            sort(subset.begin(), subset.end());
            st.insert(subset);
        }
        vector<vector<int>> ans(st.begin(), st.end());
        return ans;
    }
};

```
</TabItem>
</Tabs>

</details>
