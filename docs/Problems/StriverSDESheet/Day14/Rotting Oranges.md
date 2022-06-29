---
sidebar_position : 7
tags: [Array, DFS, Deque, Stack]
---

# Rotting Oranges

## Problem Link
https://leetcode.com/problems/rotting-oranges/

## Solution Approach

Expected Time complexity: $O(n^n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    deque<pair<int, int>> dq;
    vector<vector<int>> ans, vis, vis1;
    int n, m;
    vector<vector<int>> g;

   public:
    void dfs(int i, int j, int time) {
        if (vis[i][j] == 1 && ans[i][j] < time) return;
        vis[i][j] = 1;
        ans[i][j] = min(ans[i][j], time);

        int dx[] = {1, -1, 0, 0};
        int dy[] = {0, 0, 1, -1};
        for (int k = 0; k < 4; k++) {
            int x = i + dx[k];
            int y = j + dy[k];
            if ((!(x < 0 || x >= n || y < 0 || y >= m)) && g[x][y] == 1) {
                dfs(x, y, time + 1);
            }
        }
    }

    int orangesRotting(vector<vector<int>>& grid) {
        g = grid;
        n = grid.size();
        m = grid[0].size();
        ans.resize(n, vector<int>(m, INT_MAX));
        vis = ans;
        vis1 = vis;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (grid[i][j] == 2) {
                    g = grid;
                    vis = vis1;
                    dfs(i, j, 0);
                }
            }
        }

        int res = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (grid[i][j] != 0) {
                    res = max(res, ans[i][j]);
                    if (res == INT_MAX) return -1;
                }
            }
        }

        return res;
    }
};
```
</TabItem>
</Tabs>

</details>
