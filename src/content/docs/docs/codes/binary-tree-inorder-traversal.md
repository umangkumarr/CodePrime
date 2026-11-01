---
title: "Binary Tree Inorder Traversal"
description: "Given the root of a binary tree, return the inorder traversal of its nodes' values."
source: "https://leetcode.com/problems/binary-tree-inorder-traversal/"
tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Given the <code>root</code> of a binary tree, return <em>the inorder traversal of its nodes&#39; values</em>.</p>

## Solution approach

### Intuition

This is **Morris traversal**, which does an in-order traversal without recursion or a stack. The problem with going left is finding the way back up to the parent. Morris solves it by temporarily linking the **in-order predecessor** of the current node (the rightmost node of its left subtree) back to the current node.

When we reach that thread a second time, we know the left subtree is finished. We remove the thread, visit the node, and move right.

### Algorithm

1. Start with `cur = root`.
2. If `cur->left` is null, there is nothing on the left: push `cur->val` into `inorder` and move to `cur->right`.
3. Otherwise, find the predecessor `prev` by walking right from `cur->left` until `prev->right` is null or equals `cur`.
   - If `prev->right` is null, this is the first visit: set `prev->right = cur` and move to `cur->left`.
   - If `prev->right == cur`, the left subtree is done: remove the thread, push `cur->val`, and move to `cur->right`.
4. Stop when `cur` becomes null and return `inorder`.

### Complexity

- **Time:** $O(n)$ — every edge is walked at most a constant number of times while threads are created and removed.
- **Space:** $O(1)$ extra — besides the output vector; the tree is restored to its original shape.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> inorder;
        TreeNode* cur = root;
        while (cur != NULL) {
            if (cur->left == NULL) {
                inorder.push_back(cur->val);
                cur = cur->right;
            } else {
                TreeNode* prev = cur->left;
                while (prev->right && prev->right != cur) {
                    prev = prev->right;
                }

                if (prev->right == cur) {
                    prev->right = NULL;
                    inorder.push_back(cur->val);
                    cur = cur->right;
                } else {
                    prev->right = cur;
                    cur = cur->left;
                }
            }
        }
        return inorder;
    }
};

```
