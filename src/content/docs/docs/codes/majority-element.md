---
title: "Majority Element"
description: "Return the element that appears more than n/2 times in linear time and O(1) space, using the Boyer-Moore majority vote algorithm."
source: "https://leetcode.com/problems/majority-element/"
difficulty: "Easy"
tags: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Counting"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given an array `nums` of size `n`, return *the majority element*.

The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.

**Example 1:**

```text
Input:  nums = [3,2,3]
Output: 3
```

**Example 2:**

```text
Input:  nums = [2,2,1,1,1,2,2]
Output: 2
```

**Constraints:**

- `n == nums.length`
- $1 \le n \le 5 \times 10^4$
- $-10^9 \le$ `nums[i]` $\le 10^9$
- The input is generated such that a majority element will exist in the array.

**Follow-up:** Could you solve the problem in linear time and in `O(1)` space?

## Solution approach

### Intuition

Sorting and returning `nums[n / 2]` works in $O(n \log n)$; a hash map of counts works in $O(n)$ time but $O(n)$ space. The follow-up asks for both linear time and constant space.

Think of it as an election where every element votes for itself, and pair off votes for **different** values so that they cancel. Each cancellation removes one copy of two different values, so it removes at most one copy of the majority element and at least one copy of something else. The majority element has more copies than all other values combined, so it cannot be cancelled away completely: whatever survives at the end must be the majority.

The **Boyer-Moore vote** does this cancellation in one scan with a single `candidate` and a counter `count`:

- if `count == 0`, the current element becomes the new `candidate`;
- an element equal to `candidate` adds a vote (`count++`), any other element cancels one (`count--`).

### Algorithm

1. Set `count = 0`.
2. For each `x` in `nums`: if `count == 0`, set `candidate = x`. Then `count += (x == candidate) ? 1 : -1`.
3. Return `candidate`. (No verification pass is needed because the majority element is guaranteed to exist.)

### Walkthrough

Example 2, `nums = [2,2,1,1,1,2,2]`:

| `x` | 2 | 2 | 1 | 1 | 1 | 2 | 2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `candidate` | 2 | 2 | 2 | 2 | 1 | 1 | 2 |
| `count` | 1 | 2 | 1 | 0 | 1 | 0 | 1 |

The `1`s briefly take over, but the extra `2`s cancel them, and `2` is the survivor.

### Complexity

- **Time:** $O(n)$ — a single pass.
- **Space:** $O(1)$ — two integers.

### Edge cases

- **`n = 1`:** the only element becomes the candidate and is returned.
- **Majority element appears late** (e.g. `[1,2,3,3,3]`): earlier candidates are cancelled to `count = 0`, and the majority takes over before the end.

## Code

```cpp title="C++"
class Solution {
   public:
    int majorityElement(vector<int>& nums) {
        int candidate = 0, count = 0;
        for (int x : nums) {
            if (count == 0) candidate = x;
            count += (x == candidate) ? 1 : -1;
        }
        return candidate;
    }
};
```
