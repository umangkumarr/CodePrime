---
title: "Bottom View of Binary Tree"
description: "Given a binary tree, print the bottom view from left to right. A node is included in bottom view if it can be seen when we look at the tree from bottom.…"
source: "https://practice.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1"
tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p></p><p><span>Given a binary tree, print the bottom view from left to right.<br/>
A node is included in bottom view if it can be seen when we look at the tree from bottom.</span></p>

<p><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 20<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /&nbsp;&nbsp;&nbsp; \<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 22<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /&nbsp;&nbsp; \&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; 25<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /&nbsp;&nbsp; \&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 10&nbsp;&nbsp;&nbsp; 14</span></p>

<p><span>For the above tree, the bottom view is 5 10 3 14 25.</span><br/>
<span>If there are <strong>multiple </strong>bottom-most nodes for a horizontal distance from root, then print the later one in level traversal. For example, in the below diagram, 3 and 4 are both the bottommost nodes at horizontal distance 0, we need to print 4.</span></p>

<p><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 20<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /&nbsp;&nbsp;&nbsp; \<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 22<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /&nbsp;&nbsp; \&nbsp;&nbsp; &nbsp; /&nbsp;&nbsp; \<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3 4&nbsp;&nbsp;&nbsp;&nbsp; 25<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; /&nbsp; &nbsp; \&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 10 &nbsp;&nbsp; &nbsp;&nbsp; 14</span></p>

<p><span>For the above tree the output should be 5 10 4 14 25.</span><br/>
&nbsp;</p>

<p><span><strong>Your Task:</strong><br/>
This is a functional problem, you <strong>don't </strong>need to care about input, just complete the function <strong>bottomView</strong>() which takes the root node of the tree as input and returns an array&nbsp;containing the bottom view of the given tree.</span></p>

## Solution approach

### Intuition

Give every node a horizontal column: moving to a child shifts the column by one. The bottom view shows, for each column, the **deepest** node in it. So during a traversal we keep, for each column, the depth of the best node seen so far and replace it whenever a node at the same or a greater depth appears.

Replacing on equal depth (`<=`) means that when two nodes share both column and depth, the one visited later wins, which matches the problem's rule of picking the later node.

### Algorithm

1. Call `traversal(root, 0, 0)` with column `c` and depth `h`.
2. If column `c` has no entry in `height`, or `height[c] <= h`, set `mp[c] = root->data` and `height[c] = h`.
3. Recurse into the left child with column `c + 1` and the right child with `c - 1`, both at depth `h + 1`.
4. The `map` sorts columns in increasing order, which runs from right to left here, so collect `mp`'s values into `view` and reverse it.
5. Return `view`.

### Complexity

- **Time:** $O(n \log n)$ — each node is visited once, and each operation on the ordered maps costs $O(\log n)$.
- **Space:** $O(n)$ — for the two maps; the recursion stack adds $O(h)$.

## Code

```cpp title="C++"
class Solution {
    map<int, int> mp, height;

   public:
    void traversal(Node *root, int c, int h) {
        if (!root) return;
        if (height.find(c) == height.end() || height[c] <= h) {
            mp[c] = root->data;
            height[c] = h;
        }
        traversal(root->left, c + 1, h + 1);
        traversal(root->right, c - 1, h + 1);
    }

    vector<int> bottomView(Node *root) {
        vector<int> view;
        traversal(root, 0, 0);
        for (auto i : mp) {
            view.push_back(i.second);
        }
        reverse(view.begin(), view.end());
        return view;
    }
};
```
