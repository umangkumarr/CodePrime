---
title: "Subsets II"
description: "Given an integer array nums that may contain duplicates, return all possible subsets (the power set). The solution set must not contain duplicate subsets.…"
source: "https://leetcode.com/problems/subsets-ii/"
tags: ["Array", "Backtracking", "Bit Manipulation"]
complexity:
  time: "O(n^2 \\cdot 2^n)"
  space: "O(n \\cdot 2^n)"
---

## Problem

<p>Given an integer array <code>nums</code> that may contain duplicates, return <em>all possible subsets (the power set)</em>.</p>

<p>The solution set <strong>must not</strong> contain duplicate subsets. Return the solution in <strong>any order</strong>.</p>

## Solution approach

### Intuition

We can iterate over all possible subsets, using recursion or bitmasking; this code uses bitmasking. Because `nums` may contain duplicates, different masks can produce the same subset in a different order. Sorting each subset gives it a canonical form, and storing the sorted subsets in a `set` removes the duplicates.

### Algorithm

1. Let `end` be $2^n$. For each mask `i` from `0` to `end - 1`, build `arr` from every `nums[j]` whose bit `j` is set in `i`.
2. Sort `arr` and insert it into `store`, a `set` of vectors, which ignores repeats.
3. Copy every vector in `store` into `ans` and return it.

### Complexity

- **Time:** $O(n^2 \cdot 2^n)$ — for each of the $2^n$ masks, building and sorting `arr` costs $O(n \log n)$ and inserting it into the set costs $O(\log 2^n) = O(n)$ comparisons of $O(n)$ each.
- **Space:** $O(n \cdot 2^n)$ — the set and the output store up to $2^n$ subsets of size up to $n$.

### Edge cases

- **All elements equal**, such as `[2, 2, 2]`: many masks collapse to the same subset, and the set keeps only one copy of each length.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        int n = nums.size();
        int end = pow(2, n);

        set<vector<int>> store;
        for (int i = 0; i < end; i++) {
            vector<int> arr;
            for (int j = 0; j < n; j++) {
                int bit = (1 << j) & i;
                if (bit) arr.push_back(nums[j]);
            }
            sort(arr.begin(), arr.end());
            store.insert(arr);
        }
        vector<vector<int>> ans;
        for (auto i : store) ans.push_back(i);
        return ans;
    }
};

```
