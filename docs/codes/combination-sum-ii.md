---
displayed_sidebar: null
sidebar_position : 48
tags: [Array, Backtracking]
---

# Combination Sum II

## [Problem](https://leetcode.com/problems/combination-sum-ii/)

<p>Given a collection of candidate numbers (<code>candidates</code>) and a target number (<code>target</code>), find all unique combinations in <code>candidates</code>&nbsp;where the candidate numbers sum to <code>target</code>.</p>

<p>Each number in <code>candidates</code>&nbsp;may only be used <strong>once</strong> in the combination.</p>

<p><strong>Note:</strong>&nbsp;The solution set must not contain duplicate combinations.</p>

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
   public:
    vector<vector<int>> combinationSum2(vector<int>& num, int target) {
        vector<vector<int>> res;
        sort(num.begin(), num.end());
        vector<int> local;
        findCombination(res, 0, target, local, num);
        return res;
    }
    void findCombination(vector<vector<int>>& res, const int order,
                         const int target, vector<int>& local,
                         const vector<int>& num) {
        if (target == 0) {
            res.push_back(local);
            return;
        } else {
            for (int i = order; i < num.size(); i++) {
                if (num[i] > target) return;
                if (i && num[i] == num[i - 1] && i > order) continue;
                local.push_back(num[i]),
                    findCombination(res, i + 1, target - num[i], local, num);
                local.pop_back();
            }
        }
    }
};

```
</TabItem>
</Tabs>

</details>
