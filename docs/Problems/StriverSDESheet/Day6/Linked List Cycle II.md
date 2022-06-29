---
sidebar_position : 5
---

# Linked List Cycle II

## Problem Link
https://leetcode.com/problems/linked-list-cycle-ii/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    ListNode *detectCycle(ListNode *head) {
        map<ListNode *, int> mp;
        ListNode *temp;
        temp = head;
        int i = 0;
        while (temp != NULL) {
            mp[temp] = i;
            if (mp.find(temp->next) != mp.end()) {
                return temp->next;
                break;
            }
            temp = temp->next;
            i++;
        }
        return NULL;
    }
};
```
</TabItem>
</Tabs>
