---
sidebar_position : 2
---

# Merge Overlapping Subintervals

## Problem Link
https://leetcode.com/problems/merge-intervals/submissions/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        vector<vector<int>> ans;
        sort(intervals.begin(), intervals.end());
        int front = intervals[0][0];
        int back = intervals[0][1];

        for (int i = 1; i < intervals.size(); i++) {
            int left = intervals[i][0];
            int right = intervals[i][1];
            if (left <= back && front <= right) {
                front = min(left, front);
                back = max(back, right);
            } else {
                ans.push_back({front, back});
                front = left;
                back = right;
            }
        }
        ans.push_back({front, back});

        return ans;
    }
};
```
</TabItem>
</Tabs>
