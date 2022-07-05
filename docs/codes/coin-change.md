---
displayed_sidebar: null
sidebar_position : 172
tags: [Array, Dynamic Programming, Breadth-First Search]
---

# Coin Change

## [Problem](https://leetcode.com/problems/coin-change/)

<p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.</p>

<p>Return <em>the fewest number of coins that you need to make up that amount</em>. If that amount of money cannot be made up by any combination of the coins, return <code>-1</code>.</p>

<p>You may assume that you have an infinite number of each kind of coin.</p>

## Solution Approach

Expected Time complexity: $O(n^2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
