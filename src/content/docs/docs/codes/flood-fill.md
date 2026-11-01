---
title: "Flood Fill"
description: "An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image. You are also given three integers sr,…"
source: "https://leetcode.com/problems/flood-fill/"
tags: ["Array", "Depth-First Search", "Breadth-First Search", "Matrix"]
complexity:
  time: "O(n \\cdot m)"
  space: "O(n \\cdot m)"
---

## Problem

<p>An image is represented by an <code>m x n</code> integer grid <code>image</code> where <code>image[i][j]</code> represents the pixel value of the image.</p>

<p>You are also given three integers <code>sr</code>, <code>sc</code>, and <code>color</code>. You should perform a <strong>flood fill</strong> on the image starting from the pixel <code>image[sr][sc]</code>.</p>

<p>To perform a <strong>flood fill</strong>, consider the starting pixel, plus any pixels connected <strong>4-directionally</strong> to the starting pixel of the same color as the starting pixel, plus any pixels connected <strong>4-directionally</strong> to those pixels (also with the same color), and so on. Replace the color of all of the aforementioned pixels with <code>color</code>.</p>

<p>Return <em>the modified image after performing the flood fill</em>.</p>

## Solution approach

### Intuition

The pixels to recolour are those connected to `(sr, sc)` that share its original colour `col`. A breadth-first search from the start pixel visits exactly that region. To avoid visiting a pixel twice (and looping forever when `color == col`), each visited pixel is first marked with the temporary value `-1`. All `-1` pixels are given the new colour at the end.

### Algorithm

1. Save `col = image[sr][sc]` and push `(sr, sc)` into the deque `q`.
2. Pop a pixel `(i, j)`. If it no longer has colour `col`, skip it (it was already processed).
3. Otherwise set `image[i][j] = -1` and push each of its four neighbours (using `dx` and `dy`) that is inside the grid and still has colour `col`.
4. When the queue is empty, scan the whole grid and replace every `-1` with `color`.
5. Return `image`.

### Complexity

- **Time:** $O(n \cdot m)$ — each pixel is marked at most once, may be pushed at most four times, and the final scan touches every cell.
- **Space:** $O(n \cdot m)$ — the queue can hold a number of entries proportional to the grid size.

### Edge cases

- **`color == col`:** the `-1` marker stops the BFS from revisiting pixels, and the final pass writes back the same colour.

## Code

```cpp title="C++"
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
