---
sidebar_position : 152
tags: [Depth-First Search, Breadth-First Search, Graph, Topological Sort]
---

# Course Schedule

## [Problem](https://leetcode.com/problems/course-schedule/)

<p>There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>. You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [ai, bi]</code> indicates that you <strong>must</strong> take course <code>bi</code> first if you want to take course <code>ai</code>.</p>

<ul>
	<li>For example, the pair <code>[0, 1]</code>, indicates that to take course <code>0</code> you have to first take course <code>1</code>.</li>
</ul>

<p>Return <code>true</code> if you can finish all courses. Otherwise, return <code>false</code>.</p>

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
    int check = 1;
    vector<int> vis, st;
    unordered_map<int, vector<int>> edges;

    void dfs(int cur) {
        if (vis[cur] || check == 0) {
            check = 0;
            return;
        }
        vis[cur] = 1;
        st[cur] = 1;
        for (auto nbr : edges[cur]) {
            if (!vis[nbr])
                dfs(nbr);
            else if (st[nbr])
                check = 0;
        }
        st[cur] = 0;
    }

    bool canFinish(int numCourses, vector<vector<int>>& pre) {
        vis.resize(numCourses);
        st.resize(numCourses);
        for (int i = 0; i < pre.size(); i++) {
            int x = pre[i][0];
            int y = pre[i][1];
            edges[x].push_back(y);
            // edges[y].push_back(x);
        }

        for (int i = 0; i < numCourses; i++) {
            if (!vis[i]) {
                dfs(i);
            }
        }
        return check;
    }
};

```
</TabItem>
</Tabs>

</details>
