---
displayed_sidebar: null
sidebar_position : 20
tags: [Array, Hash Table, Union Find]
---

# Longest Consecutive Sequence

## [Problem](https://leetcode.com/problems/longest-consecutive-sequence/)

<p>Given an unsorted array of integers <code>nums</code>, return <em>the length of the longest consecutive elements sequence.</em></p>

<p>You must write an algorithm that runs in&nbsp;<code>O(n)</code>&nbsp;time.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

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

</details>
