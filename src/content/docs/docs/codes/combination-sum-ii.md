---
title: "Combination Sum II"
description: "Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers…"
source: "https://leetcode.com/problems/combination-sum-ii/"
tags: ["Array", "Backtracking"]
complexity:
  time: "O(2^n \\cdot n)"
  space: "O(n)"
---

## Problem

<p>Given a collection of candidate numbers (<code>candidates</code>) and a target number (<code>target</code>), find all unique combinations in <code>candidates</code>&nbsp;where the candidate numbers sum to <code>target</code>.</p>

<p>Each number in <code>candidates</code>&nbsp;may only be used <strong>once</strong> in the combination.</p>

<p><strong>Note:</strong>&nbsp;The solution set must not contain duplicate combinations.</p>

## Solution approach

### Intuition

Each number may be used at most once, and the answer must not contain duplicate combinations even if the input has duplicate numbers. Sorting `num` solves both concerns during backtracking:

- at each recursion level we choose the **next** number of the combination; skipping a value equal to the previous one at the same level avoids building the same combination twice;
- since the array is sorted, once `num[i]` exceeds the remaining `target`, every later number does too, so the loop can stop.

### Algorithm

1. Sort `num` and call `findCombination(res, 0, target, local, num)`.
2. If `target == 0`, the current combination `local` is complete: add it to `res`.
3. Otherwise, for `i` from `order` to the end:
   - return if `num[i] > target`;
   - skip `num[i]` if `i > order` and `num[i] == num[i - 1]` (duplicate choice at this level);
   - push `num[i]` into `local`, recurse with `i + 1` and `target - num[i]`, then pop it.

### Complexity

- **Time:** $O(2^n \cdot n)$ — in the worst case every subset is explored, and copying a finished combination costs $O(n)$.
- **Space:** $O(n)$ — for the recursion stack and `local`, not counting the output.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<vector<int>> combinationSum2(vector<int>& num, int target) {
        vector<vector<int>> res;
        sort(num.begin(), num.end());
        vector<int> local;
        findCombination(res, 0, target, local, num);
        return res;
    }
    void findCombination(vector<vector<int>>& res, const int order,
                         const int target, vector<int>& local,
                         const vector<int>& num) {
        if (target == 0) {
            res.push_back(local);
            return;
        } else {
            for (int i = order; i < num.size(); i++) {
                if (num[i] > target) return;
                if (i && num[i] == num[i - 1] && i > order) continue;
                local.push_back(num[i]),
                    findCombination(res, i + 1, target - num[i], local, num);
                local.pop_back();
            }
        }
    }
};

```
