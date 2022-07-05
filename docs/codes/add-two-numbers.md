---
displayed_sidebar: null
sidebar_position : 25
tags: [Linked List, Math, Recursion]
displayed_sidebars:

---

# Add Two Numbers

## [Problem](https://leetcode.com/problems/add-two-numbers/)

<p>You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The digits are stored in <strong>reverse order</strong>, and each of their nodes contains a single digit. Add the two numbers and return the sum&nbsp;as a linked list.</p>

<p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        int carry = 0;
        ListNode root(0), *p = &root;
        while (l1 || l2 || carry) {
            int sm = (l1 ? l1->val : 0) + (l2 ? l2->val : 0) + carry;
            p->next = new ListNode(sm % 10);
            carry = sm / 10;
            l1 = (l1 ? l1->next : l1);
            l2 = (l2 ? l2->next : l2);
            p = p->next;
        }
        return root.next;
    }
};

```
</TabItem>
</Tabs>

</details>
