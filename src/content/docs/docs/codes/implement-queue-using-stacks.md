---
title: "Implement Queue using Stacks"
description: "Build a FIFO queue from two LIFO stacks, an input stack and an output stack that is refilled only when empty, giving amortised O(1) operations."
source: "https://leetcode.com/problems/implement-queue-using-stacks/"
difficulty: "Easy"
tags: ["Stack", "Design", "Queue"]
complexity:
  time: "O(1)"
  space: "O(n)"
---

## Problem

Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (`push`, `peek`, `pop`, and `empty`).

Implement the `MyQueue` class:

- `void push(int x)` Pushes element `x` to the back of the queue.
- `int pop()` Removes the element from the front of the queue and returns it.
- `int peek()` Returns the element at the front of the queue.
- `boolean empty()` Returns `true` if the queue is empty, `false` otherwise.

**Notes:**

- You must use **only** standard operations of a stack, which means only `push to top`, `peek/pop from top`, `size`, and `is empty` operations are valid.
- Depending on your language, the stack may not be supported natively. You may simulate a stack using a list or deque (double-ended queue) as long as you use only a stack's standard operations.

**Example 1:**

```text
Input:
["MyQueue", "push", "push", "peek", "pop", "empty"]
[[], [1], [2], [], [], []]
Output:
[null, null, null, 1, 1, false]

Explanation:
MyQueue myQueue = new MyQueue();
myQueue.push(1); // queue is: [1]
myQueue.push(2); // queue is: [1, 2] (leftmost is front of the queue)
myQueue.peek();  // return 1
myQueue.pop();   // return 1, queue is [2]
myQueue.empty(); // return false
```

**Constraints:**

- $1 \le$ `x` $\le 9$
- At most `100` calls will be made to `push`, `pop`, `peek`, and `empty`.
- All the calls to `pop` and `peek` are valid.

**Follow-up:** Can you implement the queue such that each operation is **[amortized](https://en.wikipedia.org/wiki/Amortized_analysis)** `O(1)` time complexity? In other words, performing `n` operations will take overall `O(n)` time even if one of those operations may take longer.

## Solution approach

### Intuition

A stack returns elements in reverse order of arrival. Pouring one stack into another (pop from the first, push onto the second, until the first is empty) reverses them **again**, so the oldest element ends up on top of the second stack — exactly where a queue needs its front.

Use two stacks with fixed roles:

- `in` receives every `push`;
- `out` serves `peek` and `pop`; its top is always the front of the queue.

The key rule is to pour `in` into `out` **only when `out` is empty**. Everything in `out` arrived before everything in `in`, so as long as `out` has elements its top is the oldest element overall. Pouring while `out` still held elements would bury those older elements under newer ones and break the order.

### Algorithm

1. `push(x)`: `in.push(x)`.
2. `peek()`: if `out` is empty, move every element from `in` to `out` (top by top). Return `out.top()`.
3. `pop()`: call `peek()` to make sure `out` holds the front, then pop `out` and return that value.
4. `empty()`: both stacks are empty.

### Walkthrough

Pushing `1, 2, 3`, popping twice, pushing `4`, then popping twice (stack tops are on the right):

| Operation | `in` | `out` | Returns |
| --- | --- | --- | --- |
| `push(1)`, `push(2)`, `push(3)` | `[1, 2, 3]` | `[]` | — |
| `pop()` — `out` empty, pour | `[]` | `[3, 2]` | `1` |
| `pop()` | `[]` | `[3]` | `2` |
| `push(4)` | `[4]` | `[3]` | — |
| `pop()` — `out` not empty, no pour | `[4]` | `[]` | `3` |
| `pop()` — `out` empty, pour | `[]` | `[]` | `4` |

Note how `4` waits in `in` until `3`, which is older, has left `out`.

### Complexity

- **Time:** $O(1)$ amortised per operation, which answers the follow-up. A single `peek` or `pop` that pours can cost $O(n)$, but each element is moved from `in` to `out` **at most once** in its lifetime: it is pushed onto `in` once, moved once, and popped from `out` once. So `n` operations do $O(n)$ work in total.
- **Space:** $O(n)$ — every element lives in exactly one of the two stacks.

### Edge cases

- **Interleaved pushes and pops:** new elements wait in `in` until `out` runs dry, so the FIFO order is never mixed.
- **`pop` / `peek` on an empty queue:** the problem guarantees every call is valid, so no check is needed.

## Code

```cpp
class MyQueue {
    stack<int> in, out;  // out's top is the front of the queue

  public:
    MyQueue() {}

    void push(int x) { in.push(x); }

    int pop() {
        int front = peek();
        out.pop();
        return front;
    }

    int peek() {
        if (out.empty()) {
            while (!in.empty()) {
                out.push(in.top());
                in.pop();
            }
        }
        return out.top();
    }

    bool empty() { return in.empty() && out.empty(); }
};
```

```java
class MyQueue {
    private final ArrayDeque<Integer> in = new ArrayDeque<>();
    private final ArrayDeque<Integer> out = new ArrayDeque<>();  // out's top is the front of the queue

    public MyQueue() {}

    public void push(int x) { in.push(x); }

    public int pop() {
        int front = peek();
        out.pop();
        return front;
    }

    public int peek() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());
        }
        return out.peek();
    }

    public boolean empty() { return in.isEmpty() && out.isEmpty(); }
}
```

```python
class MyQueue:

    def __init__(self):
        self.inbox = []
        self.outbox = []  # outbox's top (last element) is the front of the queue

    def push(self, x: int) -> None:
        self.inbox.append(x)

    def pop(self) -> int:
        front = self.peek()
        self.outbox.pop()
        return front

    def peek(self) -> int:
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())
        return self.outbox[-1]

    def empty(self) -> bool:
        return not self.inbox and not self.outbox
```
