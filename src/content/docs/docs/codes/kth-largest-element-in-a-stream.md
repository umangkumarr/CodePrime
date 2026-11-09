---
title: "Kth Largest Element in a Stream"
description: "Report the k-th largest score after every insertion into a stream by keeping only the k largest values in a min-heap whose top is the answer."
source: "https://leetcode.com/problems/kth-largest-element-in-a-stream/"
difficulty: "Easy"
tags: ["Tree", "Design", "Binary Search Tree", "Heap (Priority Queue)", "Binary Tree", "Data Stream"]
complexity:
  time: "O(\\log k)"
  space: "O(k)"
---

## Problem

You are part of a university admissions office and need to keep track of the `kth` highest test score from applicants in real-time. This helps to determine cut-off marks for interviews and admissions dynamically as new applicants submit their scores.

You are tasked to implement a class which, for a given integer `k`, maintains a stream of test scores and continuously returns the `k`th highest test score **after** a new score has been submitted. More specifically, we are looking for the `k`th highest score in the sorted list of all scores.

Implement the `KthLargest` class:

- `KthLargest(int k, int[] nums)` Initializes the object with the integer `k` and the stream of test scores `nums`.
- `int add(int val)` Adds a new test score `val` to the stream and returns the element representing the `kth` largest element in the pool of test scores so far.

**Example 1:**

```text
Input:
["KthLargest", "add", "add", "add", "add", "add"]
[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]
Output: [null, 4, 5, 5, 8, 8]
Explanation:
KthLargest kthLargest = new KthLargest(3, [4, 5, 8, 2]);
kthLargest.add(3); // return 4
kthLargest.add(5); // return 5
kthLargest.add(10); // return 5
kthLargest.add(9); // return 8
kthLargest.add(4); // return 8
```

**Example 2:**

```text
Input:
["KthLargest", "add", "add", "add", "add"]
[[4, [7, 7, 7, 7, 8, 3]], [2], [10], [9], [9]]
Output: [null, 7, 7, 7, 8]
Explanation:
KthLargest kthLargest = new KthLargest(4, [7, 7, 7, 7, 8, 3]);
kthLargest.add(2); // return 7
kthLargest.add(10); // return 7
kthLargest.add(9); // return 7
kthLargest.add(9); // return 8
```

**Constraints:**

- $0 \le$ `nums.length` $\le 10^4$
- $1 \le k \le$ `nums.length` $+ 1$
- $-10^4 \le$ `nums[i]` $\le 10^4$
- $-10^4 \le$ `val` $\le 10^4$
- At most $10^4$ calls will be made to `add`.

## Solution approach

### Intuition

The k-th largest value depends only on the `k` largest values seen so far — anything smaller than all of them can never become the answer again, because the stream only grows.

So keep exactly those `k` values in a **min-heap**. Its top is the smallest of the `k` largest, which is precisely the k-th largest overall. When a new value arrives:

- push it;
- if the heap now holds `k + 1` values, pop the minimum — it is no longer among the `k` largest.

Each operation touches a heap of size at most `k + 1`, so it costs $O(\log k)$, independent of how long the stream gets. Re-running a selection over all values on every `add` would instead cost $O(n)$ per call.

### Algorithm

1. The constructor stores `k` and calls `add` for every value in `nums` (discarding the return value).
2. `add(val)`: push `val` into the min-heap `heap`; if `heap.size() > k`, pop the top.
3. Return `heap.top()`.

The constraint `k <= nums.length + 1` guarantees the heap holds `k` values after the first `add`, so `top()` is always valid when an answer is requested.

### Walkthrough

Example 1 with `k = 3`, showing the heap contents (sorted) after each step:

| Step | Heap after the step | Returned |
| --- | --- | --- |
| build from `[4, 5, 8, 2]` | push `4, 5, 8`; pushing `2` makes size 4, so `2` is popped → `{4, 5, 8}` | — |
| `add(3)` | `3` pushed then popped → `{4, 5, 8}` | `4` |
| `add(5)` | `4` popped → `{5, 5, 8}` | `5` |
| `add(10)` | `5` popped → `{5, 8, 10}` | `5` |
| `add(9)` | `5` popped → `{8, 9, 10}` | `8` |
| `add(4)` | `4` pushed then popped → `{8, 9, 10}` | `8` |

### Complexity

- **Time:** $O(\log k)$ per `add`; the constructor costs $O(n \log k)$ for `n = nums.length`.
- **Space:** $O(k)$ — the heap never holds more than `k + 1` values.

### Edge cases

- **Empty `nums`** (then `k = 1`): the first `add` pushes one value and returns it.
- **Duplicates** (Example 2): equal values occupy separate heap slots, so the answer is the k-th largest in sorted order, not the k-th distinct value.

## Code

```cpp title="C++"
class KthLargest {
    int k;
    priority_queue<int, vector<int>, greater<int>> heap;  // the k largest values

   public:
    KthLargest(int k, vector<int>& nums) : k(k) {
        for (int x : nums) add(x);
    }

    int add(int val) {
        heap.push(val);
        if ((int)heap.size() > k) heap.pop();
        return heap.top();
    }
};
```
