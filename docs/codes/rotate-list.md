---
sidebar_position : 42
tags: [Linked List, Two Pointers]
---

# Rotate List

## [Problem](https://leetcode.com/problems/rotate-list/)

<p>Given the <code>head</code> of a linked&nbsp;list, rotate the list to the right by <code>k</code> places.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    ListNode* rotateRight(ListNode* head, int k) {
        ListNode* temp = head;
        if (!head) return head;
        int n = 1;
        while (temp->next) {
            n++;
            temp = temp->next;
        }
        if (k % n == 0) return head;
        k = k % n;
        temp->next = head;
        temp = head;
        int cnt = 1;
        while (cnt < n - k) {
            cnt++;
            temp = temp->next;
        }
        ListNode* newhead = temp->next;
        temp->next = NULL;
        return newhead;
    }
};

```
</TabItem>
</Tabs>

</details>
