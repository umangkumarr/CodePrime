---
title: "Two Sum IV - Input is a BST"
description: "Decide whether two nodes of a binary search tree sum to k, using two pointers over the sorted order via forward and reverse BST iterators."
source: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/"
difficulty: "Easy"
tags: ["Hash Table", "Two Pointers", "Tree", "Depth-First Search", "Breadth-First Search", "Binary Search Tree", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

Given the `root` of a binary search tree and an integer `k`, return `true` _if there exist two elements in the BST such that their sum is equal to_ `k`, _or_ `false` _otherwise_.

**Example 1:**

![BST [5,3,6,2,4,null,7]](https://assets.leetcode.com/uploads/2020/09/21/sum_tree_1.jpg)

```text
Input:  root = [5,3,6,2,4,null,7], k = 9
Output: true
```

**Example 2:**

![BST [5,3,6,2,4,null,7]](https://assets.leetcode.com/uploads/2020/09/21/sum_tree_2.jpg)

```text
Input:  root = [5,3,6,2,4,null,7], k = 28
Output: false
```

**Constraints:**

- The number of nodes in the tree is in the range $[1, 10^4]$.
- $-10^4 \le$ `Node.val` $\le 10^4$
- `root` is guaranteed to be a **valid** binary search tree.
- $-10^5 \le k \le 10^5$

## Solution approach

### Intuition

A hash set of seen values solves this for **any** tree in $O(n)$ time and $O(n)$ space. A BST gives us more: its inorder traversal is **sorted**, and on a sorted array Two Sum is solved by two pointers — one at the smallest value, one at the largest. If their sum is too small, the smallest value cannot pair with anything (the largest partner is already too small), so move the low pointer up; if the sum is too big, move the high pointer down.

We do not need to copy the inorder sequence into an array. A **BST iterator** produces the next inorder value lazily with a stack holding one root-to-node path: push a node and its whole chain of left children; to advance, pop a node and push the left chain of its right child. The mirror image (right chains, then the left child) yields values in **descending** order. Running one of each gives the two pointers using only $O(h)$ memory.

Values in a valid BST are distinct, so the two iterators reach the same node exactly when the pointers meet, and we stop there — a node may not be paired with itself.

### Algorithm

1. `pushSpine(st, node, leftward)` pushes `node`, then keeps following `left` (or `right` when `leftward` is `false`) pushing every node, until null.
2. Initialise `lo` with `pushSpine(lo, root, true)` (top = smallest) and `hi` with `pushSpine(hi, root, false)` (top = largest).
3. While `lo.top() != hi.top()`:
   - Let `sum = lo.top()->val + hi.top()->val`. If `sum == k`, return `true`.
   - If `sum < k`, advance `lo`: pop `node` and `pushSpine(lo, node->right, true)`.
   - Otherwise advance `hi`: pop `node` and `pushSpine(hi, node->left, false)`.
4. Return `false`.

### Walkthrough

Example 2, `k = 28`, inorder values `2 3 4 5 6 7`:

| `lo.top()` | `hi.top()` | sum | move |
| --- | --- | --- | --- |
| 2 | 7 | 9 | `9 < 28`, advance `lo` |
| 3 | 7 | 10 | advance `lo` |
| 4 | 7 | 11 | advance `lo` |
| 5 | 7 | 12 | advance `lo` |
| 6 | 7 | 13 | advance `lo` |
| 7 | 7 | — | same node, stop: `false` |

In Example 1 the very first pair already gives `2 + 7 = 9`.

### Complexity

- **Time:** $O(n)$ — each node is pushed and popped at most once per iterator.
- **Space:** $O(h)$ — each stack holds one path from the root, where $h$ is the tree height ($O(\log n)$ when balanced, $O(n)$ when skewed).

### Edge cases

- **Single node:** both stacks start with the root on top, so the loop does not run and the answer is `false`.
- **`k` equal to twice a value** (e.g. `k = 10` with a node `5`): the loop stops when both iterators sit on that node, so it is never paired with itself.

## Code

```cpp title="C++"
class Solution {
    // Pushes node and its chain of left (or right) children.
    void pushSpine(stack<TreeNode*>& st, TreeNode* node, bool leftward) {
        while (node) {
            st.push(node);
            node = leftward ? node->left : node->right;
        }
    }

   public:
    bool findTarget(TreeNode* root, int k) {
        stack<TreeNode*> lo, hi;  // lo yields ascending values, hi descending
        pushSpine(lo, root, true);
        pushSpine(hi, root, false);

        while (lo.top() != hi.top()) {
            int sum = lo.top()->val + hi.top()->val;
            if (sum == k) return true;
            if (sum < k) {
                TreeNode* node = lo.top();
                lo.pop();
                pushSpine(lo, node->right, true);
            } else {
                TreeNode* node = hi.top();
                hi.pop();
                pushSpine(hi, node->left, false);
            }
        }
        return false;
    }
};
```
