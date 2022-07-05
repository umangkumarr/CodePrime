---
displayed_sidebar: null
sidebar_position : 6
tags: [LIS, Dynamic Programming]
---

# Maximum sum increasing subsequence

## [Problem](https://practice.geeksforgeeks.org/problems/maximum-sum-increasing-subsequence4749/1)

Given an array of n positive integers. Find the sum of the maximum sum subsequence of the given array such that the integers in the subsequence are sorted in increasing order i.e. increasing subsequence. 

## Solution Approach

Expected Time complexity: $O(n^2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int maxSumIS(int arr[], int n) {
        vector<int> dp(n);
        dp[0] = arr[0];
        int ans = arr[0];
        for (int i = 1; i < n; i++) {
            dp[i] = arr[i];
            for (int j = 0; j < i; j++) {
                if (arr[j] < arr[i]) {
                    dp[i] = max(dp[i], dp[j] + arr[i]);
                }
                ans = max(ans, dp[i]);
            }
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
