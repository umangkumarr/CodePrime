---
title: "Implement Stack Using Arrays"
description: "Implement a stack using arrays."
source: "https://bit.ly/39xnASI"
tags: ["Stack", "Array"]
complexity:
  time: "O(1)"
  space: "O(c)"
---

## Problem

Implement a stack using arrays.

## Solution approach

### Intuition

A stack only ever touches its top element, so a fixed array plus a counter is enough. The counter `n` is the number of stored elements, which also means `v[n - 1]` is the top and `v[n]` is the next free slot.

### Algorithm

1. The constructor resizes `v` to `capacity`, stores it in `c`, and sets `n = 0`.
2. `push(num)` writes `num` into `v[n]` and increments `n`.
3. `pop()` returns `-1` if the stack is empty; otherwise it decrements `n` and returns `v[n]`.
4. `top()` returns `v[n - 1]`, or `-1` if empty.
5. `isEmpty()` checks `n == 0`, and `isFull()` checks `c <= n`.

### Complexity

- **Time:** $O(1)$ per operation — each is a single array access and counter update.
- **Space:** $O(c)$ — the array is allocated with the full capacity up front.

### Edge cases

- **Empty stack:** `pop` and `top` return `-1`.
- **Full stack:** `push` does not check `isFull()`, so pushing beyond the capacity writes past the end of `v`. The caller must check first.

## Code

```cpp title="C++"
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
