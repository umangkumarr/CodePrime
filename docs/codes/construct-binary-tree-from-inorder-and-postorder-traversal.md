---
sidebar_position : 122
tags: [Array, Hash Table, Divide and Conquer, Tree, Binary Tree]
---

# Construct Binary Tree from Inorder and Postorder Traversal

## [Problem](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

<p>Given two integer arrays <code>inorder</code> and <code>postorder</code> where <code>inorder</code> is the inorder traversal of a binary tree and <code>postorder</code> is the postorder traversal of the same tree, construct and return <em>the binary tree</em>.</p>

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
    vector<int> inorder;

   public:
    TreeNode* createTree(int p1, int p2, int n1, int n2) {
        if (p2 < p1 || n1 > n2) return NULL;
        TreeNode* root = new TreeNode(postorder[p2]);
        if (p1 == p2 || n1 == n2) return root;
        int pp1, pp2, nn1, nn2;

        nn1 = n1, nn2 = n1;
        while (inorder[nn2] != postorder[p2]) {
            nn2++;
        }
        nn2--;
        pp1 = p1;
        pp2 = p1 + (nn2 - nn1);

        root->left = createTree(pp1, pp2, nn1, nn2);

        nn2 = n2;
        nn1 = n2;
        while (inorder[nn1] != postorder[p2]) nn1--;
        nn1++;
        pp2 = p2 - 1;
        pp1 = pp2 - (nn2 - nn1);
        root->right = createTree(pp1, pp2, nn1, nn2);
        return root;
    }

    TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
        this->postorder = postorder;
        this->inorder = inorder;
        int n = inorder.size();
        return createTree(0, n - 1, 0, n - 1);
    }
};

```
</TabItem>
</Tabs>

</details>
