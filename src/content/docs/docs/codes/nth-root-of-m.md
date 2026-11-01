---
title: "The N-th root of an integer"
description: "You are given two positive integers N and M. You have to find the Nth root of M i.e. M^(1/N)"
source: "https://www.codingninjas.com/codestudio/problems/1062679?topList=striver-sde-sheet-problems&utm_source=striver&utm_medium=website"
tags: ["Math", "Divide Conquer"]
complexity:
  time: "O(1)"
  space: "O(1)"
---

## Problem

You are given two positive integers N and M. You have to find the Nth root of M i.e. M^(1/N)

## Solution approach

### Intuition

The `N`-th root of `M` is the same as raising `M` to the power `1 / N`. A divide-and-conquer approach (binary search on the answer) would work, but this code simply hands the job to the standard library: `pow(m, 1.0 / n)` computes the root directly in floating point.

### Algorithm

1. Compute `1.0 / n` as a `double`, so the division is not integer division.
2. Return `pow(m, 1.0 / n)`.

### Complexity

- **Time:** $O(1)$ — a single call to `pow`.
- **Space:** $O(1)$ — no extra storage is used.

### Edge cases

- **Floating-point precision**: for perfect powers the result can come out slightly off, for example very close to `3` but not exactly `3`, so any comparison should allow a small tolerance.

## Code

```cpp title="C++"
#include <bits/stdc++.h>
double findNthRootOfM(int n, long long m) {
    return pow(m, (1.0 / n));
}
```
