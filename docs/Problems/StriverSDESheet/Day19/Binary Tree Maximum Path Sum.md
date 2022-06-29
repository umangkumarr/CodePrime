---
sidebar_position : 1
tags: [Tree, Depth-First Search, Binary Tree, Dynamic Programming]
---

# Binary Tree Maximum Path Sum

## Problem Link
https://leetcode.com/problems/binary-tree-maximum-path-sum/

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
