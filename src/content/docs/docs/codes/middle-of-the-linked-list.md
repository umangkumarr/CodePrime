---
title: "Middle of the Linked List"
description: "Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node."
source: "https://leetcode.com/problems/middle-of-the-linked-list/"
tags: ["Linked List", "Two Pointers"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Given the <code>head</code> of a singly linked list, return <em>the middle node of the linked list</em>.</p>

<p>If there are two middle nodes, return <strong>the second middle</strong> node.</p>

## Solution approach

### Intuition

A linked list cannot be indexed directly, so first find its length. Once the length `cnt` is known, the middle node is reached by moving `cnt / 2` steps from the head.

### Algorithm

1. Walk the list with `temp` and count the nodes in `cnt`.
2. Move `head` forward `cnt / 2` times.
3. Return `head`.

### Complexity

- **Time:** $O(n)$ — one full pass to count, plus half a pass to reach the middle.
- **Space:** $O(1)$ — only a counter and a pointer (the `new ListNode` is immediately overwritten and never used).

### Edge cases

- **Even length**: with `cnt = 6`, the loop moves 3 steps and returns the fourth node, which is the second of the two middle nodes, as the problem asks.

## Code

```cpp title="C++"
class Solution {
   public:
    ListNode* middleNode(ListNode* head) {
        ListNode* temp;
        temp = new ListNode;
        temp = head;
        int cnt = 0;
        while (temp != NULL) {
            cnt++;
            temp = temp->next;
        }
        int i = 1;
        while (i <= cnt / 2) {
            head = head->next;
            i++;
        }
        return head;
    }
};

```
