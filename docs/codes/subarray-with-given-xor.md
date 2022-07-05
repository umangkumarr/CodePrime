---
displayed_sidebar: null
sidebar_position : 5
---

# Subarray with given XOR

## [Problem](https://www.interviewbit.com/problems/subarray-with-given-xor/)

Given an array of integers A and an integer B.

Find the total number of subarrays having bitwise XOR of all elements equals to B.

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

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
</details>
