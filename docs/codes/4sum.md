---
displayed_sidebar: null
sidebar_position : 19
tags: [Array, Two Pointers, Sorting]
---

# 4Sum

## [Problem](https://leetcode.com/problems/4sum/)

<p>Given an array <code>nums</code> of <code>n</code> integers, return <em>an array of all the <strong>unique</strong> quadruplets</em> <code>[nums[a], nums[b], nums[c], nums[d]]</code> such that:</p>

<ul>
	<li><code>0 &lt;= a, b, c, d&nbsp;&lt; n</code></li>
	<li><code>a</code>, <code>b</code>, <code>c</code>, and <code>d</code> are <strong>distinct</strong>.</li>
	<li><code>nums[a] + nums[b] + nums[c] + nums[d] == target</code></li>
</ul>

<p>You may return the answer in <strong>any order</strong>.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
#define ll long long
class Solution {
   public:
    vector<vector<int>> fourSum(vector<int>& arr, int target) {
        int n = arr.size();
        unordered_map<ll, ll> mp;
        set<vector<int>> ans;
        vector<int> a;

        for (int i = 0; i < n; i++) mp[arr[i]]++;
        for (int i = 0; i < n; i++) {
            mp[arr[i]]--;
            for (int j = i + 1; j < n; j++) {
                mp[arr[j]]--;
                for (int k = j + 1; k < n; k++) {
                    mp[arr[k]]--;
                    ll sm = (ll)arr[i] + (ll)arr[k] + (ll)arr[j];
                    if (mp[target - sm]) {
                        a = {arr[i], arr[j], arr[k], int(target - sm)};
                        sort(a.begin(), a.end());
                        ans.insert(a);
                    }
                }
                for (int k = j + 1; k < n; k++) mp[arr[k]]++;
            }
            for (int j = i + 1; j < n; j++) mp[arr[j]]++;
        }
        vector<vector<int>> res;
        for (auto i : ans) res.push_back(i);
        return res;
    }
};

```
</TabItem>
</Tabs>

</details>
