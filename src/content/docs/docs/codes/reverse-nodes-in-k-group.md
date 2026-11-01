---
title: "Reverse Nodes in k-Group"
description: "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. k is a positive integer and is less than or…"
source: "https://leetcode.com/problems/reverse-nodes-in-k-group/"
tags: ["Linked List", "Recursion"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Given the <code>head</code> of a linked list, reverse the nodes of the list <code>k</code> at a time, and return <em>the modified list</em>.</p>

<p><code>k</code> is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of <code>k</code> then left-out nodes, in the end, should remain as it is.</p>

<p>You may not alter the values in the list&#39;s nodes, only nodes themselves may be changed.</p>

## Solution approach

### Intuition

The list is handled `k` nodes at a time. Instead of rewiring the original nodes, this code builds each reversed group from **new** nodes. Pushing each value onto the front of a new list `h1` puts the values in reverse order. The reversed group is then linked after the previous group's tail, and its own last node is connected to the rest of the list. If fewer than `k` nodes are left, they are not touched.

A dummy node `root` sits before the head so that the first group is attached in the same way as every later group.

### Algorithm

1. Create a dummy `root` with `root->next = h`, and set `tail = root`.
2. In the lambda `fun`, repeat:
   - Read up to `k` nodes starting at `t`, and for each one create `temp = new ListNode(t->val)` and push it onto the front of `h1`.
   - If fewer than `k` nodes were read (`cnt < k`), stop. The leftover original nodes are still linked after `tail`.
   - Otherwise set `tail->next = h1`, move `tail` forward `k` steps to the end of the new group, and set `tail->next = t` to reconnect the rest of the list.
3. Return `root->next`.

### Complexity

- **Time:** $O(n)$ — each node is copied once and `tail` walks over each new node once.
- **Space:** $O(n)$ — a new node is allocated for every node in a full group, and the original nodes are not freed.

## Code

```cpp title="C++"
class Solution {
   public:
    ListNode* reverseKGroup(ListNode* h, int k) {
        ListNode* root;
        root = new ListNode(0);
        ListNode* tail = root;
        tail->next = h;
        ListNode* t = h;
        auto fun = [&](ListNode* t, ListNode* tail, int k) {
            ListNode* h1;
            while (1) {
                int cnt = 0;
                while (t && cnt < k) {
                    ListNode* temp;
                    temp = new ListNode(t->val);
                    temp->next = h1;
                    h1 = temp;
                    cnt++;
                    t = t->next;
                }
                if (cnt < k) return;
                tail->next = h1;
                cnt = 0;
                while (cnt < k) {
                    cnt++;
                    tail = tail->next;
                }
                tail->next = t;
            }
        };
        fun(t, tail, k);
        return root->next;
    }
};

```
