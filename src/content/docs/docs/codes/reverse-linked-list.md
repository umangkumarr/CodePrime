---
title: "Reverse Linked List"
description: "Given the head of a singly linked list, reverse the list, and return the reversed list."
source: "https://leetcode.com/problems/reverse-linked-list/"
tags: ["Linked List", "Recursion"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Given the <code>head</code> of a singly linked list, reverse the list, and return <em>the reversed list</em>.</p>

## Solution approach

### Intuition

Recursion reaches the end of the list first and then handles the nodes on the way back. When we return to a node `temp`, its successor `temp->next` is already the tail of the reversed part, so `temp->next->next = temp` hooks `temp` on after it. The last node becomes the new head.

### Algorithm

1. In `reverseList`, return `head` directly if the list has zero or one node.
2. Call `reverse(head)`:
   - If `temp->next` is the last node (`temp->next->next == NULL`), point that last node back to `temp`, store it in `root` as the new head, and return.
   - Otherwise recurse on `temp->next` first, then set `temp->next->next = temp`.
3. The original `head` is now the tail, so set `head->next = NULL` to remove the cycle, and return `root`.

### Complexity

- **Time:** $O(n)$ — each node is visited once.
- **Space:** $O(n)$ — the recursion stack is as deep as the list.

## Code

```cpp title="C++"
class Solution {
    ListNode* root;

   public:
    void reverse(ListNode* temp) {
        if (temp->next->next == NULL) {
            temp->next->next = temp;
            root = temp->next;
            return;
        } else
            reverse(temp->next);
        temp->next->next = temp;
    }

    ListNode* reverseList(ListNode* head) {
        if (head == NULL) return NULL;
        if (head->next == NULL) return head;
        ListNode* temp = head;
        reverse(temp);
        head->next = NULL;
        return root;
    }
};

```
