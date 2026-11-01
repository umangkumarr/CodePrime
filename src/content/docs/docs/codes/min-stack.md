---
title: "Min Stack"
description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the MinStack class: MinStack() initializes the…"
source: "https://leetcode.com/problems/min-stack/"
tags: ["Stack", "Design"]
complexity:
  time: "O(1)"
  space: "O(n)"
---

## Problem

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

## Solution approach

### Intuition

The minimum can only change when a value is pushed or popped. Keep a second stack `s2` holding the minimums seen so far: its top is always the minimum of everything currently in the main stack `s1`. A new value goes onto `s2` only if it is less than or equal to the current minimum, and it leaves `s2` when that same value is popped from `s1`.

### Algorithm

1. `push(x)`: push `x` onto `s1`. If `s2` is empty or `x <= getMin()`, also push it onto `s2`.
2. `pop()`: if `s1.top()` equals `getMin()`, pop `s2` too. Then pop `s1`.
3. `top()` returns `s1.top()`, and `getMin()` returns `s2.top()`.

### Complexity

- **Time:** $O(1)$ — each operation does a constant number of stack operations.
- **Space:** $O(n)$ — both stacks may hold all `n` pushed values.

### Edge cases

- **Duplicate minimums**: pushing `0` twice puts both copies on `s2` (because of `<=`), so popping one `0` still leaves `0` as the minimum.

## Code

```cpp title="C++"
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
