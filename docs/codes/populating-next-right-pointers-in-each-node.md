---
sidebar_position : 133
tags: [Linked List, Tree, Depth-First Search, Breadth-First Search, Binary Tree]
---

# Populating Next Right Pointers in Each Node

## [Problem](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/)

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

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
