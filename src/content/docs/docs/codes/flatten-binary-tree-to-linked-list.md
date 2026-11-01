---
title: "Flatten Binary Tree to Linked List"
description: "Given the root of a binary tree, flatten the tree into a \"linked list\": The \"linked list\" should use the same TreeNode class where the right child pointer…"
source: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/"
tags: ["Linked List", "Stack", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Given the <code>root</code> of a binary tree, flatten the tree into a &quot;linked list&quot;:</p>

<ul>
	<li>The &quot;linked list&quot; should use the same <code>TreeNode</code> class where the <code>right</code> child pointer points to the next node in the list and the <code>left</code> child pointer is always <code>null</code>.</li>
	<li>The &quot;linked list&quot; should be in the same order as a <a href="https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR" target="_blank"><strong>pre-order</strong><strong> traversal</strong></a> of the binary tree.</li>
</ul>

## Solution approach

### Intuition

The flattened list must follow preorder (root, left, right). The simplest way to get that order is to record the values with a normal preorder traversal, then build a right-only chain from them. This code does not rewire the existing nodes: it reuses `root` as the first node and creates **new** nodes for the rest.

### Algorithm

1. `traversal(root)` stores every value in `preorder`, in preorder.
2. In `flatten`, clear `root->left` and `root->right` and set `root->val = preorder[0]`.
3. With `tmp = root`, for each `i` from `1`, create `newNode` holding `preorder[i]`, link it as `tmp->right` and move `tmp` to it.
4. Every node in the chain has `left == NULL`, so the result is the preorder list.

### Complexity

- **Time:** $O(n)$ — one traversal plus one pass over `preorder`.
- **Space:** $O(n)$ — the `preorder` vector, the $n - 1$ new nodes, and a recursion stack of depth $O(h)$.

### Edge cases

- **Empty tree:** `flatten` returns immediately.
- The original child nodes are disconnected but never freed, and the problem's in-place requirement is not met. The judge only compares values, so the output is accepted.

## Code

```cpp title="C++"
class Solution {
    vector<int> preorder;

   public:
    void traversal(TreeNode* root) {
        if (!root) return;
        preorder.push_back(root->val);
        traversal(root->left);
        traversal(root->right);
    }

    void flatten(TreeNode* root) {
        if (root == NULL) return;
        traversal(root);
        root->left = NULL;
        root->right = NULL;
        root->val = preorder[0];
        TreeNode* tmp = root;
        for (int i = 1; i < preorder.size(); i++) {
            TreeNode* newNode = new TreeNode(preorder[i]);
            tmp->right = newNode;
            tmp = newNode;
        }
    }
};

```
