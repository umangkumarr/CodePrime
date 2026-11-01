---
title: "Merge K Sorted Arrays"
description: "You have been given ‘K’ different arrays/lists, which are sorted individually (in ascending order). You need to merge all the given arrays/list such that…"
source: "https://www.codingninjas.com/codestudio/problems/merge-k-sorted-arrays_975379"
tags: ["Heap(Priority Queue)"]
complexity:
  time: "O(N \\log N)"
  space: "O(N)"
---

## Problem

You have been given ‘K’ different arrays/lists, which are sorted individually (in ascending order). You need to merge all the given arrays/list such that the output array/list should be sorted in ascending order.

## Solution approach

### Intuition

A min-heap always gives back its smallest element. If every element from all `k` arrays is pushed into one min-heap, popping them one by one returns them in sorted order. This code does not use the fact that each input array is already sorted; it effectively runs a heap sort over all the elements.

### Algorithm

1. Push every element of every array in `kArrays` into the min-heap `minHeap`.
2. Repeatedly append `minHeap.top()` to `res` and pop it until the heap is empty.
3. Return `res`.

### Complexity

- **Time:** $O(N \log N)$ — `N` pushes and `N` pops, where `N` is the total number of elements.
- **Space:** $O(N)$ — the heap holds every element at once.

## Code

```cpp title="C++"
vector<int> mergeKSortedArrays(vector<vector<int>>& kArrays, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;

    for (auto x : kArrays) {
        for (auto y : x) minHeap.push(y);
    }
    vector<int> res;

    while (!minHeap.empty()) {
        res.push_back(minHeap.top());
        minHeap.pop();
    }

    return res;
}
```
