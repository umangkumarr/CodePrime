---
displayed_sidebar: null
sidebar_position : 34
tags: [Linked List, Recursion]
---

# Reverse Nodes in k-Group

## [Problem](https://leetcode.com/problems/reverse-nodes-in-k-group/)

<p>Given the <code>head</code> of a linked list, reverse the nodes of the list <code>k</code> at a time, and return <em>the modified list</em>.</p>

<p><code>k</code> is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of <code>k</code> then left-out nodes, in the end, should remain as it is.</p>

<p>You may not alter the values in the list&#39;s nodes, only nodes themselves may be changed.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

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

</details>
