---
title: "Longest Subarray Zero Sum"
description: "Find the length of the longest subarray whose sum is 0 in one pass, by remembering the first index of every prefix sum in a hash map."
source: "https://www.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1"
difficulty: "Medium"
tags: ["Array", "Hash Table"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given an array `arr[]` containing both positive and negative integers, the task is to find the length of the longest subarray with a sum equal to `0`.

**Note:** A subarray is a contiguous part of an array, formed by selecting one or more consecutive elements while maintaining their original order.

Complete the function `maxLength()` which takes the array `arr` and returns the length of the longest subarray with sum `0`.

**Example 1:**

```text
Input:  arr[] = [15, -2, 2, -8, 1, 7, 10, 23]
Output: 5
Explanation: The longest subarray with sum equals to 0 is [-2, 2, -8, 1, 7].
```

**Example 2:**

```text
Input:  arr[] = [2, 10, 4]
Output: 0
Explanation: There is no subarray with a sum of 0.
```

**Example 3:**

```text
Input:  arr[] = [1, 0, -4, 3, 1, 0]
Output: 5
Explanation: The longest subarray with sum equals to 0 is [0, -4, 3, 1, 0].
```

**Constraints:**

- $1 \le$ `arr.size()` $\le 10^6$
- $-10^3 \le$ `arr[i]` $\le 10^3$

## Solution approach

### Intuition

Let `sum` be the prefix sum `arr[0] + ... + arr[i]`. The subarray `arr[p+1 .. i]` sums to `prefix(i) - prefix(p)`, so it sums to zero exactly when **the same prefix sum appears at two indices** `p` and `i`. Its length is `i - p`.

For a fixed right end `i`, the longest such subarray uses the **earliest** index `p` with the same prefix sum. So store, for every prefix sum, only the first index where it occurred, and never overwrite it. Treat the empty prefix as having sum `0` at index `-1`, so that a zero-sum subarray starting at index `0` is also found.

Checking every subarray directly would be $O(n^2)$; with the map, each index is handled in $O(1)$ on average.

### Algorithm

1. Create the hash map `firstIdx` from prefix sum to its first index, seeded with `firstIdx[0] = -1`.
2. For each `i`, add `arr[i]` to `sum`.
3. If `sum` is already in `firstIdx`, update `best` with `i - firstIdx[sum]`; otherwise store `firstIdx[sum] = i`.
4. Return `best`.

### Walkthrough

Blue is the current index; green is the zero-sum subarray found, from just after the first occurrence of the same prefix sum up to `i`:

![Prefix sums with first-occurrence map on Example 1](/img/codes/longest-subarray-zero-sum/prefix.gif)

### Complexity

- **Time:** $O(n)$ — one pass with average $O(1)$ hash-map operations.
- **Space:** $O(n)$ — up to `n + 1` distinct prefix sums in `firstIdx`.

### Edge cases

- **Whole array sums to zero:** the seed `firstIdx[0] = -1` gives length `i - (-1) = n`.
- **No zero-sum subarray** (Example 2): every prefix sum is new, so `best` stays `0`.
- **Zeros in the array** (Example 3): a `0` repeats the previous prefix sum, so it is counted as a length-1 zero-sum subarray and can be part of a longer one.
- **Overflow:** the absolute value of `sum` never exceeds $10^6 \cdot 10^3 = 10^9$, which fits in an `int`.

## Code

```cpp title="C++"
class Solution {
   public:
    int maxLength(vector<int>& arr) {
        unordered_map<int, int> firstIdx;  // prefix sum -> first index where it occurred
        firstIdx[0] = -1;
        int sum = 0, best = 0;
        for (int i = 0; i < (int)arr.size(); i++) {
            sum += arr[i];
            auto it = firstIdx.find(sum);
            if (it != firstIdx.end())
                best = max(best, i - it->second);
            else
                firstIdx[sum] = i;
        }
        return best;
    }
};
```
