---
title: "Max Consecutive Ones"
description: "Given a binary array nums, return the maximum number of consecutive 1's in the array."
source: "https://leetcode.com/problems/max-consecutive-ones/"
tags: ["Array"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Given a binary array <code>nums</code>, return <em>the maximum number of consecutive </em><code>1</code><em>&#39;s in the array</em>.</p>

## Solution approach

### Intuition

Scan the array once while keeping the length of the current run of `1`s. A `0` ends the run, so that is the moment to compare it against the best run so far.

### Algorithm

1. Keep `cnt` for the current run and `ans` for the best run.
2. For each `nums[i]`: if it is `1`, increment `cnt`; otherwise update `ans` with `cnt` and reset `cnt = 0`.
3. After the loop, update `ans` with `cnt` once more, in case the array ends in a run of `1`s.
4. Return `ans`.

### Complexity

- **Time:** $O(n)$ — a single pass.
- **Space:** $O(1)$ — two counters.

### Edge cases

- **Array ends with `1`s:** the final `max` after the loop catches that last run.

## Code

```cpp title="C++"
class Solution {
   public:
    int findMaxConsecutiveOnes(vector<int>& nums) {
        int ans = 0, cnt = 0;
        int n = nums.size();
        for (int i = 0; i < n; i++) {
            if (nums[i])
                cnt++;
            else {
                ans = max(ans, cnt);
                cnt = 0;
            }
        }
        ans = max(ans, cnt);
        return ans;
    }
};

```
