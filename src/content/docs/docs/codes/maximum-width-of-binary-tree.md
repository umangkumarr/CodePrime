---
title: "Maximum Width of Binary Tree"
description: "Given the root of a binary tree, return the maximum width of the given tree. The maximum width of a tree is the maximum width among all levels. The width…"
source: "https://leetcode.com/problems/maximum-width-of-binary-tree/"
tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(w)"
---

## Problem

<p>Given the <code>root</code> of a binary tree, return <em>the <strong>maximum width</strong> of the given tree</em>.</p>

<p>The <strong>maximum width</strong> of a tree is the maximum <strong>width</strong> among all levels.</p>

<p>The <strong>width</strong> of one level is defined as the length between the end-nodes (the leftmost and rightmost non-null nodes), where the null nodes between the end-nodes that would be present in a complete binary tree extending down to that level are also counted into the length calculation.</p>

<p>It is <strong>guaranteed</strong> that the answer will in the range of a <strong>32-bit</strong> signed integer.</p>

## Solution approach

### Intuition

Number the nodes as in a heap: if a node has position `p`, its left child gets `2 * p + 1` and its right child gets `2 * p + 2`. The null nodes in between are then counted automatically, so the width of a level is simply the position of its last node minus the position of its first node, plus one.

### Algorithm

1. Do a level-order traversal with a queue `q` of `{node, position}` pairs, starting with `{root, 0}`.
2. At the start of each level, read `start` from `q.front()` and `end` from `q.back()`, and update `ans` with `end - start + 1`.
3. Pop the `n` nodes of the level and push each non-null child with position `2 * p + 1` or `2 * p + 2`.
4. Return `ans` once the queue is empty.

### Complexity

- **Time:** $O(n)$ — every node is pushed and popped once.
- **Space:** $O(w)$ — the queue holds at most one full level, where `w` is the maximum number of nodes on a level.

### Edge cases

- **Deep, skewed trees**: positions double on every level. They are computed as `long long` but stored in an `int`, so on very deep trees they wrap around; the code relies on `end - start` still coming out right after the wrap.

## Code

```cpp title="C++"
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
