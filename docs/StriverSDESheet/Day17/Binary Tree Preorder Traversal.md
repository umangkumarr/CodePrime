---
sidebar_position : 2
tags: [Stack, Tree, Depth-First Search, Binary Tree]
---

# Binary Tree Preorder Traversal

## Problem Link
https://leetcode.com/problems/binary-tree-preorder-traversal/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    vector<int> preorder;

   public:
    void traversal(TreeNode* root) {
        if (!root) return;
        preorder.push_back(root->val);
        traversal(root->left);
        traversal(root->right);
    }

    vector<int> preorderTraversal(TreeNode* root) {
        traversal(root);
        return preorder;
    }
};
```
</TabItem>
</Tabs>

</details>
