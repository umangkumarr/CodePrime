---
title: "Populating Next Right Pointers in Each Node"
description: "You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. The binary tree has the following…"
source: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/"
tags: ["Linked List", "Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n \\log h)"
  space: "O(n)"
---

## Problem

<p>You are given a <strong>perfect binary tree</strong> where all leaves are on the same level, and every parent has two children. The binary tree has the following definition:</p>

```
struct Node {
  int val;
  Node *left;
  Node *right;
  Node *next;
}
```

<p>Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to <code>NULL</code>.</p>

<p>Initially, all next pointers are set to <code>NULL</code>.</p>

## Solution approach

### Intuition

Every `next` pointer links a node to the node immediately to its right **on the same level**. A preorder DFS that visits the left child before the right child reaches the nodes of each level in left-to-right order. So if we group nodes by depth in visiting order, we only need to link neighbours within each group.

### Algorithm

1. `traversal(root, h)` appends `root` to `mp[h]`, where `h` is its depth, then recurses into the left child and then the right child with `h + 1`.
2. In `connect`, run `traversal(root, 0)`.
3. For each level in `mp`, set `next` of the `j`-th node to the `(j + 1)`-th node. The last node of each level keeps its default `NULL`.
4. Return `root`.

### Complexity

- **Time:** $O(n \log h)$ — each of the `n` nodes is inserted into the ordered `map` keyed by depth, which has `h` keys. For the perfect binary tree in this problem `h` is about $\log n$, so this is practically linear.
- **Space:** $O(n)$ — the map stores every node pointer, plus an $O(h)$ recursion stack.

## Code

```cpp title="C++"
class Solution {
    map<int, vector<Node*>> mp;

   public:
    void traversal(Node* root, int h) {
        if (!root) return;
        mp[h].push_back(root);
        traversal(root->left, h + 1);
        traversal(root->right, h + 1);
    }

    Node* connect(Node* root) {
        traversal(root, 0);
        for (auto i : mp) {
            for (int j = 0; j < i.second.size() - 1; j++) {
                i.second[j]->next = i.second[j + 1];
            }
        }
        return root;
    }
};

```
