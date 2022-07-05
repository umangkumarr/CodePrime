---
displayed_sidebar: null
sidebar_position : 11
tags: [Array, Math, Matrix]
---

# Rotate Image

## [Problem](https://leetcode.com/problems/rotate-image/)

<p>You are given an <code>n x n</code> 2D <code>matrix</code> representing an image, rotate the image by <strong>90</strong> degrees (clockwise).</p>

<p>You have to rotate the image <a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank"><strong>in-place</strong></a>, which means you have to modify the input 2D matrix directly. <strong>DO NOT</strong> allocate another 2D matrix and do the rotation.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

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

</details>
