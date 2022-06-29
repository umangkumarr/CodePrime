---
sidebar_position : 2
---

# Linked List Cycle

## Problem Link
https://leetcode.com/problems/linked-list-cycle/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    bool hasCycle(ListNode* head) {
        map<ListNode*, int> mp;
        ListNode* temp;
        temp = head;
        while (temp != NULL) {
            mp[temp] = 1;
            if (mp.find(temp->next) != mp.end()) {
                temp->next = NULL;
                return true;
                break;
            }
            temp = temp->next;
        }
        return false;
    }
};
```
</TabItem>
</Tabs>
