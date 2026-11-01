---
title: "Remove Duplicates from Sorted Array"
description: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative…"
source: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/"
tags: ["Array", "Two Pointers"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Given an integer array <code>nums</code> sorted in <strong>non-decreasing order</strong>, remove the duplicates <a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank"><strong>in-place</strong></a> such that each unique element appears only <strong>once</strong>. The <strong>relative order</strong> of the elements should be kept the <strong>same</strong>.</p>

<p>Since it is impossible to change the length of the array in some languages, you must instead have the result be placed in the <strong>first part</strong> of the array <code>nums</code>. More formally, if there are <code>k</code> elements after removing the duplicates, then the first <code>k</code> elements of <code>nums</code>&nbsp;should hold the final result. It does not matter what you leave beyond the first&nbsp;<code>k</code>&nbsp;elements.</p>

<p>Return <code>k</code><em> after placing the final result in the first </em><code>k</code><em> slots of </em><code>nums</code>.</p>

<p>Do <strong>not</strong> allocate extra space for another array. You must do this by <strong>modifying the input array <a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank">in-place</a></strong> with O(1) extra memory.</p>

<p><strong>Custom Judge:</strong></p>

<p>The judge will test your solution with the following code:</p>

```
int[] nums = [...]; // Input array
int[] expectedNums = [...]; // The expected answer with correct length

int k = removeDuplicates(nums); // Calls your implementation

assert k == expectedNums.length;
for (int i = 0; i &lt; k; i++) {
    assert nums[i] == expectedNums[i];
}
```

<p>If all assertions pass, then your solution will be <strong>accepted</strong>.</p>

## Solution approach

### Intuition

In a sorted array, duplicates sit next to each other. If `count` duplicates have been seen so far, every new unique element has to move `count` places to the left to close the gaps. So one pass that counts duplicates and shifts unique values left compacts the array in place.

### Algorithm

1. Set `count = 0`.
2. For each `i` from `1` to `n - 1`:
   - If `A[i] == A[i - 1]`, it is a duplicate, so increment `count`.
   - Otherwise write it to its compacted position: `A[i - count] = A[i]`. Writes only land at indices below `i` (or rewrite the same value when `count` is `0`), so later comparisons always see original values.
3. Return `n - count`, the number of unique elements, which now fill the front of `A`.

### Complexity

- **Time:** $O(n)$ — a single pass.
- **Space:** $O(1)$ — the array is modified in place.

## Code

```cpp title="C++"
class Solution {
   public:
    int removeDuplicates(vector<int>& A) {
        int count = 0;
        int n = A.size();
        for (int i = 1; i < n; i++) {
            if (A[i] == A[i - 1])
                count++;
            else
                A[i - count] = A[i];
        }
        return n - count;
    }
};

```
