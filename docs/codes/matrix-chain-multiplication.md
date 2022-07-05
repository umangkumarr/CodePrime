---
displayed_sidebar: null
sidebar_position : 7
tags: [Matrix, Dynamic Programming]
---

# Matrix Chain Multiplication

## [Problem](https://practice.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1)

Given a sequence of matrices, find the most efficient way to multiply these matrices together. The efficient way is the one that involves the least number of multiplications.

The dimensions of the matrices are given in an array arr[] of size N (such that N = number of matrices + 1) where the ith matrix has the dimensions <strong>(arr[i-1] x arr[i])</strong>.

## Solution Approach

Expected Time complexity: $O(n^3)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
