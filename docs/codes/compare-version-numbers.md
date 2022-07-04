---
sidebar_position : 99
tags: [Two Pointers, String]
---

# Compare Version Numbers

## [Problem](https://leetcode.com/problems/compare-version-numbers/)

<p>Given two version numbers,&nbsp;<code>version1</code> and <code>version2</code>, compare them.</p>

<ul>
</ul>

<p>Version numbers consist of <strong>one or more revisions</strong> joined by a dot&nbsp;<code>&#39;.&#39;</code>. Each revision&nbsp;consists of <strong>digits</strong>&nbsp;and may contain leading <strong>zeros</strong>. Every revision contains <strong>at least one character</strong>. Revisions are <strong>0-indexed from left to right</strong>, with the leftmost revision being revision 0, the next revision being revision 1, and so on. For example&nbsp;<code>2.5.33</code>&nbsp;and&nbsp;<code>0.1</code>&nbsp;are valid version numbers.</p>

<p>To compare version numbers, compare their revisions in <strong>left-to-right order</strong>. Revisions are compared using their&nbsp;<strong>integer value ignoring any leading zeros</strong>. This means that revisions&nbsp;<code>1</code>&nbsp;and&nbsp;<code>001</code>&nbsp;are considered&nbsp;<strong>equal</strong>. If a version number does not specify a revision at an index, then&nbsp;<strong>treat the revision as&nbsp;<code>0</code></strong>. For example, version&nbsp;<code>1.0</code> is less than version&nbsp;<code>1.1</code>&nbsp;because their revision 0s are the same, but their revision 1s are&nbsp;<code>0</code>&nbsp;and&nbsp;<code>1</code>&nbsp;respectively, and&nbsp;<code>0 &lt; 1</code>.</p>

<p><em>Return the following:</em></p>

<ul>
	<li>If <code>version1 &lt; version2</code>, return <code>-1</code>.</li>
	<li>If <code>version1 &gt; version2</code>, return <code>1</code>.</li>
	<li>Otherwise, return <code>0</code>.</li>
</ul>

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
    int compareVersion(string version1, string version2) {
        vector<int> v1, v2;
        int last = 0;
        for (int i = 0; i <= version1.size(); i++)
            if (version1[i] == '.' || i == version1.size())
                v1.push_back(stoi(version1.substr(last, i - last))),
                    last = i + 1;
        last = 0;
        for (int i = 0; i <= version2.size(); i++)
            if (version2[i] == '.' || i == version2.size())
                v2.push_back(stoi(version2.substr(last, i - last))),
                    last = i + 1;

        int sz1 = v1.size(), sz2 = v2.size();
        int cnt = abs(sz2 - sz1);
        if (sz1 < sz2)
            while (cnt--) v1.push_back(0);
        else
            while (cnt--) v2.push_back(0);
        for (int i = 0; i < v1.size(); i++)
            if (v1[i] != v2[i]) return (v1[i] < v2[i]) ? -1 : 1;
        return 0;
    }
};

```
</TabItem>
</Tabs>

</details>
