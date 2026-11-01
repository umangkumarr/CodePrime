---
title: "Combination Sum"
description: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen…"
source: "https://leetcode.com/problems/combination-sum/"
tags: ["Array", "Backtracking"]
complexity:
  time: "O\\left(\\prod_i (T / c_i + 1)\\right)"
  space: "O(n + T / c_m)"
---

## Problem

<p>Given an array of <strong>distinct</strong> integers <code>candidates</code> and a target integer <code>target</code>, return <em>a list of all <strong>unique combinations</strong> of </em><code>candidates</code><em> where the chosen numbers sum to </em><code>target</code><em>.</em> You may return the combinations in <strong>any order</strong>.</p>

<p>The <strong>same</strong> number may be chosen from <code>candidates</code> an <strong>unlimited number of times</strong>. Two combinations are unique if the frequency of at least one of the chosen numbers is different.</p>

<p>It is <strong>guaranteed</strong> that the number of unique combinations that sum up to <code>target</code> is less than <code>150</code> combinations for the given input.</p>

## Solution approach

### Intuition

Each candidate can be used any number of times, so for every candidate we decide **how many copies** to take: zero, one, two, and so on. The recursion handles one candidate per level (`indx`), which also means combinations are built in a fixed order and no duplicates appear.

A branch stops as soon as the running sum `sm` reaches `target` (record it) or goes past it (abandon it).

### Algorithm

1. Store `candidates` in `comb`, set `sm = 0`, and call `find(0)`.
2. In `find(indx)`:
   - if `sm == target`, push the current list `arr` into `ans` and return;
   - if `sm > target` or `indx >= n`, return.
3. Call `find(indx + 1)` to take **zero** copies of `comb[indx]`.
4. Then repeatedly push one more copy of `comb[indx]` into `arr`, add it to `sm`, and call `find(indx + 1)`. This is done `target / comb[indx]` times, the most copies that could ever fit.
5. Pop the same number of copies and subtract them from `sm` to restore the state before returning.

### Complexity

- **Time:** $O\left(\prod_i (T / c_i + 1)\right)$ in the worst case — each candidate $c_i$ branches into up to $T / c_i + 1$ choices of count, where $T$ is `target`. Branches that overshoot return immediately, so the real cost is far smaller, but it is exponential in $n$.
- **Space:** $O(n + T / c_m)$ — the recursion depth is at most $n$ and `arr` holds at most $T / c_m$ values, where $c_m$ is the smallest candidate, not counting the output.

## Code

```cpp title="C++"
class Solution {
    int target;
    vector<int> comb;
    vector<int> arr;
    vector<vector<int>> ans;
    int sm, n;

   public:
    void find(int indx) {
        if (sm == target) {
            ans.push_back(arr);
            return;
        }
        if (sm > target || indx >= n) return;
        find(indx + 1);

        for (int i = 1; i <= target / comb[indx]; i++) {
            arr.push_back(comb[indx]);
            sm += comb[indx];
            find(indx + 1);
        }

        for (int i = 1; i <= target / comb[indx]; i++) {
            arr.pop_back();
            sm -= comb[indx];
        }
    }

    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        this->comb = candidates;
        this->target = target;
        this->n = candidates.size();
        this->sm = 0;
        find(0);
        return ans;
    }
};

```
