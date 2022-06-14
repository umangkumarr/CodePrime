---
tags: [Math, Recursion, Bit Masking, Facebook]
---

# Pow(x, n)

## Problem Link
https://leetcode.com/problems/powx-n/

## Solution Approach

Expected Time complexity: $O(logn)$

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
