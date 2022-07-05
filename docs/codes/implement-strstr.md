---
displayed_sidebar: null
sidebar_position : 98
tags: [Two Pointers, String, String Matching]
---

# Implement strStr()

## [Problem](https://leetcode.com/problems/implement-strstr/)

<p>Implement <a href="http://www.cplusplus.com/reference/cstring/strstr/" target="_blank">strStr()</a>.</p>

<p>Given two strings <code>needle</code> and <code>haystack</code>, return the index of the first occurrence of <code>needle</code> in <code>haystack</code>, or <code>-1</code> if <code>needle</code> is not part of <code>haystack</code>.</p>

<p><strong>Clarification:</strong></p>

<p>What should we return when <code>needle</code> is an empty string? This is a great question to ask during an interview.</p>

<p>For the purpose of this problem, we will return 0 when <code>needle</code> is an empty string. This is consistent to C&#39;s <a href="http://www.cplusplus.com/reference/cstring/strstr/" target="_blank">strstr()</a> and Java&#39;s <a href="https://docs.oracle.com/javase/7/docs/api/java/lang/String.html#indexOf(java.lang.String)" target="_blank">indexOf()</a>.</p>

## Solution Approach

Expected Time complexity: $O(nlog(n))$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
