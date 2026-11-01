---
title: "Median of Two Sorted Arrays"
description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should…"
source: "https://leetcode.com/problems/median-of-two-sorted-arrays/"
tags: ["Array", "Binary Search", "Divide and Conquer"]
complexity:
  time: "O(\\log(\\min(N1, N2)))"
  space: "O(1)"
---

## Problem

<p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return <strong>the median</strong> of the two sorted arrays.</p>

<p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>

## Solution approach

### Intuition

The median splits the merged array into two halves of equal size. We do not need to merge: it is enough to find a cut in each array such that the left parts together hold half of all elements and every value on the left is at most every value on the right. Then the median comes from the largest left value and the smallest right value.

To handle odd and even lengths in the same way, the code imagines a separator between every pair of elements, which doubles the cut positions. A cut at position `c` has `L = nums[(c - 1) / 2]` on its left and `R = nums[c / 2]` on its right. Choosing the cut `mid2` in the shorter array fixes `mid1 = N1 + N2 - mid2` in the longer one, so only one value needs to be binary searched. The comments in the code mark each of these steps.

### Algorithm

1. If `nums1` is shorter, swap the arguments so that `nums2` (length `N2`) is the shorter array.
2. Binary search `mid2` over `[0, 2 * N2]` and set `mid1 = N1 + N2 - mid2`.
3. Compute `L1`, `R1`, `L2`, `R2`, using `INT_MIN` or `INT_MAX` when a cut is at an array's edge.
4. If `L1 > R2`, the left part of `nums1` is too large, so move `mid2` right (`lo = mid2 + 1`). If `L2 > R1`, move it left (`hi = mid2 - 1`).
5. Otherwise the cut is correct: return `(max(L1, L2) + min(R1, R2)) / 2`. For an odd total length one cut lands on an element, so its `L` and `R` are equal and the formula still gives that element.

### Complexity

- **Time:** $O(\log(\min(N1, N2)))$ — binary search over the cut positions of the shorter array.
- **Space:** $O(1)$ — only a few variables.

### Edge cases

- **One empty array**: `N2 = 0`, so the only cut is `mid2 = 0` and the median comes entirely from `nums1`.

## Code

```cpp title="C++"
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
