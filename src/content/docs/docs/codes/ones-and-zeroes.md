---
title: "Ones and Zeroes"
description: "You are given an array of binary strings strs and two integers m and n. Return the size of the largest subset of strs such that there are at most m 0's…"
source: "https://leetcode.com/problems/ones-and-zeroes/"
tags: ["Array", "String", "Dynamic Programming"]
complexity:
  time: "O(l \\cdot m \\cdot n + L)"
  space: "O(m \\cdot n)"
---

## Problem

<p>You are given an array of binary strings <code>strs</code> and two integers <code>m</code> and <code>n</code>.</p>

<p>Return <em>the size of the largest subset of <code>strs</code> such that there are <strong>at most</strong> </em><code>m</code><em> </em><code>0</code><em>&#39;s and </em><code>n</code><em> </em><code>1</code><em>&#39;s in the subset</em>.</p>

<p>A set <code>x</code> is a <strong>subset</strong> of a set <code>y</code> if all elements of <code>x</code> are also elements of <code>y</code>.</p>

## Solution approach

### Intuition

Each string is an item in a 0/1 knapsack with **two** capacities: the number of zeros it uses and the number of ones it uses. Picking every subset of strings would be exponential, so instead we keep `ans[j][k]`, the largest number of strings we can choose using at most `j` zeros and `k` ones.

When we add a string with `cnt2` zeros and `cnt1` ones, `ans[j][k]` can become `ans[j - cnt2][k - cnt1] + 1`. Looping `j` and `k` **downwards** guarantees that the smaller state still holds its value from before this string, so each string is used at most once.

### Algorithm

1. Create an `(m + 1) x (n + 1)` table `ans` filled with `0`.
2. For each string `i` in `strs`, count its ones `cnt1` and zeros `cnt2 = i.length() - cnt1`.
3. For `j` from `m` down to `cnt2` and `k` from `n` down to `cnt1`, set `ans[j][k] = max(ans[j][k], ans[j - cnt2][k - cnt1] + 1)`.
4. Return `ans[m][n]`.

### Complexity

- **Time:** $O(l \cdot m \cdot n + L)$ — for each of the `l` strings the table is updated once, and counting characters costs $L$, the total length of all strings.
- **Space:** $O(m \cdot n)$ — a single 2D table reused for every string.

## Code

```cpp title="C++"
class Solution {
   public:
    int findMaxForm(vector<string>& strs, int m, int n) {
        int siz = strs.size();

        vector<vector<int>> ans(m + 1, vector<int>(n + 1));

        for (auto i : strs) {
            int cnt1 = 0, cnt2 = 0;
            cnt1 = count(i.begin(), i.end(), '1');
            cnt2 = i.length() - cnt1;

            for (int j = m; j >= cnt2; j--) {
                for (int k = n; k >= cnt1; k--) {
                    ans[j][k] = max(ans[j][k], ans[j - cnt2][k - cnt1] + 1);
                }
            }
        }
        return ans[m][n];
    }
};

```
