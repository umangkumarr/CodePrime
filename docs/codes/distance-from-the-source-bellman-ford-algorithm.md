---
sidebar_position : 3
tags: [Graph, Dynamic Programming]
---

# Bellman-Ford Algorithm

## [Problem](https://practice.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/0/?fbclid=IwAR2_lL0T84DnciLyzMTQuVTMBOi82nTWNLuXjUgahnrtBgkphKiYk6xcyJU)

Given a weighted, directed and connected graph of V vertices and E edges, Find the shortest distance of all the vertex's from the source vertex S.
<strong>Note:</strong> The Graph doesn't contain any negative weight cycle.

## Solution Approach

Expected Time complexity: $O(n^2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<int> bellman_ford(int V, vector<vector<int>> adj, int S) {
        vector<int> dist(V, 100000000);
        vector<vector<int>> edges = adj;
        dist[S] = 0;
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < edges.size(); j++) {
                int u = edges[j][0];
                int v = edges[j][1];
                int w = edges[j][2];
                dist[v] = min(dist[u] + w, dist[v]);
            }
        }
        return dist;
    }
};
```
</TabItem>
</Tabs>

</details>
