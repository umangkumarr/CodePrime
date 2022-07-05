---
displayed_sidebar: null
sidebar_position : 33
tags: [Hash Table, Linked List, Two Pointers]
---

# Linked List Cycle

## [Problem](https://leetcode.com/problems/linked-list-cycle/)

<p>Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it.</p>

<p>There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the&nbsp;<code>next</code>&nbsp;pointer. Internally, <code>pos</code>&nbsp;is used to denote the index of the node that&nbsp;tail&#39;s&nbsp;<code>next</code>&nbsp;pointer is connected to.&nbsp;<strong>Note that&nbsp;<code>pos</code>&nbsp;is not passed as a parameter</strong>.</p>

<p>Return&nbsp;<code>true</code><em> if there is a cycle in the linked list</em>. Otherwise, return <code>false</code>.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

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

</details>
