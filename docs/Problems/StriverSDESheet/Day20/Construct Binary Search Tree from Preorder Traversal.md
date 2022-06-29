---
sidebar_position : 4
tags: [Tree, Breadth-First Search, Binary Tree]
---

# Construct Binary Search Tree from Preorder Traversal

## Problem Link
https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/

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
    TreeNode* createBST(vector<int> nums, int i, int j) {
        if (i > j) return NULL;
        TreeNode* root = new TreeNode(nums[i]);
        if (i == j) return root;
        int k = i + 1;
        while (k <= j && nums[k] < nums[i]) k++;
        root->left = createBST(nums, i + 1, k - 1);
        root->right = createBST(nums, k, j);
        return root;
    }

    TreeNode* bstFromPreorder(vector<int>& nums) {
        return createBST(nums, 0, nums.size() - 1);
    }
};
```
</TabItem>
</Tabs>

</details>
