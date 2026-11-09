---
title: "Merge Intervals"
description: "Merge all overlapping intervals by sorting them by start and sweeping once, extending the last merged interval while the next one starts inside it."
source: "https://leetcode.com/problems/merge-intervals/"
difficulty: "Medium"
tags: ["Array", "Sorting"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return _an array of the non-overlapping intervals that cover all the intervals in the input_.

**Example 1:**

```text
Input:  intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].
```

**Example 2:**

```text
Input:  intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.
```

**Example 3:**

```text
Input:  intervals = [[4,7],[1,4]]
Output: [[1,7]]
Explanation: Intervals [1,4] and [4,7] are considered overlapping.
```

**Constraints:**

- $1 \le$ `intervals.length` $\le 10^4$
- `intervals[i].length == 2`
- $0 \le$ `starti` $\le$ `endi` $\le 10^4$

## Solution approach

### Intuition

Sort the intervals by their start. Now consider the merged intervals built so far; the last one, `[s, e]`, has the largest start of all of them. The next interval `[l, r]` starts at `l >= s`, so it can only overlap the **last** merged interval, and it does exactly when `l <= e`:

- if `l <= e`, it belongs to the same merged block, whose end becomes `max(e, r)` (the `max` matters when `[l, r]` is nested inside);
- otherwise there is a gap, and since every later interval starts at `>= l > e`, the block `[s, e]` is final, so we start a new one.

Comparing every pair of intervals would be $O(n^2)$; after sorting, one sweep suffices.

### Algorithm

1. Sort `intervals` (lexicographically, i.e. by start).
2. For each interval in order: if `merged` is empty or `interval[0] > merged.back()[1]`, append it as a new block; otherwise set `merged.back()[1] = max(merged.back()[1], interval[1])`.
3. Return `merged`.

### Walkthrough

Example 1, already sorted:

| Interval | Compared with | Action | `merged` |
| --- | --- | --- | --- |
| `[1,3]` | — | new block | `[[1,3]]` |
| `[2,6]` | `2 <= 3` | extend end to 6 | `[[1,6]]` |
| `[8,10]` | `8 > 6` | new block | `[[1,6],[8,10]]` |
| `[15,18]` | `15 > 10` | new block | `[[1,6],[8,10],[15,18]]` |

### Complexity

- **Time:** $O(n \log n)$ — the sort dominates; the sweep is linear.
- **Space:** $O(n)$ — the output, plus the sort's internal stack.

### Edge cases

- **Touching intervals** such as `[1,4]` and `[4,5]` (Example 2) are merged, because the test for a gap is the strict `interval[0] > merged.back()[1]`.
- **Unsorted input** (Example 3) is handled by the initial sort.
- **Nested intervals** such as `[1,10]` and `[2,3]` keep the end `10` thanks to the `max`.

## Code

```cpp
class Solution {
   public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> merged;
        for (const auto& interval : intervals) {
            if (merged.empty() || interval[0] > merged.back()[1])
                merged.push_back(interval);
            else
                merged.back()[1] = max(merged.back()[1], interval[1]);
        }
        return merged;
    }
};
```

```java
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();
        for (int[] interval : intervals) {
            if (merged.isEmpty() || interval[0] > merged.get(merged.size() - 1)[1]) {
                merged.add(new int[] {interval[0], interval[1]});
            } else {
                int[] last = merged.get(merged.size() - 1);
                last[1] = Math.max(last[1], interval[1]);
            }
        }
        return merged.toArray(new int[0][]);
    }
}
```

```python
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        intervals.sort()
        merged = []
        for start, end in intervals:
            if not merged or start > merged[-1][1]:
                merged.append([start, end])
            else:
                merged[-1][1] = max(merged[-1][1], end)
        return merged
```
