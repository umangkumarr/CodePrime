---
title: "Ceil from BST"
description: "Ninja is given a binary search tree and an integer. Now he is given a particular key in the tree and returns its ceil value. Can you help Ninja solve the…"
source: "https://www.codingninjas.com/codestudio/problems/ceil-from-bst_920464?source=youtube&campaign=Striver_Tree_Videos&utm_source=youtube&utm_medium=affiliate&utm_campaign=Striver_Tree_Videos"
tags: ["Tree", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(h)"
  space: "O(h)"
---

## Problem

Ninja is given a binary search tree and an integer. Now he is given a particular key in the tree and returns its ceil value. Can you help Ninja solve the problem?

## Solution approach

### Intuition

The ceil of `x` is the smallest value in the BST that is greater than or equal to `x`. The BST ordering tells us which side can contain it:

- if `root->data` is less than `x`, this node and its entire left subtree are too small, so the answer can only be on the right;
- if `root->data` is greater than `x`, this node is a candidate, but its left subtree may hold a smaller value that is still at least `x`.

So we only follow one path from the root downwards.

### Algorithm

1. If `root` is null, return `-1` (no ceil on this path).
2. If `root->data == x`, return `x`.
3. If `root->data > x`, search the left subtree for `z`. Return `min(root->data, z)` if a value was found, otherwise `root->data`.
4. Otherwise, return the result of searching the right subtree.

### Complexity

- **Time:** $O(h)$ — one root-to-leaf path is followed, which is $O(n)$ for a skewed tree.
- **Space:** $O(h)$ — for the recursion stack.

### Edge cases

- **`x` larger than every value:** every step goes right, reaches null, and the function returns `-1`.

## Code

```cpp title="C++"
int findCeil(BinaryTreeNode<int> *root, int x) {
    if (!root) return -1;
    if (root->data == x) return x;
    if (root->data > x) {
        int z = findCeil(root->left, x);
        if (z != -1) {
            return min(root->data, z);
        } else
            return root->data;
    }
    return findCeil(root->right, x);
}
```
