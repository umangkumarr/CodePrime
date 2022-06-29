---
sidebar_position : 2
tags: [Tree, Depth-First Search, Binary Tree]
---

# Maximum Depth of Binary Tree

## Problem Link
https://leetcode.com/problems/maximum-depth-of-binary-tree/

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
