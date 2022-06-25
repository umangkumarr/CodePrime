---
sidebar_position : 5
tags: [Heap(Priority-Queue), Divide and Conquer, Quickselect, Array]
---

# Kth Largest Element in an Array

## Problem Link
https://leetcode.com/problems/kth-largest-element-in-an-array/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int findKthLargest(vector<int>& nums, int k) {
        int n = nums.size();
        nth_element(nums.begin(), nums.begin() + n - k, nums.end());
        return nums[n - k];
    }
};
```
</TabItem>
</Tabs>

</details>
