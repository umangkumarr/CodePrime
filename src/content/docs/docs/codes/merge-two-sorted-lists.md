---
title: "Merge Two Sorted Lists"
description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together…"
source: "https://leetcode.com/problems/merge-two-sorted-lists/"
tags: ["Linked List", "Recursion"]
complexity:
  time: "O(n + m)"
  space: "O(1)"
---

## Problem

<p>You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>.</p>

<p>Merge the two lists in a one <strong>sorted</strong> list. The list should be made by splicing together the nodes of the first two lists.</p>

<p>Return <em>the head of the merged linked list</em>.</p>

## Solution approach

### Intuition

The merged list must start with the smaller of the two heads. After that, walk along one list and splice nodes of the other list into it wherever they belong. Because both lists are already sorted, each node of `list2` is spliced in at most once and the walk never moves backwards, so no new nodes are needed.

### Algorithm

1. If either list is empty, return the other one.
2. Swap if needed so that `list1` starts with the smaller value, and remember that node as `head`.
3. While `list1->next` and `list2` both exist: if `list1->next->val <= list2->val`, the next node is already in order, so advance `list1`.
4. Otherwise detach the first node of `list2` (`temp`), insert it between `list1` and `list1->next`, and move `list1` onto it.
5. When `list1` reaches its last node, attach whatever remains of `list2` and return `head`.

### Complexity

- **Time:** $O(n + m)$ — each node of either list is passed over at most once.
- **Space:** $O(1)$ — nodes are relinked in place (the `malloc` calls allocate memory that is never used).

### Edge cases

- **Equal values** keep the node from `list1` first, because the check is `<=`.

## Code

```cpp title="C++"
class Solution {
   public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        if (list1 == NULL) return list2;
        if (list2 == NULL) return list1;

        if (list1->val > list2->val) swap(list1, list2);
        ListNode* head;
        head = (ListNode*)malloc(sizeof(ListNode*));
        head = list1;

        while (list1->next != NULL && list2 != NULL) {
            if (list1->next->val <= list2->val) {
                list1 = list1->next;
                continue;
            }
            ListNode* temp;
            temp = (ListNode*)malloc(sizeof(ListNode*));
            temp = list2;
            list2 = list2->next;
            temp->next = list1->next;
            list1->next = temp;
            list1 = list1->next;
        }
        if (list2 != NULL) {
            list1->next = list2;
        }
        return head;
    }
};

```
