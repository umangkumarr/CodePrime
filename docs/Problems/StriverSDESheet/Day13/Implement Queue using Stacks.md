---
sidebar_position : 4
tags: [Queue, Stack]
---

# Implement Queue using Stacks

## Problem Link
https://leetcode.com/problems/implement-queue-using-stacks/

## Solution Approach
Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class MyQueue {
    stack<int> q1, q2;

   public:
    MyQueue() {}

    void push(int x) { q2.push(x); }

    int pop() {
        peek();
        int a = q1.top();
        q1.pop();
        return a;
    }

    int peek() {
        if (q1.empty()) {
            while (!q2.empty()) {
                q1.push(q2.top());
                q2.pop();
            }
        }
        return q1.top();
    }

    bool empty() { return (q1.empty() && q2.empty()); }
};
```
</TabItem>
</Tabs>

</details>
