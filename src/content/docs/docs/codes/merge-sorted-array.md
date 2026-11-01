---
title: "Merge Sorted Array"
description: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1…"
source: "https://leetcode.com/problems/merge-sorted-array/"
tags: ["Array", "Two Pointers", "Sorting"]
complexity:
  time: "O(m + n)"
  space: "O(m + n)"
---

## Problem

<p>You are given two integer arrays <code>nums1</code> and <code>nums2</code>, sorted in <strong>non-decreasing order</strong>, and two integers <code>m</code> and <code>n</code>, representing the number of elements in <code>nums1</code> and <code>nums2</code> respectively.</p>

<p><strong>Merge</strong> <code>nums1</code> and <code>nums2</code> into a single array sorted in <strong>non-decreasing order</strong>.</p>

<p>The final sorted array should not be returned by the function, but instead be <em>stored inside the array </em><code>nums1</code>. To accommodate this, <code>nums1</code> has a length of <code>m + n</code>, where the first <code>m</code> elements denote the elements that should be merged, and the last <code>n</code> elements are set to <code>0</code> and should be ignored. <code>nums2</code> has a length of <code>n</code>.</p>

## Solution approach

### Intuition

Both arrays are already sorted, so the smallest remaining element is always at the front of one of them. Comparing the two fronts and taking the smaller one builds the merged order in a single pass, just like the merge step of merge sort.

### Algorithm

1. Create a buffer `arr` of size `m + n` and set the pointers `i`, `j`, `k` to `0`.
2. While both arrays have elements left, copy the smaller of `arr1[i]` and `arr2[j]` into `arr[k++]`.
3. Copy whatever is left of `arr1`, then of `arr2`.
4. Assign `arr1 = arr`, so `arr1` holds the merged result.

### Complexity

- **Time:** $O(m + n)$ — each element is copied once.
- **Space:** $O(m + n)$ — the extra buffer `arr`.

### Edge cases

- **`m = 0`**: the first two loops do nothing, and `arr1` becomes a copy of `arr2`.

## Code

```cpp title="C++"
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
