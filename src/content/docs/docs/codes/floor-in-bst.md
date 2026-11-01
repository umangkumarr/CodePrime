---
title: "Floor in BST"
description: "You are given a BST (Binary search tree) with’ N’ number of nodes and a value ‘X’. Your task is to find the greatest value node of the BST which is…"
source: "https://www.codingninjas.com/codestudio/problems/floor-from-bst_920457?source=youtube&campaign=Striver_Tree_Videos&utm_source=youtube&utm_medium=affiliate&utm_campaign=Striver_Tree_Videos"
tags: ["Tree", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(h)"
  space: "O(h)"
---

## Problem

You are given a BST (Binary search tree) with’ N’ number of nodes and a value ‘X’. Your task is to find the greatest value node of the BST which is smaller than or equal to ‘X’.
Note :‘X’ is not smaller than the smallest node of BST .

## Solution approach

### Intuition

The floor of `X` is the largest value in the tree that is not greater than `X`. The BST property tells us which way to go at every node. If `root->val <= X`, this node is a candidate, and a larger candidate could only be in the right subtree. If `root->val > X`, this node and everything to its right are too big, so the answer must be on the left. Only one root-to-leaf path is explored.

### Algorithm

1. If `root` is `NULL`, return `-1` (no floor on this path).
2. If `root->val <= X`, return `max(root->val, floorInBST(root->right, X))`.
3. Otherwise return `floorInBST(root->left, X)`.

### Complexity

- **Time:** $O(h)$, where $h$ is the tree height — one node per level is visited ($O(n)$ for a skewed tree, $O(\log n)$ for a balanced one).
- **Space:** $O(h)$ — the recursion stack.

### Edge cases

- **`X` smaller than every value:** the search keeps going left and returns `-1`.
- **`X` present in the tree:** the node with value `X` qualifies, and its right subtree only holds larger values, so `X` itself is returned.

## Code

```cpp title="C++"
int floorInBST(TreeNode<int>* root, int X) {
    if (!root) return -1;
    if (root->val <= X) {
        return max(root->val, floorInBST(root->right, X));
    } else
        return floorInBST(root->left, X);
}
```
