---
title: "Implement Stack using Queues"
description: "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top,…"
source: "https://leetcode.com/problems/implement-stack-using-queues/"
tags: ["Stack", "Design", "Queue"]
complexity:
  time: "O(1)"
  space: "O(n)"
---

## Problem

<p>Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (<code>push</code>, <code>top</code>, <code>pop</code>, and <code>empty</code>).</p>

<p>Implement the <code>MyStack</code> class:</p>

<ul>
	<li><code>void push(int x)</code> Pushes element x to the top of the stack.</li>
	<li><code>int pop()</code> Removes the element on the top of the stack and returns it.</li>
	<li><code>int top()</code> Returns the element on the top of the stack.</li>
	<li><code>boolean empty()</code> Returns <code>true</code> if the stack is empty, <code>false</code> otherwise.</li>
</ul>

<p><b>Notes:</b></p>

<ul>
	<li>You must use <strong>only</strong> standard operations of a queue, which means that only <code>push to back</code>, <code>peek/pop from front</code>, <code>size</code> and <code>is empty</code> operations are valid.</li>
	<li>Depending on your language, the queue may not be supported natively. You may simulate a queue using a list or deque (double-ended queue) as long as you use only a queue&#39;s standard operations.</li>
</ul>

## Solution approach

### Intuition

A stack needs access to only one end: the most recently added element. This code stores the elements in a `deque` and uses its back as the top of the stack, so every operation is a single deque call.

### Algorithm

1. `push(x)` appends `x` with `q.push_back(x)`.
2. `top()` returns `q.back()`, the most recent element.
3. `pop()` reads `top()`, removes it with `q.pop_back()`, and returns it.
4. `empty()` returns `q.empty()`.

### Complexity

- **Time:** $O(1)$ per operation — each is a single deque operation at the back.
- **Space:** $O(n)$ — one slot per stored element.

### Edge cases

- This uses `push_back`, `back` and `pop_back` on the same end of a `deque`, which are not standard queue operations. The usual intended solution rotates a queue on every `push` so that only `push` to the back and `pop` from the front are used.

## Code

```cpp title="C++"
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
