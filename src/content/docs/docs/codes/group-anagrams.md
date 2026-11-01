---
title: "Group Anagrams"
description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging…"
source: "https://leetcode.com/problems/group-anagrams/"
tags: ["Array", "Hash Table", "String", "Sorting"]
complexity:
  time: "O(n \\cdot L \\log L + n \\cdot L \\log n)"
  space: "O(n \\cdot L)"
---

## Problem

<p>Given an array of strings <code>strs</code>, group <strong>the anagrams</strong> together. You can return the answer in <strong>any order</strong>.</p>

<p>An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>

## Solution approach

### Intuition

Two strings are anagrams exactly when they contain the same letters with the same counts, which is the same as saying their sorted forms are equal. So the sorted string works as a key: every word is put in the group of its sorted form.

### Algorithm

1. For each `strs[i]`, copy it into `s` and sort `s`.
2. Append the original word to `mp[s]`, where `mp` is a `map` from sorted key to its list of words.
3. Push every group `i.second` from `mp` into `ans` and return it.

### Complexity

- **Time:** $O(n \cdot L \log L + n \cdot L \log n)$, where $n$ is the number of words and $L$ their maximum length — sorting each word, plus $n$ insertions into a `std::map` whose key comparisons cost up to $O(L)$ each.
- **Space:** $O(n \cdot L)$ — the map stores every key and every word.

### Edge cases

- **Empty strings:** all of them share the key `""` and form one group.
- **Single word:** it becomes a group of its own.

## Code

```cpp title="C++"
class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        map<string, vector<string>> mp;
        vector<vector<string>> ans;
        for (int i = 0; i < strs.size(); i++) {
            string s = strs[i];
            sort(s.begin(), s.end());
            mp[s].push_back(strs[i]);
        }
        for (auto i : mp) {
            ans.push_back(i.second);
        }
        return ans;
    }
};
```
