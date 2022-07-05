---
displayed_sidebar: null
sidebar_position : 27
tags: [Linked List, Recursion]
---

# Reverse Linked List

## [Problem](https://leetcode.com/problems/reverse-linked-list/)

<p>Given the <code>head</code> of a singly linked list, reverse the list, and return <em>the reversed list</em>.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    ListNode* root;

   public:
    void reverse(ListNode* temp) {
        if (temp->next->next == NULL) {
            temp->next->next = temp;
            root = temp->next;
            return;
        } else
            reverse(temp->next);
        temp->next->next = temp;
    }

    ListNode* reverseList(ListNode* head) {
        if (head == NULL) return NULL;
        if (head->next == NULL) return head;
        ListNode* temp = head;
        reverse(temp);
        head->next = NULL;
        return root;
    }
};

```
</TabItem>
</Tabs>

</details>
