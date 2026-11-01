---
title: "Word Search II"
description: "Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially…"
source: "https://leetcode.com/problems/word-search-ii/"
tags: ["Array", "String", "Backtracking", "Trie", "Matrix"]
complexity:
  time: "O(W \\cdot n \\cdot m \\cdot 3^L \\cdot L)"
  space: "O(n \\cdot m + L)"
---

## Problem

<p>Given an <code>m x n</code> <code>board</code>&nbsp;of characters and a list of strings <code>words</code>, return <em>all words on the board</em>.</p>

<p>Each word must be constructed from letters of sequentially adjacent cells, where <strong>adjacent cells</strong> are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.</p>

## Solution approach

### Intuition

Each word is searched for independently with a backtracking DFS. Starting from every cell, the DFS follows neighbours whose letters match the next character of the word, marking the current cell with `'*'` so it is not reused in the same path, and restoring it when backtracking. Once a word is found, the search for it stops early via the `check` flag.

### Algorithm

1. For each word `w` in `words`, reset the path string `s` and `check`, then call `traverse(j, k, 0)` from every cell until `check` is set.
2. `traverse(i, j, indx)`: if `indx >= len`, set `check` when `s == w` and return. Return early if `check` is already set or `board[i][j]` does not equal `w[indx]`.
3. Otherwise append the letter to `s`, mark the cell `'*'`, and recurse into each in-bounds, unmarked neighbour with `indx + 1`.
4. After the neighbours, set `check` if `s == w` (this catches a word that ends at a cell with no free neighbour), then restore the cell and pop the letter.
5. If `check` is set for `w`, add `w` to `ans`.

### Complexity

- **Time:** $O(W \cdot n \cdot m \cdot 3^L \cdot L)$ — for each of the $W$ words, a DFS from each of the $n \cdot m$ cells explores up to $3^L$ paths (where $L$ is the word length), and the `s == w` comparison costs $O(L)$.
- **Space:** $O(n \cdot m + L)$ — the copy of `board` plus the recursion stack and path string.

## Code

```cpp title="C++"
class Solution {
    map<string, int> mp;
    vector<vector<char>> board;
    string s, w;
    int n, m, check, len;

   public:
    void traverse(int i, int j, int indx) {
        if (indx >= len) {
            if (s == w) check = 1;
            return;
        }
        if (check) return;
        if (board[i][j] != w[indx]) return;

        s.push_back(board[i][j]);
        char c = board[i][j];
        board[i][j] = '*';

        if (j > 0 && board[i][j - 1] != '*') traverse(i, j - 1, indx + 1);
        if (j < m - 1 && board[i][j + 1] != '*') traverse(i, j + 1, indx + 1);
        if (i > 0 && board[i - 1][j] != '*') traverse(i - 1, j, indx + 1);
        if (i < n - 1 && board[i + 1][j] != '*') traverse(i + 1, j, indx + 1);

        if (s == w) check = 1;
        board[i][j] = c;
        s.pop_back();
    }

    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        this->s = "";
        this->n = board.size();
        this->m = board[0].size();
        this->board = board;
        vector<string> ans;
        for (auto i : words) {
            this->w = i;
            this->len = w.length();
            s = "";
            check = 0;
            for (int j = 0; j < n; j++) {
                if (check) break;
                for (int k = 0; k < m; k++) {
                    if (check) break;
                    traverse(j, k, 0);
                }
            }
            if (check) ans.push_back(w);
        }
        return ans;
    }
};
```
