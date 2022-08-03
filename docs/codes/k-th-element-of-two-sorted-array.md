---
sidebar_position : 6
tags: [Array, Binary Search]
---

# K-th element of two sorted Arrays

## [Problem](https://practice.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1)

<span>Given two sorted arrays <strong>arr1</strong> and <strong>arr2</strong> of size <strong>N</strong>&nbsp;and <strong>M</strong>&nbsp;respectively and an element <strong>K</strong>. The task is to find the element that would be at the k’th position of the final sorted array.</span>

## Solution Approach
Merge 2 array approach.

Expected Time complexity: $O(log(n))$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int kthElement(int arr1[], int arr2[], int n, int m, int k) {
        int ele;
        int i = 0, j = 0;
        while (i < n && j < m) {
            if (arr1[i] <= arr2[j]) {
                ele = arr1[i];
                i++;
                if (i + j == k) return ele;
            } else {
                ele = arr2[j];
                j++;
                if (i + j == k) return ele;
            }
        }
        while (i < n) {
            ele = arr1[i++];
            if (i + j == k) return ele;
        }
        while (j < m) {
            ele = arr2[j++];
            if (i + j == k) return ele;
        }
        return -1;
    }
};
```
</TabItem>
</Tabs>

</details>
