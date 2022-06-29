---
sidebar_position : 10
tags: [Hash Table, Tree, Depth-First Search, Binary Tree]
---

# Vertical Order Traversal of a Binary Tree

## Problem Link
https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    map<int, map<int, vector<int>>> mp;

   public:
    void traverse(TreeNode* root, int c, int r) {
        if (!root) return;
        mp[c][r].push_back(root->val);
        traverse(root->left, c - 1, r + 1);
        traverse(root->right, c + 1, r + 1);
    }

    vector<vector<int>> verticalTraversal(TreeNode* root) {
        traverse(root, 0, 0);
        vector<vector<int>> ans;
        for (auto i : mp) {
            vector<int> v;
            for (auto j : i.second) {
                sort(j.second.begin(), j.second.end());
                for (auto k : j.second) v.push_back(k);
            }
            ans.push_back(v);
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
