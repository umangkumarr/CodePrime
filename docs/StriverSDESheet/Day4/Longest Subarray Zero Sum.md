---
sidebar_position : 4
---

# Longest Subarray Zero Sum

## Problem Link
https://practice.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
#include <bits/stdc++.h>
int LongestSubsetWithZeroSum(vector<int> arr) {
    int ans = 0, sm = 0;
    int n = arr.size();
    unordered_map<int, int> mp;
    mp[0] = -1;
    for (int i = 0; i < n; i++) {
        sm += arr[i];
        if (mp.find(sm) != mp.end()) {
            ans = max(ans, i - mp[sm]);
        } else {
            mp[sm] = i;
        }
    }
    return ans;
}
```
</TabItem>
</Tabs>
