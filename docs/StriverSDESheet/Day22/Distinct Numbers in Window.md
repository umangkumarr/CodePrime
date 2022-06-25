---
sidebar_position : 4
tags: [Hash Maps, Array]
---

# Distinct Numbers in Window

## Problem Link
https://www.interviewbit.com/problems/distinct-numbers-in-window/

## Solution Approach

Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
vector<int> Solution::dNums(vector<int> &A, int B) {
    map<int, int> mp;
    int n = A.size();
    for (int i = 0; i < B; i++) {
        mp[A[i]]++;
    }
    vector<int> ans;
    ans.push_back(mp.size());
    for (int j = B; j < n; j++) {
        mp[A[j]]++;
        mp[A[j - B]]--;
        if (mp[A[j - B]] == 0) {
            mp.erase(A[j - B]);
        }
        ans.push_back(mp.size());
    }
    return ans;
}

```
</TabItem>
</Tabs>

</details>
