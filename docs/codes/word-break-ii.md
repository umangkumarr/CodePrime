---
displayed_sidebar: null
sidebar_position : 17
tags: [Hash Table, String, Dynamic Programming, Backtracking, Trie, Memoization]
---

# Word Break II

## [Problem](https://leetcode.com/problems/word-break-ii/)

<p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, add spaces in <code>s</code> to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in <strong>any order</strong>.</p>

<p><strong>Note</strong> that the same word in the dictionary may be reused multiple times in the segmentation.</p>

## Solution Approach

For at any index $i$ check for all words in the dictionary start from index $i$ in the string. If a word start at index $i$ append it to the sequence string and check for the subsequence of words starting from $j = i + word.length()$. If a valid sequence of words exit between the in indexes $j$ and $n$. Then append the sequence string to the ans vector. <br />
Use Recursion to solve this problem

Expected Time complexity: $O(n^4)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
