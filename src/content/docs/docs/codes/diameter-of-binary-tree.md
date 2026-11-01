---
title: "Diameter of Binary Tree"
description: "Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between…"
source: "https://leetcode.com/problems/diameter-of-binary-tree/"
tags: ["Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>Given the <code>root</code> of a binary tree, return <em>the length of the <strong>diameter</strong> of the tree</em>.</p>

<p>The <strong>diameter</strong> of a binary tree is the <strong>length</strong> of the longest path between any two nodes in a tree. This path may or may not pass through the <code>root</code>.</p>

<p>The <strong>length</strong> of a path between two nodes is represented by the number of edges between them.</p>

## Solution approach

### Intuition

The longest path between two nodes always has some highest node where it "bends". At that node, the path goes down into the left subtree as far as possible and down into the right subtree as far as possible. So if we know, for every node, the height of its left and right subtrees (counted in edges), the diameter is the best value of `left height + right height` over all nodes.

A post-order traversal gives exactly this: children are finished before their parent.

### Algorithm

1. `traverse(root)` first processes `root->left` and `root->right`.
2. `mp[root]` stores the height (in edges) of the subtree rooted at `root`, starting at `0`.
3. If a left child exists, it adds `mp[root->left] + 1` to `dist` and to `mp[root]`. If a right child exists, it adds `mp[root->right] + 1` to `dist` and sets `mp[root]` to the larger of the two sides.
4. `dist` is the longest path bending at `root`; update `ans = max(ans, dist)`.
5. `diameterOfBinaryTree` resets `ans`, runs `traverse`, and returns `ans`.

### Complexity

- **Time:** $O(n \log n)$ — every node is visited once, but each access to the `std::map` `mp` costs $O(\log n)$.
- **Space:** $O(n)$ — the map stores one height per node, plus a recursion stack of depth $O(h)$.

### Edge cases

- **Single node:** no children, so `dist = 0` and the answer is `0`.
- The diameter does not have to pass through the root; checking `dist` at every node handles that.

## Code

```cpp title="C++"
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
