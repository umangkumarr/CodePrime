---
sidebar_position : 4
tags: [Stack, Tree, Depth-First Search, Binary Tree]
---

# Morris Inorder Traversal

## Problem Link
https://leetcode.com/problems/binary-tree-inorder-traversal/

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
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> inorder;
        TreeNode* cur = root;
        while (cur != NULL) {
            if (cur->left == NULL) {
                inorder.push_back(cur->val);
                cur = cur->right;
            } else {
                TreeNode* prev = cur->left;
                while (prev->right && prev->right != cur) {
                    prev = prev->right;
                }

                if (prev->right == cur) {
                    prev->right = NULL;
                    inorder.push_back(cur->val);
                    cur = cur->right;
                } else {
                    prev->right = cur;
                    cur = cur->left;
                }
            }
        }
        return inorder;
    }
};
```
</TabItem>
</Tabs>

</details>
