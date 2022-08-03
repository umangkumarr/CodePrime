---
sidebar_position : 2
tags: [Dynamic Programming, Sorting]
---

# Minimum Platforms

## [Problem](https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/1#)

<span>Given arrival and departure times of all trains that reach a railway station. Find the minimum number of platforms required for the railway station so that no train is kept waiting.<br/>
Consider that all the trains arrive on the same day and leave on the same day. Arrival and departure time can never&nbsp;be the same for a train&nbsp;but we can have arrival time of one train equal to departure time of the other.&nbsp;At any&nbsp;given instance of time, same platform can not be used for both departure of a train and arrival of another train.&nbsp;In such cases,&nbsp;we need different platforms<strong>.</strong></span>

## Solution Approach
We only have to find the maximum no. of trains present at the station at any instance of time.

Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
