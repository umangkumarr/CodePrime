---
sidebar_position : 2
---

# Copy List with Random Pointer

## Problem Link
https://leetcode.com/problems/copy-list-with-random-pointer/

## Solution Code

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
