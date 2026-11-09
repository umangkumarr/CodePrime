---
title: "Left View of Binary Tree"
description: "Return the nodes visible from the left side of a binary tree — the first node of every level — with a level-order (BFS) traversal."
source: "https://www.geeksforgeeks.org/problems/left-view-of-binary-tree/1"
difficulty: "Easy"
tags: ["Tree"]
complexity:
  time: "O(n)"
  space: "O(w)"
---

## Problem

Given the **root** of a binary tree. Return the left view of the binary tree. The left view of a binary tree is the set of nodes visible when the tree is viewed from the left side.

**Note:** If the tree is empty, return an empty list.

Complete the function `leftView()` which takes the `root` of the tree and returns the left view as a list of node values, from top to bottom.

**Example 1:**

![Tree with root 1, children 2 and 3, and 2 having children 4 and 5](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/700174/Web/Other/blobid0_1785586075.png)

```text
Input:  root = [1, 2, 3, 4, 5, N, N]
Output: [1, 2, 4]
Explanation: From the left side of the tree, only the nodes 1, 2, and 4 are visible.
```

![The same tree with the visible nodes 1, 2 and 4 highlighted](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/700174/Web/Other/blobid1_1785586111.png)

**Example 2:**

![Tree with root 1, children 2 and 3; 3 has left child 4, which has right child 5](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/700174/Web/Other/blobid2_1785504482.png)

```text
Input:  root = [1, 2, 3, N, N, 4, N, N, 5, N, N]
Output: [1, 2, 4, 5]
Explanation: From the left side of the tree, only the nodes 1, 2, 4, and 5 are visible.
```

![The same tree with the visible nodes 1, 2, 4 and 5 highlighted](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/933233/Web/Other/blobid0_1787828266.png)

**Constraints:**

- $0 \le$ size of binary tree, `Node.data` $\le 10^5$

## Solution approach

### Intuition

Looking at the tree from the left, on each level we see exactly one node: the **leftmost node of that level**. It does not have to be a left child — in Example 2, node `4` is visible because nothing else is on level 2 to its left, and node `5` is a right child but the only node on level 3.

A level-order traversal (BFS) processes the tree one level at a time, and within a level from left to right. So if we know where each level starts in the queue, the first node of that level is the answer for it.

### Algorithm

1. If `root` is `nullptr`, return an empty list.
2. Push `root` into the queue `q`.
3. While `q` is not empty:
   - let `size = q.size()` — exactly the nodes of the current level;
   - pop those `size` nodes in order; the first one (`i == 0`) goes into `view`;
   - push each popped node's left child, then its right child, which builds the next level in left-to-right order.
4. Return `view`.

### Complexity

- **Time:** $O(n)$ — every node is pushed and popped once.
- **Space:** $O(w)$ — the queue holds at most one level plus part of the next, where `w` is the maximum width of the tree ($O(n)$ in the worst case).

### Edge cases

- **Empty tree:** handled up front, returning `{}` as the note requires.
- **Visible node that is a right child** (Example 2): the BFS takes the first node of the level whatever its side.
- **Skewed tree** of $10^5$ nodes: the traversal is iterative, so depth does not threaten the call stack.

## Code

```cpp
class Solution {
   public:
    vector<int> leftView(Node* root) {
        vector<int> view;
        if (!root) return view;
        queue<Node*> q;
        q.push(root);
        while (!q.empty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                Node* node = q.front();
                q.pop();
                if (i == 0) view.push_back(node->data);
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
        }
        return view;
    }
};
```

```java
class Solution {
    public ArrayList<Integer> leftView(Node root) {
        ArrayList<Integer> view = new ArrayList<>();
        if (root == null) return view;
        ArrayDeque<Node> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                Node node = q.poll();
                if (i == 0) view.add(node.data);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
        }
        return view;
    }
}
```

```python
from collections import deque


class Solution:
    def leftView(self, root):
        view = []
        if not root:
            return view
        q = deque([root])
        while q:
            for i in range(len(q)):
                node = q.popleft()
                if i == 0:
                    view.append(node.data)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
        return view
```
