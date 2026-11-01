---
title: "Rotting Oranges"
description: "You are given an m x n grid where each cell can have one of three values: 0 representing an empty cell, 1 representing a fresh orange, or 2 representing a…"
source: "https://leetcode.com/problems/rotting-oranges/"
tags: ["Array", "Breadth-First Search", "Matrix"]
complexity:
  time: "O(k \\cdot 3^{n \\cdot m})"
  space: "O(n \\cdot m)"
---

## Problem

<p>You are given an <code>m x n</code> <code>grid</code> where each cell can have one of three values:</p>

<ul>
	<li><code>0</code> representing an empty cell,</li>
	<li><code>1</code> representing a fresh orange, or</li>
	<li><code>2</code> representing a rotten orange.</li>
</ul>

<p>Every minute, any fresh orange that is <strong>4-directionally adjacent</strong> to a rotten orange becomes rotten.</p>

<p>Return <em>the minimum number of minutes that must elapse until no cell has a fresh orange</em>. If <em>this is impossible, return</em> <code>-1</code>.</p>

<p>&nbsp;</p>
<p><strong>Example 1:</strong></p>
<img alt="" src="https://assets.leetcode.com/uploads/2019/02/16/oranges.png" style={ {width: "650px", height: "137px"} } /> <br/>
<pre>
<strong>Input:</strong> grid = [[2,1,1],[1,1,0],[0,1,1]] <br/>
<strong>Output:</strong> 4 <br/>
</pre>

## Solution approach

### Intuition

The time a fresh orange rots is its shortest distance, moving through fresh oranges, to the nearest rotten one. This code finds those distances with a depth-first search started from **each** rotten orange. It keeps the best time found so far for each cell in `ans`, and revisits a cell when a new path reaches it no later than the stored time. The answer is the largest time over all oranges, or `-1` if some orange is never reached.

### Algorithm

1. Initialise `ans` to `INT_MAX` everywhere, and keep `vis1` as an all-unvisited template.
2. For every rotten cell `(i, j)`, reset `vis = vis1` and call `dfs(i, j, 0)`.
3. In `dfs`, stop if the cell was already visited in this search and `ans[i][j] < time`. Otherwise mark it visited, set `ans[i][j] = min(ans[i][j], time)`, and recurse into each in-grid neighbour that is fresh (`g[x][y] == 1`) with `time + 1`.
4. Finally, scan every non-empty cell. If any still has `INT_MAX` it was never reached, so return `-1`; otherwise return the largest `ans` value.

### Complexity

- **Time:** exponential in the worst case, loosely bounded by $O(k \cdot 3^{n \cdot m})$ for `k` rotten oranges — a cell reached again with an equal or smaller time is explored again, so DFS can follow many different paths through the same cells.
- **Space:** $O(n \cdot m)$ — the grids `g`, `ans`, `vis` and `vis1`, plus a recursion stack up to $n \cdot m$ deep.

### Edge cases

- **No fresh oranges:** every non-empty cell is rotten with time `0`, so the answer is `0`.
- **An isolated fresh orange:** its `ans` stays `INT_MAX`, so the answer is `-1`.

## Code

```cpp title="C++"
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
