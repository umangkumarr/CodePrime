---
sidebar_position : 1
---

# Rotate a LinkedList

## Problem Link
https://leetcode.com/problems/rotate-list/

## Solution Code

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
