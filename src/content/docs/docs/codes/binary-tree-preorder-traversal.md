---
title: "Binary Tree Preorder Traversal"
description: "Return the preorder (root, left, right) traversal of a binary tree iteratively, with an explicit stack or in O(1) extra space using Morris threading."
source: "https://leetcode.com/problems/binary-tree-preorder-traversal/"
difficulty: "Easy"
tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given the `root` of a binary tree, return _the preorder traversal of its nodes' values_.

**Example 1:**

![Tree 1 with right child 2, which has left child 3](https://assets.leetcode.com/uploads/2024/08/29/screenshot-2024-08-29-202743.png)

```text
Input:  root = [1,null,2,3]
Output: [1,2,3]
```

**Example 2:**

![Tree for Example 2](https://assets.leetcode.com/uploads/2024/08/29/tree_2.png)

```text
Input:  root = [1,2,3,4,5,null,8,null,null,6,7,9]
Output: [1,2,4,5,6,7,3,8,9]
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

- The number of nodes in the tree is in the range `[0, 100]`.
- $-100 \le$ `Node.val` $\le 100$

**Follow-up:** Recursive solution is trivial, could you do it iteratively?

## Solution approach

Preorder means: the node, then its whole left subtree, then its whole right subtree.

### Approach 1: Explicit stack

**Intuition:** A node is output as soon as it is reached, and afterwards we owe two pieces of work: the left subtree, then the right subtree. Push both onto a stack — **right first, then left** — so that the left subtree, being on top, is fully processed before the right child surfaces. The stack therefore always holds the roots of the subtrees still to be visited, in the correct order.

**Algorithm:**

1. If `root` is null, return `[]`. Otherwise push `root`.
2. While `st` is not empty: pop `node`, append `node->val`, then push `node->right` and `node->left` if they exist.

On Example 2: pop `1` (push `3`, `2`), pop `2` (push `5`, `4`), pop `4`, pop `5` (push `7`, `6`), pop `6`, pop `7`, pop `3` (push `8`), pop `8` (push `9`), pop `9` — giving `[1,2,4,5,6,7,3,8,9]`.

**Complexity:** $O(n)$ time — each node is pushed and popped once. $O(h)$ space — the stack holds at most one pending right child per level plus the current node.

### Approach 2: Morris traversal

**Intuition:** This is the [Morris inorder traversal](/docs/codes/binary-tree-inorder-traversal/) with the output moved. To return to `cur` after its left subtree without a stack, temporarily set the right pointer of its **inorder predecessor** `prev` (the rightmost node of `cur->left`, whose `right` is always null) to `cur`. Every node with a left child is therefore reached twice: once going down (when we create the thread) and once coming back (when we find the thread). Preorder outputs a node the **first** time it is reached, so we output `cur` when we create the thread, and only remove the thread on the second visit.

**Algorithm:**

1. Set `cur = root`. While `cur` is not null:
   - If `cur->left` is null: append `cur->val` and move `cur = cur->right`.
   - Otherwise find `prev`: start at `cur->left` and go right while `prev->right` is neither null nor `cur`.
     - If `prev->right` is null (first visit): append `cur->val`, set `prev->right = cur`, and move `cur = cur->left`.
     - If `prev->right == cur` (back through the thread): set `prev->right = nullptr` and move `cur = cur->right`.

**Complexity:** $O(n)$ time — each edge is walked a constant number of times while creating and removing threads. $O(1)$ extra space; the tree is restored when the loop ends.

### Edge cases

- **Empty tree** (Example 3): Approach 1 returns early; in Approach 2 the loop never runs.
- **Node with no left child** (the root of Example 1): it is output immediately and the walk moves right; no thread is created.

## Code

```cpp title="Approach 1: Explicit stack"
class Solution {
   public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> order;
        if (!root) return order;
        stack<TreeNode*> st;
        st.push(root);
        while (!st.empty()) {
            TreeNode* node = st.top();
            st.pop();
            order.push_back(node->val);
            if (node->right) st.push(node->right);
            if (node->left) st.push(node->left);
        }
        return order;
    }
};
```

```cpp title="Approach 2: Morris traversal"
class Solution {
   public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> order;
        TreeNode* cur = root;
        while (cur) {
            if (!cur->left) {
                order.push_back(cur->val);
                cur = cur->right;
                continue;
            }
            TreeNode* prev = cur->left;
            while (prev->right && prev->right != cur) prev = prev->right;
            if (!prev->right) {
                order.push_back(cur->val);  // first visit
                prev->right = cur;
                cur = cur->left;
            } else {
                prev->right = nullptr;  // second visit: remove the thread
                cur = cur->right;
            }
        }
        return order;
    }
};
```
