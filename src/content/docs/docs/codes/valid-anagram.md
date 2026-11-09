---
title: "Valid Anagram"
description: "Check whether one string is an anagram of another by counting letters in a single 26-slot frequency array, in linear time and constant space."
source: "https://leetcode.com/problems/valid-anagram/"
difficulty: "Easy"
tags: ["Hash Table", "String", "Sorting"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.

An **anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.

**Example 1:**

```text
Input:  s = "anagram", t = "nagaram"
Output: true
```

**Example 2:**

```text
Input:  s = "rat", t = "car"
Output: false
```

**Constraints:**

- $1 \le$ `s.length`, `t.length` $\le 5 \times 10^4$
- `s` and `t` consist of lowercase English letters.

**Follow-up:** What if the inputs contain Unicode characters? How would you adapt your solution to such a case?

## Solution approach

### Intuition

Two strings are anagrams exactly when every letter occurs the same number of times in both. Sorting both strings and comparing works in $O(n \log n)$, but with only 26 possible letters we can simply **count**.

One array is enough: add `1` for each letter of `s` and subtract `1` for each letter of `t`. The strings are anagrams if and only if every counter ends at `0` — a positive counter means `s` has a letter more often than `t`, a negative one the opposite.

### Algorithm

1. If `s.size() != t.size()`, return `false` (different lengths can never match).
2. For each index `i`: `count[s[i] - 'a']++` and `count[t[i] - 'a']--`.
3. Return `true` if every entry of `count` is `0`, otherwise `false`.

### Complexity

- **Time:** $O(n)$ — one pass over the strings plus a 26-entry check.
- **Space:** $O(1)$ — a fixed array of 26 counters.

### Edge cases

- **Different lengths** (`"a"`, `"ab"`): rejected immediately by the length check, which also keeps `t[i]` in range in the loop.
- **Same letters, different counts** (`"aab"`, `"abb"`): the counters for `a` and `b` end at `+1` and `-1`.

### Follow-up: Unicode

With Unicode the alphabet is no longer 26 letters, so replace the array by a hash map from code point to count (`unordered_map<char32_t, int>`), after decoding both strings from UTF-8 into code points. The algorithm and its $O(n)$ time stay the same; the space becomes $O(k)$ for $k$ distinct characters. If the text may contain composed and decomposed forms of the same character (e.g. `é` vs `e` + combining accent), normalise both strings (for example to NFC) first.

## Code

```cpp title="C++"
class Solution {
   public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        array<int, 26> count{};
        for (size_t i = 0; i < s.size(); i++) {
            count[s[i] - 'a']++;
            count[t[i] - 'a']--;
        }
        for (int c : count)
            if (c != 0) return false;
        return true;
    }
};
```
