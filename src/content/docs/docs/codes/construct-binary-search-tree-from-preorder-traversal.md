---
title: "Construct Binary Search Tree from Preorder Traversal"
description: "Given an array of integers preorder, which represents the preorder traversal of a BST (i.e., binary search tree), construct the tree and return its root.…"
source: "https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/"
tags: ["Array", "Stack", "Tree", "Binary Search Tree", "Monotonic Stack", "Binary Tree"]
complexity:
  time: "O(n^2)"
  space: "O(n \\cdot h)"
---

## Problem

<p>Given an array of integers preorder, which represents the <strong>preorder traversal</strong> of a BST (i.e., <strong>binary search tree</strong>), construct the tree and return <em>its root</em>.</p>

<p>It is <strong>guaranteed</strong> that there is always possible to find a binary search tree with the given requirements for the given test cases.</p>

<p>A <strong>binary search tree</strong> is a binary tree where for every node, any descendant of <code>Node.left</code> has a value <strong>strictly less than</strong> <code>Node.val</code>, and any descendant of <code>Node.right</code> has a value <strong>strictly greater than</strong> <code>Node.val</code>.</p>

<p>A <strong>preorder traversal</strong> of a binary tree displays the value of the node first, then traverses <code>Node.left</code>, then traverses <code>Node.right</code>.</p>

## Solution approach

### Intuition

In a pre-order traversal the first element is the root. In a BST, every value smaller than the root belongs to its left subtree and every larger value to its right subtree. These smaller values come first, as one contiguous block right after the root, followed by the larger ones. So finding the first value greater than the root splits the range into the two subtrees, and each part can be built recursively.

### Algorithm

1. Call `createBST(nums, 0, nums.size() - 1)`.
2. In `createBST(nums, i, j)`, return `NULL` if `i > j`. Otherwise create `root` from `nums[i]`, and return it at once if `i == j`.
3. Starting at `k = i + 1`, move `k` forward while `nums[k] < nums[i]`. Now `i + 1` to `k - 1` is the left subtree and `k` to `j` is the right subtree.
4. Build `root->left` and `root->right` recursively from those ranges and return `root`.

### Complexity

- **Time:** $O(n^2)$ — the scan for `k` is linear in the range size, which gives $O(n^2)$ for a skewed tree; also, `nums` is passed **by value**, so every call copies the whole array in $O(n)$.
- **Space:** $O(n \cdot h)$ — every frame on the recursion stack holds its own copy of `nums`, which is $O(n^2)$ for a skewed tree.

## Code

```cpp title="C++"
class Solution {
   public:
    TreeNode* createBST(vector<int> nums, int i, int j) {
        if (i > j) return NULL;
        TreeNode* root = new TreeNode(nums[i]);
        if (i == j) return root;
        int k = i + 1;
        while (k <= j && nums[k] < nums[i]) k++;
        root->left = createBST(nums, i + 1, k - 1);
        root->right = createBST(nums, k, j);
        return root;
    }

    TreeNode* bstFromPreorder(vector<int>& nums) {
        return createBST(nums, 0, nums.size() - 1);
    }
};

```
