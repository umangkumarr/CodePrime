---
title: "Minimum Characters required to make a String Palindromic"
description: "Given an string A. The only operation allowed is to insert characters in the beginning of the string. Find how many minimum characters are needed to be…"
source: "https://www.interviewbit.com/problems/minimum-characters-required-to-make-a-string-palindromic/"
tags: ["Two Pointer", "String", "String Matching"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

Given an string A. The only operation allowed is to insert  characters in the beginning of the string.

Find how many minimum characters are needed to be inserted to make the string a palindrome string.

## Solution approach

### Intuition

Characters can only be added at the front, so the part that is already fine is the longest palindromic prefix of `A`. Everything after that prefix must be mirrored in front, so the answer is `n` minus the length of the longest palindromic prefix.

To test prefixes quickly, the code uses polynomial rolling hashes with base `p = 31` modulo `mod`. A prefix is a palindrome when its forward hash equals the hash of its reversal. The reversal of `A[0..k]` is a suffix of the reversed string `s`, so dropping the first character of `s` at each step walks through shorter and shorter prefixes of `A`.

### Algorithm

1. Let `s` be `A` reversed. Build `dp[i]`, the hash of `A[0..i]`, where character `j` is weighted by `powr(p, j)`.
2. Compute `kmp`, the hash of the whole of `s` with the same weights. If `kmp == dp[n - 1]`, `A` is already a palindrome, so return `0`.
3. For `i = 0, 1, ...`, remove `s[i]` from the front of the hash: subtract its value (its weight is now `1`) and multiply by `inv(p)`, the modular inverse of `p`. Now `kmp` is the hash of the reversal of `A[0..n - i - 2]`.
4. If it equals `dp[n - i - 2]`, that prefix is a palindrome, and `i + 1` characters must be added. Return `i + 1`.

### Complexity

- **Time:** $O(n \log n)$ — each `powr(p, i)` call takes $O(\log i)$ steps, and each `inv(p)` call takes $O(\log mod)$ steps.
- **Space:** $O(n)$ — the `dp` array and the reversed copy `s`.

### Edge cases

- **A single character** is already a palindrome, so the answer is `0`.
- **Hash collisions** are possible in principle, since equal hashes do not strictly prove equal strings.

## Code

```cpp title="C++"
const int mod = 1e9 + 7;
const int p = 31;
#define ll long long

ll powr(ll a, ll b) {
    ll ans = 1;
    while (b) {
        if (b & 1ll) {
            ans *= a;
            ans %= mod;
        }
        a *= a;
        b >>= 1ll;
        a %= mod;
    }
    return ans;
}

ll inv(ll a) { return powr(a, mod - 2); }

int Solution::solve(string A) {
    string s = A;
    reverse(s.begin(), s.end());
    int n = A.length();
    ll dp[n];
    dp[0] = A[0] - 'a' + 1;
    for (int i = 1; i < n; i++) {
        dp[i] = (dp[i - 1] + (powr(p, i) * (A[i] - 'a' + 1)) % mod) % mod;
    }
    ll kmp = 0;
    for (int i = 0; i < n; i++) {
        kmp += powr(p, i) * (s[i] - 'a' + 1);
        kmp %= mod;
    }
    if (kmp == dp[n - 1]) {
        return 0;
    }
    for (int i = 0; i < n; i++) {
        kmp -= (s[i] - 'a' + 1);
        kmp *= inv(p);
        kmp %= mod;
        kmp += mod;
        kmp %= mod;
        if (kmp == dp[n - i - 2]) {
            return i + 1;
        }
    }
}

```
