---
title: "Sort a Stack"
description: "Sort a stack so the largest element is on top using only recursion and the stack's own push, pop and top operations, by recursive insertion sort."
source: "https://www.naukri.com/code360/problems/sort-a-stack_985275"
difficulty: "Easy"
tags: ["Stack", "Recursion"]
complexity:
  time: "O(n^2)"
  space: "O(n)"
---

## Problem

You're given a stack consisting of `N` integers. Your task is to sort this stack in **descending order** using **recursion** (the largest element ends up on top).

We can only use the following functions on this stack `S`:

```text
is_empty(S) : Tests whether stack is empty or not.
push(S)     : Adds a new element to the stack.
pop(S)      : Removes top element from the stack.
top(S)      : Returns value of the top element. Note that this function does not remove elements from the stack.
```

**Note:**

1. Use of any loop constructs like `while`, `for`, etc. is not allowed.
2. The stack may contain duplicate integers.
3. The stack may contain any integer, i.e. it may be negative, positive or zero.

Complete the function `sortStack(stack<int> &stack)`, which sorts the given stack in place. You do not need to print anything.

**Example 1:**

```text
Input:  N = 5, stack = 5 -2 9 -7 3
Output: 9 5 3 -2 -7
Explanation: 9 is the largest element, hence it is present at the top. Similarly 5 > 3, 3 > -2 and -7, being the smallest element, is at the bottom.
```

**Example 2:**

```text
Input:  N = 5, stack = -3 14 18 -5 30
Output: 30 18 14 -3 -5
Explanation: 30 is the largest element, hence it is present at the top. Similarly 18 > 14, 14 > -3 and -5, being the smallest element, is at the bottom.
```

The output lists the stack from top to bottom.

**Constraints:**

- $1 \le T \le 100$
- $1 \le N \le 100$
- $1 \le |V| \le 10^9$, where $|V|$ is the absolute value of any stack element.
- Time limit: 1 sec

## Solution approach

### Intuition

This is insertion sort written with recursion instead of loops, and with the call stack playing the role of a temporary buffer.

- **Sorting.** To sort a stack, pop its top element `temp`, sort the remaining (smaller) stack recursively, and then insert `temp` back into the right place. A stack with zero or one element is already sorted.
- **Inserting into a sorted stack.** If the stack is empty or its top is `<= temp`, then `temp` belongs on top: push it. Otherwise the top is larger than `temp` and must stay above it, so pop the top into `t`, insert `temp` into the rest, and push `t` back.

Each recursive call holds one popped value in its own frame, which is how we "set elements aside" without any extra container.

### Algorithm

1. `sortStack(st)`: if `st.size() <= 1`, return. Otherwise pop `temp = st.top()`, call `sortStack(st)`, then `insert(st, temp)`.
2. `insert(st, temp)`: if `st` is empty or `st.top() <= temp`, push `temp` and return.
3. Otherwise pop `t = st.top()`, call `insert(st, temp)`, then push `t` back.

### Walkthrough

The stack is drawn bottom to top (the right-most cell is the top). `sortStack` first peels every element off into its recursion frames, then inserts them back one by one; green cells form the sorted stack, blue is the element just inserted:

![Recursive sort of the stack 5 -2 9 -7 3](/img/codes/sort-a-stack/recursion.gif)

### Complexity

- **Time:** $O(n^2)$ — the `k`-th `insert` may pop and push back all `k - 1` elements already in the stack, $\sum k = O(n^2)$. Without loops or an extra container this is the expected bound, and with $N \le 100$ it is tiny.
- **Space:** $O(n)$ — at most `n` frames of `sortStack` plus at most `n` frames of `insert` on the call stack.

### Edge cases

- **Duplicates:** `st.top() <= temp` pushes an equal value straight on top, so equal elements never trigger extra pops.
- **Single element:** `sortStack` returns immediately.

## Code

```cpp title="C++"
void insert(stack<int> &st, int temp) {
    if (st.empty() || st.top() <= temp) {
        st.push(temp);
        return;
    }
    int t = st.top();
    st.pop();
    insert(st, temp);
    st.push(t);
}

void sortStack(stack<int> &stack) {
    if (stack.size() <= 1) return;
    int temp = stack.top();
    stack.pop();
    sortStack(stack);
    insert(stack, temp);
}
```
