---
title: "Find Median from Data Stream"
description: "Support adding numbers from a stream and querying the running median, in O(log n) per insertion using a max-heap and a min-heap for the two halves."
source: "https://leetcode.com/problems/find-median-from-data-stream/"
difficulty: "Hard"
tags: ["Two Pointers", "Design", "Sorting", "Heap (Priority Queue)", "Data Stream"]
complexity:
  time: "O(\\log n)"
  space: "O(n)"
---

## Problem

The **median** is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

- For example, for `arr = [2,3,4]`, the median is `3`.
- For example, for `arr = [2,3]`, the median is `(2 + 3) / 2 = 2.5`.

Implement the MedianFinder class:

- `MedianFinder()` initializes the `MedianFinder` object.
- `void addNum(int num)` adds the integer `num` from the data stream to the data structure.
- `double findMedian()` returns the median of all elements so far. Answers within $10^{-5}$ of the actual answer will be accepted.

**Example 1:**

```text
Input
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
Output
[null, null, null, 1.5, null, 2.0]

Explanation
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)
medianFinder.addNum(3);    // arr[1, 2, 3]
medianFinder.findMedian(); // return 2.0
```

**Constraints:**

- $-10^5 \le$ `num` $\le 10^5$
- There will be at least one element in the data structure before calling `findMedian`.
- At most $5 \times 10^4$ calls will be made to `addNum` and `findMedian`.

**Follow-up:**

- If all integer numbers from the stream are in the range `[0, 100]`, how would you optimize your solution?
- If `99%` of all integer numbers from the stream are in the range `[0, 100]`, how would you optimize your solution?

## Solution approach

### Intuition

The median depends only on the one or two values in the **middle** of the sorted data. Keeping everything sorted costs $O(n)$ per insertion, but we never need full order — only the boundary between the lower and the upper half.

So split the numbers into two halves:

- `lo`, a **max-heap** holding the smaller half, so `lo.top()` is the largest of the small numbers;
- `hi`, a **min-heap** holding the larger half, so `hi.top()` is the smallest of the large numbers.

Maintain two invariants: every value in `lo` is `<=` every value in `hi`, and `lo` has either the same number of elements as `hi` or exactly one more. Then the median is `lo.top()` when the total is odd, and the mean of `lo.top()` and `hi.top()` when it is even.

### Algorithm

1. `addNum(num)`:
   - Push `num` into `lo`, then move `lo`'s largest element to `hi`. Whatever `num` was, the element that ends up in `hi` is at least as large as everything left in `lo`, so the ordering invariant holds.
   - If `hi` now has more elements than `lo`, move `hi`'s smallest element back to `lo`, which restores the size invariant.
2. `findMedian()`: if `lo` is larger, return `lo.top()`; otherwise return `(lo.top() + hi.top()) / 2.0`.

### Walkthrough

The stream `5, 15, 1, 3, 8, 7`, drawn as the sorted list of numbers seen so far. Blue cells are in `lo`, orange cells in `hi`; the heap tops are the two cells at the boundary:

![Two heaps splitting the stream 5, 15, 1, 3, 8, 7](/img/codes/find-median-from-data-stream/two-heaps/01.webp)

### Complexity

- **Time:** $O(\log n)$ per `addNum` (at most three heap pushes/pops) and $O(1)$ per `findMedian`.
- **Space:** $O(n)$ — every number is stored in exactly one heap.

### Edge cases

- **One element:** it ends up in `lo` (pushed to `lo`, moved to `hi`, moved back), so `findMedian` returns it.
- **Duplicates and negative numbers:** the comparisons are plain `<=`/`>=` on `int`, so they need no special care; `lo.top() + hi.top()` is at most $2 \cdot 10^5$ in absolute value, so the sum cannot overflow.

### Follow-up

- **All numbers in `[0, 100]`:** keep a count array `cnt[101]` and the total `n`. `addNum` is $O(1)$; `findMedian` walks the 101 buckets to find the element(s) at rank `(n - 1) / 2` and `n / 2` — constant time.
- **99% in `[0, 100]`:** keep the 101 buckets plus two counters (or small sorted containers) for values below `0` and above `100`. The median is almost certainly inside the bucket range; when its rank falls among the outliers, look it up in the corresponding container, which holds only about 1% of the data.

## Code

```cpp
class MedianFinder {
    priority_queue<int> lo;                             // smaller half, max at top
    priority_queue<int, vector<int>, greater<int>> hi;  // larger half, min at top

   public:
    MedianFinder() {}

    void addNum(int num) {
        lo.push(num);
        hi.push(lo.top());
        lo.pop();
        if (hi.size() > lo.size()) {
            lo.push(hi.top());
            hi.pop();
        }
    }

    double findMedian() {
        if (lo.size() > hi.size()) return lo.top();
        return (lo.top() + hi.top()) / 2.0;
    }
};
```

```java
class MedianFinder {
    private final PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());  // smaller half, max at top
    private final PriorityQueue<Integer> hi = new PriorityQueue<>();                            // larger half, min at top

    public MedianFinder() {}

    public void addNum(int num) {
        lo.offer(num);
        hi.offer(lo.poll());
        if (hi.size() > lo.size()) lo.offer(hi.poll());
    }

    public double findMedian() {
        if (lo.size() > hi.size()) return lo.peek();
        return (lo.peek() + hi.peek()) / 2.0;
    }
}
```

```python
import heapq


class MedianFinder:

    def __init__(self):
        self.lo = []  # smaller half as negatives, so -lo[0] is its max
        self.hi = []  # larger half, min at hi[0]

    def addNum(self, num: int) -> None:
        heapq.heappush(self.hi, -heapq.heappushpop(self.lo, -num))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self) -> float:
        if len(self.lo) > len(self.hi):
            return float(-self.lo[0])
        return (-self.lo[0] + self.hi[0]) / 2.0
```
