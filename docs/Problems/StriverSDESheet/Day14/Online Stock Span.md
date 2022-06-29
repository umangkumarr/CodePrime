---
sidebar_position : 8
tags: [Stack]
---

# Online Stock Span

## Problem Link
https://leetcode.com/problems/online-stock-span/

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
