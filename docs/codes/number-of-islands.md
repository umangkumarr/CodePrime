---
sidebar_position : 20
tags: [Array, Depth-First Search, Breadth-First Search, Union Find, Matrix]
---

# Number of Islands

## [Problem](https://leetcode.com/problems/number-of-islands/)

<p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>&#39;1&#39;</code>s (land) and <code>&#39;0&#39;</code>s (water), return <em>the number of islands</em>.</p>

<p>An <strong>island</strong> is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.</p>

## Solution Approach

Use DFS to find the number of disjoint components present in the matrix.

Expected Time complexity: $O(n*m)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    vector<vector<char>> g;
    int m, n;

   public:
    void dfs(int i, int j) {
        if (i >= n || j >= m || j < 0 || i < 0) return;
        if (g[i][j] == '2' || g[i][j] == '0') return;
        g[i][j] = '2';
        int dx[] = {-1, 1, 0, 0};
        int dy[] = {0, 0, 1, -1};
        for (int k = 0; k < 4; k++) {
            dfs(i + dx[k], j + dy[k]);
        }
    }

    int numIslands(vector<vector<char>>& grid) {
        this->g = grid;
        n = grid.size();
        m = grid[0].size();
        int ans = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (g[i][j] == '1') {
                    ans++;
                    dfs(i, j);
                }
            }
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
