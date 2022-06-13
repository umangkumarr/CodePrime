---
sidebar_position : 2
tags: [Array, Backtracking]
---

# N-Queens

## Problem Link
https://leetcode.com/problems/n-queens/

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
