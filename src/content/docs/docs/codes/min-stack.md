---
title: "Min Stack"
description: "Design a stack supporting push, pop, top and getMin in O(1) time each, using an auxiliary stack that tracks the running minimum."
source: "https://leetcode.com/problems/min-stack/"
difficulty: "Medium"
tags: ["Stack", "Design"]
complexity:
  time: "O(1)"
  space: "O(n)"
---

## Problem

Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the `MinStack` class:

- `MinStack()` initializes the stack object.
- `void push(int val)` pushes the element `val` onto the stack.
- `void pop()` removes the element on the top of the stack.
- `int top()` gets the top element of the stack.
- `int getMin()` retrieves the minimum element in the stack.

You must implement a solution with $O(1)$ time complexity for each function.

**Example 1:**

```text
Input
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

Output
[null,null,null,null,-3,null,0,-2]

Explanation
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin(); // return -3
minStack.pop();
minStack.top();    // return 0
minStack.getMin(); // return -2
```

**Constraints:**

- $-2^{31} \le \text{val} \le 2^{31} - 1$
- Methods `pop`, `top` and `getMin` operations will always be called on **non-empty** stacks.
- At most $3 \times 10^4$ calls will be made to `push`, `pop`, `top`, and `getMin`.

## Solution approach

### Intuition

A stack only changes at its top, so the minimum of the stack can only change on a `push` or a `pop`. If we remember, for the current stack contents, "what was the minimum when this element became the minimum", we can restore the previous minimum the moment that element is popped.

Keep a second stack `mins` alongside the main stack `st`. Invariant: **`mins.top()` is the minimum of all elements currently in `st`**, and `mins` holds, in order, every value that was a new minimum (ties included) at the moment it was pushed and is still in `st`.

- When `val` is pushed and `val <= mins.top()`, it becomes the new minimum, so it goes on `mins` too.
- When the popped value equals `mins.top()`, that copy of the minimum leaves the stack, so it leaves `mins` too, and the minimum before it reappears on top.

Ties must be pushed (`<=`, not `<`): with two equal minimums in `st`, popping one must leave the other on `mins`.

### Algorithm

1. `push(val)`: push `val` onto `st`; if `mins` is empty or `val <= mins.top()`, push it onto `mins`.
2. `pop()`: if `st.top() == mins.top()`, pop `mins`; then pop `st`.
3. `top()` returns `st.top()`; `getMin()` returns `mins.top()`.

### Walkthrough

Example 1:

| Operation | `st` (bottom → top) | `mins` (bottom → top) | Returns |
| --- | --- | --- | --- |
| `push(-2)` | `-2` | `-2` | |
| `push(0)` | `-2, 0` | `-2` | |
| `push(-3)` | `-2, 0, -3` | `-2, -3` | |
| `getMin()` | `-2, 0, -3` | `-2, -3` | `-3` |
| `pop()` | `-2, 0` | `-2` | |
| `top()` | `-2, 0` | `-2` | `0` |
| `getMin()` | `-2, 0` | `-2` | `-2` |

### Complexity

- **Time:** $O(1)$ for every operation — each does a constant number of stack operations.
- **Space:** $O(n)$ — `st` holds all `n` elements and `mins` at most `n` (only when values arrive in non-increasing order).

### Edge cases

- **Duplicate minimums:** `push(0), push(0), pop()` leaves one `0` on `mins` thanks to `<=`, so `getMin()` still returns `0`.
- **Extreme values:** values are stored as `int` and only compared, so $-2^{31}$ and $2^{31} - 1$ cause no overflow (unlike the "store `2 * val - min`" trick, which needs `long long`).

## Code

```cpp
class MinStack {
   public:
    void push(int val) {
        st.push(val);
        if (mins.empty() || val <= mins.top()) mins.push(val);
    }

    void pop() {
        if (st.top() == mins.top()) mins.pop();
        st.pop();
    }

    int top() { return st.top(); }

    int getMin() { return mins.top(); }

   private:
    stack<int> st;
    stack<int> mins;  // mins.top() is the minimum of st
};
```

```java
class MinStack {
    private final Deque<Integer> st = new ArrayDeque<>();
    private final Deque<Integer> mins = new ArrayDeque<>();  // mins.peek() is the minimum of st

    public MinStack() {
    }

    public void push(int value) {
        st.push(value);
        if (mins.isEmpty() || value <= mins.peek()) mins.push(value);
    }

    public void pop() {
        int x = st.pop();
        if (x == mins.peek()) mins.pop();
    }

    public int top() {
        return st.peek();
    }

    public int getMin() {
        return mins.peek();
    }
}
```

```python
class MinStack:

    def __init__(self):
        self.st = []
        self.mins = []  # mins[-1] is the minimum of st

    def push(self, value: int) -> None:
        self.st.append(value)
        if not self.mins or value <= self.mins[-1]:
            self.mins.append(value)

    def pop(self) -> None:
        if self.st.pop() == self.mins[-1]:
            self.mins.pop()

    def top(self) -> int:
        return self.st[-1]

    def getMin(self) -> int:
        return self.mins[-1]
```
