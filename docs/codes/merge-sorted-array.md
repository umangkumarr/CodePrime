---
sidebar_position : 8
tags: [Array, Two Pointers, Sorting]
---

# Merge Sorted Array

## [Problem](https://leetcode.com/problems/merge-sorted-array/)

<p>You are given two integer arrays <code>nums1</code> and <code>nums2</code>, sorted in <strong>non-decreasing order</strong>, and two integers <code>m</code> and <code>n</code>, representing the number of elements in <code>nums1</code> and <code>nums2</code> respectively.</p>

<p><strong>Merge</strong> <code>nums1</code> and <code>nums2</code> into a single array sorted in <strong>non-decreasing order</strong>.</p>

<p>The final sorted array should not be returned by the function, but instead be <em>stored inside the array </em><code>nums1</code>. To accommodate this, <code>nums1</code> has a length of <code>m + n</code>, where the first <code>m</code> elements denote the elements that should be merged, and the last <code>n</code> elements are set to <code>0</code> and should be ignored. <code>nums2</code> has a length of <code>n</code>.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    void merge(vector<int>& arr1, int m, vector<int>& arr2, int n) {
        vector<int> arr(m + n);
        int i = 0, j = 0, k = 0;
        while (i < m && j < n) {
            if (arr1[i] <= arr2[j])
                arr[k++] = arr1[i++];
            else
                arr[k++] = arr2[j++];
        }
        while (i < m) arr[k++] = arr1[i++];
        while (j < n) arr[k++] = arr2[j++];
        arr1 = arr;
    }
};

```
</TabItem>
</Tabs>

</details>
