---
displayed_sidebar: null
sidebar_position : 89
tags: [Array, Stack, Monotonic Stack]
---

# Largest Rectangle in Histogram

## [Problem](https://leetcode.com/problems/largest-rectangle-in-histogram/)

<p>Given an array of integers <code>heights</code> representing the histogram&#39;s bar height where the width of each bar is <code>1</code>, return <em>the area of the largest rectangle in the histogram</em>.</p>

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
    int largestRectangleArea(vector<int>& heights) {
        int n = heights.size();
        vector<int> indexes(n);
        vector<int> ans(n);

        stack<pair<int, int>> st;
        st.push({-1, n});

        for (int i = n - 1; i >= 0; i--) {
            while (st.top().first >= heights[i]) st.pop();
            indexes[i] = st.top().second;
            st.push({heights[i], i});
            ans[i] = (indexes[i] - i) * heights[i];
        }

        while (!st.empty()) st.pop();
        st.push({-1, -1});
        int area = 0;

        for (int i = 0; i < n; i++) {
            while (st.top().first >= heights[i]) st.pop();
            indexes[i] = st.top().second;
            st.push({heights[i], i});
            ans[i] = ans[i] + heights[i] * (i - indexes[i]) - heights[i];
            area = max(ans[i], area);
        }

        return area;
    }
};

```
</TabItem>
</Tabs>

</details>
