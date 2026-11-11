---
title: "Children Sum Property"
description: "Increase node values so every node equals the sum of its children, by pushing values down before recursing and summing them back up after."
source: "https://www.naukri.com/code360/problems/childrensumproperty_790723"
difficulty: "Medium"
tags: ["Tree", "Binary Tree", "Depth-First Search", "Recursion"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

Given a binary tree of nodes `N`, you need to modify the value of its nodes, such that the tree holds the Children sum property.

A binary tree is said to follow the children sum property if, for every node of that tree, the value of that node is equal to the sum of the value(s) of all of its children nodes (left child and the right child).

**Note:**

1. You can only increment the value of the nodes, in other words, the modified value must be at least equal to the original value of that node.
2. You can not change the structure of the original binary tree.
3. A binary tree is a tree in which each node has at most two children.
4. You can assume the value can be `0` for a `NULL` node and there can also be an empty tree.

The tree is given in level order, with `-1` for a `NULL` node. Implement `changeTree(root)`, which updates the tree in place; the judge prints `Valid` if the updated tree satisfies all the conditions and `Invalid` otherwise.

**Example 1:**

![Tree with root 2, children 35 and 10, grandchildren 2, 3 under 35 and 5, 2 under 10](https://files.codingninjas.in/screenshot-from-2020-10-09-12-55-59-5133.png)

```text
Input:  2 35 10 2 3 5 2 -1 -1 -1 -1 -1 -1 -1 -1
Output: Valid
Explanation: The value at the root node is 2, which is less than the sum of its children's values
(35 + 10), so we simply increase the root to 45. The node with value 35 has children 2 and 3 whose
sum is 5 < 35. As we can't decrement any value, we instead increase the children: 35's children become
30 and 5, so that 30 + 5 = 35, and the same is done for the children of the node with value 10.
Note that there can be many other valid solutions.
```

![The tree after the update, satisfying the children sum property](https://files.codingninjas.in/screenshot-from-2020-10-09-12-56-05-5132.png)

**Example 2:**

```text
Input:  10 5 5 -1 -1 -1 -1
Output: Valid
```

**Constraints:**

- $1 \le T \le 10^2$
- $0 \le N \le 10^2$
- $1 \le$ `node.Value` $\le 10^6$
- Time limit: 1 second

## Solution approach

### Intuition

Values may only go **up**. Fixing a node by raising it to its children's sum is easy, but raising a node can break its parent, and a node whose children sum to *less* than it cannot be lowered — its children must be raised instead. The trick is to do two things at every node:

- **On the way down (before recursing):** if the children's sum is smaller than the node, raise every child to the node's value. Now each child subtree will end up summing to at least the node's value — so after the fix-up below, the node will never need to be lowered.
- **On the way up (after recursing):** set the node to the sum of its (now fixed) children. Leaves keep their value.

Why every value only increases: a child is raised on the way down only when the children's sum, and therefore that child, is below the parent. And by induction a subtree's root never ends below the value it had when we entered it — on the way up it becomes either the sum of children that were raised to its own value, or the sum of children that already summed to at least its value. One DFS therefore produces a valid tree.

### Algorithm

1. If `root` is null, return.
2. Let `childSum` be the sum of the existing children's `data`.
3. If `childSum >= root->data`, set `root->data = childSum`. Otherwise set each existing child's `data` to `root->data`.
4. Recurse with `changeTree(root->left)` and `changeTree(root->right)`.
5. If the node has at least one child, set `root->data` to the new sum of its children's `data`.

### Walkthrough

Example 1 before (left) and after (right). Pushed down: `35`'s children become `35, 35` and `10`'s children become `10, 10`; summed back up: `35 → 70`, `10 → 20`, root `→ 90`. Every value went up and every parent equals the sum of its children:

[![Example 1 before and after changeTree: leaves pushed down to 35, 35, 10, 10 and parents summed up to 70, 20 and 90](/img/codes/children-sum-property/before-after.png)](/img/codes/children-sum-property/before-after.png)

### Complexity

- **Time:** $O(n)$ — each node is visited once with constant work.
- **Space:** $O(h)$ — the recursion stack, where `h` is the height of the tree.

### Edge cases

- **Empty tree:** the null check returns immediately.
- **Leaves:** step 5 is skipped for them, so they keep their own value or the value pushed down to them.
- **Node with one child:** the missing child counts as `0` in both sums, and the single child is raised to the parent's value if needed.
- **Overflow:** pushed-down values never exceed $2 \times 10^6$, so with at most $10^2$ nodes every sum stays far below `INT_MAX`.

## Code

```cpp
void changeTree(BinaryTreeNode<int> *root) {
    if (!root) return;
    BinaryTreeNode<int> *l = root->left, *r = root->right;

    int childSum = (l ? l->data : 0) + (r ? r->data : 0);
    if (childSum >= root->data) {
        root->data = childSum;
    } else {
        if (l) l->data = root->data;
        if (r) r->data = root->data;
    }

    changeTree(l);
    changeTree(r);

    if (l || r) root->data = (l ? l->data : 0) + (r ? r->data : 0);
}
```

```java
public class Solution {
    public static void changeTree(BinaryTreeNode<Integer> root) {
        if (root == null) return;
        BinaryTreeNode<Integer> l = root.left, r = root.right;

        int childSum = (l != null ? l.data : 0) + (r != null ? r.data : 0);
        if (childSum >= root.data) {
            root.data = childSum;
        } else {
            if (l != null) l.data = root.data;
            if (r != null) r.data = root.data;
        }

        changeTree(l);
        changeTree(r);

        if (l != null || r != null) root.data = (l != null ? l.data : 0) + (r != null ? r.data : 0);
    }
}
```

```python
def changeTree(root):
    if not root:
        return
    l, r = root.left, root.right

    child_sum = (l.data if l else 0) + (r.data if r else 0)
    if child_sum >= root.data:
        root.data = child_sum
    else:
        if l:
            l.data = root.data
        if r:
            r.data = root.data

    changeTree(l)
    changeTree(r)

    if l or r:
        root.data = (l.data if l else 0) + (r.data if r else 0)
```
