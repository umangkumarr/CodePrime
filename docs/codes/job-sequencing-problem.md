---
displayed_sidebar: null
sidebar_position : 3
tags: [Array, Dynamic Programming, Sorting]
---

# Job Sequencing Problem

## [Problem](https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1#)


<p></p><p><span>Given a set of <strong>N</strong> jobs where each <strong>job<sub>i</sub></strong>&nbsp;has a deadline and profit associated with it. </span></p>

<p><span>Each job takes <strong><em>1</em></strong> unit of time to complete and only one job can be scheduled at a time. We earn the profit associated with job if and only if the job is completed by its deadline. </span></p>

<p><span>Find the number of jobs done and the&nbsp;<strong>maximum profit</strong>.</span></p>

<p><strong><span>Note: </span></strong><span>J</span><span>obs will be given in the form (Job<sub>id</sub>, Deadline,&nbsp;Profit) associated with that Job.</span></p>

<p>
<span><strong>Your Task</strong> :<br/>
You don't need to read input or print anything. Your task is to complete the function <strong>JobScheduling()</strong> which takes an integer <strong>N</strong> and an array of Jobs(Job id, Deadline,&nbsp;Profit) as input and returns the count of jobs and maximum profit.</span></p>


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
