---
title: "Flattening a Linked List"
description: "Given a Linked List of size N, where every node represents a sub-linked-list and contains two pointers: - a next pointer to the next node, - a bottom…"
source: "https://practice.geeksforgeeks.org/problems/flattening-a-linked-list/1"
complexity:
  time: "O(N \\cdot k)"
  space: "O(k)"
---

## Problem

Given a Linked List of size N, where every node represents a sub-linked-list and contains two pointers:

- a <strong>next</strong> pointer to the next node,
- a <strong>bottom</strong> pointer to a linked list where this node is head.

Each of the sub-linked-list is in sorted order.
Flatten the Link List such that all the nodes appear in a single level while maintaining the sorted order. 
<strong>Note:</strong> The flattened list will be printed using the bottom pointer instead of next pointer.

## Solution approach

### Intuition

Each top-level node starts a sorted vertical list linked through `child`. Flattening means merging all these sorted lists into one sorted `child` list. If the lists to the right of `head` are already flattened into a single sorted list, only one more merge is needed: merge `head`'s list with it. That gives a natural recursion from right to left.

### Algorithm

1. Base case: if `head` is `NULL` or `head->next` is `NULL`, return `head`.
2. Recursively flatten everything after `head` and store it in `head->next`.
3. `MergeList(head, head->next)` merges two sorted `child` lists. It uses a dummy node `newhead` and a pointer `ptr`, always attaching the smaller of `l1->data` and `l2->data` and advancing that list.
4. Append whichever list is left over, set the merged head's `next` to `NULL`, and return `newhead->child`.

### Complexity

- **Time:** $O(N \cdot k)$, where $N$ is the total number of nodes and $k$ the number of top-level lists — each of the $k$ merges can walk through up to $N$ nodes.
- **Space:** $O(k)$ — the recursion goes one level per top-level node; the merge itself is iterative.

### Edge cases

- **Single vertical list:** the base case returns it unchanged.
- Each `MergeList` call allocates a dummy `Node(-1)` that is never freed. This leaks a little memory but does not affect the answer.

## Code

```cpp title="C++"
Node* MergeList(Node* l1, Node* l2) {
    Node* newhead = new Node(-1);
    Node* ptr = newhead;
    while (l1 && l2) {
        if (l1->data <= l2->data) {
            ptr->child = l1;
            ptr = ptr->child;
            l1 = l1->child;
        } else {
            ptr->child = l2;
            ptr = ptr->child;
            l2 = l2->child;
        }
    }
    if (l1) {
        ptr->child = l1;
    }
    if (l2) {
        ptr->child = l2;
    }
    newhead->child->next = NULL;
    return newhead->child;
}

Node* flattenLinkedList(Node* head) {
    if (head == NULL || head->next == NULL) return head;
    head->next = flattenLinkedList(head->next);
    head = MergeList(head, head->next);
    return head;
}
```
