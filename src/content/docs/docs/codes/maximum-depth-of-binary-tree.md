---
title: "Maximum Depth of Binary Tree"
description: "Return the number of nodes on the longest root-to-leaf path of a binary tree, computed recursively as one plus the deeper subtree's depth."
source: "https://leetcode.com/problems/maximum-depth-of-binary-tree/"
difficulty: "Easy"
tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

Given the `root` of a binary tree, return *its maximum depth*.

A binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.

**Example 1:**

![Binary tree [3,9,20,null,null,15,7]](https://assets.leetcode.com/uploads/2020/11/26/tmp-tree.jpg)

```text
Input:  root = [3,9,20,null,null,15,7]
Output: 3
```

**Example 2:**

```text
Input:  root = [1,null,2]
Output: 2
```

**Constraints:**

- The number of nodes in the tree is in the range $[0, 10^4]$.
- $-100 \le$ `Node.val` $\le 100$

## Solution approach

### Intuition

The longest downward path from a node goes through the root of that subtree and then continues into whichever child subtree is deeper. So the depth of a tree is defined recursively:

- an empty tree has depth `0`;
- otherwise, depth = `1` (the root itself) + the larger of the depths of the left and right subtrees.

This is a post-order traversal: each node's answer is computed from its children's answers.

### Algorithm

1. If `root` is `nullptr`, return `0`.
2. Return `1 + max(maxDepth(root->left), maxDepth(root->right))`.

### Walkthrough

For Example 1: the leaves `9`, `15` and `7` have depth `1`; node `20` gets `1 + max(1, 1) = 2`; the root `3` gets `1 + max(1, 2) = 3`.

### Complexity

- **Time:** $O(n)$ — every node is visited exactly once.
- **Space:** $O(h)$ — the recursion stack, where `h` is the tree height: $O(\log n)$ for a balanced tree and $O(n)$ (at most $10^4$ frames here) for a skewed one.

### Edge cases

- **Empty tree:** the base case returns `0` immediately.
- **Skewed tree** (Example 2, a chain): one side always returns `0`, and the depth is the chain length.

## Code

```cpp title="C++"
class Solution {
   public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};
```
