---
sidebar_position : 5
---

# Best Time to Buy and Sell Stock

## Problem Link
https://leetcode.com/problems/best-time-to-buy-and-sell-stock/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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