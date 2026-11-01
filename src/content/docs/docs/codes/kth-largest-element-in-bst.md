---
title: "Kth largest element in BST"
description: "Given a Binary search tree. Your task is to complete the function which will return the Kth largest element without doing any modification in Binary…"
source: "https://practice.geeksforgeeks.org/problems/kth-largest-element-in-bst/1"
tags: ["Tree", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given a Binary search tree. Your task is to complete the function which will return the Kth largest element without doing any modification in Binary Search Tree.

## Solution approach

### Intuition

An in-order traversal of a BST (left, node, right) visits keys in increasing order. Reversing it (right, node, left) visits them in **decreasing** order, so the $K$-th value visited is the $K$-th largest.

### Algorithm

1. `traversal` visits `root->right`, pushes `root->data` into `v`, then visits `root->left`.
2. Run `traversal(root)` so that `v` holds all keys in decreasing order.
3. Return `v[K - 1]`.

### Complexity

- **Time:** $O(n)$ — the whole tree is traversed, even though only the first `K` values are needed.
- **Space:** $O(n)$ — `v` stores every key; the recursion stack adds $O(h)$.

### Edge cases

- `v` is a class member that is never cleared, so calling `kthLargest` twice on the same object would mix values from both calls.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> v;

    void traversal(Node* root) {
        if (!root) return;
        traversal(root->right);
        v.push_back(root->data);
        traversal(root->left);
    }

    int kthLargest(Node* root, int K) {
        traversal(root);
        return v[K - 1];
    }
};
```
