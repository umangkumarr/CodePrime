---
title: "Mirror Tree"
description: "Given a Binary Tree, convert it into its mirror."
source: "https://practice.geeksforgeeks.org/problems/mirror-tree/1"
tags: ["Tree", "Binary Tree", "Depth-First Search", "Linked List"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

<p>Given a Binary Tree, convert it into its mirror.</p>

<img alt="MirrorTree1" src="https://contribute.geeksforgeeks.org/wp-content/uploads/mirrortrees.jpg" title="MirrorTree1" />

## Solution approach

### Intuition

The mirror image of a tree is the same tree with the left and right child swapped at every node. Swapping at the current node and then mirroring both subtrees recursively produces exactly that, and the order of visits does not matter because each node's swap is independent of the others.

### Algorithm

1. If `node` is `NULL`, return.
2. Swap `node->left` and `node->right` using the temporaries `t1` and `t2`.
3. Call `mirror(node->left)` and `mirror(node->right)` on the swapped children.

### Complexity

- **Time:** $O(n)$ — each node is visited once.
- **Space:** $O(h)$ — the recursion stack, where `h` is the tree height ($O(n)$ for a skewed tree).

## Code

```cpp title="C++"
void mirror(struct Node* node) {
    if (!node) return;

    struct Node* t1 = node->left;
    struct Node* t2 = node->right;
    node->left = t2;
    node->right = t1;

    mirror(node->left);
    mirror(node->right);
}
```
