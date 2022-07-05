---
displayed_sidebar: null
sidebar_position : 3
tags: [Heap(Priority Queue)]
---

# Maximum Sum Combinations

## [Problem](https://www.interviewbit.com/problems/maximum-sum-combinations/)

<p>Given two equally sized 1-D arrays <strong>A, B</strong> containing <strong>N</strong> integers each.</p><p></p><p></p><p></p><p></p><p></p><p></p>
<p>A <strong>sum combination</strong> is made by adding one element from array <strong>A</strong> and another element of array <strong>B</strong>.</p>
<p>Return the <strong>maximum C valid sum combinations</strong> from all the possible sum combinations.</p>


## Solution Approach
Expected Time complexity: $O(n*log(n))$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
#define f f
#define s s

vector<int> Solution::solve(vector<int> &A, vector<int> &B, int C) {
    int n = A.size();
    vector<int> ans;
    sort(A.begin(), A.end(), greater<int>());
    sort(B.begin(), B.end(), greater<int>());

    priority_queue<pair<int, pair<int, int>>> pq;  // A[i]+B[j], <i, j>
    set<pair<int, int>> vis;                       // i, j

    pq.push({A[0] + B[0], {0, 0}});
    vis.insert({0, 0});

    for (int i = 0; i < C; ++i) {
        auto p = pq.top();
        pq.pop();
        ans.push_back(p.f);

        if (p.s.f + 1 < n && vis.find({p.s.f + 1, p.s.s}) == vis.end()) {
            vis.insert({p.s.f + 1, p.s.s});
            int x = A[p.s.f + 1] + B[p.s.s];
            pq.push({x, {p.s.f + 1, p.s.s}});
        }
        if (p.s.s + 1 < n && vis.find({p.s.f, p.s.s + 1}) == vis.end()) {
            vis.insert({p.s.f, p.s.s + 1});
            int x = A[p.s.f] + B[p.s.s + 1];
            pq.push({x, {p.s.f, p.s.s + 1}});
        }
    }

    return ans;
}

```
</TabItem>
</Tabs>

</details>
