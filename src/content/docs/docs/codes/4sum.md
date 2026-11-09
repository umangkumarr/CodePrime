---
title: "4Sum"
description: "Find all unique quadruplets that sum to a target by sorting, fixing two elements and closing in on the other two with two pointers."
source: "https://leetcode.com/problems/4sum/"
difficulty: "Medium"
tags: ["Array", "Two Pointers", "Sorting"]
complexity:
  time: "O(n^3)"
  space: "O(\\log n)"
---

## Problem

Given an array `nums` of `n` integers, return _an array of all the **unique** quadruplets_ `[nums[a], nums[b], nums[c], nums[d]]` such that:

- `0 <= a, b, c, d < n`
- `a`, `b`, `c`, and `d` are **distinct**.
- `nums[a] + nums[b] + nums[c] + nums[d] == target`

You may return the answer in **any order**.

**Example 1:**

```text
Input:  nums = [1,0,-1,0,-2,2], target = 0
Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
```

**Example 2:**

```text
Input:  nums = [2,2,2,2,2], target = 8
Output: [[2,2,2,2]]
```

**Constraints:**

- $1 \le$ `nums.length` $\le 200$
- $-10^9 \le$ `nums[i]` $\le 10^9$
- $-10^9 \le$ `target` $\le 10^9$

## Solution approach

### Intuition

This is [3Sum](/docs/codes/3sum/) with one more fixed element. After sorting, fix the two smallest elements of the quadruplet, `nums[i]` and `nums[j]`. The remaining two must sum to `target - nums[i] - nums[j]`, and on a sorted suffix that is a two-pointer sweep: `lo` starts just after `j`, `hi` at the end; a sum that is too small can only be fixed by moving `lo` right, a sum that is too big only by moving `hi` left.

Sorting also groups equal values, which removes duplicates without a `set`: a quadruplet is identified by its values, so we skip an `i` (or a `j`) whose value equals the one before it, and after a match we move `lo` past every copy of its value.

Values reach $10^9$ in magnitude, so a sum of four of them (up to $4 \times 10^9$) overflows a 32-bit `int`. All sums are computed in `long long`.

### Algorithm

1. Sort `nums`.
2. For each `i`, skip it if `nums[i] == nums[i - 1]`. For each `j > i`, skip it if `j > i + 1` and `nums[j] == nums[j - 1]`.
3. Set `lo = j + 1`, `hi = n - 1`. While `lo < hi`, compute `sum = (long long)nums[i] + nums[j] + nums[lo] + nums[hi]`:
   - `sum < target`: `lo++`;
   - `sum > target`: `hi--`;
   - otherwise record the quadruplet, move `lo` right and `hi` left, and keep moving `lo` right while `nums[lo] == nums[lo - 1]`.
4. Return the recorded quadruplets.

### Complexity

- **Time:** $O(n^3)$ — $O(n^2)$ pairs `(i, j)`, each followed by a linear two-pointer sweep; sorting adds only $O(n \log n)$.
- **Space:** $O(\log n)$ — the stack space of `std::sort`; the output list is not counted.

### Edge cases

- **All values equal** such as `[2,2,2,2,2]`: `i = 0`, `j = 1` find `[2,2,2,2]` once; every other `i` and `j` is skipped as a duplicate.
- **Overflow** such as `[1000000000,1000000000,1000000000,1000000000]` with `target = -294967296`: the true sum is $4 \times 10^9$, which wraps around to `-294967296` in 32-bit arithmetic. Computing `sum` in `long long` correctly reports no answer.
- **Fewer than four elements:** the loops never reach a valid `lo < hi` and the result is empty.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<vector<int>> fourSum(vector<int>& nums, int target) {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        vector<vector<int>> ans;
        for (int i = 0; i < n; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            for (int j = i + 1; j < n; j++) {
                if (j > i + 1 && nums[j] == nums[j - 1]) continue;
                int lo = j + 1, hi = n - 1;
                while (lo < hi) {
                    long long sum = (long long)nums[i] + nums[j] + nums[lo] + nums[hi];
                    if (sum < target) {
                        lo++;
                    } else if (sum > target) {
                        hi--;
                    } else {
                        ans.push_back({nums[i], nums[j], nums[lo], nums[hi]});
                        lo++, hi--;
                        while (lo < hi && nums[lo] == nums[lo - 1]) lo++;
                    }
                }
            }
        }
        return ans;
    }
};
```
