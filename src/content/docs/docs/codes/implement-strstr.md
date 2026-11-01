---
title: "Implement strStr()"
description: "Implement strStr(). Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of…"
source: "https://leetcode.com/problems/implement-strstr/"
tags: ["Two Pointers", "String", "String Matching"]
complexity:
  time: "O((n + m) \\log M)"
  space: "O(m)"
---

## Problem

<p>Implement <a href="http://www.cplusplus.com/reference/cstring/strstr/" target="_blank">strStr()</a>.</p>

<p>Given two strings <code>needle</code> and <code>haystack</code>, return the index of the first occurrence of <code>needle</code> in <code>haystack</code>, or <code>-1</code> if <code>needle</code> is not part of <code>haystack</code>.</p>

<p><strong>Clarification:</strong></p>

<p>What should we return when <code>needle</code> is an empty string? This is a great question to ask during an interview.</p>

<p>For the purpose of this problem, we will return 0 when <code>needle</code> is an empty string. This is consistent to C&#39;s <a href="http://www.cplusplus.com/reference/cstring/strstr/" target="_blank">strstr()</a> and Java&#39;s <a href="https://docs.oracle.com/javase/7/docs/api/java/lang/String.html#indexOf(java.lang.String)" target="_blank">indexOf()</a>.</p>

## Solution approach

### Intuition

Comparing the pattern against every window character by character costs $O(n \cdot m)$. A rolling hash turns each window into a number, so a window can be compared with the pattern in $O(1)$, and the hash of the next window is computed from the previous one instead of from scratch.

Here the hash of a string is $\sum_i (s_i - \text{'a'} + 1) \cdot p^i \bmod M$ with $p = 31$ and $M = 10^9 + 7$. To slide the window, the code subtracts the leaving character (it has weight $p^0$), divides by $p$ using the modular inverse, and adds the entering character with weight $p^{m-1}$.

### Algorithm

1. `powr(a, b)` is fast modular exponentiation; `inv(a)` is $a^{M-2} \bmod M$ (Fermat's little theorem).
2. `hashit(s)` computes the hash above.
3. Compute `pat_hash` and the hash of the first window `s.substr(0, m)`. If they are equal, return `0`.
4. For each `i` from `m` to `n - 1`: remove `s[i - m]`, multiply by `inv(p)`, add `(s[i] - 'a' + 1) * powr(p, m - 1)`, and reduce modulo `mod`. If `new_hash == pat_hash`, return `i - m + 1`.
5. Return `-1` if no window matched.

### Complexity

- **Time:** $O((n + m) \log M)$ — every step calls `powr` and `inv`, which take $O(\log M)$, about 30 iterations each.
- **Space:** $O(m)$ — the copied first-window substring.

### Edge cases

- A match is accepted on hash equality alone, without comparing characters, so a hash collision would give a wrong index.
- Intermediate products like `ans *= (long long)a` are stored back into `int` before taking the modulus, so they can overflow.

## Code

```cpp title="C++"
const int mod = 1e9 + 7;
const int p = 31;

int powr(int a, int b) {
    int ans = 1;
    while (b) {
        if (b & 1ll) {
            ans *= (long long)a;
            ans %= mod;
        }
        a *= (long long)a;
        b >>= 1ll;
        a %= mod;
    }
    return ans;
}

int inv(int a) { return powr(a, mod - 2); }

int hashit(string s) {
    int res = 0;
    int m = s.length();
    for (int i = 0; i < m; i++) {
        res += powr(p, i) * (s[i] - 'a' + 1);
        res %= mod;
    }
    return res;
}

class Solution {
   public:
    int strStr(string s, string pat) {
        int pat_hash = hashit(pat);
        int m = pat.length();
        int n = s.length();
        int text_hash = hashit(s.substr(0, m));
        if (text_hash == pat_hash) {
            return 0;
        }

        int new_hash = text_hash;

        for (int i = m; i < n; i++) {
            new_hash -= (s[i - m] - 'a' + 1);
            new_hash *= (long long)inv(p);
            new_hash %= mod;
            new_hash += (s[i] - 'a' + 1) * powr(p, m - 1);
            new_hash %= mod;

            if (new_hash == pat_hash) {
                return i - m + 1;
            }
        }
        return -1;
    }
};

```
