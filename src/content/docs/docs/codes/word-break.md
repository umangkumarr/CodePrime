---
title: "Word Break"
description: "Decide whether a string can be split into dictionary words, using prefix DP that only tries last words up to the longest dictionary length."
source: "https://leetcode.com/problems/word-break/"
difficulty: "Medium"
tags: ["Array", "Hash Table", "String", "Dynamic Programming", "Trie", "Memoization", "Brute-Force Search"]
complexity:
  time: "O(n \\cdot L^2)"
  space: "O(n + W)"
---

## Problem

Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.

**Note** that the same word in the dictionary may be reused multiple times in the segmentation.

**Example 1:**

```text
Input:  s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: Return true because "leetcode" can be segmented as "leet code".
```

**Example 2:**

```text
Input:  s = "applepenapple", wordDict = ["apple","pen"]
Output: true
Explanation: Return true because "applepenapple" can be segmented as "apple pen apple".
Note that you are allowed to reuse a dictionary word.
```

**Example 3:**

```text
Input:  s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: false
```

**Constraints:**

- $1 \le$ `s.length` $\le 300$
- $1 \le$ `wordDict.length` $\le 1000$
- $1 \le$ `wordDict[i].length` $\le 20$
- `s` and `wordDict[i]` consist of only lowercase English letters.
- All the strings of `wordDict` are **unique**.

## Solution approach

### Intuition

Think about the **last word** of a segmentation of the prefix `s[0, i)`. It is some dictionary word `s[j, i)`, and what comes before it, `s[0, j)`, must itself be segmentable. So with

`dp[i]` = "the first `i` characters of `s` can be split into dictionary words",

we get `dp[i] = true` if and only if some `j < i` has `dp[j] == true` and `s[j, i)` in the dictionary, with `dp[0] = true` for the empty prefix. Trying every split recursively without remembering results revisits the same prefixes exponentially often (think `s = "aaaa…ab"`, `wordDict = ["a","aa","aaa"]`); the table computes each prefix once.

One more observation makes it fast: the last word is at most `maxLen` characters long (the longest dictionary word, at most 20), so only `j` in `[i - maxLen, i - 1]` can work. That turns the inner loop from $O(n)$ into $O(L)$.

### Algorithm

1. Put `wordDict` into the hash set `dict` and compute `maxLen`.
2. Set `dp[0] = true` and every other entry `false`.
3. For `i = 1 .. n`, try `j = i - 1` down to `max(0, i - maxLen)`. If `dp[j]` is `true` and `s.substr(j, i - j)` is in `dict`, set `dp[i] = true` and stop trying.
4. Return `dp[n]`.

### Walkthrough

Green cells are prefixes that can be segmented; `j` marks where the last word starts:

![Prefix DP on "leetcode": dp[4] and dp[8] become true](/img/codes/word-break/dp.gif)

### Complexity

Let $n$ = `s.length` and $L$ = `maxLen` $\le 20$.

- **Time:** $O(n \cdot L^2)$ — for each `i`, at most $L$ split points, and each builds and hashes a substring of length at most $L$. (Plus $O(W)$ to build the set, where $W$ is the total length of the dictionary.)
- **Space:** $O(n + W)$ — the `dp` array and the hash set.

### Edge cases

- **Words that fit but do not chain** (`"catsandog"`): `dp[3]`, `dp[4]` and `dp[7]` are `true` ("cat", "cats", "cat sand"/"cats and"), but the only word ending at index `9` is `"dog"`, which starts at `j = 6` where `dp[6]` is `false`. So `dp[9]` stays `false`.
- **Words longer than the remaining prefix:** the inner loop never goes below `j = 0`, so `substr` is always in range.

## Code

```cpp title="C++"
class Solution {
   public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> dict(wordDict.begin(), wordDict.end());
        int maxLen = 0;
        for (const string& w : wordDict) maxLen = max(maxLen, (int)w.size());

        int n = s.size();
        vector<bool> dp(n + 1, false);  // dp[i]: s[0, i) can be segmented
        dp[0] = true;
        for (int i = 1; i <= n; i++) {
            for (int j = i - 1; j >= max(0, i - maxLen); j--) {
                if (dp[j] && dict.count(s.substr(j, i - j))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[n];
    }
};
```
