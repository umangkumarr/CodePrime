---
title: "Maximum Profit in Job Scheduling"
description: "Choose non-overlapping jobs with maximum total profit by sorting jobs by end time and running a take-or-skip DP with binary search for the last compatible job."
source: "https://leetcode.com/problems/maximum-profit-in-job-scheduling/"
difficulty: "Hard"
tags: ["Array", "Binary Search", "Dynamic Programming", "Sorting"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

We have `n` jobs, where every job is scheduled to be done from `startTime[i]` to `endTime[i]`, obtaining a profit of `profit[i]`.

You're given the `startTime`, `endTime` and `profit` arrays, return the maximum profit you can take such that there are no two jobs in the subset with overlapping time range.

If you choose a job that ends at time `X` you will be able to start another job that starts at time `X`.

**Example 1:**

![Four jobs on a timeline; jobs 1 and 4 are chosen](https://assets.leetcode.com/uploads/2019/10/10/sample1_1584.png)

```text
Input:  startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]
Output: 120
Explanation: The subset chosen is the first and fourth job.
Time range [1-3]+[3-6] , we get profit of 120 = 50 + 70.
```

**Example 2:**

![Five jobs on a timeline; jobs 1, 4 and 5 are chosen](https://assets.leetcode.com/uploads/2019/10/10/sample22_1584.png)

```text
Input:  startTime = [1,2,3,4,6], endTime = [3,5,10,6,9], profit = [20,20,100,70,60]
Output: 150
Explanation: The subset chosen is the first, fourth and fifth job.
Profit obtained 150 = 20 + 70 + 60.
```

**Example 3:**

![Three jobs all starting at time 1](https://assets.leetcode.com/uploads/2019/10/10/sample3_1584.png)

```text
Input:  startTime = [1,1,1], endTime = [2,3,4], profit = [5,6,4]
Output: 6
```

**Constraints:**

- $1 \le$ `startTime.length == endTime.length == profit.length` $\le 5 \times 10^4$
- $1 \le$ `startTime[i] < endTime[i]` $\le 10^9$
- $1 \le$ `profit[i]` $\le 10^4$

## Solution approach

### Intuition

This is **weighted interval scheduling**. Greedy choices fail (the most profitable or the earliest-ending job may block better combinations), but a DP over jobs sorted by end time works.

Sort the jobs by end time and let `dp[i]` be the best profit using only the first `i` jobs in that order. For job `i` (1-indexed) there are two choices:

- **skip it:** `dp[i - 1]`;
- **take it:** its profit plus the best profit among jobs that end no later than its start. Because the jobs are sorted by end, those jobs are exactly a **prefix** of length `j`, and `j` is found with a binary search on the sorted end times. The answer for that prefix is already known: `dp[j]`.

Since every job in the prefix ends before job `i` ends, `j < i`, so `dp[j]` is computed before it is needed.

### Algorithm

1. Build `order`, the job indices sorted by `endTime`, and `ends`, the end times in that order.
2. `dp[0] = 0`. For `i = 1..n`, let `k = order[i - 1]` be the `i`-th job:
   - `j = upper_bound(ends, startTime[k])` — the number of jobs with end time `<= startTime[k]` (equality is allowed, since a job may start when another ends).
   - `dp[i] = max(dp[i - 1], dp[j] + profit[k])`.
3. Return `dp[n]`.

### Walkthrough

Example 2 sorted by end time is `[1,3] 20`, `[2,5] 20`, `[4,6] 70`, `[6,9] 60`, `[3,10] 100`. Orange marks the prefix `dp[j]` that job `i` can extend:

![DP over jobs sorted by end time for Example 2](/img/codes/maximum-profit-in-job-scheduling/dp/01.webp)

### Complexity

- **Time:** $O(n \log n)$ — sorting plus one binary search per job.
- **Space:** $O(n)$ — `order`, `ends` and `dp`.

### Edge cases

- **A job starting exactly when another ends** is compatible: `upper_bound` counts end times equal to the start.
- **Several jobs with the same start** (Example 3): they can never be combined, and the DP takes the best single one.
- **Overflow:** at most $5 \times 10^4 \cdot 10^4 = 5 \times 10^8$, which fits in an `int`.

## Code

```cpp
class Solution {
   public:
    int jobScheduling(vector<int>& startTime, vector<int>& endTime, vector<int>& profit) {
        int n = startTime.size();
        vector<int> order(n);
        iota(order.begin(), order.end(), 0);
        sort(order.begin(), order.end(), [&](int a, int b) { return endTime[a] < endTime[b]; });

        vector<int> ends(n);
        for (int i = 0; i < n; ++i) ends[i] = endTime[order[i]];

        // dp[i] = best profit using only the first i jobs in end-time order.
        vector<int> dp(n + 1, 0);
        for (int i = 1; i <= n; ++i) {
            int k = order[i - 1];
            int j = upper_bound(ends.begin(), ends.end(), startTime[k]) - ends.begin();
            dp[i] = max(dp[i - 1], dp[j] + profit[k]);
        }
        return dp[n];
    }
};
```

```java
class Solution {
    public int jobScheduling(int[] startTime, int[] endTime, int[] profit) {
        int n = startTime.length;
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) order[i] = i;
        Arrays.sort(order, (a, b) -> Integer.compare(endTime[a], endTime[b]));

        int[] ends = new int[n];
        for (int i = 0; i < n; i++) ends[i] = endTime[order[i]];

        // dp[i] = best profit using only the first i jobs in end-time order.
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            int k = order[i - 1];
            int j = upperBound(ends, startTime[k]);
            dp[i] = Math.max(dp[i - 1], dp[j] + profit[k]);
        }
        return dp[n];
    }

    // First index whose value is greater than x.
    private int upperBound(int[] a, int x) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (a[mid] <= x) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}
```

```python
from bisect import bisect_right


class Solution:
    def jobScheduling(self, startTime: list[int], endTime: list[int], profit: list[int]) -> int:
        n = len(startTime)
        order = sorted(range(n), key=lambda i: endTime[i])
        ends = [endTime[i] for i in order]

        # dp[i] = best profit using only the first i jobs in end-time order.
        dp = [0] * (n + 1)
        for i, k in enumerate(order, 1):
            j = bisect_right(ends, startTime[k])
            dp[i] = max(dp[i - 1], dp[j] + profit[k])
        return dp[n]
```
