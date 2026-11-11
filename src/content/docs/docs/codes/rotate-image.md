---
title: "Rotate Image"
description: "Rotate an n x n matrix 90 degrees clockwise in place by transposing it and then reversing every row."
source: "https://leetcode.com/problems/rotate-image/"
difficulty: "Medium"
tags: ["Array", "Math", "Matrix"]
complexity:
  time: "O(n^2)"
  space: "O(1)"
---

## Problem

You are given an `n x n` 2D `matrix` representing an image, rotate the image by **90** degrees (clockwise).

You have to rotate the image **[in-place](https://en.wikipedia.org/wiki/In-place_algorithm)**, which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix and do the rotation.

**Example 1:**

![A 3 x 3 matrix 1..9 rotated clockwise](https://assets.leetcode.com/uploads/2020/08/28/mat1.jpg)

```text
Input:  matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]
```

**Example 2:**

![A 4 x 4 matrix rotated clockwise](https://assets.leetcode.com/uploads/2020/08/28/mat2.jpg)

```text
Input:  matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
```

**Constraints:**

- `n == matrix.length == matrix[i].length`
- $1 \le n \le 20$
- $-1000 \le$ `matrix[i][j]` $\le 1000$

## Solution approach

### Intuition

A clockwise rotation sends the element at row `r`, column `c` to row `c`, column `n - 1 - r`. That single move is the composition of two simple in-place operations:

1. **Transpose** (reflect across the main diagonal): `(r, c)` → `(c, r)`.
2. **Reverse each row** (reflect left–right): `(c, r)` → `(c, n - 1 - r)`.

Both are made of plain swaps, so neither needs a second matrix. Intuitively: after the transpose, the first *column* of the original has become the first *row*, but read top-to-bottom it should end up as the last column read bottom-to-top — the row reversal does exactly that.

### Algorithm

1. For every `i` and every `j > i`, `swap(matrix[i][j], matrix[j][i])`. Only the upper triangle is visited, so every pair is swapped exactly once (swapping it twice would undo it).
2. For every row, `reverse(row.begin(), row.end())`.

### Walkthrough

Example 2. Orange cells are swapped across the blue diagonal; green cells are final:

![Transpose then reverse rows on the 4 x 4 example](/img/codes/rotate-image/transpose-reverse/01.webp)

### Complexity

- **Time:** $O(n^2)$ — the transpose touches each off-diagonal cell once, the row reversals touch every cell once.
- **Space:** $O(1)$ — only swaps.

### Edge cases

- **`n = 1`:** the transpose loop has no `j > i` and reversing a one-element row does nothing; the matrix is unchanged, as it should be.
- **Odd `n`:** the centre cell lies on the diagonal and in the middle of its row, so it is never moved — also correct for a rotation.

## Code

```cpp
class Solution {
   public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) swap(matrix[i][j], matrix[j][i]);
        for (auto& row : matrix) reverse(row.begin(), row.end());
    }
};
```

```java
class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) {
                int t = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = t;
            }
        for (int[] row : matrix)
            for (int lo = 0, hi = n - 1; lo < hi; lo++, hi--) {
                int t = row[lo];
                row[lo] = row[hi];
                row[hi] = t;
            }
    }
}
```

```python
class Solution:
    def rotate(self, matrix: list[list[int]]) -> None:
        n = len(matrix)
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        for row in matrix:
            row.reverse()
```
