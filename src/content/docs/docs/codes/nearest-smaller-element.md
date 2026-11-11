---
title: "Nearest Smaller Element"
description: "For every element, find the nearest strictly smaller element to its left (or -1) in linear time using a monotonic increasing stack."
source: "https://www.interviewbit.com/problems/nearest-smaller-element/"
difficulty: "Easy"
tags: ["Stack", "Array"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given an array, find the nearest smaller element `G[i]` for every element `A[i]` in the array such that the element has an index smaller than `i`.

More formally,

```text
G[i] for an element A[i] = an element A[j] such that
    j is maximum possible AND
    j < i AND
    A[j] < A[i]
```

Elements for which no smaller element exist, consider next smaller element as `-1`.

Complete the function `vector<int> Solution::prevSmaller(vector<int> &A)`, which returns the array `G` such that `G[i]` contains the nearest smaller number than `A[i]`. If no such element occurs, `G[i]` should be `-1`.

**Example 1:**

```text
Input:  A = [4, 5, 2, 10, 8]
Output: G = [-1, 4, -1, 2, 2]
Explanation:
index 1: No element less than 4 in left of 4, G[1] = -1
index 2: A[1] is only element less than A[2], G[2] = A[1]
index 3: No element less than 2 in left of 2, G[3] = -1
index 4: A[3] is nearest element which is less than A[4], G[4] = A[3]
index 5: A[3] is nearest element which is less than A[5], G[5] = A[3]
```

(The explanation uses 1-based indices.)

**Example 2:**

```text
Input:  A = [3, 2, 1]
Output: [-1, -1, -1]
Explanation:
index 1: No element less than 3 in left of 3, G[1] = -1
index 2: No element less than 2 in left of 2, G[2] = -1
index 3: No element less than 1 in left of 1, G[3] = -1
```

**Constraints (assumed):** the source does not list any. The solution below is linear and is designed for

- $1 \le |A| \le 10^5$
- every `A[i]` fits in a 32-bit signed integer.

## Solution approach

### Intuition

Scanning left from every index takes $O(n^2)$ in the worst case (think of an increasing array followed by a tiny value). The key observation is that many elements can never be an answer again:

> if `j < k` and `A[j] >= A[k]`, then `A[j]` is never the nearest smaller element for any index after `k` — `A[k]` is closer and at least as small, so it would always be preferred (or, if `A[k]` is not smaller, neither is `A[j]`).

So, at any moment, the only useful candidates are the elements to the left that are **strictly smaller than everything to their right**. Read from left to right they form a **strictly increasing** sequence, which we keep in a stack `st`.

For a new value `A[i]`: pop every candidate `>= A[i]` (they are not smaller than `A[i]`, and by the observation above `A[i]` now makes them useless for the future too). Whatever remains on top is the nearest element to the left that is smaller than `A[i]`, or the stack is empty and the answer is `-1`. Then push `A[i]`, which keeps the stack increasing.

### Algorithm

1. Start with an empty stack `st` and an answer array `G` of size `n`.
2. For each `i` from `0` to `n - 1`:
   - while `st` is non-empty and `st.top() >= A[i]`, pop;
   - `G[i] = st.empty() ? -1 : st.top()`;
   - push `A[i]`.
3. Return `G`.

### Walkthrough

Example 1. The blue cell is `A[i]`; the `stack` line lists the candidates from bottom to top, and `G` the answers so far:

![Monotonic stack on [4, 5, 2, 10, 8]](/img/codes/nearest-smaller-element/stack/01.webp)

### Complexity

- **Time:** $O(n)$ — every element is pushed once and popped at most once, so the inner `while` runs at most `n` times over the whole scan.
- **Space:** $O(n)$ — the stack (an increasing array keeps every element) plus the output.

### Edge cases

- **Equal values** (`[2, 2]`): the earlier `2` is popped because `>=` is used, so the second `2` gets `-1` — the answer must be **strictly** smaller.
- **Decreasing array** (Example 2): every element pops the previous one and gets `-1`.
- **Negative values** such as `-1`: emptiness of the stack, not a `-1` sentinel value, decides the "no smaller element" case.

## Code

```cpp
vector<int> Solution::prevSmaller(vector<int> &A) {
    int n = A.size();
    vector<int> G(n);
    stack<int> st;  // strictly increasing from bottom to top
    for (int i = 0; i < n; i++) {
        while (!st.empty() && st.top() >= A[i]) st.pop();
        G[i] = st.empty() ? -1 : st.top();
        st.push(A[i]);
    }
    return G;
}
```

```java
public class Solution {
    public ArrayList<Integer> prevSmaller(List<Integer> A) {
        ArrayList<Integer> G = new ArrayList<>(A.size());
        Deque<Integer> st = new ArrayDeque<>();  // strictly increasing from bottom to top
        for (int x : A) {
            while (!st.isEmpty() && st.peek() >= x) st.pop();
            G.add(st.isEmpty() ? -1 : st.peek());
            st.push(x);
        }
        return G;
    }
}
```

```python
class Solution:
    def prevSmaller(self, A: list[int]) -> list[int]:
        G = []
        st = []  # strictly increasing from bottom to top
        for x in A:
            while st and st[-1] >= x:
                st.pop()
            G.append(st[-1] if st else -1)
            st.append(x)
        return G
```
