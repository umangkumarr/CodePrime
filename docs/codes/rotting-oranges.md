---
sidebar_position : 82
tags: [Array, Breadth-First Search, Matrix]
---

# Rotting Oranges

## [Problem](https://leetcode.com/problems/rotting-oranges/)

<p>You are given an <code>m x n</code> <code>grid</code> where each cell can have one of three values:</p>

<ul>
	<li><code>0</code> representing an empty cell,</li>
	<li><code>1</code> representing a fresh orange, or</li>
	<li><code>2</code> representing a rotten orange.</li>
</ul>

<p>Every minute, any fresh orange that is <strong>4-directionally adjacent</strong> to a rotten orange becomes rotten.</p>

<p>Return <em>the minimum number of minutes that must elapse until no cell has a fresh orange</em>. If <em>this is impossible, return</em> <code>-1</code>.</p>

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
