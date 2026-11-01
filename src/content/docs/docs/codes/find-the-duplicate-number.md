---
title: "Find the Duplicate Number"
description: "Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive. There is only one repeated number in nums,…"
source: "https://leetcode.com/problems/find-the-duplicate-number/"
tags: ["Array", "Two Pointers", "Binary Search", "Bit Manipulation"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Given an array of integers <code>nums</code> containing&nbsp;<code>n + 1</code> integers where each integer is in the range <code>[1, n]</code> inclusive.</p>

<p>There is only <strong>one repeated number</strong> in <code>nums</code>, return <em>this&nbsp;repeated&nbsp;number</em>.</p>

<p>You must solve the problem <strong>without</strong> modifying the array <code>nums</code>&nbsp;and uses only constant extra space.</p>

## Solution approach

### Intuition

Treat the array as a function: from index `i` we move to index `nums[i]`. All values lie in `[1, n]`, so starting at index `0` we can follow this forever. Since two different indices point to the duplicate value, that value has two incoming arrows, and it is exactly the entrance of the cycle we eventually fall into. Floyd's tortoise-and-hare method finds a cycle entrance in $O(n)$ time without extra memory and without modifying the array.

### Algorithm

1. Start from index `0`: `slow = nums[0]` (one step) and `fast = nums[nums[0]]` (two steps).
2. Move `slow` one step and `fast` two steps until they meet inside the cycle.
3. Reset `fast = 0`. Now move both one step at a time; the point where they meet is the cycle entrance.
4. Return `slow`, the duplicate value. If `nums.size()` is `1` or less, return `-1`.

### Complexity

- **Time:** $O(n)$ — both phases take at most a linear number of steps.
- **Space:** $O(1)$ — only two pointers.

### Edge cases

- **Duplicate appearing many times** (e.g. `[2, 2, 2, 2]`): it is still the only value with several incoming arrows, so it is still the cycle entrance.

## Code

```cpp title="C++"
class Solution {
   public:
    int findDuplicate(vector<int>& nums) {
        if (nums.size() > 1) {
            int slow = nums[0];
            int fast = nums[nums[0]];
            while (slow != fast) {
                slow = nums[slow];
                fast = nums[nums[fast]];
            }

            fast = 0;
            while (fast != slow) {
                fast = nums[fast];
                slow = nums[slow];
            }
            return slow;
        }
        return -1;
    }
};

```
