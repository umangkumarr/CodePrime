---
title: "Partition Equal Subset Sum"
description: "Decide whether an array can be split into two subsets with equal sums by checking if half the total is a reachable subset sum, using a bitset 0/1 knapsack."
source: "https://leetcode.com/problems/partition-equal-subset-sum/"
difficulty: "Medium"
tags: ["Array", "Dynamic Programming", "Knapsack Problem", "0-1 Knapsack"]
complexity:
  time: "O(n \\cdot S / w)"
  space: "O(S / w)"
---

## Problem

Given an integer array `nums`, return `true` *if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or* `false` *otherwise*.

**Example 1:**

```text
Input:  nums = [1,5,11,5]
Output: true
Explanation: The array can be partitioned as [1, 5, 5] and [11].
```

**Example 2:**

```text
Input:  nums = [1,2,3,5]
Output: false
Explanation: The array cannot be partitioned into equal sum subsets.
```

**Constraints:**

- $1 \le$ `nums.length` $\le 200$
- $1 \le$ `nums[i]` $\le 100$

## Solution approach

### Intuition

If the total is `total`, the two subsets must each sum to `total / 2`. So `total` must be even, and then the question becomes: **is there a subset that sums to exactly `target = total / 2`?** (The remaining elements automatically sum to `target` too.)

Trying all $2^n$ subsets is far too slow, but the sums are small: at most $200 \cdot 100 = 20\,000$, so `target` is at most `10 000`. Track the **set of sums reachable** by some subset of the elements seen so far. Initially only `0` is reachable (the empty subset). When element `x` arrives, every old reachable sum `s` stays reachable (skip `x`) and `s + x` becomes reachable (take `x`). Each element is used at most once, because new sums are built only from the **old** set.

Store that set as a bitset `reach`, where bit `s` is 1 when sum `s` is reachable. "Add `x` to every reachable sum" is just a left shift, so one element is processed with `reach |= reach << x`, which works on 64 bits per machine word.

### Algorithm

1. Compute `total`. If it is odd, return `false`. Otherwise `target = total / 2`.
2. Start with `reach` having only bit `0` set.
3. For each `x` in `nums`, do `reach |= reach << x`. The right-hand side uses the bitset from before this element, so `x` is taken at most once.
4. Return `reach[target]`.

The bitset has `10001` bits, enough for every possible `target`; sums beyond it are shifted out and do not matter, since they exceed any `target`.

### Walkthrough

Example 1 (`target = 11`). After each element, green cells are the newly reachable sums, orange were reachable before:

![Reachable subset sums for [1,5,11,5] up to 11](/img/codes/partition-equal-subset-sum/reach.gif)

### Complexity

Let `S` be the bitset size (`10001`) and `w = 64` the word size.

- **Time:** $O(n \cdot S / w)$ — one shift and one OR of the bitset per element. (A plain boolean array gives the same algorithm in $O(n \cdot target)$.)
- **Space:** $O(S / w)$ — one bitset.

### Edge cases

- **Odd total** (e.g. Example 2, total `11`): returns `false` immediately.
- **Single element:** the total is that element; if it is even, `target` is half of it but only `0` and `x` are reachable, so the answer is correctly `false`.
- **An element larger than `target`:** shifting by it only produces sums above `target`, so it never helps reach `target`.

## Code

```cpp title="C++"
class Solution {
   public:
    bool canPartition(vector<int>& nums) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        if (total % 2 != 0) return false;
        int target = total / 2;

        bitset<10001> reach;
        reach[0] = 1;
        for (int x : nums) reach |= reach << x;
        return reach[target];
    }
};
```
