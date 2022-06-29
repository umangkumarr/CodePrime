---
sidebar_position : 3
tags: [Tree, Depth-First Search, Binary Tree]
---

#  Diameter of Binary Tree

## Problem Link
https://leetcode.com/problems/diameter-of-binary-tree/

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
