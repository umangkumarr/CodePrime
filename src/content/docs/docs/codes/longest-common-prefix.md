---
title: "Longest Common Prefix"
description: "Find the longest prefix shared by all strings in an array by vertical scanning: compare column by column and stop at the first mismatch."
source: "https://leetcode.com/problems/longest-common-prefix/"
difficulty: "Easy"
tags: ["Array", "String", "Trie"]
complexity:
  time: "O(S)"
  space: "O(1)"
---

## Problem

Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string `""`.

**Example 1:**

```text
Input:  strs = ["flower","flow","flight"]
Output: "fl"
```

**Example 2:**

```text
Input:  strs = ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.
```

**Constraints:**

- $1 \le$ `strs.length` $\le 200$
- $0 \le$ `strs[i].length` $\le 200$
- `strs[i]` consists of only lowercase English letters if it is non-empty.

## Solution approach

### Intuition

Write the strings one under another, aligned on the left:

```text
f l o w e r
f l o w
f l i g h t
    ^ column 2 differs
```

The common prefix is made of the columns, read from the left, in which **every** string has the same character. So scan **vertically**: for column `k = 0, 1, 2, ...`, check `s[k]` of every string against `first[k]` (the first string's character). The first column where some string is too short or has a different character ends the prefix — it is `first[0..k)`. If no column fails, the whole first string is the prefix.

Scanning column by column stops at the first mismatch, so we never read characters beyond the answer's length plus one column, even if some strings are very long.

### Algorithm

1. Let `first = strs[0]`.
2. For `k` from `0` to `first.size() - 1`, and for every string `s` in `strs`:
   - if `k == s.size()` (the string has ended) or `s[k] != first[k]`, return `first.substr(0, k)`.
3. Every column matched: return `first`.

### Complexity

- **Time:** $O(S)$, where `S` is the total number of characters — more precisely $O(n \cdot (p + 1))$ for `n` strings and an answer of length `p`, since each column inspects every string once.
- **Space:** $O(1)$ extra besides the returned string.

### Edge cases

- **A single string:** every column matches itself and `first` is returned.
- **An empty string anywhere:** at `k = 0` either `first` is empty (the loop does not run and `""` is returned) or that string fails `k == s.size()` and `""` is returned.
- **A string that is a prefix of the others** (like `"flow"` vs `"flower"`): the length check stops the scan before reading past its end.

## Code

```cpp title="C++"
class Solution {
   public:
    string longestCommonPrefix(vector<string>& strs) {
        const string& first = strs[0];
        for (int k = 0; k < (int)first.size(); k++) {
            for (const string& s : strs) {
                if (k == (int)s.size() || s[k] != first[k]) return first.substr(0, k);
            }
        }
        return first;
    }
};
```
