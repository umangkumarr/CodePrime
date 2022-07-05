---
displayed_sidebar: null
sidebar_position : 139
tags: [Tree, Depth-First Search, Binary Search Tree, Binary Tree]
---

# Kth Smallest Element in a BST

## [Problem](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)

<p>Given the <code>root</code> of a binary search tree, and an integer <code>k</code>, return <em>the</em> <code>kth</code> <em>smallest value (<strong>1-indexed</strong>) of all the values of the nodes in the tree</em>.</p>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    void helper(TreeNode* root, vector<int>& v) {
        if (!root) return;
        helper(root->left, v);
        v.push_back(root->val);
        helper(root->right, v);
    }

   public:
    int kthSmallest(TreeNode* root, int k) {
        if (root == NULL) return 0;
        vector<int> v;
        helper(root, v);
        return v[k - 1];
    }
};

```
</TabItem>
</Tabs>

</details>
