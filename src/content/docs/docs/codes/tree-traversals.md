---
title: "Tree Traversals"
description: "You have been given a Binary Tree of 'N' nodes, where the nodes have integer values. Your task is to find the ln-Order, Pre-Order, and Post-Order…"
source: "https://www.codingninjas.com/codestudio/problems/981269?topList=striver-sde-sheet-problems&utm_source=striver&utm_medium=website"
tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

You have been given a Binary Tree of 'N' nodes, where the nodes have integer values. Your task is to find the ln-Order, Pre-Order, and Post-Order traversals of the given binary tree.

## Solution approach

### Intuition

Preorder, inorder and postorder differ only in **when** a node is recorded relative to visiting its children: before both, between them, or after both. A single recursive DFS passes through every node at all three of these moments, so it can fill all three lists at once.

### Algorithm

1. `traverse(root, pre, in, post)` returns immediately for a null node.
2. Push `root->data` into `pre`, then recurse on `root->left`.
3. Push `root->data` into `in`, then recurse on `root->right`.
4. Push `root->data` into `post`.
5. `getTreeTraversal` runs `traverse` from the root and returns the lists in the order `in`, `pre`, `post`.

### Complexity

- **Time:** $O(n)$ — each node is visited once.
- **Space:** $O(n)$ — the three output lists, plus a recursion stack of height $h$.

## Code

```cpp title="C++"
void traverse(BinaryTreeNode<int> *root, vector<int> &pre, vector<int> &in,
              vector<int> &post) {
    if (!root) return;
    pre.push_back(root->data);
    traverse(root->left, pre, in, post);
    in.push_back(root->data);
    traverse(root->right, pre, in, post);
    post.push_back(root->data);
}

vector<vector<int>> getTreeTraversal(BinaryTreeNode<int> *root) {
    vector<int> pre, in, post;
    traverse(root, pre, in, post);
    return {in, pre, post};
}
```
