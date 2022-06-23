---
sidebar_position : 2
tags: [Tree, Breadth-First Search, Binary Tree]
---

# Search in a Binary Search Tree

## Problem Link
https://leetcode.com/problems/search-in-a-binary-search-tree/

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
