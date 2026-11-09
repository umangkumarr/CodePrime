---
title: "Maximum Meetings"
description: "Find the maximum number of non-overlapping meetings one room can hold, greedily picking the meeting that ends earliest after sorting by end time."
source: "https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1"
difficulty: "Medium"
tags: ["Greedy", "Sorting"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

There is **one** meeting room in a firm. There are **N** meetings in the form of **(start[i], end[i])** where **start[i]** is start time of meeting **i** and **end[i]** is finish time of meeting **i**.

What is the **maximum** number of meetings that can be accommodated in the meeting room when only one meeting can be held in the meeting room at a particular time?

**Note:** Start time of one chosen meeting can't be equal to the end time of the other chosen meeting.

Complete the function `maxMeetings()` which takes `n` and the arrays `start[]` and `end[]` and returns the maximum number of meetings that can be held in the room. Expected time complexity: $O(N \log N)$; expected auxiliary space: $O(N)$.

**Example 1:**

```text
Input:  N = 6, start[] = {1, 3, 0, 5, 8, 5}, end[] = {2, 4, 6, 7, 9, 9}
Output: 4
Explanation: Maximum four meetings can be held with given start and end timings.
The meetings are - (1, 2), (3, 4), (5, 7) and (8, 9).
```

**Example 2:**

```text
Input:  N = 3, start[] = {10, 12, 20}, end[] = {20, 25, 30}
Output: 1
Explanation: Only one meeting can be held with given start and end timings.
```

**Constraints:**

- $1 \le N \le 2 \times 10^5$
- $0 \le$ `start[i]` $\le$ `end[i]` $\le 10^9$

**Note:** GeeksforGeeks now redirects this problem to [Activity Selection](https://www.geeksforgeeks.org/problems/activity-selection-1587115620/1), the same task with the signature `int activitySelection(vector<int>& start, vector<int>& finish)`; the constraints above are the ones listed there. The code below works unchanged for it if you rename the function and pass `start.size()`, `start.data()`, `finish.data()`.

## Solution approach

### Intuition

This is the classic **activity selection** problem. Among all meetings, consider the one that **ends earliest**. Some optimal schedule starts with it: take any optimal schedule and replace its first meeting with the earliest-ending one. The replacement ends no later than the meeting it replaces, so it cannot clash with the rest of the schedule, and the count is unchanged.

After committing to that meeting, the remaining problem is the same one restricted to meetings that start strictly after it ends. Applying the same argument again and again gives the greedy rule: **sort by end time and take every meeting that starts after the last chosen meeting ends.**

Choosing by earliest *start* or *shortest duration* both fail: a meeting that starts first may run all day, and a short meeting may sit across two otherwise compatible ones.

### Algorithm

1. Build `meetings` as pairs `{end[i], start[i]}` and sort them, which orders them by end time.
2. Set `lastEnd = -1` (all times are non-negative) and `count = 0`.
3. For each meeting `{e, s}` in order: if `s > lastEnd`, select it — increment `count` and set `lastEnd = e`.
4. Return `count`.

The comparison is strict (`s > lastEnd`) because the note forbids a meeting starting exactly when the previous one ends.

### Walkthrough

Example 1, with meetings sorted by end time. Green meetings are selected; red ones start at or before the end of the last selected meeting and are skipped:

![Greedy meeting selection on Example 1](/img/codes/maximum-meetings/greedy.svg)

### Complexity

- **Time:** $O(n \log n)$ — sorting dominates; the selection pass is $O(n)$.
- **Space:** $O(n)$ — the `meetings` array of pairs.

### Edge cases

- **A meeting starts exactly when the previous one ends** (Example 2, `(10, 20)` then `(20, 30)`): `20 > 20` is false, so it is skipped.
- **Zero-length meetings** (`start[i] == end[i]`, allowed by the constraints): they sort by their end time like any other meeting and are handled by the same rule.
- **Several meetings with the same end time:** after the first of them is taken, the others start no later than that end time, so at most one is selected, which is correct.

## Code

```cpp title="C++"
class Solution {
   public:
    int maxMeetings(int n, int start[], int end[]) {
        vector<pair<int, int>> meetings(n);  // {end, start}, so sorting orders by end time
        for (int i = 0; i < n; i++) meetings[i] = {end[i], start[i]};
        sort(meetings.begin(), meetings.end());

        int count = 0, lastEnd = -1;
        for (auto& [e, s] : meetings) {
            if (s > lastEnd) {  // must start strictly after the last chosen meeting ends
                count++;
                lastEnd = e;
            }
        }
        return count;
    }
};
```
