---
displayed_sidebar: null
sidebar_position : 131
tags: [Tree, Depth-First Search, Binary Search Tree, Binary Tree]
---

# Validate Binary Search Tree

## [Problem](https://leetcode.com/problems/validate-binary-search-tree/)

<p>Given the <code>root</code> of a binary tree, <em>determine if it is a valid binary search tree (BST)</em>.</p>

<p>A <strong>valid BST</strong> is defined as follows:</p>

<ul>
	<li>The left subtree of a node contains only nodes with keys <strong>less than</strong> the node&#39;s key.</li>
	<li>The right subtree of a node contains only nodes with keys <strong>greater than</strong> the node&#39;s key.</li>
	<li>Both the left and right subtrees must also be binary search trees.</li>
</ul>

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
</TabItem>
</Tabs>

</details>
