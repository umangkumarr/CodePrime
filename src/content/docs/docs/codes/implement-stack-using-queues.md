---
title: "Implement Stack using Queues"
description: "Build a LIFO stack from a single FIFO queue by rotating the queue after every push so the newest element is always at the front."
source: "https://leetcode.com/problems/implement-stack-using-queues/"
difficulty: "Easy"
tags: ["Stack", "Design", "Queue"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (`push`, `top`, `pop`, and `empty`).

Implement the `MyStack` class:

- `void push(int x)` Pushes element `x` to the top of the stack.
- `int pop()` Removes the element on the top of the stack and returns it.
- `int top()` Returns the element on the top of the stack.
- `boolean empty()` Returns `true` if the stack is empty, `false` otherwise.

**Notes:**

- You must use **only** standard operations of a queue, which means that only `push to back`, `peek/pop from front`, `size` and `is empty` operations are valid.
- Depending on your language, the queue may not be supported natively. You may simulate a queue using a list or deque (double-ended queue) as long as you use only a queue's standard operations.

**Example 1:**

```text
Input:
["MyStack", "push", "push", "top", "pop", "empty"]
[[], [1], [2], [], [], []]
Output:
[null, null, null, 2, 2, false]

Explanation:
MyStack myStack = new MyStack();
myStack.push(1);
myStack.push(2);
myStack.top();   // return 2
myStack.pop();   // return 2
myStack.empty(); // return False
```

**Constraints:**

- $1 \le$ `x` $\le 9$
- At most `100` calls will be made to `push`, `pop`, `top`, and `empty`.
- All the calls to `pop` and `top` are valid.

**Follow-up:** Can you implement the stack using only one queue?

## Solution approach

### Intuition

A queue gives access only to its **front**, while a stack needs access to the **newest** element. So we make sure the newest element is always at the front of the queue.

Keep this invariant: reading the queue from front to back lists the stack from top to bottom. When `x` is pushed it lands at the back, behind the `k` older elements. Popping each of those `k` elements from the front and pushing it to the back again — a full rotation — moves them behind `x`, in the same relative order. Now `x` is at the front, followed by the old stack from top to bottom, so the invariant holds again.

With that invariant, `top` is just `front`, and `pop` is just popping the front. This uses a single queue, which answers the follow-up (the two-queue version does the same rotation through a helper queue).

### Algorithm

1. `push(x)`: `q.push(x)`, then repeat `q.size() - 1` times: `q.push(q.front()); q.pop();`.
2. `top()`: return `q.front()`.
3. `pop()`: save `q.front()`, pop it, and return the saved value.
4. `empty()`: return `q.empty()`.

### Walkthrough

The queue is written front first:

| Operation | Queue after the operation | Returns |
| --- | --- | --- |
| `push(1)` | `[1]` (nothing to rotate) | — |
| `push(2)` | `[1, 2]` → rotate 1 → `[2, 1]` | — |
| `push(3)` | `[2, 1, 3]` → rotate 2 → `[3, 2, 1]` | — |
| `top()` | `[3, 2, 1]` | `3` |
| `pop()` | `[2, 1]` | `3` |

### Complexity

- **Time:** $O(n)$ for `push`, where $n$ is the current number of elements — it rotates the whole queue once. `pop`, `top` and `empty` are $O(1)$.
- **Space:** $O(n)$ — one queue holding every element.

The cost could instead be moved to `pop` (push in $O(1)$, rotate to reach the newest element when popping). Since `top` would then also need the rotation, putting the work in `push` keeps three of the four operations constant-time.

### Edge cases

- **Pushing onto an empty stack:** `q.size() - 1 = 0`, so no rotation happens.
- **`pop` / `top` on an empty stack:** the problem guarantees every call is valid, so no check is needed.

## Code

```cpp
class MyStack {
    queue<int> q;  // front of q is the top of the stack

  public:
    MyStack() {}

    void push(int x) {
        q.push(x);
        // Move the older elements behind x so that x is at the front.
        for (int i = 0; i + 1 < (int)q.size(); i++) {
            q.push(q.front());
            q.pop();
        }
    }

    int pop() {
        int x = q.front();
        q.pop();
        return x;
    }

    int top() { return q.front(); }

    bool empty() { return q.empty(); }
};
```

```java
class MyStack {
    private final ArrayDeque<Integer> q = new ArrayDeque<>();  // front of q is the top of the stack

    public MyStack() {}

    public void push(int x) {
        q.offer(x);
        // Move the older elements behind x so that x is at the front.
        for (int i = 0; i + 1 < q.size(); i++) q.offer(q.poll());
    }

    public int pop() { return q.poll(); }

    public int top() { return q.peek(); }

    public boolean empty() { return q.isEmpty(); }
}
```

```python
from collections import deque


class MyStack:

    def __init__(self):
        self.q = deque()  # front of q is the top of the stack

    def push(self, x: int) -> None:
        self.q.append(x)
        # Move the older elements behind x so that x is at the front.
        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft())

    def pop(self) -> int:
        return self.q.popleft()

    def top(self) -> int:
        return self.q[0]

    def empty(self) -> bool:
        return not self.q
```
