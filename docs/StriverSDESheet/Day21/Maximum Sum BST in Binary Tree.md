---
sidebar_position : 7
tags: [Tree, Breadth-First Search, Binary Tree]
---

# Maximum Sum BST in Binary Tree

## Problem Link
https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/

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
