---
title: "Permutation Sequence"
description: "The set [1, 2, 3, ..., n] contains a total of n! unique permutations. By listing and labeling all of the permutations in order, we get the following…"
source: "https://leetcode.com/problems/permutation-sequence/"
tags: ["Math", "Recursion"]
complexity:
  time: "O(n^2)"
  space: "O(n)"
---

## Problem

<p>The set <code>[1, 2, 3, ...,&nbsp;n]</code> contains a total of <code>n!</code> unique permutations.</p>

<p>By listing and labeling all of the permutations in order, we get the following sequence for <code>n = 3</code>:</p>

<ol>
	<li><code>&quot;123&quot;</code></li>
	<li><code>&quot;132&quot;</code></li>
	<li><code>&quot;213&quot;</code></li>
	<li><code>&quot;231&quot;</code></li>
	<li><code>&quot;312&quot;</code></li>
	<li><code>&quot;321&quot;</code></li>
</ol>

<p>Given <code>n</code> and <code>k</code>, return the <code>kth</code> permutation sequence.</p>

## Solution approach

### Intuition

This one comes down to maths and observation. Permutations of `n` digits in sorted order fall into blocks by their first digit, and each block contains `(n - 1)!` permutations. So the first digit of the `k`-th permutation is the `ceil(k / (n - 1)!)`-th smallest unused digit. Once we subtract the skipped blocks, the same reasoning repeats for the next position with `(n - 2)!`, and so on. Generating all $n!$ permutations one by one would be far too slow.

### Algorithm

1. Precompute factorials in `fact`, and keep `vis` to mark digits already placed.
2. For each position `cnt` from `1` to `n`:
   - Compute the block number `a = ceil(k / fact[n - cnt])`.
   - Update `k` to its rank inside that block: `k - (a - 1) * fact[n - cnt]`. If `k` is ever `0`, the code falls back to `a = 1`.
   - Scan `v` upward from `1`, skipping digits marked in `vis`, until the `a`-th unused digit is found.
   - Write that digit into `s[cnt - 1]` and mark it in `vis`.
3. Return `s`.

### Complexity

- **Time:** $O(n^2)$ — for each of the `n` positions, finding the `a`-th unused digit scans up to `n` values.
- **Space:** $O(n)$ — the `fact` and `vis` arrays and the output string.

## Code

```cpp title="C++"
class Solution {
   public:
    string getPermutation(int n, int k) {
        vector<int> fact(n + 1), vis(n + 1);
        fact[0] = 1, fact[1] = 1;
        for (int i = 2; i <= n; i++) fact[i] = fact[i - 1] * i;

        string s(n, ' ');
        int cnt = 1;
        while (cnt <= n) {
            int a = ceil(k / (1.0 * fact[n - cnt]));
            if (k == 0)
                a = 1;
            else
                k = abs((a - 1) * fact[n - cnt] - k);
            int t = 0, v = 1;
            while (t < a) {
                if (vis[v])
                    v++;
                else
                    t++, v++;
            }
            a = v - 1;
            s[cnt - 1] = a + '0';
            cnt++;
            vis[a] = 1;
        }

        return s;
    }
};

```
