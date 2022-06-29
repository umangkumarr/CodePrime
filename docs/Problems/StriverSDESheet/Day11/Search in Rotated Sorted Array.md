---
sidebar_position : 4
tags: [Array, Binary Search]
---

# Search in Rotated Sorted Array

## Problem Link
https://leetcode.com/problems/search-in-rotated-sorted-array/

## Solution Approach
First find the pivot using the divide and conquer. Then find on which of the array the target may lies then do binary search on that half.

Expected Time complexity: $O(log(n))$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int search(vector<int>& nums, int target) {
        int n = nums.size();
        // finding the pivot.
        int start = 0, end = n - 1;
        while (start < end) {
            int mid = start + (end - start) / 2;
            if (nums[mid] <= nums[end]) {
                end = mid;
            } else {
                start = mid + 1;
            }
        }
        // start if the pivot + 1
        if (target <= nums[n - 1]) {
            end = n - 1;
        } else {
            end = start - 1;
            start = 0;
        }

        while (start <= end) {
            int mid = start + (end - start) / 2;
            if (target == nums[mid]) return mid;
            if (nums[mid] > target)
                end = mid - 1;
            else
                start = mid + 1;
        }
        return -1;
    }
};
```
</TabItem>
</Tabs>

</details>
