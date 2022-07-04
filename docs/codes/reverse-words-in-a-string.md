---
sidebar_position : 90
tags: [Two Pointers, String]
---

# Reverse Words in a String

## [Problem](https://leetcode.com/problems/reverse-words-in-a-string/)

<p>Given an input string <code>s</code>, reverse the order of the <strong>words</strong>.</p>

<p>A <strong>word</strong> is defined as a sequence of non-space characters. The <strong>words</strong> in <code>s</code> will be separated by at least one space.</p>

<p>Return <em>a string of the words in reverse order concatenated by a single space.</em></p>

<p><b>Note</b> that <code>s</code> may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces.</p>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
