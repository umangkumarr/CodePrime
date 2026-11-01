---
title: "Binary Search Tree Iterator"
description: "Implement the BSTIterator class that represents an iterator over the in-order traversal of a binary search tree (BST): BSTIterator(TreeNode root)…"
source: "https://leetcode.com/problems/binary-search-tree-iterator/"
tags: ["Stack", "Tree", "Design", "Binary Search Tree", "Binary Tree", "Iterator"]
complexity:
  time: "O(1)"
  space: "O(h)"
---

## Problem

<p>Implement the <code>BSTIterator</code> class that represents an iterator over the <strong><a href="https://en.wikipedia.org/wiki/Tree_traversal#In-order_(LNR)" target="_blank">in-order traversal</a></strong> of a binary search tree (BST):</p>

<ul>
	<li><code>BSTIterator(TreeNode root)</code> Initializes an object of the <code>BSTIterator</code> class. The <code>root</code> of the BST is given as part of the constructor. The pointer should be initialized to a non-existent number smaller than any element in the BST.</li>
	<li><code>boolean hasNext()</code> Returns <code>true</code> if there exists a number in the traversal to the right of the pointer, otherwise returns <code>false</code>.</li>
	<li><code>int next()</code> Moves the pointer to the right, then returns the number at the pointer.</li>
</ul>

<p>Notice that by initializing the pointer to a non-existent smallest number, the first call to <code>next()</code> will return the smallest element in the BST.</p>

<p>You may assume that <code>next()</code> calls will always be valid. That is, there will be at least a next number in the in-order traversal when <code>next()</code> is called.</p>

## Solution approach

### Intuition

An in-order traversal of a BST visits the values in sorted order. Instead of storing the whole traversal up front, the iterator keeps an explicit **stack of the nodes still waiting to be visited**, exactly like an iterative in-order traversal paused between steps.

The top of the stack is always the next smallest value. After it is returned, the next values come from its right subtree, starting at that subtree's leftmost node.

### Algorithm

1. The constructor calls `pushAll(root)`, which pushes `root` and then keeps moving to `node->left`, pushing every node on the way.
2. `hasNext()` returns whether `myStack` is non-empty.
3. `next()` pops the top node `tmpNode`, calls `pushAll(tmpNode->right)` to load the leftmost path of its right subtree, and returns `tmpNode->val`.

### Complexity

- **Time:** $O(1)$ amortized per call — each node is pushed and popped exactly once, so $n$ calls to `next()` cost $O(n)$ in total, though a single call can take $O(h)$.
- **Space:** $O(h)$ — the stack holds at most one root-to-leaf path.

## Code

```cpp title="C++"
class BSTIterator {
    stack<TreeNode *> myStack;

   public:
    BSTIterator(TreeNode *root) { pushAll(root); }

    bool hasNext() { return !myStack.empty(); }

    int next() {
        TreeNode *tmpNode = myStack.top();
        myStack.pop();
        pushAll(tmpNode->right);
        return tmpNode->val;
    }

   private:
    void pushAll(TreeNode *node) {
        for (; node != NULL; myStack.push(node), node = node->left)
            ;
    }
};

```
