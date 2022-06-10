---
tags: [Hash Table, String, Sorting]
---

# Group Anagram

## Problem Link
https://leetcode.com/problems/group-anagrams

## Solution Approach
Self Explanatory.

Expected Time complexity: $O(nklog(k))$


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        map<string, vector<string>> mp;
        vector<vector<string>> ans;
        for (int i = 0; i < strs.size(); i++) {
            string s = strs[i];
            sort(s.begin(), s.end());
            mp[s].push_back(strs[i]);
        }
        for (auto i : mp) {
            ans.push_back(i.second);
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>