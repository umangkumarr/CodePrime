---
title: "Best Time to Buy and Sell Stock"
description: "Find the maximum profit from one buy and one later sell in a single pass by tracking the lowest price seen so far."
source: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
difficulty: "Easy"
tags: ["Array", "Dynamic Programming"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return _the maximum profit you can achieve from this transaction_. If you cannot achieve any profit, return `0`.

**Example 1:**

```text
Input:  prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.
```

**Example 2:**

```text
Input:  prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.
```

**Constraints:**

- $1 \le$ `prices.length` $\le 10^5$
- $0 \le$ `prices[i]` $\le 10^4$

## Solution approach

### Intuition

Trying every pair (buy day, sell day) is $O(n^2)$. Look at it from the sell side instead: if we sell on day `i`, the best possible buy day is the **cheapest day before `i`**. So while scanning left to right we only need to remember one number, `minPrice`, the lowest price seen so far. The profit from selling today is `price - minPrice`, and the answer is the best of these over all days.

Updating `minPrice` after computing today's profit is not even necessary for correctness: if today is the new minimum, its profit is `0` (buying and selling on the same day), which never beats `best`.

### Algorithm

1. Set `minPrice = INT_MAX` and `best = 0`.
2. For each `price` in `prices`:
   - `minPrice = min(minPrice, price)`;
   - `best = max(best, price - minPrice)`.
3. Return `best`.

On Example 1, `minPrice` becomes `7`, then `1`, and stays `1`; the profits after that are `4, 2, 5, 3`, so `best = 5` (buy at `1`, sell at `6`).

### Complexity

- **Time:** $O(n)$ — one pass over `prices`.
- **Space:** $O(1)$ — two variables.

### Edge cases

- **Falling prices** (Example 2): every day is a new minimum, every profit is `0`, and the answer is `0`.
- **Single day:** the only profit is `price - price = 0`.

## Code

```cpp title="C++"
class Solution {
   public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX, best = 0;
        for (int price : prices) {
            minPrice = min(minPrice, price);
            best = max(best, price - minPrice);
        }
        return best;
    }
};
```
