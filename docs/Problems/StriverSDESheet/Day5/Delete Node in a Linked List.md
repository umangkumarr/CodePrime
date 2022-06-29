---
sidebar_position : 6
---

# Delete Node in a Linked List

## Problem Link
https://leetcode.com/problems/delete-node-in-a-linked-list/
## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
