---
title: "Set Matrix Zeroes"
description: "Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's. You must do it in place."
source: "https://leetcode.com/problems/set-matrix-zeroes/"
tags: ["Array", "Hash Table", "Matrix"]
complexity:
  time: "O(n \\cdot m \\cdot (n + m))"
  space: "O(n \\cdot m)"
---

## Problem

<p>Given an <code>m x n</code> integer matrix <code>matrix</code>, if an element is <code>0</code>, set its entire row and column to <code>0</code>&#39;s.</p>

<p>You must do it <a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank">in place</a>.</p>

## Solution approach

### Intuition

If we zero out rows and columns directly in `matrix`, the new zeros would themselves trigger more rows and columns to be cleared. To avoid this, the code reads the zeros from the original `matrix` and writes the result into a separate copy `a`, so only the zeros that were present at the start have any effect.

### Algorithm

1. Copy `matrix` into `a`; let `n` be the number of rows and `m` the number of columns.
2. Scan every cell `matrix[i][j]`. When it is `0`, set the whole column `j` and the whole row `i` of `a` to `0`.
3. Assign `a` back to `matrix`.

### Complexity

- **Time:** $O(n \cdot m \cdot (n + m))$ — each of the $n \cdot m$ cells may be a zero that clears $n + m$ cells.
- **Space:** $O(n \cdot m)$ — the copy `a` of the whole matrix.

### Edge cases

- **Many zeros**: a row or column can be cleared several times; the result is the same, it just costs extra work.

## Code

```cpp title="C++"
class Solution {
   public:
    void setZeroes(vector<vector<int>>& matrix){
        vector<vector<int>> a = matrix;
        int n = matrix.size();
        int m = matrix[0].size();
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (matrix[i][j] == 0) {
                    for (int k = 0; k < n; k++) a[k][j] = 0;
                    for (int k = 0; k < m; k++) a[i][k] = 0;
                }
            }
        }
        matrix = a;
    }
};

```
