---
displayed_sidebar: null
sidebar_position : 11
tags: [Hash Table, Tree, Depth-First Search, Binary Tree]
---

# Path to Given Node

## [Problem](https://www.interviewbit.com/problems/path-to-given-node/)

<div><p>Given a Binary Tree <strong>A</strong> containing <strong>N</strong> nodes.</p><p></p><p></p><p></p>
<p>You need to find the path from <strong>Root</strong> to a given node <strong>B</strong>.</p>
<p><strong>NOTE:</strong></p>
<ul>
<li>No two nodes in the tree have same data values.</li>
<li>You can assume that <strong>B</strong> is present in the tree <strong>A</strong> and a path always exists.</li>
</ul>
<p></p>
<p></p>
<p></p></div>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
vector<int> ans;
int check = 0;
void traversal(TreeNode* root, int B) {
    if (!root) return;
    if (root->val == B) {
        check = 1;
        ans.push_back(root->val);
        return;
    }
    traversal(root->left, B);
    if (check == 1) {
        ans.push_back(root->val);
        return;
    }
    traversal(root->right, B);
    if (check == 1) ans.push_back(root->val);
}

vector<int> Solution::solve(TreeNode* A, int B) {
    ans.clear();
    check = 0;
    traversal(A, B);
    reverse(ans.begin(), ans.end());
    return ans;
}
```
</TabItem>
</Tabs>

</details>
