---
sidebar_position : 1
tags: [Two Pointer, String]
---

# Reverse Words in a String

## Problem Link
https://leetcode.com/problems/reverse-words-in-a-string/

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
