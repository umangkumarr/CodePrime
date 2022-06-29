---
sidebar_position : 4
tags: [Array, Backtracking]
---

# M-Coloring Problem

## Problem Link
https://practice.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1#

## Solution Approach
Use Backtracking and find all the possible states of graph and pick the valid one accordingly.

Expected Time complexity: $O(M^N)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
