---
displayed_sidebar: null
sidebar_position : 109
tags: [Hash Table, Tree, Depth-First Search, Breadth-First Search, Binary Tree]
---

# Vertical Order Traversal of a Binary Tree

## [Problem](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/)

<p>Given the <code>root</code> of a binary tree, calculate the <strong>vertical order traversal</strong> of the binary tree.</p>

<p>For each node at position <code>(row, col)</code>, its left and right children will be at positions <code>(row + 1, col - 1)</code> and <code>(row + 1, col + 1)</code> respectively. The root of the tree is at <code>(0, 0)</code>.</p>

<p>The <strong>vertical order traversal</strong> of a binary tree is a list of top-to-bottom orderings for each column index starting from the leftmost column and ending on the rightmost column. There may be multiple nodes in the same row and same column. In such a case, sort these nodes by their values.</p>

<p>Return <em>the <strong>vertical order traversal</strong> of the binary tree</em>.</p>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    map<int, map<int, vector<int>>> mp;

   public:
    void traverse(TreeNode* root, int c, int r) {
        if (!root) return;
        mp[c][r].push_back(root->val);
        traverse(root->left, c - 1, r + 1);
        traverse(root->right, c + 1, r + 1);
    }

    vector<vector<int>> verticalTraversal(TreeNode* root) {
        traverse(root, 0, 0);
        vector<vector<int>> ans;
        for (auto i : mp) {
            vector<int> v;
            for (auto j : i.second) {
                sort(j.second.begin(), j.second.end());
                for (auto k : j.second) v.push_back(k);
            }
            ans.push_back(v);
        }
        return ans;
    }
};

```
</TabItem>
</Tabs>

</details>
