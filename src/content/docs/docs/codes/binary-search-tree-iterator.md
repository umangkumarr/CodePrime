---
title: "Binary Search Tree Iterator"
description: "Iterate over a BST in sorted order with O(h) memory and amortised O(1) next() by keeping the unvisited left spine on an explicit stack."
source: "https://leetcode.com/problems/binary-search-tree-iterator/"
difficulty: "Medium"
tags: ["Stack", "Tree", "Design", "Binary Search Tree", "Binary Tree", "Iterator"]
complexity:
  time: "O(1)"
  space: "O(h)"
---

## Problem

Implement the `BSTIterator` class that represents an iterator over the **[in-order traversal](https://en.wikipedia.org/wiki/Tree_traversal#In-order_(LNR))** of a binary search tree (BST):

- `BSTIterator(TreeNode root)` Initializes an object of the `BSTIterator` class. The `root` of the BST is given as part of the constructor. The pointer should be initialized to a non-existent number smaller than any element in the BST.
- `boolean hasNext()` Returns `true` if there exists a number in the traversal to the right of the pointer, otherwise returns `false`.
- `int next()` Moves the pointer to the right, then returns the number at the pointer.

Notice that by initializing the pointer to a non-existent smallest number, the first call to `next()` will return the smallest element in the BST.

You may assume that `next()` calls will always be valid. That is, there will be at least a next number in the in-order traversal when `next()` is called.

**Example 1:**

![BST with root 7, left child 3, right child 15; 15 has children 9 and 20](https://assets.leetcode.com/uploads/2018/12/25/bst-tree.png)

```text
Input
["BSTIterator", "next", "next", "hasNext", "next", "hasNext", "next", "hasNext", "next", "hasNext"]
[[[7, 3, 15, null, null, 9, 20]], [], [], [], [], [], [], [], [], []]
Output
[null, 3, 7, true, 9, true, 15, true, 20, false]

Explanation
BSTIterator bSTIterator = new BSTIterator([7, 3, 15, null, null, 9, 20]);
bSTIterator.next();    // return 3
bSTIterator.next();    // return 7
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 9
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 15
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 20
bSTIterator.hasNext(); // return False
```

**Constraints:**

- The number of nodes in the tree is in the range $[1, 10^5]$.
- $0 \le$ `Node.val` $\le 10^6$
- At most $10^5$ calls will be made to `hasNext`, and `next`.

**Follow-up:** Could you implement `next()` and `hasNext()` to run in average $O(1)$ time and use $O(h)$ memory, where $h$ is the height of the tree?

## Solution approach

### Intuition

Copying the whole in-order sequence into an array in the constructor would make `next()` trivial, but it uses $O(n)$ memory. The follow-up asks for $O(h)$, so we must produce the sequence **lazily**: run the iterative in-order traversal, but pause it after each value.

In an iterative in-order traversal, the stack holds exactly the nodes whose left subtree is being (or has been) explored but which have not been output yet. That is the **left spine** of the remaining part of the tree:

- The smallest unvisited node is always on top of the stack.
- After outputting a node, its in-order successor is the leftmost node of its right subtree (if it has one), so we push the left spine of `node->right`. Otherwise the successor is the next node on the stack, an ancestor whose left subtree we have just finished.

The stack never holds more than one node per level, so its size is at most $h$.

### Algorithm

1. `pushLeft(node)` pushes `node`, `node->left`, `node->left->left`, … until it reaches `nullptr`.
2. The constructor calls `pushLeft(root)`.
3. `next()` pops the top node `node`, calls `pushLeft(node->right)`, and returns `node->val`.
4. `hasNext()` returns whether the stack is non-empty.

### Walkthrough

Example 1 (tree `[7, 3, 15, null, null, 9, 20]`), stack shown bottom to top:

| Call | Popped | Pushed (`pushLeft`) | Stack after | Returns |
| --- | --- | --- | --- | --- |
| constructor | — | `7, 3` | `[7, 3]` | — |
| `next()` | `3` | — | `[7]` | `3` |
| `next()` | `7` | `15, 9` | `[15, 9]` | `7` |
| `next()` | `9` | — | `[15]` | `9` |
| `next()` | `15` | `20` | `[20]` | `15` |
| `next()` | `20` | — | `[]` | `20` |
| `hasNext()` | — | — | `[]` | `false` |

### Complexity

- **Time:** $O(1)$ amortised per call — `hasNext()` is $O(1)$; `next()` can push up to $h$ nodes once, but every node is pushed and popped exactly once over the whole iteration, so $n$ calls cost $O(n)$ in total.
- **Space:** $O(h)$ — the stack holds at most one node per level.

### Edge cases

- **Single node:** the constructor pushes it, the first `next()` returns it, and `hasNext()` then returns `false`.
- **Skewed tree** (a left chain): the constructor pushes all $h = n$ nodes; each `next()` is then a single pop, matching the $O(h)$ memory bound.

## Code

```cpp title="C++"
class BSTIterator {
    stack<TreeNode*> st;

    void pushLeft(TreeNode* node) {
        for (; node; node = node->left) st.push(node);
    }

   public:
    BSTIterator(TreeNode* root) { pushLeft(root); }

    int next() {
        TreeNode* node = st.top();
        st.pop();
        pushLeft(node->right);
        return node->val;
    }

    bool hasNext() { return !st.empty(); }
};
```
