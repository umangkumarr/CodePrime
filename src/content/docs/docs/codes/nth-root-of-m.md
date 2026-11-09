---
title: "The N-th root of an integer"
description: "Return the integer n-th root of m, or -1 if it is not an integer, by binary searching the answer with an overflow-safe power check."
source: "https://www.naukri.com/code360/problems/nth-root-of-m_1062679"
difficulty: "Easy"
tags: ["Math", "Divide and Conquer"]
complexity:
  time: "O(n \\log m)"
  space: "O(1)"
---

## Problem

You are given two positive integers `n` and `m`. You have to return the `n`-th root of `m`, i.e. $m^{1/n}$. If the `n`-th root is not an integer, return `-1`.

Complete the function `int NthRoot(int n, int m)`.

**Example 1:**

```text
Input:  n = 3, m = 27
Output: 3
Explanation: 3rd root of 27 is 3, as (3)^3 equals 27.
```

**Example 2:**

```text
Input:  n = 4, m = 69
Output: -1
Explanation: 4th root of 69 is not an integer, hence -1.
```

**Constraints:**

- $1 \le n \le 30$
- $1 \le m \le 10^9$

## Solution approach

### Intuition

We need an integer `x` with $x^n = m$. Calling `pow(m, 1.0 / n)` and rounding is tempting but fragile: floating-point error can turn $3$ into $2.9999\ldots$, so the result has to be re-checked in integer arithmetic anyway.

A cleaner observation: for positive integers, $x^n$ is **strictly increasing** in `x`. So the candidates `1, 2, ..., m` are sorted by $x^n$, and we can **binary search on the answer**: look at the middle candidate `mid`, compare $mid^n$ with `m`, and throw away the half that cannot contain the root.

- if $mid^n = m$, `mid` is the root;
- if $mid^n < m$, every `x <= mid` is too small, so search to the right;
- if $mid^n > m$, every `x >= mid` is too big, so search to the left.

If the range becomes empty, no integer root exists.

Computing $mid^n$ directly would overflow (e.g. $10^9$ to the power 30). We only need to know how it compares with `m`, so `compare` multiplies step by step and **stops as soon as the product exceeds `m`**. Before each multiplication the product is at most $m \le 10^9$ and `mid` is at most $10^9$, so the product fits in `long long` (at most $10^{18}$).

### Algorithm

1. `compare(mid, n, m)` sets `p = 1` and multiplies by `mid` up to `n` times; if `p` ever exceeds `m` it returns `1` ("too big"). Afterwards it returns `0` if `p == m` and `-1` ("too small") otherwise.
2. Binary search with `lo = 1`, `hi = m` while `lo <= hi`:
   - `mid = lo + (hi - lo) / 2`;
   - if `compare` returns `0`, return `mid`; if `-1`, set `lo = mid + 1`; if `1`, set `hi = mid - 1`.
3. Return `-1`.

### Walkthrough

Example 2, `n = 4`, `m = 69`:

| `lo` | `hi` | `mid` | $mid^4$ (stopped once above 69) | Decision |
| --- | --- | --- | --- | --- |
| 1 | 69 | 35 | 1225 (stopped after 2 steps) | too big, `hi = 34` |
| 1 | 34 | 17 | 289 (stopped) | too big, `hi = 16` |
| 1 | 16 | 8 | 512 (stopped) | too big, `hi = 7` |
| 1 | 7 | 4 | 256 (stopped) | too big, `hi = 3` |
| 1 | 3 | 2 | 16 | too small, `lo = 3` |
| 3 | 3 | 3 | 81 (stopped) | too big, `hi = 2` |

The range is empty: $2^4 = 16 < 69 < 81 = 3^4$, so there is no integer root and the answer is `-1`.

### Complexity

- **Time:** $O(n \log m)$ — about $\log_2 m \le 30$ binary-search steps, each doing at most `n` multiplications (usually far fewer thanks to the early exit).
- **Space:** $O(1)$.

### Edge cases

- **`n = 1`:** every number is its own first root; the search finds `mid = m`.
- **`m = 1`:** $1^n = 1$, so the answer is `1` for every `n`.
- **Large `mid` with large `n`:** the early exit in `compare` prevents overflow and needless work.

## Code

```cpp
// 1 if mid^n > m, 0 if mid^n == m, -1 if mid^n < m (stops before overflowing)
int compare(long long mid, int n, int m) {
    long long p = 1;
    for (int i = 0; i < n; i++) {
        p *= mid;
        if (p > m) return 1;
    }
    return p == m ? 0 : -1;
}

int NthRoot(int n, int m) {
    int lo = 1, hi = m;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int c = compare(mid, n, m);
        if (c == 0) return mid;
        if (c < 0)
            lo = mid + 1;
        else
            hi = mid - 1;
    }
    return -1;
}
```

```java
public class Solution {
    // 1 if mid^n > m, 0 if mid^n == m, -1 if mid^n < m (stops before overflowing)
    private static int compare(long mid, int n, int m) {
        long p = 1;
        for (int i = 0; i < n; i++) {
            p *= mid;
            if (p > m) return 1;
        }
        return p == m ? 0 : -1;
    }

    public static int NthRoot(int n, int m) {
        int lo = 1, hi = m;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int c = compare(mid, n, m);
            if (c == 0) return mid;
            if (c < 0)
                lo = mid + 1;
            else
                hi = mid - 1;
        }
        return -1;
    }
}
```

```python
# 1 if mid^n > m, 0 if mid^n == m, -1 if mid^n < m (stops as soon as the product exceeds m)
def compare(mid: int, n: int, m: int) -> int:
    p = 1
    for _ in range(n):
        p *= mid
        if p > m:
            return 1
    return 0 if p == m else -1


def NthRoot(n: int, m: int) -> int:
    lo, hi = 1, m
    while lo <= hi:
        mid = (lo + hi) // 2
        c = compare(mid, n, m)
        if c == 0:
            return mid
        if c < 0:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```
