---
title: "Convert Sorted Array to Binary Search Tree"
description: "Given an integer array nums where the elements are sorted in ascending order, convert it to a height-balanced binary search tree. A height-balanced binary…"
source: "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/"
tags: ["Array", "Divide and Conquer", "Tree", "Binary Search Tree", "Binary Tree"]
complexity:
  time: "O(n^2)"
  space: "O(n \\log n)"
---

## Problem

<p>Given an integer array <code>nums</code> where the elements are sorted in <strong>ascending order</strong>, convert <em>it to a <strong>height-balanced</strong> binary search tree</em>.</p>

<p>A <strong>height-balanced</strong> binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.</p>

## Solution approach

### Intuition

To keep the tree height-balanced, the root should split the values into two halves of nearly equal size, so we choose the **middle element** of the sorted array. Everything to its left is smaller and forms the left subtree, and everything to its right forms the right subtree. Applying the same rule recursively to each half balances every subtree too.

### Algorithm

1. Call `createBST(nums, 0, nums.size() - 1)`.
2. In `createBST(nums, start, end)`, return `NULL` if `start > end`.
3. Let `mid = (start + end) / 2` and create `root` from `nums[mid]`.
4. Build `root->left` from `start..mid - 1` and `root->right` from `mid + 1..end`, then return `root`.

### Complexity

- **Time:** $O(n^2)$ — each node is created once, but `nums` is passed **by value**, so each of the $O(n)$ calls copies the whole array.
- **Space:** $O(n \log n)$ — the recursion depth is $O(\log n)$ and every frame on the stack holds its own copy of `nums`.

## Code

```cpp title="C++"
class Solution {
   public:
    TreeNode* createBST(vector<int> nums, int start, int end) {
        if (start > end) return NULL;
        int mid = (start + end) / 2;
        TreeNode* root = new TreeNode(nums[mid]);
        root->left = createBST(nums, start, mid - 1);
        root->right = createBST(nums, mid + 1, end);
        return root;
    }

    TreeNode* sortedArrayToBST(vector<int>& nums) {
        return createBST(nums, 0, nums.size() - 1);
    }
};

```
