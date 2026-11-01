---
title: "Find Minimum in Rotated Sorted Array II"
description: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,4,4,5,6,7] might become:…"
source: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/"
tags: ["Array", "Binary Search"]
complexity:
  time: "O(\\log n)"
  space: "O(1)"
---

## Problem

<p>Suppose an array of length <code>n</code> sorted in ascending order is <strong>rotated</strong> between <code>1</code> and <code>n</code> times. For example, the array <code>nums = [0,1,4,4,5,6,7]</code> might become:</p>

<ul>
	<li><code>[4,5,6,7,0,1,4]</code> if it was rotated <code>4</code> times.</li>
	<li><code>[0,1,4,4,5,6,7]</code> if it was rotated <code>7</code> times.</li>
</ul>

<p>Notice that <strong>rotating</strong> an array <code>[a[0], a[1], a[2], ..., a[n-1]]</code> 1 time results in the array <code>[a[n-1], a[0], a[1], a[2], ..., a[n-2]]</code>.</p>

<p>Given the sorted rotated array <code>nums</code> that may contain <strong>duplicates</strong>, return <em>the minimum element of this array</em>.</p>

<p>You must decrease the overall operation steps as much as possible.</p>

## Solution approach

### Intuition

A rotated sorted array is two sorted runs, and the minimum is where the second run starts. Comparing `nums[mid]` with the ends tells us which side holds that point, as in the version without duplicates. With duplicates, though, `nums[mid] == nums[end]` gives no information: the minimum could be on either side. In that case we can still safely drop `nums[end]`, because an equal copy of it (`nums[mid]`) stays in the range.

### Algorithm

1. Keep `start = 0`, `end = nums.size() - 1` and loop while `start < end`, with `mid = (start + end) / 2`.
2. If `nums[mid] >= nums[start]` and `nums[end] < nums[mid]`, the drop is to the right of `mid`, so `start = mid + 1`.
3. Else, if `nums[mid] >= nums[start]` and `nums[end] == nums[mid]`, the side is unknown, so shrink with `end -= 1`.
4. Otherwise `nums[mid]` is in the lower run, so the minimum is at `mid` or to its left: `end = mid`.
5. Return `nums[start]`.

### Complexity

- **Time:** $O(\log n)$ on average, $O(n)$ in the worst case — with many duplicates (e.g. all equal), the `end -= 1` step removes just one element per iteration.
- **Space:** $O(1)$ — only a few indices.

### Edge cases

- **All elements equal:** `end` walks down to `start` one step at a time, and any element is the answer.
- **Not rotated:** `nums[mid] <= nums[end]` throughout, so the range shrinks to index `0`.

## Code

```cpp title="C++"
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
