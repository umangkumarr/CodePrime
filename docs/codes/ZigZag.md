---
tags: [Tree, Breadth-First Search, Binary Tree, Amazon]
---

# Binary Tree Zigzag Traversal

## Problem Link
https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal

## Solution Approach

Do inorder traversal through the tree and store all the values of nodes present at all heights $h_i$ in a 2D array. Nodes will be stored in the order of their indexes. After building the array, reverse the array of odd indexes.

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>
<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    vector<vector<int>> ans;
    int h = -1;

   public:
    void maxHeight(TreeNode* temp, int ht) {
        if (temp == NULL) return;
        h = max(ht, h);
        maxHeight(temp->left, ht + 1);
        maxHeight(temp->right, ht + 1);
    }

    void build(TreeNode* temp, int ht) {
        if (temp == NULL) return;
        ans[ht].push_back(temp->val);
        build(temp->left, ht + 1);
        build(temp->right, ht + 1);
    }

    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        TreeNode* temp;
        temp = new TreeNode;
        temp = root;
        maxHeight(temp, 0);
        ans.resize(h + 1);
        temp = root;
        build(temp, 0);
        for (int i = 1; i <= h; i += 2) {
            reverse(ans[i].begin(), ans[i].end());
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>
</details>