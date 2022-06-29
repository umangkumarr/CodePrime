---
sidebar_position : 6
tags: [String, String Matching]
---

# Repeated String Match

## Problem Link
https://leetcode.com/problems/repeated-string-match/

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
    int repeatedStringMatch(string a, string b) {
        string s = a;
        int count = 1;
        int maxPossibleRepetions = b.length() / a.length() + 2;
        for (int i = 1; i <= maxPossibleRepetions; i++) {
            int f = s.find(b);
            if (f != -1) return count;
            s = s + a;
            count++;
        }
        return -1;
    }
};
```
</TabItem>
</Tabs>

</details>
