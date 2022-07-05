---
displayed_sidebar: null
sidebar_position : 120
tags: [Tree, Depth-First Search, Binary Tree]
---

# Diameter of Binary Tree

## [Problem](https://leetcode.com/problems/diameter-of-binary-tree/)

<p>Given the <code>root</code> of a binary tree, return <em>the length of the <strong>diameter</strong> of the tree</em>.</p>

<p>The <strong>diameter</strong> of a binary tree is the <strong>length</strong> of the longest path between any two nodes in a tree. This path may or may not pass through the <code>root</code>.</p>

<p>The <strong>length</strong> of a path between two nodes is represented by the number of edges between them.</p>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    int ans;
    map<TreeNode*, int> mp;

   public:
    void traverse(TreeNode* root) {
        if (!root) return;
        traverse(root->left);
        traverse(root->right);
        int dist = 0;
        mp[root] = 0;
        if (root->left) {
            dist += mp[root->left] + 1;
            mp[root] = mp[root->left] + 1;
        }
        if (root->right) {
            dist += mp[root->right] + 1;
            mp[root] = max(mp[root], mp[root->right] + 1);
        }
        ans = max(ans, dist);
    }

    int diameterOfBinaryTree(TreeNode* root) {
        ans = 0;
        traverse(root);
        return ans;
    }
};

```
</TabItem>
</Tabs>

</details>
