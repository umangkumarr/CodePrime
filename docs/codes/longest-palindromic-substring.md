---
sidebar_position : 14
tags: [String, Dynamic Programming]
---

# Longest Palindromic Substring

## [Problem](https://leetcode.com/problems/longest-palindromic-substring/)

<p>Given a string <code>s</code>, return <em>the longest palindromic substring</em> in <code>s</code>.</p>

```
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.
```

## Solution Approach

Use two pointer to find the palindromic substring starting at index $i$ and store the ending index(say $j$) of the current palindromic substring. Then ending index of the next palindromic substring will always be greater than $j$. Use this observation to solve the problem.

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
        int mx = 0; // store max length of any palindromic substring
        int indx, last = 0;
        for (int i = 0; i < n; i++) {
            last = max(last, i);
            for (int j = n - 1; j >= last; j--) {
                int itr = j, itr1 = i;
                int len = 0;

                // check if i to j is a palindrome 
                while (itr1 <= itr && s[itr1] == s[itr]) {
                    if (itr1 != itr) len += 2;
                    else len++;
                    itr1++;
                    itr--;
                }

                // if substring i to j is a palindrome update ans
                if (itr1 >= itr && mx < len) {
                    mx = len;
                    indx = i;
                    last = max(last, j);
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
