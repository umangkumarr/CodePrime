---
title: "Children Sum Property"
description: "Given a binary tree of nodes 'N', you need to modify the value of its nodes, such that the tree holds the Children sum property. A binary tree is said to…"
source: "https://www.codingninjas.com/codestudio/problems/childrensumproperty_790723?topList=striver-sde-sheet-problems&utm_source=striver&utm_medium=website"
tags: ["Tree", "Binary Tree", "Depth-First Search", "Linked List"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

Given a binary tree of nodes 'N', you need to modify the value of its nodes, such that the tree holds the Children sum property.
A binary tree is said to follow the children sum property if, for every node of that tree, the value of that node is equal to the sum of the value(s) of all of its children nodes( left child and the right child).

## Solution approach

### Intuition

This approach only ever **increases** node values (the usual constraint for this problem), so it never lowers a parent to match its children. The trick is to push values **down** before recursing and fix the sums **up** after recursing.

On the way down, if the children's sum is smaller than the parent, both children are raised to the parent's value. This guarantees that, once the subtrees are fixed, their sum is at least the parent's value. On the way back up, each parent is set to the sum of its children, which can only raise it.

### Algorithm

1. If `root` is null, return.
2. Let `child` be the sum of the existing children's `data`.
3. If `child >= root->data`, set `root->data = child`. Otherwise, set each existing child's `data` to `root->data`.
4. Recurse with `changeTree` on the left and right children.
5. After the recursion, compute `update` as the new sum of the children and, if the node has at least one child, set `root->data = update`.

### Complexity

- **Time:** $O(n)$ — each node is visited once with constant work.
- **Space:** $O(h)$ — for the recursion stack.

### Edge cases

- **Leaves** keep whatever value was pushed down to them, because step 5 only runs for nodes that have a child.

## Code

```cpp title="C++"
void changeTree(BinaryTreeNode<int>* root) {
    if (root == NULL) return;
    int child = 0;
    if (root->left) child += root->left->data;
    if (root->right) child += root->right->data;

    if (child >= root->data)
        root->data = child;

    else {
        if (root->left) root->left->data = root->data;

        if (root->right) root->right->data = root->data;
    }

    changeTree(root->left);
    changeTree(root->right);

    int update = 0;
    if (root->left) update += root->left->data;
    if (root->right) update += root->right->data;

    if (root->left or root->right) root->data = update;
}
```
