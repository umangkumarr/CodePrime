---
displayed_sidebar: null
sidebar_position : 60
tags: [Array, Binary Search, Divide and Conquer]
---

# Median of Two Sorted Arrays

## [Problem](https://leetcode.com/problems/median-of-two-sorted-arrays/)

<p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return <strong>the median</strong> of the two sorted arrays.</p>

<p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>

## Solution Approach
Refer Code

Expected Time complexity: $O(log(n))$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        int N1 = nums1.size();
        int N2 = nums2.size();
        if (N1 < N2)
            return findMedianSortedArrays(nums2, nums1);  // Make sure A2 is the shorter one.

        int lo = 0, hi = N2 * 2;
        while (lo <= hi) {
            int mid2 = (lo + hi) / 2;   // Try Cut 2
            int mid1 = N1 + N2 - mid2;  // Calculate Cut 1 accordingly

            double L1 = (mid1 == 0) ? INT_MIN : nums1[(mid1 - 1) / 2];  // Get L1, R1, L2, R2 respectively
            double L2 = (mid2 == 0) ? INT_MIN : nums2[(mid2 - 1) / 2];
            double R1 = (mid1 == N1 * 2) ? INT_MAX : nums1[(mid1) / 2];
            double R2 = (mid2 == N2 * 2) ? INT_MAX : nums2[(mid2) / 2];

            if (L1 > R2)
                lo = mid2 + 1;  // A1's lower half is too big; need to move C1
                                // left (C2 right)
            else if (L2 > R1)
                hi = mid2 - 1;  // A2's lower half too big; need to move C2 left.
            else
                return (max(L1, L2) + min(R1, R2)) / 2;  // Otherwise, that's the right cut.
        }
        return -1;
    }
};

```
</TabItem>
</Tabs>

</details>
