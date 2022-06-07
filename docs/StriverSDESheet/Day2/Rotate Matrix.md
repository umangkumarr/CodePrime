---
sidebar_position : 1
---

# Rotate Matrix

## Problem Link
https://leetcode.com/problems/rotate-image/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        for (int i = 0; i < n / 2; i++) {
            for (int j = 0; j < n - 2 * i - 1; j++) {
                swap(matrix[i][i + j], matrix[n - i - 1 - j][i]);
                swap(matrix[n - i - 1 - j][i],
                     matrix[n - i - 1][n - i - 1 - j]);
                swap(matrix[n - i - 1][n - i - 1 - j],
                     matrix[i + j][n - i - 1]);
            }
        }
    }
};
```
</TabItem>
</Tabs>
