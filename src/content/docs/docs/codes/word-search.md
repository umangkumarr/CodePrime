---
title: "Word Search"
description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of…"
source: "https://leetcode.com/problems/word-search/"
tags: ["Array", "Backtracking", "Matrix"]
complexity:
  time: "O(n \\cdot m \\cdot 3^L \\cdot L)"
  space: "O(n \\cdot m + L^2)"
---

## Problem

<p>Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>, return <code>true</code> <em>if</em> <code>word</code> <em>exists in the grid</em>.</p>

<p>The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.</p>

## Solution approach

### Intuition

This is a backtracking problem. Try every cell as the starting point and do a DFS that matches `word` one character at a time, moving to one of the four neighbours at each step. A cell must not be used twice in the same path, so it is temporarily replaced with `'*'` while it is on the path and restored on the way back.

### Algorithm

1. Copy `board` into the member `this->board` and call `search(word, 0, i, j)` for every cell; return `true` if any call succeeds.
2. `search(word, ix, i, j)`: return `false` if `(i, j)` is out of bounds or `board[i][j] != word[ix]`.
3. If `ix` is the last index of `word`, the whole word has been matched, so return `true`.
4. Otherwise save the character in `ch`, mark the cell `'*'`, and try the four neighbours given by `dx` and `dy` with `ix + 1`. Return `true` if any succeeds.
5. Restore the cell to `ch` and return `false`.

### Complexity

- **Time:** $O(n \cdot m \cdot 3^L \cdot L)$ — from each of the $n \cdot m$ cells the DFS follows up to $3^L$ paths (the cell it came from is marked), and `word` is passed by value, costing $O(L)$ per call.
- **Space:** $O(n \cdot m + L^2)$ — the board copy, plus a recursion stack $L$ deep where each frame holds a copy of `word`.

### Edge cases

- **Negative indices**: `i - 1` or `j - 1` can be `-1`; comparing it with the unsigned `board.size()` turns it into a huge value, so the bounds check still rejects it.

## Code

```cpp title="C++"
class Solution {
    vector<vector<char>> board;

   public:
    bool search(string word, int ix, int i, int j) {
        if (i >= board.size() || j >= board[0].size()) return false;

        if (ix >= word.length()) return true;
        if (word[ix] != this->board[i][j]) return false;
        if (ix == word.length() - 1) return true;

        char ch = board[i][j];
        board[i][j] = '*';

        int dx[] = {0, 0, 1, -1};
        int dy[] = {1, -1, 0, 0};
        for (int k = 0; k < 4; k++)
            if (search(word, ix + 1, i + dx[k], j + dy[k])) return true;

        board[i][j] = ch;

        return false;
    }

    bool exist(vector<vector<char>>& board, string word) {
        int n = board.size();
        int m = board[0].size();
        this->board = board;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (search(word, 0, i, j)) return true;
            }
        }
        return false;
    }
};
```
