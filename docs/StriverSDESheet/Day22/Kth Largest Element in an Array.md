---
sidebar_position : 5
tags: [Heap(Priority-Queue), Divide and Conquer, Quickselect, Array]
---

# Kth Largest Element in an Array

## [Problem](https://leetcode.com/problems/kth-largest-element-in-an-array/)

<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the</em> <code>kth</code> <em>largest element in the array</em>.</p>

<p>Note that it is the <code>kth</code> largest element in the sorted order, not the <code>kth</code> distinct element.</p>

<p>&nbsp;</p>

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
