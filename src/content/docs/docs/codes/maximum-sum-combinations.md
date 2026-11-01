---
title: "Maximum Sum Combinations"
description: "Given two equally sized 1-D arrays A, B containing N integers each. A sum combination is made by adding one element from array A and another element of…"
source: "https://www.interviewbit.com/problems/maximum-sum-combinations/"
tags: ["Heap(Priority Queue)"]
complexity:
  time: "O(n \\log n + C \\log C)"
  space: "O(C)"
---

## Problem

<p>Given two equally sized 1-D arrays <strong>A, B</strong> containing <strong>N</strong> integers each.</p><p></p><p></p><p></p><p></p><p></p><p></p>
<p>A <strong>sum combination</strong> is made by adding one element from array <strong>A</strong> and another element of array <strong>B</strong>.</p>
<p>Return the <strong>maximum C valid sum combinations</strong> from all the possible sum combinations.</p>

## Solution approach

### Intuition

After sorting both arrays in decreasing order, the largest sum is `A[0] + B[0]`. If `A[i] + B[j]` has just been taken, the next candidates it unlocks are `A[i + 1] + B[j]` and `A[i] + B[j + 1]`, since every other pair is dominated by one already in play. A max-heap of these frontier pairs always yields the next largest sum.

Generating all $n^2$ sums and sorting them would take $O(n^2 \log n)$ time; the heap only explores about `2C` pairs.

### Algorithm

1. Sort `A` and `B` in decreasing order.
2. Push `{A[0] + B[0], {0, 0}}` into the max-heap `pq`, and mark `{0, 0}` in the set `vis`.
3. Repeat `C` times: pop the top pair, append its sum to `ans`, then push the neighbours `(i + 1, j)` and `(i, j + 1)` if they are within bounds and not yet in `vis`.
4. Return `ans`.

### Complexity

- **Time:** $O(n \log n + C \log C)$ — sorting, then `C` rounds of heap and set operations on structures of size $O(C)$.
- **Space:** $O(C)$ — the heap and the `vis` set.

### Edge cases

- **Equal sums** from different index pairs are all reported, because `vis` tracks indices, not values.

## Code

```cpp title="C++"
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
