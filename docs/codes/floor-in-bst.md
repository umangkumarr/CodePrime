---
displayed_sidebar: null
sidebar_position : 1
tags: [Tree, Breadth-First Search, Binary Tree]
---

# Floor in BST

## [Problem](https://www.codingninjas.com/codestudio/problems/floor-from-bst_920457?source=youtube&campaign=Striver_Tree_Videos&utm_source=youtube&utm_medium=affiliate&utm_campaign=Striver_Tree_Videos)

You are given a BST (Binary search tree) with’ N’ number of nodes and a value ‘X’. Your task is to find the greatest value node of the BST which is smaller than or equal to ‘X’.
Note :‘X’ is not smaller than the smallest node of BST .

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
int floorInBST(TreeNode<int>* root, int X) {
    if (!root) return -1;
    if (root->val <= X) {
        return max(root->val, floorInBST(root->right, X));
    } else
        return floorInBST(root->left, X);
}
```
</TabItem>
</Tabs>

</details>
