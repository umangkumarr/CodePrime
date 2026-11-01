---
title: "Rotate Image"
description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you…"
source: "https://leetcode.com/problems/rotate-image/"
tags: ["Array", "Math", "Matrix"]
complexity:
  time: "O(n^2)"
  space: "O(1)"
---

## Problem

<p>You are given an <code>n x n</code> 2D <code>matrix</code> representing an image, rotate the image by <strong>90</strong> degrees (clockwise).</p>

<p>You have to rotate the image <a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank"><strong>in-place</strong></a>, which means you have to modify the input 2D matrix directly. <strong>DO NOT</strong> allocate another 2D matrix and do the rotation.</p>

## Solution approach

### Intuition

Rotating the matrix 90 degrees clockwise moves every element around a 4-cycle of positions on the same square "ring": top goes to right, right to bottom, bottom to left, and left to top. Processing the matrix ring by ring from the outside in, we can rotate each 4-cycle in place using three swaps, so no second matrix is needed.

### Algorithm

1. For each ring `i` from `0` to `n / 2 - 1`, the ring's side length is `n - 2 * i`.
2. For each offset `j` from `0` to `n - 2 * i - 2`, the four cells of one cycle are:
   - top `matrix[i][i + j]`
   - left `matrix[n - i - 1 - j][i]`
   - bottom `matrix[n - i - 1][n - i - 1 - j]`
   - right `matrix[i + j][n - i - 1]`
3. Swap top with left, then left with bottom, then bottom with right. Each cell ends up holding the value of the cell that rotates into it, so the new top is the old left, and so on.

### Complexity

- **Time:** $O(n^2)$ — each element is moved a constant number of times.
- **Space:** $O(1)$ — the rotation is done in place.

## Code

```cpp title="C++"
class Solution {
   public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        for (int i = 0; i < n / 2; i++) {
            for (int j = 0; j < n - 2 * i - 1; j++) {
                swap(matrix[i][i + j], matrix[n - i - 1 - j][i]);
                swap(matrix[n - i - 1 - j][i],
                     matrix[n - i - 1][n - i - 1 - j]);
                swap(matrix[n - i - 1][n - i - 1 - j],
                     matrix[i + j][n - i - 1]);
            }
        }
    }
};

```
