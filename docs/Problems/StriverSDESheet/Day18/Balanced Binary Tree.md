---
sidebar_position : 4
tags: [Tree, Depth-First Search, Binary Tree]
---

# Balanced Binary Tree

## Problem Link
https://leetcode.com/problems/balanced-binary-tree/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    bool ans;
    map<TreeNode*, int> mp;

   public:
    void traverse(TreeNode* root) {
        if (!root) return;
        traverse(root->left);
        traverse(root->right);
        mp[root] = 0;
        int diff = 0;
        if (root->left) {
            mp[root] = max(mp[root], mp[root->left] + 1);
            diff = mp[root->left] + 1;
        }
        if (root->right) {
            mp[root] = max(mp[root], mp[root->right] + 1);
            diff -= mp[root->right] + 1;
        }
        diff = abs(diff);
        if (diff > 1) ans = false;
    }

    bool isBalanced(TreeNode* root) {
        ans = true;
        traverse(root);
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
