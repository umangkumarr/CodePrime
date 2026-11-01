---
title: "Rat in a Maze Problem I"
description: "Consider a rat placed at (0, 0) in a square matrix of order N N. It has to reach the destination at (N - 1, N - 1). Find all possible paths that the rat…"
source: "https://practice.geeksforgeeks.org/problems/rat-in-a-maze-problem/1"
tags: ["Array", "Backtracking"]
complexity:
  time: "O(3^{n^2})"
  space: "O(n^2)"
---

## Problem

<p><span>Consider a rat placed at <strong>(0, 0)</strong> in a square matrix<strong> </strong>of order <strong>N * N</strong>. It has to reach the destination at <strong>(N - 1, N - 1)</strong>. Find all possible paths that the rat can take to reach from source to destination. The directions in which the rat can move are <strong>'U'(up)</strong>, <strong>'D'(down)</strong>, <strong>'L' (left)</strong>, <strong>'R' (right)</strong>. Value 0 at a cell in the matrix represents that it is blocked and rat cannot move to it while value 1 at a cell in the matrix represents that&nbsp;rat&nbsp;can be travel&nbsp;through it.<br/>
<strong>Note</strong>: In a path, no cell can be visited more than one time.</span>&nbsp;<span>If the source cell is&nbsp;0, the rat cannot move to any other cell.</span></p>

## Solution approach

### Intuition

We need every path from `(0, 0)` to `(N - 1, N - 1)` that never visits a cell twice, so backtracking is the natural fit. From the current cell, try each open neighbour, recurse, and then undo the move. Blocking the current cell before moving away stops a path from coming back through it.

### Algorithm

1. Copy the input into `maze`, store `n`, and start `compute(0, 0)` only if the source cell is open.
2. In `compute(i, j)`, if `(i, j)` is the destination, push the move string `s` into `ans` and return.
3. Otherwise try the four moves in the order `'U'`, `'L'`, `'D'`, `'R'`. For each one whose target is inside the grid and open:
   - Set `maze[i][j] = 0` to block the current cell, and append the move letter to `s`.
   - Recurse into the neighbour.
   - Pop the letter and set `maze[i][j] = 1` to backtrack.
4. Return `ans`.

### Complexity

- **Time:** $O(3^{n^2})$ in the worst case — a path can cover up to $n^2$ cells, and from each cell at most three directions are new, since the one we came from is blocked.
- **Space:** $O(n^2)$ — the copy of `maze` and a recursion stack (and string `s`) up to $n^2$ deep, not counting the output.

### Edge cases

- **Blocked source**, `m[0][0] == 0`: `compute` is never called, so the answer is empty.
- **Blocked destination:** no move ever enters it, so the answer is empty.

## Code

```cpp title="C++"
class Solution {
    vector<vector<int>> maze;
    vector<string> ans;
    string s;
    int n;

   public:
    void compute(int i, int j) {
        if (i == n - 1 && j == n - 1) {
            ans.push_back(s);
            return;
        }

        if (i > 0 && maze[i - 1][j]) {
            maze[i][j] = 0;
            s.push_back('U');
            compute(i - 1, j);
            s.pop_back();
            maze[i][j] = 1;
        }

        if (j > 0 && maze[i][j - 1]) {
            maze[i][j] = 0;
            s.push_back('L');
            compute(i, j - 1);
            s.pop_back();
            maze[i][j] = 1;
        }

        if (i < n - 1 && maze[i + 1][j]) {
            maze[i][j] = 0;
            s.push_back('D');
            compute(i + 1, j);
            s.pop_back();
            maze[i][j] = 1;
        }

        if (j < n - 1 && maze[i][j + 1]) {
            maze[i][j] = 0;
            s.push_back('R');
            compute(i, j + 1);
            s.pop_back();
            maze[i][j] = 1;
        }
    }

    vector<string> findPath(vector<vector<int>> &m, int n) {
        this->n = n;
        this->maze = m;
        s = "";
        this->n = n;
        if (maze[0][0]) compute(0, 0);
        return ans;
    }
};
```
