---
sidebar_position : 5
tags: [Queue, Stack]
---

# Valid Parentheses

## Problem Link
https://leetcode.com/problems/valid-parentheses/

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
