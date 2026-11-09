---
title: "Binary Tree Zigzag Level Order Traversal"
description: "Return a binary tree's levels in alternating left-to-right and right-to-left order, using level-by-level BFS that writes each value straight into its final slot."
source: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/"
difficulty: "Medium"
tags: ["Tree", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(w)"
---

## Problem

Given the `root` of a binary tree, return _the zigzag level order traversal of its nodes' values_. (i.e., from left to right, then right to left for the next level and alternate between).

**Example 1:**

![Tree 3 with children 9 and 20; 20 has children 15 and 7](https://assets.leetcode.com/uploads/2021/02/19/tree1.jpg)

```text
Input:  root = [3,9,20,null,null,15,7]
Output: [[3],[20,9],[15,7]]
```

**Example 2:**

```text
Input:  root = [1]
Output: [[1]]
```

**Example 3:**

```text
Input:  root = []
Output: []
```

**Constraints:**

- The number of nodes in the tree is in the range `[0, 2000]`.
- $-100 \le$ `Node.val` $\le 100$

## Solution approach

### Intuition

This is [level order traversal](/docs/codes/binary-tree-level-order-traversal/) with every second level reversed. Keep the BFS itself unchanged — children are always pushed left before right, so the queue always yields each level from left to right. Only the **position** where each value is written changes.

At the start of a round the queue holds exactly one level of `size` nodes, so we can allocate `level` with `size` slots. The `i`-th node popped (counting from the left) goes to slot `i` on a left-to-right level, and to slot `size - 1 - i` on a right-to-left level. This fills the level in its final order directly, without a separate reverse.

### Algorithm

1. If `root` is null, return `[]`. Push `root` into `q` and set `leftToRight = true`.
2. While `q` is not empty:
   - let `size = q.size()` and create `level` with `size` slots;
   - for `i` from `0` to `size - 1`: pop `node`, write `node->val` into `level[leftToRight ? i : size - 1 - i]`, and push its non-null children (left, then right);
   - append `level` to `levels` and flip `leftToRight`.
3. Return `levels`.

On Example 1, the second level is popped as `9, 20` but written right to left, so `level = [20, 9]`.

### Complexity

- **Time:** $O(n)$ — every node is pushed, popped and written exactly once.
- **Space:** $O(w)$ extra — the queue holds at most about two levels, where $w$ is the maximum width of the tree. The output is not counted.

### Edge cases

- **Empty tree** (Example 3): returns `[]` immediately.
- **Single-node levels:** `i = 0` and `size - 1 - i = 0` are the same slot, so the direction does not matter.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        vector<vector<int>> levels;
        if (!root) return levels;
        queue<TreeNode*> q;
        q.push(root);
        bool leftToRight = true;
        while (!q.empty()) {
            int size = q.size();
            vector<int> level(size);
            for (int i = 0; i < size; i++) {
                TreeNode* node = q.front();
                q.pop();
                level[leftToRight ? i : size - 1 - i] = node->val;
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            levels.push_back(move(level));
            leftToRight = !leftToRight;
        }
        return levels;
    }
};
```
