---
displayed_sidebar: null
sidebar_position : 38
tags: [Array]
---

# Max Consecutive Ones

## [Problem](https://leetcode.com/problems/max-consecutive-ones/)

<p>Given a binary array <code>nums</code>, return <em>the maximum number of consecutive </em><code>1</code><em>&#39;s in the array</em>.</p>

## Solution Approach


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
