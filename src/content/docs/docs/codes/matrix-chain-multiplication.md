---
title: "Matrix Chain Multiplication"
description: "Find the minimum number of scalar multiplications needed to multiply a chain of matrices, using interval dynamic programming over the last split point."
source: "https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1"
difficulty: "Hard"
tags: ["Dynamic Programming", "Matrix"]
complexity:
  time: "O(n^3)"
  space: "O(n^2)"
---

## Problem

Given an array **arr[]** which represents **the** dimensions of a sequence of matrices where the **i-th** matrix has the dimensions **(arr[i-1] x arr[i])** for `i >= 1`, find the most efficient way to multiply these matrices together. The efficient way is the one that involves the least number of multiplications.

Complete the function `matrixMultiplication()` which takes the array `arr` and returns the minimum number of multiplications.

**Example 1:**

```text
Input:  arr[] = [2, 1, 3, 4]
Output: 20
Explanation: There are 3 matrices of dimensions 2 × 1, 1 × 3, and 3 × 4, Let this 3 input matrices be M1, M2, and M3. There are two ways to multiply: ((M1 x M2) x M3) and (M1 x (M2 x M3)), note that the result of (M1 x M2) is a 2 x 3 matrix and result of (M2 x M3) is a 1 x 4 matrix.
((M1 x M2) x M3)  requires (2 x 1 x 3) + (2 x 3 x 4) = 30
(M1 x (M2 x M3))  requires (1 x 3 x 4) + (2 x 1 x 4) = 20.
The minimum of these two is 20.
```

**Example 2:**

```text
Input:  arr[] = [1, 2, 3, 4, 3]
Output: 30
Explanation: There are 4 matrices of dimensions 1 × 2, 2 × 3, 3 × 4, 4 × 3. Let this 4 input matrices be M1, M2, M3 and M4. The minimum number of multiplications are obtained by ((M1 x M2) x M3) x M4). The minimum number is (1 x 2 x 3) + (1 x 3 x 4) + (1 x 4 x 3) = 30.
```

**Example 3:**

```text
Input:  arr[] = [3, 4]
Output: 0
Explanation: As there is only one matrix so, there is no cost of multiplication.
```

**Constraints:**

- $2 \le$ `arr.size()` $\le 100$
- $1 \le$ `arr[i]` $\le 200$

## Solution approach

### Intuition

Multiplying a `p x q` matrix by a `q x r` matrix costs `p * q * r` scalar multiplications, and the total cost of a chain depends heavily on the bracketing. The number of bracketings grows exponentially (Catalan numbers), so we cannot try them all.

Number the matrices `1..n` (with `n = arr.size() - 1`); matrix `i` is `arr[i-1] x arr[i]`, so the product of matrices `i..j` is an `arr[i-1] x arr[j]` matrix. Whatever the bracketing of `i..j`, there is a **last** multiplication, which splits the chain at some `k` (`i <= k < j`) into `(i..k)` times `(k+1..j)`. That last step costs `arr[i-1] * arr[k] * arr[j]`, and the two halves are independent subproblems that should each be done as cheaply as possible. So

$$
dp[i][j] = \min_{i \le k \lt j} \big( dp[i][k] + dp[k+1][j] + arr[i-1] \cdot arr[k] \cdot arr[j] \big), \quad dp[i][i] = 0.
$$

Every `dp[i][j]` depends only on shorter chains, so filling the table by increasing chain length guarantees the needed values are ready. There are $O(n^2)$ chains, each trying $O(n)$ split points.

### Algorithm

1. Let `n = arr.size() - 1` and `dp` be an `(n + 1) x (n + 1)` table of zeros (`dp[i][i] = 0`: a single matrix costs nothing).
2. For `len` from `2` to `n`, and every `i` with `j = i + len - 1 <= n`:
   - set `dp[i][j]` to the minimum over `k` in `[i, j)` of `dp[i][k] + dp[k + 1][j] + arr[i - 1] * arr[k] * arr[j]`.
3. Return `dp[1][n]`.

### Walkthrough

The table for Example 2 (`arr = [1, 2, 3, 4, 3]`, matrices `M1..M4`), filled diagonal by diagonal. Row `i`, column `j` holds `dp[i][j]`; blue is the cell being computed, orange are the two sub-results of its best split:

![Filling the matrix chain DP table for [1,2,3,4,3]](/img/codes/matrix-chain-multiplication/dp.gif)

### Complexity

- **Time:** $O(n^3)$ — $O(n^2)$ cells, each taking a minimum over $O(n)$ split points. With $n \le 99$ that is under $10^6$ steps.
- **Space:** $O(n^2)$ — the `dp` table.

### Edge cases

- **One matrix** (Example 3, `n = 1`): the loops never run and `dp[1][1] = 0` is returned.
- **Overflow:** a chain of at most 99 matrices needs 98 multiplications, each costing at most $200^3$, so any cost is at most $98 \cdot 200^3 \approx 7.8 \times 10^8$, and every candidate sum is bounded by that too, so `int` is enough.

## Code

```cpp title="C++"
class Solution {
   public:
    int matrixMultiplication(vector<int>& arr) {
        int n = arr.size() - 1;  // matrix i has dimensions arr[i-1] x arr[i], i = 1..n
        vector<vector<int>> dp(n + 1, vector<int>(n + 1, 0));
        for (int len = 2; len <= n; len++) {
            for (int i = 1; i + len - 1 <= n; i++) {
                int j = i + len - 1;
                dp[i][j] = INT_MAX;
                for (int k = i; k < j; k++)
                    dp[i][j] = min(dp[i][j], dp[i][k] + dp[k + 1][j] + arr[i - 1] * arr[k] * arr[j]);
            }
        }
        return dp[1][n];
    }
};
```
