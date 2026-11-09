---
title: "Binary Tree Postorder Traversal"
description: "Return the postorder (left, right, root) traversal of a binary tree iteratively, using one stack and a pointer to the last node output."
source: "https://leetcode.com/problems/binary-tree-postorder-traversal/"
difficulty: "Easy"
tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

Given the `root` of a binary tree, return _the postorder traversal of its nodes' values_.

**Example 1:**

![Tree 1 with right child 2, which has left child 3](https://assets.leetcode.com/uploads/2024/08/29/screenshot-2024-08-29-202743.png)

```text
Input:  root = [1,null,2,3]
Output: [3,2,1]
```

**Example 2:**

![Tree for Example 2](https://assets.leetcode.com/uploads/2024/08/29/tree_2.png)

```text
Input:  root = [1,2,3,4,5,null,8,null,null,6,7,9]
Output: [4,6,7,5,2,9,8,3,1]
```

**Example 3:**

```text
Input:  root = []
Output: []
```

**Example 4:**

```text
Input:  root = [1]
Output: [1]
```

**Constraints:**

- The number of the nodes in the tree is in the range `[0, 100]`.
- $-100 \le$ `Node.val` $\le 100$

**Follow-up:** Recursive solution is trivial, could you do it iteratively?

## Solution approach

### Intuition

Postorder outputs a node only after **both** of its subtrees. With an explicit stack we reach every node twice from below: once when we come back from its left subtree, and once when we come back from its right subtree. The difficulty is telling these two moments apart, because in both cases the node is on top of the stack.

Keep a pointer `last` to the most recently output node. When the top node `node` is examined:

- if it has a right child that is **not** `last`, its right subtree has not been done yet — go into it;
- otherwise (no right child, or we have just output that right child, which is always the last node of the right subtree in postorder) both subtrees are finished, so output `node`.

Walking left before each examination (as in the iterative [inorder traversal](/docs/codes/binary-tree-inorder-traversal/)) guarantees the left subtree is always finished first.

### Algorithm

1. Set `cur = root`, `last = nullptr`.
2. While `cur` is not null or `st` is not empty:
   - while `cur` is not null, push it and move `cur = cur->left`;
   - let `node = st.top()`;
   - if `node->right` exists and `node->right != last`, set `cur = node->right` (descend into the right subtree);
   - otherwise pop `node`, append `node->val`, and set `last = node` (leave `cur` null so we do not descend again).
3. Return `order`.

### Walkthrough

Example 1, `root = [1,null,2,3]` (stack shown bottom to top):

| Step | Stack | `node` | Decision | `order` |
| --- | --- | --- | --- | --- |
| push left spine of `1` | `[1]` | `1` | right child `2` not done: go right | `[]` |
| push left spine of `2` | `[1, 2, 3]` | `3` | no right child: output | `[3]` |
| — | `[1, 2]` | `2` | no right child: output | `[3, 2]` |
| — | `[1]` | `1` | right child `2 == last`: output | `[3, 2, 1]` |

### Complexity

- **Time:** $O(n)$ — every node is pushed once and popped once; the top is examined at most twice per node.
- **Space:** $O(h)$ — the stack holds one root-to-node path, where $h$ is the tree height.

### Edge cases

- **Empty tree** (Example 3): the loop never runs and `[]` is returned.
- **Right child just output:** comparing `node->right` with `last` is what stops the loop from descending into the same right subtree forever.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> order;
        stack<TreeNode*> st;
        TreeNode *cur = root, *last = nullptr;
        while (cur || !st.empty()) {
            while (cur) {
                st.push(cur);
                cur = cur->left;
            }
            TreeNode* node = st.top();
            if (node->right && node->right != last) {
                cur = node->right;
            } else {
                st.pop();
                order.push_back(node->val);
                last = node;
            }
        }
        return order;
    }
};
```
