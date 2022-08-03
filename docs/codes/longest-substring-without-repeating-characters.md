---
sidebar_position : 23
tags: [Hash Table, String, Sliding Window]
---

# Longest Substring Without Repeating Characters

## [Problem](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

<p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int lengthOfLongestSubstring(string s) {
        vector<int> dict(256, -1);
        int maxLen = 0, start = -1;
        for (int i = 0; i != s.length(); i++) {
            if (dict[s[i]] > start) start = dict[s[i]];
            dict[s[i]] = i;
            maxLen = max(maxLen, i - start);
        }
        return maxLen;
    }
};

```
</TabItem>
</Tabs>

</details>
