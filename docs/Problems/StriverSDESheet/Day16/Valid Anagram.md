---
sidebar_position : 3
tags: [Two Pointer, String, String Matching]
---

#  Valid Anagram

## Problem Link
https://leetcode.com/problems/valid-anagram/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    bool isAnagram(string s, string t) {
        int n = s.length();
        if (n != t.length()) return false;
        vector<int> ss(26), tt(26);
        for (int i = 0; i < n; i++) {
            ss[s[i] - 'a']++;
            tt[t[i] - 'a']++;
        }
        if (ss == tt) return true;
        return false;
    }
};
```
</TabItem>
</Tabs>

</details>
