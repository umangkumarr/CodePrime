---
title: "Best Time to Buy and Sell Stock"
description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to…"
source: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
tags: ["Array", "Dynamic Programming"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>ith</code> day.</p>

<p>You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.</p>

<p>Return <em>the maximum profit you can achieve from this transaction</em>. If you cannot achieve any profit, return <code>0</code>.</p>

## Solution approach

### Intuition

We may make at most one transaction. If we buy the stock on day $i$, the best day to sell it is the day after $i$ on which the price is highest. So for every day we only need the **maximum price on the days that follow**, which can be maintained while scanning the array from right to left.

### Algorithm

1. Set `mx = prices[n - 1]` (the highest price seen so far from the right) and `ans = 0`.
2. For `i` from `n - 2` down to `0`:
   - update `ans` with `mx - prices[i]`, the profit from buying on day `i`;
   - update `mx` with `prices[i]`.
3. Return `ans`. It stays `0` if prices only fall, which means not trading.

### Complexity

- **Time:** $O(n)$ — a single backward pass.
- **Space:** $O(n)$ — the vector `dp` is allocated but never used; the logic itself needs only $O(1)$.

### Edge cases

- **Falling prices:** every `mx - prices[i]` is at most `0`, so the answer is `0`.

## Code

```cpp title="C++"
class Solution {
   public:
    int maxProfit(vector<int>& prices) {
        int n = prices.size();
        vector<int> dp(n);
        dp[n - 1] = 0;
        int mx = prices[n - 1];
        int ans = 0;
        for (int i = n - 2; i >= 0; i--) {
            ans = max(ans, mx - prices[i]);
            mx = max(mx, prices[i]);
        }
        return ans;
    }
};

```
