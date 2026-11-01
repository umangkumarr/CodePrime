---
title: "Binary Tree Postorder Traversal"
description: "Given the root of a binary tree, return the postorder traversal of its nodes' values."
source: "https://leetcode.com/problems/binary-tree-postorder-traversal/"
tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

<p>Given the <code>root</code> of a&nbsp;binary tree, return <em>the postorder traversal of its nodes&#39; values</em>.</p>

## Solution approach

### Intuition

Post-order means "left subtree, right subtree, then the node itself". Recursion follows this definition directly: finish both recursive calls before recording the current node.

### Algorithm

1. Call `traversal(root)`.
2. In `traversal`, return for a null node.
3. Recurse into `root->left`, then into `root->right`.
4. Append `root->val` to the member vector `postorder`.
5. Return `postorder`.

### Complexity

- **Time:** $O(n)$ — each node is visited once.
- **Space:** $O(h)$ — for the recursion stack, where $h$ is the tree height ($O(n)$ for a skewed tree), plus the output vector.

## Code

```cpp title="C++"
class Solution {
    vector<int> postorder;

   public:
    void traversal(TreeNode* root) {
        if (!root) return;
        traversal(root->left);
        traversal(root->right);
        postorder.push_back(root->val);
    }

    vector<int> postorderTraversal(TreeNode* root) {
        traversal(root);
        return postorder;
    }
};

```
