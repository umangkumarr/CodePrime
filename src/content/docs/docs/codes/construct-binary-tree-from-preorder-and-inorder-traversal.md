---
title: "Construct Binary Tree from Preorder and Inorder Traversal"
description: "Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same…"
source: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"
tags: ["Array", "Hash Table", "Divide and Conquer", "Tree", "Binary Tree"]
complexity:
  time: "O(n^2)"
  space: "O(n)"
---

## Problem

<p>Given two integer arrays <code>preorder</code> and <code>inorder</code> where <code>preorder</code> is the preorder traversal of a binary tree and <code>inorder</code> is the inorder traversal of the same tree, construct and return <em>the binary tree</em>.</p>

## Solution approach

### Intuition

The first element of a pre-order range is the root of that subtree. Finding the root in the in-order range splits it: everything to its left forms the left subtree and everything to its right forms the right subtree. The sizes of those two parts tell us which slice of the pre-order range belongs to each subtree, since pre-order lists the root, then the whole left subtree, then the whole right subtree.

### Algorithm

1. Copy both arrays into the members and call `createTree(0, n - 1, 0, n - 1)`, where `p1..p2` is the pre-order range and `n1..n2` the in-order range.
2. Return `NULL` for an empty range. Create `root` from `preorder[p1]`, and return it at once if the range has one element.
3. **Left subtree:** scan from `n1` until `inorder[nn2]` equals the root, then step back one. The left in-order range is `nn1..nn2`, and the left pre-order range is `p1 + 1` to `p1 + (nn2 - nn1) + 1`.
4. **Right subtree:** scan from `n2` backwards until the root is found, then step forward one. The right in-order range is `nn1..n2`, and the right pre-order range ends at `p2` and has the same length.
5. Build both subtrees recursively and return `root`.

### Complexity

- **Time:** $O(n^2)$ — the root is located with a linear scan of the in-order range, which costs $O(n^2)$ in total for a skewed tree ($O(n \log n)$ for a balanced one).
- **Space:** $O(n)$ — for the member copies of the arrays; the recursion stack adds $O(h)$.

## Code

```cpp title="C++"
class Solution {
    vector<int> preorder;
    vector<int> inorder;

   public:
    TreeNode* createTree(int p1, int p2, int n1, int n2) {
        if (p2 < p1 || n1 > n2) return NULL;
        TreeNode* root = new TreeNode(preorder[p1]);
        if (p1 == p2 || n1 == n2) return root;
        int pp1, pp2, nn1, nn2;

        nn1 = n1, nn2 = n1;
        while (inorder[nn2] != preorder[p1]) {
            nn2++;
        }
        nn2--;
        pp1 = p1 + 1;
        pp2 = p1 + (nn2 - nn1) + 1;

        root->left = createTree(pp1, pp2, nn1, nn2);

        nn2 = n2;
        nn1 = n2;
        while (inorder[nn1] != preorder[p1]) nn1--;
        nn1++;
        pp2 = p2;
        pp1 = pp2 - (nn2 - nn1);
        root->right = createTree(pp1, pp2, nn1, nn2);
        return root;
    }

    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        this->preorder = preorder;
        this->inorder = inorder;
        int n = preorder.size();
        return createTree(0, n - 1, 0, n - 1);
    }
};

```
