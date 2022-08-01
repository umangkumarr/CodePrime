---
sidebar_position : 2
tags: [Array, Dynamic Programming]
displayed_sidebar: null
---

# House Robber

## [Problem](https://leetcode.com/problems/house-robber/)

<p>You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and <b>it will automatically contact the police if two adjacent houses were broken into on the same night</b>.</p>

<p>Given an integer array <code>nums</code> representing the amount of money of each house, return <em>the maximum amount of money you can rob tonight <b>without alerting the police</b></em>.</p>

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
        vector<pair<int, int>> v(n);
        v[0].f = nums[0];
        v[1].f = nums[1];
        v[1].s = nums[0];
        for (int i = 2; i < n; i++) {
            v[i].f = nums[i] + v[i - 1].s;
            v[i].s = max(v[i - 1].f, v[i - 1].s);
        }
        return max(v[n - 1].f, v[n - 1].s);
    }
};
```
</TabItem>
</Tabs>

</details>
