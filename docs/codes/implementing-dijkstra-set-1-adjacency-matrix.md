---
sidebar_position : 2
tags: [Graph, Dynamic Programming, Heap(Priority_Queue)]
---

# Dijkstra Algorithm

## [Problem](https://practice.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1)

Given a weighted, undirected and connected graph of V vertices and E edges, Find the shortest distance of all the vertex's from the source vertex S.
<strong>Note:</strong> The Graph doesn't contain any negative weight cycle.

## Solution Approach

Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<int> vis;
    priority_queue<pair<int, int>, vector<pair<int, int>>,
                   greater<pair<int, int>>>
        q;
    vector<int> wt;
    void dfs(int cur, int par, vector<vector<int>> adj[], int wth) {
        if (vis[cur]) return;
        wt[cur] = wth;
        vis[cur] = 1;
        for (auto i : adj[cur]) {
            if (i[0] != par) {
                q.push({wt[cur] + i[1], i[0]});
            }
        }

        while (!q.empty()) {
            pair<int, int> p = q.top();
            q.pop();
            dfs(p.second, cur, adj, p.first);
        }
    }

    vector<int> dijkstra(int V, vector<vector<int>> adj[], int S) {
        vis.resize(V);
        wt.resize(V, INT_MAX);
        dfs(S, -1, adj, 0);
        return wt;
    }
};

```
</TabItem>
</Tabs>

</details>
