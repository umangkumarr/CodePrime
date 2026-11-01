---
title: "Binary Tree Maximum Path Sum"
description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in…"
source: "https://leetcode.com/problems/binary-tree-maximum-path-sum/"
tags: ["Dynamic Programming", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>A <strong>path</strong> in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence <strong>at most once</strong>. Note that the path does not need to pass through the root.</p>

<p>The <strong>path sum</strong> of a path is the sum of the node&#39;s values in the path.</p>

<p>Given the <code>root</code> of a binary tree, return <em>the maximum <strong>path sum</strong> of any <strong>non-empty</strong> path</em>.</p>

## Solution approach

### Intuition

Every path has one highest node, where it "bends". At that node, the best path is the node's value plus the best **downward** path from the left child and from the right child, each taken only if it helps.

So a post-order traversal computes, for every node, the best downward path that starts at it (`mp[root]`). The children's values are then ready when the parent needs them, and each node is checked once as the bending point.

### Algorithm

1. Set `ans = INT_MIN` and call `traversal(root)`.
2. In `traversal`, recurse into both children first.
3. Update `ans` with:
   - `root->val` on its own;
   - `value`, which is `root->val` plus `mp[root->left]` and `mp[root->right]` for the children that exist (the path bends here).
4. Set `mp[root]` to the best downward path: the maximum of `root->val`, `root->val + mp[root->right]`, and `root->val + mp[root->left]`. Update `ans` with it as well.
5. Return `ans`.

Looking up `mp` for a null child returns `0`, so a missing child adds nothing.

### Complexity

- **Time:** $O(n \log n)$ — every node is visited once, but each access to the ordered `map` costs $O(\log n)$.
- **Space:** $O(n)$ — the map stores one value per node; the recursion stack adds $O(h)$.

### Edge cases

- **All negative values:** `ans` starts at `INT_MIN` and is updated with each single `root->val`, so the answer is the largest single node.

## Code

```cpp title="C++"
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
