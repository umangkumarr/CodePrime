---
title: "Maximum Sum BST in Binary Tree"
description: "Given a binary tree root, return the maximum sum of all keys of any sub-tree which is also a Binary Search Tree (BST). Assume a BST is defined as follows:…"
source: "https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/"
tags: ["Dynamic Programming", "Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

<p>Given a <strong>binary tree</strong> <code>root</code>, return <em>the maximum sum of all keys of <strong>any</strong> sub-tree which is also a Binary Search Tree (BST)</em>.</p>

<p>Assume a BST is defined as follows:</p>

<ul>
	<li>The left subtree of a node contains only nodes with keys <strong>less than</strong> the node&#39;s key.</li>
	<li>The right subtree of a node contains only nodes with keys <strong>greater than</strong> the node&#39;s key.</li>
	<li>Both the left and right subtrees must also be binary search trees.</li>
</ul>

## Solution approach

### Intuition

A subtree is a BST exactly when both child subtrees are BSTs and the node's value is greater than the largest value on the left and smaller than the smallest value on the right. So a post-order traversal can work out, for every subtree, whether it is a BST, its minimum, its maximum and its sum, all from its children's answers.

Checking each subtree separately would cost $O(n^2)$ time; computing these values bottom-up visits each node once.

### Algorithm

1. `f(root, minv, maxv, s)` returns whether the subtree is a BST and fills in its minimum `minv`, maximum `maxv` and sum `s` through reference parameters.
2. An empty subtree returns `true` and leaves `minv = INT_MAX`, `maxv = INT_MIN`, so an empty side never violates the order checks.
3. Recurse into the left child (filling `lmin`, `lmax`, `lsum`) and the right child (`rmin`, `rmax`, `rsum`).
4. If either side is not a BST, or `root->val <= lmax`, or `root->val >= rmin`, return `false`.
5. Otherwise set `s = lsum + rsum + root->val`, update the global `ans`, set `minv = min(lmin, root->val)` and `maxv = max(rmax, root->val)`, and return `true`.
6. `ans` starts at `0`, because an empty BST is allowed when every BST has a negative sum.

### Complexity

- **Time:** $O(n)$ — each node is visited once.
- **Space:** $O(h)$ — recursion stack, where `h` is the tree height ($O(n)$ for a skewed tree).

### Edge cases

- **All values negative**: no BST has a positive sum, so the answer stays `0`.

## Code

```cpp title="C++"
class Solution {
   public:
    int ans = 0;
    bool f(TreeNode *root, int &minv, int &maxv, int &s) {
        if (root == NULL) return true;

        int lmin = minv, lmax = maxv, lsum = 0;
        bool l = f(root->left, lmin, lmax, lsum);

        int rmin = minv, rmax = maxv, rsum = 0;
        bool r = f(root->right, rmin, rmax, rsum);

        if (l == false || r == false || root->val <= lmax || root->val >= rmin)
            return false;

        s += lsum + rsum + root->val;
        ans = max(ans, s);

        minv = min(lmin, root->val);
        maxv = max(rmax, root->val);
        return true;
    }

    int maxSumBST(TreeNode *root) {
        int s = 0;
        int lm = INT_MAX, rm = INT_MIN;
        f(root, lm, rm, s);
        return ans;
    }
};

```
