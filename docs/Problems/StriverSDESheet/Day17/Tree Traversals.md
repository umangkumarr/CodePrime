---
sidebar_position : 9
tags: [Stack, Tree, Depth-First Search, Binary Tree]
---

# Tree Traversals

## Problem Link
https://www.codingninjas.com/codestudio/problems/981269?topList=striver-sde-sheet-problems&utm_source=striver&utm_medium=website

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
void traverse(BinaryTreeNode<int> *root, vector<int> &pre, vector<int> &in,
              vector<int> &post) {
    if (!root) return;
    pre.push_back(root->data);
    traverse(root->left, pre, in, post);
    in.push_back(root->data);
    traverse(root->right, pre, in, post);
    post.push_back(root->data);
}

vector<vector<int>> getTreeTraversal(BinaryTreeNode<int> *root) {
    vector<int> pre, in, post;
    traverse(root, pre, in, post);
    return {in, pre, post};
}
```
</TabItem>
</Tabs>

</details>
