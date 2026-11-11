---
title: "Lowest Common Ancestor of a Binary Tree"
description: "Find the lowest common ancestor of two nodes in a binary tree with one post-order DFS that reports which subtrees contain p or q."
source: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/"
difficulty: "Medium"
tags: ["Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

According to the [definition of LCA on Wikipedia](https://en.wikipedia.org/wiki/Lowest_common_ancestor): "The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow **a node to be a descendant of itself**)."

**Example 1:**

![Binary tree [3,5,1,6,2,0,8,null,null,7,4]](https://assets.leetcode.com/uploads/2018/12/14/binarytree.png)

```text
Input:  root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
Output: 3
Explanation: The LCA of nodes 5 and 1 is 3.
```

**Example 2:**

![Binary tree [3,5,1,6,2,0,8,null,null,7,4]](https://assets.leetcode.com/uploads/2018/12/14/binarytree.png)

```text
Input:  root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
Output: 5
Explanation: The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself according to the LCA definition.
```

**Example 3:**

```text
Input:  root = [1,2], p = 1, q = 2
Output: 1
```

**Constraints:**

- The number of nodes in the tree is in the range $[2, 10^5]$.
- $-10^9 \le$ `Node.val` $\le 10^9$
- All `Node.val` are **unique**.
- `p != q`
- `p` and `q` will exist in the tree.

## Solution approach

### Intuition

Unlike a BST, the values tell us nothing about where `p` and `q` are, so we have to search. Let the recursive call on a subtree return:

- `p` or `q` if that node is found in the subtree (whichever is met first going down),
- the LCA if **both** are in the subtree,
- `nullptr` if neither is.

Combine the answers bottom-up (post-order). At a node `root`:

- If `root` is `p` or `q`, return it. If the other target is below it, `root` is still the LCA (a node is a descendant of itself), and if the other target is elsewhere, an ancestor will notice.
- If the left subtree and the right subtree both return non-null, `p` is on one side and `q` on the other. `root` is the lowest node joining them — the LCA.
- If only one side returns non-null, pass that result up: it is either one target (the other is not below `root`) or an LCA already found deeper.

### Algorithm

1. If `root` is `nullptr`, `p` or `q`, return `root`.
2. `left = lowestCommonAncestor(root->left, p, q)`, `right = lowestCommonAncestor(root->right, p, q)`.
3. If both are non-null, return `root`; otherwise return whichever is non-null (or `nullptr`).

### Walkthrough

Example 1 (`p = 5`, `q = 1`). Each edge is labelled with what the child returns to its parent:

[![Example 1 tree: nodes 5 and 1 return themselves to root 3, which is the LCA; their subtrees are not searched](/img/codes/lowest-common-ancestor-of-a-binary-tree/returns.png)](/img/codes/lowest-common-ancestor-of-a-binary-tree/returns.png)

The calls on `5` and `1` return immediately because those nodes are targets (grey subtrees are never explored). At `3` both sides are non-null, so `3` is the LCA. In Example 2 (`q = 4` inside the subtree of `5`), the call on `5` again returns `5` straight away and the right side returns `nullptr`, so `5` is passed up as the answer.

### Complexity

- **Time:** $O(n)$ — each node is visited at most once.
- **Space:** $O(h)$ — the recursion stack, where `h` is the height of the tree ($O(n)$ for a skewed tree).

### Edge cases

- **One target is an ancestor of the other** (Examples 2 and 3): the search stops at the upper target and returns it, which is the correct LCA.
- **Targets are compared by pointer**, not value, so the code relies only on `p` and `q` being nodes of this tree.

## Code

```cpp
class Solution {
   public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root || root == p || root == q) return root;
        TreeNode* left = lowestCommonAncestor(root->left, p, q);
        TreeNode* right = lowestCommonAncestor(root->right, p, q);
        if (left && right) return root;  // p and q are on different sides
        return left ? left : right;
    }
};
```

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;  // p and q are on different sides
        return left != null ? left : right;
    }
}
```

```python
class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        # The same post-order recursion, run on an explicit stack (the tree can be 10^5 levels deep).
        found = {}  # node -> what the recursive call on it returns (None when neither target is below)
        stack = [(root, False)]
        while stack:
            node, children_done = stack.pop()
            if node is p or node is q:
                found[node] = node
            elif children_done:
                left = found.pop(node.left, None)
                right = found.pop(node.right, None)
                found[node] = node if left and right else left or right  # both sides -> node is the LCA
            else:
                stack.append((node, True))
                for child in (node.left, node.right):
                    if child:
                        stack.append((child, False))
        return found[root]
```
