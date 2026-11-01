---
title: "Kth Smallest Element in a BST"
description: "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree."
source: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/"
tags: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Given the <code>root</code> of a binary search tree, and an integer <code>k</code>, return <em>the</em> <code>kth</code> <em>smallest value (<strong>1-indexed</strong>) of all the values of the nodes in the tree</em>.</p>

## Solution approach

### Intuition

An in-order traversal of a BST (left, node, right) visits the keys in increasing order. Collecting them into a list therefore gives a sorted list, and the $k$-th smallest is simply its element at index `k - 1`.

### Algorithm

1. `helper` recurses into `root->left`, pushes `root->val` into `v`, then recurses into `root->right`.
2. `kthSmallest` returns `0` for an empty tree; otherwise it calls `helper(root, v)`.
3. Return `v[k - 1]`.

### Complexity

- **Time:** $O(n)$ — every node is visited once.
- **Space:** $O(n)$ — `v` stores every key; the recursion stack adds $O(h)$.

## Code

```cpp title="C++"
class Solution {
    void helper(TreeNode* root, vector<int>& v) {
        if (!root) return;
        helper(root->left, v);
        v.push_back(root->val);
        helper(root->right, v);
    }

   public:
    int kthSmallest(TreeNode* root, int k) {
        if (root == NULL) return 0;
        vector<int> v;
        helper(root, v);
        return v[k - 1];
    }
};

```
