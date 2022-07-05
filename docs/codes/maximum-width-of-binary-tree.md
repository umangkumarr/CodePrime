---
displayed_sidebar: null
sidebar_position : 102
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
---

# Maximum Width of Binary Tree

## [Problem](https://leetcode.com/problems/maximum-width-of-binary-tree/)

<p>Given the <code>root</code> of a binary tree, return <em>the <strong>maximum width</strong> of the given tree</em>.</p>

<p>The <strong>maximum width</strong> of a tree is the maximum <strong>width</strong> among all levels.</p>

<p>The <strong>width</strong> of one level is defined as the length between the end-nodes (the leftmost and rightmost non-null nodes), where the null nodes between the end-nodes that would be present in a complete binary tree extending down to that level are also counted into the length calculation.</p>

<p>It is <strong>guaranteed</strong> that the answer will in the range of a <strong>32-bit</strong> signed integer.</p>

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
