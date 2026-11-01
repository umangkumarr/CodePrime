---
title: "Maximum Number of Non-Overlapping Substrings"
description: "Given a string s of lowercase letters, you need to find the maximum number of non-empty substrings of s that meet the following conditions: The substrings…"
source: "https://leetcode.com/problems/maximum-number-of-non-overlapping-substrings/"
tags: ["String", "Greedy"]
complexity:
  time: "O(26 \\cdot n)"
  space: "O(1)"
---

## Problem

<p>Given a string <code>s</code> of lowercase letters, you need to find the maximum number of <strong>non-empty</strong> substrings of <code>s</code> that meet the following conditions:</p>

<ol>
	<li>The substrings do not overlap, that is for any two substrings <code>s[i..j]</code> and <code>s[x..y]</code>, either <code>j &lt; x</code> or <code>i &gt; y</code> is true.</li>
	<li>A substring that contains a certain character <code>c</code> must also contain all occurrences of <code>c</code>.</li>
</ol>

<p>Find <em>the maximum number of substrings that meet the above conditions</em>. If there are multiple solutions with the same number of substrings, <em>return the one with minimum total length. </em>It can be shown that there exists a unique solution of minimum total length.</p>

<p>Notice that you can return the substrings in <strong>any</strong> order.</p>

## Solution approach

### Intuition

A valid substring that contains some character `c` must stretch at least from the first to the last occurrence of `c`, and then also cover every occurrence of every other character that appears inside that range. So for each letter there is exactly one smallest valid substring that starts at its first occurrence, or none at all if the range pulls in a character that occurs earlier than that start.

These smallest candidates are either nested or disjoint, never partially overlapping. Picking the shortest ones greedily gives both the maximum count and the minimum total length: when one candidate sits inside another, the inner one is always the better choice.

### Algorithm

1. Record the first index `start[c]` and the last index `end[c]` of every letter.
2. For each letter `i`, scan `j` from `start[i]` to `end[i]`. If some `s[j]` first appears before `start[i]`, mark `skip[i] = 1` (no valid substring can start here). Otherwise extend `end[i]` to `end[s[j] - 'a']`; the loop bound grows as `end[i]` grows, so newly pulled-in letters are also checked.
3. Scan `i` from right to left with a boundary `cut` (initially `INT_MAX`). When `i` is the first occurrence of `s[i]`, its letter is not skipped, and its expanded end is before `cut`, push `s.substr(i, ...)` into `result` and set `cut = i`.
4. Scanning by decreasing start means an inner candidate is seen before any candidate containing it, and the `cut` check then rejects the outer one.

### Complexity

- **Time:** $O(26 \cdot n)$ — each of the 26 letters scans at most the whole string once, followed by one final pass.
- **Space:** $O(1)$ — three arrays of size 26, apart from the output.

### Edge cases

- **One letter fills the whole string**, such as `"aaa"`: the only candidate is the whole string.
- **Letters that never appear** keep `start = INT_MAX` and `end = INT_MIN`, so their inner loop never runs.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<string> maxNumOfSubstrings(string s) {
        vector<int> start(26, INT_MAX), end(26, INT_MIN), skip(26, 0);
        vector<string> result;

        for (int i = 0; i < s.size(); ++i)
            start[s[i] - 'a'] = min(start[s[i] - 'a'], i), end[s[i] - 'a'] = i;

        for (int i = 0; i < 26; ++i)
            for (int j = start[i]; j <= end[i]; ++j)
                if (start[s[j] - 'a'] < start[i])
                    skip[i] = 1;
                else
                    end[i] = max(end[i], end[s[j] - 'a']);

        for (int i = s.size() - 1, cut = INT_MAX; i >= 0; --i)
            if (i == start[s[i] - 'a'] && end[s[i] - 'a'] < cut &&
                !skip[s[i] - 'a'])
                result.push_back(s.substr((cut = i), end[s[i] - 'a'] - i + 1));

        return result;
    }
};

```
