---
sidebar_position : 28
tags: [Linked List, Two Pointers]
---

# Middle of the Linked List

## [Problem](https://leetcode.com/problems/middle-of-the-linked-list/)

<p>Given the <code>head</code> of a singly linked list, return <em>the middle node of the linked list</em>.</p>

<p>If there are two middle nodes, return <strong>the second middle</strong> node.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    ListNode* middleNode(ListNode* head) {
        ListNode* temp;
        temp = new ListNode;
        temp = head;
        int cnt = 0;
        while (temp != NULL) {
            cnt++;
            temp = temp->next;
        }
        int i = 1;
        while (i <= cnt / 2) {
            head = head->next;
            i++;
        }
        return head;
    }
};

```
</TabItem>
</Tabs>

</details>
