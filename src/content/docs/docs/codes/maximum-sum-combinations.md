---
title: "Maximum Sum Combinations"
description: "Return the C largest sums A[i] + B[j] by sorting both arrays and expanding a max-heap frontier over the implicit sorted sum matrix."
source: "https://www.interviewbit.com/problems/maximum-sum-combinations/"
difficulty: "Medium"
tags: ["Heap (Priority Queue)"]
complexity:
  time: "O(n \\log n + C \\log C)"
  space: "O(C)"
---

## Problem

Given two equally sized 1-D arrays **A**, **B** containing **N** integers each.

A **sum combination** is made by adding one element from array **A** and another element of array **B**.

Return the **maximum C valid sum combinations** from all the possible sum combinations.

Complete the function `vector<int> Solution::solve(vector<int> &A, vector<int> &B, int C)`. It returns a one-dimensional integer array of size `C` denoting the top `C` maximum sum combinations.

**Note:** The returned array must be sorted in non-increasing order.

**Example 1:**

```text
Input:  A = [3, 2], B = [1, 4], C = 2
Output: [7, 6]
Explanation:
7 (A : 3) + (B : 4)
6 (A : 2) + (B : 4)
```

**Example 2:**

```text
Input:  A = [1, 4, 2, 3], B = [2, 5, 1, 6], C = 4
Output: [10, 9, 9, 8]
Explanation:
10 (A : 4) + (B : 6)
9 (A : 4) + (B : 5)
9 (A : 3) + (B : 6)
8 (A : 3) + (B : 5)
```

**Constraints:**

- $1 \le N \le 10^5$
- $1 \le$ `A[i]` $\le 10^5$
- $1 \le C \le N$

## Solution approach

### Intuition

Sort both arrays in **decreasing** order and imagine the $N \times N$ matrix `S[i][j] = A[i] + B[j]`. Every row and every column of it is non-increasing, so `S[0][0]` is the largest sum, and any cell is at most the cells above it and to its left.

That means a cell can only be among the top sums after its upper neighbour or its left neighbour has been taken. So we never need to look at the whole matrix: keep a max-heap of **frontier** cells. Each time we pop the largest cell `(i, j)`, the only new cells that may now be next are `(i + 1, j)` and `(i, j + 1)`. A set of visited index pairs stops a cell from being pushed twice (it is reachable from both its upper and its left neighbour).

Building all $N^2$ sums would take $O(N^2 \log N)$ time and $O(N^2)$ memory, which is far too much for $N = 10^5$; the heap only touches about `2C` cells.

### Algorithm

1. Sort `A` and `B` in decreasing order.
2. Push `(A[0] + B[0], 0, 0)` into the max-heap `pq` and insert `(0, 0)` into `seen`.
3. Repeat `C` times: pop the largest `(sum, i, j)` and append `sum` to `ans`; for each of `(i + 1, j)` and `(i, j + 1)` that is inside the matrix and not in `seen`, mark it and push it.
4. `ans` is produced in non-increasing order, as required.

### Walkthrough

Example 2 after sorting: `A = [4,3,2,1]` (rows), `B = [6,5,2,1]` (columns). Green cells are popped, orange cells are in the heap:

![Heap frontier over the sorted sum matrix for Example 2](/img/codes/maximum-sum-combinations/frontier.gif)

### Complexity

- **Time:** $O(N \log N + C \log C)$ — sorting, then `C` pops, each pushing at most two cells, so the heap and the set hold $O(C)$ entries.
- **Space:** $O(C)$ — the heap and `seen`, apart from the output.

### Edge cases

- **Equal sums from different pairs** (the two `9`s in Example 2) are both reported, because `seen` tracks index pairs, not values.
- **`C == N`:** at most `2C` pushes still happen; neighbours past the last row or column are skipped by the bounds check.

## Code

```cpp title="C++"
vector<int> Solution::solve(vector<int> &A, vector<int> &B, int C) {
    int n = A.size();
    sort(A.begin(), A.end(), greater<int>());
    sort(B.begin(), B.end(), greater<int>());

    priority_queue<tuple<int, int, int>> pq;  // (A[i] + B[j], i, j)
    set<pair<int, int>> seen;
    pq.emplace(A[0] + B[0], 0, 0);
    seen.insert({0, 0});

    vector<int> ans;
    while ((int)ans.size() < C) {
        auto [sum, i, j] = pq.top();
        pq.pop();
        ans.push_back(sum);
        if (i + 1 < n && seen.insert({i + 1, j}).second) pq.emplace(A[i + 1] + B[j], i + 1, j);
        if (j + 1 < n && seen.insert({i, j + 1}).second) pq.emplace(A[i] + B[j + 1], i, j + 1);
    }
    return ans;
}
```
