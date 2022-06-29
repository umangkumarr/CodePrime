---
sidebar_position : 21
tags: [Depth-First Search, Breadth-First Search, Graph, Topological Sort]
---

# Course Schedule II

## [Problem](https://leetcode.com/problems/course-schedule-ii/)

<p>There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>. You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [ai, bi]</code> indicates that you <strong>must</strong> take course <code>bi</code> first if you want to take course <code>ai</code>.</p>

<ul>
	<li>For example, the pair <code>[0, 1]</code>, indicates that to take course <code>0</code> you have to first take course <code>1</code>.</li>
</ul>

<p>Return <em>the ordering of courses you should take to finish all courses</em>. If there are many valid answers, return <strong>any</strong> of them. If it is impossible to finish all courses, return <strong>an empty array</strong>.</p>

## Solution Approach

Make a directed graph from $a[i] -> b[i]$. Then do a BFS to check if the graph is acyclic or not. If the graph is acyclic return then BFS traversal of the graph.

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
#include <unordered_map>
#include <vector>
class Solution {
    vector<vector<int>> G;
    int N, ans = 1;
    unordered_map<int, int> path;
    vector<int> arr;

   public:
    void assign(int n) {
        this->N = n;
        G.resize(N);
    }
    void addedge(int x, int y) { G[x].push_back(y); }

    void dfs(int cur, vector<int>& vis) {
        if (ans == -1) return;
        path[cur] = 1;
        for (auto nbr : G[cur]) {
            if (!vis[nbr] and path[nbr]) {
                ans = -1;
                return;
            } else if (!vis[nbr]) {
                dfs(nbr, vis);
            }
        }
        vis[cur] = 1;
        arr.push_back(cur);
    }

    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        assign(numCourses);
        for (auto i : prerequisites) {
            addedge(i[0], i[1]);
        }
        vector<int> vis(N);
        for (int i = 0; i < N; i++) {
            vis[i] = 0;
        }
        for (int i = 0; i < N; i++) {
            if (!vis[i]) {
                path.clear();
                dfs(i, vis);
                if (ans == -1) {
                    arr.clear();
                    return arr;
                }
            }
        }
        return arr;
    }
};
```
</TabItem>
</Tabs>

</details>
