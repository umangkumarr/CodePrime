---
title: "Permutations"
description: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order."
source: "https://leetcode.com/problems/permutations/"
tags: ["Array", "Backtracking"]
complexity:
  time: "O(n \\cdot n!)"
  space: "O(n)"
---

## Problem

<p>Given an array <code>nums</code> of distinct integers, return <em>all the possible permutations</em>. You can return the answer in <strong>any order</strong>.</p>

## Solution approach

### Intuition

A permutation is built by fixing each position in turn. For position `begin`, any of the remaining elements `num[begin..]` can go there. Swap that element into place, generate every permutation of the remaining suffix recursively, then swap it back so the array is restored for the next choice. This produces each permutation exactly once without needing a separate "used" array.

### Algorithm

1. `permute` calls `permuteRecursive(num, 0, result)`.
2. In `permuteRecursive`, if `begin >= num.size()` every position is fixed, so push a copy of `num` into `result`.
3. Otherwise, for each `i` from `begin` to the end:
   - `swap(num[begin], num[i])` to place `num[i]` at position `begin`.
   - Recurse with `begin + 1`.
   - Swap back to undo the choice (backtrack).
4. Return `result`.

### Complexity

- **Time:** $O(n \cdot n!)$ — there are $n!$ permutations, and copying each one into `result` costs $O(n)$.
- **Space:** $O(n)$ for the recursion stack, not counting the $O(n \cdot n!)$ output.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<vector<int> > permute(vector<int> &num) {
        vector<vector<int> > result;

        permuteRecursive(num, 0, result);
        return result;
    }

    void permuteRecursive(vector<int> &num, int begin,
                          vector<vector<int>> &result) {
        if (begin >= num.size()) {
            result.push_back(num);
            return;
        }

        for (int i = begin; i < num.size(); i++) {
            swap(num[begin], num[i]);
            permuteRecursive(num, begin + 1, result);
            swap(num[begin], num[i]);
        }
    }
};

```
