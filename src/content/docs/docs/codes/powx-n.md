---
title: "Pow(x, n)"
description: "Compute x raised to an integer power n, including negative n and INT_MIN, in O(log n) multiplications with binary exponentiation."
source: "https://leetcode.com/problems/powx-n/"
difficulty: "Medium"
tags: ["Math", "Recursion"]
complexity:
  time: "O(\\log n)"
  space: "O(1)"
---

## Problem

Implement [pow(x, n)](https://www.cplusplus.com/reference/valarray/pow/), which calculates `x` raised to the power `n` (i.e., $x^n$).

**Example 1:**

```text
Input:  x = 2.00000, n = 10
Output: 1024.00000
```

**Example 2:**

```text
Input:  x = 2.10000, n = 3
Output: 9.26100
```

**Example 3:**

```text
Input:  x = 2.00000, n = -2
Output: 0.25000
Explanation: 2^-2 = 1/2^2 = 1/4 = 0.25
```

**Constraints:**

- $-100.0 \lt x \lt 100.0$
- $-2^{31} \le n \le 2^{31} - 1$
- `n` is an integer.
- Either `x` is not zero or $n \gt 0$.
- $-10^4 \le x^n \le 10^4$

## Solution approach

### Intuition

Multiplying `x` by itself `n` times takes $O(n)$ steps — about two billion for the largest `n`. **Binary exponentiation** uses the binary form of the exponent instead. For example $13 = 1101_2$, so

$$x^{13} = x^{8} \cdot x^{4} \cdot x^{1}.$$

The powers $x, x^2, x^4, x^8, \dots$ are produced by repeated squaring, one per bit. Walking the bits of the exponent from lowest to highest, we multiply the current power into the result exactly when that bit is `1`. That is one squaring and at most one multiplication per bit: $O(\log n)$ work.

A negative exponent means $x^{n} = (1/x)^{-n}$, so we invert the base and make the exponent positive. The exponent is copied to a 64-bit integer `e` first: $-(-2^{31}) = 2^{31}$ does not fit in an `int`.

### Algorithm

1. Let `e = n` as a 64-bit integer. If `e < 0`, set `x = 1 / x` and `e = -e`.
2. Start with `result = 1`. While `e > 0`:
   - If the lowest bit of `e` is set, `result *= x`.
   - Square the base: `x *= x`, and drop the lowest bit: `e >>= 1`.
3. Return `result`.

Invariant: before every iteration, `result` times `x` to the power `e` equals the original answer. Each step keeps it true, and the loop ends with `e = 0`, leaving just `result`.

### Walkthrough

Example 1, $x = 2$, $n = 10 = 1010_2$:

| `e` (binary) | lowest bit | `result` after | `x` after |
| --- | --- | --- | --- |
| `1010` | 0 | 1 | 4 |
| `101` | 1 | 4 | 16 |
| `10` | 0 | 4 | 256 |
| `1` | 1 | 1024 | 65536 |

The result is $2^{2} \cdot 2^{8} = 1024$.

### Complexity

- **Time:** $O(\log n)$ — one iteration per bit of $|n|$, at most 32.
- **Space:** $O(1)$ — a few variables.

### Edge cases

- **Negative exponent** (Example 3): the base becomes `0.5` and the loop computes $0.5^2 = 0.25$.
- **`n = INT_MIN`:** negating in 64 bits gives $2^{31}$ without overflow.
- **`n = 0`:** the loop does not run and the result is `1`.
- **Negative `x`:** the sign comes out right automatically: every squared power is positive, so only the $x^1$ factor can be negative, and it is used exactly when `n` is odd.

## Code

```cpp
class Solution {
   public:
    double myPow(double x, int n) {
        long long e = n;
        if (e < 0) {
            x = 1 / x;
            e = -e;
        }
        double result = 1;
        while (e > 0) {
            if (e & 1) result *= x;
            x *= x;
            e >>= 1;
        }
        return result;
    }
};
```

```java
class Solution {
    public double myPow(double x, int n) {
        long e = n;  // long so that -(-2^31) does not overflow
        if (e < 0) {
            x = 1 / x;
            e = -e;
        }
        double result = 1;
        while (e > 0) {
            if ((e & 1) == 1) result *= x;
            x *= x;
            e >>= 1;
        }
        return result;
    }
}
```

```python
class Solution:
    def myPow(self, x: float, n: int) -> float:
        e = n
        if e < 0:
            x = 1 / x
            e = -e
        result = 1.0
        while e > 0:
            if e & 1:
                result *= x
            x *= x
            e >>= 1
        return result
```
