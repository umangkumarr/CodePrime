---
title: "Ones and Zeroes"
description: "Find the largest subset of binary strings using at most m zeros and n ones, solved as a 0/1 knapsack with two capacities on a rolling 2D DP table."
source: "https://leetcode.com/problems/ones-and-zeroes/"
difficulty: "Medium"
tags: ["Array", "String", "Dynamic Programming", "Knapsack Problem", "0-1 Knapsack"]
complexity:
  time: "O(L + k \\cdot m \\cdot n)"
  space: "O(m \\cdot n)"
---

## Problem

You are given an array of binary strings `strs` and two integers `m` and `n`.

Return *the size of the largest subset of `strs` such that there are **at most** `m` `0`'s and `n` `1`'s in the subset*.

A set `x` is a **subset** of a set `y` if all elements of `x` are also elements of `y`.

**Example 1:**

```text
Input:  strs = ["10","0001","111001","1","0"], m = 5, n = 3
Output: 4
Explanation: The largest subset with at most 5 0's and 3 1's is {"10", "0001", "1", "0"}, so the answer is 4.
Other valid but smaller subsets include {"0001", "1"} and {"10", "1", "0"}.
{"111001"} is an invalid subset because it contains 4 1's, greater than the maximum of 3.
```

**Example 2:**

```text
Input:  strs = ["10","0","1"], m = 1, n = 1
Output: 2
Explanation: The largest subset is {"0", "1"}, so the answer is 2.
```

**Constraints:**

- $1 \le$ `strs.length` $\le 600$
- $1 \le$ `strs[i].length` $\le 100$
- `strs[i]` consists only of digits `'0'` and `'1'`.
- $1 \le m, n \le 100$

## Solution approach

### Intuition

Only two numbers matter about a string: how many zeros it has and how many ones. So each string is an **item** with a two-dimensional "weight" `(zeros, ones)` and a value of `1`, and we must pick items without exceeding the capacity `(m, n)` — a 0/1 knapsack with two capacities.

Let `dp[i][j]` be the largest number of strings, among those processed so far, that fit into at most `i` zeros and `j` ones. When a new string with `zeros` and `ones` arrives, for every capacity we either skip it (`dp[i][j]` unchanged) or take it, which leaves `(i - zeros, j - ones)` for the earlier strings:

$$dp[i][j] = \max\big(dp[i][j],\ dp[i - zeros][j - ones] + 1\big)$$

Instead of a 3D table (strings × zeros × ones) we update one 2D table in place. Iterating `i` and `j` **downwards** is the key: `dp[i - zeros][j - ones]` is a smaller cell that has not been updated for the current string yet, so it still describes the previous strings only, and each string is taken at most once. (Iterating upwards would let a string be reused, which is the unbounded knapsack.)

### Algorithm

1. Create an `(m + 1) x (n + 1)` table `dp` filled with `0` — with no strings, every capacity holds zero strings.
2. For each string `s` in `strs`, count `ones` and set `zeros = s.size() - ones`.
3. For `i` from `m` down to `zeros`, and `j` from `n` down to `ones`, set `dp[i][j] = max(dp[i][j], dp[i - zeros][j - ones] + 1)`.
4. Return `dp[m][n]`.

### Walkthrough

Example 1 (`m = 5` rows of zeros, `n = 3` columns of ones). After each string, the green cells are the capacities whose best count improved:

![The dp table for Example 1 updated string by string](/img/codes/ones-and-zeroes/dp.gif)

### Complexity

Let `k` be the number of strings and `L` their total length.

- **Time:** $O(L + k \cdot m \cdot n)$ — counting characters costs $L$; each string sweeps the table once.
- **Space:** $O(m \cdot n)$ — one table reused for every string.

### Edge cases

- **A string that alone exceeds the budget** (like `"111001"` in Example 1): its loop ranges are empty because `zeros > m` or `ones > n`, so it is never chosen.
- **Strings of only one digit** (`"0"`, `"1"`): `zeros` or `ones` is `0`, and the loops still run correctly down to `0`.

## Code

```cpp
class Solution {
   public:
    int findMaxForm(vector<string>& strs, int m, int n) {
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        for (const string& s : strs) {
            int ones = count(s.begin(), s.end(), '1');
            int zeros = (int)s.size() - ones;
            for (int i = m; i >= zeros; i--) {
                for (int j = n; j >= ones; j--) {
                    dp[i][j] = max(dp[i][j], dp[i - zeros][j - ones] + 1);
                }
            }
        }
        return dp[m][n];
    }
};
```

```java
class Solution {
    public int findMaxForm(String[] strs, int m, int n) {
        int[][] dp = new int[m + 1][n + 1];
        for (String s : strs) {
            int ones = 0;
            for (int k = 0; k < s.length(); k++) {
                if (s.charAt(k) == '1') ones++;
            }
            int zeros = s.length() - ones;
            for (int i = m; i >= zeros; i--) {
                for (int j = n; j >= ones; j--) {
                    dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);
                }
            }
        }
        return dp[m][n];
    }
}
```

```python
class Solution:
    def findMaxForm(self, strs: list[str], m: int, n: int) -> int:
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for s in strs:
            ones = s.count('1')
            zeros = len(s) - ones
            for i in range(m, zeros - 1, -1):
                row, prev = dp[i], dp[i - zeros]
                for j in range(n, ones - 1, -1):
                    if prev[j - ones] + 1 > row[j]:
                        row[j] = prev[j - ones] + 1
        return dp[m][n]
```
