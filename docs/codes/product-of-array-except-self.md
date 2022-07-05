---
displayed_sidebar: null
sidebar_position : 2
tags: [Array, Prefix Sum]
---

# Product of Array Except Self

## [Problem](https://leetcode.com/problems/product-of-array-except-self/)

<p>Given an integer array <code>nums</code>, return <em>an array</em> <code>answer</code> <em>such that</em> <code>answer[i]</code> <em>is equal to the product of all the elements of</em> <code>nums</code> <em>except</em> <code>nums[i]</code>.</p>

<p>The product of any prefix or suffix of <code>nums</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</p>

<p>You must write an algorithm that runs in&nbsp;<code>O(n)</code>&nbsp;time and without using the division operation.</p>

## Solution Approach

Expected Time Complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<int> productExceptSelf(vector<int>& nums) {
        long long prod = 1;
        int n = nums.size();
        int cnt = 0;
        for (int i = 0; i < n; i++) {
            if (nums[i])
                prod *= nums[i];
            else
                cnt++;
        }
        if (cnt > 1) {
            nums.clear();
            nums.resize(n);
            return nums;
        }
        for (int i = 0; i < n; i++) {
            if (nums[i] == 0)
                nums[i] = prod;
            else
                nums[i] = (prod * (cnt ^ 1)) / nums[i];
        }
        return nums;
    }
};
```
</TabItem>
</Tabs>

</details>
