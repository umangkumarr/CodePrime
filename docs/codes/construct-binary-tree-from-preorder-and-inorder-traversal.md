---
sidebar_position : 121
tags: [Array, Hash Table, Divide and Conquer, Tree, Binary Tree]
---

# Construct Binary Tree from Preorder and Inorder Traversal

## [Problem](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

<p>Given two integer arrays <code>preorder</code> and <code>inorder</code> where <code>preorder</code> is the preorder traversal of a binary tree and <code>inorder</code> is the inorder traversal of the same tree, construct and return <em>the binary tree</em>.</p>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    vector<int> preorder;
    vector<int> inorder;

   public:
    TreeNode* createTree(int p1, int p2, int n1, int n2) {
        if (p2 < p1 || n1 > n2) return NULL;
        TreeNode* root = new TreeNode(preorder[p1]);
        if (p1 == p2 || n1 == n2) return root;
        int pp1, pp2, nn1, nn2;

        nn1 = n1, nn2 = n1;
        while (inorder[nn2] != preorder[p1]) {
            nn2++;
        }
        nn2--;
        pp1 = p1 + 1;
        pp2 = p1 + (nn2 - nn1) + 1;

        root->left = createTree(pp1, pp2, nn1, nn2);

        nn2 = n2;
        nn1 = n2;
        while (inorder[nn1] != preorder[p1]) nn1--;
        nn1++;
        pp2 = p2;
        pp1 = pp2 - (nn2 - nn1);
        root->right = createTree(pp1, pp2, nn1, nn2);
        return root;
    }

    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        this->preorder = preorder;
        this->inorder = inorder;
        int n = preorder.size();
        return createTree(0, n - 1, 0, n - 1);
    }
};

```
</TabItem>
</Tabs>

</details>
