---
sidebar_position : 4
tags: [Two Pointer, String, String Matching]
---

# Count and Say

## Problem Link
https://leetcode.com/problems/count-and-say/

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
    string find_next(string s) {
        int cnt = 1;
        int n = s.length();
        string ss = "";
        for (int i = 1; i < n; i++) {
            if (s[i] != s[i - 1]) {
                ss.push_back(cnt + '0');
                ss.push_back(s[i - 1]);
                cnt = 0;
            }
            cnt++;
        }
        if (cnt) {
            ss.push_back(cnt + '0');
            ss.push_back(s[n - 1]);
        }
        return ss;
    }

    string countAndSay(int n) {
        if (n == 1) return "1";
        string s = find_next("1");
        for (int i = 3; i <= n; i++) {
            s = find_next(s);
        }
        return s;
    }
};
```
</TabItem>
</Tabs>

</details>
