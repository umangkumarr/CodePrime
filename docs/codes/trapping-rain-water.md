---
sidebar_position : 37
tags: [Array, Two Pointers, Dynamic Programming, Stack, Monotonic Stack]
---

# Trapping Rain Water

## [Problem](https://leetcode.com/problems/trapping-rain-water/)

<p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>

## Solution Approach
Find the maximum height $h_m$ and calculate the volume capacity for height $h_i$.

$Volume = (h_m - h_i)*(h_i)$

Take $h_i$ in the increasing order to avoid overlap problem.
At the last, subtract the total volume occupy by the heights.

![tapping_rain_water](/img/trapping_rain_water.png "trappig_rain_water")

Expected Time complexity: $O(n)$


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
public:
    int trap(vector<int>& height) {
        int n = height.size();
        int ans = 0, sm = height[0];
        int mx = height[0], indx = 0;
        for (int i = 1; i < n; i++) {
            sm += height[i];
            if (mx < height[i]) {
                mx = height[i];
                indx = i;
            }
        }
        mx = 0;
        ans = height[indx];
        for (int i = 0; i < indx; i++) {
            if (mx < height[i]) {
                ans += (indx - i) * (height[i] - mx);
                mx = height[i];
            }
        }
        mx = 0;
        for (int i = n - 1; i > indx; i--) {
            if (mx < height[i]) {
                ans += (i - indx) * (height[i] - mx);
                mx = height[i];
            }
        }
        return ans - sm;

    }
};   

```
</TabItem>
</Tabs>

</details>
