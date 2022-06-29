---
sidebar_position : 3
---

# Reverse Nodes in k-Group

## Problem Link
https://leetcode.com/problems/reverse-nodes-in-k-group/
## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    ListNode* reverseKGroup(ListNode* h, int k) {
        ListNode* root;
        root = new ListNode(0);
        ListNode* tail = root;
        tail->next = h;
        ListNode* t = h;
        auto fun = [&](ListNode* t, ListNode* tail, int k) {
            ListNode* h1;
            while (1) {
                int cnt = 0;
                while (t && cnt < k) {
                    ListNode* temp;
                    temp = new ListNode(t->val);
                    temp->next = h1;
                    h1 = temp;
                    cnt++;
                    t = t->next;
                }
                if (cnt < k) return;
                tail->next = h1;
                cnt = 0;
                while (cnt < k) {
                    cnt++;
                    tail = tail->next;
                }
                tail->next = t;
            }
        };
        fun(t, tail, k);
        return root->next;
    }
};
```
</TabItem>
</Tabs>
