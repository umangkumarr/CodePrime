---
displayed_sidebar: null
sidebar_position : 97
tags: [Hash Table, String, Sorting]
---

# Valid Anagram

## [Problem](https://leetcode.com/problems/valid-anagram/)

<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> <em>if</em> <code>t</code> <em>is an anagram of</em> <code>s</code><em>, and</em> <code>false</code> <em>otherwise</em>.</p>

<p>An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>

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
