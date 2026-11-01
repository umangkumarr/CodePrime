---
title: "Linked List Cycle II"
description: "Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null. There is a cycle in a linked list if there is…"
source: "https://leetcode.com/problems/linked-list-cycle-ii/"
tags: ["Hash Table", "Linked List", "Two Pointers"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>Given the <code>head</code> of a linked list, return <em>the node where the cycle begins. If there is no cycle, return </em><code>null</code>.</p>

<p>There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer. Internally, <code>pos</code> is used to denote the index of the node that tail&#39;s <code>next</code> pointer is connected to (<strong>0-indexed</strong>). It is <code>-1</code> if there is no cycle. <strong>Note that</strong> <code>pos</code> <strong>is not passed as a parameter</strong>.</p>

<p><strong>Do not modify</strong> the linked list.</p>

## Solution approach

### Intuition

If the list has a cycle, walking it eventually leads back to a node we have already passed, and the first such node is where the cycle begins. Remembering every visited node lets us spot this: as soon as the **next** node of the current one is already recorded, that next node is the cycle's entry point.

### Algorithm

1. Walk the list with `temp`, recording each node in the map `mp` (`mp[temp] = i`).
2. Before moving on, check whether `temp->next` is already in `mp`. If it is, return `temp->next`.
3. Otherwise advance `temp` and continue.
4. If `temp` becomes `NULL`, the list ends, so there is no cycle: return `NULL`.

### Complexity

- **Time:** $O(n \log n)$ — each node is inserted into and looked up in an ordered `map`.
- **Space:** $O(n)$ — the map stores every node.

### Edge cases

- **Self-loop** (a node pointing to itself): the node is recorded before the check, so it is returned immediately.

## Code

```cpp title="C++"
class Solution {
   public:
    ListNode *detectCycle(ListNode *head) {
        map<ListNode *, int> mp;
        ListNode *temp;
        temp = head;
        int i = 0;
        while (temp != NULL) {
            mp[temp] = i;
            if (mp.find(temp->next) != mp.end()) {
                return temp->next;
                break;
            }
            temp = temp->next;
            i++;
        }
        return NULL;
    }
};

```
