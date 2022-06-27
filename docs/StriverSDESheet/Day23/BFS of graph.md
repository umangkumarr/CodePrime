---
sidebar_position : 5
tags: [Array, Breadth-First Search, Graph]
---

# BFS of graph

## [Problem](https://practice.geeksforgeeks.org/problems/bfs-traversal-of-graph/1)

Given a directed graph. The task is to do Breadth First Traversal of this graph starting from 0.
<strong>Note:</strong>  One can move from node u to node v only if there's an edge from u to v and find the BFS traversal of the graph starting from the 0th vertex, from left to right according to the graph. Also, you should only take nodes directly or indirectly connected from Node 0 in consideration.


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
    vector<int> bfsOfGraph(int V, vector<int> adj[]) {
        vector<int> ans;
        vector<int> vis(V);
        deque<int> q;
        q.push_back(0);
        while (q.size()) {
            int cur = q.front();
            q.pop_front();
            if (vis[cur]) continue;
            ans.push_back(cur);
            vis[cur] = 1;
            for (auto nbr : adj[cur]) {
                q.push_back(nbr);
            }
        }
        return ans;
    }
};

```
</TabItem>
</Tabs>

</details>
