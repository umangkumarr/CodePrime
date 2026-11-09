---
title: "Ceil from BST"
description: "Find the smallest value in a BST that is greater than or equal to X by walking a single root-to-leaf path with O(1) extra space."
source: "https://www.naukri.com/code360/problems/ceil-from-bst_920464"
difficulty: "Easy"
tags: ["Binary Search Tree", "Tree", "Binary Tree"]
complexity:
  time: "O(h)"
  space: "O(1)"
---

## Problem

Ninja is given a binary search tree and an integer. Now he is given a particular key in the tree and returns its ceil value. Can you help Ninja solve the problem?

**Note:** The ceil of an integer is the closest integer greater than or equal to a given number. For example, for `arr[] = {1, 2, 5, 7, 8, 9}` and `key = 3`, the closest integer greater than `3` in the array is `5`, so its ceil value is `5`.

Implement the function `findCeil(node, x)` which takes the root of the BST and the key `x` and returns the ceil of `x` in the tree (`-1` if every value in the tree is smaller than `x`). The tree is given in level order, with `-1` in place of a missing child.

**Example:**

![BST with root 8: left subtree 3 (1, 6 (4, 7)), right subtree 10 (-, 14 (13, -))](https://ninjasfiles.s3.amazonaws.com/0000000000000742.PNG)

```text
For the above tree:
X = 2   → ceil = 3
X = 7   → ceil = 8
X = 12  → ceil = 13
```

The source lists `X = 7 → 8` here, but `7` is itself in the tree, so by the definition above (greater than **or equal**) and by the judge's Example 2 below, the ceil of `7` is `7`.

**Example 1:**

```text
Input:  tree = 8 5 10 2 6 -1 -1 -1 -1 -1 7 -1 -1,  X = 4
Output: 5
Explanation: Start at 8; 4 is smaller, so go left to 5. 5 >= 4 is a candidate; go left to 2.
2 < 4, go right and reach null. The smallest candidate seen is 5.
```

**Example 2:**

```text
Input:  tree = 8 5 10 2 6 -1 -1 -1 -1 -1 7 -1 -1,  X = 7
Output: 7
Explanation: 8 -> 5 -> 6 -> 7, and 7 equals the key, so the ceil is 7 itself.
```

**Example 3:**

```text
Input:  tree = 55 25 82 13 34 67 86 6 21 28 47 61 70 84 92 1 10 17 24 26 29 45 54 56 65 68 81 83 85 91 96 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1
        X = 34
Output: 34
Explanation: a perfect BST of 31 nodes (all 32 children of the last level are -1); 34 is in the tree.
```

**Example 4:**

```text
Input:  tree = 84 19 97 0 56 96 99 -1 8 50 83 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1,  X = 50
Output: 50
```

**Constraints:**

- $1 \le T \le 10$
- $1 \le N \le 10^5$
- $0 \le$ node data $\le 10^9$
- $1 \le X \le 10^9$
- Time limit: 1 second

## Solution approach

### Intuition

The ceil of `x` is the smallest value in the BST that is greater than or equal to `x`. At any node the BST ordering tells us which side can still contain a better answer:

- if `node->data == x`, nothing can beat `x` itself;
- if `node->data > x`, this node is a valid candidate — and it is smaller than every candidate in its right subtree. The only possible improvement is a smaller value that is still at least `x`, which can only be in the **left** subtree;
- if `node->data < x`, this node and its whole left subtree are too small, so the answer can only be in the **right** subtree.

Each step discards one subtree, so we follow a single path from the root, remembering the last candidate. Each new candidate is found in the left subtree of the previous one, so the last candidate seen is also the smallest. A loop does this without recursion.

### Algorithm

1. Set `ceil = -1`.
2. While `node` is not null:
   - If `node->data == x`, return `x`.
   - If `node->data > x`, record `ceil = node->data` and go to `node->left`.
   - Otherwise go to `node->right`.
3. Return `ceil` (still `-1` if no value was at least `x`).

### Walkthrough

On the picture tree with `X = 12`: `8 < 12` → right to `10`; `10 < 12` → right to `14`; `14 > 12` → `ceil = 14`, left to `13`; `13 > 12` → `ceil = 13`, left to null. Answer `13`.

### Complexity

- **Time:** $O(h)$ — one node per level, where `h` is the height of the tree ($O(\log N)$ when balanced, $O(N)$ when skewed).
- **Space:** $O(1)$ — the loop keeps only `node` and `ceil`.

### Edge cases

- **`x` larger than every value:** every step goes right, `ceil` is never set, and `-1` is returned.
- **`x` present in the tree:** returned immediately by the equality check.
- **Skewed tree with $10^5$ nodes:** the iterative loop has no recursion depth to worry about.

## Code

```cpp
int findCeil(BinaryTreeNode<int> *node, int x) {
    int ceil = -1;
    while (node) {
        if (node->data == x) return x;
        if (node->data > x) {
            ceil = node->data;
            node = node->left;
        } else {
            node = node->right;
        }
    }
    return ceil;
}
```

```java
public class Solution {
    public static int findCeil(BinaryTreeNode<Integer> node, int x) {
        int ceil = -1;
        while (node != null) {
            int val = node.data;
            if (val == x) return x;
            if (val > x) {
                ceil = val;
                node = node.left;
            } else {
                node = node.right;
            }
        }
        return ceil;
    }
}
```

```python
def findCeil(node, x):
    ceil = -1
    while node:
        if node.data == x:
            return x
        if node.data > x:
            ceil = node.data
            node = node.left
        else:
            node = node.right
    return ceil
```
