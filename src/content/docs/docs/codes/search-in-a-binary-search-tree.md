---
title: "Search in a Binary Search Tree"
description: "You are given the root of a binary search tree (BST) and an integer val. Find the node in the BST that the node's value equals val and return the subtree…"
source: "https://leetcode.com/problems/search-in-a-binary-search-tree/"
tags: ["Tree", "Binary Search Tree", "Binary Tree"]
complexity:
  time: "O(h)"
  space: "O(h)"
---

## Problem

<p>You are given the <code>root</code> of a binary search tree (BST) and an integer <code>val</code>.</p>

<p>Find the node in the BST that the node&#39;s value equals <code>val</code> and return the subtree rooted with that node. If such a node does not exist, return <code>null</code>.</p>

## Solution approach

### Intuition

In a BST, every value in the left subtree is smaller than the node and every value in the right subtree is larger. So at each node, comparing `val` with `root->val` tells us which single subtree can contain it, and the other subtree can be skipped completely.

### Algorithm

1. If `root` is null, the value is not in the tree, so return `NULL`.
2. If `root->val == val`, return `root`.
3. If `root->val > val`, move to `root->left`; otherwise move to `root->right`.
4. Recurse with `searchBST(root, val)` on the chosen child.

### Complexity

- **Time:** $O(h)$ — one node per level, where `h` is the height; this is $O(\log n)$ for a balanced tree and $O(n)$ for a skewed one.
- **Space:** $O(h)$ — the recursion stack.

## Code

```cpp title="C++"
class Solution {
   public:
    TreeNode* searchBST(TreeNode* root, int val) {
        if (root == NULL) return root;
        if (root->val == val) return root;
        if (root->val > val)
            root = root->left;
        else
            root = root->right;
        return searchBST(root, val);
    }
};

```
