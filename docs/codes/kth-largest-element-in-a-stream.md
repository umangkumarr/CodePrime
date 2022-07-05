---
displayed_sidebar: null
sidebar_position : 145
tags: [Tree, Design, Binary Search Tree, Heap (Priority Queue), Binary Tree, Data Stream]
---

# Kth Largest Element in a Stream

## [Problem](https://leetcode.com/problems/kth-largest-element-in-a-stream/)

<p>Design a class to find the <code>kth</code> largest element in a stream. Note that it is the <code>kth</code> largest element in the sorted order, not the <code>kth</code> distinct element.</p>

<p>Implement <code>KthLargest</code> class:</p>

<ul>
	<li><code>KthLargest(int k, int[] nums)</code> Initializes the object with the integer <code>k</code> and the stream of integers <code>nums</code>.</li>
	<li><code>int add(int val)</code> Appends the integer <code>val</code> to the stream and returns the element representing the <code>kth</code> largest element in the stream.</li>
</ul>

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
