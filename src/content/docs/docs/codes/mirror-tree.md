---
title: "Mirror Tree"
description: "Convert a binary tree into its mirror in place by swapping the left and right children of every node with a recursive traversal."
source: "https://www.geeksforgeeks.org/problems/mirror-tree/1"
difficulty: "Easy"
tags: ["Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

Given a binary tree, modify it so that it becomes its mirror. Mirror of a Binary Tree is obtained by interchanging left and right children of all non-leaf nodes.

**Note:** Changes should be done in-place and need not to return anything.

Complete the function `mirror()`, which takes the `root` of the tree and converts the tree into its mirror in place.

**Example 1:**

![The tree 1(2, 3(4, N)) and its mirror 1(3(N, 4), 2)](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/700155/Web/Other/blobid0_1785585835.png)

```text
Input:  root = [1, 2, 3, N, N, 4]
Output: [1, 3, 2, N, 4]
Explanation: In the inverted tree, every non-leaf node has its left and right child interchanged.
```

**Example 2:**

![The tree 1(2(4, 5), 3) and its mirror 1(3, 2(5, 4))](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/700155/Web/Other/blobid1_1785585855.png)

```text
Input:  root = [1, 2, 3, 4, 5]
Output: [1, 3, 2, N, N, 5, 4]
Explanation: In the inverted tree, every non-leaf node has its left and right child interchanged.
```

**Constraints:**

- $1 \le \text{size of binary tree} \le 10^4$
- $1 \le \text{Node.data} \le 10^5$

## Solution approach

### Intuition

Reflecting a tree in a vertical mirror does two things at the root: the left and right subtrees trade places, and each of them is itself reflected. That is a recursive definition:

$$
\text{mirror}(\text{node}) = \text{node with left} = \text{mirror(old right)},\ \text{right} = \text{mirror(old left)}.
$$

So it is enough to swap the two child pointers of a node and then mirror both children. Every node's swap is independent of the others, so the order of the visits (pre-order, post-order, or level order) does not matter — what matters is that **every** node is swapped exactly once. Leaves (and `nullptr` children) swap to themselves, which is harmless.

### Algorithm

1. If `root` is `nullptr`, return.
2. `swap(root->left, root->right)`.
3. Recurse into `mirror(root->left)` and `mirror(root->right)`.

### Complexity

- **Time:** $O(n)$ — each node is visited once and does $O(1)$ work.
- **Space:** $O(h)$ — the recursion stack, where `h` is the height of the tree: $O(\log n)$ when balanced, $O(n)$ for a skewed tree (at most $10^4$ frames here, which is safe). A queue-based level-order version would avoid recursion but uses $O(w)$ space for the widest level instead.

### Edge cases

- **Single node:** its two `nullptr` children are swapped and nothing else changes.
- **Skewed tree** (every node has only a left child): it becomes right-skewed; recursion depth equals the number of nodes.
- **Nodes with one child** (Example 1, node `3`): the child simply moves to the other side.

## Code

```cpp title="C++"
class Solution {
   public:
    void mirror(Node* root) {
        if (!root) return;
        swap(root->left, root->right);
        mirror(root->left);
        mirror(root->right);
    }
};
```
