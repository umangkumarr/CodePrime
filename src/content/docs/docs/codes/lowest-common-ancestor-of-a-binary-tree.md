---
title: "Lowest Common Ancestor of a Binary Tree"
description: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree. According to the definition of LCA on Wikipedia: “The lowest…"
source: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/"
tags: ["Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

<p>Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.</p>

<p>According to the <a href="https://en.wikipedia.org/wiki/Lowest_common_ancestor" target="_blank">definition of LCA on Wikipedia</a>: &ldquo;The lowest common ancestor is defined between two nodes <code>p</code> and <code>q</code> as the lowest node in <code>T</code> that has both <code>p</code> and <code>q</code> as descendants (where we allow <b>a node to be a descendant of itself</b>).&rdquo;</p>

## Solution approach

### Intuition

Count how many of the two targets lie in each subtree. The lowest node whose subtree, including itself, contains **both** targets is the LCA. A post-order traversal computes these counts bottom-up, so the first node to reach a count of `2` is the deepest one.

### Algorithm

1. `traverse(root, p, q)` returns `0` for a null node.
2. Otherwise it adds the counts from the left and right subtrees, plus `1` if `root->val` equals `p->val` and `1` if it equals `q->val`.
3. When the count `c` reaches `2`, store `root` in `LCA` and return `0`, so that no ancestor also reaches `2` and overwrites it.
4. `lowestCommonAncestor` runs `traverse` and returns `LCA`.

### Complexity

- **Time:** $O(n)$ — every node is visited once.
- **Space:** $O(h)$ — the recursion stack, where `h` is the tree height.

### Edge cases

- **One target is an ancestor of the other:** the ancestor sees count `1` from below and `1` from itself, so it becomes the `LCA`.

## Code

```cpp title="C++"
class Solution {
    int cnt;
    TreeNode* LCA;

   public:
    int traverse(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root) return 0;
        int c = traverse(root->left, p, q) + traverse(root->right, p, q);
        c += (root->val == p->val) + (root->val == q->val);
        if (c == 2) {
            LCA = root;
            return 0;
        }
        return c;
    }

    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        cnt = 0;
        traverse(root, p, q);
        return LCA;
    }
};

```
