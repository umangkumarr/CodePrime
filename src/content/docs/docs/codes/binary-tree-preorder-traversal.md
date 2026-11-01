---
title: "Binary Tree Preorder Traversal"
description: "Given the root of a binary tree, return the preorder traversal of its nodes' values."
source: "https://leetcode.com/problems/binary-tree-preorder-traversal/"
tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Given the <code>root</code> of a binary tree, return <em>the preorder traversal of its nodes&#39; values</em>.</p>

## Solution approach

### Intuition

This is **Morris traversal** adapted for pre-order, so it needs no recursion and no stack. To come back up after finishing a left subtree, the code temporarily links the **in-order predecessor** of the current node (the rightmost node of its left subtree) back to the current node.

The only difference from the in-order version is when a node is recorded: in pre-order it is recorded on the **first** visit, just before going left.

### Algorithm

1. Start with `cur = root`.
2. If `cur->left` is null, push `cur->val` into `preorder` and move to `cur->right`.
3. Otherwise, find the predecessor `prev` by walking right from `cur->left` until `prev->right` is null or equals `cur`.
   - If `prev->right` is null, this is the first visit: create the thread `prev->right = cur`, push `cur->val`, and move to `cur->left`.
   - If `prev->right == cur`, the left subtree is done: remove the thread and move to `cur->right`.
4. Stop when `cur` becomes null and return `preorder`.

### Complexity

- **Time:** $O(n)$ — every edge is walked at most a constant number of times while threads are created and removed.
- **Space:** $O(1)$ extra — besides the output vector; the tree is restored to its original shape.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> preorder;
        TreeNode* cur = root;
        while (cur != NULL) {
            if (cur->left == NULL) {
                preorder.push_back(cur->val);
                cur = cur->right;
            } else {
                TreeNode* prev = cur->left;
                while (prev->right && prev->right != cur) {
                    prev = prev->right;
                }

                if (prev->right == cur) {
                    prev->right = NULL;
                    cur = cur->right;
                } else {
                    prev->right = cur;
                    preorder.push_back(cur->val);
                    cur = cur->left;
                }
            }
        }
        return preorder;
    }
};

```
