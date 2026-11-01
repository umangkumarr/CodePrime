---
title: "Boundary Traversal of binary tree"
description: "Given a Binary Tree, find its Boundary Traversal. The traversal should be in the following order: Left boundary nodes: defined as the path from the root…"
source: "https://practice.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1/"
tags: ["Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

<p><span>Given a Binary Tree, find its Boundary Traversal. The traversal should be in the following order:&nbsp;</span></p>
<ol>
	<li><span><strong>Left boundary nodes:</strong>&nbsp;defined as the path from the root to the left-most node&nbsp;</span><span>ie- the&nbsp;leaf node you could reach when you always travel preferring&nbsp;the left subtree over the&nbsp;right subtree.&nbsp;</span></li>
	<li><span><strong>Leaf nodes:&nbsp;</strong>All the leaf nodes except for the ones that are part of left or right boundary.</span></li>
	<li><span><strong>Reverse right boundary nodes:</strong>&nbsp;defined as the path from&nbsp;the right-most node to the&nbsp;root. The&nbsp;right-most node is&nbsp;the&nbsp;leaf node you could reach when you always travel preferring&nbsp;the right subtree over the&nbsp;left subtree.&nbsp;Exclude the root from this as it was already included in the traversal of left boundary nodes.</span></li>
</ol>
<span><strong>Note:</strong> If the root doesn't have a left subtree or right subtree, then the root itself is the left&nbsp;or right boundary.</span>

## Solution approach

### Intuition

The boundary of a tree, taken anticlockwise, has three parts: the **left boundary** going down (without the leaf at its end), all the **leaves** from left to right, and the **right boundary** going up (again without its leaf). Each part can be collected with its own simple recursion, and the root is added once at the start.

### Algorithm

1. Push `root->data` into `ans`.
2. `printleft(root->left, ans)`: while the node is not a leaf, record it and move to its left child if it exists, otherwise to its right child. Leaves are skipped because they are not recorded when both children are null.
3. `printleaf` on `root->left` and then on `root->right`: a DFS that records only the nodes with no children, from left to right.
4. `printright(root->right, ans)`: walk down preferring the right child, and record each non-leaf node **after** the recursive call, so the right boundary comes out bottom-up.
5. Return `ans`.

### Complexity

- **Time:** $O(n)$ — the leaf pass visits every node once and the two boundary walks are $O(h)$.
- **Space:** $O(h)$ — for the recursion stack, plus the output vector.

### Edge cases

- **Single node:** only the root is added; the leaf pass is called on null children, so the root is not repeated.

## Code

```cpp title="C++"
class Solution {
   public:
    void printleft(Node *root, vector<int> &ans) {
        if (root == NULL) {
            return;
        }
        if (root->left != NULL) {
            ans.push_back(root->data);
            printleft(root->left, ans);
        } else if (root->right != NULL) {
            ans.push_back(root->data);
            printleft(root->right, ans);
        }
    }

    void printleaf(Node *root, vector<int> &ans) {
        if (root == NULL) {
            return;
        }
        if (root->left == NULL && root->right == NULL) {
            ans.push_back(root->data);
            return;
        }
        printleaf(root->left, ans);
        printleaf(root->right, ans);
    }

    void printright(Node *root, vector<int> &ans) {
        if (root == NULL) {
            return;
        }
        if (root->right != NULL) {
            printright(root->right, ans);
            ans.push_back(root->data);
        } else if (root->left != NULL) {
            printright(root->left, ans);
            ans.push_back(root->data);
        }
    }

    vector<int> boundary(Node *root) {
        vector<int> ans;
        ans.push_back(root->data);
        printleft(root->left, ans);
        printleaf(root->left, ans);
        printleaf(root->right, ans);
        printright(root->right, ans);
        return ans;
    }
};
```
