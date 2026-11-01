---
title: "Coin Change"
description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the…"
source: "https://leetcode.com/problems/coin-change/"
tags: ["Array", "Dynamic Programming", "Breadth-First Search"]
complexity:
  time: "O(A \\cdot k)"
  space: "O(A)"
---

## Problem

<p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.</p>

<p>Return <em>the fewest number of coins that you need to make up that amount</em>. If that amount of money cannot be made up by any combination of the coins, return <code>-1</code>.</p>

<p>You may assume that you have an infinite number of each kind of coin.</p>

## Solution approach

### Intuition

Let `changes[i]` be the fewest coins that make amount `i`. The last coin used for amount `i` is some `coins[j]`, and the rest must be an optimal way to make `i - coins[j]`. So `changes[i]` is one more than the best `changes[i - coins[j]]`. Building the table from `0` upwards means every smaller amount is ready when it is needed.

### Algorithm

1. Create `changes` of size `amount + 1`, filled with `INT_MAX` (unreachable), and set `changes[0] = 0`.
2. For every amount `i` from `1` to `amount`, and every coin `coins[j] <= i`, set `changes[i]` to the minimum of itself and `changes[i - coins[j]] + 1`.
3. If `changes[amount]` is still `INT_MAX`, return `-1`; otherwise return it.

The table uses `long long`, so adding `1` to `INT_MAX` cannot overflow, and an unreachable state stays above `INT_MAX`.

### Complexity

- **Time:** $O(A \cdot k)$ — for each of the $A$ = `amount` values, every one of the $k$ coins is tried.
- **Space:** $O(A)$ — for the `changes` table.

### Edge cases

- **`amount = 0`:** returns `0`, as no coins are needed.

## Code

```cpp title="C++"
class Solution {
   public:
    int coinChange(vector<int>& coins, int amount) {
        vector<long long> changes(amount + 1, INT_MAX);
        changes[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int j = 0; j < coins.size(); j++) {
                if (coins[j] <= i) {
                    changes[i] = min(changes[i], changes[i - coins[j]] + 1);
                }
            }
        }
        if (changes[amount] == INT_MAX) return -1;
        return changes[amount];
    }
};

```
