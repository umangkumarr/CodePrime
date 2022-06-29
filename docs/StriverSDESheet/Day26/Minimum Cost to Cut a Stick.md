---
sidebar_position : 4
tags: [Array, Dynamic Programming]
---

# Minimum Cost to Cut a Stick

## [Problem](https://leetcode.com/problems/minimum-cost-to-cut-a-stick/)

<p>Given a wooden stick of length <code>n</code> units. The stick is labelled from <code>0</code> to <code>n</code>. For example, a stick of length <strong>6</strong> is labelled as follows:</p>
<img alt="" src="https://assets.leetcode.com/uploads/2020/07/21/statement.jpg" style={{ width: "521px", height: "111px" }} />
<p>Given an integer array <code>cuts</code> where <code>cuts[i]</code> denotes a position you should perform a cut at.</p>

<p>You should perform the cuts in order, you can change the order of the cuts as you wish.</p>

<p>The cost of one cut is the length of the stick to be cut, the total cost is the sum of costs of all cuts. When you cut a stick, it will be split into two smaller sticks (i.e. the sum of their lengths is the length of the stick before the cut). Please refer to the first example for a better explanation.</p>

<p>Return <em>the minimum total cost</em> of the cuts.</p>

<p>&nbsp;</p>


## Solution Approach

Expected Time complexity: $O(n*2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int dp[102][102];

    int solve(vector<int>& cuts, int low, int high) {
        if (low + 1 == high)
            return 0;
        else if (dp[low][high] != -1)
            return dp[low][high];

        else {
            int ans = INT_MAX;
            for (int i = low + 1; i < high; i++) {
                int curr = cuts[high] - cuts[low] + solve(cuts, low, i) +
                           solve(cuts, i, high);
                ans = min(ans, curr);
            }
            return dp[low][high] = ans;
        }
    }

    int minCost(int n, vector<int>& cuts) {
        cuts.push_back(0);
        cuts.push_back(n);
        memset(dp, -1, sizeof(dp));
        sort(cuts.begin(), cuts.end());
        return solve(cuts, 0, cuts.size() - 1);
    }
};

```
</TabItem>
</Tabs>

</details>
