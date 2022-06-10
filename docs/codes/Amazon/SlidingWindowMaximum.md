---
tags: [Array, Heap, Sliding Window, Queue]
---

# Sliding Window Maximum

## Problem Link
https://leetcode.com/problems/sliding-window-maximum

## Solution Approach

Store all the elements of the window in an ordered map. Then using the iterator, find the last element present in the map $O(logn)$.

Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>
<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        map<int, int> mp;
        for (int i = 0; i < k; i++) mp[nums[i]]++;
        int n = nums.size();
        vector<int> ans;
        auto itr = mp.end();
        itr--;
        ans.push_back((*itr).first);
        for (int i = k; i < n; i++) {
            mp[nums[i]]++;
            mp[nums[i - k]]--;
            if (mp[nums[i - k]] == 0) {
                mp.erase(nums[i - k]);
            }
            itr = mp.end();
            itr--;
            ans.push_back((*itr).first);
        }

        return ans;
    }
};
```
</TabItem>
</Tabs>
</details>