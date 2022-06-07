---
sidebar_position : 4
---

# Kadane’s Algorithm

## Problem Link
https://leetcode.com/problems/maximum-subarray/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int maxSubArray(vector<int>& nums) {
        int ans = *max_element(nums.begin(), nums.end());
        int n = nums.size();
        int max_so_far = 0, max_till_here = 0;

        for (int i = 0; i < n; i++) {
            max_till_here += nums[i];
            if (max_till_here > max_so_far) max_so_far = max_till_here;
            if (max_till_here < 0) max_till_here = 0;
        }
        if (ans < 0) return ans;
        return max_so_far;
    }
};
```
</TabItem>
</Tabs>
