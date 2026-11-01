---
title: "Course Schedule II"
description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] =…"
source: "https://leetcode.com/problems/course-schedule-ii/"
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

<p>Return <em>the ordering of courses you should take to finish all courses</em>. If there are many valid answers, return <strong>any</strong> of them. If it is impossible to finish all courses, return <strong>an empty array</strong>.</p>

## Solution approach

### Intuition

Build a directed graph with an edge from each course `a[i]` to its prerequisite `b[i]`. A valid order exists only if this graph has no cycle. A DFS that adds a node to the answer **after** all its neighbours are finished (post-order) lists every prerequisite before the courses that need it, so that post-order is itself a valid course order.

A cycle shows up during DFS as an edge to a node that is still on the current recursion path.

### Algorithm

1. `assign(numCourses)` sizes the graph `G`; `addedge(i[0], i[1])` adds an edge from each course to its prerequisite.
2. For every unvisited node `i`, clear `path` and call `dfs(i, vis)`.
3. In `dfs`, mark `path[cur] = 1`. For each neighbour `nbr`: if it is not finished (`!vis[nbr]`) but is on the path (`path[nbr]`), a cycle exists, so set `ans = -1`. If it is simply unvisited, recurse.
4. After all neighbours, mark `vis[cur] = 1` and append `cur` to `arr`.
5. If `ans == -1`, clear `arr` and return it empty; otherwise return `arr`.

### Complexity

- **Time:** $O(V + E)$ — each course and each prerequisite pair is processed once (hash-map lookups are $O(1)$ on average).
- **Space:** $O(V + E)$ — the adjacency list, plus `vis`, `path` and the recursion stack of depth up to $V$.

### Edge cases

- **No prerequisites:** every node is visited alone and `arr` lists courses `0` to `numCourses - 1`.
- **A cycle anywhere** makes the function return an empty array.

## Code

```cpp title="C++"
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
