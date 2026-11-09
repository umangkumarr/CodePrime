---
title: "Binary Tree Level Order Traversal"
description: "Return a binary tree's values level by level, left to right, using a breadth-first search that processes the queue one whole level at a time."
source: "https://leetcode.com/problems/binary-tree-level-order-traversal/"
difficulty: "Medium"
tags: ["Tree", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(w)"
---

## Problem

Given the `root` of a binary tree, return _the level order traversal of its nodes' values_. (i.e., from left to right, level by level).

**Example 1:**

![Tree 3 with children 9 and 20; 20 has children 15 and 7](https://assets.leetcode.com/uploads/2021/02/19/tree1.jpg)

```text
Input:  root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]
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
- $-1000 \le$ `Node.val` $\le 1000$

## Solution approach

### Intuition

Breadth-first search with a FIFO queue visits nodes in exactly the required order: a node's children are appended behind everything already waiting, so all nodes of depth `d` leave the queue before any node of depth `d + 1`, and siblings leave left to right.

The only extra work is knowing where one level ends. Here is the key invariant: **at the start of each round of the outer loop, the queue contains exactly the nodes of one level and nothing else.** So we record `size = q.size()`, pop exactly that many nodes into a new `level` list, and push their children; when the round ends, the queue holds exactly the next level.

### Algorithm

1. If `root` is null, return an empty list. Otherwise push `root` into `q`.
2. While `q` is not empty:
   - let `size = q.size()` and create an empty `level`;
   - repeat `size` times: pop `node`, append `node->val` to `level`, and push `node->left` and `node->right` if they exist;
   - append `level` to `levels`.
3. Return `levels`.

On Example 1 the queue is `[3]`, then `[9, 20]`, then `[15, 7]`, giving the three levels of the output.

### Complexity

- **Time:** $O(n)$ — every node is pushed and popped exactly once.
- **Space:** $O(w)$ extra — the queue holds at most one level plus part of the next, where $w$ is the maximum width of the tree (up to about $n / 2$ for a complete tree). The output is not counted.

### Edge cases

- **Empty tree** (Example 3): returns `[]` immediately rather than `[[]]`.
- **Missing children:** only non-null children are pushed, so `level` never contains placeholder values.

## Code

```cpp
class Solution {
   public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> levels;
        if (!root) return levels;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int size = q.size();
            vector<int> level;
            level.reserve(size);
            for (int i = 0; i < size; i++) {
                TreeNode* node = q.front();
                q.pop();
                level.push_back(node->val);
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            levels.push_back(move(level));
        }
        return levels;
    }
};
```

```java
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> levels = new ArrayList<>();
        if (root == null) return levels;
        ArrayDeque<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>(size);
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
            levels.add(level);
        }
        return levels;
    }
}
```

```python
from collections import deque


class Solution:
    def levelOrder(self, root: TreeNode | None) -> list[list[int]]:
        levels = []
        if not root:
            return levels
        q = deque([root])
        while q:
            level = []
            for _ in range(len(q)):
                node = q.popleft()
                level.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            levels.append(level)
        return levels
```
