---
sidebar_position : 95
tags: [String]
---

# Longest Common Prefix

## [Problem](https://leetcode.com/problems/longest-common-prefix/)

<p>Write a function to find the longest common prefix string amongst an array of strings.</p>

<p>If there is no common prefix, return an empty string <code>&quot;&quot;</code>.</p>

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
    string longestCommonPrefix(vector<string>& strs) {
        int n = strs.size();
        string s = strs[0];
        int j = s.length() - 1;
        for (int i = 1; i < n; i++) {
            for (int k = 0; k <= j; k++) {
                if (strs[i][k] != s[k]) {
                    j = k - 1;
                    break;
                }
            }
        }
        if (j < 0) return "";
        return string(s.begin(), s.begin() + j + 1);
    }
};

```
</TabItem>
</Tabs>

</details>
