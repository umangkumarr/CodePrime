---
sidebar_position : 6
tags: [Math, Recursion]
---

# Permutation Sequence

## Problem Link
https://leetcode.com/problems/permutation-sequence/

## Solution Approach
Math and observation. 

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
