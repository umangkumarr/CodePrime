---
title: "Largest Rectangle in Histogram"
description: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in…"
source: "https://leetcode.com/problems/largest-rectangle-in-histogram/"
tags: ["Array", "Stack", "Monotonic Stack"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Given an array of integers <code>heights</code> representing the histogram&#39;s bar height where the width of each bar is <code>1</code>, return <em>the area of the largest rectangle in the histogram</em>.</p>

## Solution approach

### Intuition

In the best rectangle, some bar `i` is the shortest bar, and the rectangle stretches left and right until it hits a bar strictly shorter than `heights[i]`. So for every bar we need the index of the **nearest smaller bar on each side**; its rectangle then has width `right - left - 1`.

A monotonic stack finds all nearest smaller bars in one pass per direction: bars that are taller than or equal to the current one can never be the "nearest smaller" for anything further along, so they are popped. Checking every pair of boundaries directly would be $O(n^2)$.

### Algorithm

1. Right-to-left pass: the stack `st` holds `{height, index}` pairs, starting with the sentinel `{-1, n}`. For each `i`, pop while the top height is at least `heights[i]`; the top index is then the next smaller bar on the right, `indexes[i]`. Store `ans[i] = (indexes[i] - i) * heights[i]` and push `{heights[i], i}`.
2. Clear the stack and push the sentinel `{-1, -1}`.
3. Left-to-right pass: in the same way, `indexes[i]` becomes the previous smaller bar on the left. Add `heights[i] * (i - indexes[i])` to `ans[i]` and subtract `heights[i]`, because bar `i` was counted in both halves. Now `ans[i]` equals `heights[i] * (right - left - 1)`.
4. Return the maximum `ans[i]` as `area`.

### Complexity

- **Time:** $O(n)$ — each bar is pushed and popped at most once in each pass.
- **Space:** $O(n)$ — the stack plus the `indexes` and `ans` arrays.

### Edge cases

- **Equal heights:** bars of equal height are popped as well, so both boundaries are strictly shorter bars and a run of equal bars is included in the width.

## Code

```cpp title="C++"
class Solution {
   public:
    int largestRectangleArea(vector<int>& heights) {
        int n = heights.size();
        vector<int> indexes(n);
        vector<int> ans(n);

        stack<pair<int, int>> st;
        st.push({-1, n});

        for (int i = n - 1; i >= 0; i--) {
            while (st.top().first >= heights[i]) st.pop();
            indexes[i] = st.top().second;
            st.push({heights[i], i});
            ans[i] = (indexes[i] - i) * heights[i];
        }

        while (!st.empty()) st.pop();
        st.push({-1, -1});
        int area = 0;

        for (int i = 0; i < n; i++) {
            while (st.top().first >= heights[i]) st.pop();
            indexes[i] = st.top().second;
            st.push({heights[i], i});
            ans[i] = ans[i] + heights[i] * (i - indexes[i]) - heights[i];
            area = max(ans[i], area);
        }

        return area;
    }
};

```
