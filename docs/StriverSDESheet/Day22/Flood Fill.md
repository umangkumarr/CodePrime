---
sidebar_position : 6
tags: [Breadth-First Search, Matrix, Array]
---

# Flood Fill

## Problem Link
https://leetcode.com/problems/flood-fill/

## Solution Approach

Expected Time complexity: $O(n^2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc,
                                  int color) {
        deque<pair<int, int>> q;
        int col = image[sr][sc];
        int n = image.size();
        int m = image[0].size();
        q.push_back({sr, sc});

        int dx[] = {1, -1, 0, 0};
        int dy[] = {0, 0, 1, -1};

        while (q.size()) {
            auto p = q.front();
            q.pop_front();
            int i = p.first, j = p.second;
            if (image[p.first][p.second] != col) continue;
            image[i][j] = -1;
            for (int k = 0; k < 4; k++) {
                int x = dx[k] + i;
                int y = dy[k] + j;
                if (x >= 0 && x < n && y >= 0 && y < m && image[x][y] == col)
                    q.push_back({x, y});
            }
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (image[i][j] == -1) image[i][j] = color;
            }
        }
        return image;
    }
};
```
</TabItem>
</Tabs>

</details>
