---
title: "Rotate List"
description: "Given the head of a linked list, rotate the list to the right by k places."
source: "https://leetcode.com/problems/rotate-list/"
tags: ["Linked List", "Two Pointers"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Given the <code>head</code> of a linked&nbsp;list, rotate the list to the right by <code>k</code> places.</p>

## Solution approach

### Intuition

Rotating right by `k` moves the last `k` nodes to the front. Rotating by the list length `n` changes nothing, so only `k % n` matters. If we join the tail to the head to form a ring, we just need to cut the ring at the right place: after the `(n - k)`-th node.

### Algorithm

1. Return `head` if the list is empty.
2. Walk `temp` to the last node while counting the length `n`.
3. If `k % n == 0`, the list is unchanged, so return `head`. Otherwise set `k = k % n`.
4. Link the tail to the head with `temp->next = head`, making the list circular.
5. Walk `temp` from `head` to the `(n - k)`-th node. Its successor is `newhead`. Break the ring with `temp->next = NULL` and return `newhead`.

### Complexity

- **Time:** $O(n)$ — at most two passes over the list.
- **Space:** $O(1)$ — only pointers are rearranged.

### Edge cases

- **`k` larger than the length**, e.g. `k = 2000000000`: the `k % n` reduction keeps the walk to at most `n` steps.

## Code

```cpp title="C++"
class Solution {
   public:
    ListNode* rotateRight(ListNode* head, int k) {
        ListNode* temp = head;
        if (!head) return head;
        int n = 1;
        while (temp->next) {
            n++;
            temp = temp->next;
        }
        if (k % n == 0) return head;
        k = k % n;
        temp->next = head;
        temp = head;
        int cnt = 1;
        while (cnt < n - k) {
            cnt++;
            temp = temp->next;
        }
        ListNode* newhead = temp->next;
        temp->next = NULL;
        return newhead;
    }
};

```
