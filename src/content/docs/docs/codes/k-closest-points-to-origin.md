---
title: "K Closest Points to Origin"
description: "Return the k points nearest to the origin by partitioning on squared distance with quickselect (nth_element) in average linear time."
source: "https://leetcode.com/problems/k-closest-points-to-origin/"
difficulty: "Medium"
tags: ["Array", "Math", "Divide and Conquer", "Geometry", "Sorting", "Heap (Priority Queue)", "Quickselect", "K-D Tree"]
complexity:
  time: "O(n) \\text{ average}"
  space: "O(1)"
---

## Problem

Given an array of `points` where `points[i] = [xi, yi]` represents a point on the **X-Y** plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`.

The distance between two points on the **X-Y** plane is the Euclidean distance (i.e., $\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$).

You may return the answer in **any order**. The answer is **guaranteed** to be **unique** (except for the order that it is in).

**Example 1:**

![Points (1,3) and (-2,2) plotted on the plane](https://assets.leetcode.com/uploads/2021/03/03/closestplane1.jpg)

```text
Input:  points = [[1,3],[-2,2]], k = 1
Output: [[-2,2]]
Explanation:
The distance between (1, 3) and the origin is sqrt(10).
The distance between (-2, 2) and the origin is sqrt(8).
Since sqrt(8) < sqrt(10), (-2, 2) is closer to the origin.
We only want the closest k = 1 points from the origin, so the answer is just [[-2,2]].
```

**Example 2:**

```text
Input:  points = [[3,3],[5,-1],[-2,4]], k = 2
Output: [[3,3],[-2,4]]
Explanation: The answer [[-2,4],[3,3]] would also be accepted.
```

**Constraints:**

- $1 \le k \le$ `points.length` $\le 10^4$
- $-10^4 \le x_i, y_i \le 10^4$

## Solution approach

### Intuition

Two observations make this simple and fast.

1. **No square roots needed.** $\sqrt{\cdot}$ is increasing, so comparing $x^2 + y^2$ gives the same order as comparing true distances — and stays exact in integers. With $|x|, |y| \le 10^4$ the squared distance is at most $2 \times 10^8$, which fits in an `int`.
2. **We do not need the points in sorted order**, only *which* `k` points are the smallest. Fully sorting costs $O(n \log n)$; a **selection** algorithm does less work. Quickselect partitions the array around a pivot like quicksort but recurses into only one side, which is $O(n)$ on average. C++ provides it as `std::nth_element`: after the call, the element at position `k` is the one that would be there in sorted order, everything before it is no larger and everything after it is no smaller.

So after `nth_element(points.begin(), points.begin() + k, points.end(), cmp)`, the first `k` entries are exactly the `k` closest points (in some order, which the problem allows). The answer is guaranteed unique, so ties at the boundary cannot matter.

An alternative that also works for streaming input is a max-heap of size `k` keyed by squared distance — $O(n \log k)$ time and $O(k)$ space.

### Algorithm

1. Define `dist(p) = p[0] * p[0] + p[1] * p[1]`.
2. Call `nth_element` on `points` with position `points.begin() + k`, comparing points by `dist`.
3. Return a copy of the first `k` points.

### Complexity

- **Time:** $O(n)$ on average — each partition step discards one side; `nth_element` in libstdc++ falls back to a heap-based selection, so even the worst case is $O(n \log n)$.
- **Space:** $O(1)$ extra — the partitioning is done in place on `points` (the returned `k` points are the output).

### Edge cases

- **`k == points.length`:** `points.begin() + k` is `end()`, `nth_element` does nothing and all points are returned.
- **Negative coordinates:** squaring removes the sign, so `(-2, 2)` and `(2, -2)` have the same key `8`.

## Code

```cpp
class Solution {
   public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        auto dist = [](const vector<int>& p) { return p[0] * p[0] + p[1] * p[1]; };
        nth_element(points.begin(), points.begin() + k, points.end(),
                    [&](const vector<int>& a, const vector<int>& b) {
                        return dist(a) < dist(b);
                    });
        return vector<vector<int>>(points.begin(), points.begin() + k);
    }
};
```

```java
class Solution {
    private final Random rng = new Random();

    public int[][] kClosest(int[][] points, int k) {
        // Quickselect: afterwards points[0..k) are the k closest, in some order.
        int lo = 0, hi = points.length - 1;
        while (lo < hi) {
            int pivot = dist(points[lo + rng.nextInt(hi - lo + 1)]);
            // [lo, lt) < pivot, [lt, i) == pivot, (gt, hi] > pivot
            int lt = lo, i = lo, gt = hi;
            while (i <= gt) {
                int d = dist(points[i]);
                if (d < pivot) {
                    swap(points, lt++, i++);
                } else if (d > pivot) {
                    swap(points, i, gt--);
                } else {
                    i++;
                }
            }
            if (k < lt) {
                hi = lt - 1;
            } else if (k > gt + 1) {
                lo = gt + 1;
            } else {
                break;
            }
        }
        return Arrays.copyOf(points, k);
    }

    private static int dist(int[] p) {
        return p[0] * p[0] + p[1] * p[1];
    }

    private static void swap(int[][] a, int i, int j) {
        int[] t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
}
```

```python
import random


class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        def dist(p):
            return p[0] * p[0] + p[1] * p[1]

        # Quickselect: afterwards points[:k] are the k closest, in some order.
        lo, hi = 0, len(points) - 1
        while lo < hi:
            pivot = dist(points[random.randint(lo, hi)])
            # [lo, lt) < pivot, [lt, i) == pivot, (gt, hi] > pivot
            lt, i, gt = lo, lo, hi
            while i <= gt:
                d = dist(points[i])
                if d < pivot:
                    points[lt], points[i] = points[i], points[lt]
                    lt += 1
                    i += 1
                elif d > pivot:
                    points[i], points[gt] = points[gt], points[i]
                    gt -= 1
                else:
                    i += 1
            if k < lt:
                hi = lt - 1
            elif k > gt + 1:
                lo = gt + 1
            else:
                break
        return points[:k]
```
