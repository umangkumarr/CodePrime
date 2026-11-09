---
title: "Longest Common Subsequence"
description: "Compute the length of the longest common subsequence of two strings with a prefix DP table, keeping only two rows for O(min(n, m)) memory."
source: "https://leetcode.com/problems/longest-common-subsequence/"
difficulty: "Medium"
tags: ["String", "Dynamic Programming", "Longest Common Subsequence"]
complexity:
  time: "O(n \\cdot m)"
  space: "O(\\min(n, m))"
---

## Problem

Given two strings `text1` and `text2`, return _the length of their longest **common subsequence**._ If there is no **common subsequence**, return `0`.

A **subsequence** of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

- For example, `"ace"` is a subsequence of `"abcde"`.

A **common subsequence** of two strings is a subsequence that is common to both strings.

**Example 1:**

```text
Input:  text1 = "abcde", text2 = "ace"
Output: 3
Explanation: The longest common subsequence is "ace" and its length is 3.
```

**Example 2:**

```text
Input:  text1 = "abc", text2 = "abc"
Output: 3
Explanation: The longest common subsequence is "abc" and its length is 3.
```

**Example 3:**

```text
Input:  text1 = "abc", text2 = "def"
Output: 0
Explanation: There is no such common subsequence, so the result is 0.
```

**Constraints:**

- $1 \le$ `text1.length`, `text2.length` $\le 1000$
- `text1` and `text2` consist of only lowercase English characters.

## Solution approach

### Intuition

Trying every subsequence of one string is exponential. Instead, solve the problem for **prefixes**: let `dp[i][j]` be the LCS length of the first `i` characters of `text1` and the first `j` characters of `text2`. Empty prefixes give `dp[0][j] = dp[i][0] = 0`. For `i, j >= 1`, look at the last characters `text1[i - 1]` and `text2[j - 1]`:

- **They are equal.** Some LCS of the two prefixes ends by matching these two characters (if an LCS used one of them elsewhere, we could swap that match for this one without changing its length). So `dp[i][j] = dp[i - 1][j - 1] + 1`.
- **They differ.** They cannot both be the last matched pair, so at least one of them is unused: drop it. `dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])`.

The answer is `dp[n][m]`. There are only $n \cdot m$ prefix pairs, each solved in $O(1)$.

**Saving memory.** Row `i` of the table depends only on row `i - 1` (above and diagonal) and on itself (left). So two rows, `prev` and `cur`, are enough. Making the **shorter** string the column dimension keeps them at length `min(n, m) + 1`.

### Algorithm

1. If `text2` is longer than `text1`, swap them so `m = text2.size()` is the smaller length.
2. Create `prev` and `cur` of size `m + 1`, filled with `0` (row `0`).
3. For each `i` from `1` to `n`, and each `j` from `1` to `m`:
   - if `text1[i - 1] == text2[j - 1]`, set `cur[j] = prev[j - 1] + 1`;
   - otherwise set `cur[j] = max(prev[j], cur[j - 1])`.

   Then `swap(prev, cur)`; `prev` now holds row `i`.
4. Return `prev[m]`.

### Walkthrough

Example 1 (`text1 = "abcde"`, `text2 = "ace"`). Each frame fills one row: green cells are matches (`diagonal + 1`), blue cells take `max(up, left)`, and the last frame traces one LCS back from the corner in orange. The full table is drawn for clarity; the code only ever keeps the two most recent rows.

![LCS table for "abcde" and "ace"](/img/codes/longest-common-subsequence/dp-table.gif)

### Complexity

- **Time:** $O(n \cdot m)$ — one constant-time update per table cell.
- **Space:** $O(\min(n, m))$ — two rows over the shorter string.

### Edge cases

- **No common character** (Example 3): every cell takes the `max` branch over zeros and the answer stays `0`.
- **Identical strings** (Example 2): every diagonal cell is a match, giving the full length.
- **`cur[0]`** is never written, so it stays `0` for every row, as the empty-prefix column requires.

## Code

```cpp title="C++"
class Solution {
   public:
    int longestCommonSubsequence(string text1, string text2) {
        if (text2.size() > text1.size()) swap(text1, text2);
        int n = text1.size(), m = text2.size();
        vector<int> prev(m + 1, 0), cur(m + 1, 0);
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    cur[j] = prev[j - 1] + 1;
                } else {
                    cur[j] = max(prev[j], cur[j - 1]);
                }
            }
            swap(prev, cur);
        }
        return prev[m];
    }
};
```
