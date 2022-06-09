---
sidebar_position : 6
---

# Flattening a Linked List

## Problem Link
https://practice.geeksforgeeks.org/problems/flattening-a-linked-list/1

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>
