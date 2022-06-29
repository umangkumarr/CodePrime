---
sidebar_position : 1
tags: [Two Pointer, String, String Matching]
---

#  Implement strStr()

## Problem Link
https://leetcode.com/problems/implement-strstr/

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
