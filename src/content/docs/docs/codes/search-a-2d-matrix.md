---
title: "Search a 2D Matrix"
description: "Write an efficient algorithm that searches for a value target in an m x n integer matrix matrix. This matrix has the following properties: Integers in…"
source: "https://leetcode.com/problems/search-a-2d-matrix/"
tags: ["Array", "Binary Search", "Matrix"]
complexity:
  time: "O(\\log n + \\log m)"
  space: "O(1)"
---

## Problem

<p>Write an efficient algorithm that searches for a value <code>target</code> in an <code>m x n</code> integer matrix <code>matrix</code>. This matrix has the following properties:</p>

<ul>
	<li>Integers in each row are sorted from left to right.</li>
	<li>The first integer of each row is greater than the last integer of the previous row.</li>
</ul>

## Solution approach

### Intuition

Each row is sorted, and each row starts after the previous row ends, so the target can only be in the **last row whose first element is at most `target`**. Two binary searches therefore solve it: the first picks the row, the second searches inside it. Scanning every cell would cost $O(n \cdot m)$.

### Algorithm

1. Binary search over the rows using `matrix[mid][0]`. Whenever `matrix[mid][0] <= target`, record `indx = mid` and move right; otherwise move left. This leaves `indx` at the last row starting at or below `target`.
2. Binary search inside row `indx` in the same way, keeping in `i` the last column whose value is at most `target`.
3. Return `true` if `matrix[indx][i] == target`, otherwise `false`.

### Complexity

- **Time:** $O(\log n + \log m)$ — one binary search over the `n` rows and one over the `m` columns.
- **Space:** $O(1)$ — only index variables.

### Edge cases

- **Target smaller than every element:** `indx` and `i` stay `0`, `matrix[0][0] != target`, so the result is `false`.

## Code

```cpp title="C++"
class Solution {
   public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int n = matrix.size();
        int start = 0, end = n - 1;
        int mid, indx = 0;

        while (start <= end) {
            mid = (start + end) / 2;
            if (matrix[mid][0] > target) {
                end = mid - 1;
            } else {
                indx = mid;
                start = mid + 1;
            }
        }

        start = 0, end = matrix[0].size() - 1;
        int i = 0;
        while (start <= end) {
            mid = (start + end) / 2;
            if (matrix[indx][mid] > target) {
                end = mid - 1;
            } else {
                i = mid;
                start = mid + 1;
            }
        }
        if (matrix[indx][i] == target) return true;
        return false;
    }
};

```
