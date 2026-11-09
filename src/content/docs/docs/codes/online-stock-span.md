---
title: "Online Stock Span"
description: "Return each day's stock span (consecutive previous days with price at most today's) online, using a monotonic decreasing stack in amortised O(1)."
source: "https://leetcode.com/problems/online-stock-span/"
difficulty: "Medium"
tags: ["Stack", "Design", "Monotonic Stack", "Data Stream"]
complexity:
  time: "O(1)"
  space: "O(n)"
---

## Problem

Design an algorithm that collects daily price quotes for some stock and returns **the span** of that stock's price for the current day.

The **span** of the stock's price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.

- For example, if the prices of the stock in the last four days are `[7,2,1,2]` and the price of the stock today is `2`, then the span of today is `4` because starting from today, the price of the stock was less than or equal to `2` for `4` consecutive days.
- Also, if the prices of the stock in the last four days is `[7,34,1,2]` and the price of the stock today is `8`, then the span of today is `3` because starting from today, the price of the stock was less than or equal to `8` for `3` consecutive days.

Implement the `StockSpanner` class:

- `StockSpanner()` Initializes the object of the class.
- `int next(int price)` Returns the **span** of the stock's price given that today's price is `price`.

**Example 1:**

```text
Input
["StockSpanner", "next", "next", "next", "next", "next", "next", "next"]
[[], [100], [80], [60], [70], [60], [75], [85]]
Output
[null, 1, 1, 1, 2, 1, 4, 6]

Explanation
StockSpanner stockSpanner = new StockSpanner();
stockSpanner.next(100); // return 1
stockSpanner.next(80);  // return 1
stockSpanner.next(60);  // return 1
stockSpanner.next(70);  // return 2
stockSpanner.next(60);  // return 1
stockSpanner.next(75);  // return 4, because the last 4 prices (including today's price of 75) were less than or equal to today's price.
stockSpanner.next(85);  // return 6
```

**Constraints:**

- $1 \le$ `price` $\le 10^5$
- At most $10^4$ calls will be made to `next`.

## Solution approach

### Intuition

The span of today ends at the most recent earlier day whose price is **strictly greater** than today's — the "previous greater element". Today's span is the distance back to that day.

Scanning backwards day by day costs $O(n)$ per call. But notice: once today's price `p` arrives, any earlier day with price `<= p` can **never** be the previous greater element of a future day. A future day that is blocked by such a day would also be blocked by today, which is later and at least as high. Those days can be discarded.

What remains is a stack of days whose prices strictly decrease from bottom to top (a **monotonic stack**). For a new price, pop every top that is `<=` the price; the new top is the previous greater day. Every day is pushed once and popped at most once, so the total work over all calls is linear.

### Algorithm

1. The stack `st` holds pairs `{price, day}`. The constructor pushes a sentinel `{INT_MAX, -1}`, which is greater than any price, so the stack is never empty; the day counter `day` starts at `0`.
2. In `next(price)`, pop while `st.top().first <= price`.
3. Now `st.top()` is the previous strictly greater day, so the span is `day - st.top().second`.
4. Push `{price, day}`, increment `day`, and return the span.

### Walkthrough

Example 1. Orange cells are the days on the stack (prices decreasing left to right), blue is today, grey were popped earlier:

![Monotonic stack processing the prices of Example 1](/img/codes/online-stock-span/mono-stack.gif)

### Complexity

- **Time:** $O(1)$ amortised per call — each day is pushed once and popped at most once, so `n` calls cost $O(n)$ in total (a single call can still pop many days).
- **Space:** $O(n)$ — the stack holds every day when prices keep falling.

### Edge cases

- **First call, or a new all-time high:** everything except the sentinel is popped and the span is `day - (-1) = day + 1`, i.e. every day so far.
- **Equal prices:** they are popped (`<=`), because the span counts days with price less than **or equal** to today's.

## Code

```cpp
class StockSpanner {
    stack<pair<int, int>> st;  // {price, day}, prices strictly decreasing
    int day = 0;

   public:
    StockSpanner() { st.push({INT_MAX, -1}); }

    int next(int price) {
        while (st.top().first <= price) st.pop();
        int span = day - st.top().second;
        st.push({price, day++});
        return span;
    }
};
```

```java
class StockSpanner {
    private final ArrayDeque<int[]> st = new ArrayDeque<>();  // {price, day}, prices strictly decreasing
    private int day = 0;

    public StockSpanner() {
        st.push(new int[] {Integer.MAX_VALUE, -1});
    }

    public int next(int price) {
        while (st.peek()[0] <= price) st.pop();
        int span = day - st.peek()[1];
        st.push(new int[] {price, day++});
        return span;
    }
}
```

```python
import math


class StockSpanner:

    def __init__(self):
        self.st = [(math.inf, -1)]  # (price, day), prices strictly decreasing
        self.day = 0

    def next(self, price: int) -> int:
        st = self.st
        while st[-1][0] <= price:
            st.pop()
        span = self.day - st[-1][1]
        st.append((price, self.day))
        self.day += 1
        return span
```
