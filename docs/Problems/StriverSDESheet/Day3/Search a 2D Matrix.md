---
sidebar_position : 1
---

# Search a 2D Matrix

## Problem Link
https://leetcode.com/problems/search-a-2d-matrix/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int n = matrix.size();
        int start = 0, end = n - 1;
        int mid, indx = 0;

        while (start <= end) {
            mid = (start + end) / 2;
            if (matrix[mid][0] > target) {
                end = mid - 1;
            } else {
                indx = mid;
                start = mid + 1;
            }
        }

        start = 0, end = matrix[0].size() - 1;
        int i = 0;
        while (start <= end) {
            mid = (start + end) / 2;
            if (matrix[indx][mid] > target) {
                end = mid - 1;
            } else {
                i = mid;
                start = mid + 1;
            }
        }
        if (matrix[indx][i] == target) return true;
        return false;
    }
};
```
</TabItem>
</Tabs>
