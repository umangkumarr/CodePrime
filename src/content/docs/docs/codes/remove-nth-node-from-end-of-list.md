---
title: "Remove Nth Node From End of List"
description: "Given the head of a linked list, remove the nth node from the end of the list and return its head."
source: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"
tags: ["Linked List", "Two Pointers"]
complexity:
  time: "O(L)"
  space: "O(1)"
---

## Problem

<p>Given the <code>head</code> of a linked list, remove the <code>nth</code> node from the end of the list and return its head.</p>

## Solution approach

### Intuition

The `n`-th node from the end is the `(cnt - n + 1)`-th node from the start, where `cnt` is the length of the list. So one pass counts the nodes and a second pass stops at the node just before the target and unlinks the target.

### Algorithm

1. Walk the list with `t` and count the nodes in `cnt`.
2. If `cnt == n`, the head is the node to remove, so return `head->next`.
3. Otherwise convert to a position from the front: `n = cnt - n + 1`.
4. Walk `t` from `head` to the `(n - 1)`-th node (the predecessor of the target).
5. Unlink the target with `t->next = t->next->next` and return `head`.

### Complexity

- **Time:** $O(L)$ — two passes over a list of length `L`.
- **Space:** $O(1)$ — apart from the unused `new ListNode` allocated at the start.

### Edge cases

- **Removing the head**, e.g. a one-node list with `n = 1`: handled by the `cnt == n` check, which returns `NULL`.

## Code

```cpp title="C++"
class Solution {
   public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode* t;
        t = new ListNode;
        t = head;
        int cnt = 0;
        while (t) {
            cnt++;
            t = t->next;
        }
        if (cnt == n) {
            head = head->next;
            return head;
        }
        n = cnt - n + 1;
        int j = 1;
        t = head;
        while (j < n - 1) {
            j++;
            t = t->next;
        }
        t->next = t->next->next;
        return head;
    }
};

```
