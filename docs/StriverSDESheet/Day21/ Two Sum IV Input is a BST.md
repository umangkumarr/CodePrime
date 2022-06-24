---
sidebar_position : 5
tags: [Tree, Breadth-First Search, Binary Tree]
---

#  Two Sum IV - Input is a BST

## Problem Link
https://leetcode.com/problems/two-sum-iv-input-is-a-bst/

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
    set<int> s;
    bool findTarget(TreeNode* root, int k) {
        if (root == nullptr) return false;
        int f = k - root->val;
        if (s.find(f) != s.end()) {
            return true;
        } else {
            s.insert(root->val);
            s.insert(f);
        }
        bool l = findTarget(root->left, k);
        bool r = findTarget(root->right, k);
        if (l || r) return true;
        return false;
    }
};
```
</TabItem>
</Tabs>

</details>
