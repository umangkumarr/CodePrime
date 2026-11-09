---
title: "Pascal's Triangle"
description: "Generate the first numRows rows of Pascal's triangle, building each row from the previous one since every inner entry is the sum of the two above it."
source: "https://leetcode.com/problems/pascals-triangle/"
difficulty: "Easy"
tags: ["Array", "Dynamic Programming"]
complexity:
  time: "O(n^2)"
  space: "O(1)"
---

## Problem

You are given an integer `numRows`.

Return the first `numRows` of **Pascal's triangle**.

In **Pascal's triangle**, each number is the sum of the two numbers directly above it and the first and last number on each row must be equal to `1`, as shown below:

![Pascal's triangle being built row by row](https://upload.wikimedia.org/wikipedia/commons/0/0d/PascalTriangleAnimated2.gif)

**Example 1:**

```text
Input:  numRows = 5
Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
```

**Example 2:**

```text
Input:  numRows = 1
Output: [[1]]
```

**Constraints:**

- $1 \le$ `numRows` $\le 30$

## Solution approach

### Intuition

The definition is already a recurrence. Row `i` (0-indexed) has `i + 1` entries; its first and last entries are `1`, and every inner entry `j` is the sum of the two entries above it in row `i - 1`:

$$row_i[j] = row_{i-1}[j-1] + row_{i-1}[j], \qquad 0 \lt j \lt i$$

Row `i - 1` is complete before row `i` starts, so building the rows top to bottom always has the needed values ready. (Entry `j` of row `i` is the binomial coefficient $\binom{i}{j}$; for `numRows` up to `30` the largest is $\binom{29}{14} = 77\,558\,760$, which fits in an `int`.)

### Algorithm

1. Create `triangle` with `numRows` rows.
2. For each `i` from `0` to `numRows - 1`, make row `i` of size `i + 1` filled with `1` (this sets both ends).
3. For each inner `j` from `1` to `i - 1`, set `triangle[i][j] = triangle[i - 1][j - 1] + triangle[i - 1][j]`.
4. Return `triangle`.

### Complexity

- **Time:** $O(n^2)$ for `n = numRows` — the triangle has $n(n+1)/2$ entries and each is computed in $O(1)$.
- **Space:** $O(1)$ extra — only the output, which itself has $O(n^2)$ entries.

### Edge cases

- **`numRows = 1`** (Example 2): row `0` is `[1]` and the inner loop never runs.
- **Rows 0 and 1** have no inner entries, so they stay all `1`s.

## Code

```cpp
class Solution {
   public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>> triangle(numRows);
        for (int i = 0; i < numRows; i++) {
            triangle[i].assign(i + 1, 1);
            for (int j = 1; j < i; j++) {
                triangle[i][j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
            }
        }
        return triangle;
    }
};
```

```java
class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> triangle = new ArrayList<>(numRows);
        for (int i = 0; i < numRows; i++) {
            List<Integer> row = new ArrayList<>(i + 1);
            for (int j = 0; j <= i; j++) {
                if (j == 0 || j == i) {
                    row.add(1);
                } else {
                    List<Integer> above = triangle.get(i - 1);
                    row.add(above.get(j - 1) + above.get(j));
                }
            }
            triangle.add(row);
        }
        return triangle;
    }
}
```

```python
class Solution:
    def generate(self, numRows: int) -> list[list[int]]:
        triangle = []
        for i in range(numRows):
            row = [1] * (i + 1)
            for j in range(1, i):
                row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j]
            triangle.append(row)
        return triangle
```
