---
sidebar_position : 169
tags: [Array, Dynamic Programming]
---

# Partition Equal Subset Sum

## [Problem](https://leetcode.com/problems/partition-equal-subset-sum/)

<p>Given a <strong>non-empty</strong> array <code>nums</code> containing <strong>only positive integers</strong>, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.</p>

## Solution Approach

Expected Time complexity: $O(n*sm)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    bool canPartition(vector<int>& nums) {
        int n = nums.size();
        int sm = 0;
        for (int i = 0; i < n; i++) sm += nums[i];
        if (sm % 2) return 0;
        sm /= 2;

        sort(nums.begin(), nums.end());
        vector<vector<int>> knap(nums.size() + 1, vector<int>(sm + 1));

        for (int i = 1; i <= nums.size(); i++) {
            for (int j = 1; j <= sm; j++) {
                if (nums[i - 1] > j) {
                    knap[i][j] = max(knap[i - 1][j], knap[i][j - 1]);
                    continue;
                }
                knap[i][j] =
                    max(knap[i][j], knap[i - 1][j - nums[i - 1]] + nums[i - 1]);
                knap[i][j] = max(knap[i][j], knap[i - 1][j]);
                knap[i][j] = max(knap[i][j], knap[i][j - 1]);
            }
        }

        return knap[nums.size()][sm] == sm;
    }
};

```
</TabItem>
</Tabs>

</details>
