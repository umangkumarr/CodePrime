---
sidebar_position : 6
tags: [Graph, Dynamic Programming, Heap(Priority_Queue)]
---

# Minimum Spanning Tree

## [Problem](https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1)

Given a weighted, undirected and connected graph of V vertices and E edges. The task is to find the sum of weights of the edges of the Minimum Spanning Tree.

## Solution Approach

Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Kruskal's Algorithm</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<int> par;

    void make(int v) { par[v] = v; }

    int find(int v) {
        if (par[v] == v) return v;
        return par[v] = find(par[v]);
    }

    void Union(int a, int b) {
        int pa = find(a);
        int pb = find(b);
        par[pb] = pa;
    }

    int spanningTree(int V, vector<vector<int>> adj[]) {
        // code here
        par.resize(V);
        vector<pair<int, pair<int, int>>> edges;
        int ans = 0;
        for (int i = 0; i < V; i++) {
            for (auto j : adj[i]) {
                edges.push_back({j[1], {i, j[0]}});
            }
            make(i);
        }
        sort(edges.begin(), edges.end());
        for (auto e : edges) {
            int w = e.first;
            int u = e.second.first;
            int v = e.second.second;
            if (find(u) == find(v)) continue;
            ans += w;
            Union(u, v);
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>

<details><summary>Prim's Algorithm</summary>

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
