---
title: "Search in Rotated Sorted Array"
description: "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an…"
source: "https://leetcode.com/problems/search-in-rotated-sorted-array/"
tags: ["Array", "Binary Search"]
complexity:
  time: "O(\\log n)"
  space: "O(1)"
---

## Problem

<p>There is an integer array <code>nums</code> sorted in ascending order (with <strong>distinct</strong> values).</p>

<p>Prior to being passed to your function, <code>nums</code> is <strong>possibly rotated</strong> at an unknown pivot index <code>k</code> (<code>1 &lt;= k &lt; nums.length</code>) such that the resulting array is <code>[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]</code> (<strong>0-indexed</strong>). For example, <code>[0,1,2,4,5,6,7]</code> might be rotated at pivot index <code>3</code> and become <code>[4,5,6,7,0,1,2]</code>.</p>

<p>Given the array <code>nums</code> <strong>after</strong> the possible rotation and an integer <code>target</code>, return <em>the index of </em><code>target</code><em> if it is in </em><code>nums</code><em>, or </em><code>-1</code><em> if it is not in </em><code>nums</code>.</p>

<p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>

## Solution approach

### Intuition

A rotated sorted array is two sorted runs placed one after the other. First find the pivot, the index of the smallest element, using binary search. Then work out which of the two sorted runs the target can lie in, and run a normal binary search on that run.

To find the pivot, compare `nums[mid]` with `nums[end]`. If `nums[mid] <= nums[end]`, the range from `mid` to `end` is sorted, so the minimum is at `mid` or to its left. Otherwise the drop, and therefore the minimum, lies to the right of `mid`.

### Algorithm

1. Binary search with `start` and `end` until they meet. When it ends, `start` is the index of the minimum (the pivot).
2. If `target <= nums[n - 1]`, the target can only be in the right run, so search `[start, n - 1]`. Otherwise search the left run `[0, start - 1]`.
3. Run a standard binary search on that range, returning `mid` on a match.
4. Return `-1` if it is not found.

### Complexity

- **Time:** $O(\log n)$ — two binary searches.
- **Space:** $O(1)$ — only index variables.

### Edge cases

- **Array not rotated:** the pivot is `0`. A target larger than `nums[n - 1]` gives the empty range `[0, -1]`, so the answer is `-1`.

## Code

```cpp title="C++"
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
