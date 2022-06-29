---
sidebar_position : 6
tags: [Linked List, Recursion]
---

# Merge Two Sorted Lists

## [Problem](https://leetcode.com/problems/merge-two-sorted-lists/)

<p>You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>.</p>

<p>Merge the two lists in a one <strong>sorted</strong> list. The list should be made by splicing together the nodes of the first two lists.</p>

<p>Return <em>the head of the merged linked list</em>.</p>

## Solution Approach

Make a new LinkedList and keep adding the smaller of the two head(list1, list2) nodes at the tail of the new linked list and return the head node of the new Linked list.

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {

        // if any of the linkedlist is NULL return the other
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
};
```
</TabItem>
</Tabs>

</details>
