---
sidebar_position : 5
tags: [Tree, Depth-First Search, Binary Tree]
---

# Lowest Common Ancestor of a Binary Tree

## Problem Link
https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    int cnt;
    TreeNode* LCA;

   public:
    int traverse(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root) return 0;
        int c = traverse(root->left, p, q) + traverse(root->right, p, q);
        c += (root->val == p->val) + (root->val == q->val);
        if (c == 2) {
            LCA = root;
            return 0;
        }
        return c;
    }

    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        cnt = 0;
        traverse(root, p, q);
        return LCA;
    }
};
```
</TabItem>
</Tabs>

</details>
