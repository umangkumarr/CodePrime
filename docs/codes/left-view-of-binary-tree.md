---
sidebar_position : 6
tags: [Stack, Tree, Depth-First Search, Binary Tree]
---

# Left View of Binary Tree

## [Problem](https://practice.geeksforgeeks.org/problems/left-view-of-binary-tree/1)

<p><span>Given a Binary Tree, print Left view of it. Left view of a Binary Tree is set of nodes visible when tree is visited from Left side. The task is to complete the function <strong>leftView()</strong>, which accepts root of the tree as argument.</span></p>
<p><span>Left view of following tree is 1 2 4 8.</span></p>
<p><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /&nbsp;&nbsp;&nbsp;&nbsp; \<br/>
&nbsp;&nbsp;&nbsp;&nbsp; 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3<br/>
&nbsp;&nbsp; /&nbsp;&nbsp; &nbsp; \ &nbsp;&nbsp; /&nbsp;&nbsp;&nbsp; \<br/>
&nbsp; 4&nbsp;&nbsp;&nbsp;&nbsp; 5&nbsp;&nbsp; 6&nbsp;&nbsp;&nbsp; 7<br/>
&nbsp;&nbsp; \<br/>
&nbsp;&nbsp;&nbsp;&nbsp; 8&nbsp; &nbsp;</span></p>

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
