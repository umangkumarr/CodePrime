---
title: "Two Sum IV - Input is a BST"
description: "Given the root of a Binary Search Tree and a target number k, return true if there exist two elements in the BST such that their sum is equal to the given…"
source: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/"
tags: ["Hash Table", "Two Pointers", "Tree", "Depth-First Search", "Breadth-First Search", "Binary Search Tree", "Binary Tree"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>Given the <code>root</code> of a Binary Search Tree and a target number <code>k</code>, return <em><code>true</code> if there exist two elements in the BST such that their sum is equal to the given target</em>.</p>

## Solution approach

### Intuition

This is Two Sum on the tree's values. While walking the tree, keep a set of values we have already seen. For a node with value `val`, a matching partner exists if `k - val` has been seen before. The code does not use the BST ordering; any traversal works.

### Algorithm

1. If `root` is null, return `false`.
2. Compute `f = k - root->val`. If `f` is already in `s`, return `true`.
3. Otherwise insert both `root->val` and `f` into `s`.
4. Recurse on the left and right subtrees and return `true` if either finds a pair.

### Complexity

- **Time:** $O(n \log n)$ — each node does $O(\log n)$ work in the ordered `set`.
- **Space:** $O(n)$ — the set, plus a recursion stack of height $h$.

### Edge cases

- **Using a node twice**: for `k = 2 * val`, the node's own value is only inserted after its check, so it cannot pair with itself.

## Code

```cpp title="C++"
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
