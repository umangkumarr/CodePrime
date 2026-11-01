---
title: "K Closest Points to Origin"
description: "Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0,…"
source: "https://leetcode.com/problems/k-closest-points-to-origin/"
tags: ["Array", "Math", "Divide and Conquer", "Geometry", "Sorting", "Heap (Priority Queue)", "Quickselect"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>Given an array of <code>points</code> where <code>points[i] = [xi, yi]</code> represents a point on the <strong>X-Y</strong> plane and an integer <code>k</code>, return the <code>k</code> closest points to the origin <code>(0, 0)</code>.</p>

<p>The distance between two points on the <strong>X-Y</strong> plane is the Euclidean distance (i.e., <code>&radic;(x<sub>1</sub> - x<sub>2</sub>)<sup>2</sup> + (y<sub>1</sub> - y<sub>2</sub>)<sup>2</sup></code></p>

<p>You may return the answer in <strong>any order</strong>. The answer is <strong>guaranteed</strong> to be <strong>unique</strong> (except for the order that it is in).</p>

<p>&nbsp;</p>
<p><strong>Example:</strong></p>
<img alt="" src="https://assets.leetcode.com/uploads/2021/03/03/closestplane1.jpg" style={ {width: "400px", height: "400px" } }/>
<code>
<strong>Input:</strong> points = [[1,3],[-2,2]], k = 1 <br/>
<strong>Output:</strong> [[-2,2]] <br/>
<strong>Explanation:</strong> <br/>
The distance between (1, 3) and the origin is sqrt(10). <br/>
The distance between (-2, 2) and the origin is sqrt(8).<br/> 
Since sqrt(8) &lt; sqrt(10), (-2, 2) is closer to the origin.<br/> 
We only want the closest k = 1 points from the origin, so the answer is just [[-2,2]]. <br/>
</code>

## Solution approach

### Intuition

The $k$ closest points are simply the first $k$ points once all points are ordered by their distance from the origin. Computing every distance and sorting gives that order directly.

### Algorithm

1. For each point `j`, compute its Euclidean distance `a` $= \sqrt{x^2 + y^2}$ and store the pair `dis[j] = {a, j}`.
2. Sort `dis`; pairs compare by distance first.
3. For the first `k` entries, copy the point at index `dis[i][1]` into `ans[i]`.
4. Return `ans`.

### Complexity

- **Time:** $O(n \log n)$ — dominated by sorting the `n` distances.
- **Space:** $O(n)$ — the `dis` array of distance and index pairs.

### Edge cases

- **Ties in distance:** the pair with the smaller original index comes first, which is fine because any order is accepted.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        int n = points.size();
        vector<vector<double>> dis(n, vector<double>(2));
        vector<vector<int>> ans(k, vector<int>(2));

        for (int j = 0; j < n; j++) {
            double a =
                (points[j][0] * points[j][0] + points[j][1] * points[j][1]);
            a = sqrt(a);
            dis[j][0] = a;
            dis[j][1] = j;
        }
        sort(dis.begin(), dis.end());
        for (int i = 0; i < k; i++) {
            ans[i][0] = points[dis[i][1]][0];
            ans[i][1] = points[dis[i][1]][1];
        }

        return ans;
    }
};
```
