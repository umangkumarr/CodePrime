---
title: "Boundary Traversal of binary tree"
description: "Return the anticlockwise boundary of a binary tree (left boundary, leaves, reversed right boundary) by two boundary walks and one leaf DFS."
source: "https://www.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1"
difficulty: "Medium"
tags: ["Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

Given the `root` of a binary tree, return its **boundary traversal** in the following order:

1. **Left boundary:** nodes from the root to the leftmost non-leaf node, preferring the left child over the right and excluding leaves.
2. **Leaf nodes:** all leaf nodes from left to right, covering every leaf in the tree.
3. **Reverse right boundary:** nodes from the root to the rightmost non-leaf node, preferring the right child over the left, excluding leaves, and added in reverse order.

**Note:** The root is included once, leaves are added separately to avoid repetition, and the right boundary follows the traversal preference, not the path from the rightmost leaf.

Complete the function `boundaryTraversal()` which takes the root of the tree and returns the boundary nodes as a list. Expected time complexity: $O(n)$; expected auxiliary space: $O(h)$, where `h` is the height of the tree.

**Example 1:**

![Tree 1-2-3-4-5-6-7-8-9 with its boundary highlighted](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/700204/Web/Other/blobid6_1749213679.webp)

```text
Input:  root = [1, 2, 3, 4, 5, 6, 7, N, N, 8, 9, N, N, N, N]
Output: [1, 2, 4, 8, 9, 6, 7, 3]
```

**Example 2:**

![Right-skewed tree 1 -> 2 -> 3 -> 4](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/912584/Web/Other/blobid0_1759298509.jpg)

```text
Input:  root = [1, N, 2, N, 3, N, 4, N, N]
Output: [1, 4, 3, 2]
Explanation:
Left boundary:   [1] (as there is no left subtree)
Leaf nodes:      [4]
Right boundary:  [3, 2] (in reverse order)
Final traversal: [1, 4, 3, 2]
```

**Constraints:**

- $1 \le$ number of nodes $\le 10^5$
- $1 \le$ `node->data` $\le 10^5$

## Solution approach

### Intuition

Walking around the tree anticlockwise from the root meets three groups of nodes, and each group is easy to collect on its own:

- the **left boundary**, going down the left edge;
- every **leaf**, from left to right;
- the **right boundary**, going down the right edge — but it must be emitted bottom-up.

The only care needed is to avoid duplicates. A leaf at the bottom of either edge belongs to the leaf group, so both edge walks stop as soon as they reach a leaf. The root is added once by itself and never treated as part of an edge; if the root is itself a leaf, it is the whole answer.

"Preferring the left child" means: at each step go left if a left child exists, otherwise go right. That is why the left boundary can bend into a right child (for example, a node with only a right child still lies on the left edge).

### Algorithm

1. Push `root->data` into `ans`. If the root is a leaf, return `ans`.
2. **Left boundary:** start at `cur = root->left`. While `cur` is not null and not a leaf, push `cur->data` and move to `cur->left` if it exists, else `cur->right`.
3. **Leaves:** run `addLeaves` (a preorder DFS that records a node only if it has no children) on `root->left` and then `root->right`. Preorder visits leaves in left-to-right order.
4. **Right boundary:** start at `cur = root->right`. While `cur` is not null and not a leaf, push `cur->data` into a temporary list `right` and move to `cur->right` if it exists, else `cur->left`. Append `right` to `ans` in reverse.
5. Return `ans`.

### Walkthrough

Example 1, coloured by group — blue is the left boundary, green the leaves, orange the right boundary (emitted bottom-up), and the root is added first on its own:

```mermaid
flowchart TD
    n1((1)) --> n2((2))
    n1 --> n3((3))
    n2 --> n4((4))
    n2 --> n5((5))
    n3 --> n6((6))
    n3 --> n7((7))
    n5 --> n8((8))
    n5 --> n9((9))
    classDef root fill:#ece3ff,stroke:#7a4fd6,color:#1f2430
    classDef left fill:#dbe8ff,stroke:#2f6fde,color:#1f2430
    classDef leaf fill:#dcf5e3,stroke:#2e9e57,color:#1f2430
    classDef right fill:#ffeccc,stroke:#d9822b,color:#1f2430
    class n1 root
    class n2 left
    class n4,n8,n9,n6,n7 leaf
    class n3 right
```

- Root: `[1]`.
- Left walk from `2`: `2` is not a leaf → push it, go left to `4`; `4` is a leaf → stop. `ans = [1, 2]`.
- Leaves in preorder: `4, 8, 9, 6, 7`. `ans = [1, 2, 4, 8, 9, 6, 7]`.
- Right walk from `3`: push `3`, go right to `7`, a leaf → stop. Reversed: `[3]`. `ans = [1, 2, 4, 8, 9, 6, 7, 3]`.

### Complexity

- **Time:** $O(n)$ — the leaf DFS visits every node once; each edge walk visits at most `h + 1` nodes.
- **Space:** $O(h)$ auxiliary — the recursion stack of the leaf DFS and the temporary `right` list both hold at most one root-to-leaf path (the output itself is not counted).

### Edge cases

- **Single node:** the root is a leaf, so step 1 returns `[root]` immediately and it is not added again as a leaf.
- **Missing left (or right) subtree:** the corresponding walk starts at null and adds nothing — the root alone is that boundary, as in Example 2.
- **Edge ending in a leaf:** the walks stop before pushing a leaf, so each leaf appears exactly once (from the leaf DFS).

## Code

```cpp title="C++"
class Solution {
    static bool isLeaf(Node *node) { return !node->left && !node->right; }

    void addLeaves(Node *node, vector<int> &ans) {
        if (!node) return;
        if (isLeaf(node)) {
            ans.push_back(node->data);
            return;
        }
        addLeaves(node->left, ans);
        addLeaves(node->right, ans);
    }

   public:
    vector<int> boundaryTraversal(Node *root) {
        vector<int> ans{root->data};
        if (isLeaf(root)) return ans;

        for (Node *cur = root->left; cur && !isLeaf(cur); cur = cur->left ? cur->left : cur->right)
            ans.push_back(cur->data);

        addLeaves(root->left, ans);
        addLeaves(root->right, ans);

        vector<int> right;
        for (Node *cur = root->right; cur && !isLeaf(cur); cur = cur->right ? cur->right : cur->left)
            right.push_back(cur->data);
        ans.insert(ans.end(), right.rbegin(), right.rend());
        return ans;
    }
};
```
