---
sidebar_position : 5
tags: [Math, Binary Search, Dynamic Programming]
---

# Super Egg Drop

## [Problem](https://leetcode.com/problems/super-egg-drop/)

<p>You are given <code>k</code> identical eggs and you have access to a building with <code>n</code> floors labeled from <code>1</code> to <code>n</code>.</p>

<p>You know that there exists a floor <code>f</code> where <code>0 &lt;= f &lt;= n</code> such that any egg dropped at a floor <strong>higher</strong> than <code>f</code> will <strong>break</strong>, and any egg dropped <strong>at or below</strong> floor <code>f</code> will <strong>not break</strong>.</p>

<p>Each move, you may take an unbroken egg and drop it from any floor <code>x</code> (where <code>1 &lt;= x &lt;= n</code>). If the egg breaks, you can no longer use it. However, if the egg does not break, you may <strong>reuse</strong> it in future moves.</p>

<p>Return <em>the <strong>minimum number of moves</strong> that you need to determine <strong>with certainty</strong> what the value of </em><code>f</code> is.</p>

<p>&nbsp;</p>


## Solution Approach

Expected Time complexity: $O(klogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int binomialCoeff(int x, int k, int n) {
        int sum = 0;
        int t = 1;
        for (int i = 1; i <= k; i++) {
            t *= x - i + 1;
            t /= i;
            sum += t;
            if (sum > n) return n;
        }
        return sum;
    }

    int superEggDrop(int k, int n) {
        int l = 1, h = n;
        while (l < h) {
            int mid = (l + h) / 2;
            if (binomialCoeff(mid, k, n) < n) {
                l = mid + 1;
            } else
                h = mid;
        }
        return l;
    }
};
```
</TabItem>
</Tabs>

</details>
