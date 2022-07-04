---
sidebar_position : 129
tags: [Tree, Binary Search Tree, Binary Tree]
---

# Search in a Binary Search Tree

## [Problem](https://leetcode.com/problems/search-in-a-binary-search-tree/)

<p>You are given the <code>root</code> of a binary search tree (BST) and an integer <code>val</code>.</p>

<p>Find the node in the BST that the node&#39;s value equals <code>val</code> and return the subtree rooted with that node. If such a node does not exist, return <code>null</code>.</p>

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
    TreeNode* searchBST(TreeNode* root, int val) {
        if (root == NULL) return root;
        if (root->val == val) return root;
        if (root->val > val)
            root = root->left;
        else
            root = root->right;
        return searchBST(root, val);
    }
};

```
</TabItem>
</Tabs>

</details>
