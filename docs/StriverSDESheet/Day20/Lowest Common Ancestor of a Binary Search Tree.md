---
sidebar_position : 6
tags: [Tree, Breadth-First Search, Binary Tree]
---

# Lowest Common Ancestor of a Binary Search Tree

## Problem Link
https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root) return NULL;

        if (root == p || root == q) return root;
        TreeNode* left = lowestCommonAncestor(root->left, p, q);
        TreeNode* right = lowestCommonAncestor(root->right, p, q);

        if (left && right) return root;
        if (!left)
            return right;
        else
            return left;
    }
};
```
</TabItem>
</Tabs>

</details>
