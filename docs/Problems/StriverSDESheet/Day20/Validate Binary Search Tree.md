---
sidebar_position : 5
tags: [Tree, Breadth-First Search, Binary Tree]
---

# Validate Binary Search Tree

## Problem Link
https://leetcode.com/problems/validate-binary-search-tree/

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
    bool traversal(TreeNode* root, long long min, long long max) {
        if (!root) return true;
        if (root->val < min || root->val > max) return false;
        return (traversal(root->left, min, (long long)root->val - 1ll) &
                traversal(root->right, (long long)root->val + 1ll, max));
    }

    bool isValidBST(TreeNode* root) {
        return traversal(root, INT_MIN, INT_MAX);
    }
};
```
</TabItem>
</Tabs>

</details>
