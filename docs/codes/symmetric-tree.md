---
displayed_sidebar: null
sidebar_position : 124
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
---

# Symmetric Tree

## [Problem](https://leetcode.com/problems/symmetric-tree/)

<p>Given the <code>root</code> of a binary tree, <em>check whether it is a mirror of itself</em> (i.e., symmetric around its center).</p>

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
    bool traversal(TreeNode* p, TreeNode* q) {
        if (!p && !q) return true;
        if ((!p && q) || (p && !q)) return false;
        if (p->val != q->val) return false;
        return (traversal(p->right, q->left) & traversal(p->left, q->right));
    }

    bool isSymmetric(TreeNode* root) {
        return traversal(root->left, root->right);
    }
};

```
</TabItem>
</Tabs>

</details>
