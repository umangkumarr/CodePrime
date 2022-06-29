---
sidebar_position : 1
tags: [Tree, Breadth-First Search, Binary Tree, Linked List]
---

# Populating Next Right Pointers in Each Node

## Problem Link
https://leetcode.com/problems/populating-next-right-pointers-in-each-node/

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
