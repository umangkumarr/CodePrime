---
displayed_sidebar: null
sidebar_position : 30
tags: [Linked List, Two Pointers]
---

# Remove Nth Node From End of List

## [Problem](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

<p>Given the <code>head</code> of a linked list, remove the <code>nth</code> node from the end of the list and return its head.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode* t;
        t = new ListNode;
        t = head;
        int cnt = 0;
        while (t) {
            cnt++;
            t = t->next;
        }
        if (cnt == n) {
            head = head->next;
            return head;
        }
        n = cnt - n + 1;
        int j = 1;
        t = head;
        while (j < n - 1) {
            j++;
            t = t->next;
        }
        t->next = t->next->next;
        return head;
    }
};

```
</TabItem>
</Tabs>

</details>
