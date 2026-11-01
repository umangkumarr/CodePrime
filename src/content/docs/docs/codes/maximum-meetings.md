---
title: "Maximum Meetings"
description: "There is one meeting room in a firm. There are N meetings in the form of (start[i], end[i]) where start[i] is start time of meeting i and end[i] is finish…"
source: "https://practice.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1"
tags: ["Greedy", "Sorting"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<span>There is <strong>one</strong> meeting room in a firm. There are <strong>N</strong> meetings in the form of <strong>(start[i], end[i])</strong> where <strong>start[i]&nbsp;</strong>is start time of meeting <strong>i </strong>and <strong>end[i] </strong>is finish time of meeting <strong>i.</strong><br/>
What is the <strong>maximum</strong> number of meetings that can be accommodated in the meeting room when only one meeting can be held in the meeting room at a particular time? </span>
<p><span><strong>Note:</strong>&nbsp;Start time of one chosen meeting can't be equal to the end time of the other chosen meeting.</span></p>

## Solution approach

### Intuition

To fit the most meetings in one room, always pick the meeting that **finishes earliest** among those that can still start. Finishing early leaves as much time as possible for the remaining meetings, and swapping any optimal schedule's first meeting for the earliest-finishing one never makes it worse.

### Algorithm

1. Build `v` with pairs `{end[i], start[i]}` and sort it, so meetings are in increasing order of finish time.
2. Select the first meeting in sorted order: `ans = 1`, and `j = 0` points to the last selected meeting, whose finish time `v[j].first` acts as the time limit.
3. For every later meeting `i`, if its start `v[i].second` is strictly greater than the finish time of the last selected meeting `v[j].first`, select it: increment `ans` and set `j = i`.
4. Return the count `ans`. The code returns only the number of meetings, not their order.

### Complexity

- **Time:** $O(n \log n)$ — dominated by sorting the meetings.
- **Space:** $O(n)$ — the vector `v` of pairs.

### Edge cases

- **A meeting starting exactly when the previous one ends** is not selected, because the comparison is strict.

## Code

```cpp title="C++"
class Solution {
   public:
    int maxMeetings(int start[], int end[], int n) {
        vector<pair<int, int>> v(n);
        for (int i = 0; i < n; i++) {
            v[i] = {end[i], start[i]};
        }
        sort(v.begin(), v.end());
        int ans = 1;
        int j = 0;
        for (int i = 1; i < n; i++) {
            if (v[i].second > v[j].first) {
                ans++;
                j = i;
            }
        }
        return ans;
    }
};
```
