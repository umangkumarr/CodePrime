---
title: "Binary Tree Level Order Traversal"
description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level)."
source: "https://leetcode.com/problems/binary-tree-level-order-traversal/"
tags: ["Tree", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n \\log h)"
  space: "O(n)"
---

## Problem

<p>Given the <code>root</code> of a binary tree, return <em>the level order traversal of its nodes&#39; values</em>. (i.e., from left to right, level by level).</p>

## Solution approach

### Intuition

A level-order traversal groups nodes by their depth. Any traversal that visits the left child before the right child sees the nodes of a level from left to right, so a simple recursive DFS can record each value under its depth `h` and still produce the correct order within each level.

### Algorithm

1. Call `traverse(root, 0)`.
2. In `traverse`, return for a null node. Otherwise append `root->val` to `mp[h]`, then recurse into the left child and then the right child with depth `h + 1`.
3. `mp` is an ordered `map`, so iterating over it returns the levels in increasing depth. Push each `i.second` into `ans` and return it.

### Complexity

- **Time:** $O(n \log h)$ — each node is visited once, and each access to the ordered `map` of $h$ levels costs $O(\log h)$.
- **Space:** $O(n)$ — the map stores every value; the recursion stack adds $O(h)$.

## Code

```cpp title="C++"
class Solution {
    map<int, vector<int>> mp;

   public:
    void traverse(TreeNode* root, int h) {
        if (!root) return;
        mp[h].push_back(root->val);
        traverse(root->left, h + 1);
        traverse(root->right, h + 1);
    }

    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> ans;
        traverse(root, 0);
        for (auto i : mp) ans.push_back(i.second);
        return ans;
    }
};

```
