---
displayed_sidebar: null
sidebar_position : 104
tags: [Stack, Tree, Depth-First Search, Binary Tree]
---

# Binary Tree Postorder Traversal

## [Problem](https://leetcode.com/problems/binary-tree-postorder-traversal/)

<p>Given the <code>root</code> of a&nbsp;binary tree, return <em>the postorder traversal of its nodes&#39; values</em>.</p>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    vector<int> postorder;

   public:
    void traversal(TreeNode* root) {
        if (!root) return;
        traversal(root->left);
        traversal(root->right);
        postorder.push_back(root->val);
    }

    vector<int> postorderTraversal(TreeNode* root) {
        traversal(root);
        return postorder;
    }
};

```
</TabItem>
</Tabs>

</details>
