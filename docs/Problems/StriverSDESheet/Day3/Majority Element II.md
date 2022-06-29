---
sidebar_position : 4
---

# Majority Element II

## Problem Link
https://leetcode.com/problems/majority-element-ii/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
