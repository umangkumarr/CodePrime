---
title: "Search in a Binary Search Tree"
description: "Find the node with a given value in a BST and return its subtree, walking down one root-to-leaf path iteratively using the BST ordering."
source: "https://leetcode.com/problems/search-in-a-binary-search-tree/"
difficulty: "Easy"
tags: ["Tree", "Binary Search Tree", "Binary Tree"]
complexity:
  time: "O(h)"
  space: "O(1)"
---

## Problem

You are given the `root` of a binary search tree (BST) and an integer `val`.

Find the node in the BST that the node's value equals `val` and return the subtree rooted with that node. If such a node does not exist, return `null`.

**Example 1:**

![BST 4 with children 2 and 7; 2 has children 1 and 3. The subtree at 2 is highlighted](https://assets.leetcode.com/uploads/2021/01/12/tree1.jpg)

```text
Input:  root = [4,2,7,1,3], val = 2
Output: [2,1,3]
```

**Example 2:**

![The same BST; 5 is not present](https://assets.leetcode.com/uploads/2021/01/12/tree2.jpg)

```text
Input:  root = [4,2,7,1,3], val = 5
Output: []
```

**Constraints:**

- The number of nodes in the tree is in the range `[1, 5000]`.
- $1 \le$ `Node.val` $\le 10^7$
- `root` is a binary search tree.
- $1 \le$ `val` $\le 10^7$

## Solution approach

### Intuition

In a BST every value in a node's left subtree is smaller than the node and every value in its right subtree is larger. So one comparison at a node tells us which half can contain `val`, and the other half can be discarded entirely — the tree version of binary search.

Each step moves one level down, so we follow a single root-to-leaf path. There is nothing to come back to, so a loop is enough; recursion would only add an $O(h)$ call stack (up to 5000 frames for a degenerate tree).

### Algorithm

1. While `root` is not null and `root->val != val`: move to `root->left` if `val < root->val`, otherwise to `root->right`.
2. Return `root`. It is either the matching node (whose subtree is the answer) or null if we fell off the tree.

### Walkthrough

Example 1, `val = 2`: at `4`, `2 < 4` so go left; at `2` the values match, return that node — the subtree `[2,1,3]`.

Example 2, `val = 5`: at `4`, go right to `7`; `5 < 7`, go left to null. Return null, printed as `[]`.

### Complexity

- **Time:** $O(h)$, where $h$ is the tree height — one node per level. That is $O(\log n)$ for a balanced BST and $O(n)$ for a degenerate one.
- **Space:** $O(1)$ — just the moving pointer.

### Edge cases

- **Value at the root:** the loop does not run and the whole tree is returned.
- **Value absent:** the walk ends at a null child and `nullptr` is returned.

## Code

```cpp title="C++"
class Solution {
   public:
    TreeNode* searchBST(TreeNode* root, int val) {
        while (root && root->val != val) root = val < root->val ? root->left : root->right;
        return root;
    }
};
```
