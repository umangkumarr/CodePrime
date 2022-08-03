---
sidebar_position : 22
tags: [Array, String, Backtracking, Trie, Matrix]
---

# Word Search II

## [Problem](https://leetcode.com/problems/word-search-ii/)

<p>Given an <code>m x n</code> <code>board</code>&nbsp;of characters and a list of strings <code>words</code>, return <em>all words on the board</em>.</p>

<p>Each word must be constructed from letters of sequentially adjacent cells, where <strong>adjacent cells</strong> are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.</p>

## Solution Approach

Do BFS and memorization.

Expected Time complexity: $O(n*m*len)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
