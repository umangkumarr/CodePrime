
# Longest Subarray Zero Sum

## [Problem](https://practice.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1)

Given an array having both positive and negative integers. The task is to compute the length of the largest subarray with sum 0.

Example 1:

<code>
<strong>Input: </strong>

N = 8
A[] = {15,-2,2,-8,1,7,10,23}
<strong>Output:</strong> 5 <br />
<strong>Explanation:</strong> 
The largest subarray withsum 0 will be -2 2 -8 1 7.
</code>
<strong>Your Task:</strong><br />
You just have to complete the function maxLen() which takes two arguments an array A and n, where n is the size of the array A and returns the length of the largest subarray with 0 sum.

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

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
</details>
