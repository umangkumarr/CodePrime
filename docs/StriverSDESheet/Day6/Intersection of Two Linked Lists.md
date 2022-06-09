---
sidebar_position : 1
---

# Intersection of Two Linked Lists

## Problem Link
https://leetcode.com/problems/intersection-of-two-linked-lists/ 

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        map<ListNode *, int> mp;
        ListNode *temp;
        temp = new ListNode;
        temp = headA;
        while (temp) {
            mp[temp] = 1;
            temp = temp->next;
        }
        temp = headB;
        while (temp) {
            if (mp[temp]) return temp;
            temp = temp->next;
        }
        return NULL;
    }
};
```
</TabItem>
</Tabs>
