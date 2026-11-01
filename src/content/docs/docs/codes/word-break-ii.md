---
title: "Word Break II"
description: "Given a string s and a dictionary of strings wordDict, add spaces in s to construct a sentence where each word is a valid dictionary word. Return all such…"
source: "https://leetcode.com/problems/word-break-ii/"
tags: ["Hash Table", "String", "Dynamic Programming", "Backtracking", "Trie", "Memoization"]
complexity:
  time: "O(2^n \\cdot D \\cdot L)"
  space: "O(2^n \\cdot n)"
---

## Problem

<p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, add spaces in <code>s</code> to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in <strong>any order</strong>.</p>

<p><strong>Note</strong> that the same word in the dictionary may be reused multiple times in the segmentation.</p>

## Solution approach

### Intuition

At any index `indx`, try every word in the dictionary that starts at that index of the string. If a word matches, append it to the current sentence and solve the rest of the string, starting from `indx + word.length()`, recursively. Reaching the end of the string means the current list of words is a valid sentence, so it is added to the answer. Backtracking (removing the last word) lets us explore the other choices.

### Algorithm

1. Store the dictionary in the hash map `word` and the string in the member `s`.
2. `compute(indx)`: if `indx == s.length()`, push the current word list `thisOne` into `ans` and return.
3. Otherwise, for every dictionary word that fits, take `w = s.substr(indx, length)`. If it equals the word, push `w` onto `thisOne`, call `compute(indx + w.length())`, then pop it.
4. In `wordBreak`, call `compute(0)`, then join each word list in `ans` with single spaces into `sen` and return it.

### Complexity

- **Time:** $O(2^n \cdot D \cdot L)$ — without memoization the recursion may explore every way to split `s` (up to $2^{n-1}$), and each call tries all $D$ dictionary words with an $O(L)$ substring comparison, where $L$ is the maximum word length.
- **Space:** $O(2^n \cdot n)$ — dominated by the output; the recursion stack itself is at most $n$ deep.

### Edge cases

- **No valid split**: `compute` never reaches the end, so `ans` and the returned list are empty.

## Code

```cpp title="C++"
class Solution {
    unordered_map<string, int> word;
    string s;
    vector<string> thisOne;
    vector<vector<string>> ans;

   public:
    void compute(int indx) {
        if (indx == s.length()) {
            ans.push_back(thisOne);
            return;
        }

        for (auto i : word) {
            if (indx + i.first.length() > s.length()) continue;
            string w = s.substr(indx, i.first.length());
            if (i.first == w) {
                thisOne.push_back(w);
                compute(indx + w.length());
                thisOne.pop_back();
            }
        }
    }

    vector<string> wordBreak(string s, vector<string>& wordDict) {
        for (auto i : wordDict) word[i] = 1;
        this->s = s;
        vector<string> sen;
        string t;
        compute(0);
        for (auto i : ans) {
            string a = "";
            for (auto j : i) {
                a = a + j;
                a += ' ';
            }
            a.pop_back();
            sen.push_back(a);
        }
        return sen;
    }
};
```
