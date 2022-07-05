---
displayed_sidebar: null
sidebar_position : 118
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
---

# Maximum Depth of Binary Tree

## [Problem](https://leetcode.com/problems/maximum-depth-of-binary-tree/)

<p>Given the <code>root</code> of a binary tree, return <em>its maximum depth</em>.</p>

<p>A binary tree&#39;s <strong>maximum depth</strong>&nbsp;is the number of nodes along the longest path from the root node down to the farthest leaf node.</p>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    int h;

   public:
    void traverse(TreeNode* root, int hgt) {
        if (!root) return;
        h = max(h, hgt);
        traverse(root->left, hgt + 1);
        traverse(root->right, hgt + 1);
    }

    int maxDepth(TreeNode* root) {
        h = 0;
        traverse(root, 1);
        return h;
    }
};

```
</TabItem>
</Tabs>

</details>
