---
title: "Linked List Cycle"
description: "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list…"
source: "https://leetcode.com/problems/linked-list-cycle/"
tags: ["Hash Table", "Linked List", "Two Pointers"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it.</p>

<p>There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the&nbsp;<code>next</code>&nbsp;pointer. Internally, <code>pos</code>&nbsp;is used to denote the index of the node that&nbsp;tail&#39;s&nbsp;<code>next</code>&nbsp;pointer is connected to.&nbsp;<strong>Note that&nbsp;<code>pos</code>&nbsp;is not passed as a parameter</strong>.</p>

<p>Return&nbsp;<code>true</code><em> if there is a cycle in the linked list</em>. Otherwise, return <code>false</code>.</p>

## Solution approach

### Intuition

In a list without a cycle, the walk ends at `NULL`. In a list with a cycle, the walk eventually reaches a node it has already seen. Recording every visited node and checking each `next` pointer against that record detects the cycle.

### Algorithm

1. Walk the list with `temp`, marking each node in the map `mp`.
2. If `temp->next` is already in `mp`, a cycle exists: the code sets `temp->next = NULL` and returns `true`.
3. Otherwise advance `temp`.
4. If the walk reaches `NULL`, return `false`.

### Complexity

- **Time:** $O(n \log n)$ — each node is inserted into and looked up in an ordered `map`.
- **Space:** $O(n)$ — the map stores every node.

### Edge cases

- **Side effect:** setting `temp->next = NULL` breaks the cycle, so the input list is modified when the answer is `true`.

## Code

```cpp title="C++"
class Solution {
   public:
    bool hasCycle(ListNode* head) {
        map<ListNode*, int> mp;
        ListNode* temp;
        temp = head;
        while (temp != NULL) {
            mp[temp] = 1;
            if (mp.find(temp->next) != mp.end()) {
                temp->next = NULL;
                return true;
                break;
            }
            temp = temp->next;
        }
        return false;
    }
};

```
