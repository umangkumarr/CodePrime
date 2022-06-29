---
sidebar_position : 12
tags: [Array, Backtracking, Matrix]
---

# Word Search

## [Problem](https://leetcode.com/problems/word-search/)

<p>Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>, return <code>true</code> <em>if</em> <code>word</code> <em>exists in the grid</em>.</p>

<p>The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.</p>

## Solution Approach

Think of BFS, Backtracking and Dynamic Programming.

Expected Time complexity: $O(2^n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
