---
title: "Balanced Binary Tree"
description: "Given a binary tree, determine if it is height-balanced. For this problem, a height-balanced binary tree is defined as: a binary tree in which the left…"
source: "https://leetcode.com/problems/balanced-binary-tree/"
tags: ["Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>Given a binary tree, determine if it is height-balanced.</p>

<p>For this problem, a height-balanced binary tree is defined as:</p>

<blockquote>
<p>a binary tree in which the left and right subtrees of <em>every</em> node differ in height by no more than 1.</p>
</blockquote>

## Solution approach

### Intuition

A tree is height-balanced if, **at every node**, the heights of the left and right subtrees differ by at most one. Computing the height separately for each node would repeat work. A post-order traversal computes each child's height first, so the node's own height and balance check take constant extra work.

### Algorithm

1. Set `ans = true` and call `traverse(root)`.
2. In `traverse`, return for a null node; otherwise recurse into the left and right children first.
3. Store the node's height in the map `mp`, starting at `0` for a leaf. For each existing child, update `mp[root]` to `mp[child] + 1`.
4. Use `diff` to hold the left height `mp[root->left] + 1` minus the right height `mp[root->right] + 1`, with a missing child counting as `0`.
5. If `abs(diff) > 1`, set `ans = false`.
6. Return `ans`.

### Complexity

- **Time:** $O(n \log n)$ — every node is visited once, but each access to the ordered `map` costs $O(\log n)$.
- **Space:** $O(n)$ — the map stores one height per node; the recursion stack adds $O(h)$.

### Edge cases

- **Empty tree:** `traverse` returns at once and the answer is `true`.

## Code

```cpp title="C++"
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
