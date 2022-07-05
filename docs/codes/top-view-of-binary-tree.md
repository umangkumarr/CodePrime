---
displayed_sidebar: null
sidebar_position : 8
tags: [Stack, Tree, Depth-First Search, Binary Tree]
---

# Top View of Binary Tree

## [Problem](https://practice.geeksforgeeks.org/problems/top-view-of-binary-tree/1)


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
</TabItem>
</Tabs>

</details>
