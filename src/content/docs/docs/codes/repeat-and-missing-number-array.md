---
title: "Repeat and Missing Number Array"
description: "You are given a read only array of n integers from 1 to n. Each integer appears exactly once except A which appears twice and B which is missing. Return A…"
source: "https://www.interviewbit.com/problems/repeat-and-missing-number-array/"
tags: ["Array", "Hash Table"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<div>

<p>You are given a read only array of n integers from 1 to n.</p>

<p>Each integer appears exactly once except A which appears twice and B which is missing.</p>

<p>Return A and B.</p>

<p><em>Note: Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?</em></p>

<p><em>Note that in your output A should precede B.</em></p>

<p><strong>Example:</strong></p>

```
Input:[3 1 2 5 3]

Output:[3, 4]

A = 3, B = 4
```

</div>

## Solution approach

### Intuition

Let `A` be the repeated number and `B` the missing one. Comparing the array with the ideal list `1..n` gives two equations:

- Sum: $\sum (1..n) - \sum A_i = B - A$
- Sum of squares: $\sum (1..n)^2 - \sum A_i^2 = B^2 - A^2 = (B - A)(B + A)$

Dividing the second difference by the first gives $B + A$. With $B - A$ and $B + A$ known, both numbers follow, and no extra array or sorting is needed.

### Algorithm

1. In one loop, accumulate `sm` (sum of elements), `sm2` (sum of their squares) and `sm4` (sum of $i^2$ for $i = 1..n$).
2. Compute `sm1 = n(n + 1) / 2` and `rel1 = sm1 - sm`, which is $B - A$.
3. Compute `rel2 = (sm4 - sm2) / rel1`, which is $B + A$.
4. Swap so that `rel1` holds the larger value $B + A$ and `rel2` holds $B - A$.
5. Then `x = (rel1 + rel2) / 2` is the missing number $B$ and `y = (rel1 - rel2) / 2` is the repeated number $A$. Return `{y, x}`.

### Complexity

- **Time:** $O(n)$ — one pass over the array.
- **Space:** $O(1)$ — a handful of counters.

### Edge cases

- **Large values:** `A[i] * A[i]` and `(i + 1) * (i + 1)` are computed in `int` before being added to the `long long` sums, so they overflow once values pass about $46340$.

## Code

```cpp title="C++"
vector<int> Solution::repeatedNumber(const vector<int> &A) {
    long long sm = 0, sm1 = 0, sm2 = 0, sm4 = 0;
    long long n = A.size();
    for (int i = 0; i < n; i++) {
        sm += A[i];
        sm2 += A[i] * A[i];
        sm4 += (i + 1) * (i + 1);
    }
    sm1 = (n * (n + 1ll) / 2ll);
    long long rel1 = sm1 - sm;
    long long rel2 = (sm4 - sm2) / rel1;
    if (rel1 < rel2) swap(rel1, rel2);
    long long x = (rel1 + rel2) / 2ll;
    long long y = (rel1 - rel2) / 2ll;
    vector<int> aa = {y, x};
    return aa;
}

```
