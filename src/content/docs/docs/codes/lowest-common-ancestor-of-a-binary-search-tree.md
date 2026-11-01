---
title: "Lowest Common Ancestor of a Binary Search Tree"
description: "Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes in the BST. According to the definition of LCA on Wikipedia:…"
source: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"
tags: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

<p>Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes in the BST.</p>

<p>According to the <a href="https://en.wikipedia.org/wiki/Lowest_common_ancestor" target="_blank">definition of LCA on Wikipedia</a>: &ldquo;The lowest common ancestor is defined between two nodes <code>p</code> and <code>q</code> as the lowest node in <code>T</code> that has both <code>p</code> and <code>q</code> as descendants (where we allow <b>a node to be a descendant of itself</b>).&rdquo;</p>

## Solution approach

### Intuition

This code solves the problem as for a general binary tree; it does not use the BST ordering. For any node, if `p` is found in one subtree and `q` in the other, that node is the lowest common ancestor. If a node is `p` or `q` itself, it is returned straight away, because the other target is either below it (making it the LCA) or found elsewhere.

### Algorithm

1. If `root` is `NULL`, return `NULL`.
2. If `root` is `p` or `q`, return `root`.
3. Recurse into both subtrees to get `left` and `right`.
4. If both are non-null, the targets lie on different sides, so return `root`.
5. Otherwise return whichever of `left` and `right` is non-null.

### Complexity

- **Time:** $O(n)$ — in the worst case every node is visited once.
- **Space:** $O(h)$ — the recursion stack, where `h` is the tree height ($O(n)$ for a skewed tree).

### Edge cases

- **One target is an ancestor of the other:** the search stops at the ancestor and returns it, which is correct.

## Code

```cpp title="C++"
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
