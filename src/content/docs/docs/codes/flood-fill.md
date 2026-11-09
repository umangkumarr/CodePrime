---
title: "Flood Fill"
description: "Recolour the 4-directionally connected region of same-coloured pixels that contains a start pixel, using breadth-first search over the grid."
source: "https://leetcode.com/problems/flood-fill/"
difficulty: "Easy"
tags: ["Array", "Depth-First Search", "Breadth-First Search", "Matrix"]
complexity:
  time: "O(m \\cdot n)"
  space: "O(m \\cdot n)"
---

## Problem

You are given an image represented by an `m x n` grid of integers `image`, where `image[i][j]` represents the pixel value of the image. You are also given three integers `sr`, `sc`, and `color`. Your task is to perform a **flood fill** on the image starting from the pixel `image[sr][sc]`.

To perform a **flood fill**:

1. Begin with the starting pixel and change its color to `color`.
2. Perform the same process for each pixel that is **directly adjacent** (pixels that share a side with the original pixel, either horizontally or vertically) and shares the **same color** as the starting pixel.
3. Keep **repeating** this process by checking neighboring pixels of the *updated* pixels and modifying their color if it matches the original color of the starting pixel.
4. The process **stops** when there are **no more** adjacent pixels of the original color to update.

Return the **modified** image after performing the flood fill.

**Example 1:**

![The 3 x 3 image before and after the fill; the connected 1s turn into 2s](https://assets.leetcode.com/uploads/2021/06/01/flood1-grid.jpg)

```text
Input:  image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
Output: [[2,2,2],[2,2,0],[2,0,1]]
Explanation: From the center of the image with position (sr, sc) = (1, 1) (i.e., the red pixel),
all pixels connected by a path of the same color as the starting pixel (i.e., the blue pixels)
are colored with the new color.
Note the bottom corner is not colored 2, because it is not horizontally or vertically connected
to the starting pixel.
```

**Example 2:**

```text
Input:  image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0
Output: [[0,0,0],[0,0,0]]
Explanation: The starting pixel is already colored with 0, which is the same as the target color.
Therefore, no changes are made to the image.
```

**Constraints:**

- `m == image.length`
- `n == image[i].length`
- $1 \le m, n \le 50$
- $0 \le$ `image[i][j]`, `color` $< 2^{16}$
- $0 \le$ `sr` $< m$
- $0 \le$ `sc` $< n$

## Solution approach

### Intuition

The pixels to recolour are exactly the connected component of the start pixel in the graph whose vertices are pixels of the original colour `original` and whose edges join side-adjacent pixels. Any graph traversal — BFS or DFS — started at `(sr, sc)` visits precisely that component.

The neat part is that recolouring a pixel **is** marking it as visited: once a pixel has been changed to `color` it no longer equals `original`, so it will never be queued again. That only works when `color != original`. If they are equal, the image would not change at all, so we return it straight away — this also prevents an infinite loop.

### Algorithm

1. Let `original = image[sr][sc]`. If `original == color`, return `image` unchanged.
2. Recolour the start pixel and push it into the queue `q`.
3. While `q` is not empty, pop a pixel `(r, c)` and look at its four neighbours `(nr, nc)` (offsets from `dirs`). For each neighbour that is inside the grid and still has colour `original`, recolour it **immediately** and push it.
4. Return `image`.

Recolouring at push time (rather than at pop time) guarantees that every pixel enters the queue at most once.

### Complexity

- **Time:** $O(m \cdot n)$ — each pixel is pushed at most once, and each pop checks four neighbours.
- **Space:** $O(m \cdot n)$ — in the worst case (the whole image is one colour) the queue can hold a number of pixels proportional to the grid size. A recursive DFS would need the same amount of stack.

### Edge cases

- **`color` equals the start colour (Example 2):** the early return leaves the image untouched and avoids re-queuing pixels forever.
- **Diagonal neighbours** (the bottom-right `1` in Example 1) are never reached, because only the four side offsets in `dirs` are used.
- **`1 x 1` image:** the start pixel is recoloured and the loop ends immediately.

## Code

```cpp title="C++"
class Solution {
  public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        int original = image[sr][sc];
        if (original == color) return image;

        int m = image.size(), n = image[0].size();
        const int dirs[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        queue<pair<int, int>> q;
        image[sr][sc] = color;
        q.push({sr, sc});
        while (!q.empty()) {
            auto [r, c] = q.front();
            q.pop();
            for (auto& d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && image[nr][nc] == original) {
                    image[nr][nc] = color;
                    q.push({nr, nc});
                }
            }
        }
        return image;
    }
};
```
