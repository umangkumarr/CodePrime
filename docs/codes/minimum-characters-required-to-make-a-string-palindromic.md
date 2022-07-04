---
sidebar_position : 2
tags: [Two Pointer, String, String Matching]
---

#  Minimum Characters required to make a String Palindromic

## [Problem](https://www.interviewbit.com/problems/minimum-characters-required-to-make-a-string-palindromic/)

Given an string A. The only operation allowed is to insert  characters in the beginning of the string.

Find how many minimum characters are needed to be inserted to make the string a palindrome string.

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
