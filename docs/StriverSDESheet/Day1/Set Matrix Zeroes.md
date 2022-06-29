---
sidebar_position : 1
tags: [Array, Hash Table, Matrix]
---

# Set Matrix Zeroes

## [Problem](https://leetcode.com/problems/set-matrix-zeroes/)

<p>Given an <code>m x n</code> integer matrix <code>matrix</code>, if an element is <code>0</code>, set its entire row and column to <code>0</code>&#39;s.</p>

<p>You must do it <a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank">in place</a>.</p>

<p>&nbsp;</p>


## Solution Approach

Expected Time complexity: $O(n^3)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

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

</details>
