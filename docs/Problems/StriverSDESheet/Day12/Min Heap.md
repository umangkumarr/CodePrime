---
sidebar_position : 1
tags: [Heap(Priority Queue)]
---

# Min Heap

## Problem Link
https://www.codingninjas.com/codestudio/problems/min-heap_4691801?topList=striver-sde-sheet-problems&utm_source=striver&utm_medium=website

## Solution Approach
Expected Time complexity: $O(n*log(n))$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
vector<int> minHeap(int n, vector<vector<int>>& q) {
    priority_queue<int, vector<int>, greater<int>> pq;
    vector<int> ans;
    for (int i = 0; i < n; i++) {
        if (q[i][0] == 0) {
            pq.push(q[i][1]);
        } else {
            if (!pq.empty()) {
                ans.push_back(pq.top());
                pq.pop();
            }
        }
    }
    return ans;
}
```
</TabItem>
</Tabs>

</details>
