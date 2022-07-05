---
displayed_sidebar: null
sidebar_position : 26
tags: [Linked List]
---

# Delete Node in a Linked List

## [Problem](https://leetcode.com/problems/delete-node-in-a-linked-list/)

<p>Write a function to <strong>delete a node</strong> in a singly-linked list. You will <strong>not</strong> be given access to the <code>head</code> of the list, instead you will be given access to <strong>the node to be deleted</strong> directly.</p>

<p>It is <strong>guaranteed</strong> that the node to be deleted is <strong>not a tail node</strong> in the list.</p>

## Solution Approach


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
public:
    void deleteNode(ListNode* node) {
        *node = *node->next;
    }
};

```
</TabItem>
</Tabs>

</details>
