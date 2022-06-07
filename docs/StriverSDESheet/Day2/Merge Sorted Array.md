---
sidebar_position : 3
---

# Merge two sorted Arrays without extra space

## Problem Link
https://leetcode.com/problems/merge-sorted-array/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    void merge(vector<int>& arr1, int m, vector<int>& arr2, int n) {
        vector<int> arr(m + n);
        int i = 0, j = 0, k = 0;
        while (i < m && j < n) {
            if (arr1[i] <= arr2[j])
                arr[k++] = arr1[i++];
            else
                arr[k++] = arr2[j++];
        }
        while (i < m) arr[k++] = arr1[i++];
        while (j < n) arr[k++] = arr2[j++];
        arr1 = arr;
    }
};
```
</TabItem>
</Tabs>
