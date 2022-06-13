---
sidebar_position : 6
tags: [Array, Dynamic Programming, Hash Table, String]
---

# Word Break

## Problem Link
https://leetcode.com/problems/word-break/

## Solution Approach
Use dyanmic programming.
For the string $s$, take all possible suffix and for each suffix(say length $L$) check whether the suffix string is present in the given word dictionary and also check if the string $s(0, len - L)$ can be formed from the dictionary or not. If it possible then break the string $s$ from the index $len-L$ ($L$ from backward).

Expected Time complexity: $O(n^2)$

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
