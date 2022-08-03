---
sidebar_position : 4
tags: [Array, Binary Search]
---

# Find Minimum in Rotated Sorted Array II

## [Problem](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/)

<p>Suppose an array of length <code>n</code> sorted in ascending order is <strong>rotated</strong> between <code>1</code> and <code>n</code> times. For example, the array <code>nums = [0,1,4,4,5,6,7]</code> might become:</p>

<ul>
	<li><code>[4,5,6,7,0,1,4]</code> if it was rotated <code>4</code> times.</li>
	<li><code>[0,1,4,4,5,6,7]</code> if it was rotated <code>7</code> times.</li>
</ul>

<p>Notice that <strong>rotating</strong> an array <code>[a[0], a[1], a[2], ..., a[n-1]]</code> 1 time results in the array <code>[a[n-1], a[0], a[1], a[2], ..., a[n-2]]</code>.</p>

<p>Given the sorted rotated array <code>nums</code> that may contain <strong>duplicates</strong>, return <em>the minimum element of this array</em>.</p>

<p>You must decrease the overall operation steps as much as possible.</p>

## Solution Approach

Expected Time Complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
public:
    int findMin(vector<int>& nums) {
        int start = 0, end = nums.size()-1;
        while(start < end){
            int mid = (start + end)/2;
            if(nums[mid] >= nums[start] && nums[end] < nums[mid]){
                start = mid + 1;
            }else if(nums[mid] >= nums[start] && nums[end] == nums[mid]){
                end -= 1;
            }else{
                end = mid;
            }
        }
        return nums[start];
    }
};
```
</TabItem>
</Tabs>

</details>
