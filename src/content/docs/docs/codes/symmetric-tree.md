---
title: "Symmetric Tree"
description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center)."
source: "https://leetcode.com/problems/symmetric-tree/"
tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

<p>Given the <code>root</code> of a binary tree, <em>check whether it is a mirror of itself</em> (i.e., symmetric around its center).</p>

## Solution approach

### Intuition

A tree is symmetric when its left subtree is a mirror image of its right subtree. Two trees `p` and `q` are mirrors when their roots have equal values, `p`'s right subtree mirrors `q`'s left subtree, and `p`'s left subtree mirrors `q`'s right subtree. This definition maps directly onto a recursive function.

### Algorithm

1. `isSymmetric` calls `traversal(root->left, root->right)`.
2. In `traversal(p, q)`: if both are null, return `true`; if exactly one is null, return `false`.
3. If `p->val != q->val`, return `false`.
4. Otherwise return `traversal(p->right, q->left) & traversal(p->left, q->right)`.

### Complexity

- **Time:** $O(n)$ — each node is visited once.
- **Space:** $O(h)$ — the recursion stack, where $h$ is the tree height ($O(n)$ for a skewed tree).

### Edge cases

- **Single node**: both children are null, so the tree is symmetric.

## Code

```cpp title="C++"
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
