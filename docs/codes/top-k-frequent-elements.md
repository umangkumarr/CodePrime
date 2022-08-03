---
sidebar_position : 70
tags: [Array, Hash Table, Divide and Conquer, Sorting, Heap (Priority Queue), Bucket Sort, Counting, Quickselect]
---

# Top K Frequent Elements

## [Problem](https://leetcode.com/problems/top-k-frequent-elements/)

<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the</em> <code>k</code> <em>most frequent elements</em>. You may return the answer in <strong>any order</strong>.</p>

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
