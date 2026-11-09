---
title: "Merge K Sorted Arrays"
description: "Merge K individually sorted arrays into one sorted array with a K-way merge that keeps one candidate per array in a min-heap."
source: "https://www.naukri.com/code360/problems/merge-k-sorted-arrays_975379"
difficulty: "Medium"
tags: ["Heap (Priority Queue)"]
complexity:
  time: "O(N \\log K)"
  space: "O(K)"
---

## Problem

You have been given `K` different arrays/lists, which are sorted individually (in ascending order). You need to merge all the given arrays/lists such that the output array/list should be sorted in ascending order.

Complete the function `vector<int> mergeKSortedArrays(vector<vector<int>> &kArrays, int k)`; the judge reads the input and prints the returned array.

**Example 1:**

```text
Input:  K = 2, arrays = [3, 5, 9], [1, 2, 3, 8]
Output: 1 2 3 3 5 8 9
Explanation: After merging the two given arrays/lists [3, 5, 9] and [1, 2, 3, 8], the output sorted array will be [1, 2, 3, 3, 5, 8, 9].
```

**Example 2:**

```text
Input:  K = 4, arrays = [1, 5, 9], [45, 90], [2, 6, 78, 100, 234], [0]
Output: 0 1 2 5 6 9 45 78 90 100 234
Explanation: After merging the given arrays/lists [1, 5, 9], [45, 90], [2, 6, 78, 100, 234] and [0], the output sorted array will be [0, 1, 2, 5, 6, 9, 45, 78, 90, 100, 234].
```

**Constraints:**

- $1 \le T \le 5$
- $1 \le K \le 5$
- $1 \le N \le 20$, where `N` is the size of each array
- $-10^5 \le$ `DATA` $\le 10^5$
- Time limit: 1 sec.

## Solution approach

### Intuition

Dumping every element into one heap (or concatenating and sorting) works, but it ignores that each array is already sorted and costs $O(N \log N)$ for `N` total elements.

Use the sortedness instead. The smallest element not yet output must be the **first unused element of some array**, because within each array everything after that element is at least as large. So we only ever need `K` candidates — one front element per array — and the smallest of them is the next output. A min-heap of `(value, array, index)` keeps those `K` candidates and gives the minimum in $O(\log K)$. After popping the front of array `a`, its next element becomes `a`'s new candidate.

This is the merge step of merge sort generalised from 2 to `K` inputs.

### Algorithm

1. Push `(kArrays[a][0], a, 0)` for every non-empty array `a`.
2. While the heap is not empty: pop the smallest `(value, a, i)`, append `value` to `res`, and if `i + 1 < kArrays[a].size()` push `(kArrays[a][i + 1], a, i + 1)`.
3. Return `res`.

### Walkthrough

Example 2, one row per array. Orange cells are in the heap, blue is the element just popped, green is already in the output:

![K-way merge with a min-heap on Example 2](/img/codes/merge-k-sorted-arrays/kway.gif)

### Complexity

- **Time:** $O(N \log K)$ — each of the `N` elements is pushed and popped once, and the heap never holds more than `K` entries.
- **Space:** $O(K)$ for the heap, apart from the $O(N)$ output.

### Edge cases

- **Duplicates across arrays** (the two `3`s in Example 1) are both output; ties are broken by array index, which does not affect the result.
- **Arrays of different lengths:** an array simply stops contributing once its last element is popped.
- **`K = 1`:** the heap holds one entry and the array is copied as is.

## Code

```cpp title="C++"
vector<int> mergeKSortedArrays(vector<vector<int>> &kArrays, int k) {
    // (value, array index, position in that array); greater<> makes it a min-heap
    priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> pq;
    for (int a = 0; a < k; ++a)
        if (!kArrays[a].empty()) pq.emplace(kArrays[a][0], a, 0);

    vector<int> res;
    while (!pq.empty()) {
        auto [value, a, i] = pq.top();
        pq.pop();
        res.push_back(value);
        if (i + 1 < (int)kArrays[a].size()) pq.emplace(kArrays[a][i + 1], a, i + 1);
    }
    return res;
}
```
