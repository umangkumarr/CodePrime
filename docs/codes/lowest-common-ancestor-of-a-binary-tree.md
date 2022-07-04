---
sidebar_position : 116
tags: [Tree, Depth-First Search, Binary Tree]
---

# Lowest Common Ancestor of a Binary Tree

## [Problem](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)

<p>Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.</p>

<p>According to the <a href="https://en.wikipedia.org/wiki/Lowest_common_ancestor" target="_blank">definition of LCA on Wikipedia</a>: &ldquo;The lowest common ancestor is defined between two nodes <code>p</code> and <code>q</code> as the lowest node in <code>T</code> that has both <code>p</code> and <code>q</code> as descendants (where we allow <b>a node to be a descendant of itself</b>).&rdquo;</p>

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
