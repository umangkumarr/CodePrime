---
sidebar_position : 1
tags: [Array, Dynamic Programming, Matrix]
---

# Minimum Path Sum

## [Problem](https://leetcode.com/problems/minimum-path-sum/)

<p>Given a <code>m x n</code> <code>grid</code> filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.</p>

<p><strong>Note:</strong> You can only move either down or right at any point in time.</p>

<p>&nbsp;</p>


## Solution Approach

Expected Time complexity: $O(n*m)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int minPathSum(vector<vector<int>>& grid) {
        int ans = 0;
        int n = grid.size(), m = grid[0].size();
        int cost[n][m];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) cost[i][j] = INT_MAX;
        }

        cost[0][0] = grid[0][0];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (i == 0 && j == 0) continue;
                if (i > 0)
                    cost[i][j] = min(cost[i][j], cost[i - 1][j] + grid[i][j]);
                if (j > 0)
                    cost[i][j] = min(cost[i][j], cost[i][j - 1] + grid[i][j]);
            }
        }
        return cost[n - 1][m - 1];
    }
};
```
</TabItem>
</Tabs>

</details>
