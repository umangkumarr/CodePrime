---
title: "Largest Rectangle in Histogram"
description: "Find the largest rectangle in a histogram in one pass with an increasing monotonic stack that settles each bar's widest span when it is popped."
source: "https://leetcode.com/problems/largest-rectangle-in-histogram/"
difficulty: "Hard"
tags: ["Array", "Stack", "Monotonic Stack", "Range Minimum/Maximum Query"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given an array of integers `heights` representing the histogram's bar height where the width of each bar is `1`, return _the area of the largest rectangle in the histogram_.

**Example 1:**

![Histogram of bars 2,1,5,6,2,3 with the rectangle over bars 5 and 6 highlighted](https://assets.leetcode.com/uploads/2021/01/04/histogram.jpg)

```text
Input:  heights = [2,1,5,6,2,3]
Output: 10
Explanation: The above is a histogram where width of each bar is 1.
The largest rectangle is shown in the red area, which has an area = 10 units.
```

**Example 2:**

![Histogram of bars 2 and 4](https://assets.leetcode.com/uploads/2021/01/04/histogram-1.jpg)

```text
Input:  heights = [2,4]
Output: 4
```

**Constraints:**

- $1 \le$ `heights.length` $\le 10^5$
- $0 \le$ `heights[i]` $\le 10^4$

## Solution approach

### Intuition

Look at the best rectangle and its **shortest** bar `j`. The rectangle has height `heights[j]` and extends left and right until it would hit a bar that is strictly shorter than `heights[j]` — otherwise it could be widened. So it is enough to compute, for every bar `j`:

- `left` = index of the nearest bar to the left that is shorter than `heights[j]` (or `-1`),
- `right` = index of the nearest bar to the right that is shorter than `heights[j]` (or `n`),

and take the maximum of `heights[j] * (right - left - 1)`. Trying all pairs of boundaries would be $O(n^2)$.

A **monotonic stack** finds both boundaries in a single left-to-right pass. Keep the indices of bars whose heights are **increasing** from bottom to top. When the current bar `i` is lower than (or equal to) the bar on top, that top bar `j` has just found its right boundary `i`. Its left boundary is the bar directly beneath it in the stack, because everything that was between them was popped earlier by a bar no taller than `heights[j]`. So the rectangle for `j` is fully known at the moment it is popped.

A virtual bar of height `0` at index `n` pops everything left at the end, so every bar is settled.

### Algorithm

1. Let `st` be an empty stack of indices and `best = 0`.
2. For `i` from `0` to `n` (where the height at `i == n` is taken as `0`):
   - while `st` is not empty and `heights[st.back()] >= h`: pop `j`; let `left` be the new top (or `-1` if the stack is empty); update `best` with `heights[j] * (i - left - 1)`;
   - push `i`.
3. Return `best`.

Popping equal heights too is safe: the earlier of two equal bars gets a too-narrow width, but the later one is popped with the correct, strictly shorter left boundary and records the full rectangle.

### Walkthrough

Example 1. Purple cells are on the stack, the orange cell is the bar being settled, and its rectangle spans the orange and green cells; the grey cell is the virtual height-0 bar:

![Monotonic stack on [2,1,5,6,2,3]](/img/codes/largest-rectangle-in-histogram/monotonic-stack.gif)

### Complexity

- **Time:** $O(n)$ — every index is pushed once and popped at most once.
- **Space:** $O(n)$ — the stack, for example on a strictly increasing histogram.

### Edge cases

- **Increasing heights:** nothing is popped until the virtual `0` bar at `i == n`, which settles every bar with right boundary `n`.
- **Zero-height bars:** they pop everything before them, and their own rectangle has area `0`.
- **Overflow:** the area is at most $10^5 \times 10^4 = 10^9$, which fits in an `int`.

## Code

```cpp
class Solution {
   public:
    int largestRectangleArea(vector<int>& heights) {
        int n = heights.size(), best = 0;
        vector<int> st;  // indices of bars with increasing heights
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!st.empty() && heights[st.back()] >= h) {
                int height = heights[st.back()];
                st.pop_back();
                int left = st.empty() ? -1 : st.back();
                best = max(best, height * (i - left - 1));
            }
            st.push_back(i);
        }
        return best;
    }
};
```

```java
class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length, best = 0;
        int[] st = new int[n];  // indices of bars with increasing heights
        int top = 0;
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (top > 0 && heights[st[top - 1]] >= h) {
                int height = heights[st[--top]];
                int left = top == 0 ? -1 : st[top - 1];
                best = Math.max(best, height * (i - left - 1));
            }
            if (i < n) st[top++] = i;
        }
        return best;
    }
}
```

```python
class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        n, best = len(heights), 0
        st = []  # indices of bars with increasing heights
        for i in range(n + 1):
            h = 0 if i == n else heights[i]
            while st and heights[st[-1]] >= h:
                height = heights[st.pop()]
                left = st[-1] if st else -1
                best = max(best, height * (i - left - 1))
            st.append(i)
        return best
```
