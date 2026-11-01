---
title: "Pow(x, n)"
description: "Implement pow(x, n), which calculates x raised to the power n (i.e., xn)."
source: "https://leetcode.com/problems/powx-n/"
tags: ["Math", "Recursion"]
complexity:
  time: "O(\\log n)"
  space: "O(1)"
---

## Problem

<p>Implement <a href="http://www.cplusplus.com/reference/valarray/pow/" target="_blank">pow(x, n)</a>, which calculates <code>x</code> raised to the power <code>n</code> (i.e., <code>xn</code>).</p>

## Solution approach

### Intuition

Multiplying `x` by itself `n` times takes $O(n)$ steps, which is too slow when `n` is near $2^{31}$. Binary exponentiation uses the binary form of `n` instead. For example, $x^{13} = x^{8} \cdot x^{4} \cdot x^{1}$ because $13 = 1101_2$. If we keep squaring a base `a` (giving $x, x^2, x^4, x^8, \dots$) and multiply it into the answer only when the matching bit of `n` is set, we need just $O(\log n)$ multiplications. A negative exponent is handled at the end by taking the reciprocal.

### Algorithm

1. Store `x` in `a` (as `long double`), start with `ans = 1`, remember the original sign in `nn`, and set `n = abs(m)`.
2. While `n` is non-zero:
   - If the lowest bit of `n` is `1`, multiply `ans` by `a`.
   - Square `a` and shift `n` right by one bit.
3. If `nn < 0`, set `ans = 1 / ans`.
4. Return `ans`.

### Complexity

- **Time:** $O(\log n)$ — the loop runs once per bit of `n`.
- **Space:** $O(1)$ — only a few variables.

### Edge cases

- **Negative exponent**, e.g. `x = 2`, `m = -2`: the loop computes $2^2 = 4$, and the final step returns $1/4 = 0.25$.
- **`m = INT_MIN`:** `abs(m)` is computed in `int` and overflows, so `n` stays negative; this input is not handled safely.

## Code

```cpp title="C++"
class Solution {
   public:
    double myPow(double x, int m) {
        long double a = x;
        long double ans = 1;
        int nn = m;
        long long n = abs(m);
        while (n) {
            long long bit = (1ll & n);
            if (bit) {
                ans *= a;
            }
            a *= a;
            n >>= 1;
        }
        if (nn < 0) {
            ans = 1.0 / ans;
        }
        return ans;
    }
};

```
