---
sidebar_position : 3
tags: [Array, Dynamic Programming, Sorting]
---

# Job Sequencing Problem

## Problem Link
https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1#

## Solution Approach
1. Sort all jobs in decreasing order of profit. 
2. Iterate on jobs in decreasing order of profit.For each job , do the following :
   * Find a time slot i, such that slot is empty and i < deadline and i is greatest.Put the job in 
this slot and mark this slot filled. 
   * If no such i exists, then ignore the job. 


Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<int> JobScheduling(Job arr[], int n) {
        sort(arr, arr + n,
             [](auto& a, auto& b) { return (a.profit > b.profit); });
        int slot = 0;
        for (int i = 0; i < n; i++) {
            slot = max(arr[i].dead, slot);
        }
        int res = 0;
        int count = 0;
        vector<int> v(slot + 1, 0);
        for (int i = 0; i < n; i++) {
            int j = arr[i].dead;
            while (j >= 1 && v[j] != 0) {
                j--;
            }
            if (j >= 1 && v[j] == 0) {
                res += arr[i].profit;
                count++;
                v[j] = 1;
            }
        }
        return {count, res};
    }
};
```
</TabItem>
</Tabs>

</details>
