---
title: "Partition Equal Subset Sum"
description: "Given a non-empty array nums containing only positive integers, find if the array can be partitioned into two subsets such that the sum of elements in…"
source: "https://leetcode.com/problems/partition-equal-subset-sum/"
tags: ["Array", "Dynamic Programming"]
complexity:
  time: "O(n \\cdot sm)"
  space: "O(n \\cdot sm)"
---

## Problem

<p>Given a <strong>non-empty</strong> array <code>nums</code> containing <strong>only positive integers</strong>, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.</p>

## Solution approach

### Intuition

The array can be split into two equal-sum parts only if the total `sm` is even, and then one part must sum to exactly `sm / 2`. This becomes a 0/1 knapsack: with capacity `sm / 2`, where each number has weight and value equal to itself, find the largest subset sum that fits. If that largest sum equals the capacity, a valid subset exists. Trying all $2^n$ subsets would be far too slow.

### Algorithm

1. Compute the total `sm`. If it is odd return `false`; otherwise set `sm /= 2`.
2. Sort `nums` and build a table `knap` of size `(n + 1) x (sm + 1)`, where `knap[i][j]` is the largest subset sum not exceeding `j` using the first `i` numbers.
3. For each `i` and `j`:
   - If `nums[i - 1] > j`, the number cannot fit, so take the better of `knap[i - 1][j]` and `knap[i][j - 1]`.
   - Otherwise take the maximum of including it (`knap[i - 1][j - nums[i - 1]] + nums[i - 1]`), excluding it (`knap[i - 1][j]`) and `knap[i][j - 1]`.
4. Return whether `knap[n][sm] == sm`.

### Complexity

- **Time:** $O(n \cdot sm)$ — each cell of the table is filled in $O(1)$, where `sm` is half the total; sorting adds $O(n \log n)$.
- **Space:** $O(n \cdot sm)$ — the full 2D `knap` table.

## Code

```cpp title="C++"
class Solution {
   public:
    bool canPartition(vector<int>& nums) {
        int n = nums.size();
        int sm = 0;
        for (int i = 0; i < n; i++) sm += nums[i];
        if (sm % 2) return 0;
        sm /= 2;

        sort(nums.begin(), nums.end());
        vector<vector<int>> knap(nums.size() + 1, vector<int>(sm + 1));

        for (int i = 1; i <= nums.size(); i++) {
            for (int j = 1; j <= sm; j++) {
                if (nums[i - 1] > j) {
                    knap[i][j] = max(knap[i - 1][j], knap[i][j - 1]);
                    continue;
                }
                knap[i][j] =
                    max(knap[i][j], knap[i - 1][j - nums[i - 1]] + nums[i - 1]);
                knap[i][j] = max(knap[i][j], knap[i - 1][j]);
                knap[i][j] = max(knap[i][j], knap[i][j - 1]);
            }
        }

        return knap[nums.size()][sm] == sm;
    }
};

```
