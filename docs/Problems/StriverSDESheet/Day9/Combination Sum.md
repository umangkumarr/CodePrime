---
sidebar_position : 3
tags: [Array, Backtracking]
---

# Combination Sum

## Problem Link
https://leetcode.com/problems/combination-sum/

## Solution Approach
Refer Code for Algorithm.

Expected Time complexity: $O(n^2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    int target;
    vector<int> comb;
    vector<int> arr;
    vector<vector<int>> ans;
    int sm, n;

   public:
    void find(int indx) {
        if (sm == target) {
            ans.push_back(arr);
            return;
        }
        if (sm > target || indx >= n) return;
        find(indx + 1);

        for (int i = 1; i <= target / comb[indx]; i++) {
            arr.push_back(comb[indx]);
            sm += comb[indx];
            find(indx + 1);
        }

        for (int i = 1; i <= target / comb[indx]; i++) {
            arr.pop_back();
            sm -= comb[indx];
        }
    }

    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        this->comb = candidates;
        this->target = target;
        this->n = candidates.size();
        this->sm = 0;
        find(0);
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
