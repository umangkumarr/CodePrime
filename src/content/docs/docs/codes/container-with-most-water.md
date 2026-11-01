---
title: "Container With Most Water"
description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i,…"
source: "https://leetcode.com/problems/container-with-most-water/"
tags: ["Array", "Two Pointers", "Greedy"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>ith</code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.</p>

<p>Find two lines that together with the x-axis form a container, such that the container contains the most water.</p>

<p>Return <em>the maximum amount of water a container can store</em>.</p>

<p><strong>Notice</strong> that you may not slant the container.</p>

<img alt="" src="https://s3-lc-upload.s3.amazonaws.com/uploads/2018/07/17/question_11.jpg" style={ { width: "600px", height: "287px" } } /> <br/>

## Solution approach

### Intuition

The water held between lines `l` and `r` is `min(height[l], height[r]) * (r - l)`. Checking every pair is $O(n^2)$. Instead, start with the widest pair and move inwards with two pointers.

At each step, the shorter line limits the area. Moving the taller line inwards can never help: the width shrinks and the height is still capped by the shorter line. So the shorter line can be discarded safely, and only $n - 1$ pairs need to be checked.

### Algorithm

1. Set `l = 0`, `r = n - 1`, and `ans = 0`.
2. While `l < r`:
   - compute `area` for the pair and update `ans`;
   - if `height[l] > height[r]`, move `r` left; otherwise move `l` right.
3. Return `ans`.

### Complexity

- **Time:** $O(n)$ — each step moves one pointer inwards.
- **Space:** $O(1)$ — only a few variables.

## Code

```cpp title="C++"
class Solution {
   public:
    int maxArea(vector<int>& height) {
        int n = height.size();
        int l = 0, r = n - 1;
        int ans = 0;
        while (l < r) {
            int area = min(height[l], height[r]) * (r - l);
            ans = max(ans, area);
            if (height[l] > height[r])
                r--;
            else
                l++;
        }
        return ans;
    }
};
```
