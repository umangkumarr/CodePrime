---
sidebar_position : 3
tags: [Array, Dynamic Programming]
---

# House Robber II

## [Problem](https://leetcode.com/problems/house-robber-ii/)

<p>You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are <strong>arranged in a circle.</strong> That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and&nbsp;<b>it will automatically contact the police if two adjacent houses were broken into on the same night</b>.</p>

<p>Given an integer array <code>nums</code> representing the amount of money of each house, return <em>the maximum amount of money you can rob tonight <strong>without alerting the police</strong></em>.</p>

## Solution Approach

Expected Time Complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
#define f first
#define s second

class Solution {
   public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        vector<pair<int, int>> ans(n);
        ans[0].f = nums[0];
        ans[1].f = nums[1];
        ans[1].s = nums[0];
        for (int i = 2; i < n; i++) {
            ans[i].f = nums[i] + ans[i - 1].s;
            ans[i].s = max(ans[i - 1].f, ans[i - 1].s);
        }
        auto a = ans[n - 1];
        ans[1].s = 0;

        for (int i = 2; i < n; i++) {
            ans[i].f = nums[i] + ans[i - 1].s;
            ans[i].s = max(ans[i - 1].f, ans[i - 1].s);
        }
        int b = max(ans[n - 1].f, ans[n - 1].s);
        if (max(a.f, a.s) == b) return b;
        return max(b, a.s);
    }
};
```
</TabItem>
</Tabs>

</details>
