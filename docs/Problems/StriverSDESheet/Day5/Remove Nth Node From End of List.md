---
sidebar_position : 4
---

# Remove Nth Node From End of List

## Problem Link
https://leetcode.com/problems/remove-nth-node-from-end-of-list/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
