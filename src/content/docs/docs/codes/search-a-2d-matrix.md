---
title: "Search a 2D Matrix"
description: "Search a row-wise sorted matrix whose rows continue one another in O(log(m * n)) by binary searching it as one flattened sorted array."
source: "https://leetcode.com/problems/search-a-2d-matrix/"
difficulty: "Medium"
tags: ["Array", "Binary Search", "Matrix"]
complexity:
  time: "O(\\log(m \\cdot n))"
  space: "O(1)"
---

## Problem

You are given an `m x n` integer matrix `matrix` with the following two properties:

- Each row is sorted in non-decreasing order.
- The first integer of each row is greater than the last integer of the previous row.

Given an integer `target`, return `true` *if* `target` *is in* `matrix` *or* `false` *otherwise*.

You must write a solution in `O(log(m * n))` time complexity.

**Example 1:**

![The 3 x 4 matrix with 3 highlighted](https://assets.leetcode.com/uploads/2020/10/05/mat.jpg)

```text
Input:  matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true
```

**Example 2:**

![The 3 x 4 matrix; 13 is not present](https://assets.leetcode.com/uploads/2020/10/05/mat2.jpg)

```text
Input:  matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
Output: false
```

**Constraints:**

- `m == matrix.length`
- `n == matrix[i].length`
- $1 \le m, n \le 100$
- $-10^4 \le$ `matrix[i][j]`, `target` $\le 10^4$

## Solution approach

### Intuition

The two properties together say that reading the matrix row by row, left to right, gives **one sorted list** of `m * n` numbers: each row is sorted, and each row starts above where the previous one ended.

So we can binary search that list without building it. Position `k` of the flattened list (0-based) lives in row `k / n`, column `k % n`. Binary search over `k` in `[0, m * n - 1]` then takes $O(\log(m \cdot n))$ comparisons, exactly the required bound.

### Algorithm

1. Set `lo = 0`, `hi = m * n - 1`.
2. While `lo <= hi`:
   - `mid = lo + (hi - lo) / 2`, and `v = matrix[mid / n][mid % n]`.
   - If `v == target`, return `true`.
   - If `v < target`, the target can only be to the right: `lo = mid + 1`. Otherwise `hi = mid - 1`.
3. The range is empty, so `target` is absent: return `false`.

### Walkthrough

Example 1 with `target = 3`. Blue is `matrix[mid / n][mid % n]`; grey cells are already ruled out:

![Binary search over the flattened 3 x 4 matrix for 3](/img/codes/search-a-2d-matrix/flattened-search/01.webp)

### Complexity

- **Time:** $O(\log(m \cdot n))$ — the range of `k` halves each iteration.
- **Space:** $O(1)$ — a few indices.

### Edge cases

- **Target smaller than every entry or larger than every entry:** `hi` drops below `0` or `lo` passes `m * n - 1`, and the loop ends with `false`.
- **Target between two rows** (Example 2: `13` lies between `11` and `16`): the range closes between those cells and the loop returns `false`.
- **One row or one column:** `n` (or `m`) is `1` and the index mapping still holds.

## Code

```cpp
class Solution {
   public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int lo = 0, hi = m * n - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int v = matrix[mid / n][mid % n];
            if (v == target) return true;
            if (v < target)
                lo = mid + 1;
            else
                hi = mid - 1;
        }
        return false;
    }
};
```

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length;
        int lo = 0, hi = m * n - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int v = matrix[mid / n][mid % n];
            if (v == target) return true;
            if (v < target)
                lo = mid + 1;
            else
                hi = mid - 1;
        }
        return false;
    }
}
```

```python
class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        lo, hi = 0, m * n - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            v = matrix[mid // n][mid % n]
            if v == target:
                return True
            if v < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return False
```
