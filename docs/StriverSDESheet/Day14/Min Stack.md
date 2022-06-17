---
sidebar_position : 6
tags: [Array, Stack]
---

# Min Stack

## Problem Link
https://leetcode.com/problems/min-stack/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class MinStack {
   private:
    stack<int> s1;
    stack<int> s2;

   public:
    void push(int x) {
        s1.push(x);
        if (s2.empty() || x <= getMin()) s2.push(x);
    }
    void pop() {
        if (s1.top() == getMin()) s2.pop();
        s1.pop();
    }
    int top() { return s1.top(); }
    int getMin() { return s2.top(); }
};
```
</TabItem>
</Tabs>

</details>
