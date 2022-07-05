---
displayed_sidebar: null
sidebar_position : 14
tags: [Array, Binary Search, Matrix]
---

# Search a 2D Matrix

## [Problem](https://leetcode.com/problems/search-a-2d-matrix/)

<p>Write an efficient algorithm that searches for a value <code>target</code> in an <code>m x n</code> integer matrix <code>matrix</code>. This matrix has the following properties:</p>

<ul>
	<li>Integers in each row are sorted from left to right.</li>
	<li>The first integer of each row is greater than the last integer of the previous row.</li>
</ul>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

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

</details>
