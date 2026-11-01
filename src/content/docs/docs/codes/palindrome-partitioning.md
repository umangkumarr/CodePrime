---
title: "Palindrome Partitioning"
description: "Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s. A palindrome…"
source: "https://leetcode.com/problems/palindrome-partitioning/"
tags: ["String", "Dynamic Programming", "Backtracking"]
complexity:
  time: "O(n^2 \\cdot 2^n)"
  space: "O(n)"
---

## Problem

<p>Given a string <code>s</code>, partition <code>s</code> such that every substring of the partition is a <strong>palindrome</strong>. Return all possible palindrome partitioning of <code>s</code>.</p>

<p>A <strong>palindrome</strong> string is a string that reads the same backward as forward.</p>

## Solution approach

### Intuition

Every partition is built by choosing a first piece, which must be a palindrome, and then partitioning the rest of the string in the same way. This is classic backtracking: at position `indx`, try every palindromic prefix of the remaining string, recurse on what follows it, then undo the choice.

### Algorithm

1. Store the string in `w` and its length in `n`, then call `partition(0)`.
2. In `partition(indx)`, if `indx == n` the whole string has been split, so push a copy of the current pieces `arr` into `ans`.
3. Otherwise extend a candidate piece `s` one character at a time for `j` from `indx` to `n - 1`. Reverse a copy `ss`; if `ss == s` the piece is a palindrome, so push it into `arr`, recurse with `partition(j + 1)`, and pop it afterwards.
4. Return `ans`.

### Complexity

- **Time:** $O(n^2 \cdot 2^n)$ in the worst case — a string such as `"aaaa"` has $2^{n-1}$ partitions, and each recursive call tries up to `n` prefixes, each checked by an $O(n)$ reverse and compare.
- **Space:** $O(n)$ for the recursion stack and `arr`, not counting the output `ans`, which can hold $O(n \cdot 2^n)$ characters.

## Code

```cpp title="C++"
class Solution {
    int n;
    string w;
    vector<string> arr;
    vector<vector<string>> ans;

   public:
    void partition(int indx) {
        if (indx == n) {
            ans.push_back(arr);
            return;
        }
        string s = "", ss;
        for (int j = indx; j < n; j++) {
            s.push_back(w[j]);
            ss = s;
            reverse(ss.begin(), ss.end());
            if (ss == s) {
                arr.push_back(s);
                partition(j + 1);
                arr.pop_back();
            }
        }
    }

    vector<vector<string>> partition(string s) {
        this->n = s.length();
        this->w = s;
        partition(0);
        return ans;
    }
};

```
