---
displayed_sidebar: null
sidebar_position : 4
tags: [Graph, Dynamic Programming]
---

# Floyd Warshall Algorithm

## [Problem](https://practice.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1)

The problem is to find shortest distances between every pair of vertices in a given edge weighted directed Graph. The Graph is represented as adjancency matrix, and the matrix denotes the weight of the edegs (if it exists) else -1. <strong>Do it in-place.</strong>

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
    void shortest_distance(vector<vector<int>>& matrix) {
        int v = matrix.size();
        for (int k = 0; k < v; k++) {      // vertex as intermediate
            for (int i = 0; i < v; i++) {  // all vertex as source one by one
                for (int j = 0; j < v; j++) {  // destination
                    if (matrix[i][k] == -1 || matrix[k][j] == -1) {
                        continue;
                    }
                    int cur = matrix[i][k] + matrix[k][j];

                    if (matrix[i][j] == -1) {
                        matrix[i][j] = cur;
                    }

                    else
                        matrix[i][j] = min(matrix[i][j], cur);
                }
            }
        }
    };
```
</TabItem>
</Tabs>

</details>
