---
title: "Construct Binary Tree from Preorder and Inorder Traversal"
description: "Rebuild a binary tree from its preorder and inorder traversals in linear time: the first preorder value is the root, and a hash map finds it in inorder to split the subtrees."
source: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"
difficulty: "Medium"
tags: ["Array", "Hash Table", "Divide and Conquer", "Tree", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given two integer arrays `preorder` and `inorder` where `preorder` is the preorder traversal of a binary tree and `inorder` is the inorder traversal of the same tree, construct and return *the binary tree*.

**Example 1:**

![Tree with root 3, left child 9, right child 20 whose children are 15 and 7](https://assets.leetcode.com/uploads/2021/02/19/tree.jpg)

```text
Input:  preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]
```

**Example 2:**

```text
Input:  preorder = [-1], inorder = [-1]
Output: [-1]
```

**Constraints:**

- $1 \le$ `preorder.length` $\le 3000$
- `inorder.length == preorder.length`
- $-3000 \le$ `preorder[i]`, `inorder[i]` $\le 3000$
- `preorder` and `inorder` consist of **unique** values.
- Each value of `inorder` also appears in `preorder`.
- `preorder` is **guaranteed** to be the preorder traversal of the tree.
- `inorder` is **guaranteed** to be the inorder traversal of the tree.

## Solution approach

### Intuition

Both traversals lay out every subtree as a **contiguous block**, in different arrangements:

- **preorder** = `root [left subtree][right subtree]` — the root of any block is its **first** element;
- **inorder** = `[left subtree] root [right subtree]` — once the root is known, its position `mid` splits the block into the two subtrees and gives their sizes.

So: take the root from the front of the preorder block, find it in inorder, and recurse on both halves. The left subtree has `leftSize = mid - inLo` nodes, so in preorder it starts right after the root, and the right subtree starts `leftSize` positions later.

Searching inorder linearly for the root costs $O(n)$ per node, $O(n^2)$ overall on a skewed tree. Because all values are unique, a hash map from value to inorder index makes every lookup $O(1)$.

### Algorithm

1. Build `pos`, mapping each `inorder[i]` to `i`.
2. Call `build(preorder, 0, 0, n - 1, pos)`, where the arguments are `preStart` (index of the block's first preorder element) and the inorder range `[inLo, inHi]`.
3. In `build`:
   - If `inLo > inHi`, the block is empty: return null.
   - Create `root` from `preorder[preStart]` and let `mid = pos[root->val]`, `leftSize = mid - inLo`.
   - `root->left = build(preorder, preStart + 1, inLo, mid - 1, pos)` — the left block starts right after the root.
   - `root->right = build(preorder, preStart + 1 + leftSize, mid + 1, inHi, pos)` — the right block starts after the left block.
   - Return `root`.

### Walkthrough

Example 1. Each step shows one call: blue is the root taken from the front of the preorder block and found in inorder; orange is its left block, purple its right block:

![Splitting preorder and inorder around each root for the tree 3, 9, 20, 15, 7](/img/codes/construct-binary-tree-from-preorder-and-inorder-traversal/split/01.webp)

### Complexity

- **Time:** $O(n)$ — building `pos` is $O(n)$, and each node is created by exactly one call doing $O(1)$ work (plus one empty call per missing child).
- **Space:** $O(n)$ — the hash map, plus a recursion stack of depth $O(h)$, which is $O(n)$ for a skewed tree.

### Edge cases

- **Single node** (Example 2): `mid = inLo = inHi`, so both child ranges are empty.
- **Skewed tree:** one side is always empty; depth reaches $3000$, which is fine for the recursion stack.
- **Negative values:** handled naturally, since `pos` is a hash map rather than an offset array.

## Code

```cpp
class Solution {
    TreeNode* build(const vector<int>& preorder, int preStart, int inLo, int inHi,
                    const unordered_map<int, int>& pos) {
        if (inLo > inHi) return nullptr;
        TreeNode* root = new TreeNode(preorder[preStart]);
        int mid = pos.at(root->val);
        int leftSize = mid - inLo;
        root->left = build(preorder, preStart + 1, inLo, mid - 1, pos);
        root->right = build(preorder, preStart + 1 + leftSize, mid + 1, inHi, pos);
        return root;
    }

   public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        int n = inorder.size();
        unordered_map<int, int> pos;
        for (int i = 0; i < n; i++) pos[inorder[i]] = i;
        return build(preorder, 0, 0, n - 1, pos);
    }
};
```

```java
class Solution {
    private TreeNode build(int[] preorder, int preStart, int inLo, int inHi, Map<Integer, Integer> pos) {
        if (inLo > inHi) return null;
        TreeNode root = new TreeNode(preorder[preStart]);
        int mid = pos.get(root.val);
        int leftSize = mid - inLo;
        root.left = build(preorder, preStart + 1, inLo, mid - 1, pos);
        root.right = build(preorder, preStart + 1 + leftSize, mid + 1, inHi, pos);
        return root;
    }

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        int n = inorder.length;
        Map<Integer, Integer> pos = new HashMap<>();
        for (int i = 0; i < n; i++) pos.put(inorder[i], i);
        return build(preorder, 0, 0, n - 1, pos);
    }
}
```

```python
class Solution:
    def buildTree(self, preorder: list[int], inorder: list[int]) -> TreeNode | None:
        pos = {val: i for i, val in enumerate(inorder)}
        dummy = TreeNode()
        # each task: build the subtree over inorder[in_lo..in_hi], whose root is
        # preorder[pre_start], and attach it as parent's left or right child
        stack = [(dummy, True, 0, 0, len(inorder) - 1)]
        while stack:
            parent, is_left, pre_start, in_lo, in_hi = stack.pop()
            if in_lo > in_hi:
                continue
            root = TreeNode(preorder[pre_start])
            if is_left:
                parent.left = root
            else:
                parent.right = root
            mid = pos[root.val]
            left_size = mid - in_lo
            stack.append((root, True, pre_start + 1, in_lo, mid - 1))
            stack.append((root, False, pre_start + 1 + left_size, mid + 1, in_hi))
        return dummy.left
```
