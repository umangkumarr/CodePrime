---
title: "Online Stock Span"
description: "Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day. The span of the…"
source: "https://leetcode.com/problems/online-stock-span/"
tags: ["Stack", "Design", "Monotonic Stack", "Data Stream"]
complexity:
  time: "O(1)"
  space: "O(n)"
---

## Problem

<p>Design an algorithm that collects daily price quotes for some stock and returns <strong>the span</strong> of that stock&#39;s price for the current day.</p>

<p>The <strong>span</strong> of the stock&#39;s price today is defined as the maximum number of consecutive days (starting from today and going backward) for which the stock price was less than or equal to today&#39;s price.</p>

<ul>
	<li>For example, if the price of a stock over the next <code>7</code> days were <code>[100,80,60,70,60,75,85]</code>, then the stock spans would be <code>[1,1,1,2,1,4,6]</code>.</li>
</ul>

<p>Implement the <code>StockSpanner</code> class:</p>

<ul>
	<li><code>StockSpanner()</code> Initializes the object of the class.</li>
	<li><code>int next(int price)</code> Returns the <strong>span</strong> of the stock&#39;s price given that today&#39;s price is <code>price</code>.</li>
</ul>

## Solution approach

### Intuition

The span of today's price is the distance back to the most recent day whose price was **strictly greater** than today's. Any earlier day with a price less than or equal to today's can never be that "greater" day for a future query either, because today is both later and at least as high. So such days can be thrown away, which leaves a stack of prices that strictly decrease from bottom to top (a monotonic stack).

Scanning back day by day would cost $O(n)$ per call; the stack avoids that because every day is pushed and popped at most once.

### Algorithm

1. The constructor pushes a sentinel `{INT_MAX, -1}` so the stack is never empty, and sets the day counter `n = 0`.
2. In `next(price)`, pop while `st.top().first <= price`.
3. The top now holds the previous greater price, so the span is `ans = n - st.top().second`.
4. Push `{price, n}`, increment `n`, and return `ans`.

### Complexity

- **Time:** $O(1)$ amortised per call — each day is pushed once and popped at most once, so `n` calls cost $O(n)$ in total.
- **Space:** $O(n)$ — the stack can hold every day when prices keep falling.

### Edge cases

- **First call, or a new all-time high:** everything except the sentinel is popped and the span is `n - (-1) = n + 1`, i.e. every day so far.

## Code

```cpp title="C++"
class StockSpanner {
    stack<pair<int, int>> st;
    int n;

   public:
    StockSpanner() {
        st.push({INT_MAX, -1});
        n = 0;
    }

    int next(int price) {
        while (st.top().first <= price) st.pop();
        int ans = n - st.top().second;
        st.push({price, n++});
        return ans;
    }
};

```
