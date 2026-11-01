---
title: "Find Minimum in Rotated Sorted Array"
description: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:…"
source: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"
tags: ["Array", "Binary Search"]
complexity:
  time: "O(\\log n)"
  space: "O(1)"
---

## Problem

<p>Suppose an array of length <code>n</code> sorted in ascending order is <strong>rotated</strong> between <code>1</code> and <code>n</code> times. For example, the array <code>nums = [0,1,2,4,5,6,7]</code> might become:</p>

<ul>
	<li><code>[4,5,6,7,0,1,2]</code> if it was rotated <code>4</code> times.</li>
	<li><code>[0,1,2,4,5,6,7]</code> if it was rotated <code>7</code> times.</li>
</ul>

<p>Notice that <strong>rotating</strong> an array <code>[a[0], a[1], a[2], ..., a[n-1]]</code> 1 time results in the array <code>[a[n-1], a[0], a[1], a[2], ..., a[n-2]]</code>.</p>

<p>Given the sorted rotated array <code>nums</code> of <strong>unique</strong> elements, return <em>the minimum element of this array</em>.</p>

<p>You must write an algorithm that runs in&nbsp;<code>O(log n) time.</code></p>

## Solution approach

### Intuition

After rotation, the array is two increasing runs, and the minimum is the first element of the second run. A linear scan would work in $O(n)$, but binary search can tell which half holds the drop. If `nums[mid]` is larger than `nums[end]`, the values must fall somewhere after `mid`, so the minimum is in the right half. Otherwise, `mid` to `end` is already sorted, so the minimum is at `mid` or to its left.

### Algorithm

1. Set `start = 0`, `end = nums.size() - 1` and loop while `start < end`.
2. Compute `mid = (start + end) / 2`.
3. If `nums[mid] >= nums[start]` and `nums[end] < nums[mid]`, set `start = mid + 1`.
4. Otherwise set `end = mid` (keeping `mid`, since it may be the minimum).
5. When `start == end`, return `nums[start]`.

### Complexity

- **Time:** $O(\log n)$ — the range is roughly halved each iteration.
- **Space:** $O(1)$ — only three indices.

### Edge cases

- **Not rotated** (e.g. `[1, 2, 3]`): `nums[end] < nums[mid]` is never true, so `end` moves down to `0`.
- **Single element:** the loop does not run and `nums[0]` is returned.

## Code

```cpp title="C++"
class Solution {
   public:
    int findMin(vector<int>& nums) {
        int start = 0, end = nums.size() - 1;
        while (start < end) {
            int mid = (start + end) / 2;
            if (nums[mid] >= nums[start] && nums[end] < nums[mid]) {
                start = mid + 1;
            } else {
                end = mid;
            }
        }
        return nums[start];
    }
};
```
