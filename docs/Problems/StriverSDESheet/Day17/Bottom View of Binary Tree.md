---
sidebar_position : 7
tags: [Stack, Tree, Depth-First Search, Binary Tree]
---

# Bottom View of Binary Tree

## Problem Link
https://practice.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    map<int, int> mp, height;

   public:
    void traversal(Node *root, int c, int h) {
        if (!root) return;
        if (height.find(c) == height.end() || height[c] <= h) {
            mp[c] = root->data;
            height[c] = h;
        }
        traversal(root->left, c + 1, h + 1);
        traversal(root->right, c - 1, h + 1);
    }

    vector<int> bottomView(Node *root) {
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
</TabItem>
</Tabs>

</details>
