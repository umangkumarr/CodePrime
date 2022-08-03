---
sidebar_position : 167
tags: [Array, Dynamic Programming]
---

# Maximum Product Subarray

## [Problem](https://leetcode.com/problems/maximum-product-subarray/)

<p>Given an integer array <code>nums</code>, find a contiguous non-empty subarray within the array that has the largest product, and return <em>the product</em>.</p>

<p>The test cases are generated so that the answer will fit in a <strong>32-bit</strong> integer.</p>

<p>A <strong>subarray</strong> is a contiguous subsequence of the array.</p>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int maxProduct(vector<int>& nums) {
        int prod = 1;
        int n = nums.size(), p = INT_MIN;
        vector<pair<int, int>> dp(n);

        for (int i = 0; i < n; i++) {
            if (nums[i] == 0) {
                p = INT_MIN;
                dp[i] = {0, p};
                prod = 1;
                continue;
            }
            prod *= nums[i];
            dp[i] = {prod, p};
            if (nums[i] < 0 && p == INT_MIN) p = i;
        }
        int ans = INT_MIN;
        for (int i = 0; i < n; i++) {
            if (dp[i].first < 0) {
                if (dp[i].second != INT_MIN) {
                    ans = max(ans, dp[i].first / dp[dp[i].second].first);
                }
                ans = max(ans, dp[i].first);
            } else {
                ans = max(ans, dp[i].first);
            }
        }
        return ans;
    }
};

```
</TabItem>
</Tabs>

</details>
