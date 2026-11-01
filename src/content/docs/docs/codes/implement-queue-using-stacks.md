---
title: "Implement Queue using Stacks"
description: "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek,…"
source: "https://leetcode.com/problems/implement-queue-using-stacks/"
tags: ["Stack", "Design", "Queue"]
complexity:
  time: "O(1)"
  space: "O(n)"
---

## Problem

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

## Solution approach

### Intuition

A stack reverses order, so pouring one stack into another reverses it back. New elements go into `q2`. When we need the front of the queue, we pour all of `q2` into `q1`: the oldest element ends up on top of `q1`. Elements are poured only when `q1` is empty, so `q1` always holds the oldest elements in the right order.

### Algorithm

1. `push(x)` pushes `x` onto `q2`.
2. `peek()`: if `q1` is empty, move every element from `q2` to `q1`. Return `q1.top()`.
3. `pop()` calls `peek()` to make sure `q1` holds the front, then pops and returns `q1.top()`.
4. `empty()` is true when both stacks are empty.

### Complexity

- **Time:** $O(1)$ amortised per operation — each element is pushed and popped at most twice in total; a single `peek` or `pop` can take $O(n)$ when it triggers a transfer.
- **Space:** $O(n)$ — every element lives in one of the two stacks.

### Edge cases

- **Interleaved pushes and pops:** new elements stay in `q2` until `q1` runs out, so the order is never mixed.

## Code

```cpp title="C++"
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
