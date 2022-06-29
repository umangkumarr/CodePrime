---
sidebar_position : 2
---

# 4Sum

## Problem Link
https://leetcode.com/problems/4sum/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
