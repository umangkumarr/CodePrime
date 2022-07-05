---
displayed_sidebar: null
sidebar_position : 5
tags: [Array, Divide and Conquer, Dynamic Programming]
---

# Maximum Subarray

## [Problem](https://leetcode.com/problems/maximum-subarray/)

<p>Given an integer array <code>nums</code>, find the contiguous subarray (containing at least one number) which has the largest sum and return <em>its sum</em>.</p>

<p>A <strong>subarray</strong> is a <strong>contiguous</strong> part of an array.</p>

## Solution Approach

Can we solve it using kadane's Algorithm?

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

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

</details>
