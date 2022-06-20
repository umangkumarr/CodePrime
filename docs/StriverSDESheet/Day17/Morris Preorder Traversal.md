---
sidebar_position : 5
tags: [Stack, Tree, Depth-First Search, Binary Tree]
---

# Morris Preorder Traversal

## Problem Link
https://leetcode.com/problems/binary-tree-preorder-traversal/

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
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> preorder;
        TreeNode* cur = root;
        while (cur != NULL) {
            if (cur->left == NULL) {
                preorder.push_back(cur->val);
                cur = cur->right;
            } else {
                TreeNode* prev = cur->left;
                while (prev->right && prev->right != cur) {
                    prev = prev->right;
                }

                if (prev->right == cur) {
                    prev->right = NULL;
                    cur = cur->right;
                } else {
                    prev->right = cur;
                    preorder.push_back(cur->val);
                    cur = cur->left;
                }
            }
        }
        return preorder;
    }
};
```
</TabItem>
</Tabs>

</details>
