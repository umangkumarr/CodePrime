---
sidebar_position : 5
tags: [Two Pointer, String, String Matching]
---

# Compare Version Numbers

## Problem Link
https://leetcode.com/problems/compare-version-numbers/

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
    int compareVersion(string version1, string version2) {
        vector<int> v1, v2;
        int last = 0;
        for (int i = 0; i <= version1.size(); i++)
            if (version1[i] == '.' || i == version1.size())
                v1.push_back(stoi(version1.substr(last, i - last))),
                    last = i + 1;
        last = 0;
        for (int i = 0; i <= version2.size(); i++)
            if (version2[i] == '.' || i == version2.size())
                v2.push_back(stoi(version2.substr(last, i - last))),
                    last = i + 1;

        int sz1 = v1.size(), sz2 = v2.size();
        int cnt = abs(sz2 - sz1);
        if (sz1 < sz2)
            while (cnt--) v1.push_back(0);
        else
            while (cnt--) v2.push_back(0);
        for (int i = 0; i < v1.size(); i++)
            if (v1[i] != v2[i]) return (v1[i] < v2[i]) ? -1 : 1;
        return 0;
    }
};
```
</TabItem>
</Tabs>

</details>
