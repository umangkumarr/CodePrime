---
title: "K-th element of two sorted Arrays"
description: "Given two sorted arrays arr1 and arr2 of size N and M respectively and an element K. The task is to find the element that would be at the k’th position of…"
source: "https://practice.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1"
tags: ["Array", "Binary Search"]
complexity:
  time: "O(k)"
  space: "O(1)"
---

## Problem

<span>Given two sorted arrays <strong>arr1</strong> and <strong>arr2</strong> of size <strong>N</strong>&nbsp;and <strong>M</strong>&nbsp;respectively and an element <strong>K</strong>. The task is to find the element that would be at the k’th position of the final sorted array.</span>

## Solution approach

### Intuition

This uses the merge-two-arrays approach. The merge step of merge sort produces the elements of both sorted arrays in increasing order. We do not need the merged array itself: we only count how many elements have been taken, and the element taken when the count reaches `k` is the answer.

### Algorithm

1. Keep pointers `i` into `arr1` and `j` into `arr2`.
2. While both arrays have elements left, take the smaller of `arr1[i]` and `arr2[j]` into `ele` and advance that pointer.
3. After each step, if `i + j == k`, return `ele`.
4. When one array runs out, keep taking from the other array the same way.
5. Return `-1` if `k` exceeds `n + m`.

### Complexity

- **Time:** $O(k)$ — the merge stops after exactly `k` elements have been taken.
- **Space:** $O(1)$ — only a few pointers are used.

## Code

```cpp title="C++"
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
