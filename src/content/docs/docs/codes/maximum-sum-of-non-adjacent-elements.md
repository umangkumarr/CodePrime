---
title: "Maximum sum of non-adjacent elements"
description: "You are given an array/list of ‘N’ integers. You are supposed to return the maximum sum of the subsequence with the constraint that no two elements are…"
source: "https://www.codingninjas.com/codestudio/problems/maximum-sum-of-non-adjacent-elements_843261?source=youtube&campaign=striver_dp_videos&utm_source=youtube&utm_medium=affiliate&utm_campaign=striver_dp_videos"
tags: ["Dynamic Programming"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

You are given an array/list of ‘N’ integers. You are supposed to return the maximum sum of the subsequence with the constraint that no two elements are adjacent in the given array/list.

## Solution approach

### Intuition

At each index there are two states: the best sum if `nums[i]` is taken, and the best sum if it is skipped. If `nums[i]` is taken, the previous element must have been skipped. If it is skipped, the previous element can be in either state. So each state depends only on the two states of the previous index.

Trying every subset is exponential; this DP looks at each element once.

### Algorithm

1. If `n == 1`, return `nums[0]`.
2. Use `ans[i].f` for "take `nums[i]`" and `ans[i].s` for "skip `nums[i]`". Initialise `ans[0].f = nums[0]`, `ans[1].f = nums[1]` and `ans[1].s = nums[0]`.
3. For `i` from `2`, set `ans[i].f = nums[i] + ans[i - 1].s` and `ans[i].s = max(ans[i - 1].f, ans[i - 1].s)`.
4. Return `max(ans[n - 1].f, ans[n - 1].s)`.

### Complexity

- **Time:** $O(n)$ — one pass over the array.
- **Space:** $O(n)$ — the `ans` array of pairs.

## Code

```cpp title="C++"
#define f first
#define s second

int maximumNonAdjacentSum(vector<int> &nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    vector<pair<int, int>> ans(n);
    ans[0].f = nums[0];
    ans[1].f = nums[1];
    ans[1].s = nums[0];
    for (int i = 2; i < n; i++) {

        // ans[i].f represent the maximum sum if take ith element in subsequence
        ans[i].f = nums[i] + ans[i - 1].s;

        // ans[i].s represent the maximum sum if not take ith element in subsequence
        ans[i].s = max(ans[i - 1].f, ans[i - 1].s);
    }
    return max(ans[n - 1].f, ans[n - 1].s);
}
```
