---
title: "Maximum Profit in Job Scheduling"
description: "We have n jobs, where every job is scheduled to be done from startTime[i] to endTime[i], obtaining a profit of profit[i]. You're given the startTime,…"
source: "https://leetcode.com/problems/maximum-profit-in-job-scheduling/"
tags: ["Array", "Binary Search", "Dynamic Programming", "Sorting"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>We have <code>n</code> jobs, where every job is scheduled to be done from <code>startTime[i]</code> to <code>endTime[i]</code>, obtaining a profit of <code>profit[i]</code>.</p>

<p>You&#39;re given the <code>startTime</code>, <code>endTime</code> and <code>profit</code> arrays, return the maximum profit you can take such that there are no two jobs in the subset with overlapping time range.</p>

<p>If you choose a job that ends at time <code>X</code> you will be able to start another job that starts at time <code>X</code>.</p>

## Solution approach

### Intuition

Sort the jobs by end time. For the `i`-th job there are only two choices: skip it, or take it and add the best profit achievable using only jobs that end no later than its start time. Because the jobs are sorted by end time, those compatible jobs form a prefix, and binary search finds where that prefix ends.

Trying every subset of jobs would be exponential; the prefix DP turns it into one binary search per job.

### Algorithm

1. Build `v` with one entry `{endTime, startTime, profit}` per job, plus a sentinel `{INT_MIN, INT_MIN, INT_MIN}` at index `0` so jobs are 1-indexed, and sort it. Sort `endTime` separately as well.
2. Let `dp[i][0]` be the best profit over the first `i` jobs without job `i`, and `dp[i][1]` the best profit with job `i` taken.
3. For each `i`, set `dp[i][0] = max(dp[i - 1][0], dp[i - 1][1])`.
4. For `dp[i][1]`, start with `v[i][2]`, use `upper_bound` on the sorted `endTime` to get `indx`, the number of jobs ending at or before `v[i][1]`, and add `max(dp[indx][0], dp[indx][1])`.
5. Return `max(dp[n][0], dp[n][1])`.

### Complexity

- **Time:** $O(n \log n)$ — two sorts plus one binary search per job.
- **Space:** $O(n)$ — the arrays `v` and `dp`.

### Edge cases

- **A job starting exactly when another ends** is compatible: `upper_bound` counts end times equal to the start.

## Code

```cpp title="C++"
class Solution {
   public:
    int jobScheduling(vector<int>& startTime, vector<int>& endTime,
                      vector<int>& profit) {
        vector<vector<int>> v;
        int n = startTime.size();
        v.push_back({INT_MIN, INT_MIN, INT_MIN});
        for (int i = 0; i < n; i++) {
            v.push_back({endTime[i], startTime[i], profit[i]});
        }
        sort(v.begin(), v.end());
        sort(endTime.begin(), endTime.end());

        vector<vector<int>> dp(n + 1, vector<int>(2));
        for (int i = 1; i <= n; i++) {
            dp[i][0] = max(dp[i - 1][0], dp[i - 1][1]);
            dp[i][1] = v[i][2];
            int indx = upper_bound(endTime.begin(), endTime.end(), v[i][1]) -
                       endTime.begin();
            dp[i][1] += max(dp[indx][0], dp[indx][1]);
        }
        return max(dp[n][0], dp[n][1]);
    }
};

```
