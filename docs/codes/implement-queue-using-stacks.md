---
sidebar_position : 79
tags: [Stack, Design, Queue]
---

# Implement Queue using Stacks

## [Problem](https://leetcode.com/problems/implement-queue-using-stacks/)

<p>Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (<code>push</code>, <code>peek</code>, <code>pop</code>, and <code>empty</code>).</p>

<p>Implement the <code>MyQueue</code> class:</p>

<ul>
	<li><code>void push(int x)</code> Pushes element x to the back of the queue.</li>
	<li><code>int pop()</code> Removes the element from the front of the queue and returns it.</li>
	<li><code>int peek()</code> Returns the element at the front of the queue.</li>
	<li><code>boolean empty()</code> Returns <code>true</code> if the queue is empty, <code>false</code> otherwise.</li>
</ul>

<p><strong>Notes:</strong></p>

<ul>
	<li>You must use <strong>only</strong> standard operations of a stack, which means only <code>push to top</code>, <code>peek/pop from top</code>, <code>size</code>, and <code>is empty</code> operations are valid.</li>
	<li>Depending on your language, the stack may not be supported natively. You may simulate a stack using a list or deque (double-ended queue) as long as you use only a stack&#39;s standard operations.</li>
</ul>

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
