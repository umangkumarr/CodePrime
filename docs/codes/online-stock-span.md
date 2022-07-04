---
sidebar_position : 85
tags: [Stack, Design, Monotonic Stack, Data Stream]
---

# Online Stock Span

## [Problem](https://leetcode.com/problems/online-stock-span/)

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

## Solution Approach

Expected Time complexity: $O(n^n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
