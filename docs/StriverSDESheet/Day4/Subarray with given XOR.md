---
sidebar_position : 5
---

# Subarray with given XOR

## Problem Link
https://www.interviewbit.com/problems/subarray-with-given-xor/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
int Solution::solve(vector<int> &A, int B) {
    int n = A.size();
    int xorr = 0;
    unordered_map<int, int> mp;
    mp[0] = 1;
    int ans = 0;
    for (int i = 0; i < n; i++) {
        xorr ^= A[i];
        if (mp.find(xorr ^ B) != mp.end()) {
            ans += mp[xorr ^ B];
        }
        mp[xorr]++;
        ;
    }
    return ans;
}

```
</TabItem>
</Tabs>
