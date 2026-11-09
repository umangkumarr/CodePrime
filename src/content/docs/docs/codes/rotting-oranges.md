---
title: "Rotting Oranges"
description: "Find the minutes until every orange in a grid has rotted, or -1 if some never can, using a multi-source BFS that starts from all rotten oranges at once."
source: "https://leetcode.com/problems/rotting-oranges/"
difficulty: "Medium"
tags: ["Array", "Breadth-First Search", "Matrix"]
complexity:
  time: "O(m \\cdot n)"
  space: "O(m \\cdot n)"
---

## Problem

You are given an `m x n` `grid` where each cell can have one of three values:

- `0` representing an empty cell,
- `1` representing a fresh orange, or
- `2` representing a rotten orange.

Every minute, any fresh orange that is **4-directionally adjacent** to a rotten orange becomes rotten.

Return *the minimum number of minutes that must elapse until no cell has a fresh orange*. If *this is impossible, return* `-1`.

**Example 1:**

![A 3 x 3 grid of oranges rotting over minutes 0 to 4](https://assets.leetcode.com/uploads/2019/02/16/oranges.png)

```text
Input:  grid = [[2,1,1],[1,1,0],[0,1,1]]
Output: 4
```

**Example 2:**

```text
Input:  grid = [[2,1,1],[0,1,1],[1,0,1]]
Output: -1
Explanation: The orange in the bottom left corner (row 2, column 0) is never rotten, because rotting only happens 4-directionally.
```

**Example 3:**

```text
Input:  grid = [[0,2]]
Output: 0
Explanation: Since there are already no fresh oranges at minute 0, the answer is just 0.
```

**Constraints:**

- `m == grid.length`
- `n == grid[i].length`
- $1 \le m, n \le 10$
- `grid[i][j]` is `0`, `1`, or `2`.

## Solution approach

### Intuition

Rot spreads exactly like a breadth-first search: everything rotten at minute `t` infects its fresh neighbours at minute `t + 1`. A fresh orange therefore rots at a time equal to its shortest distance (through oranges) to the **nearest** rotten orange.

Running a separate search from each rotten orange would repeat work. Instead, put **all** initially rotten oranges in the queue at once — a *multi-source* BFS. The queue then processes cells in non-decreasing order of rotting time, so the first time a fresh orange is reached is the earliest it can rot, and it never needs to be visited again. Processing the queue one level at a time makes each level exactly one minute.

If any fresh orange is still left when the queue empties, it is cut off from every rotten orange and the answer is `-1`.

### Algorithm

1. Scan the grid: push every rotten cell into the queue `q`, and count the fresh cells in `fresh`.
2. Set `minutes = 0`. While `q` is not empty and `fresh > 0`:
   - Increment `minutes`.
   - Pop exactly the `q.size()` cells that were in the queue at the start of this minute. For each of its four neighbours that is inside the grid and fresh, set it to `2`, decrement `fresh`, and push it.
3. Return `fresh == 0 ? minutes : -1`.

Marking a cell rotten (`grid[x][y] = 2`) when it is pushed doubles as the "visited" mark, so each cell enters the queue at most once.

### Walkthrough

Example 1, one frame per minute. Orange cells rotted during that minute; red cells are rotten; green cells are still fresh:

![Multi-source BFS on [[2,1,1],[1,1,0],[0,1,1]]](/img/codes/rotting-oranges/bfs.gif)

### Complexity

- **Time:** $O(m \cdot n)$ — every cell is scanned once and pushed and popped at most once, with four neighbour checks each.
- **Space:** $O(m \cdot n)$ — the queue can hold a large fraction of the grid.

### Edge cases

- **No fresh oranges** (Example 3): `fresh == 0`, the loop never runs, and the answer is `0` — even if there are no rotten oranges at all.
- **Fresh oranges but no rotten ones:** the queue starts empty, so the loop never runs and `fresh > 0` gives `-1`.
- **Unreachable fresh orange** (Example 2): BFS ends with `fresh > 0`, so `-1`.
- The loop also stops as soon as `fresh` reaches `0`, so the last level does not add an extra minute.

## Code

```cpp
class Solution {
   public:
    int orangesRotting(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size(), fresh = 0;
        queue<pair<int, int>> q;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) q.push({i, j});
                else if (grid[i][j] == 1) fresh++;
            }

        const int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        int minutes = 0;
        while (!q.empty() && fresh > 0) {
            minutes++;
            for (int sz = q.size(); sz > 0; sz--) {
                auto [r, c] = q.front();
                q.pop();
                for (int d = 0; d < 4; d++) {
                    int x = r + dr[d], y = c + dc[d];
                    if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] != 1) continue;
                    grid[x][y] = 2;
                    fresh--;
                    q.push({x, y});
                }
            }
        }
        return fresh == 0 ? minutes : -1;
    }
};
```

```java
class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length, fresh = 0;
        ArrayDeque<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) q.offer(new int[] {i, j});
                else if (grid[i][j] == 1) fresh++;
            }

        int[] dr = {1, -1, 0, 0}, dc = {0, 0, 1, -1};
        int minutes = 0;
        while (!q.isEmpty() && fresh > 0) {
            minutes++;
            for (int sz = q.size(); sz > 0; sz--) {
                int[] cell = q.poll();
                for (int d = 0; d < 4; d++) {
                    int x = cell[0] + dr[d], y = cell[1] + dc[d];
                    if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] != 1) continue;
                    grid[x][y] = 2;
                    fresh--;
                    q.offer(new int[] {x, y});
                }
            }
        }
        return fresh == 0 ? minutes : -1;
    }
}
```

```python
from collections import deque


class Solution:
    def orangesRotting(self, grid: list[list[int]]) -> int:
        m, n = len(grid), len(grid[0])
        q = deque()
        fresh = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 2:
                    q.append((i, j))
                elif grid[i][j] == 1:
                    fresh += 1

        minutes = 0
        while q and fresh > 0:
            minutes += 1
            for _ in range(len(q)):
                r, c = q.popleft()
                for x, y in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= x < m and 0 <= y < n and grid[x][y] == 1:
                        grid[x][y] = 2
                        fresh -= 1
                        q.append((x, y))
        return minutes if fresh == 0 else -1
```
