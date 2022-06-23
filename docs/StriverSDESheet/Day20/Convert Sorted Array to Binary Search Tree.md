---
sidebar_position : 3
tags: [Tree, Breadth-First Search, Binary Tree, Divide and Conquer]
---

# Convert Sorted Array to Binary Search Tree

## Problem Link
https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/

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
    TreeNode* createBST(vector<int> nums, int start, int end) {
        if (start > end) return NULL;
        int mid = (start + end) / 2;
        TreeNode* root = new TreeNode(nums[mid]);
        root->left = createBST(nums, start, mid - 1);
        root->right = createBST(nums, mid + 1, end);
        return root;
    }

    TreeNode* sortedArrayToBST(vector<int>& nums) {
        return createBST(nums, 0, nums.size() - 1);
    }
};
```
</TabItem>
</Tabs>

</details>
