---
displayed_sidebar: null
sidebar_position : 135
tags: [Hash Table, Two Pointers, Tree, Depth-First Search, Breadth-First Search, Binary Search Tree, Binary Tree]
---

# Two Sum IV - Input is a BST

## [Problem](https://leetcode.com/problems/two-sum-iv-input-is-a-bst/)

<p>Given the <code>root</code> of a Binary Search Tree and a target number <code>k</code>, return <em><code>true</code> if there exist two elements in the BST such that their sum is equal to the given target</em>.</p>

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
