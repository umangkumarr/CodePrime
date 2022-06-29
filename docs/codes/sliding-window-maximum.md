---
sidebar_position : 9
tags: [Array, Queue, Sliding Window, Heap (Priority Queue), Monotonic Queue]
---

# Sliding Window Maximum

## [Problem](https://leetcode.com/problems/sliding-window-maximum/)

<p>You are given an array of integers&nbsp;<code>nums</code>, there is a sliding window of size <code>k</code> which is moving from the very left of the array to the very right. You can only see the <code>k</code> numbers in the window. Each time the sliding window moves right by one position.</p>

<p>Return <em>the max sliding window</em>.</p>

## Solution Approach

Store all the elements of the window in an ordered map. Then using the iterator, $mp.end()$, find the last element present in the hash map $O(logn)$.

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
