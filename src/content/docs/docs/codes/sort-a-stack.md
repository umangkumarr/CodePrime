---
title: "Sort a Stack"
description: "You’re given a stack consisting of 'N' integers. Your task is to sort this stack in descending order using recursion."
source: "https://bit.ly/3xUig52"
tags: ["Stack"]
complexity:
  time: "O(n^2)"
  space: "O(n)"
---

## Problem

You’re given a stack consisting of 'N' integers. Your task is to sort this stack in descending order using recursion.

## Solution approach

### Intuition

Recursion lets us sort a stack without any other data structure. Pop the top element, sort the remaining (smaller) stack recursively, and then insert the popped element into its correct place. Inserting into a sorted stack is itself recursive: while the top is greater than the new element, pop it, insert below, and push it back.

### Algorithm

1. `sortStack(st)`: if `st` has one element it is already sorted. Otherwise pop `temp`, call `sortStack(st)` on the rest, then call `insert(temp, st)`.
2. `insert(temp, st)`: if `st` is empty, or `st.top()` is not greater than `temp`, push `temp`.
3. Otherwise pop the top into `t`, recursively `insert(temp, st)`, and push `t` back.
4. The stack ends with the largest element on top.

### Complexity

- **Time:** $O(n^2)$ — each of the $n$ calls to `insert` may move every element already in the stack.
- **Space:** $O(n)$ — the recursion stack of `sortStack` and `insert` can each be $n$ frames deep.

### Edge cases

- **Empty stack**: `sortStack` only stops at size `1`, so calling it on an empty stack would call `top()` on an empty stack.

## Code

```cpp title="C++"
void insert(int temp, stack<int> &st) {
    if (st.size() == 0) {
        st.push(temp);
        return;
    }
    if (st.top() > temp) {
        int t = st.top();
        st.pop();
        insert(temp, st);
        st.push(t);
    } else {
        st.push(temp);
    }
}
void sortStack(stack<int> &st) {
    if (st.size() == 1) return;
    int temp = st.top();
    st.pop();
    sortStack(st);
    insert(temp, st);
}
```
