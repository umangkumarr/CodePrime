---
title: "Tree Traversals"
description: "Return the inorder, preorder and postorder traversals of a binary tree in one iterative pass, using a single stack of (node, state) pairs."
source: "https://www.naukri.com/code360/problems/tree-traversals_981269"
difficulty: "Easy"
tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

You have been given a Binary Tree of **`N`** nodes, where the nodes have integer values.

Your task is to return the In-Order, Pre-Order, and Post-Order traversals of the given binary tree.

For example, for the given binary tree:

![Binary tree with root 1, children 3 and 4; 3 has children 5 and 2; 4 has children 7 and 6](https://files.codingninjas.in/tt1-6639.jpg)

```text
The Inorder traversal will be [5, 3, 2, 1, 7, 4, 6].
The Preorder traversal will be [1, 3, 5, 2, 4, 7, 6].
The Postorder traversal will be [5, 2, 3, 7, 6, 4, 1].
```

**Input format:** the tree is given in level order, values separated by single spaces, with `-1` for a null node. The first not-null node of the previous level is the parent of the first two nodes of the current level, the second not-null node is the parent of the next two, and so on. For example, `1 3 8 5 2 7 -1 -1 -1 -1 -1 -1 -1` is the tree with root `1`, children `3` and `8`, where `3` has children `5` and `2` and `8` has the left child `7`.

**Output format:** return a list of three lists — In-Order, Pre-Order, and Post-Order, in that order. You don't need to print anything; just implement the function `getTreeTraversal()`.

**Example 1:**

![Binary tree with root 1, left child 2, right child 3; 3 has a right child 6](https://files.codingninjas.in/tt3-6641.jpg)

```text
Input:  1 2 3 -1 -1 -1 6 -1 -1
Output: 2 1 3 6
        1 2 3 6
        2 6 3 1
Explanation: Inorder traversal of given tree = [2, 1, 3, 6]
Preorder traversal of given tree = [1, 2, 3, 6]
Postorder traversal of given tree = [2, 6, 3, 1]
```

**Example 2:**

![Binary tree with root 1, children 2 and 4; 2 has children 5 and 3](https://files.codingninjas.in/tt5-6643.jpg)

```text
Input:  1 2 4 5 3 -1 -1 -1 -1 -1 -1
Output: 5 2 3 1 4
        1 2 5 3 4
        5 3 2 4 1
Explanation: Inorder traversal of given tree = [5, 2, 3, 1, 4]
Preorder traversal of given tree = [1, 2, 5, 3, 4]
Postorder traversal of given tree = [5, 3, 2, 4, 1]
```

**Constraints:**

- $1 \le N \le 10^5$
- $0 \le$ `data` $\le 10^5$, where `data` is the value of a node.
- Time limit: 1 sec

## Solution approach

### Intuition

Preorder, inorder and postorder differ only in **when** a node is recorded relative to its children: before the left subtree, between the two subtrees, or after the right subtree. A depth-first walk meets every node exactly at those three moments, so one walk can fill all three lists.

A recursive DFS would do this in a few lines, but with $N$ up to $10^5$ a skewed tree (a "linked list" of left children) would recurse $10^5$ levels deep and can overflow the call stack. So we simulate the recursion with an explicit stack of pairs `(node, state)`, where `state` says which of the three moments the node is at:

[![A node moves from state 1 (record in pre, push left child) to state 2 (record in in, push right child) to state 3 (record in post, pop)](/img/codes/tree-traversals/node-states.png)](/img/codes/tree-traversals/node-states.png)

The top of the stack is always the node the recursion would currently be working on. A node only advances from state 1 to 2 after its whole left subtree (pushed above it) has been popped, and from 2 to 3 after its right subtree has been popped — exactly the order the recursive version follows.

### Algorithm

1. If `root` is not null, push `{root, 1}` onto `st`.
2. While `st` is not empty, copy the top pair into `(node, state)`:
   - `state == 1`: append `node->data` to `pre`, set its state to `2` (`st.top().second = 2`), and push `{node->left, 1}` if the left child exists.
   - `state == 2`: append `node->data` to `in`, set its state to `3`, and push `{node->right, 1}` if the right child exists.
   - `state == 3`: append `node->data` to `post` and pop it.
3. Return `{in, pre, post}` (the judge expects inorder first).

### Walkthrough

Example 1 (`1` with children `2` and `3`, `3` with right child `6`):

| Top before step | Action | `pre` | `in` | `post` |
| --- | --- | --- | --- | --- |
| `(1,1)` | pre 1, push 2 | `1` | | |
| `(2,1)` | pre 2, no left | `1 2` | | |
| `(2,2)` | in 2, no right | | `2` | |
| `(2,3)` | post 2, pop | | | `2` |
| `(1,2)` | in 1, push 3 | | `2 1` | |
| `(3,1)`, `(3,2)` | pre 3, then in 3, push 6 | `1 2 3` | `2 1 3` | |
| `(6,1)` … `(6,3)` | pre 6, in 6, post 6 | `1 2 3 6` | `2 1 3 6` | `2 6` |
| `(3,3)`, `(1,3)` | post 3, post 1 | | | `2 6 3 1` |

### Complexity

- **Time:** $O(N)$ — every node is pushed once and visits each of its three states once.
- **Space:** $O(N)$ — the three output lists; the stack holds at most $h + 1$ pairs, where $h$ is the tree height.

### Edge cases

- **Empty tree:** nothing is pushed, so three empty lists are returned.
- **Skewed tree of $10^5$ nodes:** the explicit stack lives on the heap, so there is no recursion-depth limit.

## Code

```cpp
/*
    Following is the Binary Tree node structure:

    template <typename T>
    class BinaryTreeNode {
       public:
        T data;
        BinaryTreeNode<T> *left;
        BinaryTreeNode<T> *right;
    };
*/

vector<vector<int>> getTreeTraversal(BinaryTreeNode<int> *root) {
    vector<int> in, pre, post;
    // state 1: before the left subtree, 2: between subtrees, 3: after the right subtree
    stack<pair<BinaryTreeNode<int> *, int>> st;
    if (root) st.push({root, 1});

    while (!st.empty()) {
        auto [node, state] = st.top();
        if (state == 1) {
            pre.push_back(node->data);
            st.top().second = 2;
            if (node->left) st.push({node->left, 1});
        } else if (state == 2) {
            in.push_back(node->data);
            st.top().second = 3;
            if (node->right) st.push({node->right, 1});
        } else {
            post.push_back(node->data);
            st.pop();
        }
    }
    return {in, pre, post};
}
```

```java
/*
    Following is the Binary Tree node structure:

    class BinaryTreeNode<T> {
        T data;
        BinaryTreeNode<T> left;
        BinaryTreeNode<T> right;
    }
*/

import java.util.*;

public class Solution {
    public static List<List<Integer>> getTreeTraversal(BinaryTreeNode<Integer> root) {
        List<Integer> in = new ArrayList<>(), pre = new ArrayList<>(), post = new ArrayList<>();
        // state 1: before the left subtree, 2: between subtrees, 3: after the right subtree
        ArrayDeque<BinaryTreeNode<Integer>> nodes = new ArrayDeque<>();
        ArrayDeque<Integer> states = new ArrayDeque<>();  // states.peek() belongs to nodes.peek()
        if (root != null) {
            nodes.push(root);
            states.push(1);
        }

        while (!nodes.isEmpty()) {
            BinaryTreeNode<Integer> node = nodes.peek();
            int state = states.pop();
            if (state == 1) {
                pre.add(node.data);
                states.push(2);
                if (node.left != null) {
                    nodes.push(node.left);
                    states.push(1);
                }
            } else if (state == 2) {
                in.add(node.data);
                states.push(3);
                if (node.right != null) {
                    nodes.push(node.right);
                    states.push(1);
                }
            } else {
                post.add(node.data);
                nodes.pop();
            }
        }
        return Arrays.asList(in, pre, post);
    }
}
```

```python
'''
    Following is the Binary Tree node structure:

    class BinaryTreeNode:
        def __init__(self, data):
            self.data = data
            self.left = None
            self.right = None
'''

def getTreeTraversal(root) -> list[list[int]]:
    inorder, preorder, postorder = [], [], []
    # state 1: before the left subtree, 2: between subtrees, 3: after the right subtree
    stack = [[root, 1]] if root else []

    while stack:
        top = stack[-1]
        node, state = top
        if state == 1:
            preorder.append(node.data)
            top[1] = 2
            if node.left:
                stack.append([node.left, 1])
        elif state == 2:
            inorder.append(node.data)
            top[1] = 3
            if node.right:
                stack.append([node.right, 1])
        else:
            postorder.append(node.data)
            stack.pop()
    return [inorder, preorder, postorder]
```
