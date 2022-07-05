---
displayed_sidebar: null
sidebar_position : 117
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
---

# Same Tree

## [Problem](https://leetcode.com/problems/same-tree/)

<p>Given the roots of two binary trees <code>p</code> and <code>q</code>, write a function to check if they are the same or not.</p>

<p>Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.</p>

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
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (!p && !q) return true;
        if ((!p && q) || (p && !q)) return false;
        if (p->val != q->val) return false;
        return (isSameTree(p->right, q->right) & isSameTree(p->left, q->left));
    }
};

```
</TabItem>
</Tabs>

</details>
