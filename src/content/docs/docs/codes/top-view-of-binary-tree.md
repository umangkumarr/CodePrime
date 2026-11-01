---
title: "Top View of Binary Tree"
description: "Given below is a binary tree. The task is to print the top view of binary tree. Top view of a binary tree is the set of nodes visible when the tree is…"
source: "https://practice.geeksforgeeks.org/problems/top-view-of-binary-tree/1"
tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p></p><p><span>Given below is a binary tree. The task is to print the top view of binary tree. Top view of a binary tree is the set of nodes visible when the tree is viewed from the top. For the given below tree</span></p>

<p><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1<br/>
&nbsp;&nbsp;&nbsp; /&nbsp;&nbsp;&nbsp;&nbsp; \<br/>
&nbsp;&nbsp; 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3<br/>
&nbsp; /&nbsp; \&nbsp;&nbsp;&nbsp; /&nbsp;&nbsp; \<br/>
4&nbsp;&nbsp;&nbsp; 5&nbsp; 6&nbsp;&nbsp; 7</span></p>

<p><span>Top view will be: 4 2 1 3 7<br/>
<strong>Note: </strong>Return nodes from <strong>leftmost </strong>node to <strong>rightmost </strong>node.</span></p>

<p><strong><span>Your Task:</span></strong><br/>
<span>Since this is a function problem. You don't have to take input. Just complete the function<strong>&nbsp;topView() </strong>that takes <strong>root node </strong>as parameter and returns a list of nodes visible from the top view from left to right.</span></p>

## Solution approach

### Intuition

Give every node a column index: the code uses `c + 1` for a left child and `c - 1` for a right child. The top view shows, for each column, the node with the smallest depth. A DFS can record, per column, the shallowest node seen so far, replacing it only when it finds a strictly shallower one. Because the DFS visits the left subtree first, ties at the same depth keep the node further left, the same one a level-order traversal would meet first.

### Algorithm

1. `traversal(root, c, h)` visits each node with column `c` and depth `h`.
2. If column `c` is not in `height` yet, or `height[c] > h`, store `root->data` in `mp[c]` and `h` in `height[c]`.
3. Recurse on `root->left` with `c + 1` and on `root->right` with `c - 1`, both at depth `h + 1`.
4. In `topView`, read `mp` in key order. Since left columns have **larger** keys here, reverse `view` so the leftmost column comes first.

### Complexity

- **Time:** $O(n \log n)$ — each of the $n$ nodes does $O(\log n)$ work in the ordered maps.
- **Space:** $O(n)$ — the two maps, plus the recursion stack of height $h$.

## Code

```cpp title="C++"
class Solution {
    map<int, int> mp, height;

   public:
    void traversal(Node *root, int c, int h) {
        if (!root) return;
        if (height.find(c) == height.end() || height[c] > h) {
            mp[c] = root->data;
            height[c] = h;
        }
        traversal(root->left, c + 1, h + 1);
        traversal(root->right, c - 1, h + 1);
    }

    vector<int> topView(Node *root) {
        vector<int> view;
        traversal(root, 0, 0);
        for (auto i : mp) {
            view.push_back(i.second);
        }
        reverse(view.begin(), view.end());
        return view;
    }
};
```
