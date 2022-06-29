---
sidebar_position : 6
---

# Max Consecutive Ones

## Problem Link
https://leetcode.com/problems/max-consecutive-ones/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int findMaxConsecutiveOnes(vector<int>& nums) {
        int ans = 0, cnt = 0;
        int n = nums.size();
        for (int i = 0; i < n; i++) {
            if (nums[i])
                cnt++;
            else {
                ans = max(ans, cnt);
                cnt = 0;
            }
        }
        ans = max(ans, cnt);
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
