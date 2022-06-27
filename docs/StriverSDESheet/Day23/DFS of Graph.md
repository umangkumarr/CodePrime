---
sidebar_position : 4
tags: [Array, Depth-First Search, Graph]
---

# DFS of Graph

## [Problem](https://practice.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1)

Given a connected undirected graph. Perform a Depth First Traversal of the graph.
<strong>Note:</strong> Use recursive approach to find the DFS traversal of the graph starting from the 0th vertex from left to right according to the graph.


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
    vector<int> ans;
    vector<int> vis;
    void dfs(vector<int> adj[], int cur, int par) {
        if (vis[cur]) return;
        vis[cur] = 1;
        ans.push_back(cur);
        for (auto nbr : adj[cur]) {
            if (nbr != par) {
                dfs(adj, nbr, cur);
            }
        }
    }

    vector<int> dfsOfGraph(int V, vector<int> adj[]) {
        vis.resize(V);
        dfs(adj, 0, -1);
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
