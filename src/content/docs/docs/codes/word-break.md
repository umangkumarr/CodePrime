---
title: "Word Break"
description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.…"
source: "https://leetcode.com/problems/word-break/"
tags: ["Hash Table", "String", "Dynamic Programming", "Trie", "Memoization"]
complexity:
  time: "O(n^3)"
  space: "O(n + W)"
---

## Problem

<p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, return <code>true</code> if <code>s</code> can be segmented into a space-separated sequence of one or more dictionary words.</p>

<p><strong>Note</strong> that the same word in the dictionary may be reused multiple times in the segmentation.</p>

## Solution approach

### Intuition

Let `dp[i]` be `true` when the first `i` characters of `s` can be split into dictionary words. The prefix of length `i` is breakable if some split point `j` has a breakable prefix `dp[j]` and the remaining piece `s.substr(j, i - j)` is a dictionary word. Trying all splits recursively without storing results would repeat the same subproblems exponentially often.

### Algorithm

1. Put every word of `wordDict` in the hash map `mp`.
2. Set `dp[0] = true`, since the empty prefix is trivially breakable.
3. For each `i` from `1` to `s.size()`, try every `j` from `i - 1` down to `0`. If `dp[j]` is `true` and `s.substr(j, i - j)` is in `mp`, set `dp[i] = true`.
4. Return `dp[s.size()]`.

### Complexity

- **Time:** $O(n^3)$ — $O(n^2)$ pairs `(i, j)`, and each builds and hashes a substring of length up to $n$.
- **Space:** $O(n + W)$ — the `dp` array plus the dictionary map of total size $W$.

## Code

```cpp title="C++"
class Solution {
   public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_map<string, int> mp;
        for (auto i : wordDict) mp[i] = 1;

        vector<bool> dp(s.size() + 1);
        dp[0] = true;
        for (int i = 1; i <= s.size(); i++) {
            for (int j = i - 1; j >= 0; j--) {
                string w = s.substr(j, i - j);
                if (mp.find(w) != mp.end() && dp[j]) dp[i] = true;
            }
        }

        return dp[s.size()];
    }
};

```
