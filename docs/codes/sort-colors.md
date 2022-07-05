---
displayed_sidebar: null
sidebar_position : 6
tags: [Array, Two Pointers, Sorting]
---

# Sort Colors

## [Problem](https://leetcode.com/problems/sort-colors/)

<p>Given an array <code>nums</code> with <code>n</code> objects colored red, white, or blue, sort them <strong><a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank">in-place</a> </strong>so that objects of the same color are adjacent, with the colors in the order red, white, and blue.</p>

<p>We will use the integers <code>0</code>, <code>1</code>, and <code>2</code> to represent the color red, white, and blue, respectively.</p>

<p>You must solve this problem without using the library&#39;s sort function.</p>

## Solution Approach

Expected Time complexity: $O(n^2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    void sortColors(vector<int>& arr) {
        int a[] = {0, 0, 0};
        int n = arr.size();
        for (int i = 0; i < n; i++) a[arr[i]]++;
        int j = 0;
        for (int i = 0; i < 3; i++) {
            for (int k = 0; k < a[i]; k++) arr[j++] = i;
        }
    }
};

```
</TabItem>
</Tabs>

</details>
