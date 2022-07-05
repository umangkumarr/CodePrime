---
displayed_sidebar: null
sidebar_position : 6
---

# Flattening a Linked List

## [Problem](https://practice.geeksforgeeks.org/problems/flattening-a-linked-list/1)

Given a Linked List of size N, where every node represents a sub-linked-list and contains two pointers:<li> a <strong>next</strong> pointer to the next node, </li><li>a <strong>bottom</strong> pointer to a linked list where this node is head.</li>
Each of the sub-linked-list is in sorted order.
Flatten the Link List such that all the nodes appear in a single level while maintaining the sorted order. 
<strong>Note:</strong> The flattened list will be printed using the bottom pointer instead of next pointer.

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

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

</details>
