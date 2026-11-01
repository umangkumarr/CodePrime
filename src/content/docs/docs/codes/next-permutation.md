---
title: "Next Permutation"
description: "A permutation of an array of integers is an arrangement of its members into a sequence or linear order. For example, for arr = [1,2,3], the following are…"
source: "https://leetcode.com/problems/next-permutation/"
tags: ["Array", "Two Pointers"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>A <strong>permutation</strong> of an array of integers is an arrangement of its members into a sequence or linear order.</p>

<ul>
	<li>For example, for <code>arr = [1,2,3]</code>, the following are considered permutations of <code>arr</code>: <code>[1,2,3]</code>, <code>[1,3,2]</code>, <code>[3,1,2]</code>, <code>[2,3,1]</code>.</li>
</ul>

<p>The <strong>next permutation</strong> of an array of integers is the next lexicographically greater permutation of its integer. More formally, if all the permutations of the array are sorted in one container according to their lexicographical order, then the <strong>next permutation</strong> of that array is the permutation that follows it in the sorted container. If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).</p>

<ul>
	<li>For example, the next permutation of <code>arr = [1,2,3]</code> is <code>[1,3,2]</code>.</li>
	<li>Similarly, the next permutation of <code>arr = [2,3,1]</code> is <code>[3,1,2]</code>.</li>
	<li>While the next permutation of <code>arr = [3,2,1]</code> is <code>[1,2,3]</code> because <code>[3,2,1]</code> does not have a lexicographical larger rearrangement.</li>
</ul>

<p>Given an array of integers <code>nums</code>, <em>find the next permutation of</em> <code>nums</code>.</p>

<p>The replacement must be <strong><a href="http://en.wikipedia.org/wiki/In-place_algorithm" target="_blank">in place</a></strong> and use only constant extra memory.</p>

## Solution approach

### Intuition

To get the next larger arrangement, change as far to the right as possible. Find the longest suffix that is non-increasing: it is already the largest arrangement of its elements, so it cannot be increased by itself. The element just before it, `nums[i]`, must grow by the smallest possible amount, so swap it with the smallest suffix element that is larger than it. Then reverse the suffix, which makes it as small as possible.

### Algorithm

1. If `n == 1`, return.
2. Starting at `i = n - 2`, move left while `nums[i + 1] <= nums[i]`.
3. If `i >= 0`, scan `j` from the end while `nums[j] <= nums[i]`. This finds the rightmost, and therefore smallest, element greater than `nums[i]`. Swap `nums[i]` and `nums[j]`, then reverse `nums[i + 1 ...]`.
4. If `i < 0`, the whole array is non-increasing, which is the last permutation, so reverse it to get the first one.

### Complexity

- **Time:** $O(n)$ — at most a few linear scans plus one reverse.
- **Space:** $O(1)$ — the array is rearranged in place.

### Edge cases

- **Last permutation** such as `[3, 2, 1]` becomes `[1, 2, 3]`.
- **Duplicates** such as `[1, 5, 1]`: the `<=` comparisons skip equal values, giving `[5, 1, 1]`.

## Code

```cpp title="C++"
class Solution {
   public:
    void nextPermutation(vector<int>& nums) {
        int n, i, j;
        n = nums.size();
        if (n == 1) return;
        i = n - 2;
        while (i >= 0 && nums[i + 1] <= nums[i]) {
            i--;
        }
        if (i >= 0) {
            j = n - 1;
            while (nums[j] <= nums[i]) j--;
            int temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
            reverse(nums.begin() + i + 1, nums.end());
            return;
        }
        reverse(nums.begin(), nums.end());
        return;
    }
};

```
