---
displayed_sidebar: null
sidebar_position : 1
tags: [Stack, Array]
---

# Implement Stack Using Arrays

## [Problem](https://bit.ly/39xnASI)

Implement a stack using arrays.

## Solution Approach
Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Stack {
    vector<int> v;
    int n;
    int c;

   public:
    Stack(int capacity) {
        v.resize(capacity);
        c = capacity;
        n = 0;
    }

    void push(int num) { v[n++] = num; }

    int pop() {
        if (n == 0) return -1;
        int a = v[--n];
        return a;
    }

    int top() {
        if (n == 0) return -1;
        return v[n - 1];
    }

    int isEmpty() { return (n == 0); }

    int isFull() { return c <= n; }
};
```
</TabItem>
</Tabs>

</details>
