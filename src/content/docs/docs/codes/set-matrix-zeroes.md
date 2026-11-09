---
title: "Set Matrix Zeroes"
description: "Zero out every row and column that contains a 0, in place and with O(1) extra space, by using the first row and column as marker arrays."
source: "https://leetcode.com/problems/set-matrix-zeroes/"
difficulty: "Medium"
tags: ["Array", "Hash Table", "Matrix"]
complexity:
  time: "O(m \\cdot n)"
  space: "O(1)"
---

## Problem

Given an `m x n` integer matrix `matrix`, if an element is `0`, set its entire row and column to `0`'s.

You must do it [in place](https://en.wikipedia.org/wiki/In-place_algorithm).

**Example 1:**

![3 x 3 matrix with a zero in the centre; its row and column become zero](https://assets.leetcode.com/uploads/2020/08/17/mat1.jpg)

```text
Input:  matrix = [[1,1,1],[1,0,1],[1,1,1]]
Output: [[1,0,1],[0,0,0],[1,0,1]]
```

**Example 2:**

![3 x 4 matrix with zeros in the top corners; the first and last columns and the first row become zero](https://assets.leetcode.com/uploads/2020/08/17/mat2.jpg)

```text
Input:  matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
```

**Constraints:**

- `m == matrix.length`
- `n == matrix[0].length`
- $1 \le m, n \le 200$
- $-2^{31} \le matrix[i][j] \le 2^{31} - 1$

**Follow-up:**

- A straightforward solution using $O(mn)$ space is probably a bad idea.
- A simple improvement uses $O(m + n)$ space, but still not the best solution.
- Could you devise a constant space solution?

## Solution approach

### Intuition

Zeroing rows and columns as soon as we see a `0` is wrong: the freshly written zeros would then look like original zeros and wipe out more rows and columns. So we work in two phases — first **record** which rows and columns must be cleared, then **clear** them.

The $O(m + n)$ way records this in two boolean arrays `rowZero[m]` and `colZero[n]`. To get $O(1)$ space we store those same flags **inside the matrix itself**:

- `matrix[i][0]` (the first column) says whether row `i` must be cleared;
- `matrix[0][j]` (the first row) says whether column `j` must be cleared.

The cell `matrix[0][0]` would have to serve both as the flag for row 0 and for column 0, so we let it mean "row 0 must be cleared" and keep one extra boolean, `firstColZero`, for column 0.

The only danger is overwriting a flag before it has been read. Clearing from the **bottom-right towards the top-left** avoids that: row 0 (which holds the column flags) is processed last, and in every row column 0 (which holds the row flag) is written only after the rest of that row has been handled.

### Algorithm

1. **Mark.** For every row `i`: if `matrix[i][0] == 0`, set `firstColZero = true`. For every `j >= 1` with `matrix[i][j] == 0`, set `matrix[i][0] = 0` and `matrix[0][j] = 0`.
2. **Clear.** For `i` from `m - 1` down to `0`:
   - for `j` from `n - 1` down to `1`, set `matrix[i][j] = 0` if `matrix[i][0] == 0` or `matrix[0][j] == 0`;
   - then, if `firstColZero`, set `matrix[i][0] = 0`.

### Walkthrough

Example 2. Orange cells are the marker row/column, blue is the cell being looked at, red cells have been cleared:

![Marking the first row and column, then clearing from the bottom-right on [[0,1,2,0],[3,4,5,2],[1,3,1,5]]](/img/codes/set-matrix-zeroes/markers.gif)

### Complexity

- **Time:** $O(m \cdot n)$ — two passes over the matrix, constant work per cell.
- **Space:** $O(1)$ — the flags live in the matrix itself plus a single boolean.

### Edge cases

- **Zero in `matrix[0][0]`:** it marks both row 0 (via the cell) and column 0 (because step 1 also sets `firstColZero` when it reads `matrix[0][0]`).
- **Single row or single column:** the inner loop over `j >= 1` may be empty; `firstColZero` and `matrix[0][j]` still handle everything.
- **No zeros at all:** no marker is written and the clearing pass changes nothing.

## Code

```cpp title="C++"
class Solution {
   public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        bool firstColZero = false;

        // Phase 1: record zero rows in column 0 and zero columns in row 0.
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) firstColZero = true;
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }

        // Phase 2: clear bottom-up so the markers are read before they are overwritten.
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 1; j--) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
            }
            if (firstColZero) matrix[i][0] = 0;
        }
    }
};
```
