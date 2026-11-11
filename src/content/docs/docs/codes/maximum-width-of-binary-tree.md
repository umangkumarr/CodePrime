---
title: "Maximum Width of Binary Tree"
description: "Find the widest level of a binary tree, counting gaps, with a level-order traversal that gives each node a heap index re-based to 0 on every level."
source: "https://leetcode.com/problems/maximum-width-of-binary-tree/"
difficulty: "Medium"
tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(w)"
---

## Problem

Given the `root` of a binary tree, return _the **maximum width** of the given tree_.

The **maximum width** of a tree is the maximum **width** among all levels.

The **width** of one level is defined as the length between the end-nodes (the leftmost and rightmost non-null nodes), where the null nodes between the end-nodes that would be present in a complete binary tree extending down to that level are also counted into the length calculation.

It is **guaranteed** that the answer will in the range of a **32-bit** signed integer.

**Example 1:**

![Example 1 tree](https://assets.leetcode.com/uploads/2021/05/03/width1-tree.jpg)

```text
Input:  root = [1,3,2,5,3,null,9]
Output: 4
Explanation: The maximum width exists in the third level with length 4 (5,3,null,9).
```

**Example 2:**

![Example 2 tree](https://assets.leetcode.com/uploads/2022/03/14/maximum-width-of-binary-tree-v3.jpg)

```text
Input:  root = [1,3,2,5,null,null,9,6,null,7]
Output: 7
Explanation: The maximum width exists in the fourth level with length 7 (6,null,null,null,null,null,7).
```

**Example 3:**

![Example 3 tree](https://assets.leetcode.com/uploads/2021/05/03/width3-tree.jpg)

```text
Input:  root = [1,3,2,5]
Output: 2
Explanation: The maximum width exists in the second level with length 2 (3,2).
```

**Constraints:**

- The number of nodes in the tree is in the range $[1, 3000]$.
- $-100 \le$ `Node.val` $\le 100$

## Solution approach

### Intuition

Number the nodes as in an array-backed heap: if a node has position `p`, its left child gets `2 * p + 1` and its right child `2 * p + 2`. These are exactly the slots the nodes would occupy in a complete binary tree, so the missing (null) nodes between two nodes of a level are counted automatically: the width of a level is `last position - first position + 1`.

The catch is size. Positions double on every level, and a chain of 3000 nodes would need positions near $2^{3000}$. But only **differences within a level** matter, so before numbering the children we subtract the level's first position, `start`. After the shift every position on a level is less than that level's width, which the problem guarantees fits in 32 bits, so the children's positions `2 * p + 2` always fit in a 64-bit integer.

### Algorithm

1. Level-order traversal with a queue `q` of `{node, position}`, starting with `{root, 0}`.
2. At the start of each level, read `start = q.front().second` and `end = q.back().second`, and update `ans` with `end - start + 1`.
3. Pop the `size` nodes of the level. For each, let `p = position - start`, and push the non-null children with positions `2 * p + 1` and `2 * p + 2`.
4. Return `ans` when the queue is empty.

### Walkthrough

Example 2, with the position each node gets when it is pushed (computed from its parent's re-based position `p`):

[![Example 2 tree with each node's position; 6 and 7 are the ends of the widest level](/img/codes/maximum-width-of-binary-tree/positions.png)](/img/codes/maximum-width-of-binary-tree/positions.png)

| Level | `start`, `end` | Width | Re-based `p` used for the children |
| --- | --- | --- | --- |
| 1 | 0, 0 | 1 | `1 → 0` |
| 2 | 1, 2 | 2 | `3 → 0`, `2 → 1` |
| 3 | 1, 4 | 4 | `5 → 0`, `9 → 3` |
| 4 | 1, 7 | **7** | — |

Level 3: `5 = 2·0 + 1` and `9 = 2·1 + 2`. Level 4: `6 = 2·0 + 1` and `7 = 2·3 + 1`, so the width is `7 - 1 + 1 = 7`.

### Complexity

- **Time:** $O(n)$ — every node is pushed and popped once.
- **Space:** $O(w)$ — the queue holds at most one full level, where `w` is the largest number of nodes on a level.

### Edge cases

- **Single node:** one level with `start == end`, so the width is `1`.
- **Deep, skewed trees:** without re-basing, positions would overflow after about 63 levels; with it they stay below $2^{32}$.
- **Gaps between subtrees** (Example 2, level 4): handled by the position arithmetic, not by pushing null nodes, so the queue never grows beyond the real nodes.

## Code

```cpp
class Solution {
   public:
    int widthOfBinaryTree(TreeNode* root) {
        queue<pair<TreeNode*, long long>> q;
        q.push({root, 0});
        long long ans = 0;
        while (!q.empty()) {
            int size = q.size();
            long long start = q.front().second, end = q.back().second;
            ans = max(ans, end - start + 1);
            for (int i = 0; i < size; ++i) {
                auto [node, pos] = q.front();
                q.pop();
                long long p = pos - start;  // re-base so positions stay small
                if (node->left) q.push({node->left, 2 * p + 1});
                if (node->right) q.push({node->right, 2 * p + 2});
            }
        }
        return ans;
    }
};
```

```java
class Solution {
    private record Entry(TreeNode node, long pos) {}

    public int widthOfBinaryTree(TreeNode root) {
        ArrayDeque<Entry> q = new ArrayDeque<>();
        q.add(new Entry(root, 0));
        long ans = 0;
        while (!q.isEmpty()) {
            int size = q.size();
            long start = q.peekFirst().pos(), end = q.peekLast().pos();
            ans = Math.max(ans, end - start + 1);
            for (int i = 0; i < size; i++) {
                Entry e = q.poll();
                long p = e.pos() - start;  // re-base so positions stay small
                if (e.node().left != null) q.add(new Entry(e.node().left, 2 * p + 1));
                if (e.node().right != null) q.add(new Entry(e.node().right, 2 * p + 2));
            }
        }
        return (int) ans;
    }
}
```

```python
from collections import deque


class Solution:
    def widthOfBinaryTree(self, root: TreeNode | None) -> int:
        q = deque([(root, 0)])
        ans = 0
        while q:
            start, end = q[0][1], q[-1][1]
            ans = max(ans, end - start + 1)
            for _ in range(len(q)):
                node, pos = q.popleft()
                p = pos - start  # re-base so positions stay small
                if node.left:
                    q.append((node.left, 2 * p + 1))
                if node.right:
                    q.append((node.right, 2 * p + 2))
        return ans
```
