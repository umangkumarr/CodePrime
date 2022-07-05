---
displayed_sidebar: null
sidebar_position : 136
tags: [Dynamic Programming, Tree, Depth-First Search, Binary Search Tree, Binary Tree]
---

# Maximum Sum BST in Binary Tree

## [Problem](https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/)

<p>Given a <strong>binary tree</strong> <code>root</code>, return <em>the maximum sum of all keys of <strong>any</strong> sub-tree which is also a Binary Search Tree (BST)</em>.</p>

<p>Assume a BST is defined as follows:</p>

<ul>
	<li>The left subtree of a node contains only nodes with keys <strong>less than</strong> the node&#39;s key.</li>
	<li>The right subtree of a node contains only nodes with keys <strong>greater than</strong> the node&#39;s key.</li>
	<li>Both the left and right subtrees must also be binary search trees.</li>
</ul>

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
    int ans = 0;
    bool f(TreeNode *root, int &minv, int &maxv, int &s) {
        if (root == NULL) return true;

        int lmin = minv, lmax = maxv, lsum = 0;
        bool l = f(root->left, lmin, lmax, lsum);

        int rmin = minv, rmax = maxv, rsum = 0;
        bool r = f(root->right, rmin, rmax, rsum);

        if (l == false || r == false || root->val <= lmax || root->val >= rmin)
            return false;

        s += lsum + rsum + root->val;
        ans = max(ans, s);

        minv = min(lmin, root->val);
        maxv = max(rmax, root->val);
        return true;
    }

    int maxSumBST(TreeNode *root) {
        int s = 0;
        int lm = INT_MAX, rm = INT_MIN;
        f(root, lm, rm, s);
        return ans;
    }
};

```
</TabItem>
</Tabs>

</details>
