---
sidebar_position : 2
tags: [Array, Backtracking, Bit Manipulation]
---

# Subsets II

## Problem Link
https://leetcode.com/problems/subsets-ii/

## Solution Approach
Iterate overall possible subset. This can be done using recursion or bitmasking.

Expected Time complexity: $O(2^n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        int n = nums.size();
        int end = pow(2, n);

        set<vector<int>> store;
        for (int i = 0; i < end; i++) {
            vector<int> arr;
            for (int j = 0; j < n; j++) {
                int bit = (1 << j) & i;
                if (bit) arr.push_back(nums[j]);
            }
            sort(arr.begin(), arr.end());
            store.insert(arr);
        }
        vector<vector<int>> ans;
        for (auto i : store) ans.push_back(i);
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
