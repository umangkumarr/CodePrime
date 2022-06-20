---
sidebar_position : 11
tags: [Hash Table, Tree, Depth-First Search, Binary Tree]
---

# Path to Given Node

## Problem Link
https://www.interviewbit.com/problems/path-to-given-node/

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
