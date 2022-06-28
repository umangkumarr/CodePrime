---
sidebar_position : 2
tags: [Array, Binary Search, Dynamic Programming]
---

# Longest Increasing Subsequence

## [Problem](https://leetcode.com/problems/longest-increasing-subsequence/)

<p>Given an integer array <code>nums</code>, return the length of the longest strictly increasing subsequence.</p>

<p>A <strong>subsequence</strong> is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements. For example, <code>[3,6,2,7]</code> is a subsequence of the array <code>[0,3,1,6,2,2,7]</code>.</p>

<p>&nbsp;</p>


## Solution Approach

Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int LIS(vector<int> a, int n) {
        vector<int> dp(n + 1, INT_MAX);
        dp[0] = INT_MIN;
        for (int i = 0; i < n; i++) {
            int indx = upper_bound(dp.begin(), dp.end(), a[i]) - dp.begin();
            if (dp[indx - 1] < a[i] && dp[indx] > a[i]) {
                dp[indx] = a[i];
            }
        }
        int res = 0;
        for (int i = 1; i <= n; i++) {
            if (dp[i] != INT_MAX) res = i;
        }
        return res;
    }

    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        return LIS(nums, n);
    }
};
```
</TabItem>
</Tabs>

</details>
