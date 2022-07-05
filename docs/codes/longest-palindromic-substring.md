---
displayed_sidebar: null
sidebar_position : 94
tags: [String, Dynamic Programming]
---

# Longest Palindromic Substring

## [Problem](https://leetcode.com/problems/longest-palindromic-substring/)

<p>Given a string <code>s</code>, return <em>the longest palindromic substring</em> in <code>s</code>.</p>

## Solution Approach

Expected Time complexity: $O(n^2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    string longestPalindrome(string s) {
        int n = s.length();
        if (n <= 1) {
            return s;
        }
        int mx = 0;
        int indx, mxx = 0;
        for (int i = 0; i < n; i++) {
            mxx = max(mxx, i);
            for (int j = n - 1; j >= mxx; j--) {
                int itr = j, itr1 = i;
                int len = 0;
                while (itr1 <= itr && s[itr1] == s[itr]) {
                    if (itr1 != itr)
                        len += 2;
                    else
                        len++;
                    itr1++;
                    itr--;
                }
                if (itr1 >= itr && mx < len) {
                    mx = len;
                    indx = i;
                    mxx = max(mxx, j);
                }
            }
        }
        string ans = string(s.begin() + indx, s.begin() + indx + mx);
        return ans;
    }
};

```
</TabItem>
</Tabs>

</details>
