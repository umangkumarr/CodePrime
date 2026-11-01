---
title: "Course Schedule"
description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] =…"
source: "https://leetcode.com/problems/course-schedule/"
tags: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"]
complexity:
  time: "O(V + E)"
  space: "O(V + E)"
---

## Problem

<p>There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>. You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [ai, bi]</code> indicates that you <strong>must</strong> take course <code>bi</code> first if you want to take course <code>ai</code>.</p>

<ul>
	<li>For example, the pair <code>[0, 1]</code>, indicates that to take course <code>0</code> you have to first take course <code>1</code>.</li>
</ul>

<p>Return <code>true</code> if you can finish all courses. Otherwise, return <code>false</code>.</p>

## Solution approach

### Intuition

All courses can be finished exactly when the prerequisite graph has no directed cycle. A DFS finds a cycle when it reaches a node that is still on the current recursion stack: that means the path has looped back on itself.

The code keeps two arrays: `vis` marks nodes ever visited, and `st` marks nodes currently on the recursion stack.

### Algorithm

1. Build `edges`, an adjacency list with an edge from `pre[i][0]` to `pre[i][1]`.
2. For every course `i` that is not yet visited, call `dfs(i)`.
3. In `dfs(cur)`, set `vis[cur] = 1` and `st[cur] = 1`. For each neighbour `nbr`: recurse if it is unvisited; if it is visited and `st[nbr]` is set, it lies on the current path, so set `check = 0`.
4. Before returning, set `st[cur] = 0`, since `cur` leaves the recursion stack.
5. Return `check`: `1` if no cycle was found.

### Complexity

- **Time:** $O(V + E)$ — every course is visited once and every prerequisite edge is examined once.
- **Space:** $O(V + E)$ — the adjacency list, `vis`, `st`, and a recursion stack of depth up to $V$.

### Edge cases

- **Self-loop** like `[0, 0]`: `0` is on the stack when its own edge is examined, so `check` becomes `0`.
- **Disconnected graph:** the outer loop starts a DFS from every unvisited course, so no component is missed.

## Code

```cpp title="C++"
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
