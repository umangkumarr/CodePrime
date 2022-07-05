---
displayed_sidebar: null
sidebar_position : 126
tags: [Dynamic Programming, Tree, Depth-First Search, Binary Tree]
---

# Binary Tree Maximum Path Sum

## [Problem](https://leetcode.com/problems/binary-tree-maximum-path-sum/)

<p>A <strong>path</strong> in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence <strong>at most once</strong>. Note that the path does not need to pass through the root.</p>

<p>The <strong>path sum</strong> of a path is the sum of the node&#39;s values in the path.</p>

<p>Given the <code>root</code> of a binary tree, return <em>the maximum <strong>path sum</strong> of any <strong>non-empty</strong> path</em>.</p>

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
    void traversal(TreeNode* root) {
        if (!root) return;
        traversal(root->left);
        traversal(root->right);

        ans = max(ans, root->val);

        int value = root->val;
        if (root->right) value += mp[root->right];
        if (root->left) value += mp[root->left];

        ans = max(ans, value);
        mp[root] = max({root->val, root->val + mp[root->right],
                        root->val + mp[root->left]});
        ans = max(ans, mp[root]);
    }

    int maxPathSum(TreeNode* root) {
        ans = INT_MIN;
        traversal(root);
        return ans;
    }
};

```
</TabItem>
</Tabs>

</details>
