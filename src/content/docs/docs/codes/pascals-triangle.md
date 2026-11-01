---
title: "Pascal's Triangle"
description: "Given an integer numRows, return the first numRows of Pascal's triangle. In Pascal's triangle, each number is the sum of the two numbers directly above it…"
source: "https://leetcode.com/problems/pascals-triangle/"
tags: ["Array", "Dynamic Programming"]
complexity:
  time: "O(n^2)"
  space: "O(n)"
---

## Problem

<p>Given an integer <code>numRows</code>, return the first numRows of <strong>Pascal&#39;s triangle</strong>.</p>

<p>In <strong>Pascal&#39;s triangle</strong>, each number is the sum of the two numbers directly above it as shown:</p>
<img alt="" src="https://upload.wikimedia.org/wikipedia/commons/0/0d/PascalTriangleAnimated2.gif" />

## Solution approach

### Intuition

Each row of Pascal's triangle starts and ends with `1`, and every inner entry is the sum of the two entries just above it. So each row can be built directly from the previous one.

### Algorithm

1. Start with the first row `a = {1}` and add it to `ans`. If `n == 1`, return right away.
2. For each row `i` from `2` to `n`:
   - Push `1` into a fresh vector `b`.
   - For every adjacent pair in the previous row, push `a[k] + a[k + 1]`.
   - Push a closing `1`, append `b` to `ans`, then set `a = b` and clear `b`.
3. Return `ans`.

### Complexity

- **Time:** $O(n^2)$ — row `i` has `i` entries, and the rows add up to about $n^2 / 2$ entries.
- **Space:** $O(n)$ extra for the working rows `a` and `b`; the output itself holds $O(n^2)$ numbers.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<vector<int>> generate(int n) {
        vector<vector<int>> ans;
        vector<int> a, b;
        a = {1};
        ans.push_back(a);
        if (n == 1) return ans;
        for (int i = 2; i <= n; i++) {
            b.push_back(1);
            for (int k = 0; k < a.size() - 1; k++) {
                b.push_back(a[k] + a[k + 1]);
            }
            b.push_back(1);
            ans.push_back(b);
            a = b;
            b.clear();
        }
        return ans;
    }
};

```
