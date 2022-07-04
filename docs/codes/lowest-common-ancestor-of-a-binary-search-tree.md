---
sidebar_position : 128
tags: [Tree, Depth-First Search, Binary Search Tree, Binary Tree]
---

# Lowest Common Ancestor of a Binary Search Tree

## [Problem](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)

<p>Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes in the BST.</p>

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
