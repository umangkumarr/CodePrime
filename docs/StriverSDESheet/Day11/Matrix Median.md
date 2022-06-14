---
sidebar_position : 2
tags: [Divide Conquer, Matrix]
---

# Matrix Median

## Problem Link
https://www.interviewbit.com/problems/matrix-median/

## Solution Approach
Use Divide and conquer approach to find an element $x$ such that no. of element less than equal x present in the matrix are exactly $(r*c)/2$.
Which can be calculated using binary search on every row by finding the no. of element less than equal x present in the rth row. Then sum them up and check if the sum makes up to $(r*c)/2$ then $x$ is the answer.

Expected Time complexity: $O(36*r*logc)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
int Solution::findMedian(vector<vector<int> > &A) {
    int min = INT_MAX, max = INT_MIN;
    int n = A.size();
    int m = A[0].size();
    for (int i = 0; i < n; i++) {
        min = min < A[i][0] ? min : A[i][0];
        max = max > A[i][m - 1] ? max : A[i][m - 1];
    }

    int desired = (m * n + 1) / 2;
    while (min < max) {
        int mid = min + (max - min) / 2;
        int p = 0;
        for (int i = 0; i < n; i++) {
            p += upper_bound(A[i].begin(), A[i].end(), mid) - A[i].begin();
        }
        if (p < desired) {
            min = mid + 1;
        } else
            max = mid;
    }
    return min;
}

```
</TabItem>
</Tabs>

</details>
