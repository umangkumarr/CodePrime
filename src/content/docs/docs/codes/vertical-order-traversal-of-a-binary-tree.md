---
title: "Vertical Order Traversal of a Binary Tree"
description: "List a binary tree's nodes column by column, top to bottom with ties by value, by recording (col, row, value) for every node and sorting."
source: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/"
difficulty: "Hard"
tags: ["Hash Table", "Tree", "Depth-First Search", "Breadth-First Search", "Sorting", "Binary Tree"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

Given the `root` of a binary tree, calculate the **vertical order traversal** of the binary tree.

For each node at position `(row, col)`, its left and right children will be at positions `(row + 1, col - 1)` and `(row + 1, col + 1)` respectively. The root of the tree is at `(0, 0)`.

The **vertical order traversal** of a binary tree is a list of top-to-bottom orderings for each column index starting from the leftmost column and ending on the rightmost column. There may be multiple nodes in the same row and same column. In such a case, sort these nodes by their values.

Return _the **vertical order traversal** of the binary tree_.

**Example 1:**

![Tree [3,9,20,null,null,15,7] with its columns marked](https://assets.leetcode.com/uploads/2021/01/29/vtree1.jpg)

```text
Input:  root = [3,9,20,null,null,15,7]
Output: [[9],[3,15],[20],[7]]
Explanation:
Column -1: Only node 9 is in this column.
Column 0: Nodes 3 and 15 are in this column in that order from top to bottom.
Column 1: Only node 20 is in this column.
Column 2: Only node 7 is in this column.
```

**Example 2:**

![Tree [1,2,3,4,5,6,7] with its columns marked](https://assets.leetcode.com/uploads/2021/01/29/vtree2.jpg)

```text
Input:  root = [1,2,3,4,5,6,7]
Output: [[4],[2],[1,5,6],[3],[7]]
Explanation:
Column -2: Only node 4 is in this column.
Column -1: Only node 2 is in this column.
Column 0: Nodes 1, 5, and 6 are in this column.
          1 is at the top, so it comes first.
          5 and 6 are at the same position (2, 0), so we order them by their value, 5 before 6.
Column 1: Only node 3 is in this column.
Column 2: Only node 7 is in this column.
```

**Example 3:**

![Tree [1,2,3,4,6,5,7] with its columns marked](https://assets.leetcode.com/uploads/2021/01/29/vtree3.jpg)

```text
Input:  root = [1,2,3,4,6,5,7]
Output: [[4],[2],[1,5,6],[3],[7]]
Explanation:
This case is the exact same as example 2, but with nodes 5 and 6 swapped.
Note that the solution remains the same since 5 and 6 are in the same location and should be
ordered by their values.
```

**Constraints:**

- The number of nodes in the tree is in the range $[1, 1000]$.
- $0 \le$ `Node.val` $\le 1000$

## Solution approach

### Intuition

The required output order is a **lexicographic** order on three keys: first by column (left to right), then by row (top to bottom), then by value (for nodes sharing a position). So if we record the triple `{col, row, val}` for every node and sort the triples, they come out in exactly the order we must print them. All that remains is to cut the sorted list wherever the column changes.

Any traversal works for collecting the triples, because the sort, not the visiting order, decides the final order. That also makes ties trivial: two nodes at the same `(row, col)` differ only in `val`, and the sort puts the smaller value first.

### Algorithm

1. `collect(node, row, col, nodes)` does a DFS: append `{col, row, node->val}` to `nodes`, then recurse into `node->left` with `(row + 1, col - 1)` and `node->right` with `(row + 1, col + 1)`.
2. Sort `nodes` (the triples compare lexicographically: `col`, then `row`, then `val`).
3. Scan the sorted triples; start a new list in `ans` whenever `col` differs from the previous triple's, and append `val` to the last list.
4. Return `ans`.

### Walkthrough

Example 3, `root = [1,2,3,4,6,5,7]`. The sorted triples `{col, row, val}` and the groups they form:

| column | sorted triples | group |
| --- | --- | --- |
| -2 | `{-2, 2, 4}` | `[4]` |
| -1 | `{-1, 1, 2}` | `[2]` |
| 0 | `{0, 0, 1}`, `{0, 2, 5}`, `{0, 2, 6}` | `[1, 5, 6]` |
| 1 | `{1, 1, 3}` | `[3]` |
| 2 | `{2, 2, 7}` | `[7]` |

Node `6` is the right child of `2` and `5` the left child of `3`; both land at `(2, 0)`, and the third key orders them `5, 6`.

### Complexity

- **Time:** $O(n \log n)$ — the DFS is $O(n)$ and sorting `n` triples is $O(n \log n)$.
- **Space:** $O(n)$ — the triples and the answer, plus a recursion stack of height $h \le n$.

### Edge cases

- **Single node:** one triple, one column: `[[root->val]]`.
- **Equal values at the same position:** they compare equal on all keys and both are output; their relative order does not matter because they are identical.
- **Repeated calls:** all state is local to `verticalTraversal`, so nothing leaks between test cases.

## Code

```cpp
class Solution {
    void collect(TreeNode* node, int row, int col, vector<array<int, 3>>& nodes) {
        if (!node) return;
        nodes.push_back({col, row, node->val});
        collect(node->left, row + 1, col - 1, nodes);
        collect(node->right, row + 1, col + 1, nodes);
    }

   public:
    vector<vector<int>> verticalTraversal(TreeNode* root) {
        vector<array<int, 3>> nodes;  // {col, row, val}
        collect(root, 0, 0, nodes);
        sort(nodes.begin(), nodes.end());

        vector<vector<int>> ans;
        for (size_t i = 0; i < nodes.size(); i++) {
            if (i == 0 || nodes[i][0] != nodes[i - 1][0]) ans.push_back({});
            ans.back().push_back(nodes[i][2]);
        }
        return ans;
    }
};
```

```java
class Solution {
    private void collect(TreeNode node, int row, int col, List<int[]> nodes) {
        if (node == null) return;
        nodes.add(new int[] {col, row, node.val});
        collect(node.left, row + 1, col - 1, nodes);
        collect(node.right, row + 1, col + 1, nodes);
    }

    public List<List<Integer>> verticalTraversal(TreeNode root) {
        List<int[]> nodes = new ArrayList<>();  // {col, row, val}
        collect(root, 0, 0, nodes);
        nodes.sort(Arrays::compare);  // lexicographic: col, then row, then val

        List<List<Integer>> ans = new ArrayList<>();
        for (int i = 0; i < nodes.size(); i++) {
            if (i == 0 || nodes.get(i)[0] != nodes.get(i - 1)[0]) ans.add(new ArrayList<>());
            ans.get(ans.size() - 1).add(nodes.get(i)[2]);
        }
        return ans;
    }
}
```

```python
class Solution:
    def verticalTraversal(self, root: TreeNode | None) -> list[list[int]]:
        nodes = []  # (col, row, val)
        stack = [(root, 0, 0)] if root else []
        while stack:
            node, row, col = stack.pop()
            nodes.append((col, row, node.val))
            if node.left:
                stack.append((node.left, row + 1, col - 1))
            if node.right:
                stack.append((node.right, row + 1, col + 1))
        nodes.sort()

        ans = []
        for i, (col, _, val) in enumerate(nodes):
            if i == 0 or col != nodes[i - 1][0]:
                ans.append([])
            ans[-1].append(val)
        return ans
```
