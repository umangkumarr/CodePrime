---
title: "Longest Common Subsequence"
description: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0. A subsequence of a…"
source: "https://leetcode.com/problems/longest-common-subsequence/"
tags: ["String", "Dynamic Programming"]
complexity:
  time: "O(n \\cdot m)"
  space: "O(n \\cdot m)"
---

## Problem

<p>Given two strings <code>text1</code> and <code>text2</code>, return <em>the length of their longest <strong>common subsequence</strong>. </em>If there is no <strong>common subsequence</strong>, return <code>0</code>.</p>

<p>A <strong>subsequence</strong> of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.</p>

<ul>
	<li>For example, <code>&quot;ace&quot;</code> is a subsequence of <code>&quot;abcde&quot;</code>.</li>
</ul>

<p>A <strong>common subsequence</strong> of two strings is a subsequence that is common to both strings.</p>

## Solution approach

### Intuition

Let `dp[i][j]` be the LCS length of the first `i` characters of `text1` and the first `j` characters of `text2`. If the last characters match, they can end a common subsequence, giving `dp[i - 1][j - 1] + 1`. Either way, we can also drop the last character of one string, giving `dp[i - 1][j]` or `dp[i][j - 1]`. Trying all subsequences directly would be exponential, but there are only $n \cdot m$ distinct prefix pairs.

### Algorithm

1. Create `dp` of size `(n + 1) x (m + 1)`, filled with `0`; row `0` and column `0` represent empty prefixes.
2. For each `i` from `1` to `n` and `j` from `1` to `m`:
   - if `text1[i - 1] == text2[j - 1]`, set `dp[i][j] = dp[i - 1][j - 1] + 1`;
   - then take the maximum with `dp[i - 1][j]` and `dp[i][j - 1]`.
3. Return `dp[n][m]`.

### Complexity

- **Time:** $O(n \cdot m)$ — one constant-time update per cell.
- **Space:** $O(n \cdot m)$ — the full `dp` table.

## Code

```cpp title="C++"
class Solution {
   public:
    int longestCommonSubsequence(string text1, string text2) {
        int n = text1.size();
        int m = text2.size();

        vector<vector<int>> dp(n + 1, vector<int>(m + 1));
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                }
                dp[i][j] = max(dp[i][j], dp[i - 1][j]);
                dp[i][j] = max(dp[i][j], dp[i][j - 1]);
            }
        }
        return dp[n][m];
    }
};

```
