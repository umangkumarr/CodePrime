---
sidebar_position : 1
tags: [Stack, Tree, Depth-First Search, Binary Tree]
---

# Binary Tree Inorder Traversal

## Problem Link
https://leetcode.com/problems/binary-tree-inorder-traversal/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    vector<int> inorder;

   public:
    void traversal(TreeNode* root) {
        if (!root) return;
        traversal(root->left);
        inorder.push_back(root->val);
        traversal(root->right);
    }

    vector<int> inorderTraversal(TreeNode* root) {
        traversal(root);
        return inorder;
    }
};
```
</TabItem>
</Tabs>

</details>
