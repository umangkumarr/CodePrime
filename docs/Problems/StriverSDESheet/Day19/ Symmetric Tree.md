---
sidebar_position : 4
tags: [Tree, Binary Tree, Depth-First Search, Breadth-First Search]
---

# Symmetric Tree

## Problem Link
https://leetcode.com/problems/symmetric-tree/

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
