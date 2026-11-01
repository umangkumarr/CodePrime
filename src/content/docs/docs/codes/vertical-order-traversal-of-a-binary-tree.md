---
title: "Vertical Order Traversal of a Binary Tree"
description: "Given the root of a binary tree, calculate the vertical order traversal of the binary tree. For each node at position (row, col), its left and right…"
source: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/"
tags: ["Hash Table", "Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>Given the <code>root</code> of a binary tree, calculate the <strong>vertical order traversal</strong> of the binary tree.</p>

<p>For each node at position <code>(row, col)</code>, its left and right children will be at positions <code>(row + 1, col - 1)</code> and <code>(row + 1, col + 1)</code> respectively. The root of the tree is at <code>(0, 0)</code>.</p>

<p>The <strong>vertical order traversal</strong> of a binary tree is a list of top-to-bottom orderings for each column index starting from the leftmost column and ending on the rightmost column. There may be multiple nodes in the same row and same column. In such a case, sort these nodes by their values.</p>

<p>Return <em>the <strong>vertical order traversal</strong> of the binary tree</em>.</p>

## Solution approach

### Intuition

Give each node a column `c` and row `r`: the left child is at `(c - 1, r + 1)` and the right child at `(c + 1, r + 1)`. The output lists columns from left to right; within a column, nodes go from top to bottom, and nodes sharing the same row and column are sorted by value. A nested ordered map `mp[c][r]` keeps columns and rows sorted automatically, so we only need to sort the small groups of nodes that share a position.

### Algorithm

1. `traverse(root, c, r)` does a DFS and appends `root->val` to `mp[c][r]`.
2. Recurse on `root->left` with `(c - 1, r + 1)` and on `root->right` with `(c + 1, r + 1)`.
3. For each column in `mp` (in increasing order), go through its rows in increasing order, sort each row's values, and append them to `v`.
4. Push `v` into `ans` and return `ans`.

### Complexity

- **Time:** $O(n \log n)$ — inserting $n$ nodes into ordered maps and sorting the groups both cost $O(n \log n)$.
- **Space:** $O(n)$ — the map stores every node, plus a recursion stack of height $h$.

### Edge cases

- **Nodes at the same position**: the per-row `sort` puts them in increasing order, as the problem requires.

## Code

```cpp title="C++"
class Solution {
    map<int, map<int, vector<int>>> mp;

   public:
    void traverse(TreeNode* root, int c, int r) {
        if (!root) return;
        mp[c][r].push_back(root->val);
        traverse(root->left, c - 1, r + 1);
        traverse(root->right, c + 1, r + 1);
    }

    vector<vector<int>> verticalTraversal(TreeNode* root) {
        traverse(root, 0, 0);
        vector<vector<int>> ans;
        for (auto i : mp) {
            vector<int> v;
            for (auto j : i.second) {
                sort(j.second.begin(), j.second.end());
                for (auto k : j.second) v.push_back(k);
            }
            ans.push_back(v);
        }
        return ans;
    }
};

```
