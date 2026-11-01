---
title: "Subsets"
description: "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return…"
source: "https://leetcode.com/problems/subsets/"
tags: ["Array", "Backtracking", "Bit Manipulation"]
complexity:
  time: "O(n^2 \\cdot 2^n)"
  space: "O(n \\cdot 2^n)"
---

## Problem

<p>Given an integer array <code>nums</code> of <strong>unique</strong> elements, return <em>all possible subsets (the power set)</em>.</p>

<p>The solution set <strong>must not</strong> contain duplicate subsets. Return the solution in <strong>any order</strong>.</p>

## Solution approach

### Intuition

Every integer `i` from `0` to $2^n - 1$ is a bitmask describing one subset: bit `j` set means `nums[j]` is included. Enumerating all masks therefore enumerates all subsets. The code also sorts each subset and stores it in a `set`, which removes any duplicate subsets; with distinct elements this step does not change the result, it just keeps the output in sorted order.

### Algorithm

1. For each mask `i` from `0` to `(1ll << nums.size()) - 1`, build `subset` from every `nums[j]` whose bit `j` is set.
2. Sort `subset` and insert it into the set `st`.
3. Construct `ans` from the contents of `st` and return it.

### Complexity

- **Time:** $O(n^2 \cdot 2^n)$ — for each of the $2^n$ masks, building and sorting the subset costs $O(n \log n)$ and inserting it into the set costs $O(n)$ comparisons of $O(n)$ each.
- **Space:** $O(n \cdot 2^n)$ — the set and the output hold $2^n$ subsets of size up to $n$.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<vector<int>> subsets(vector<int>& nums) {
        set<vector<int>> st;
        for (int i = 0; i < (1ll << nums.size()); i++) {
            vector<int> subset;
            for (int j = 0; j < nums.size(); j++) {
                int bit = (1ll << j) & i;
                if (bit) subset.push_back(nums[j]);
            }
            sort(subset.begin(), subset.end());
            st.insert(subset);
        }
        vector<vector<int>> ans(st.begin(), st.end());
        return ans;
    }
};

```
