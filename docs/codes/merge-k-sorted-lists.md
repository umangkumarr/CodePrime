---
displayed_sidebar: null
sidebar_position : 7
tags: [Linked List, Divide and Conquer, Heap (Priority Queue), Merge Sort]
---

# Merge k Sorted Lists

## [Problem](https://leetcode.com/problems/merge-k-sorted-lists/)

<p>You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order.</p>

<p><em>Merge all the linked-lists into one sorted linked-list and return it.</em></p>

## Solution Approach

First [Merge two linked list](merge-two-sorted-lists/) and merge the third with resultant of the first two and so on.

Expected Time complexity: $O(nk)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
