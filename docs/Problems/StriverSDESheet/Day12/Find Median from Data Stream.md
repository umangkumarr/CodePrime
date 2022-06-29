---
sidebar_position : 4
tags: [Heap(Priority Queue)]
---

# Find Median from Data Stream

## Problem Link
https://leetcode.com/problems/find-median-from-data-stream/

## Solution Approach
Expected Time complexity: $O(n*log(n))$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
