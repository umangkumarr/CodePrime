---
title: "Most Common Word"
description: "Given a string paragraph and a string array of the banned words banned, return the most frequent word that is not banned. It is guaranteed there is at…"
source: "https://leetcode.com/problems/most-common-word/"
tags: ["Hash Table", "String", "Counting"]
complexity:
  time: "O(n + b)"
  space: "O(n)"
---

## Problem

<p>Given a string <code>paragraph</code> and a string array of the banned words <code>banned</code>, return <em>the most frequent word that is not banned</em>. It is <strong>guaranteed</strong> there is <strong>at least one word</strong> that is not banned, and that the answer is <strong>unique</strong>.</p>

<p>The words in <code>paragraph</code> are <strong>case-insensitive</strong> and the answer should be returned in <strong>lowercase</strong>.</p>

## Solution approach

### Intuition

Split the paragraph into lowercase words, count how often each word appears, ignore the banned words, and take the word with the highest count. A hash map makes each count update $O(1)$ on average.

### Algorithm

1. Scan `paragraph` with index `i`. Collect consecutive letters into `s`, lowercased with `tolower`, then skip any spaces or punctuation that follow, and increment `m[s]`.
2. Set `m[x] = 0` for every banned word `x`, so it can never win.
3. Walk through `m` and keep the word with the largest count in `res`.
4. Return `res`.

### Complexity

- **Time:** $O(n + b)$ — `n` is the length of `paragraph` and `b` the total length of the banned words; every character is handled a constant number of times on average.
- **Space:** $O(n)$ — the map holds at most every word in the paragraph.

### Edge cases

- **Punctuation next to words** such as `"ball,"` is dropped, because only `isalpha` characters are added to `s`.
- **Mixed case** such as `"Bob"` and `"bob"` is counted as one word.

## Code

```cpp title="C++"
class Solution {
public:
    string mostCommonWord(string paragraph, vector<string>& banned) {
        unordered_map<string, int>m;
        for(int i = 0; i < paragraph.size();){
            string s = "";
            while(i < paragraph.size() && isalpha(paragraph[i])) s.push_back(tolower(paragraph[i++]));
            while(i < paragraph.size() && !isalpha(paragraph[i])) i++;
            m[s]++;
        }
        for(auto x: banned) m[x] = 0;
        string res = "";
        int count = 0;
        for(auto x: m)
            if(x.second > count) res = x.first, count = x.second;
        return res;  
    }
};
```
