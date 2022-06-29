---
sidebar_position : 5
---

# Remove Duplicates from Sorted Array

## Problem Link
https://leetcode.com/problems/remove-duplicates-from-sorted-array/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int removeDuplicates(vector<int>& A) {
        int count = 0;
        int n = A.size();
        for (int i = 1; i < n; i++) {
            if (A[i] == A[i - 1])
                count++;
            else
                A[i - count] = A[i];
        }
        return n - count;
    }
};
```
</TabItem>
</Tabs>

</details>
