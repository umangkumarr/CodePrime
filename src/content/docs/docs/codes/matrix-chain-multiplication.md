---
title: "Matrix Chain Multiplication"
description: "Given a sequence of matrices, find the most efficient way to multiply these matrices together. The efficient way is the one that involves the least number…"
source: "https://practice.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1"
tags: ["Matrix", "Dynamic Programming"]
complexity:
  time: "O(n^3)"
  space: "O(n^2)"
---

## Problem

Given a sequence of matrices, find the most efficient way to multiply these matrices together. The efficient way is the one that involves the least number of multiplications.

The dimensions of the matrices are given in an array arr[] of size N (such that N = number of matrices + 1) where the ith matrix has the dimensions <strong>(arr[i-1] x arr[i])</strong>.

## Solution approach

### Intuition

Matrix `i` has dimensions `A[i] x A[i + 1]`. To multiply matrices `r` to `c`, the last multiplication splits them at some `pivot`: the product of `r..pivot` times the product of `pivot + 1..c`, which costs `A[r] * A[pivot + 1] * A[c + 1]`. So the best cost for a range is the minimum over all pivots of the two sub-range costs plus that final cost. Trying every bracketing directly is exponential, but there are only $O(n^2)$ ranges, so we fill a table from short ranges to long ones.

### Algorithm

1. Let `n = N - 1` be the number of matrices; `dp[r][c]` is the minimum cost for matrices `r..c`, and `dp[i][i] = 0`.
2. For each gap `i` from `1` to `n - 1`, slide the window `r = 0`, `c = i` along the diagonal while `c < n`.
3. For each window, take the minimum over `pivot` from `r` to `c - 1` of `dp[r][pivot] + dp[pivot + 1][c] + A[r] * A[pivot + 1] * A[c + 1]`, and store it in `dp[r][c]`.
4. Return `dp[0][n - 1]`.

### Complexity

- **Time:** $O(n^3)$ — $O(n^2)$ ranges, each trying $O(n)$ pivots.
- **Space:** $O(n^2)$ — the `dp` table (allocated as a fixed `200 x 200` array).

## Code

```cpp title="C++"
class Solution {
   public:
    int matrixMultiplication(int N, int A[]) {
        int dp[200][200] = {0};
        memset(dp, 0, sizeof dp);
        int n = N - 1;
        for (int i = 1; i < n; i++) {
            int r = 0, c = i;
            while (c < n) {
                int val = INT_MAX;
                for (int pivot = r; pivot < c; pivot++) {
                    val = min(val, dp[r][pivot] + dp[pivot + 1][c] +
                                       A[r] * A[pivot + 1] * A[c + 1]);
                }
                dp[r][c] = val;
                r++;
                c++;
            }
        }
        return dp[0][n - 1];
    }
};
```
