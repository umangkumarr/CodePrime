---
sidebar_position : 1
tags: [Dynamic Programming]
---

# Maximum sum of non-adjacent elements

## [Problem](https://www.codingninjas.com/codestudio/problems/maximum-sum-of-non-adjacent-elements_843261?source=youtube&campaign=striver_dp_videos&utm_source=youtube&utm_medium=affiliate&utm_campaign=striver_dp_videos)

You are given an array/list of ‘N’ integers. You are supposed to return the maximum sum of the subsequence with the constraint that no two elements are adjacent in the given array/list.

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

int maximumNonAdjacentSum(vector<int> &nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    vector<pair<int, int>> ans(n);
    ans[0].f = nums[0];
    ans[1].f = nums[1];
    ans[1].s = nums[0];
    for (int i = 2; i < n; i++) {

        // ans[i].f represent the maximum sum if take ith element in subsequence
        ans[i].f = nums[i] + ans[i - 1].s;

        // ans[i].s represent the maximum sum if not take ith element in subsequence
        ans[i].s = max(ans[i - 1].f, ans[i - 1].s);
    }
    return max(ans[n - 1].f, ans[n - 1].s);
}
```
</TabItem>
</Tabs>

</details>
