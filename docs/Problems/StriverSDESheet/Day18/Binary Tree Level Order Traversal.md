---
sidebar_position : 1
tags: [Tree, Depth-First Search, Binary Tree]
---

# Binary Tree Level Order Traversal

## Problem Link
https://leetcode.com/problems/binary-tree-level-order-traversal/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    map<int, vector<int>> mp;

   public:
    void traverse(TreeNode* root, int h) {
        if (!root) return;
        mp[h].push_back(root->val);
        traverse(root->left, h + 1);
        traverse(root->right, h + 1);
    }

    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> ans;
        traverse(root, 0);
        for (auto i : mp) ans.push_back(i.second);
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
