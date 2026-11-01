---
title: "Longest Palindromic Substring"
description: "Given a string s, return the longest palindromic substring in s."
source: "https://leetcode.com/problems/longest-palindromic-substring/"
tags: ["String", "Dynamic Programming"]
complexity:
  time: "O(n^3)"
  space: "O(1)"
---

## Problem

<p>Given a string <code>s</code>, return <em>the longest palindromic substring</em> in <code>s</code>.</p>

## Solution approach

### Intuition

This is a brute-force check of substrings with pruning. For each start `i`, the code tries end positions `j` from the right, and for each pair checks whether `s[i..j]` is a palindrome by comparing characters inward from both ends.

The pruning uses `mxx`, the furthest end index of the best palindrome found so far. A palindrome that starts at a later `i` and ends at or before `mxx` must be shorter than the current best, so only ends `j` at or after `mxx` are tried.

### Algorithm

1. Return `s` directly if its length is at most `1`.
2. For each start `i`, set `mxx = max(mxx, i)` and loop `j` from `n - 1` down to `mxx`.
3. Compare `s[itr1]` with `s[itr]`, moving `itr1` right from `i` and `itr` left from `j`, adding `2` to `len` per matched pair, or `1` for the middle character.
4. If the pointers met or crossed (`itr1 >= itr`), `s[i..j]` is a palindrome; if `len` beats `mx`, record `mx = len`, `indx = i` and update `mxx`.
5. Return the substring of length `mx` starting at `indx`.

### Complexity

- **Time:** $O(n^3)$ in the worst case — $O(n^2)$ start and end pairs, each with a check of up to $O(n)$; the `mxx` pruning makes typical inputs much faster.
- **Space:** $O(1)$ extra, apart from the returned string.

### Edge cases

- **Ties:** only a strictly longer palindrome replaces the best, so the earliest one of maximum length is returned.

## Code

```cpp title="C++"
class Solution {
   public:
    string longestPalindrome(string s) {
        int n = s.length();
        if (n <= 1) {
            return s;
        }
        int mx = 0;
        int indx, mxx = 0;
        for (int i = 0; i < n; i++) {
            mxx = max(mxx, i);
            for (int j = n - 1; j >= mxx; j--) {
                int itr = j, itr1 = i;
                int len = 0;
                while (itr1 <= itr && s[itr1] == s[itr]) {
                    if (itr1 != itr)
                        len += 2;
                    else
                        len++;
                    itr1++;
                    itr--;
                }
                if (itr1 >= itr && mx < len) {
                    mx = len;
                    indx = i;
                    mxx = max(mxx, j);
                }
            }
        }
        string ans = string(s.begin() + indx, s.begin() + indx + mx);
        return ans;
    }
};

```
