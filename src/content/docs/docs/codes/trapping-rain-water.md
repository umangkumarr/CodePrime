---
title: "Trapping Rain Water"
description: "Compute how much rain water an elevation map of unit-width bars traps, in one pass and O(1) space using two pointers with running maxima."
source: "https://leetcode.com/problems/trapping-rain-water/"
difficulty: "Hard"
tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack", "Monotonic Stack"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.

**Example 1:**

![Elevation map [0,1,0,2,1,0,1,3,2,1,2,1] with 6 units of trapped water](https://assets.leetcode.com/uploads/2018/10/22/rainwatertrap.png)

```text
Input:  height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array
[0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.
```

**Example 2:**

```text
Input:  height = [4,2,0,3,2,5]
Output: 9
```

**Constraints:**

- `n == height.length`
- $1 \le n \le 2 \times 10^4$
- $0 \le$ `height[i]` $\le 10^5$

## Solution approach

### Intuition

Look at a single column `i`. Water above it rises until it spills over the lower of the two walls around it, so

$$
\text{water}[i] = \min(\text{maxLeft}[i],\ \text{maxRight}[i]) - \text{height}[i],
$$

where `maxLeft[i]` is the tallest bar in `height[0..i]` and `maxRight[i]` the tallest in `height[i..n-1]`. Precomputing both arrays gives an $O(n)$-space solution. We can drop the arrays with **two pointers** `left` and `right` moving towards each other, keeping `leftMax` (tallest bar seen from the left so far) and `rightMax` (tallest seen from the right).

The key observation: suppose `height[left] < height[right]`. Every bar that `left` has passed was lower than some bar still on the right (that is why `left` moved), so `leftMax` is **at most** `maxRight[left]`; and `height[right]` itself shows the right side is taller than the current bar. Hence `min(maxLeft, maxRight)` at `left` is exactly `leftMax`, and the water above `left` is `leftMax - height[left]` — no need to know the full right side. The mirror argument holds for `right` when `height[left] >= height[right]`.

So at each step we settle the column on the **lower** side, whose water level is already determined, and move that pointer inward.

### Algorithm

1. Set `left = 0`, `right = n - 1`, and `leftMax = rightMax = water = 0`.
2. While `left < right`:
   - If `height[left] < height[right]`: update `leftMax = max(leftMax, height[left])`, add `leftMax - height[left]` to `water`, and increment `left`.
   - Otherwise: update `rightMax = max(rightMax, height[right])`, add `rightMax - height[right]` to `water`, and decrement `right`.
3. Return `water`. The column where the pointers meet is the tallest bar and holds no water.

### Walkthrough

Purple cells are bars, blue cells are water already counted, and green heights are settled columns:

![Two pointers settling columns of [0,1,0,2,1,0,1,3,2,1,2,1] from the lower side](/img/codes/trapping-rain-water/two-pointers.gif)

### Complexity

- **Time:** $O(n)$ — each iteration moves one pointer one step inward, so there are `n - 1` iterations.
- **Space:** $O(1)$ — four integers.

### Edge cases

- **Fewer than three bars** (`n = 1` or `n = 2`): no column has walls on both sides; the loop runs at most once and adds `0` because the running maximum equals the current bar.
- **Monotonic heights** such as `[1,2,3]`: each settled column is the new maximum on its side, so it adds `0`.
- **Overflow:** the total is at most $(n - 2) \cdot 10^5 \lt 2^{31}$, so `int` is enough.

## Code

```cpp
class Solution {
   public:
    int trap(vector<int>& height) {
        int left = 0, right = (int)height.size() - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                leftMax = max(leftMax, height[left]);
                water += leftMax - height[left];
                left++;
            } else {
                rightMax = max(rightMax, height[right]);
                water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
};
```

```java
class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                leftMax = Math.max(leftMax, height[left]);
                water += leftMax - height[left];
                left++;
            } else {
                rightMax = Math.max(rightMax, height[right]);
                water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
}
```

```python
class Solution:
    def trap(self, height: list[int]) -> int:
        left, right = 0, len(height) - 1
        left_max = right_max = water = 0
        while left < right:
            if height[left] < height[right]:
                left_max = max(left_max, height[left])
                water += left_max - height[left]
                left += 1
            else:
                right_max = max(right_max, height[right])
                water += right_max - height[right]
                right -= 1
        return water
```
