---
sidebar_position : 6
tags: [Heap(Priority Queue)]
---

# Top K Frequent Elements

## Problem Link
https://leetcode.com/problems/top-k-frequent-elements/

## Solution Approach
Expected Time complexity: $O(n*log(n))$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        int n = nums.size();
        map<int, int> mp;
        vector<pair<int, int>> distinct;
        for (int i = 0; i < n; i++) {
            mp[nums[i]]++;
        }

        for (auto i : mp) {
            distinct.push_back(make_pair(i.second, i.first));
        }

        sort(distinct.begin(), distinct.end());
        reverse(distinct.begin(), distinct.end());
        vector<int> ans;
        for (int i = 0; i < k; i++) {
            ans.push_back(distinct[i].second);
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
