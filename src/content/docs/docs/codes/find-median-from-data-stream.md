---
title: "Find Median from Data Stream"
description: "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value and the median is the mean of the two…"
source: "https://leetcode.com/problems/find-median-from-data-stream/"
tags: ["Two Pointers", "Design", "Sorting", "Heap (Priority Queue)", "Data Stream"]
complexity:
  time: "O(\\log n)"
  space: "O(n)"
---

## Problem

<p>The <strong>median</strong> is the middle value in an ordered integer list. If the size of the list is even, there is no middle value and the median is the mean of the two middle values.</p>

<ul>
	<li>For example, for <code>arr = [2,3,4]</code>, the median is <code>3</code>.</li>
	<li>For example, for <code>arr = [2,3]</code>, the median is <code>(2 + 3) / 2 = 2.5</code>.</li>
</ul>

<p>Implement the MedianFinder class:</p>

<ul>
	<li><code>MedianFinder()</code> initializes the <code>MedianFinder</code> object.</li>
	<li><code>void addNum(int num)</code> adds the integer <code>num</code> from the data stream to the data structure.</li>
	<li><code>double findMedian()</code> returns the median of all elements so far. Answers within <code>10-5</code> of the actual answer will be accepted.</li>
</ul>

## Solution approach

### Intuition

The median only depends on the middle of the sorted data. Split the numbers into a lower half and an upper half: then the median is the largest number of the lower half, or the average of that and the smallest number of the upper half. A max-heap gives the largest of the lower half and a min-heap gives the smallest of the upper half, each in $O(1)$.

`small` is a max-heap for the lower half. `large` stores the **negatives** of the upper half, so its max-heap top is minus the smallest upper value.

### Algorithm

1. `addNum` pushes `num` into `small`, then moves the largest of `small` to `large` (as `-small.top()`). This keeps every value in `small` no larger than every value in `large`.
2. If `large` now has more elements than `small`, move its smallest value back with `small.push(-large.top())`. So `small` always has the same size as `large` or one more.
3. `findMedian` returns `small.top()` when `small` is bigger, otherwise `(small.top() - large.top()) / 2.0`, which is the average of the two middle values because `large.top()` is negated.

### Complexity

- **Time:** $O(\log n)$ per `addNum` (a constant number of heap operations) and $O(1)$ per `findMedian`.
- **Space:** $O(n)$ — every number is stored in one of the two heaps.

### Edge cases

- The heaps use `long`, so negating a value like `-2^31` cannot overflow.

## Code

```cpp title="C++"
class MedianFinder {
    priority_queue<long> small, large;

   public:
    void addNum(int num) {
        small.push(num);
        large.push(-small.top());
        small.pop();
        if (small.size() < large.size()) {
            small.push(-large.top());
            large.pop();
        }
    }

    double findMedian() {
        return small.size() > large.size() ? small.top() : (small.top() - large.top()) / 2.0;
    }
};

```
