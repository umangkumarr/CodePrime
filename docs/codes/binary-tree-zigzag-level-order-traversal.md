---
displayed_sidebar: null
sidebar_position : 113
tags: [Tree, Breadth-First Search, Binary Tree]
---

# Binary Tree Zigzag Level Order Traversal

## [Problem](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/)

<p>Given the <code>root</code> of a binary tree, return <em>the zigzag level order traversal of its nodes&#39; values</em>. (i.e., from left to right, then right to left for the next level and alternate between).</p>

## Solution Approach

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
