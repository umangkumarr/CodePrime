---
sidebar_position : 2
tags: [Dynamic Programming, Sorting]
---

# Minimum Platforms

## Problem Link
https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/1#

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
