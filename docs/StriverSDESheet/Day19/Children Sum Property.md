---
sidebar_position : 7
tags: [Tree, Binary Tree, Depth-First Search, Linked List]
---

# Children Sum Property

## Problem Link
https://www.codingninjas.com/codestudio/problems/childrensumproperty_790723?topList=striver-sde-sheet-problems&utm_source=striver&utm_medium=website

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
void changeTree(BinaryTreeNode<int>* root) {
    if (root == NULL) return;
    int child = 0;
    if (root->left) child += root->left->data;
    if (root->right) child += root->right->data;

    if (child >= root->data)
        root->data = child;

    else {
        if (root->left) root->left->data = root->data;

        if (root->right) root->right->data = root->data;
    }

    changeTree(root->left);
    changeTree(root->right);

    int update = 0;
    if (root->left) update += root->left->data;
    if (root->right) update += root->right->data;

    if (root->left or root->right) root->data = update;
}
```
</TabItem>
</Tabs>

</details>
