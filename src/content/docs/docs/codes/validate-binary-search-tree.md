---
title: "Validate Binary Search Tree"
description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: The left subtree of a node…"
source: "https://leetcode.com/problems/validate-binary-search-tree/"
tags: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

<p>Given the <code>root</code> of a binary tree, <em>determine if it is a valid binary search tree (BST)</em>.</p>

<p>A <strong>valid BST</strong> is defined as follows:</p>

<ul>
	<li>The left subtree of a node contains only nodes with keys <strong>less than</strong> the node&#39;s key.</li>
	<li>The right subtree of a node contains only nodes with keys <strong>greater than</strong> the node&#39;s key.</li>
	<li>Both the left and right subtrees must also be binary search trees.</li>
</ul>

## Solution approach

### Intuition

Checking each node only against its direct children is not enough: every node in a left subtree must be smaller than **all** its ancestors where we went left. So each node carries an allowed range `[min, max]`. Going left tightens the upper bound to `root->val - 1`, and going right raises the lower bound to `root->val + 1`. The bounds are `long long` so that `INT_MIN - 1` and `INT_MAX + 1` do not overflow.

### Algorithm

1. Call `traversal(root, INT_MIN, INT_MAX)`.
2. A null node is valid, so return `true`.
3. If `root->val` lies outside `[min, max]`, return `false`.
4. Recurse on `root->left` with range `[min, root->val - 1]` and on `root->right` with range `[root->val + 1, max]`, and return `true` only if both are valid.

### Complexity

- **Time:** $O(n)$ — each node is checked once.
- **Space:** $O(h)$ — the recursion stack, where $h$ is the tree height ($O(n)$ for a skewed tree).

### Edge cases

- **Duplicate values**: the strict bounds `val - 1` and `val + 1` reject a duplicate in either subtree.
- **Values at `INT_MIN` or `INT_MAX`**: the `long long` bounds handle them without overflow.

## Code

```cpp title="C++"
class Solution {
   public:
    bool traversal(TreeNode* root, long long min, long long max) {
        if (!root) return true;
        if (root->val < min || root->val > max) return false;
        return (traversal(root->left, min, (long long)root->val - 1ll) &
                traversal(root->right, (long long)root->val + 1ll, max));
    }

    bool isValidBST(TreeNode* root) {
        return traversal(root, INT_MIN, INT_MAX);
    }
};

```
