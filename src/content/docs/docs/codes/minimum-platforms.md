---
title: "Minimum Platforms"
description: "Find the minimum number of railway platforms so that no train waits, by sorting arrivals and departures separately and sweeping them with two pointers."
source: "https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1"
difficulty: "Medium"
tags: ["Array", "Greedy", "Sorting", "Binary Search"]
complexity:
  time: "O(n \\log n)"
  space: "O(1)"
---

## Problem

Given arrival **`arr[]`** and departure **`dep[]`** times of trains on the same day, find the minimum number of platforms needed so that no train waits. A platform cannot serve two trains at the same time; if a train arrives before another departs, an extra platform is needed.

**Note:** Time intervals are in the 24-hour format (HHMM), where the first two characters represent hour (between 00 to 23) and the last two characters represent minutes (this will be `<= 59` and `>= 0`). Leading zeros for hours less than 10 are optional (e.g., 0900 is the same as 900).

Complete the function `findPlatform()`, which takes the arrays `arr[]` and `dep[]` and returns the minimum number of platforms required.

**Example 1:**

```text
Input:  arr[] = [900, 940, 950, 1100, 1500, 1800], dep[] = [910, 1200, 1120, 1130, 1900, 2000]
Output: 3
Explanation: There are three trains during the time 9:40 to 12:00. So we need a minimum of 3 platforms.
```

**Example 2:**

```text
Input:  arr[] = [900, 1235, 1100], dep[] = [1000, 1240, 1200]
Output: 1
Explanation: All train times are mutually exclusive. So we need only one platform.
```

**Example 3:**

```text
Input:  arr[] = [1000, 935, 1100], dep[] = [1200, 1240, 1130]
Output: 3
Explanation: All three trains have to be there from 11:00 to 11:30
```

**Constraints:**

- $1 \le \text{arr.size()}, \text{dep.size()} \le 10^5$
- $0000 \le \text{arr[i]} \le \text{dep[i]}$
- $0000 \le \text{dep[i]} \le 2359$

## Solution approach

### Intuition

The number of platforms needed is the **largest number of trains present at the station at the same moment**: with that many platforms, a free one always exists when a train arrives, and with fewer, at that busiest moment some train has nowhere to go.

To find that peak we do not need to know *which* train leaves when — only *how many* trains have arrived and how many have left by a given time. So we can sort the arrival times and the departure times **independently** and sweep both lists in time order, like merging two sorted arrays:

- the next event is an arrival if `arr[i] <= dep[j]`: one more train is at the station (`platforms++`);
- otherwise it is a departure: one train leaves (`platforms--`).

Ties go to the arrival (`<=`): the statement says a platform cannot be used for a departure and an arrival at the same instant, so a train arriving exactly when another departs must be counted as overlapping it.

### Algorithm

1. Sort `arr` and `dep`.
2. Set `i = 0` (next arrival), `j = 0` (next departure), `platforms = 0` (trains currently at the station) and `ans = 0`.
3. While `i < n`:
   - if `arr[i] <= dep[j]`: `platforms++`, `i++`, and update `ans = max(ans, platforms)`;
   - else: `platforms--`, `j++`.
4. Return `ans`. Once every train has arrived, departures can only lower the count, so the loop can stop.

`dep[j]` is never read out of range: after sorting, `arr[k] <= dep[k]` for every `k` (the `k + 1` earliest departures belong to `k + 1` trains that all arrived no later), so whenever `j == i` the arrival branch is taken. Hence `j <= i < n` inside the loop.

### Walkthrough

Example 1 after sorting. The top row is `arr`, the bottom row is `dep`; blue marks the next arrival and orange the next departure, grey events have been processed:

![Two-pointer sweep over sorted arrivals and departures](/img/codes/minimum-platforms/sweep.gif)

### Complexity

- **Time:** $O(n \log n)$ — the two sorts; the sweep itself is $O(n)$.
- **Space:** $O(1)$ extra — the arrays are sorted in place (plus the sort's own $O(\log n)$ stack).

### Edge cases

- **Arrival equal to another train's departure:** `<=` processes the arrival first, so both trains are counted together and get different platforms, as the statement requires.
- **A train with `arr[i] == dep[i]`:** it is still counted on arrival before its own departure, so it occupies a platform for that instant.
- **Disjoint trains** (Example 2): the count alternates between 1 and 0 and the answer is 1.

## Code

```cpp title="C++"
class Solution {
   public:
    int findPlatform(vector<int>& arr, vector<int>& dep) {
        sort(arr.begin(), arr.end());
        sort(dep.begin(), dep.end());
        int n = arr.size();
        int i = 0, j = 0, platforms = 0, ans = 0;
        while (i < n) {
            if (arr[i] <= dep[j]) {
                platforms++;
                i++;
                ans = max(ans, platforms);
            } else {
                platforms--;
                j++;
            }
        }
        return ans;
    }
};
```
