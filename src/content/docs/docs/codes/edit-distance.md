---
title: "Edit Distance"
description: "Find the minimum number of insertions, deletions and replacements that turn word1 into word2, using prefix dynamic programming with a rolling row."
source: "https://leetcode.com/problems/edit-distance/"
difficulty: "Medium"
tags: ["String", "Dynamic Programming"]
complexity:
  time: "O(m \\cdot n)"
  space: "O(n)"
---

## Problem

Given two strings `word1` and `word2`, return _the minimum number of operations required to convert `word1` to `word2`_.

You have the following three operations permitted on a word:

- Insert a character
- Delete a character
- Replace a character

**Example 1:**

```text
Input:  word1 = "horse", word2 = "ros"
Output: 3
Explanation:
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')
```

**Example 2:**

```text
Input:  word1 = "intention", word2 = "execution"
Output: 5
Explanation:
intention -> inention (remove 't')
inention -> enention (replace 'i' with 'e')
enention -> exention (replace 'n' with 'x')
exention -> exection (replace 'n' with 'c')
exection -> execution (insert 'u')
```

**Constraints:**

- $0 \le$ `word1.length`, `word2.length` $\le 500$
- `word1` and `word2` consist of lowercase English letters.

## Solution approach

### Intuition

Let `dp[i][j]` be the minimum number of operations to turn the first `i` characters of `word1` into the first `j` characters of `word2`. Look at the **last** characters `word1[i-1]` and `word2[j-1]`. In an optimal edit sequence exactly one of these happens to them:

- they are **equal** and are simply kept: cost `dp[i-1][j-1]`;
- `word1[i-1]` is **replaced** by `word2[j-1]`: cost `dp[i-1][j-1] + 1`;
- `word1[i-1]` is **deleted**: cost `dp[i-1][j] + 1`;
- `word2[j-1]` is **inserted** at the end: cost `dp[i][j-1] + 1`.

So `dp[i][j]` is the minimum of the applicable options, and each depends only on cells above, to the left, or diagonally above-left. The base cases are `dp[i][0] = i` (delete everything) and `dp[0][j] = j` (insert everything).

Row `i` only reads row `i - 1` and the cell to its left, so we keep a single array `dp` over `j` plus one saved value `diag` (the old `dp[j-1]` from the previous row) instead of the full table.

### Algorithm

1. Let `m = word1.size()`, `n = word2.size()`. Initialise `dp[j] = j` for `j = 0..n` (row `0`).
2. For each `i` from `1` to `m`:
   - set `diag = dp[0]` (old `dp[i-1][0]`) and `dp[0] = i`;
   - for each `j` from `1` to `n`: save `up = dp[j]` (old `dp[i-1][j]`). If `word1[i-1] == word2[j-1]`, the new `dp[j] = diag`; otherwise `dp[j] = 1 + min({diag, up, dp[j-1]})` (replace, delete, insert). Then set `diag = up` for the next column.
3. Return `dp[n]`.

### Walkthrough

The full table for Example 1 (`word1` down the side, `word2` across the top), filled row by row. The rolling array holds just the latest row:

![Edit distance table for horse and ros](/img/codes/edit-distance/table.gif)

### Complexity

- **Time:** $O(m \cdot n)$ — one constant-time update per cell, at most $501 \times 501$ cells.
- **Space:** $O(n)$ — one row of `n + 1` integers.

### Edge cases

- **One or both words empty:** the loops over the empty word do not run and the base row/column gives the length of the other word (or `0`).
- **Equal characters:** taking `diag` without considering the other options is safe, because keeping a matching last character is never worse than editing it.

## Code

```cpp title="C++"
class Solution {
   public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        vector<int> dp(n + 1);
        iota(dp.begin(), dp.end(), 0);  // row 0: insert j characters

        for (int i = 1; i <= m; i++) {
            int diag = dp[0];  // dp[i-1][j-1]
            dp[0] = i;         // delete i characters
            for (int j = 1; j <= n; j++) {
                int up = dp[j];  // dp[i-1][j]
                if (word1[i - 1] == word2[j - 1])
                    dp[j] = diag;
                else
                    dp[j] = 1 + min({diag, up, dp[j - 1]});
                diag = up;
            }
        }
        return dp[n];
    }
};
```
