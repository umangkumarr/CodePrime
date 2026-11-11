---
title: "Implement a Queue using array"
description: "Implement a FIFO queue of integers with enqueue, dequeue, front and isEmpty in O(1) using a circular array that doubles when it is full."
source: "https://www.naukri.com/code360/problems/2099908"
difficulty: "Easy"
tags: ["Array", "Queue", "Linked List"]
complexity:
  time: "O(1)"
  space: "O(n)"
---

## Problem

Implement a Queue data structure specifically to store integer data using a singly linked list or an array.

You need to implement the following public functions:

1. **Constructor:** it initialises the data members as required.
2. **`enqueue(data)`:** this function should take one argument of type integer. It enqueues the element into the queue.
3. **`dequeue()`:** it dequeues/removes the element from the front of the queue and in turn returns the element being dequeued or removed. In case the queue is empty, it returns `-1`.
4. **`front()`:** it returns the element being kept at the front of the queue. In case the queue is empty, it returns `-1`.
5. **`isEmpty()`:** it returns a boolean value indicating whether the queue is empty or not.

The judge runs `q` queries, each given on one line:

- `1 data` — enqueue `data`;
- `2` — dequeue and print the removed element (`-1` if the queue is empty);
- `3` — print the front element without removing it (`-1` if the queue is empty);
- `4` — print `true` or `false` depending on whether the queue is empty.

You do not need to print anything yourself; just implement the functions.

**Example 1:**

```text
Input:
1
7
1 17
1 23
1 11
2
2
2
2
Output:
17
23
11
-1
Explanation: The first three queries are of enqueue, so we will push 17, 23, and 11 into the queue.
The next four queries are of dequeue, so we will start removing elements from the queue: the first
element will be 17, then 23, and then 11. After the third dequeue query the queue is empty, so for
the fourth query we return -1.
```

**Example 2:**

```text
Input:
1
3
2
1 10
3
Output:
-1
10
```

**Constraints:**

- $1 \le t \le 5$ test cases
- $1 \le q \le 5000$ queries per test case
- $1 \le x \le 4$ (the query type)
- $1 \le$ `data` $\le 2^{31} - 1$
- Time limit: 1 second.

## Solution approach

### Intuition

The naive array queue appends at the back and removes from the front by shifting every element left — $O(n)$ per `dequeue`. Instead of moving the elements, move the **front index**: keep `head`, the index of the front element, and `count`, the number of stored elements. The element `k` places behind the front lives at `(head + k) % cap`, where `cap = buf.size()`.

Taking indices modulo `cap` makes the array **circular**: when the back reaches the end of the array it wraps around into the slots freed at the start by earlier dequeues, so no space is wasted.

The only time the array cannot take another element is when `count == cap`. Then we copy the elements, in queue order, into an array twice as large. Doubling means a copy of `c` elements happens only after `c / 2` cheap enqueues since the previous copy, so the copying cost averages out to $O(1)$ per `enqueue` and there is no fixed size limit.

### Algorithm

1. Start with a buffer `buf` of a few slots, `head = 0`, `count = 0`.
2. `enqueue(data)`: if `count == buf.size()`, call `grow()`. Write `data` at `(head + count) % buf.size()` and increment `count`.
3. `dequeue()`: if empty, return `-1`. Otherwise read `buf[head]`, advance `head = (head + 1) % buf.size()`, decrement `count`, and return the value.
4. `front()`: `-1` if empty, otherwise `buf[head]`.
5. `isEmpty()`: `count == 0`.
6. `grow()`: allocate twice the space, copy the `count` elements starting at `head` (wrapping) into positions `0..count-1`, and reset `head = 0`.

### Walkthrough

A queue with 4 slots. Blue is `head` (the front); green cells hold queued elements; grey cells are free:

![Circular array queue: enqueue, dequeue, wrap-around and growth](/img/codes/implement-a-queue-using-array/circular-queue/01.webp)

### Complexity

- **Time:** $O(1)$ for `dequeue`, `front` and `isEmpty`; $O(1)$ amortised for `enqueue` (a resize copies all elements, but only after the number of enqueues since the previous resize is at least half of that).
- **Space:** $O(n)$ — the buffer is never more than twice the largest number of elements held at once.

### Edge cases

- **`dequeue` / `front` on an empty queue** (Example 2): both check `isEmpty()` first and return `-1`.
- **Wrap-around:** after some dequeues, new elements are written at the start of the array; the `% buf.size()` arithmetic keeps the order correct.
- **Many elements:** there is no hard capacity; `grow()` doubles the buffer whenever it is full.

## Code

```cpp
class Queue {
    vector<int> buf;  // circular buffer
    int head = 0;     // index of the front element
    int count = 0;    // number of stored elements

    void grow() {
        vector<int> bigger(buf.size() * 2);
        for (int i = 0; i < count; i++) bigger[i] = buf[(head + i) % buf.size()];
        buf.swap(bigger);
        head = 0;
    }

  public:
    Queue() : buf(4) {}

    bool isEmpty() { return count == 0; }

    void enqueue(int data) {
        if (count == (int)buf.size()) grow();
        buf[(head + count) % buf.size()] = data;
        count++;
    }

    int dequeue() {
        if (isEmpty()) return -1;
        int x = buf[head];
        head = (head + 1) % buf.size();
        count--;
        return x;
    }

    int front() { return isEmpty() ? -1 : buf[head]; }
};
```

```java
class Queue {
    private int[] buf = new int[4];  // circular buffer
    private int head = 0;            // index of the front element
    private int count = 0;           // number of stored elements

    private void grow() {
        int[] bigger = new int[buf.length * 2];
        for (int i = 0; i < count; i++) bigger[i] = buf[(head + i) % buf.length];
        buf = bigger;
        head = 0;
    }

    Queue() {}

    boolean isEmpty() { return count == 0; }

    void enqueue(int data) {
        if (count == buf.length) grow();
        buf[(head + count) % buf.length] = data;
        count++;
    }

    int dequeue() {
        if (isEmpty()) return -1;
        int x = buf[head];
        head = (head + 1) % buf.length;
        count--;
        return x;
    }

    int front() { return isEmpty() ? -1 : buf[head]; }
}
```

```python
class Queue:
    def __init__(self):
        self.buf = [0] * 4  # circular buffer
        self.head = 0       # index of the front element
        self.count = 0      # number of stored elements

    def _grow(self):
        size = len(self.buf)
        self.buf = [self.buf[(self.head + i) % size] for i in range(self.count)] + [0] * size
        self.head = 0

    def isEmpty(self) -> bool:
        return self.count == 0

    def enqueue(self, data: int) -> None:
        if self.count == len(self.buf):
            self._grow()
        self.buf[(self.head + self.count) % len(self.buf)] = data
        self.count += 1

    def dequeue(self) -> int:
        if self.isEmpty():
            return -1
        x = self.buf[self.head]
        self.head = (self.head + 1) % len(self.buf)
        self.count -= 1
        return x

    def front(self) -> int:
        return -1 if self.isEmpty() else self.buf[self.head]
```
