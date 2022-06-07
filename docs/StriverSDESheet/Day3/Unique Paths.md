---
sidebar_position : 5
---

#  Unique Paths

## Problem Link
https://leetcode.com/problems/unique-paths/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int uniquePaths(int m, int n) {
        long long ans = 1;
        if (m > n) swap(m, n);
        for (long long j = m + n - 2; j > n - 1; j--) {
            ans *= j;
            ans /= (m + n - 1 - j);
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>
