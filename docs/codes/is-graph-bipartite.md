---
sidebar_position : 149
tags: [Depth-First Search, Breadth-First Search, Union Find, Graph]
---

# Is Graph Bipartite?

## [Problem](https://leetcode.com/problems/is-graph-bipartite/)

<p>There is an <strong>undirected</strong> graph with <code>n</code> nodes, where each node is numbered between <code>0</code> and <code>n - 1</code>. You are given a 2D array <code>graph</code>, where <code>graph[u]</code> is an array of nodes that node <code>u</code> is adjacent to. More formally, for each <code>v</code> in <code>graph[u]</code>, there is an undirected edge between node <code>u</code> and node <code>v</code>. The graph has the following properties:</p>

<ul>
	<li>There are no self-edges (<code>graph[u]</code> does not contain <code>u</code>).</li>
	<li>There are no parallel edges (<code>graph[u]</code> does not contain duplicate values).</li>
	<li>If <code>v</code> is in <code>graph[u]</code>, then <code>u</code> is in <code>graph[v]</code> (the graph is undirected).</li>
	<li>The graph may not be connected, meaning there may be two nodes <code>u</code> and <code>v</code> such that there is no path between them.</li>
</ul>

<p>A graph is <strong>bipartite</strong> if the nodes can be partitioned into two independent sets <code>A</code> and <code>B</code> such that <strong>every</strong> edge in the graph connects a node in set <code>A</code> and a node in set <code>B</code>.</p>

<p>Return <code>true</code><em> if and only if it is <strong>bipartite</strong></em>.</p>

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
    bool dfs_helper(vector<vector<int>> Graph, vector<int>& visited, int par,
                    int node, int color) {
        visited[node] = color;          // painted
        for (auto nbr : Graph[node]) {  // traversing nbrs
            if (nbr != par and visited[nbr] == 0) {
                bool value = dfs_helper(Graph, visited, node, nbr, 3 - color);
                if (value == false) return false;
            } else if (visited[nbr] == color)
                return false;
        }
        return true;
    }

    bool dfs(vector<vector<int>> Graph, int N) {
        vector<int> visited(N + 1);
        int color = 1;
        for (int i = 0; i < N; i++) {
            if (visited[i] == 0) {
                bool ans = dfs_helper(Graph, visited, -1, i, 1);
                if (ans == false) return ans;
            }
        }
        return true;
    }

    bool isBipartite(vector<vector<int>>& graph) {
        int n = graph.size();
        return dfs(graph, n);
    }
};

```
</TabItem>
</Tabs>

</details>
