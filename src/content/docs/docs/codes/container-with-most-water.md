---
title: "Container With Most Water"
description: "Pick two lines that hold the most water with the x-axis, using two pointers from both ends that always move the shorter line inwards."
source: "https://leetcode.com/problems/container-with-most-water/"
difficulty: "Medium"
tags: ["Array", "Two Pointers", "Greedy"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the $i^{th}$ line are `(i, 0)` and `(i, height[i])`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.

**Notice** that you may not slant the container.

**Example 1:**

![Nine vertical lines with the container between the lines at index 1 and 8 shaded](https://s3-lc-upload.s3.amazonaws.com/uploads/2018/07/17/question_11.jpg)

```text
Input:  height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the
max area of water (blue section) the container can contain is 49.
```

**Example 2:**

```text
Input:  height = [1,1]
Output: 1
```

**Constraints:**

- `n == height.length`
- $2 \le n \le 10^5$
- $0 \le$ `height[i]` $\le 10^4$

## Solution approach

### Intuition

The water held by lines `l < r` is `min(height[l], height[r]) * (r - l)`: the shorter line sets the level and the distance sets the width. Trying all pairs is $O(n^2)$, too slow for $n = 10^5$.

Start with the **widest** container, `l = 0` and `r = n - 1`, and narrow it one step at a time. The key question is which end to move. Suppose `height[l] <= height[r]`. Every other container that uses line `l` pairs it with some `r' < r`, which is **narrower**, and its level is still at most `height[l]`. So none of them can beat the container we just measured — line `l` has nothing more to offer and can be discarded with `l++`. (Symmetrically, if `height[r]` is the shorter, discard `r`.)

Moving the **taller** line instead would be a mistake: the level stays capped by the same short line while the width shrinks, so we could skip past the optimum. Each step rules out one line for good, so after `n - 1` steps every line has been considered with its best possible partner.

### Algorithm

1. Set `l = 0`, `r = n - 1`, `ans = 0`.
2. While `l < r`:
   - Compute `area = min(height[l], height[r]) * (r - l)` and update `ans = max(ans, area)`.
   - If `height[l] > height[r]`, move `r--`; otherwise move `l++` (the shorter line, or `l` on a tie).
3. Return `ans`.

### Walkthrough

Example 1, one cell per line height. Blue cells are the current pair `l`, `r`; grey ones have been discarded:

![Two pointers closing in on [1,8,6,2,5,4,8,3,7] and finding area 49](/img/codes/container-with-most-water/two-pointers.gif)

### Complexity

- **Time:** $O(n)$ — each iteration moves one pointer inwards, so there are exactly `n - 1` iterations.
- **Space:** $O(1)$ — two indices and the running maximum.

### Edge cases

- **`n == 2`:** a single iteration measures the only container (Example 2).
- **Equal heights:** either line can be discarded — every other container that uses it is narrower and no higher than the current one — so moving `l` on a tie is safe.
- **Zero heights:** they give area `0` and are discarded like any short line.
- **Overflow:** the largest possible area is $10^4 \times 10^5 = 10^9$, which fits in `int`.

## Code

```cpp title="C++"
class Solution {
   public:
    int maxArea(vector<int>& height) {
        int l = 0, r = (int)height.size() - 1, ans = 0;
        while (l < r) {
            ans = max(ans, min(height[l], height[r]) * (r - l));
            if (height[l] > height[r])
                r--;
            else
                l++;
        }
        return ans;
    }
};
```
