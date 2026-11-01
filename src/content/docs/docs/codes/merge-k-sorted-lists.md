---
title: "Merge k Sorted Lists"
description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and…"
source: "https://leetcode.com/problems/merge-k-sorted-lists/"
tags: ["Linked List", "Divide and Conquer", "Heap (Priority Queue)", "Merge Sort"]
complexity:
  time: "O(kN)"
  space: "O(1)"
---

## Problem

<p>You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order.</p>

<p><em>Merge all the linked-lists into one sorted linked-list and return it.</em></p>

## Solution approach

### Intuition

First [merge two linked lists](merge-two-sorted-lists/), then merge the third list into the result of the first two, and so on. After step `i` the running result holds the first `i + 1` lists in sorted order, so after the last step it holds all of them.

### Algorithm

1. If `lists` is empty, return `NULL`. Otherwise start with `head = lists[0]`.
2. For each `i` from `1`, set `head = mergeTwoLists(head, lists[i])`.
3. `mergeTwoLists` merges in place. It swaps so that `list1` has the smaller first value and remembers that node as `head`.
4. It then walks `list1`. If `list1->next->val <= list2->val`, it just advances. Otherwise it unlinks the first node of `list2` and splices it in right after `list1`.
5. When `list1` runs out, any remaining part of `list2` is attached to its end.

### Complexity

- **Time:** $O(kN)$ — `N` is the total number of nodes; each of the `k - 1` merges may walk the whole growing result, which holds up to `N` nodes.
- **Space:** $O(1)$ — nodes are relinked in place (the `malloc` calls allocate memory that is never used).

### Edge cases

- **Empty lists** inside `lists` are handled by the `NULL` checks at the top of `mergeTwoLists`.

## Code

```cpp title="C++"
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        if (list1 == NULL) return list2;
        if (list2 == NULL) return list1;

        if (list1->val > list2->val) swap(list1, list2);
        ListNode *head;
        head = (ListNode*)malloc(sizeof(ListNode*));
        head = list1;

        while (list1->next != NULL && list2 != NULL) {
            if (list1->next->val <= list2->val) {
                list1 = list1->next;
                continue;
            }
            ListNode *temp;
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
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        ListNode *head;
        head = (ListNode*)malloc(sizeof(ListNode*));

        if (lists.size() == 0) {
            head = NULL;
            return head;
        }

        head = lists[0];
        for (int i = 1; i < lists.size(); i++) {
            head = mergeTwoLists(head, lists[i]);
        }
        return head;
    }
};        
```
