---
title: "Edit Distance"
description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations…"
source: "https://leetcode.com/problems/edit-distance/"
tags: ["String", "Dynamic Programming"]
complexity:
  time: "O(n \\cdot m)"
  space: "O(n \\cdot m)"
---

## Problem

<p>Given two strings <code>word1</code> and <code>word2</code>, return <em>the minimum number of operations required to convert <code>word1</code> to <code>word2</code></em>.</p>

<p>You have the following three operations permitted on a word:</p>

<ul>
	<li>Insert a character</li>
	<li>Delete a character</li>
	<li>Replace a character</li>
</ul>

## Solution approach

### Intuition

Let `dp[i][j]` be the minimum number of operations to turn the first `j` characters of `word1` into the first `i` characters of `word2`. Looking at the last characters, there are only a few choices: match them for free if they are equal, replace one with the other, insert a character, or delete one. Each choice reduces the problem to a smaller prefix pair, so the table can be filled in increasing order.

### Algorithm

1. Create `dp` of size `(n + 1) x (m + 1)`, where `n = word2.size()` and `m = word1.size()`.
2. Base cases: `dp[i][0] = i` and `dp[0][j] = j`, since turning a prefix into an empty string (or back) takes one operation per character.
3. For each `i` and `j`, take the minimum of:
   - `dp[i - 1][j] + 1` (insert `word2[i - 1]`),
   - `dp[i][j - 1] + 1` (delete `word1[j - 1]`),
   - `dp[i - 1][j - 1] + 1` (replace),
   - `dp[i - 1][j - 1]` if `word1[j - 1] == word2[i - 1]` (characters already match).
4. Return `dp[n][m]`.

### Complexity

- **Time:** $O(n \cdot m)$ — one constant-time update per cell.
- **Space:** $O(n \cdot m)$ — the full `dp` table.

### Edge cases

- **One empty word:** the answer is the length of the other word, coming straight from the base cases.

## Code

```cpp title="C++"
class Solution {
   public:
    int minDistance(string word1, string word2) {
        int m = word1.size();
        int n = word2.size();
        vector<vector<int>> dp(n + 1, vector<int>(m + 1, INT_MAX));

        for (int i = 0; i <= n; i++) dp[i][0] = i;
        for (int i = 0; i <= m; i++) dp[0][i] = i;

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                dp[i][j] = min(dp[i][j], dp[i - 1][j] + 1);
                if (word1[j - 1] == word2[i - 1])
                    dp[i][j] = min(dp[i][j], dp[i - 1][j - 1]);
                dp[i][j] = min(dp[i][j], dp[i - 1][j - 1] + 1);
                dp[i][j] = min(dp[i][j], dp[i][j - 1] + 1);
            }
        }
        return dp[n][m];
    }
};

```
