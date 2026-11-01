---
title: "Matrix Median"
description: "Given a matrix of integers A of size N x M in which each row is sorted. Find an return the overall median of the matrix A. Note: No extra memory is…"
source: "https://www.interviewbit.com/problems/matrix-median/"
tags: ["Divide Conquer", "Matrix"]
complexity:
  time: "O(n \\log m \\cdot \\log R)"
  space: "O(1)"
---

## Problem

<p>Given a matrix of integers <strong>A</strong> of size <strong>N x M</strong> in which each row is sorted.</p>

<p>Find an return the overall median of the matrix <strong>A</strong>.</p>

<p><strong>Note:</strong> No extra memory is allowed.</p>

<p><strong>Note:</strong> Rows are numbered from top to bottom and columns are numbered from left to right.</p>

## Solution approach

### Intuition

Every row is sorted, and the total number of elements `n * m` is odd. Instead of merging the rows, binary-search on the **value** of the answer: the median is the smallest value `x` such that at least `(n * m + 1) / 2` elements of the matrix are less than or equal to `x`.

For a candidate `x`, that count can be computed with a binary search (`upper_bound`) on every row, and then summed. If the sum reaches `desired`, the median is `x` or smaller; otherwise it is larger.

### Algorithm

1. Set `min` to the smallest first element and `max` to the largest last element over all rows.
2. Let `desired = (m * n + 1) / 2`.
3. While `min < max`, take `mid` and count `p`, the number of elements `<= mid`, by summing `upper_bound` positions over all rows.
4. If `p < desired`, set `min = mid + 1`; otherwise set `max = mid`.
5. Return `min`.

### Complexity

- **Time:** $O(n \log m \cdot \log R)$ — $\log R$ value-search steps (where $R$ is the initial `max - min`, so $\log R \le 32$ for 32-bit values), each doing `n` row searches of $O(\log m)$.
- **Space:** $O(1)$ — only a few counters are used.

## Code

```cpp title="C++"
int Solution::findMedian(vector<vector<int> > &A) {
    int min = INT_MAX, max = INT_MIN;
    int n = A.size();
    int m = A[0].size();
    for (int i = 0; i < n; i++) {
        min = min < A[i][0] ? min : A[i][0];
        max = max > A[i][m - 1] ? max : A[i][m - 1];
    }

    int desired = (m * n + 1) / 2;
    while (min < max) {
        int mid = min + (max - min) / 2;
        int p = 0;
        for (int i = 0; i < n; i++) {
            p += upper_bound(A[i].begin(), A[i].end(), mid) - A[i].begin();
        }
        if (p < desired) {
            min = mid + 1;
        } else
            max = mid;
    }
    return min;
}

```
