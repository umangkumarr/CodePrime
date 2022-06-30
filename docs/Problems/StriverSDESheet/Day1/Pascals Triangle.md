---
sidebar_position : 2
tags: [Array, Dynamic Programming]
---

# Pascal's Triangle

## [Problem](https://leetcode.com/problems/pascals-triangle/)

<p>Given an integer <code>numRows</code>, return the first numRows of <strong>Pascal&#39;s triangle</strong>.</p>

<p>In <strong>Pascal&#39;s triangle</strong>, each number is the sum of the two numbers directly above it as shown:</p>
<img alt="" src="https://upload.wikimedia.org/wikipedia/commons/0/0d/PascalTriangleAnimated2.gif" />


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
    vector<vector<int>> generate(int n) {
        vector<vector<int>> ans;
        vector<int> a, b;
        a = {1};
        ans.push_back(a);
        if (n == 1) return ans;
        for (int i = 2; i <= n; i++) {
            b.push_back(1);
            for (int k = 0; k < a.size() - 1; k++) {
                b.push_back(a[k] + a[k + 1]);
            }
            b.push_back(1);
            ans.push_back(b);
            a = b;
            b.clear();
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
