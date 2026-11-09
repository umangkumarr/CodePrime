---
title: "Super Egg Drop"
description: "Find the minimum number of drops that identifies the critical floor with k eggs and n floors, by flipping the DP to 'floors covered by m moves' and binary searching m."
source: "https://leetcode.com/problems/super-egg-drop/"
difficulty: "Hard"
tags: ["Math", "Binary Search", "Dynamic Programming"]
complexity:
  time: "O(k \\log n)"
  space: "O(1)"
---

## Problem

You are given `k` identical eggs and you have access to a building with `n` floors labeled from `1` to `n`.

You know that there exists a floor `f` where `0 <= f <= n` such that any egg dropped at a floor **higher** than `f` will **break**, and any egg dropped **at or below** floor `f` will **not break**.

Each move, you may take an unbroken egg and drop it from any floor `x` (where `1 <= x <= n`). If the egg breaks, you can no longer use it. However, if the egg does not break, you may **reuse** it in future moves.

Return *the **minimum number of moves** that you need to determine **with certainty** what the value of* `f` is.

**Example 1:**

```text
Input:  k = 1, n = 2
Output: 2
Explanation:
Drop the egg from floor 1. If it breaks, we know that f = 0.
Otherwise, drop the egg from floor 2. If it breaks, we know that f = 1.
If it does not break, then we know f = 2.
Hence, we need at minimum 2 moves to determine with certainty what the value of f is.
```

**Example 2:**

```text
Input:  k = 2, n = 6
Output: 3
```

**Example 3:**

```text
Input:  k = 3, n = 14
Output: 4
```

**Constraints:**

- $1 \le k \le 100$
- $1 \le n \le 10^4$

## Solution approach

### Intuition

The textbook DP asks "with `k` eggs and `n` floors, how many moves are needed?" and tries every floor for the first drop — $O(k n^2)$, or $O(k n \log n)$ with a binary search, both too slow or too fiddly. Turning the question around makes it simple:

> With `m` moves and `j` eggs, what is the **largest number of floors** `F(m, j)` whose critical floor we can always determine?

Make the first drop from some floor `x`:

- if the egg **breaks**, `f` is below `x`; with `m - 1` moves and `j - 1` eggs we can handle `F(m - 1, j - 1)` floors underneath;
- if it **survives**, `f >= x`; with `m - 1` moves and `j` eggs we can handle `F(m - 1, j)` floors above.

Choosing `x = F(m - 1, j - 1) + 1` uses both outcomes fully, so

$$
F(m, j) = F(m - 1, j - 1) + F(m - 1, j) + 1, \qquad F(0, j) = F(m, 0) = 0.
$$

The answer is the smallest `m` with `F(m, k) >= n`.

This recurrence has a closed form. Adding 1 to both sides shows that $G(m, j) = F(m, j) + 1$ satisfies Pascal-like rules, and solving it gives

$$
F(m, k) = \sum_{i=1}^{k} \binom{m}{i}.
$$

(Intuitively: a strategy with `m` moves is a sequence of `m` break / no-break outcomes with at most `k` breaks, and each such outcome pattern identifies a different floor.) `F(m, k)` grows with `m`, so we can **binary search** on `m` in `[1, n]` — `n` moves always suffice, even with one egg, by trying floors `1, 2, ..., n`.

### Algorithm

1. `floorsCovered(m, k, n)` returns $\min\left(n, \sum_{i=1}^{\min(k, m)} \binom{m}{i}\right)$. It builds each $\binom{m}{i}$ from the previous one with `c = c * (m - i + 1) / i` (exact integer division) and stops as soon as the running `total` reaches `n`, which keeps every number below $10^4 \cdot 10^4$.
2. Binary search the smallest `m` in `[lo, hi] = [1, n]` with `floorsCovered(m, k, n) >= n`.

### Walkthrough

The table `F(m, j)` for Example 3 (`k = 3`, `n = 14`), filled row by row with the recurrence (each cell = up-left + up + 1). The first row in which the `j = 3` column reaches `14` is `m = 4`:

![Filling F(m, j) = F(m-1, j-1) + F(m-1, j) + 1 for k = 3](/img/codes/super-egg-drop/moves-table.gif)

### Complexity

- **Time:** $O(k \log n)$ — $O(\log n)$ binary-search steps, each summing at most `k` binomial terms.
- **Space:** $O(1)$.

### Edge cases

- **One egg:** `floorsCovered(m, 1, n) = m`, so the search returns `n` — a linear scan from the bottom is forced.
- **Many eggs** (`k >= log2(n + 1)`): the sum reaches $2^m - 1$, and the answer is the binary-search depth $\lceil \log_2(n + 1) \rceil$.
- **Overflow:** terms with `i > m` are zero and skipped, and the early return keeps `c` and `total` small, so 64-bit arithmetic is ample.

## Code

```cpp
class Solution {
    // Floors that m moves and k eggs can fully resolve: sum of C(m, i) for i = 1..k, capped at n.
    static int floorsCovered(int m, int k, int n) {
        long long total = 0, c = 1;  // c = C(m, i)
        for (int i = 1; i <= k && i <= m; i++) {
            c = c * (m - i + 1) / i;
            total += c;
            if (total >= n) return n;
        }
        return total;
    }

   public:
    int superEggDrop(int k, int n) {
        int lo = 1, hi = n;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (floorsCovered(mid, k, n) >= n) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo;
    }
};
```

```java
class Solution {
    // Floors that m moves and k eggs can fully resolve: sum of C(m, i) for i = 1..k, capped at n.
    private static int floorsCovered(int m, int k, int n) {
        long total = 0, c = 1;  // c = C(m, i)
        for (int i = 1; i <= k && i <= m; i++) {
            c = c * (m - i + 1) / i;
            total += c;
            if (total >= n) return n;
        }
        return (int) total;
    }

    public int superEggDrop(int k, int n) {
        int lo = 1, hi = n;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (floorsCovered(mid, k, n) >= n) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo;
    }
}
```

```python
class Solution:
    def superEggDrop(self, k: int, n: int) -> int:
        # Floors that m moves and k eggs can fully resolve: sum of C(m, i) for i = 1..k, capped at n.
        def floors_covered(m):
            total, c = 0, 1  # c = C(m, i)
            for i in range(1, min(k, m) + 1):
                c = c * (m - i + 1) // i
                total += c
                if total >= n:
                    return n
            return total

        lo, hi = 1, n
        while lo < hi:
            mid = (lo + hi) // 2
            if floors_covered(mid) >= n:
                hi = mid
            else:
                lo = mid + 1
        return lo
```
