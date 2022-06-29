---
sidebar_position : 3
---

# Longest Consecutive Sequence

## Problem Link
https://leetcode.com/problems/longest-consecutive-sequence/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    map<int, int> mp, mp1;

   public:
    int findlongestConsecutive(int a) {
        if (mp1[a]) return mp1[a];
        if (mp[a] == 0) return 0;
        mp1[a] = 1;
        mp1[a] += findlongestConsecutive(a - 1);
        return mp1[a];
    }

    int longestConsecutive(vector<int>& nums) {
        int n = nums.size();
        for (int i = 0; i < n; i++) {
            mp[nums[i]]++;
        }

        int ans = 0;
        for (auto i : mp) {
            ans = max(ans, findlongestConsecutive(i.first));
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>
