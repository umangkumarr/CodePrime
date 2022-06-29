---
sidebar_position : 6
tags: [Array, Dynamic Programming]
---

# Best Time to Buy and Sell Stock

## [Problem](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)

<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>ith</code> day.</p>

<p>You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.</p>

<p>Return <em>the maximum profit you can achieve from this transaction</em>. If you cannot achieve any profit, return <code>0</code>.</p>

<p>&nbsp;</p>


## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
