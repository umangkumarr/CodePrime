---
title: "Longest Common Prefix"
description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string \"\"."
source: "https://leetcode.com/problems/longest-common-prefix/"
tags: ["String"]
complexity:
  time: "O(n \\cdot m)"
  space: "O(m)"
---

## Problem

<p>Write a function to find the longest common prefix string amongst an array of strings.</p>

<p>If there is no common prefix, return an empty string <code>&quot;&quot;</code>.</p>

## Solution approach

### Intuition

The common prefix can never be longer than the first string, and each further string can only shorten it. So we start with the whole first string as the candidate and, for every other string, cut the candidate at the first position where the characters differ.

### Algorithm

1. Let `s = strs[0]` and `j` be the last index of the current prefix, initially `s.length() - 1`.
2. For each other string `strs[i]`, compare `strs[i][k]` with `s[k]` for `k` from `0` to `j`. At the first mismatch, set `j = k - 1` and stop.
3. If `j` is negative, return the empty string; otherwise return the first `j + 1` characters of `s`.

### Complexity

- **Time:** $O(n \cdot m)$ — each of the `n` strings is compared over at most `m` characters, where `m` is the length of `strs[0]`.
- **Space:** $O(m)$ — the copy `s` and the returned prefix.

### Edge cases

- **A shorter string:** reading `strs[i][k]` at `k == strs[i].size()` returns the null character, which mismatches `s[k]`, so the prefix is cut at that length.

## Code

```cpp title="C++"
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
