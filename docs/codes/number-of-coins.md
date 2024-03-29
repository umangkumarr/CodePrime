---
sidebar_position : 5
tags: [Array, Dynamic Programming, Sorting]
---

# Number of Coins

## [Problem](https://practice.geeksforgeeks.org/problems/number-of-coins1824/1/)

<p><span>Given a value <strong>V</strong> and array <strong>coins[]</strong> of size <strong>M</strong>, the task is to make the change for <strong>V</strong> cents, given that you have an infinite supply of each of coins - coins<sub>1</sub>, coins<sub>2</sub>, ..., coins<sub>m</sub> valued coins. Find the minimum number of coins to make the change. If not possible to make change then return -1.</span></p>

## Solution Approach
Relation for minimum no. of coins from the first i coins that sums to j is given by:

if we take the ith coin: $dp[i][j] = min(dp[i][j], dp[i][j - coins[i - 1]] + 1)$

if we dont take the ith coin: $dp[i][j] = min(dp[i][j], dp[i - 1][j])$

Expected Time complexity: $O(n^2)$


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
