---
sidebar_position : 5
tags: [Array, Backtracking]
---

# Rat in a Maze Problem I

## [Problem](https://practice.geeksforgeeks.org/problems/rat-in-a-maze-problem/1)

<p><span>Consider a rat placed at <strong>(0, 0)</strong> in a square matrix<strong> </strong>of order <strong>N * N</strong>. It has to reach the destination at <strong>(N - 1, N - 1)</strong>. Find all possible paths that the rat can take to reach from source to destination. The directions in which the rat can move are <strong>'U'(up)</strong>, <strong>'D'(down)</strong>, <strong>'L' (left)</strong>, <strong>'R' (right)</strong>. Value 0 at a cell in the matrix represents that it is blocked and rat cannot move to it while value 1 at a cell in the matrix represents that&nbsp;rat&nbsp;can be travel&nbsp;through it.<br/>
<strong>Note</strong>: In a path, no cell can be visited more than one time.</span>&nbsp;<span>If the source cell is&nbsp;0, the rat cannot move to any other cell.</span></p>

## Solution Approach
Use Backtracking and find all the possible ways of reaching the cell [N, N];

Expected Time complexity: $O(3^n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    vector<vector<int>> maze;
    vector<string> ans;
    string s;
    int n;

   public:
    void compute(int i, int j) {
        if (i == n - 1 && j == n - 1) {
            ans.push_back(s);
            return;
        }

        if (i > 0 && maze[i - 1][j]) {
            maze[i][j] = 0;
            s.push_back('U');
            compute(i - 1, j);
            s.pop_back();
            maze[i][j] = 1;
        }

        if (j > 0 && maze[i][j - 1]) {
            maze[i][j] = 0;
            s.push_back('L');
            compute(i, j - 1);
            s.pop_back();
            maze[i][j] = 1;
        }

        if (i < n - 1 && maze[i + 1][j]) {
            maze[i][j] = 0;
            s.push_back('D');
            compute(i + 1, j);
            s.pop_back();
            maze[i][j] = 1;
        }

        if (j < n - 1 && maze[i][j + 1]) {
            maze[i][j] = 0;
            s.push_back('R');
            compute(i, j + 1);
            s.pop_back();
            maze[i][j] = 1;
        }
    }

    vector<string> findPath(vector<vector<int>> &m, int n) {
        this->n = n;
        this->maze = m;
        s = "";
        this->n = n;
        if (maze[0][0]) compute(0, 0);
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
