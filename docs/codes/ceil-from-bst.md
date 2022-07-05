---
displayed_sidebar: null
sidebar_position : 2
tags: [Tree, Breadth-First Search, Binary Tree]
---

# Ceil from BST

## [Problem](https://www.codingninjas.com/codestudio/problems/ceil-from-bst_920464?source=youtube&campaign=Striver_Tree_Videos&utm_source=youtube&utm_medium=affiliate&utm_campaign=Striver_Tree_Videos)

Ninja is given a binary search tree and an integer. Now he is given a particular key in the tree and returns its ceil value. Can you help Ninja solve the problem?

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
int findCeil(BinaryTreeNode<int> *root, int x) {
    if (!root) return -1;
    if (root->data == x) return x;
    if (root->data > x) {
        int z = findCeil(root->left, x);
        if (z != -1) {
            return min(root->data, z);
        } else
            return root->data;
    }
    return findCeil(root->right, x);
}
```
</TabItem>
</Tabs>

</details>
