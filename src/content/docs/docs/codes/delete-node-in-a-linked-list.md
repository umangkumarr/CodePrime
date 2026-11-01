---
title: "Delete Node in a Linked List"
description: "Write a function to delete a node in a singly-linked list. You will not be given access to the head of the list, instead you will be given access to the…"
source: "https://leetcode.com/problems/delete-node-in-a-linked-list/"
tags: ["Linked List"]
complexity:
  time: "O(1)"
  space: "O(1)"
---

## Problem

<p>Write a function to <strong>delete a node</strong> in a singly-linked list. You will <strong>not</strong> be given access to the <code>head</code> of the list, instead you will be given access to <strong>the node to be deleted</strong> directly.</p>

<p>It is <strong>guaranteed</strong> that the node to be deleted is <strong>not a tail node</strong> in the list.</p>

## Solution approach

### Intuition

We are given only the node to delete, not the head, so we cannot reach its predecessor to unlink it. But we don't have to remove this exact node object: it is enough for the list's **values** to look as if the node were gone. Copying the next node into the current one does exactly that. The current node takes the next node's value and its `next` pointer, so the next node is skipped.

### Algorithm

1. `*node = *node->next` copies the whole next node (both `val` and `next`) into `node`.
2. The list now goes from `node` (holding the next value) directly to the node after the next one, so the original value has disappeared from the list.

### Complexity

- **Time:** $O(1)$ — a single struct copy.
- **Space:** $O(1)$ — no extra memory is used.

### Edge cases

- The problem guarantees `node` is not the tail, so `node->next` is never `NULL` here. This trick cannot delete the last node.
- The skipped next node is not freed with `delete`, so its memory is leaked. This does not affect correctness on the judge.

## Code

```cpp title="C++"
class Solution {
public:
    void deleteNode(ListNode* node) {
        *node = *node->next;
    }
};

```
