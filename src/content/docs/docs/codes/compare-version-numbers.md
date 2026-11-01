---
title: "Compare Version Numbers"
description: "Given two version numbers, version1 and version2, compare them. Version numbers consist of one or more revisions joined by a dot '.'. Each revision…"
source: "https://leetcode.com/problems/compare-version-numbers/"
tags: ["Two Pointers", "String"]
complexity:
  time: "O(n + m)"
  space: "O(n + m)"
---

## Problem

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

## Solution approach

### Intuition

Version strings are compared **revision by revision as integers**, so `"1.01"` equals `"1.001"`, and a missing revision counts as `0`. The simplest way to do this is to split both strings at the dots, convert each piece with `stoi` (which also drops leading zeros), pad the shorter list with zeros, and compare the lists element by element.

### Algorithm

1. Scan `version1`. Whenever a `'.'` or the end of the string is reached, convert the substring from `last` to `i` with `stoi`, push it into `v1`, and set `last = i + 1`.
2. Do the same for `version2` to build `v2`.
3. Append `cnt = abs(sz2 - sz1)` zeros to the shorter of `v1` and `v2`.
4. Walk both lists together and return `-1` or `1` at the first index where they differ.
5. If all revisions match, return `0`.

### Complexity

- **Time:** $O(n + m)$ — each string is scanned and converted once.
- **Space:** $O(n + m)$ — for the revision lists `v1` and `v2`.

### Edge cases

- **Different lengths** such as `"1.0"` and `"1.0.0"`: the padding makes them equal.
- **Leading zeros** such as `"01"` and `"1"`: `stoi` converts both to `1`.

## Code

```cpp title="C++"
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
