---
title: "Sudoku Solver"
description: "Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all of the following rules: Each of the digits 1-9…"
source: "https://leetcode.com/problems/sudoku-solver/"
tags: ["Array", "Backtracking", "Matrix"]
complexity:
  time: "O(9^m)"
  space: "O(1)"
---

## Problem

<p>Write a program to solve a Sudoku puzzle by filling the empty cells.</p>

<p>A sudoku solution must satisfy <strong>all of the following rules</strong>:</p>

<ol>
	<li>Each of the digits <code>1-9</code> must occur exactly once in each row.</li>
	<li>Each of the digits <code>1-9</code> must occur exactly once in each column.</li>
	<li>Each of the digits <code>1-9</code> must occur exactly once in each of the 9 <code>3x3</code> sub-boxes of the grid.</li>
</ol>

<p>The <code>&#39;.&#39;</code> character indicates empty cells.</p>

## Solution approach

### Intuition

Use backtracking: try every possible digit in each empty cell, and keep a choice only if the rest of the board can still be completed. A digit is allowed in a cell only if it does not already appear in the same row, column or 3x3 box, which prunes most branches early. The first complete assignment found is a valid solution.

### Algorithm

1. `solveSudoku(board, i, j)` walks the cells in row-major order. If `i == 9`, every row is filled, so return `true`. If `j == 9`, move on to row `i + 1`.
2. If `board[i][j]` is already filled, recurse on the next cell.
3. Otherwise try each character `c` from `'1'` to `'9'`. If `check(board, i, j, c)` passes, place `c` and recurse on the next cell; return `true` if that succeeds.
4. If the recursion fails, reset the cell to `'.'` (backtrack) and try the next digit. Return `false` if no digit works.
5. `check` scans column `j`, row `i`, and the 3x3 box starting at `(i - i % 3, j - j % 3)` for `val`.

### Complexity

- **Time:** $O(9^m)$ — where $m$ is the number of empty cells; each may try up to 9 digits, and each `check` costs $O(27)$, a constant.
- **Space:** $O(1)$ — the recursion stack is at most 81 frames deep for a fixed 9x9 board.

## Code

```cpp title="C++"
class Solution {
   public:
    bool check(vector<vector<char>>& board, int i, int j, char val) {
        int row = i - i % 3, col = j - j % 3;
        for (int k = 0; k < 9; k++)
            if (board[k][j] == val) return false;
        for (int k = 0; k < 9; k++)
            if (board[i][k] == val) return false;
        for (int x = 0; x < 3; x++) {
            for (int y = 0; y < 3; y++) {
                if (board[x + row][y + col] == val) return false;
            }
        }
        return true;
    }

    bool solveSudoku(vector<vector<char>>& board, int i = 0, int j = 0) {
        if (i == 9) return true;
        if (j == 9) return solveSudoku(board, i + 1, 0);
        if (board[i][j] != '.') return solveSudoku(board, i, j + 1);

        for (char c = '1'; c <= '9'; c++) {
            if (check(board, i, j, c)) {
                board[i][j] = c;
                if (solveSudoku(board, i, j + 1)) return true;
                board[i][j] = '.';
            }
        }
        return false;
    }
};

```
