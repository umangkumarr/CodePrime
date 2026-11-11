---
title: "Top View of Binary Tree"
description: "Return the nodes seen when a binary tree is viewed from above, left to right, using a level-order traversal that keeps the first node reached in each column."
source: "https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1"
difficulty: "Medium"
tags: ["Tree"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given a binary tree, the task is to return its **top view**. The top view of a binary tree is the set of nodes visible when the tree is viewed from the top.

- Return the nodes from the leftmost node to the rightmost node.
- If multiple nodes overlap at the same horizontal position, only the topmost (closest to the root) node is included in the view.

Complete the function `topView()`, which takes the `root` of the tree and returns the list of node values in the top view.

**Example 1:**

![Tree 1 with children 2 and 3; all three nodes are green](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/700490/Web/Other/blobid0_1733898095.png)

```text
Input:  root = [1, 2, 3]
Output: [2, 1, 3]
Explanation: The green coloured nodes represent the top view in the binary tree above.
```

**Example 2:**

![Tree rooted at 10; 40, 20, 10, 30 and 100 are green](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/700490/Web/Other/blobid1_1733898122.png)

```text
Input:  root = [10, 20, 30, 40, 60, 90, 100]
Output: [40, 20, 10, 30, 100]
Explanation: The green coloured nodes represent the top view in the binary tree above.
```

**Constraints:**

- $1 \le$ number of nodes $\le 10^5$
- $1 \le node.data \le 10^5$

## Solution approach

### Intuition

Give every node a **horizontal distance** (column): the root is column `0`, a left child is one column left of its parent (`col - 1`) and a right child one column right (`col + 1`). Looking from above, each column shows exactly one node — the one **closest to the root** in that column.

A level-order traversal (BFS) visits nodes in increasing depth, and within one depth from left to right. So the **first** node BFS reaches in a column is the topmost one (and among equally deep nodes, the leftmost, which is the convention the judge uses). We just record a column's value the first time we see it and ignore later nodes.

Columns are contiguous and lie in `[-(n - 1), n - 1]`, so instead of an ordered map we can store them in an array `top` indexed by `col + n` and remember the smallest and largest column seen; reading `top[minCol + n .. maxCol + n]` gives the answer in left-to-right order without sorting.

A depth-first version needs a depth comparison per column to be correct, and on a skewed tree of $10^5$ nodes its recursion can overflow the stack; BFS has neither problem.

### Algorithm

1. Let `n` be the number of nodes (counted first with the same BFS, or any upper bound). Create `top` of size `2n + 1`, filled with `-1` (values are positive, so `-1` means "column not seen yet"), and set `minCol = maxCol = 0`.
2. BFS from `(root, 0)` with a queue of `(node, col)` pairs. For each popped pair:
   - if `top[col + n] == -1`, set it to `node->data` and update `minCol` / `maxCol`;
   - push `(node->left, col - 1)` and `(node->right, col + 1)` for the children that exist.
3. Return `top[minCol + n], ..., top[maxCol + n]`.

### Walkthrough

Example 2 with each node's column. BFS reaches `10` (col 0), `20` (col -1), `30` (col 1), `40` (col -2), `60` (col 0, already taken), `90` (col 0, taken), `100` (col 2). The green nodes are the first in their column:

[![Example 2 tree with each node's column; 40, 20, 10, 30 and 100 form the top view, 60 and 90 are hidden](/img/codes/top-view-of-binary-tree/top-view-tree.png)](/img/codes/top-view-of-binary-tree/top-view-tree.png)

Reading columns `-2 .. 2` gives `[40, 20, 10, 30, 100]`.

### Complexity

- **Time:** $O(n)$ — each node is enqueued and dequeued once (twice counting the size pass), and the output scan covers at most `2n + 1` slots.
- **Space:** $O(n)$ — the queue and the `top` array.

### Edge cases

- **Skewed tree** (a chain of $10^5$ left children): every node opens a new column; BFS uses no recursion, so there is no stack overflow.
- **Overlapping nodes deeper down** (`60` and `90` in Example 2 share column `0` with the root): BFS reaches the root first, so the deeper nodes are ignored.
- **Single node:** the answer is `[root->data]`.

## Code

```cpp
class Solution {
   public:
    vector<int> topView(Node *root) {
        if (!root) return {};

        int n = 0;  // number of nodes: columns lie in [-(n - 1), n - 1]
        queue<Node *> nodes;
        nodes.push(root);
        while (!nodes.empty()) {
            Node *cur = nodes.front();
            nodes.pop();
            n++;
            if (cur->left) nodes.push(cur->left);
            if (cur->right) nodes.push(cur->right);
        }

        vector<int> top(2 * n + 1, -1);  // top[col + n] = first value seen in that column
        int minCol = 0, maxCol = 0;
        queue<pair<Node *, int>> q;
        q.push({root, 0});
        while (!q.empty()) {
            auto [cur, col] = q.front();
            q.pop();
            if (top[col + n] == -1) {
                top[col + n] = cur->data;
                minCol = min(minCol, col);
                maxCol = max(maxCol, col);
            }
            if (cur->left) q.push({cur->left, col - 1});
            if (cur->right) q.push({cur->right, col + 1});
        }

        return vector<int>(top.begin() + minCol + n, top.begin() + maxCol + n + 1);
    }
};
```

```java
class Solution {
    public ArrayList<Integer> topView(Node root) {
        ArrayList<Integer> ans = new ArrayList<>();
        if (root == null) return ans;

        int n = 0;  // number of nodes: columns lie in [-(n - 1), n - 1]
        ArrayDeque<Node> nodes = new ArrayDeque<>();
        nodes.offer(root);
        while (!nodes.isEmpty()) {
            Node cur = nodes.poll();
            n++;
            if (cur.left != null) nodes.offer(cur.left);
            if (cur.right != null) nodes.offer(cur.right);
        }

        int[] top = new int[2 * n + 1];  // top[col + n] = first value seen in that column
        Arrays.fill(top, -1);
        int minCol = 0, maxCol = 0;
        ArrayDeque<Node> q = new ArrayDeque<>();
        ArrayDeque<Integer> cols = new ArrayDeque<>();  // column of the matching node in q
        q.offer(root);
        cols.offer(0);
        while (!q.isEmpty()) {
            Node cur = q.poll();
            int col = cols.poll();
            if (top[col + n] == -1) {
                top[col + n] = cur.data;
                minCol = Math.min(minCol, col);
                maxCol = Math.max(maxCol, col);
            }
            if (cur.left != null) {
                q.offer(cur.left);
                cols.offer(col - 1);
            }
            if (cur.right != null) {
                q.offer(cur.right);
                cols.offer(col + 1);
            }
        }

        for (int c = minCol; c <= maxCol; c++) ans.add(top[c + n]);
        return ans;
    }
}
```

```python
from collections import deque


class Solution:
    def topView(self, root):
        if not root:
            return []

        n = 0  # number of nodes: columns lie in [-(n - 1), n - 1]
        nodes = deque([root])
        while nodes:
            cur = nodes.popleft()
            n += 1
            if cur.left:
                nodes.append(cur.left)
            if cur.right:
                nodes.append(cur.right)

        top = [-1] * (2 * n + 1)  # top[col + n] = first value seen in that column
        min_col = max_col = 0
        q = deque([(root, 0)])
        while q:
            cur, col = q.popleft()
            if top[col + n] == -1:
                top[col + n] = cur.data
                min_col = min(min_col, col)
                max_col = max(max_col, col)
            if cur.left:
                q.append((cur.left, col - 1))
            if cur.right:
                q.append((cur.right, col + 1))

        return top[min_col + n:max_col + n + 1]
```
