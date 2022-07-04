---
sidebar_position : 50
tags: [Array, Backtracking]
---

# Combination Sum

## [Problem](https://leetcode.com/problems/combination-sum/)

<p>Given an array of <strong>distinct</strong> integers <code>candidates</code> and a target integer <code>target</code>, return <em>a list of all <strong>unique combinations</strong> of </em><code>candidates</code><em> where the chosen numbers sum to </em><code>target</code><em>.</em> You may return the combinations in <strong>any order</strong>.</p>

<p>The <strong>same</strong> number may be chosen from <code>candidates</code> an <strong>unlimited number of times</strong>. Two combinations are unique if the frequency of at least one of the chosen numbers is different.</p>

<p>It is <strong>guaranteed</strong> that the number of unique combinations that sum up to <code>target</code> is less than <code>150</code> combinations for the given input.</p>

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
