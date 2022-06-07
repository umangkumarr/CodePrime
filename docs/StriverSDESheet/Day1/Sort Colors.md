---
sidebar_position : 5
---

# Sort an array of 0’s 1’s 2’s

## Problem Link
https://leetcode.com/problems/sort-colors/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
