---
title: "Flatten Binary Tree to Linked List"
description: "Flatten a binary tree in place into a pre-order right-pointer list with O(1) extra space, splicing each left subtree in front of the right (Morris-style)."
source: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/"
difficulty: "Medium"
tags: ["Linked List", "Stack", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given the `root` of a binary tree, flatten the tree into a "linked list":

- The "linked list" should use the same `TreeNode` class where the `right` child pointer points to the next node in the list and the `left` child pointer is always `null`.
- The "linked list" should be in the same order as a [**pre-order traversal**](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR) of the binary tree.

**Example 1:**

![Example 1](https://assets.leetcode.com/uploads/2021/01/14/flaten.jpg)

```text
Input:  root = [1,2,5,3,4,null,6]
Output: [1,null,2,null,3,null,4,null,5,null,6]
```

**Example 2:**

```text
Input:  root = []
Output: []
```

**Example 3:**

```text
Input:  root = [0]
Output: [0]
```

**Constraints:**

- The number of nodes in the tree is in the range `[0, 2000]`.
- $-100 \le$ `Node.val` $\le 100$

**Follow-up:** Can you flatten the tree in-place (with `O(1)` extra space)?

## Solution approach

### Intuition

Pre-order visits a node, then its whole left subtree, then its right subtree. Inside the left subtree, the **last** node in pre-order is its **rightmost** node (keep going right until there is no right child). So for a node `curr` with a left child, the right subtree must come right after that rightmost node.

That gives a local rewiring that keeps pre-order intact: hang `curr->right` off the rightmost node of the left subtree, then move the left subtree into `curr->right` and clear `curr->left`. Now `curr` has no left child, and the pre-order of the tree is unchanged. Repeating this at every node while walking down the `right` pointers flattens the tree using only a couple of pointers, which answers the follow-up (the same idea as a Morris traversal). A recursive or stack-based DFS would need $O(h)$ extra space instead.

### Algorithm

1. Set `curr = root`.
2. While `curr` is not `nullptr`:
   - If `curr->left` exists, find its rightmost node `pre` by following `right` pointers from `curr->left`.
   - Set `pre->right = curr->right`, then `curr->right = curr->left` and `curr->left = nullptr`.
   - Move to `curr = curr->right`.
3. Every node now has `left == nullptr`, and the `right` pointers follow pre-order.

### Walkthrough

Example 1. At `curr = 1`, the left subtree is rooted at `2` and its rightmost node is `4`. The right subtree `5 → 6` is hung off `4`, and the subtree at `2` moves to `1`'s right (dashed edges are the new links):

[![Example 1 at curr = 1: new right link from 1 to 2; 2 keeps left child 3 and right child 4, which is pre; new right link from 4 to 5; 5 links right to 6](/img/codes/flatten-binary-tree-to-linked-list/first-splice.png)](/img/codes/flatten-binary-tree-to-linked-list/first-splice.png)

Next `curr = 2`: its left child `3` has no right child, so `pre = 3`; `3->right = 4`, `2->right = 3`. The remaining nodes have no left children, and the list reads `1 → 2 → 3 → 4 → 5 → 6`.

### Complexity

- **Time:** $O(n)$ — `curr` visits each node once. A search for `pre` walks right-edges on the right spine of `curr`'s left subtree. After the splice, every node on that spine has all its ancestors reaching it through right-edges, so it is never again inside some node's **left** subtree and its edge is never walked by a later search. Hence all searches together walk each edge at most once.
- **Space:** $O(1)$ — only `curr` and `pre`; no recursion and no new nodes.

### Edge cases

- **Empty tree** (Example 2): `curr` starts as `nullptr`, so the loop does nothing.
- **Single node** (Example 3) or an already flat tree with only right children: no node has a left child, so `curr` simply walks the chain.
- **Only left children** (a left-leaning path): at each node `pre` is the single left child, and the chain is turned to the right one node at a time.

## Code

```cpp
class Solution {
   public:
    void flatten(TreeNode* root) {
        for (TreeNode* curr = root; curr; curr = curr->right) {
            if (!curr->left) continue;
            TreeNode* pre = curr->left;  // last node of the left subtree in pre-order
            while (pre->right) pre = pre->right;
            pre->right = curr->right;
            curr->right = curr->left;
            curr->left = nullptr;
        }
    }
};
```

```java
class Solution {
    public void flatten(TreeNode root) {
        for (TreeNode curr = root; curr != null; curr = curr.right) {
            if (curr.left == null) continue;
            TreeNode pre = curr.left;  // last node of the left subtree in pre-order
            while (pre.right != null) pre = pre.right;
            pre.right = curr.right;
            curr.right = curr.left;
            curr.left = null;
        }
    }
}
```

```python
class Solution:
    def flatten(self, root: TreeNode | None) -> None:
        """
        Do not return anything, modify root in-place instead.
        """
        curr = root
        while curr:
            if curr.left:
                pre = curr.left  # last node of the left subtree in pre-order
                while pre.right:
                    pre = pre.right
                pre.right = curr.right
                curr.right = curr.left
                curr.left = None
            curr = curr.right
```
