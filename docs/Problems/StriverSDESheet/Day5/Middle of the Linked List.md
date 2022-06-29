---
sidebar_position : 2
---

# Middle of the Linked List

## Problem Link
https://leetcode.com/problems/middle-of-the-linked-list/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
