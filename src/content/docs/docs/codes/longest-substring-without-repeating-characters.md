---
title: "Longest Substring Without Repeating Characters"
description: "Given a string s, find the length of the longest substring without repeating characters."
source: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
tags: ["Hash Table", "String", "Sliding Window"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>

## Solution approach

### Intuition

Use a sliding window that ends at index `i` and contains no repeated characters. Its left border `start` (exclusive) only needs to move when `s[i]` already appears inside the window: then it jumps to the previous position of `s[i]`. Storing the last position of every character lets us make that jump in $O(1)$, so we never re-scan the window as the $O(n^2)$ brute force would.

### Algorithm

1. `dict` stores the last index of each of the 256 characters, initially `-1`; `start = -1` and `maxLen = 0`.
2. For each `i`, if `dict[s[i]] > start`, the character repeats inside the window, so set `start = dict[s[i]]`.
3. Record `dict[s[i]] = i`.
4. The window is `(start, i]`, so update `maxLen` with `i - start`.
5. Return `maxLen`.

### Complexity

- **Time:** $O(n)$ — a single pass over the string.
- **Space:** $O(1)$ — the `dict` array has a fixed size of 256.

### Edge cases

- **Empty string:** the loop never runs and `0` is returned.
- **Old occurrences** left of `start` are ignored by the `dict[s[i]] > start` check, so the window never moves backwards.

## Code

```cpp title="C++"
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
