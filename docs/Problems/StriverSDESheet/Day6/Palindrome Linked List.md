---
sidebar_position : 4
---

# Palindrome Linked List

## Problem Link
https://leetcode.com/problems/palindrome-linked-list/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    bool isPalindrome(ListNode* head) {
        vector<int> a, b;
        while (head) {
            a.push_back(head->val);
            head = head->next;
        }
        b = a;
        reverse(b.begin(), b.end());
        if (a == b) return true;
        return false;
    }
};
```
</TabItem>
</Tabs>
