---
title: "Construct Binary Tree from Inorder and Postorder Traversal"
description: "Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the…"
source: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/"
tags: ["Array", "Hash Table", "Divide and Conquer", "Tree", "Binary Tree"]
complexity:
  time: "O(n^2)"
  space: "O(n)"
---

## Problem

<p>Given two integer arrays <code>inorder</code> and <code>postorder</code> where <code>inorder</code> is the inorder traversal of a binary tree and <code>postorder</code> is the postorder traversal of the same tree, construct and return <em>the binary tree</em>.</p>

## Solution approach

### Intuition

The last element of a post-order range is the root of that subtree. Finding the root in the in-order range splits it: everything to its left forms the left subtree and everything to its right forms the right subtree. The sizes of those two parts tell us which slice of the post-order range belongs to each subtree, since post-order lists the whole left subtree, then the whole right subtree, then the root.

### Algorithm

1. Copy both arrays into the members and call `createTree(0, n - 1, 0, n - 1)`, where `p1..p2` is the post-order range and `n1..n2` the in-order range.
2. Return `NULL` for an empty range. Create `root` from `postorder[p2]`, and return it at once if the range has one element.
3. **Left subtree:** scan from `n1` until `inorder[nn2]` equals the root, then step back one. The left in-order range is `nn1..nn2`, and the left post-order range is `p1` to `p1 + (nn2 - nn1)`.
4. **Right subtree:** scan from `n2` backwards until the root is found, then step forward one. The right in-order range is `nn1..n2`, and the right post-order range ends at `p2 - 1` and has the same length.
5. Build both subtrees recursively and return `root`.

### Complexity

- **Time:** $O(n^2)$ — the root is located with a linear scan of the in-order range, which costs $O(n^2)$ in total for a skewed tree ($O(n \log n)$ for a balanced one).
- **Space:** $O(n)$ — for the member copies of the arrays; the recursion stack adds $O(h)$.

## Code

```cpp title="C++"
class Solution {
    vector<int> postorder;
    vector<int> inorder;

   public:
    TreeNode* createTree(int p1, int p2, int n1, int n2) {
        if (p2 < p1 || n1 > n2) return NULL;
        TreeNode* root = new TreeNode(postorder[p2]);
        if (p1 == p2 || n1 == n2) return root;
        int pp1, pp2, nn1, nn2;

        nn1 = n1, nn2 = n1;
        while (inorder[nn2] != postorder[p2]) {
            nn2++;
        }
        nn2--;
        pp1 = p1;
        pp2 = p1 + (nn2 - nn1);

        root->left = createTree(pp1, pp2, nn1, nn2);

        nn2 = n2;
        nn1 = n2;
        while (inorder[nn1] != postorder[p2]) nn1--;
        nn1++;
        pp2 = p2 - 1;
        pp1 = pp2 - (nn2 - nn1);
        root->right = createTree(pp1, pp2, nn1, nn2);
        return root;
    }

    TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
        this->postorder = postorder;
        this->inorder = inorder;
        int n = inorder.size();
        return createTree(0, n - 1, 0, n - 1);
    }
};

```
