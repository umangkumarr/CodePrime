---
displayed_sidebar: null
sidebar_position : 17
tags: [Math, Dynamic Programming, Combinatorics]
---

# Unique Paths

## [Problem](https://leetcode.com/problems/unique-paths/)

<p>There is a robot on an <code>m x n</code> grid. The robot is initially located at the <strong>top-left corner</strong> (i.e., <code>grid[0][0]</code>). The robot tries to move to the <strong>bottom-right corner</strong> (i.e., <code>grid[m - 1][n - 1]</code>). The robot can only move either down or right at any point in time.</p>

<p>Given the two integers <code>m</code> and <code>n</code>, return <em>the number of possible unique paths that the robot can take to reach the bottom-right corner</em>.</p>

<p>The test cases are generated so that the answer will be less than or equal to <code>2 * 109</code>.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

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

</details>
