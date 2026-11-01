---
title: "Minimum Platforms"
description: "Given arrival and departure times of all trains that reach a railway station. Find the minimum number of platforms required for the railway station so…"
source: "https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/1#"
tags: ["Dynamic Programming", "Sorting"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<span>Given arrival and departure times of all trains that reach a railway station. Find the minimum number of platforms required for the railway station so that no train is kept waiting.<br/>
Consider that all the trains arrive on the same day and leave on the same day. Arrival and departure time can never&nbsp;be the same for a train&nbsp;but we can have arrival time of one train equal to departure time of the other.&nbsp;At any&nbsp;given instance of time, same platform can not be used for both departure of a train and arrival of another train.&nbsp;In such cases,&nbsp;we need different platforms<strong>.</strong></span>

## Solution approach

### Intuition

We only have to find the maximum number of trains present at the station at any instant. Sweep through all arrival and departure times in increasing order, keeping a count of trains currently at the station; its highest value is the number of platforms needed.

### Algorithm

1. In the ordered `map` `mp`, count for each time how many trains arrive (`first`) and how many depart (`second`).
2. Walk `mp` in increasing time order. At each time, add the arrivals to `cnt`, update `ans = max(ans, cnt)`, and only then subtract the departures.
3. Return `ans`.

### Complexity

- **Time:** $O(n \log n)$ — `2n` insertions into an ordered `map`.
- **Space:** $O(n)$ — up to `2n` distinct times in `mp`.

### Edge cases

- **Arrival at the same time as a departure**: arrivals are added before departures are removed, so the two trains are counted as overlapping and need separate platforms.

## Code

```cpp title="C++"
class Solution {
   public:
    int findPlatform(int arr[], int dep[], int n) {
        int ans = 0;
        map<int, pair<int, int>> mp;
        for (int i = 0; i < n; i++) {
            mp[arr[i]].first++;
            mp[dep[i]].second++;
        }
        int cnt = 0;
        for (auto i : mp) {
            cnt += i.second.first;
            ans = max(ans, cnt);
            cnt -= i.second.second;
        }
        return ans;
    }
};
```
