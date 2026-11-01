---
title: "Maximum Depth of Binary Tree"
description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node…"
source: "https://leetcode.com/problems/maximum-depth-of-binary-tree/"
tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

<p>Given the <code>root</code> of a binary tree, return <em>its maximum depth</em>.</p>

<p>A binary tree&#39;s <strong>maximum depth</strong>&nbsp;is the number of nodes along the longest path from the root node down to the farthest leaf node.</p>

## Solution approach

### Intuition

The depth of a node is one more than the depth of its parent. Visiting every node while carrying its depth, and remembering the largest depth seen, gives the maximum depth of the tree.

### Algorithm

1. `maxDepth` resets `h = 0` and calls `traverse(root, 1)`, since the root is at depth `1`.
2. `traverse` returns on a null node; otherwise it sets `h = max(h, hgt)` and recurses into both children with `hgt + 1`.
3. Return `h`.

### Complexity

- **Time:** $O(n)$ — every node is visited once.
- **Space:** $O(h)$ — the recursion stack, where `h` is the tree height ($O(n)$ for a skewed tree).

### Edge cases

- **Empty tree:** `traverse` returns immediately and the answer is `0`.

## Code

```cpp title="C++"
class Solution {
    int h;

   public:
    void traverse(TreeNode* root, int hgt) {
        if (!root) return;
        h = max(h, hgt);
        traverse(root->left, hgt + 1);
        traverse(root->right, hgt + 1);
    }

    int maxDepth(TreeNode* root) {
        h = 0;
        traverse(root, 1);
        return h;
    }
};

```
