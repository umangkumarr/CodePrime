---
title: "Job Sequencing Problem"
description: "Schedule unit-time jobs with deadlines to maximise total profit, greedily by profit with a disjoint-set union that finds the latest free slot."
source: "https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1"
difficulty: "Medium"
tags: ["Greedy", "Union Find", "Sorting"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

You are given two arrays: `deadline[]`, and `profit[]`, which represent a set of jobs, where each job is associated with a deadline, and a profit. Each job takes 1 unit of time to complete, and only one job can be scheduled at a time. You will earn the profit associated with a job only if it is completed by its deadline.

Your task is to return the following two values:

- Number of jobs selected for the maximum profit.
- The total maximum profit by completing those jobs.

Complete the function `jobSequencing()` which takes the arrays `deadline` and `profit` and returns a vector `[count, maxProfit]`.

**Example 1:**

```text
Input:  deadline[] = [4, 1, 1, 1], profit[] = [20, 10, 40, 30]
Output: [2, 60]
Explanation: Job1 and Job3 can be done with maximum profit of 60 (20 + 40).
```

**Example 2:**

```text
Input:  deadline[] = [2, 1, 2, 1, 1], profit[] = [100, 19, 27, 25, 15]
Output: [2, 127]
Explanation: Job1 and Job3 can be done with maximum profit of 127 (100 + 27).
```

**Example 3:**

```text
Input:  deadline[] = [3, 1, 2, 2], profit[] = [50, 10, 20, 30]
Output: [3, 100]
Explanation: Job1, Job3 and Job4 can be completed with a maximum profit of 100 (50 + 20 + 30).
```

**Constraints:**

- $1 \le$ `deadline.size()` $=$ `profit.size()` $\le 10^5$
- $1 \le$ `deadline[i]` $\le$ `deadline.size()`
- $1 \le$ `profit[i]` $\le 500$

## Solution approach

### Intuition

Time is split into unit slots `1, 2, 3, ...`; a job with deadline `d` may occupy any free slot `t` with `t <= d`.

**Greedy choice.** Consider jobs from the most to the least profitable and accept a job whenever it can still be fitted in. An exchange argument shows this is safe: if an optimal schedule skipped a more profitable job that fits, swapping it in for a less profitable one would not lower the profit.

**Where to put an accepted job.** Place it in the **latest** free slot not after its deadline. Using a late slot keeps the early slots open for jobs with tighter deadlines that may come later. For example, after a deadline-3 job takes slot 3, a deadline-1 job can still get slot 1.

Finding "the latest free slot `<= d`" by scanning left costs up to $O(n)$ per job, so $O(n^2)$ in the worst case. A **disjoint-set union** answers it in near-constant time: keep `parent[t]` pointing at the latest free slot `<= t`. Initially every slot points to itself. When slot `s` is taken, link it to `s - 1`; `find(d)` then follows the links to the nearest free slot on the left, with path compression keeping the chains short. Slot `0` is a sentinel meaning "no free slot".

All profits are positive, so the greedy schedule fits as many jobs as possible; that count is the same for every maximum-profit schedule, which makes the returned `count` well-defined.

### Algorithm

1. Sort the job indices `order` by `profit` in decreasing order.
2. Let `maxD` be the largest deadline; set `parent[t] = t` for `t` in `0..maxD`.
3. For each job `i` in `order`:
   - `slot = find(deadline[i])`;
   - if `slot > 0`, take it: `count++`, `total += profit[i]`, and set `parent[slot] = slot - 1`.
4. Return `{count, total}`.

### Walkthrough

Example 3, slots `1..3`, each cell shows the profit of the job placed there:

![Greedy job placement into the latest free slot on deadline = [3,1,2,2], profit = [50,10,20,30]](/img/codes/job-sequencing-problem/slots/01.webp)

### Complexity

- **Time:** $O(n \log n)$ — the sort dominates; the `n` `find` calls cost $O(n \, \alpha(n))$ in total with path compression.
- **Space:** $O(n)$ — `order` and `parent` (`maxD <= n`).

### Edge cases

- **Many jobs with deadline 1** (Example 1): only the most profitable one gets slot 1; after that `find(1)` returns `0` and the rest are skipped.
- **All slots full:** `find` returns the sentinel `0` and the job is skipped without scanning.

## Code

```cpp
class Solution {
    vector<int> parent;  // parent[t] leads to the latest free slot <= t (0 = none)

    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

   public:
    vector<int> jobSequencing(vector<int>& deadline, vector<int>& profit) {
        int n = deadline.size();
        vector<int> order(n);
        iota(order.begin(), order.end(), 0);
        sort(order.begin(), order.end(),
             [&](int a, int b) { return profit[a] > profit[b]; });

        int maxD = *max_element(deadline.begin(), deadline.end());
        parent.resize(maxD + 1);
        iota(parent.begin(), parent.end(), 0);

        int count = 0, total = 0;
        for (int i : order) {
            int slot = find(deadline[i]);
            if (slot > 0) {
                count++;
                total += profit[i];
                parent[slot] = slot - 1;
            }
        }
        return {count, total};
    }
};
```

```java
class Solution {
    private int[] parent;  // parent[t] leads to the latest free slot <= t (0 = none)

    private int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    public ArrayList<Integer> jobSequencing(int[] deadline, int[] profit) {
        int n = deadline.length;
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) order[i] = i;
        Arrays.sort(order, (a, b) -> Integer.compare(profit[b], profit[a]));

        int maxD = 0;
        for (int d : deadline) maxD = Math.max(maxD, d);
        parent = new int[maxD + 1];
        for (int t = 0; t <= maxD; t++) parent[t] = t;

        int count = 0, total = 0;
        for (int i : order) {
            int slot = find(deadline[i]);
            if (slot > 0) {
                count++;
                total += profit[i];
                parent[slot] = slot - 1;
            }
        }
        return new ArrayList<>(List.of(count, total));
    }
}
```

```python
class Solution:
    def jobSequencing(self, deadline, profit):
        # parent[t] leads to the latest free slot <= t (0 = none)
        parent = list(range(max(deadline) + 1))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        count = total = 0
        for i in sorted(range(len(deadline)), key=profit.__getitem__, reverse=True):
            slot = find(deadline[i])
            if slot > 0:
                count += 1
                total += profit[i]
                parent[slot] = slot - 1
        return [count, total]
```
