---
sidebar_position : 6
tags: [Stack, Tree, Depth-First Search, Binary Tree]
---

# Left View of Binary Tree

## Problem Link
https://practice.geeksforgeeks.org/problems/left-view-of-binary-tree/1

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
