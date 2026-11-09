---
title: "Same Tree"
description: "Check whether two binary trees have identical shape and values with a simultaneous recursive traversal of both trees."
source: "https://leetcode.com/problems/same-tree/"
difficulty: "Easy"
tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.

**Example 1:**

![Two identical trees 1 with children 2 and 3](https://assets.leetcode.com/uploads/2020/12/20/ex1.jpg)

```text
Input:  p = [1,2,3], q = [1,2,3]
Output: true
```

**Example 2:**

![Tree 1 with left child 2, and tree 1 with right child 2](https://assets.leetcode.com/uploads/2020/12/20/ex2.jpg)

```text
Input:  p = [1,2], q = [1,null,2]
Output: false
```

**Example 3:**

![Tree 1 with children 2 and 1, and tree 1 with children 1 and 2](https://assets.leetcode.com/uploads/2020/12/20/ex3.jpg)

```text
Input:  p = [1,2,1], q = [1,1,2]
Output: false
```

**Constraints:**

- The number of nodes in both trees is in the range `[0, 100]`.
- $-10^4 \le$ `Node.val` $\le 10^4$

## Solution approach

### Intuition

Two trees are the same exactly when their roots match **and** their left subtrees are the same **and** their right subtrees are the same. That definition is already recursive, so the code mirrors it: walk both trees in lockstep and compare the pair of nodes at each position.

"Roots match" has three cases: both missing (equal — an empty tree equals an empty tree), exactly one missing (the shapes differ), or both present with equal values.

### Algorithm

1. If `p` and `q` are both null, return `true`.
2. If exactly one is null, or `p->val != q->val`, return `false`.
3. Return `isSameTree(p->left, q->left) && isSameTree(p->right, q->right)`. The `&&` short-circuits, so the search stops at the first mismatch.

### Complexity

Let $n$ be the number of nodes in the smaller tree and $h$ its height.

- **Time:** $O(n)$ — each pair of positions is compared at most once, and the walk stops as soon as one tree runs out where the other does not.
- **Space:** $O(h)$ — the recursion stack; $O(n)$ for a degenerate (list-shaped) tree, $O(\log n)$ for a balanced one.

### Edge cases

- **Both trees empty:** step 1 returns `true`.
- **Same values, different shape** (Example 2): at the root's left child `p` has a node and `q` has null, so step 2 returns `false`.
- **Same shape, values swapped** (Example 3): the left children are `2` and `1`, so step 2 returns `false`.

## Code

```cpp title="C++"
class Solution {
   public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (!p && !q) return true;
        if (!p || !q || p->val != q->val) return false;
        return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
    }
};
```
