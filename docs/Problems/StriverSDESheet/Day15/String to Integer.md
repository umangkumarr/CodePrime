---
sidebar_position : 4
tags: [String]
---

# String to Integer

## Problem Link
https://leetcode.com/problems/string-to-integer-atoi/

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
    int myAtoi(string s) {
        long long ans = 0;
        int n = s.length();
        int i = 0, check = 0;
        while (i < n && s[i] == ' ') i++;
        if (s[i] == '-') check = 1;
        if (s[i] == '+' || s[i] == '-') i++;
        if (!(i < n && s[i] - '0' < 10 && s[i] - '0' >= 0)) return 0;

        while (i < n && s[i] - '0' < 10 && s[i] - '0' >= 0) {
            int num = s[i++] - '0';
            ans = ans * 10 + num;
            if (ans >= 2147483647 && check == 0)
                return 2147483647;
            else if (ans >= 2147483648 && check == 1)
                return -2147483648;
        }

        if (check) ans *= -1;
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
