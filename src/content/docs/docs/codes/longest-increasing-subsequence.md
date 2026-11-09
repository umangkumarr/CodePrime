---
title: "Longest Increasing Subsequence"
description: "Find the length of the longest strictly increasing subsequence in O(n log n) by keeping the smallest tail for each length and binary-searching it."
source: "https://leetcode.com/problems/longest-increasing-subsequence/"
difficulty: "Medium"
tags: ["Array", "Binary Search", "Dynamic Programming"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

Given an integer array `nums`, return *the length of the longest **strictly increasing subsequence***.

A **subsequence** is an array that can be derived from another array by deleting some or no elements without changing the order of the remaining elements.

**Example 1:**

```text
Input:  nums = [10,9,2,5,3,7,101,18]
Output: 4
Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.
```

**Example 2:**

```text
Input:  nums = [0,1,0,3,2,3]
Output: 4
```

**Example 3:**

```text
Input:  nums = [7,7,7,7,7,7,7]
Output: 1
```

**Constraints:**

- $1 \le$ `nums.length` $\le 2500$
- $-10^4 \le$ `nums[i]` $\le 10^4$

**Follow-up:** Can you come up with an algorithm that runs in `O(n log(n))` time complexity?

## Solution approach

### Intuition

The classic DP — `dp[i]` = length of the longest increasing subsequence ending at `i`, computed by checking every `j < i` — is $O(n^2)$. The follow-up asks for $O(n \log n)$.

Instead of remembering *which* subsequences exist, remember only the most useful fact about each length: let `tails[k]` be the **smallest possible last value** of an increasing subsequence of length `k + 1` among the elements seen so far. A smaller tail is always at least as good as a larger one, because it leaves more room for later elements to extend it.

`tails` is strictly increasing: if a subsequence of length `k + 1` ends in `t`, dropping its last element gives a length-`k` subsequence ending in something smaller than `t`. Therefore, for each new value `x`, binary search finds where it belongs:

- if `x` is larger than every tail, it extends the longest subsequence, so append it;
- otherwise, find the first tail `>= x` and replace it with `x`. The subsequence of that length can now end in a smaller value (`x` extends the subsequence one shorter, whose tail is `< x`).

The length of `tails` at the end is the answer. Note that `tails` itself is generally *not* a valid subsequence — only its length is meaningful.

### Algorithm

1. Start with an empty vector `tails`.
2. For each `x` in `nums`, let `it = lower_bound(tails, x)`, the first tail `>= x`.
   - If `it == tails.end()`, push `x` back.
   - Otherwise overwrite `*it = x`.
3. Return `tails.size()`.

Using `lower_bound` (first `>= x`) rather than `upper_bound` is what makes the subsequence **strictly** increasing: an equal value replaces its twin instead of extending past it.

### Walkthrough

The blue cell is the value being placed; the line below shows `tails` after placing it:

![Patience-sorting LIS on [10,9,2,5,3,7,101,18]](/img/codes/longest-increasing-subsequence/tails.gif)

### Complexity

- **Time:** $O(n \log n)$ — one binary search over `tails` (size at most `n`) per element.
- **Space:** $O(n)$ — the `tails` vector in the worst case (a strictly increasing input).

### Edge cases

- **All equal** (Example 3): every `7` finds itself by `lower_bound` and overwrites the single tail, so the answer is `1`.
- **Strictly decreasing input:** every value replaces `tails[0]`; the answer is `1`.
- **Single element:** `tails` gets one value; the answer is `1`.

## Code

```cpp title="C++"
class Solution {
   public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;  // tails[k] = smallest tail of an increasing subsequence of length k + 1
        for (int x : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), x);
            if (it == tails.end())
                tails.push_back(x);
            else
                *it = x;
        }
        return tails.size();
    }
};
```
