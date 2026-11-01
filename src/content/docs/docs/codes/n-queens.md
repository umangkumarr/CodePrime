---
title: "N-Queens"
description: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all…"
source: "https://leetcode.com/problems/n-queens/"
tags: ["Array", "Backtracking"]
complexity:
  time: "O(n \\cdot n!)"
  space: "O(n^2)"
---

## Problem

<p>The <strong>n-queens</strong> puzzle is the problem of placing <code>n</code> queens on an <code>n x n</code> chessboard such that no two queens attack each other.</p>

<p>Given an integer <code>n</code>, return <em>all distinct solutions to the <strong>n-queens puzzle</strong></em>. You may return the answer in <strong>any order</strong>.</p>

<p>Each solution contains a distinct board configuration of the n-queens&#39; placement, where <code>&#39;Q&#39;</code> and <code>&#39;.&#39;</code> both indicate a queen and an empty space, respectively.</p>

## Solution approach

### Intuition

Use backtracking to try every possible placement of the queens on the board, keeping only the valid ones. Each row must hold exactly one queen, so we place them row by row. The grid `occup` counts how many placed queens attack each square: a square with count `'0'` is safe. When a queen is placed, every square it attacks is incremented. When it is removed during backtracking, the same squares are decremented, so overlapping attacks from different queens are handled correctly.

### Algorithm

1. `solveNQueens` fills `states` with `'.'` and `occup` with `'0'`, then calls `compute(0)`.
2. `compute(queens)` places a queen in row `queens`. If `queens == n`, every row is filled, so the current `states` is pushed into `ans`.
3. For each column `i` where `occup[queens][i] == '0'`, increment every square in the same row, the same column and the four diagonal directions, plus the square itself, and set `states[queens][i] = 'Q'`.
4. Recurse with `compute(queens + 1)`, then undo every increment and reset the square to `'.'`.

### Complexity

- **Time:** $O(n \cdot n!)$ — at most `n` choices in the first row, `n - 1` in the next and so on, and each placement or removal updates $O(n)$ squares.
- **Space:** $O(n^2)$ — the `occup` and `states` grids, plus an $O(n)$ recursion stack (not counting the output).

## Code

```cpp title="C++"
class Solution {
    vector<vector<string>> ans;
    vector<string> occup;
    vector<string> states;
    int n;

   public:
    void compute(int queens) {
        if (queens == n) {
            ans.push_back(states);
            return;
        }

        for (int i = 0; i < n; i++) {
            if (occup[queens][i] == '0') {
                for (int j = 0; j < n; j++) {
                    if (j != i) occup[queens][j] += 1;
                }
                for (int j = 0; j < n; j++) {
                    if (j != queens) occup[j][i] += 1;
                }
                int j = i - 1, k = queens - 1;
                while (j >= 0 && k >= 0) occup[k--][j--] += 1;
                j = i + 1, k = queens - 1;
                while (j < n && k >= 0) occup[k--][j++] += 1;
                j = i - 1, k = queens + 1;
                while (j >= 0 && k < n) occup[k++][j--] += 1;
                j = i + 1, k = queens + 1;
                while (j < n && k < n) occup[k++][j++] += 1;
                occup[queens][i] += 1;
                states[queens][i] = 'Q';
                compute(queens + 1);
                occup[queens][i] -= 1;
                states[queens][i] = '.';
                for (int j = 0; j < n; j++) {
                    if (j != i) occup[queens][j] -= 1;
                }
                for (int j = 0; j < n; j++) {
                    if (j != queens) occup[j][i] -= 1;
                }
                j = i - 1, k = queens - 1;
                while (j >= 0 && k >= 0) occup[k--][j--] -= 1;
                j = i + 1, k = queens - 1;
                while (j < n && k >= 0) occup[k--][j++] -= 1;
                j = i - 1, k = queens + 1;
                while (j >= 0 && k < n) occup[k++][j--] -= 1;
                j = i + 1, k = queens + 1;
                while (j < n && k < n) occup[k++][j++] -= 1;
            }
        }
    }

    vector<vector<string>> solveNQueens(int n) {
        this->n = n;
        states.assign(n, string(n, '.'));
        occup.assign(n, string(n, '0'));
        compute(0);
        return ans;
    }
};

```
