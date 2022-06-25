---
sidebar_position : 1
tags: [Linked List, Stack, Tree, Depth-First Search, Binary Tree]
---

# Flatten Binary Tree to Linked List

## Problem Link
https://leetcode.com/problems/flatten-binary-tree-to-linked-list/

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

    void flatten(TreeNode* root) {
        if (root == NULL) return;
        traversal(root);
        root->left = NULL;
        root->right = NULL;
        root->val = preorder[0];
        TreeNode* tmp = root;
        for (int i = 1; i < preorder.size(); i++) {
            TreeNode* newNode = new TreeNode(preorder[i]);
            tmp->right = newNode;
            tmp = newNode;
        }
    }
};
```
</TabItem>
</Tabs>

</details>
