---
title: "Valid Anagram"
description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a…"
source: "https://leetcode.com/problems/valid-anagram/"
tags: ["Hash Table", "String", "Sorting"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> <em>if</em> <code>t</code> <em>is an anagram of</em> <code>s</code><em>, and</em> <code>false</code> <em>otherwise</em>.</p>

<p>An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>

## Solution approach

### Intuition

Two strings are anagrams exactly when they contain the same letters with the same counts. Since the input has only lowercase letters, two arrays of 26 counters are enough to compare them, with no sorting needed.

### Algorithm

1. If the lengths differ, return `false`.
2. For each index `i`, increment `ss[s[i] - 'a']` and `tt[t[i] - 'a']`.
3. Return `true` if `ss == tt`, otherwise `false`.

### Complexity

- **Time:** $O(n)$ — one pass over the strings plus a 26-element comparison.
- **Space:** $O(1)$ — two fixed-size arrays of 26 counters.

## Code

```cpp title="C++"
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
