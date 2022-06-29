---
sidebar_position : 12
tags: [Queue, Tree, Depth-First Search, Binary Tree]
---

# Maximum Width of Binary Tree

## Problem Link
https://leetcode.com/problems/maximum-width-of-binary-tree/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int widthOfBinaryTree(TreeNode* root) {
        queue<pair<TreeNode*, int>> q;
        q.push({root, 0});
        int ans = 0;
        while (!q.empty()) {
            int n = q.size();
            int start = q.front().second;
            int end = q.back().second;
            ans = max(ans, end - start + 1);
            for (int i = 0; i < n; i++) {
                TreeNode* node = q.front().first;
                int p = q.front().second;
                q.pop();
                if (node->left != NULL) {
                    q.push({node->left, (long long)2 * p + 1});
                }
                if (node->right != NULL) {
                    q.push({node->right, (long long)2 * p + 2});
                }
            }
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
