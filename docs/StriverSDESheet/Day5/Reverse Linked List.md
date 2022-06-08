---
sidebar_position : 1
---

# Reverse Linked List

## Problem Link
https://leetcode.com/problems/reverse-linked-list/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
