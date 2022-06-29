---
sidebar_position : 8
tags: [Tree, Depth-First Search, Binary Tree]
---

# Boundary Traversal of binary tree

## Problem Link
https://practice.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1/

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
    void printleft(Node *root, vector<int> &ans) {
        if (root == NULL) {
            return;
        }
        if (root->left != NULL) {
            ans.push_back(root->data);
            printleft(root->left, ans);
        } else if (root->right != NULL) {
            ans.push_back(root->data);
            printleft(root->right, ans);
        }
    }

    void printleaf(Node *root, vector<int> &ans) {
        if (root == NULL) {
            return;
        }
        if (root->left == NULL && root->right == NULL) {
            ans.push_back(root->data);
            return;
        }
        printleaf(root->left, ans);
        printleaf(root->right, ans);
    }

    void printright(Node *root, vector<int> &ans) {
        if (root == NULL) {
            return;
        }
        if (root->right != NULL) {
            printright(root->right, ans);
            ans.push_back(root->data);
        } else if (root->left != NULL) {
            printright(root->left, ans);
            ans.push_back(root->data);
        }
    }

    vector<int> boundary(Node *root) {
        vector<int> ans;
        ans.push_back(root->data);
        printleft(root->left, ans);
        printleaf(root->left, ans);
        printleaf(root->right, ans);
        printright(root->right, ans);
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
