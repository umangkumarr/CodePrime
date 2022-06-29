---
sidebar_position : 6
tags: [Tree, Breadth-First Search, Binary Tree]
---

#  Binary Search Tree Iterator

## Problem Link
https://leetcode.com/problems/binary-search-tree-iterator/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class BSTIterator {
    stack<TreeNode *> myStack;

   public:
    BSTIterator(TreeNode *root) { pushAll(root); }

    bool hasNext() { return !myStack.empty(); }

    int next() {
        TreeNode *tmpNode = myStack.top();
        myStack.pop();
        pushAll(tmpNode->right);
        return tmpNode->val;
    }

   private:
    void pushAll(TreeNode *node) {
        for (; node != NULL; myStack.push(node), node = node->left)
            ;
    }
};
```
</TabItem>
</Tabs>

</details>
