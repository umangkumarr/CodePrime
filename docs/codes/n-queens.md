---
displayed_sidebar: null
sidebar_position : 58
tags: [Array, Backtracking]
---

# N-Queens

## [Problem](https://leetcode.com/problems/n-queens/)

<p>The <strong>n-queens</strong> puzzle is the problem of placing <code>n</code> queens on an <code>n x n</code> chessboard such that no two queens attack each other.</p>

<p>Given an integer <code>n</code>, return <em>all distinct solutions to the <strong>n-queens puzzle</strong></em>. You may return the answer in <strong>any order</strong>.</p>

<p>Each solution contains a distinct board configuration of the n-queens&#39; placement, where <code>&#39;Q&#39;</code> and <code>&#39;.&#39;</code> both indicate a queen and an empty space, respectively.</p>

## Solution Approach
Use Backtracking and find all the possible states of queens on the board and pick the valid one accordingly.

Expected Time complexity: $O(n^n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
