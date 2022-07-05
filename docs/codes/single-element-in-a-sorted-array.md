---
displayed_sidebar: null
sidebar_position : 61
tags: [Array, Binary Search]
---

# Single Element in a Sorted Array

## [Problem](https://leetcode.com/problems/single-element-in-a-sorted-array/)

<p>You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.</p>

<p>Return <em>the single element that appears only once</em>.</p>

<p>Your solution must run in <code>O(log n)</code> time and <code>O(1)</code> space.</p>

## Solution Approach
Find the max and min element in the given array. Use divide conquer to find the an element $x$ in the range of [max, min] such that the no. of element less than equal to $x$ are odd.

Expected Time complexity: $O(log(n)^2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int singleNonDuplicate(vector<int>& nums) {
        int n = nums.size();
        int max = INT_MIN, min = INT_MAX;
        for (int i = 0; i < n; i++) {
            max = max < nums[i] ? nums[i] : max;
            min = min > nums[i] ? nums[i] : min;
        }

        while (min < max) {
            int mid = min + (max - min) / 2;
            int elems =
                upper_bound(nums.begin(), nums.end(), mid) - nums.begin();
            if (elems % 2) {
                max = mid;
            } else {
                min = mid + 1;
            }
        }
        return min;
    }
};

```
</TabItem>
</Tabs>

</details>
