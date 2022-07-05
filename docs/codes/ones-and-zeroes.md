---
displayed_sidebar: null
sidebar_position : 164
tags: [Array, String, Dynamic Programming]
---

# Ones and Zeroes

## [Problem](https://leetcode.com/problems/ones-and-zeroes/)

<p>You are given an array of binary strings <code>strs</code> and two integers <code>m</code> and <code>n</code>.</p>

<p>Return <em>the size of the largest subset of <code>strs</code> such that there are <strong>at most</strong> </em><code>m</code><em> </em><code>0</code><em>&#39;s and </em><code>n</code><em> </em><code>1</code><em>&#39;s in the subset</em>.</p>

<p>A set <code>x</code> is a <strong>subset</strong> of a set <code>y</code> if all elements of <code>x</code> are also elements of <code>y</code>.</p>

## Solution Approach

Expected Time complexity: $O(l*m*n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int findMaxForm(vector<string>& strs, int m, int n) {
        int siz = strs.size();

        vector<vector<int>> ans(m + 1, vector<int>(n + 1));

        for (auto i : strs) {
            int cnt1 = 0, cnt2 = 0;
            cnt1 = count(i.begin(), i.end(), '1');
            cnt2 = i.length() - cnt1;

            for (int j = m; j >= cnt2; j--) {
                for (int k = n; k >= cnt1; k--) {
                    ans[j][k] = max(ans[j][k], ans[j - cnt2][k - cnt1] + 1);
                }
            }
        }
        return ans[m][n];
    }
};

```
</TabItem>
</Tabs>

</details>
