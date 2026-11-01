---
title: "Merge Intervals"
description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals…"
source: "https://leetcode.com/problems/merge-intervals/"
tags: ["Array", "Sorting"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>Given an array&nbsp;of <code>intervals</code>&nbsp;where <code>intervals[i] = [starti, endi]</code>, merge all overlapping intervals, and return <em>an array of the non-overlapping intervals that cover all the intervals in the input</em>.</p>

## Solution approach

### Intuition

After sorting the intervals by start, any intervals that overlap sit next to each other. So one sweep is enough: keep growing the current merged interval while the next interval starts before it ends, and close it as soon as there is a gap.

### Algorithm

1. Sort `intervals` and start the current interval with `front = intervals[0][0]` and `back = intervals[0][1]`.
2. For each later interval `[left, right]`, if it overlaps the current one (`left <= back && front <= right`), extend the current interval with `front = min(left, front)` and `back = max(back, right)`.
3. Otherwise push `{front, back}` into `ans` and start a new current interval from `[left, right]`.
4. After the loop, push the last interval and return `ans`.

### Complexity

- **Time:** $O(n \log n)$ — dominated by the sort; the sweep is linear.
- **Space:** $O(n)$ — the output `ans`.

### Edge cases

- **Touching intervals** such as `[1, 4]` and `[4, 5]` are merged, because the check uses `left <= back`.
- **Nested intervals** such as `[1, 10]` and `[2, 3]` keep `back = 10` thanks to the `max`.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        vector<vector<int>> ans;
        sort(intervals.begin(), intervals.end());
        int front = intervals[0][0];
        int back = intervals[0][1];

        for (int i = 1; i < intervals.size(); i++) {
            int left = intervals[i][0];
            int right = intervals[i][1];
            if (left <= back && front <= right) {
                front = min(left, front);
                back = max(back, right);
            } else {
                ans.push_back({front, back});
                front = left;
                back = right;
            }
        }
        ans.push_back({front, back});

        return ans;
    }
};

```
