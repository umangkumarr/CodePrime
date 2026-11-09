---
title: "Coin Change"
description: "Find the fewest coins (unlimited supply of each) that sum to an amount, using a bottom-up unbounded-knapsack DP over every amount from 0 up."
source: "https://leetcode.com/problems/coin-change/"
difficulty: "Medium"
tags: ["Array", "Dynamic Programming", "Breadth-First Search", "Knapsack Problem", "Complete Knapsack"]
complexity:
  time: "O(A \\cdot k)"
  space: "O(A)"
---

## Problem

You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.

Return the **fewest** number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.

You may assume that you have an infinite number of each kind of coin.

**Example 1:**

```text
Input:  coins = [1,2,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1
```

**Example 2:**

```text
Input:  coins = [2], amount = 3
Output: -1
```

**Example 3:**

```text
Input:  coins = [1], amount = 0
Output: 0
```

**Constraints:**

- $1 \le$ `coins.length` $\le 12$
- $1 \le$ `coins[i]` $\le 2^{31} - 1$
- $0 \le$ `amount` $\le 10^4$

## Solution approach

### Intuition

Greedy (always take the largest coin that fits) is wrong in general: with `coins = [1, 3, 4]` and `amount = 6`, greedy takes `4 + 1 + 1` (3 coins) while `3 + 3` needs only 2.

Instead, think about the **last** coin of an optimal way to make amount `i`. If that coin is `c`, the remaining coins must be an optimal way to make `i - c` — otherwise we could swap in a better one. We do not know `c`, so we try every coin:

$$
dp[i] = 1 + \min_{c \,\in\, coins,\ c \le i} dp[i - c], \qquad dp[0] = 0.
$$

Every `dp[i - c]` refers to a smaller amount, so filling the table from `0` upwards means each value is ready before it is needed. Because a coin can be used again (`i - c` may itself use `c`), this is the "unbounded" knapsack.

### Algorithm

1. Let `INF = amount + 1` — no real answer can use more than `amount` coins (the smallest coin is `1`), so `INF` safely means "unreachable".
2. Create `dp` of size `amount + 1` filled with `INF`, and set `dp[0] = 0`.
3. For every `i` from `1` to `amount`, and every `coin` in `coins` with `coin <= i`, set `dp[i] = min(dp[i], dp[i - coin] + 1)`.
4. Return `-1` if `dp[amount]` is still `INF`, otherwise `dp[amount]`.

### Walkthrough

Example 1 (`coins = [1, 2, 5]`, `amount = 11`). Blue is the cell being filled, orange are the cells `i - coin` it reads:

![DP table for coin change filling amounts 0 to 11 with coins 1, 2, 5](/img/codes/coin-change/dp-table.gif)

### Complexity

- **Time:** $O(A \cdot k)$ — for each of the $A$ = `amount` values, every one of the $k$ = `coins.length` coins is tried once.
- **Space:** $O(A)$ — the `dp` table.

### Edge cases

- **`amount == 0`:** `dp[0] = 0` is returned (Example 3).
- **Unreachable amount:** no transition ever lowers `dp[amount]` below `INF`, so `-1` is returned (Example 2).
- **Huge coins (up to $2^{31} - 1$):** the check `coin <= i` skips them, and `i - coin` is only computed when it is non-negative, so nothing overflows; `dp[i - coin] + 1` is at most `amount + 2`.

## Code

```cpp title="C++"
class Solution {
   public:
    int coinChange(vector<int>& coins, int amount) {
        const int INF = amount + 1;
        vector<int> dp(amount + 1, INF);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] == INF ? -1 : dp[amount];
    }
};
```
