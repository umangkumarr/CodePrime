---
sidebar_position : 19
tags: [Stack, Design]
---

# Min Stack

## [Problem](https://leetcode.com/problems/min-stack/)

<p>Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.</p>

<p>Implement the <code>MinStack</code> class:</p>

<ul>
	<li><code>MinStack()</code> initializes the stack object.</li>
	<li><code>void push(int val)</code> pushes the element <code>val</code> onto the stack.</li>
	<li><code>void pop()</code> removes the element on the top of the stack.</li>
	<li><code>int top()</code> gets the top element of the stack.</li>
	<li><code>int getMin()</code> retrieves the minimum element in the stack.</li>
</ul>

<p>You must implement a solution with <code>O(1)</code> time complexity for each function.</p>

## Solution Approach

Expected Time complexity: $O(1)$

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
