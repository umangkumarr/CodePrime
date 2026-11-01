---
title: "Job Sequencing Problem"
description: "Given a set of N jobs where each jobi has a deadline and profit associated with it. Each job takes 1 unit of time to complete and only one job can be…"
source: "https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1#"
tags: ["Array", "Dynamic Programming", "Sorting"]
complexity:
  time: "O(n \\log n + n \\cdot D)"
  space: "O(D)"
---

## Problem

<p></p><p><span>Given a set of <strong>N</strong> jobs where each <strong>job<sub>i</sub></strong>&nbsp;has a deadline and profit associated with it. </span></p>

<p><span>Each job takes <strong><em>1</em></strong> unit of time to complete and only one job can be scheduled at a time. We earn the profit associated with job if and only if the job is completed by its deadline. </span></p>

<p><span>Find the number of jobs done and the&nbsp;<strong>maximum profit</strong>.</span></p>

<p><strong><span>Note: </span></strong><span>J</span><span>obs will be given in the form (Job<sub>id</sub>, Deadline,&nbsp;Profit) associated with that Job.</span></p>

<p><span><strong>Your Task</strong> :<br/> You don't need to read input or print anything. Your task is to complete the function <strong>JobScheduling()</strong> which takes an integer <strong>N</strong> and an array of Jobs(Job id, Deadline,&nbsp;Profit) as input and returns the count of jobs and maximum profit.</span></p>

## Solution approach

### Intuition

Each job takes one unit of time and must finish by its deadline. Greedily, we want the most profitable jobs first. When we schedule a job, we place it in the **latest** free slot that still meets its deadline, which keeps the earlier slots open for jobs with tighter deadlines.

### Algorithm

1. Sort `arr` in decreasing order of `profit`.
2. Find the largest deadline `slot` and create the slot array `v` of size `slot + 1` (slot `t` covers time `t`, and `0` means free).
3. For each job in sorted order:
   - start at `j = arr[i].dead` and move left while slot `j` is taken;
   - if a free slot `j >= 1` is found, mark `v[j] = 1`, add the job's profit to `res` and increment `count`;
   - otherwise skip the job.
4. Return `{count, res}`.

### Complexity

- **Time:** $O(n \log n + n \cdot D)$ — sorting, plus a backward scan of up to $D$ slots per job, where $D$ is the maximum deadline.
- **Space:** $O(D)$ — the slot array `v`.

### Edge cases

- **Several jobs with the same deadline:** later ones move to earlier free slots, or are dropped once slots `1` to `dead` are all full.

## Code

```cpp title="C++"
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
