---
title: "Number of Coins"
description: "Given a value V and array coins[] of size M, the task is to make the change for V cents, given that you have an infinite supply of each of coins - coins1,…"
source: "https://practice.geeksforgeeks.org/problems/number-of-coins1824/1/"
tags: ["Array", "Dynamic Programming", "Sorting"]
complexity:
  time: "O(M \\cdot V)"
  space: "O(M \\cdot V)"
---

## Problem

<p><span>Given a value <strong>V</strong> and array <strong>coins[]</strong> of size <strong>M</strong>, the task is to make the change for <strong>V</strong> cents, given that you have an infinite supply of each of coins - coins<sub>1</sub>, coins<sub>2</sub>, ..., coins<sub>m</sub> valued coins. Find the minimum number of coins to make the change. If not possible to make change then return -1.</span></p>

## Solution approach

### Intuition

This is an unbounded knapsack: every coin can be used any number of times, and we want the fewest coins whose values add up to `V`. Let `dp[i][j]` be the minimum number of coins, using only the first `i` coin types, that sum to exactly `j`. Trying every combination of coins directly is exponential, but each state depends only on two smaller states.

For the `i`-th coin there are two choices:

- **Take it** (it stays available, since coins are unlimited): $dp[i][j] = \min(dp[i][j],\ dp[i][j - coins[i-1]] + 1)$
- **Skip it**: $dp[i][j] = \min(dp[i][j],\ dp[i-1][j])$

### Algorithm

1. Sort `coins` (not needed for correctness) and create a `(M + 1) x (V + 1)` table `dp` filled with `INT_MAX`, meaning "not reachable". It uses `long long` so that `INT_MAX + 1` does not overflow.
2. For each coin index `i` from `1` to `M`, set `dp[i][0] = 0`, since zero coins make sum `0`.
3. For each sum `j` from `1` to `V`, apply the "take" transition when `coins[i - 1] <= j`, then the "skip" transition.
4. If `dp[M][V]` is still at least `INT_MAX`, the sum cannot be formed, so return `-1`; otherwise return `dp[M][V]`.

### Complexity

- **Time:** $O(M \cdot V)$ — every cell of the `dp` table is filled once in $O(1)$; sorting adds only $O(M \log M)$.
- **Space:** $O(M \cdot V)$ — the full 2D `dp` table.

### Edge cases

- **Unreachable value**, e.g. `coins = [2]`, `V = 3`: the cell stays at `INT_MAX` and the function returns `-1`.

## Code

```cpp title="C++"
class Solution {
   public:
    int minCoins(int coins[], int M, int V) {
        sort(coins, coins + M);
        vector<vector<long long>> dp(M + 1, vector<long long>(V + 1, INT_MAX));
        for (int i = 1; i <= M; i++) {
            dp[i][0] = 0;
            for (int j = 1; j <= V; j++) {
                if (coins[i - 1] <= j) {
                    dp[i][j] = min(dp[i][j], dp[i][j - coins[i - 1]] + 1);
                }
                dp[i][j] = min(dp[i][j], dp[i - 1][j]);
            }
        }
        if (dp[M][V] >= INT_MAX) return -1;
        return (int)dp[M][V];
    }
};
```
