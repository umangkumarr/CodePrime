---
displayed_sidebar: null
sidebar_position : 31
tags: [Linked List, Two Pointers, Stack, Recursion]
---

# Palindrome Linked List

## [Problem](https://leetcode.com/problems/palindrome-linked-list/)

<p>Given the <code>head</code> of a singly linked list, return <code>true</code> if it is a palindrome.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

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

</details>
