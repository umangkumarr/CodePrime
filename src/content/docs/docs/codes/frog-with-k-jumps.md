---
title: "Frog with k jumps"
description: "There are N stones, numbered 1,2,…,N. For each i (1≤i≤N), the height of Stone i is hi. There is a frog who is initially on Stone 1. He will repeat the…"
source: "https://atcoder.jp/contests/dp/tasks/dp_b"
tags: ["Dynamic Programming"]
complexity:
  time: "O(n \\cdot k)"
  space: "O(n)"
---

## Problem

There are $N$ stones, numbered $1,2,…,N$. For each $i (1≤i≤N)$, the height of Stone $i$ is $h_i$.

There is a frog who is initially on Stone $1$. He will repeat the following action some number of times to reach Stone $N$:
1. If the frong is currently on stone $i$, jump to one of following: Stone $i+1,i+2,...,i+K$. Here, a cost of $|h_i-h_j|$ is incurred, where j is the stone to land on.

Find the minimum possible total cost incurred before the frog reaches Stone $N$.

## Solution approach

### Intuition

To reach stone `i`, the frog's last jump came from one of the previous `k` stones. If we already know the cheapest cost to reach each of those stones, the cheapest cost for stone `i` is the best of `cost to reach j + |a[i] - a[j]|` over those `j`. This is a one-dimensional DP filled from left to right.

### Algorithm

1. Read `n`, `k` and the heights `a`.
2. Set `ans[0] = 0` and every other `ans[i]` to `INT_MAX`.
3. For each `i` from `1` to `n - 1`, try every `j` from `i - 1` down to `max(0, i - k)` and update `ans[i] = min(ans[i], abs(a[i] - a[j]) + ans[j])`.
4. Print `ans[n - 1]`.

### Complexity

- **Time:** $O(n \cdot k)$ — for each stone, up to `k` previous stones are checked.
- **Space:** $O(n)$ — the arrays `a` and `ans`.

### Edge cases

- **`k >= n`:** the inner loop is stopped by `j >= 0`, so every earlier stone is tried.
- The snippet relies on `n`, `k` and the `vl` (vector of `long long`) alias from the author's template.

## Code

```cpp title="C++"
void solve() {
    cin >> n >> k;
    vl a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    vl ans(n, INT_MAX);
    ans[0] = 0;
    for (int i = 1; i < n; i++) {
        for (int j = i - 1; j >= 0 && j >= i - k; j--) {
            ans[i] = min(ans[i], abs(a[i] - a[j]) + ans[j]);
        }
    }
    cout << ans[n - 1];
}
```
