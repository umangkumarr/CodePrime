---
displayed_sidebar: null
sidebar_position : 15
tags: [Math, Recursion]
---

# Pow(x, n)

## [Problem](https://leetcode.com/problems/powx-n/)

<p>Implement <a href="http://www.cplusplus.com/reference/valarray/pow/" target="_blank">pow(x, n)</a>, which calculates <code>x</code> raised to the power <code>n</code> (i.e., <code>xn</code>).</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    double myPow(double x, int m) {
        long double a = x;
        long double ans = 1;
        int nn = m;
        long long n = abs(m);
        while (n) {
            long long bit = (1ll & n);
            if (bit) {
                ans *= a;
            }
            a *= a;
            n >>= 1;
        }
        if (nn < 0) {
            ans = 1.0 / ans;
        }
        return ans;
    }
};

```
</TabItem>
</Tabs>

</details>
