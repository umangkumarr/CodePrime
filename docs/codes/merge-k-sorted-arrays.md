---
displayed_sidebar: null
sidebar_position : 5
tags: [Heap(Priority Queue)]
---

# Merge K Sorted Arrays

## [Problem](https://www.codingninjas.com/codestudio/problems/merge-k-sorted-arrays_975379)

You have been given ‘K’ different arrays/lists, which are sorted individually (in ascending order). You need to merge all the given arrays/list such that the output array/list should be sorted in ascending order.

## Solution Approach
Expected Time complexity: $O(n*log(n))$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
