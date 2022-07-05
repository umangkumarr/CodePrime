---
displayed_sidebar: null
sidebar_position : 6
tags: [Hash Table, Depth-First Search, Breadth-First Search, Graph]
---

# Topological sort

## [Problem](https://practice.geeksforgeeks.org/problems/topological-sort/1)

Given a Directed Acyclic Graph (DAG) with V vertices and E edges, Find any Topological Sorting of that Graph.

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    void findTopoSort(int node, vector<int>& vis, stack<int>& st,
                      vector<int> adj[]) {
        vis[node] = 1;

        for (auto it : adj[node]) {
            if (!vis[it]) {
                findTopoSort(it, vis, st, adj);
            }
        }
        st.push(node);
    }

   public:
    vector<int> topoSort(int N, vector<int> adj[]) {
        stack<int> st;
        vector<int> vis(N, 0);
        for (int i = 0; i < N; i++) {
            if (vis[i] == 0) {
                findTopoSort(i, vis, st, adj);
            }
        }
        vector<int> topo;
        while (!st.empty()) {
            topo.push_back(st.top());
            st.pop();
        }
        return topo;
    }
};
```
</TabItem>
</Tabs>

</details>
