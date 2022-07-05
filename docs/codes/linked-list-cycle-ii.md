---
displayed_sidebar: null
sidebar_position : 36
tags: [Hash Table, Linked List, Two Pointers]
---

# Linked List Cycle II

## [Problem](https://leetcode.com/problems/linked-list-cycle-ii/)

<p>Given the <code>head</code> of a linked list, return <em>the node where the cycle begins. If there is no cycle, return </em><code>null</code>.</p>

<p>There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer. Internally, <code>pos</code> is used to denote the index of the node that tail&#39;s <code>next</code> pointer is connected to (<strong>0-indexed</strong>). It is <code>-1</code> if there is no cycle. <strong>Note that</strong> <code>pos</code> <strong>is not passed as a parameter</strong>.</p>

<p><strong>Do not modify</strong> the linked list.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

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

</details>
