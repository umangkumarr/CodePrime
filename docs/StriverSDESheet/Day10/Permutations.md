---
sidebar_position : 1
tags: [Array, Backtracking]
---

# Permutations

## Problem Link
https://leetcode.com/problems/permutations/

## Solution Approach
Refer Code for self explanation and algorithm.

Expected Time complexity: $O(n!)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<vector<int> > permute(vector<int> &num) {
        vector<vector<int> > result;

        permuteRecursive(num, 0, result);
        return result;
    }

    void permuteRecursive(vector<int> &num, int begin,
                          vector<vector<int>> &result) {
        if (begin >= num.size()) {
            result.push_back(num);
            return;
        }

        for (int i = begin; i < num.size(); i++) {
            swap(num[begin], num[i]);
            permuteRecursive(num, begin + 1, result);
            swap(num[begin], num[i]);
        }
    }
};
```
</TabItem>
</Tabs>

</details>
