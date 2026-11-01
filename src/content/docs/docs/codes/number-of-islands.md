---
title: "Number of Islands"
description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water…"
source: "https://leetcode.com/problems/number-of-islands/"
tags: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"]
complexity:
  time: "O(n \\cdot m)"
  space: "O(n \\cdot m)"
---

## Problem

<p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>&#39;1&#39;</code>s (land) and <code>&#39;0&#39;</code>s (water), return <em>the number of islands</em>.</p>

<p>An <strong>island</strong> is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.</p>

## Solution approach

### Intuition

An island is a group of `'1'` cells joined horizontally or vertically. If we start a depth-first search from any land cell and "sink" every land cell we can reach, we have consumed exactly one island. So the number of islands equals the number of times we have to start a new DFS.

### Algorithm

1. Copy `grid` into the member `g` and store its dimensions in `n` (rows) and `m` (columns).
2. Scan every cell. When `g[i][j] == '1'`, increment `ans` and call `dfs(i, j)`.
3. `dfs` returns immediately if the cell is outside the grid, is water (`'0'`) or is already visited (`'2'`). Otherwise it marks the cell as `'2'` and recurses into the four neighbours given by the `dx` / `dy` arrays.
4. Return `ans` once the scan finishes.

### Complexity

- **Time:** $O(n \cdot m)$ — each cell is marked at most once, and each marked cell checks four neighbours.
- **Space:** $O(n \cdot m)$ — the copy `g` of the grid, plus a recursion stack that can reach $O(n \cdot m)$ depth when the whole grid is land.

## Code

```cpp title="C++"
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
