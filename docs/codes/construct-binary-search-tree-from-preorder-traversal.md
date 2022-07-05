---
displayed_sidebar: null
sidebar_position : 130
tags: [Array, Stack, Tree, Binary Search Tree, Monotonic Stack, Binary Tree]
---

# Construct Binary Search Tree from Preorder Traversal

## [Problem](https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/)

<p>Given an array of integers preorder, which represents the <strong>preorder traversal</strong> of a BST (i.e., <strong>binary search tree</strong>), construct the tree and return <em>its root</em>.</p>

<p>It is <strong>guaranteed</strong> that there is always possible to find a binary search tree with the given requirements for the given test cases.</p>

<p>A <strong>binary search tree</strong> is a binary tree where for every node, any descendant of <code>Node.left</code> has a value <strong>strictly less than</strong> <code>Node.val</code>, and any descendant of <code>Node.right</code> has a value <strong>strictly greater than</strong> <code>Node.val</code>.</p>

<p>A <strong>preorder traversal</strong> of a binary tree displays the value of the node first, then traverses <code>Node.left</code>, then traverses <code>Node.right</code>.</p>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
