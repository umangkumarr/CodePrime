---
title: "M-Coloring Problem"
description: "Given an undirected graph and an integer M. The task is to determine if the graph can be colored with at most M colors such that no two adjacent vertices…"
source: "https://practice.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1#"
tags: ["Array", "Backtracking"]
complexity:
  time: "O(n \\cdot m^n)"
  space: "O(n)"
---

## Problem

<span >Given an undirected graph and an integer&nbsp;<strong>M</strong>. The task is to determine if the graph can be colored with at most M&nbsp;colors such that no two adjacent vertices of the graph are colored with the same color. Here coloring of a graph means the assignment of colors to all vertices. Print 1&nbsp;if it is possible to colour vertices and 0&nbsp;otherwise.</span>

## Solution approach

### Intuition

Use backtracking to explore the possible colourings of the graph and keep a valid one. Colour the vertices one at a time in index order. For the current vertex, try each of the `m` colours, and keep a colour only if no adjacent vertex already has it. If the remaining vertices cannot be coloured, undo the choice and try the next colour. Checking each colour as soon as it is placed prunes most dead-end branches early.

### Algorithm

1. `graphColoring` creates the `color` array filled with `0` (uncoloured) and calls `graphColor` from vertex `0`.
2. `graphColor(graph, vertex, n, m, color)` returns `true` once `vertex == n`, meaning every vertex is coloured.
3. Otherwise, for each colour `j` from `1` to `m`, set `color[vertex] = j` and call `isGood`, which checks all `n` vertices for a neighbour with the same colour.
4. If `isGood` passes and the recursive call for `vertex + 1` succeeds, return `true`; otherwise reset `color[vertex] = 0` and try the next colour.
5. Return `false` if no colour works.

### Complexity

- **Time:** $O(n \cdot m^n)$ — up to $m^n$ colour assignments are explored, and each `isGood` check scans `n` vertices.
- **Space:** $O(n)$ — the `color` array and the recursion stack of depth `n`.

## Code

```cpp title="C++"
bool isGood(bool graph[101][101], int vertex, int color[], int n) {
    for (int i = 0; i < n; i++) {
        if (graph[vertex][i] && color[vertex] == color[i]) return false;
    }
    return true;
}

bool graphColor(bool graph[101][101], int vertex, int n, int m, int color[]) {
    if (n == vertex) return true;

    for (int j = 1; j <= m; j++) {
        color[vertex] = j;
        if (isGood(graph, vertex, color, n)) {
            if (graphColor(graph, vertex + 1, n, m, color)) return true;
        }
        color[vertex] = 0;
    }
    return false;
}

bool graphColoring(bool graph[101][101], int m, int n) {
    int color[n];
    memset(color, 0, sizeof(color));
    return graphColor(graph, 0, n, m, color);
}

```
