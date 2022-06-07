---
sidebar_position : 2
---

# Pascal's Triangle

## Problem Link
https://leetcode.com/problems/pascals-triangle/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<vector<int>> generate(int n) {
        vector<vector<int>> ans;
        vector<int> a, b;
        a = {1};
        ans.push_back(a);
        if (n == 1) return ans;
        for (int i = 2; i <= n; i++) {
            b.push_back(1);
            for (int k = 0; k < a.size() - 1; k++) {
                b.push_back(a[k] + a[k + 1]);
            }
            b.push_back(1);
            ans.push_back(b);
            a = b;
            b.clear();
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>
