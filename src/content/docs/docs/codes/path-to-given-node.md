---
title: "Path to Given Node"
description: "Given a Binary Tree A containing N nodes. You need to find the path from Root to a given node B. NOTE: No two nodes in the tree have same data values. You…"
source: "https://www.interviewbit.com/problems/path-to-given-node/"
tags: ["Hash Table", "Tree", "Depth-First Search", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(h)"
---

## Problem

<div>

<p>Given a Binary Tree <strong>A</strong> containing <strong>N</strong> nodes.</p>
<p>You need to find the path from <strong>Root</strong> to a given node <strong>B</strong>.</p>
<p><strong>NOTE:</strong></p>
<ul>
<li>No two nodes in the tree have same data values.</li>
<li>You can assume that <strong>B</strong> is present in the tree <strong>A</strong> and a path always exists.</li>
</ul>

</div>

## Solution approach

### Intuition

The path from the root to the node with value `B` is exactly the list of nodes on the recursion stack when a DFS finds `B`. So we search the tree, and once `B` is found each ancestor appends itself while the recursion unwinds. This produces the path from the node back up to the root, and reversing it gives the root-to-node order.

### Algorithm

1. Clear the global `ans` and reset the flag `check` to `0`, then call `traversal(A, B)`.
2. In `traversal`, return on a null node. If `root->val == B`, set `check = 1`, push the value and return.
3. Search the left subtree. If `check` became `1`, this node is an ancestor, so push its value and return without searching further.
4. Otherwise search the right subtree, and push this node's value if `check` is now `1`.
5. Reverse `ans` so it runs from the root to `B`, then return it.

### Complexity

- **Time:** $O(n)$ — each node is visited at most once, and the reverse is $O(h)$.
- **Space:** $O(h)$ — the recursion stack and the path both have at most `h` entries, where `h` is the tree height ($O(n)$ for a skewed tree).

## Code

```cpp title="C++"
vector<int> ans;
int check = 0;
void traversal(TreeNode* root, int B) {
    if (!root) return;
    if (root->val == B) {
        check = 1;
        ans.push_back(root->val);
        return;
    }
    traversal(root->left, B);
    if (check == 1) {
        ans.push_back(root->val);
        return;
    }
    traversal(root->right, B);
    if (check == 1) ans.push_back(root->val);
}

vector<int> Solution::solve(TreeNode* A, int B) {
    ans.clear();
    check = 0;
    traversal(A, B);
    reverse(ans.begin(), ans.end());
    return ans;
}
```
