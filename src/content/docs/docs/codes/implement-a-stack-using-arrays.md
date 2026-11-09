---
title: "Implement Stack Using Arrays"
description: "Implement a fixed-capacity LIFO stack with push, pop, top, isEmpty and isFull in O(1) using an array and a count of stored elements."
source: "https://www.naukri.com/code360/problems/stack-implementation-using-array_3210209"
difficulty: "Easy"
tags: ["Stack", "Array"]
complexity:
  time: "O(1)"
  space: "O(n)"
---

## Problem

Stack is a data structure that follows the LIFO (Last In, First Out) principle. Design and implement a stack to implement the following functions:

1. **`push(num)`:** push the given number onto the stack if the stack is not full.
2. **`pop`:** remove and print the top element from the stack if present, else print `-1`.
3. **`top`:** print the top element of the stack if present, else print `-1`.
4. **`isEmpty`:** print `1` if the stack is empty, else print `0`.
5. **`isFull`:** print `1` if the stack is full, else print `0`.

You have been given `m` operations which you need to perform on a stack of capacity `n`. Your task is to implement all the functions of the stack. Each operation is given on its own line as its number (`1` to `5`), followed by `num` for `push`.

You do not need to print anything yourself; the functions return the values and the judge prints them.

**Example 1:**

```text
Input:
2 6
1 1
1 2
2
3
4
5
Output:
2
1
0
0
Explanation: We perform the following operations on an empty stack which has capacity 2:
When operation 1 1 is performed, we insert 1 in the stack.
When operation 1 2 is performed, we insert 2 in the stack.
When operation 2 is performed, we remove the top element from the stack and print 2.
When operation 3 is performed, we print the top element of the stack, i.e., 1.
When operation 4 is performed, we print 0 because the stack is not empty.
When operation 5 is performed, we print 0 because the stack is size 1, which is not equal to its capacity.
```

**Example 2:**

```text
Input:
5 5
1 2
2
2
1 1
3
Output:
2
-1
1
Explanation: We perform the following operations on an empty stack which has a capacity of 5:
When operation 1 2 is performed, we insert 2 in the stack.
When operation 2 is performed, we remove the top element from the stack and print 2.
When operation 2 is performed, as the stack is empty, we print -1.
When operation 1 1 is performed, we insert 1 in the stack.
When operation 3 is performed, we print the top element of the stack, i.e., 1.
```

**Constraints:**

- $1 \le n, m \le 10^3$
- Time limit: 1 second.

## Solution approach

### Intuition

A stack only ever touches one end — the top — so an array plus a counter is all it needs. Keep `count`, the number of stored elements, with the invariant:

- `arr[0..count-1]` holds the stack from bottom to top, so the top is `arr[count - 1]`;
- `arr[count]` is the next free slot.

Push writes into the free slot and increments `count`; pop decrements `count` and reads the slot it just gave up. Nothing is ever shifted, so every operation is a single array access.

### Algorithm

1. The constructor allocates `arr` with `capacity` slots and sets `count = 0`.
2. `push(num)`: if `isFull()`, ignore it; otherwise `arr[count++] = num`.
3. `pop()`: if `isEmpty()`, return `-1`; otherwise return `arr[--count]`.
4. `top()`: `-1` if empty, otherwise `arr[count - 1]`.
5. `isEmpty()` is `count == 0`; `isFull()` is `count == capacity`.

### Complexity

- **Time:** $O(1)$ per operation — one comparison and at most one array access.
- **Space:** $O(n)$ — the array is allocated with the full capacity `n` up front.

### Edge cases

- **`pop` / `top` on an empty stack** (Example 2): both return `-1` without touching `arr`.
- **`push` on a full stack:** the element is ignored, so nothing is ever written past the end of `arr`.
- A popped value stays in `arr` until it is overwritten, but it is outside `arr[0..count-1]` and therefore no longer part of the stack.

## Code

```cpp title="C++"
class Stack {
    vector<int> arr;
    int count = 0;  // number of elements; the top is arr[count - 1]

  public:
    Stack(int capacity) : arr(capacity) {}

    void push(int num) {
        if (isFull()) return;
        arr[count++] = num;
    }

    int pop() {
        if (isEmpty()) return -1;
        return arr[--count];
    }

    int top() { return isEmpty() ? -1 : arr[count - 1]; }

    int isEmpty() { return count == 0; }

    int isFull() { return count == (int)arr.size(); }
};
```
