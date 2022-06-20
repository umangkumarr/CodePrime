---
sidebar_position : 3
tags: [Stack, Tree, Depth-First Search, Binary Tree]
---

# Binary Tree Postorder Traversal

## Problem Link
https://leetcode.com/problems/binary-tree-postorder-traversal/

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
