---
sidebar_position : 3
tags: [Array, Backtracking, Matrix]
---

# Sudoku Solver

## Problem Link
https://leetcode.com/problems/sudoku-solver/

## Solution Approach
Use Backtracking and find all the possible states of sudoku board and pick the valid one accordingly.

Expected Time complexity: $O(9^9)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
