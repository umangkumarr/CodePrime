---
title: "Rat in a Maze Problem I"
description: "List, in lexicographic order, every path a rat can take through open cells from the top-left to the bottom-right of a maze, using backtracking."
source: "https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1"
difficulty: "Medium"
tags: ["Backtracking"]
complexity:
  time: "O(3^{n^2})"
  space: "O(n^2)"
---

## Problem

Given a square binary matrix `maze[][]` containing values `0` and `1`, find all possible paths for a rat to travel from the top-left cell to the bottom-right cell. The rat can move in four directions: up (`U`), down (`D`), left (`L`), and right (`R`).

- `1` represents an open cell through which the rat can move.
- `0` represents a blocked cell that cannot be traversed.

The rat can move only through open cells and cannot visit the same cell more than once in a path. Return all valid paths as strings consisting of `'U'`, `'D'`, `'L'`, and `'R'`, representing the sequence of moves taken by the rat.

**Note:** Return the paths in lexicographically increasing order. If no valid path exists, return an empty list.

Complete the function `ratInMaze()` which takes the matrix `maze` and returns the list of paths.

**Example 1:**

![The two paths through the 4 x 4 maze of Example 1](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/929574/Web/Other/blobid0_1781254127.png)

```text
Input:  maze[][] = [[1, 0, 0, 0], [1, 1, 0, 1], [1, 1, 0, 0], [0, 1, 1, 1]]
Output: ["DDRDRR", "DRDDRR"]
Explanation: There are two valid paths from the source cell (0, 0) to the destination cell (3, 3).
```

**Example 2:**

```text
Input:  maze[][] = [[1, 0], [1, 0]]
Output: []
Explanation: No path exists as the destination cell (1, 1) is blocked.
```

**Constraints:**

- $2 \le n \le 5$, where `n` is the size of the matrix
- $0 \le$ `maze[i][j]` $\le 1$

## Solution approach

### Intuition

We need **every** simple path, so there is no shortcut: we must explore them all, and backtracking explores each one exactly once. From the current cell, try each open, unvisited neighbour, extend the move string, recurse, and then undo the move so the next option starts from the same state.

Two details make it work:

- **No revisits.** Before leaving a cell we mark it blocked (`maze[r][c] = 0`) and restore it to `1` when we backtrack. So a cell is blocked exactly while it is on the current path, which is precisely the "visit each cell at most once per path" rule.
- **Sorted output for free.** Trying the moves in alphabetical order `D`, `L`, `R`, `U` makes the search produce paths in lexicographic order: two paths first differ at some move, and the branch with the smaller letter is explored completely first. No path is a prefix of another (a path stops at the destination), so the order is exactly lexicographic and no sort is needed.

### Algorithm

1. If `maze[0][0]` or `maze[n-1][n-1]` is `0`, return an empty list.
2. `dfs(r, c)`: if `(r, c)` is the destination, append `path` to `result` and return.
3. Otherwise set `maze[r][c] = 0`, and for each move `k` in the order `D`, `L`, `R`, `U` (arrays `dr`, `dc`, `dir`): if the neighbour `(nr, nc)` is inside the grid and `maze[nr][nc] == 1`, push `dir[k]` onto `path`, call `dfs(nr, nc)`, then pop it.
4. After trying all moves, restore `maze[r][c] = 1`.
5. Call `dfs(0, 0)` and return `result`.

### Walkthrough

Example 1. Blue is the current path (blocked while on it), red is a dead end being backtracked from, green is a completed path:

![Backtracking search through the maze of Example 1](/img/codes/rat-in-a-maze-problemi/backtrack.gif)

### Complexity

- **Time:** $O(3^{n^2})$ in the worst case — a path visits at most $n^2$ cells and from each cell at most three directions are new (the cell we came from is blocked). Each recorded path also costs $O(n^2)$ to copy. With $n \le 5$ this is small in practice.
- **Space:** $O(n^2)$ — the recursion depth and `path` length are at most $n^2$, not counting the output. The maze is marked in place and fully restored, so no visited array is needed.

### Edge cases

- **Blocked destination** (Example 2) or **blocked source:** returns an empty list immediately.
- **The input is left unchanged:** every cell marked `0` during the search is set back to `1` before its call returns.

## Code

```cpp title="C++"
class Solution {
    int n;
    string path;
    vector<string> result;
    const int dr[4] = {1, 0, 0, -1};
    const int dc[4] = {0, -1, 1, 0};
    const char dir[4] = {'D', 'L', 'R', 'U'};

    void dfs(vector<vector<int>>& maze, int r, int c) {
        if (r == n - 1 && c == n - 1) {
            result.push_back(path);
            return;
        }
        maze[r][c] = 0;
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && maze[nr][nc] == 1) {
                path.push_back(dir[k]);
                dfs(maze, nr, nc);
                path.pop_back();
            }
        }
        maze[r][c] = 1;
    }

   public:
    vector<string> ratInMaze(vector<vector<int>>& maze) {
        n = maze.size();
        if (maze[0][0] == 0 || maze[n - 1][n - 1] == 0) return {};
        dfs(maze, 0, 0);
        return result;
    }
};
```
