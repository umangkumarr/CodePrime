---
title: "Longest Subarray Zero Sum"
description: "Given an array having both positive and negative integers. The task is to compute the length of the largest subarray with sum 0. Example 1: Input: N = 8…"
source: "https://practice.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1"
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given an array having both positive and negative integers. The task is to compute the length of the largest subarray with sum 0.

Example 1:

<code>
<strong>Input: </strong>

N = 8
A[] = {15,-2,2,-8,1,7,10,23}
<strong>Output:</strong> 5 <br />
<strong>Explanation:</strong> 
The largest subarray withsum 0 will be -2 2 -8 1 7.
</code>
<strong>Your Task:</strong><br />
You just have to complete the function maxLen() which takes two arguments an array A and n, where n is the size of the array A and returns the length of the largest subarray with 0 sum.

## Solution approach

### Intuition

Let `sm` be the prefix sum up to index `i`. If the same prefix sum appeared earlier at index `p`, the elements between `p + 1` and `i` add up to zero. To make that subarray as long as possible, we keep only the **first** index at which each prefix sum appears. Checking every subarray directly would be $O(n^2)$.

### Algorithm

1. Create the hash map `mp` from prefix sum to its first index, seeded with `mp[0] = -1` so that a zero-sum prefix starting at index `0` is counted.
2. For each `i`, add `arr[i]` to `sm`.
3. If `sm` is already in `mp`, update `ans` with `i - mp[sm]`; otherwise store `mp[sm] = i`.
4. Return `ans`.

### Complexity

- **Time:** $O(n)$ — one pass with average $O(1)$ hash-map operations.
- **Space:** $O(n)$ — up to `n + 1` distinct prefix sums in `mp`.

### Edge cases

- **Whole array sums to zero:** the `mp[0] = -1` seed gives length `n`.
- **No zero-sum subarray:** `ans` stays `0`.

## Code

```cpp title="C++"
#include <bits/stdc++.h>
int LongestSubsetWithZeroSum(vector<int> arr) {
    int ans = 0, sm = 0;
    int n = arr.size();
    unordered_map<int, int> mp;
    mp[0] = -1;
    for (int i = 0; i < n; i++) {
        sm += arr[i];
        if (mp.find(sm) != mp.end()) {
            ans = max(ans, i - mp[sm]);
        } else {
            mp[sm] = i;
        }
    }
    return ans;
}
```
