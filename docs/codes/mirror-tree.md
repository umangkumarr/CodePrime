---
sidebar_position : 6
tags: [Tree, Binary Tree, Depth-First Search, Linked List]
---

# Mirror Tree

## [Problem](https://practice.geeksforgeeks.org/problems/mirror-tree/1)

<p><span >Given a Binary Tree, convert it into its mirror.<br/>
<img alt="MirrorTree1" src="https://contribute.geeksforgeeks.org/wp-content/uploads/mirrortrees.jpg" title="MirrorTree1" /></span></p>


## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
void mirror(struct Node* node) {
    if (!node) return;

    struct Node* t1 = node->left;
    struct Node* t2 = node->right;
    node->left = t2;
    node->right = t1;

    mirror(node->left);
    mirror(node->right);
}
```
</TabItem>
</Tabs>

</details>
