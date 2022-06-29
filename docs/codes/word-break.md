---
sidebar_position : 16
tags: [Hash Table, String, Dynamic Programming, Trie, Memoization]
---

# Word Break

## [Problem](https://leetcode.com/problems/word-break/)

<p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, return <code>true</code> if <code>s</code> can be segmented into a space-separated sequence of one or more dictionary words.</p>

<p><strong>Note</strong> that the same word in the dictionary may be reused multiple times in the segmentation.</p>

## Solution Approach

We use a boolean vector $dp[]$. $dp[i]$ is set to true if a valid word (word sequence) ends there. The optimization is to look from current position $i$ back and only substring and do dictionary look up in case the preceding position $j$ with $dp[j] == true$ is found.

Expected Time complexity: $O(n^3)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
