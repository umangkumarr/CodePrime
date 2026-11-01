---
title: "Left View of Binary Tree"
description: "Given a Binary Tree, print Left view of it. Left view of a Binary Tree is set of nodes visible when tree is visited from Left side. The task is to…"
source: "https://practice.geeksforgeeks.org/problems/left-view-of-binary-tree/1"
tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n \\log h)"
  space: "O(n)"
---

## Problem

<p><span>Given a Binary Tree, print Left view of it. Left view of a Binary Tree is set of nodes visible when tree is visited from Left side. The task is to complete the function <strong>leftView()</strong>, which accepts root of the tree as argument.</span></p>
<p><span>Left view of following tree is 1 2 4 8.</span></p>
<p><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /&nbsp;&nbsp;&nbsp;&nbsp; \<br/>
&nbsp;&nbsp;&nbsp;&nbsp; 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3<br/>
&nbsp;&nbsp; /&nbsp;&nbsp; &nbsp; \ &nbsp;&nbsp; /&nbsp;&nbsp;&nbsp; \<br/>
&nbsp; 4&nbsp;&nbsp;&nbsp;&nbsp; 5&nbsp;&nbsp; 6&nbsp;&nbsp;&nbsp; 7<br/>
&nbsp;&nbsp; \<br/>
&nbsp;&nbsp;&nbsp;&nbsp; 8&nbsp; &nbsp;</span></p>

## Solution approach

### Intuition

The left view shows the first node met on each level when the level is read from left to right. A preorder traversal (node, left, right) reaches the nodes of each level in left-to-right order, so if we record values per depth, the first value recorded for each depth is the leftmost one.

### Algorithm

1. `traversal(root, h)` appends `root->data` to `mp[h]`, then recurses on `root->left` and `root->right` with depth `h + 1`.
2. `leftView` runs `traversal(root, 0)`.
3. For each depth `i` from `0` to `mp.size() - 1`, push `mp[i][0]` into `view`.
4. Clear the global `mp` so the next call starts fresh, and return `view`.

### Complexity

- **Time:** $O(n \log h)$ — each of the `n` nodes does one lookup in an ordered `map` that has `h` keys, one per level.
- **Space:** $O(n)$ — the map stores every node's value; the recursion stack adds $O(h)$.

### Edge cases

- **Empty tree:** `mp` stays empty and an empty `view` is returned.

## Code

```cpp title="C++"
map<int, vector<int>> mp;

void traversal(Node *root, int h) {
    if (!root) return;
    mp[h].push_back(root->data);
    traversal(root->left, h + 1);
    traversal(root->right, h + 1);
}

vector<int> leftView(Node *root) {
    vector<int> view;
    traversal(root, 0);
    for (int i = 0; i < mp.size(); i++) {
        view.push_back(mp[i][0]);
    }
    mp.clear();
    return view;
}

```
