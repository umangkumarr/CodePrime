---
sidebar_position : 3
tags: [Tree, Binary Search Tree, Heap(Priority-Queue), Data Stream]
---

# Kth Largest Element in a Stream

## Problem Link
https://leetcode.com/problems/kth-largest-element-in-a-stream/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class KthLargest {
    vector<int> num;
    int k;
    int n;

   public:
    KthLargest(int kk, vector<int>& nums) {
        this->num = nums;
        this->k = kk;
        this->n = nums.size();
    }

    int add(int val) {
        num.push_back(val);
        n++;
        nth_element(num.begin(), num.begin() + n - k, num.end());
        return num[n - k];
    }
};
```
</TabItem>
</Tabs>

</details>
