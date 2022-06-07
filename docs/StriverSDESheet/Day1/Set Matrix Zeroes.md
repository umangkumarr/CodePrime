---
sidebar_position : 1
---

# Set Matrix Zeroes

## Problem Link
https://leetcode.com/problems/set-matrix-zeroes/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    void setZeroes(vector<vector<int>>& matrix){
        vector<vector<int>> a = matrix;
        int n = matrix.size();
        int m = matrix[0].size();
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (matrix[i][j] == 0) {
                    for (int k = 0; k < n; k++) a[k][j] = 0;
                    for (int k = 0; k < m; k++) a[i][k] = 0;
                }
            }
        }
        matrix = a;
    }
};
```
</TabItem>
</Tabs>
