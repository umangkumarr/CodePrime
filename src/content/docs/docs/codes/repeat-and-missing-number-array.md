---
title: "Repeat and Missing Number Array"
description: "Find the number that appears twice and the number that is missing in a read-only array of 1..n, in O(n) time and O(1) space using the sum and sum of squares."
source: "https://www.interviewbit.com/problems/repeat-and-missing-number-array/"
difficulty: "Medium"
tags: ["Array", "Math"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

You are given a **read-only** array of `n` integers from `1` to `n`.

Each integer appears exactly once except `A`, which appears twice, and `B`, which is missing.

Return `A` and `B`.

*Note: Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?*

*Note that in your output `A` should precede `B`.*

**Example:**

```text
Input:  [3 1 2 5 3]
Output: [3, 4]
Explanation: A = 3 appears twice and B = 4 is missing.
```

InterviewBit adds: this problem checks how you handle **overflows** — make sure your solution works when the number of elements is as large as $10^5$.

**Constraints (assumed from the note above):**

- $2 \le n \le 10^5$
- Every element is in the range $[1, n]$; exactly one value appears twice and exactly one value is missing.

Complete the function `repeatedNumber(const vector<int> &A)`, which returns `{A, B}`.

## Solution approach

### Intuition

Compare the given array with the ideal array `1, 2, ..., n`. They differ in a single slot: the array holds an extra copy of the repeated value `A` where the missing value `B` should be. So any sum over the array minus the same sum over `1..n` only "sees" `A` and `B`:

- Sum of values: $\sum a_i - \sum_{k=1}^{n} k = A - B$
- Sum of squares: $\sum a_i^2 - \sum_{k=1}^{n} k^2 = A^2 - B^2 = (A - B)(A + B)$

Since `A != B`, the first difference is non-zero, so dividing the second by the first gives `A + B`. Two linear equations in two unknowns then give `A = ((A - B) + (A + B)) / 2` and `B = A - (A - B)`.

The array is read-only, which rules out marking visited values by negating them, and $O(1)$ space rules out a frequency table — the two sums need neither.

### Algorithm

1. In one loop over indices `i = 1..n`, accumulate `diff += a[i-1] - i` and `sqDiff += a[i-1]^2 - i^2`, both as `long long`.
2. `diff` is $A - B$ and `sqDiff` is $A^2 - B^2$, so `sum = sqDiff / diff` is $A + B$ (the division is exact).
3. `repeated = (diff + sum) / 2`, `missing = repeated - diff`. Return `{repeated, missing}`.

### Walkthrough

For `[3 1 2 5 3]`, `n = 5`:

- `diff = (3+1+2+5+3) - (1+2+3+4+5) = 14 - 15 = -1`, so $A - B = -1$.
- `sqDiff = (9+1+4+25+9) - (1+4+9+16+25) = 48 - 55 = -7`, so $A + B = -7 / -1 = 7$.
- `repeated = (-1 + 7) / 2 = 3`, `missing = 3 - (-1) = 4`.

### Complexity

- **Time:** $O(n)$ — a single pass.
- **Space:** $O(1)$ — two accumulators.

### Edge cases

- **Overflow:** a plain sum of squares reaches about $n^3 / 3 \approx 3.3 \times 10^{14}$ for $n = 10^5$, far beyond `int`. Accumulating the *differences* in `long long`, with each square computed in `long long`, keeps every intermediate value small and exact.
- **Repeated value larger or smaller than the missing one:** `diff` may be negative; integer division of `sqDiff` by `diff` is still exact, and `diff + sum = 2A` is always positive and even.

## Code

```cpp title="C++"
vector<int> Solution::repeatedNumber(const vector<int> &A) {
    long long diff = 0, sqDiff = 0;  // sum(a) - sum(1..n), sum(a^2) - sum(k^2)
    for (long long i = 1; i <= (long long)A.size(); i++) {
        long long v = A[i - 1];
        diff += v - i;
        sqDiff += v * v - i * i;
    }
    long long sum = sqDiff / diff;  // A + B
    long long repeated = (diff + sum) / 2;
    long long missing = repeated - diff;
    return {(int)repeated, (int)missing};
}
```
