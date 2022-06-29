---
sidebar_position : 5
tags: [Graph, Dynamic Programming, Heap(Priority_Queue)]
---

# MST using Prim's Algo

## [Problem](https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1)

Given a weighted, undirected and connected graph of V vertices and E edges. The task is to find the sum of weights of the edges of the Minimum Spanning Tree.

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
    int spanningTree(int V, vector<vector<int>> adj[]) {
        priority_queue<pair<int, int>, vector<pair<int, int>>,
                       greater<pair<int, int>>>
            pq;
        vector<int> vis(V, 0);
        vector<int> key(V, INT_MAX);
        key[0] = 0;
        pq.push({0, 0});
        while (!pq.empty()) {
            int u = pq.top().second;
            pq.pop();
            vis[u] = 1;
            for (auto it : adj[u]) {
                int v = it[0];
                int w = it[1];
                if (vis[v] == 0 && w < key[v]) {
                    key[v] = w;
                    pq.push({key[v], v});
                }
            }
        }
        int sum = 0;
        for (int i = 0; i < V; i++) {
            sum += key[i];
        }
        return sum;
    }
};
```
</TabItem>
</Tabs>

</details>
