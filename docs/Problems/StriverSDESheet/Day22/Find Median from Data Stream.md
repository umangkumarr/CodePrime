---
sidebar_position : 2
tags: [Two Pointer, Sorting, Heap(Priority-Queue), Data Stream]
---

# Find Median from Data Stream

## [Problem](https://leetcode.com/problems/find-median-from-data-stream/)

<p>The <strong>median</strong> is the middle value in an ordered integer list. If the size of the list is even, there is no middle value and the median is the mean of the two middle values.</p><ul><li>For example, for <code>arr = [2,3,4]</code>, the median is <code>3</code>.</li><li>For example, for <code>arr = [2,3]</code>, the median is <code>(2 + 3) / 2 = 2.5</code>.</li></ul><p>Implement the MedianFinder class:</p><ul><li><code>MedianFinder()</code> initializes the <code>MedianFinder</code> object.</li><li><code>void addNum(int num)</code> adds the integer <code>num</code> from the data stream to the data structure.</li><li><code>double findMedian()</code> returns the median of all elements so far. Answers within <code>10<sup>-5</sup></code> of the actual answer will be accepted.</li></ul><p>&nbsp;</p>


## Solution Approach

Expected Time complexity: $O(n)$

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
