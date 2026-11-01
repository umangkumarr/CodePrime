---
title: "Nearest Smaller Element"
description: "Given an array, find the nearest smaller element G[i] for every element A[i] in the array such that the element has an index smaller than i. More…"
source: "https://www.interviewbit.com/problems/nearest-smaller-element/"
tags: ["Stack", "Array"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given an array, find the nearest smaller element G[i] for every element A[i] in the array such that the element has an index smaller than i.

More formally,
```txt
    G[i] for an element A[i] = an element A[j] such that 
    j is maximum possible AND 
    j < i AND
    A[j] < A[i]
```
Elements for which no smaller element exist, consider next smaller element as -1.

## Solution approach

### Intuition

Use a stack to find the previous smaller element. If a value `A[j]` is greater than or equal to a later value `A[i]`, then `A[j]` can never be the nearest smaller element for anything after `i`, because `A[i]` is closer and at least as small. So the stack only needs to keep an increasing sequence of candidates, and each value is pushed and popped at most once.

Scanning left from every index would take $O(n^2)$ time in the worst case.

### Algorithm

1. Push the sentinel `-1` onto `st`. It is returned when no smaller element exists.
2. For each `A[i]`, pop while `st.top() >= A[i]`.
3. The remaining top is the nearest smaller value, so store it in `ans[i]`, then push `A[i]`.
4. Return `ans`.

### Complexity

- **Time:** $O(n)$ — each element is pushed once and popped at most once.
- **Space:** $O(n)$ — the stack and the answer array.

### Edge cases

- **Equal values** are popped, because the answer must be strictly smaller.
- **The sentinel** assumes every `A[i]` is at least `0`. A value of `-1` or less would pop the sentinel and empty the stack.

## Code

```cpp title="C++"
vector<int> Solution::prevSmaller(vector<int> &A) {
    int n = A.size();
    stack<int> st;
    st.push(-1);
    vector<int> ans(n);
    for (int i = 0; i < n; i++) {
        while (st.top() >= A[i]) st.pop();
        ans[i] = st.top();
        st.push(A[i]);
    }
    return ans;
}
```
