---
sidebar_position : 5
---

# Add Two Numbers

## Problem Link
https://leetcode.com/problems/add-two-numbers/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
