---
sidebar_position : 8
tags: [Array, Binary Search, Dynamic Programming, Sorting]
---

# Maximum Profit in Job Scheduling

## [Problem](https://leetcode.com/problems/maximum-profit-in-job-scheduling/)

<p>We have <code>n</code> jobs, where every job is scheduled to be done from <code>startTime[i]</code> to <code>endTime[i]</code>, obtaining a profit of <code>profit[i]</code>.</p>

<p>You&#39;re given the <code>startTime</code>, <code>endTime</code> and <code>profit</code> arrays, return the maximum profit you can take such that there are no two jobs in the subset with overlapping time range.</p>

<p>If you choose a job that ends at time <code>X</code> you will be able to start another job that starts at time <code>X</code>.</p>

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
    int jobScheduling(vector<int>& startTime, vector<int>& endTime,
                      vector<int>& profit) {
        vector<vector<int>> v;
        int n = startTime.size();
        v.push_back({INT_MIN, INT_MIN, INT_MIN});
        for (int i = 0; i < n; i++) {
            v.push_back({endTime[i], startTime[i], profit[i]});
        }
        sort(v.begin(), v.end());
        sort(endTime.begin(), endTime.end());

        vector<vector<int>> dp(n + 1, vector<int>(2));
        for (int i = 1; i <= n; i++) {
            dp[i][0] = max(dp[i - 1][0], dp[i - 1][1]);
            dp[i][1] = v[i][2];
            int indx = upper_bound(endTime.begin(), endTime.end(), v[i][1]) -
                       endTime.begin();
            dp[i][1] += max(dp[indx][0], dp[indx][1]);
        }
        return max(dp[n][0], dp[n][1]);
    }
};
```
</TabItem>
</Tabs>

</details>
