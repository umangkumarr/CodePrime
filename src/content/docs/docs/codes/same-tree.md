---
title: "Same Tree"
description: "Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are…"
source: "https://leetcode.com/problems/same-tree/"
tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

<p>Given the roots of two binary trees <code>p</code> and <code>q</code>, write a function to check if they are the same or not.</p>

<p>Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.</p>

## Solution approach

### Intuition

Two trees are the same exactly when their roots match and their left subtrees and right subtrees are, recursively, the same. The base cases handle missing nodes: two empty trees are equal, and an empty tree never equals a non-empty one.

### Algorithm

1. If both `p` and `q` are null, return `true`.
2. If exactly one of them is null, return `false`.
3. If `p->val != q->val`, return `false`.
4. Otherwise return `isSameTree(p->right, q->right) & isSameTree(p->left, q->left)`. The bitwise `&` evaluates both calls, unlike `&&`, which would stop early.

### Complexity

- **Time:** $O(n)$ — each pair of corresponding nodes is compared at most once.
- **Space:** $O(h)$ — recursion stack depth equals the tree height, up to $O(n)$ for a skewed tree.

## Code

```cpp title="C++"
class Solution {
   public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (!p && !q) return true;
        if ((!p && q) || (p && !q)) return false;
        if (p->val != q->val) return false;
        return (isSameTree(p->right, q->right) & isSameTree(p->left, q->left));
    }
};

```
