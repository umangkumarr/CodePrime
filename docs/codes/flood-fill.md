---
sidebar_position : 143
tags: [Array, Depth-First Search, Breadth-First Search, Matrix]
---

# Flood Fill

## [Problem](https://leetcode.com/problems/flood-fill/)

<p>An image is represented by an <code>m x n</code> integer grid <code>image</code> where <code>image[i][j]</code> represents the pixel value of the image.</p>

<p>You are also given three integers <code>sr</code>, <code>sc</code>, and <code>color</code>. You should perform a <strong>flood fill</strong> on the image starting from the pixel <code>image[sr][sc]</code>.</p>

<p>To perform a <strong>flood fill</strong>, consider the starting pixel, plus any pixels connected <strong>4-directionally</strong> to the starting pixel of the same color as the starting pixel, plus any pixels connected <strong>4-directionally</strong> to those pixels (also with the same color), and so on. Replace the color of all of the aforementioned pixels with <code>color</code>.</p>

<p>Return <em>the modified image after performing the flood fill</em>.</p>

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
