---
title: "Populating Next Right Pointers in Each Node"
description: "Link every node of a perfect binary tree to its right neighbour on the same level in O(1) extra space, using the next pointers of the level above."
source: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/"
difficulty: "Medium"
tags: ["Linked List", "Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

You are given a **perfect binary tree** where all leaves are on the same level, and every parent has two children. The binary tree has the following definition:

```text
struct Node {
  int val;
  Node *left;
  Node *right;
  Node *next;
}
```

Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to `NULL`.

Initially, all next pointers are set to `NULL`.

**Example 1:**

![Figure A: the perfect binary tree; Figure B: the same tree with next pointers linking each level](https://assets.leetcode.com/uploads/2019/02/14/116_sample.png)

```text
Input:  root = [1,2,3,4,5,6,7]
Output: [1,#,2,3,#,4,5,6,7,#]
Explanation: Given the above perfect binary tree (Figure A), your function should populate each next pointer to point to its next right node, just like in Figure B. The serialized output is in level order as connected by the next pointers, with '#' signifying the end of each level.
```

**Example 2:**

```text
Input:  root = []
Output: []
```

**Constraints:**

- The number of nodes in the tree is in the range $[0, 2^{12} - 1]$.
- $-1000 \le$ `Node.val` $\le 1000$

**Follow-up:**

- You may only use constant extra space.
- The recursive approach is fine. You may assume implicit stack space does not count as extra space for this problem.

## Solution approach

### Intuition

A level-order BFS with a queue links each level easily, but the queue holds up to $n/2$ nodes, which breaks the constant-space follow-up.

The trick is that once a level is linked, it **is** a linked list we can walk from left to right without any queue. While walking level `d` we can link level `d + 1`, because in a perfect tree there are only two kinds of next pointers on the child level:

1. **Siblings:** `node->left->next = node->right` — both children of the same parent.
2. **Cousins across parents:** `node->right->next = node->next->left` — the right child of `node` is followed by the left child of the parent's right neighbour, which `node->next` already gives us.

Every node on the child level is the left or right child of exactly one parent, so these two rules set every next pointer on that level. The rightmost node of each level never gets assigned and keeps its initial `NULL`.

### Algorithm

1. If `root` is null, return it.
2. Let `leftmost = root`. While `leftmost->left` exists (the level below is not empty):
   - Walk `node` from `leftmost` along `next`:
     - `node->left->next = node->right`;
     - if `node->next` exists, `node->right->next = node->next->left`.
   - Move down: `leftmost = leftmost->left`.
3. Return `root`.

### Walkthrough

Example 1 after `connect`; dashed arrows are next pointers. Walking the root's level sets `2 → 3`. Walking the list `2 → 3` then sets `4 → 5` and `6 → 7` (siblings) and `5 → 6`, the cousin link `node->right->next = node->next->left` with `node = 2` (orange):

[![Perfect tree 1 to 7 after connect, with dashed next pointers 2 to 3, 4 to 5, 5 to 6 (the cousin link, nodes 5 and 6 in orange) and 6 to 7](/img/codes/populating-next-right-pointers-in-each-node/next-pointers.png)](/img/codes/populating-next-right-pointers-in-each-node/next-pointers.png)

### Complexity

- **Time:** $O(n)$ — every node is visited once as `node`, doing $O(1)$ work.
- **Space:** $O(1)$ — only the pointers `leftmost` and `node`; no queue and no recursion.

### Edge cases

- **Empty tree** (Example 2): returns `nullptr` immediately.
- **Single node:** `root->left` is null, so the loop does not run and `root->next` stays `NULL`.
- **Rightmost node of a level:** `node->next` is null, so its right child's `next` is left as `NULL`, as required.

## Code

```cpp
class Solution {
   public:
    Node* connect(Node* root) {
        if (!root) return root;
        for (Node* leftmost = root; leftmost->left; leftmost = leftmost->left) {
            for (Node* node = leftmost; node; node = node->next) {
                node->left->next = node->right;
                if (node->next) node->right->next = node->next->left;
            }
        }
        return root;
    }
};
```

```java
class Solution {
    public Node connect(Node root) {
        if (root == null) return root;
        for (Node leftmost = root; leftmost.left != null; leftmost = leftmost.left) {
            for (Node node = leftmost; node != null; node = node.next) {
                node.left.next = node.right;
                if (node.next != null) node.right.next = node.next.left;
            }
        }
        return root;
    }
}
```

```python
class Solution:
    def connect(self, root: 'Optional[Node]') -> 'Optional[Node]':
        if not root:
            return root
        leftmost = root
        while leftmost.left:
            node = leftmost
            while node:
                node.left.next = node.right
                if node.next:
                    node.right.next = node.next.left
                node = node.next
            leftmost = leftmost.left
        return root
```
