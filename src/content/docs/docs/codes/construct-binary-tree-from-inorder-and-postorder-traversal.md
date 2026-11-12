---
title: "Construct Binary Tree from Inorder and Postorder Traversal"
description: "Rebuild a binary tree from inorder and postorder in O(n): the last postorder value is the root, and a hash map finds it in inorder to split the subtrees."
source: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/"
difficulty: "Medium"
tags: ["Array", "Hash Table", "Divide and Conquer", "Tree", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given two integer arrays `inorder` and `postorder` where `inorder` is the inorder traversal of a binary tree and `postorder` is the postorder traversal of the same tree, construct and return *the binary tree*.

**Example 1:**

![Tree with root 3, left child 9, right child 20 whose children are 15 and 7](https://assets.leetcode.com/uploads/2021/02/19/tree.jpg)

```text
Input:  inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
Output: [3,9,20,null,null,15,7]
```

**Example 2:**

```text
Input:  inorder = [-1], postorder = [-1]
Output: [-1]
```

**Constraints:**

- $1 \le$ `inorder.length` $\le 3000$
- `postorder.length == inorder.length`
- $-3000 \le$ `inorder[i]`, `postorder[i]` $\le 3000$
- `inorder` and `postorder` consist of **unique** values.
- Each value of `postorder` also appears in `inorder`.
- `inorder` is **guaranteed** to be the inorder traversal of the tree.
- `postorder` is **guaranteed** to be the postorder traversal of the tree.

## Solution approach

### Intuition

The two traversals lay out every subtree as a **contiguous block**, in different arrangements:

- **postorder** = `[left subtree][right subtree] root` — the root of any block is its **last** element;
- **inorder** = `[left subtree] root [right subtree]` — once the root is known, its position `mid` splits the block into the two subtrees, and tells us their sizes.

So: take the root from the end of the postorder block, find it in inorder, and recurse on the two halves. The right subtree has `rightSize = inHi - mid` nodes, so in postorder it occupies the `rightSize` positions just before the root, and the left subtree ends just before that.

Searching inorder linearly for the root costs $O(n)$ per node and $O(n^2)$ overall on a skewed tree. Because all values are unique, a hash map from value to inorder index makes every lookup $O(1)$.

### Algorithm

1. Build `pos`, mapping each `inorder[i]` to `i`.
2. Call `build(postorder, n - 1, 0, n - 1, pos)`, where the arguments are `postEnd` (index of the block's last postorder element) and the inorder range `[inLo, inHi]`.
3. In `build`:
   - If `inLo > inHi`, the block is empty: return null.
   - Create `root` from `postorder[postEnd]` and let `mid = pos[root->val]`, `rightSize = inHi - mid`.
   - `root->right = build(postorder, postEnd - 1, mid + 1, inHi, pos)` — the right block ends just before the root.
   - `root->left = build(postorder, postEnd - 1 - rightSize, inLo, mid - 1, pos)` — the left block ends just before the right block.
   - Return `root`.

### Walkthrough

Example 1. Each step shows one call: blue is the root taken from the end of the postorder block and found in inorder; orange is its left block, purple its right block:

![Splitting inorder and postorder around each root for the tree 3, 9, 20, 15, 7](/img/codes/construct-binary-tree-from-inorder-and-postorder-traversal/split/01.webp)

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
    TreeNode* build(const vector<int>& postorder, int postEnd, int inLo, int inHi,
                    const unordered_map<int, int>& pos) {
        if (inLo > inHi) return nullptr;
        TreeNode* root = new TreeNode(postorder[postEnd]);
        int mid = pos.at(root->val);
        int rightSize = inHi - mid;
        root->right = build(postorder, postEnd - 1, mid + 1, inHi, pos);
        root->left = build(postorder, postEnd - 1 - rightSize, inLo, mid - 1, pos);
        return root;
    }

   public:
    TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
        int n = inorder.size();
        unordered_map<int, int> pos;
        for (int i = 0; i < n; i++) pos[inorder[i]] = i;
        return build(postorder, n - 1, 0, n - 1, pos);
    }
};
```

```java
class Solution {
    private TreeNode build(int[] postorder, int postEnd, int inLo, int inHi, Map<Integer, Integer> pos) {
        if (inLo > inHi) return null;
        TreeNode root = new TreeNode(postorder[postEnd]);
        int mid = pos.get(root.val);
        int rightSize = inHi - mid;
        root.right = build(postorder, postEnd - 1, mid + 1, inHi, pos);
        root.left = build(postorder, postEnd - 1 - rightSize, inLo, mid - 1, pos);
        return root;
    }

    public TreeNode buildTree(int[] inorder, int[] postorder) {
        int n = inorder.length;
        Map<Integer, Integer> pos = new HashMap<>();
        for (int i = 0; i < n; i++) pos.put(inorder[i], i);
        return build(postorder, n - 1, 0, n - 1, pos);
    }
}
```

```python
class Solution:
    def buildTree(self, inorder: list[int], postorder: list[int]) -> TreeNode | None:
        pos = {val: i for i, val in enumerate(inorder)}
        dummy = TreeNode()
        # each task: build the subtree over inorder[in_lo..in_hi], whose root is
        # postorder[post_end], and attach it as parent's left or right child
        stack = [(dummy, True, len(postorder) - 1, 0, len(inorder) - 1)]
        while stack:
            parent, is_left, post_end, in_lo, in_hi = stack.pop()
            if in_lo > in_hi:
                continue
            root = TreeNode(postorder[post_end])
            if is_left:
                parent.left = root
            else:
                parent.right = root
            mid = pos[root.val]
            right_size = in_hi - mid
            stack.append((root, False, post_end - 1, mid + 1, in_hi))
            stack.append((root, True, post_end - 1 - right_size, in_lo, mid - 1))
        return dummy.left
```
