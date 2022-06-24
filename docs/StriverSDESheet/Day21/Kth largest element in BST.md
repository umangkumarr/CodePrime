---
sidebar_position : 4
tags: [Tree, Breadth-First Search, Binary Tree]
---

# Kth largest element in BST

## Problem Link
https://practice.geeksforgeeks.org/problems/kth-largest-element-in-bst/1

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
    vector<int> v;

    void traversal(Node* root) {
        if (!root) return;
        traversal(root->right);
        v.push_back(root->data);
        traversal(root->left);
    }

    int kthLargest(Node* root, int K) {
        traversal(root);
        return v[K - 1];
    }
};
```
</TabItem>
</Tabs>

</details>
