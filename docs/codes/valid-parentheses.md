---
sidebar_position : 80
tags: [String, Stack]
---

# Valid Parentheses

## [Problem](https://leetcode.com/problems/valid-parentheses/)

<p>Given a string <code>s</code> containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.</p>

<p>An input string is valid if:</p>

<ol>
	<li>Open brackets must be closed by the same type of brackets.</li>
	<li>Open brackets must be closed in the correct order.</li>
</ol>

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
    bool isValid(string s) {
        stack<char> st;
        for (int i = 0; i < s.length(); i++) {
            if (s[i] == '(' || s[i] == '[' || s[i] == '{')
                st.push(s[i]);
            else {
                if (s[i] == '}' && st.size() && st.top() == '{') {
                    st.pop();
                } else if (s[i] == ']' && st.size() && st.top() == '[') {
                    st.pop();
                } else if (s[i] == ')' && st.size() && st.top() == '(') {
                    st.pop();
                } else {
                    return false;
                }
            }
        }
        if (st.size()) return false;
        return true;
    }
};

```
</TabItem>
</Tabs>

</details>
