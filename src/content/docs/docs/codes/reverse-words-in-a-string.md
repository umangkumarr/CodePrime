---
title: "Reverse Words in a String"
description: "Given an input string s, reverse the order of the words. A word is defined as a sequence of non-space characters. The words in s will be separated by at…"
source: "https://leetcode.com/problems/reverse-words-in-a-string/"
tags: ["Two Pointers", "String"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Given an input string <code>s</code>, reverse the order of the <strong>words</strong>.</p>

<p>A <strong>word</strong> is defined as a sequence of non-space characters. The <strong>words</strong> in <code>s</code> will be separated by at least one space.</p>

<p>Return <em>a string of the words in reverse order concatenated by a single space.</em></p>

<p><b>Note</b> that <code>s</code> may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces.</p>

## Solution approach

### Intuition

Split the string into words, ignoring any number of spaces between them or at the ends, then join the words back together in reverse order with exactly one space between them.

### Algorithm

1. Scan `s` while counting the length `cnt` of the current word.
2. On a space, if `cnt > 0`, save the word `s.substr(i - cnt, cnt)` into `words` and reset `cnt`. Extra spaces are skipped because `cnt` is `0`.
3. After the loop, save the last word if `cnt` is non-zero.
4. Reverse `words`, start `w` with `words[0]`, and append each remaining word with a single leading space.
5. Return `w`.

### Complexity

- **Time:** $O(n)$ — one scan to split and one pass to join.
- **Space:** $O(n)$ — `words` and the result string together hold every character.

### Edge cases

- **Leading, trailing or repeated spaces**, e.g. `"  hello   world  "`: they produce no empty words, so the result is `"world hello"`.

## Code

```cpp title="C++"
class Solution {
   public:
    string reverseWords(string s) {
        vector<string> words;
        int cnt = 0, n = s.length();
        for (int i = 0; i < n; i++) {
            if (s[i] != ' ')
                cnt++;
            else {
                if (cnt == 0) continue;
                words.push_back(s.substr(i - cnt, cnt));
                cnt = 0;
            }
        }
        if (cnt) {
            words.push_back(s.substr(n - cnt, cnt));
            cnt = 0;
        }
        string w = "";
        reverse(words.begin(), words.end());
        w = words[0];
        for (int i = 1; i < words.size(); i++) {
            w += " " + words[i];
        }
        return w;
    }
};

```
