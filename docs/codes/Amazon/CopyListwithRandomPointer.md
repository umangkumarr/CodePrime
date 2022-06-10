---
tags: [Hash Table, Linked List]
---

# Copy List with Random Pointer

## Problem Link
https://leetcode.com/problems/copy-list-with-random-pointer/

## Solution Approach

Hash Nodes of the original node in a map, then make a new Linked List and, using the hashed value of nodes, make the connections in the new linked list.

Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>
<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    Node* copyRandomList(Node* head) {
        Node* temp = head;
        map<Node*, Node*> mp;
        while (temp) {
            Node* newNode = new Node(temp->val);
            mp[temp] = newNode;
            temp = temp->next;
        }
        temp = head;
        while (temp) {
            mp[temp]->next = mp[temp->next];
            mp[temp]->random = mp[temp->random];
            temp = temp->next;
        }
        return mp[head];
    }
};
```
</TabItem>
</Tabs>
</details>

<!-- <p style={{color: "red" }}> don no write </p> -->