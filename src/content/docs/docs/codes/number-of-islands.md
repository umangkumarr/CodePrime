---
title: "Number of Islands"
description: "Count the islands of horizontally or vertically connected land cells in a binary grid by flood-filling each island with breadth-first search."
source: "https://leetcode.com/problems/number-of-islands/"
difficulty: "Medium"
tags: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"]
complexity:
  time: "O(m \\cdot n)"
  space: "O(m \\cdot n)"
---

## Problem

Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return *the number of islands*.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

**Example 1:**

```text
Input:  grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
```

**Example 2:**

```text
Input:  grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
```

**Constraints:**

- `m == grid.length`
- `n == grid[i].length`
- $1 \le m, n \le 300$
- `grid[i][j]` is `'0'` or `'1'`.

## Solution approach

### Intuition

Think of the land cells as nodes of a graph, with an edge between land cells that share a side. An island is then exactly one **connected component**, so the task is to count components.

Scan the grid. The first time we meet a land cell that has not been visited, we have found a new island: count it, then flood-fill from it and mark every land cell reachable from it. All of those cells belong to the same island, so the scan will never count them again. Each new count therefore corresponds to exactly one island.

We mark visited land by overwriting it with `'0'` ("sinking" it), which needs no extra visited array. A breadth-first flood fill is used rather than recursion: on a `300 x 300` all-land grid a recursive DFS would go 90 000 calls deep, while the BFS queue only holds the current frontier of the fill (about $\min(m, n)$ cells on a full grid).

### Algorithm

1. For every cell `(i, j)` in row-major order, if `grid[i][j] == '1'`:
   - increment `islands`;
   - set `grid[i][j] = '0'` and push it onto queue `q`;
   - while `q` is not empty, pop `(r, c)` and, for each of the four neighbours `(nr, nc)` that lies inside the grid and is `'1'`, set it to `'0'` and push it.
2. Return `islands`.

Cells are sunk **when pushed**, not when popped, so no cell enters the queue twice.

### Walkthrough

Example 2. Blue is the island currently being flood-filled, green is land already sunk:

![Flood fill counting the three islands of Example 2](/img/codes/number-of-islands/flood-fill/01.webp)

### Complexity

- **Time:** $O(m \cdot n)$ — every cell is scanned once, and every land cell is pushed and popped once, checking four neighbours.
- **Space:** $O(m \cdot n)$ in the worst case for the BFS queue, though it only ever holds the frontier of the current fill (about $\min(m, n)$ cells for a full grid). The grid is modified in place, so there is no visited array.

### Edge cases

- **No land:** the scan never starts a fill and returns `0`.
- **All land:** one fill sinks everything and the answer is `1`; the iterative BFS avoids the stack overflow a deep recursion could cause.
- **Diagonal neighbours** (Example 2, cells `(2,2)` and `(3,3)`): only the four side neighbours are explored, so they count as separate islands.

## Code

```cpp
class Solution {
   public:
    int numIslands(vector<vector<char>>& grid) {
        int m = grid.size(), n = grid[0].size();
        const int dr[] = {-1, 1, 0, 0};
        const int dc[] = {0, 0, -1, 1};
        int islands = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] != '1') continue;
                islands++;
                grid[i][j] = '0';
                queue<pair<int, int>> q;
                q.push({i, j});
                while (!q.empty()) {
                    auto [r, c] = q.front();
                    q.pop();
                    for (int k = 0; k < 4; k++) {
                        int nr = r + dr[k], nc = c + dc[k];
                        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == '1') {
                            grid[nr][nc] = '0';
                            q.push({nr, nc});
                        }
                    }
                }
            }
        }
        return islands;
    }
};
```

```java
class Solution {
    public int numIslands(char[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        int islands = 0;
        ArrayDeque<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] != '1') continue;
                islands++;
                grid[i][j] = '0';
                q.add(new int[] {i, j});
                while (!q.isEmpty()) {
                    int[] cell = q.poll();
                    for (int k = 0; k < 4; k++) {
                        int nr = cell[0] + dr[k], nc = cell[1] + dc[k];
                        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == '1') {
                            grid[nr][nc] = '0';
                            q.add(new int[] {nr, nc});
                        }
                    }
                }
            }
        }
        return islands;
    }
}
```

```python
from collections import deque


class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        m, n = len(grid), len(grid[0])
        islands = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] != '1':
                    continue
                islands += 1
                grid[i][j] = '0'
                q = deque([(i, j)])
                while q:
                    r, c = q.popleft()
                    for nr, nc in ((r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)):
                        if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == '1':
                            grid[nr][nc] = '0'
                            q.append((nr, nc))
        return islands
```
