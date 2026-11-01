---
title: "Binary Tree Zigzag Level Order Traversal"
description: "Given the root of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next…"
source: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/"
tags: ["Tree", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Given the <code>root</code> of a binary tree, return <em>the zigzag level order traversal of its nodes&#39; values</em>. (i.e., from left to right, then right to left for the next level and alternate between).</p>

## Solution approach

### Intuition

A zigzag traversal is an ordinary level-order traversal in which every second level is reversed. So the code first collects each level from left to right, and then reverses the odd-numbered levels.

A DFS that visits the left child before the right child sees each level's nodes from left to right, so it can fill the levels directly once their number is known.

### Algorithm

1. `maxHeight(root, 0)` runs a DFS and stores the deepest level index in `h`.
2. Resize `ans` to `h + 1` levels.
3. `build(root, 0)` runs a second DFS that appends `temp->val` to `ans[ht]`, going left before right.
4. Reverse `ans[i]` for every odd level `i = 1, 3, 5, ...`.
5. Return `ans`.

### Complexity

- **Time:** $O(n)$ — two DFS passes, and the reversals touch each value at most once.
- **Space:** $O(n)$ — for the result; the recursion stack adds $O(h)$.

### Edge cases

- **Empty tree:** `h` stays `-1`, so `ans` is resized to `0` and an empty list is returned.

## Code

```cpp title="C++"
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
