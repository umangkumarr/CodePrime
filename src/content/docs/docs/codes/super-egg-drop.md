---
title: "Super Egg Drop"
description: "You are given k identical eggs and you have access to a building with n floors labeled from 1 to n. You know that there exists a floor f where 0 <= f <= n…"
source: "https://leetcode.com/problems/super-egg-drop/"
tags: ["Math", "Binary Search", "Dynamic Programming"]
complexity:
  time: "O(k \\log n)"
  space: "O(1)"
---

## Problem

<p>You are given <code>k</code> identical eggs and you have access to a building with <code>n</code> floors labeled from <code>1</code> to <code>n</code>.</p>

<p>You know that there exists a floor <code>f</code> where <code>0 &lt;= f &lt;= n</code> such that any egg dropped at a floor <strong>higher</strong> than <code>f</code> will <strong>break</strong>, and any egg dropped <strong>at or below</strong> floor <code>f</code> will <strong>not break</strong>.</p>

<p>Each move, you may take an unbroken egg and drop it from any floor <code>x</code> (where <code>1 &lt;= x &lt;= n</code>). If the egg breaks, you can no longer use it. However, if the egg does not break, you may <strong>reuse</strong> it in future moves.</p>

<p>Return <em>the <strong>minimum number of moves</strong> that you need to determine <strong>with certainty</strong> what the value of </em><code>f</code> is.</p>

## Solution approach

### Intuition

Turn the question around: with `k` eggs and `x` moves, what is the largest number of floors we can always resolve? Call it $f(x, k)$. Dropping an egg splits the problem into "it broke" ($x - 1$ moves, $k - 1$ eggs) and "it survived" ($x - 1$ moves, $k$ eggs), so $f(x, k) = f(x-1, k-1) + f(x-1, k) + 1$. This recurrence solves to

$$f(x, k) = \sum_{i=1}^{k} \binom{x}{i}.$$

$f$ grows with $x$, so the answer is the smallest `x` with $f(x, k) \ge n$, which we find by binary search.

### Algorithm

1. `binomialCoeff(x, k, n)` builds $\binom{x}{i}$ incrementally in `t` (`t *= x - i + 1; t /= i`) and adds it to `sum` for `i = 1..k`. It returns `n` early once `sum > n`, which also keeps the numbers small.
2. In `superEggDrop`, binary search `x` over `[l, h] = [1, n]`.
3. If `binomialCoeff(mid, k, n) < n`, `mid` moves are not enough, so set `l = mid + 1`; otherwise set `h = mid`.
4. Return `l`.

### Complexity

- **Time:** $O(k \log n)$ — $\log n$ binary-search steps, each computing a sum of at most `k` terms.
- **Space:** $O(1)$ — only a few integers.

### Edge cases

- **One egg** (`k = 1`): $f(x, 1) = x$, so the answer is `n`, matching a floor-by-floor search.

## Code

```cpp title="C++"
class Solution {
   public:
    int binomialCoeff(int x, int k, int n) {
        int sum = 0;
        int t = 1;
        for (int i = 1; i <= k; i++) {
            t *= x - i + 1;
            t /= i;
            sum += t;
            if (sum > n) return n;
        }
        return sum;
    }

    int superEggDrop(int k, int n) {
        int l = 1, h = n;
        while (l < h) {
            int mid = (l + h) / 2;
            if (binomialCoeff(mid, k, n) < n) {
                l = mid + 1;
            } else
                h = mid;
        }
        return l;
    }
};

```
