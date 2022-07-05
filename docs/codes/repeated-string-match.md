---
displayed_sidebar: null
sidebar_position : 91
tags: [String, String Matching]
---

# Repeated String Match

## [Problem](https://leetcode.com/problems/repeated-string-match/)

<p>Given two strings <code>a</code> and <code>b</code>, return <em>the minimum number of times you should repeat string </em><code>a</code><em> so that string</em> <code>b</code> <em>is a substring of it</em>. If it is impossible for <code>b</code>​​​​​​ to be a substring of <code>a</code> after repeating it, return <code>-1</code>.</p>

<p><strong>Notice:</strong> string <code>&quot;abc&quot;</code> repeated 0 times is <code>&quot;&quot;</code>, repeated 1 time is <code>&quot;abc&quot;</code> and repeated 2 times is <code>&quot;abcabc&quot;</code>.</p>

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
    int repeatedStringMatch(string a, string b) {
        string s = a;
        int count = 1;
        int maxPossibleRepetions = b.length() / a.length() + 2;
        for (int i = 1; i <= maxPossibleRepetions; i++) {
            int f = s.find(b);
            if (f != -1) return count;
            s = s + a;
            count++;
        }
        return -1;
    }
};

```
</TabItem>
</Tabs>

</details>
