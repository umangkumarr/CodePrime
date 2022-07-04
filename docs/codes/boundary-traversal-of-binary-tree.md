---
sidebar_position : 8
tags: [Tree, Depth-First Search, Binary Tree]
---

# Boundary Traversal of binary tree

## [Problem](https://practice.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1/)

<p><span>Given a Binary Tree, find its Boundary Traversal. The traversal should be in the following order:&nbsp;</span></p>
<ol>
	<li><span><strong>Left boundary nodes:</strong>&nbsp;defined as the path from the root to the left-most node&nbsp;</span><span>ie- the&nbsp;leaf node you could reach when you always travel preferring&nbsp;the left subtree over the&nbsp;right subtree.&nbsp;</span></li>
	<li><span><strong>Leaf nodes:&nbsp;</strong>All the leaf nodes except for the ones that are part of left or right boundary.</span></li>
	<li><span><strong>Reverse right boundary nodes:</strong>&nbsp;defined as the path from&nbsp;the right-most node to the&nbsp;root. The&nbsp;right-most node is&nbsp;the&nbsp;leaf node you could reach when you always travel preferring&nbsp;the right subtree over the&nbsp;left subtree.&nbsp;Exclude the root from this as it was already included in the traversal of left boundary nodes.</span></li>
</ol>
<span><strong>Note:</strong> If the root doesn't have a left subtree or right subtree, then the root itself is the left&nbsp;or right boundary.</span>

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
