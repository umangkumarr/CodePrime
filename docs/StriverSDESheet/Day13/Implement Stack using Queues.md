---
sidebar_position : 3
tags: [Queue, Stack]
---

# Implement Stack using Queues

## Problem Link
https://leetcode.com/problems/implement-stack-using-queues/

## Solution Approach
Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class MyStack {
    deque<int> q;

   public:
    MyStack() {}

    void push(int x) { q.push_back(x); }

    int pop() {
        int x = top();
        q.pop_back();
        return x;
    }

    int top() { return q.back(); }

    bool empty() { return q.empty(); }
};
```
</TabItem>
</Tabs>

</details>
