---
displayed_sidebar: null
sidebar_position : 49
tags: [Math, Recursion]
---

# Permutation Sequence

## [Problem](https://leetcode.com/problems/permutation-sequence/)

<p>The set <code>[1, 2, 3, ...,&nbsp;n]</code> contains a total of <code>n!</code> unique permutations.</p>

<p>By listing and labeling all of the permutations in order, we get the following sequence for <code>n = 3</code>:</p>

<ol>
	<li><code>&quot;123&quot;</code></li>
	<li><code>&quot;132&quot;</code></li>
	<li><code>&quot;213&quot;</code></li>
	<li><code>&quot;231&quot;</code></li>
	<li><code>&quot;312&quot;</code></li>
	<li><code>&quot;321&quot;</code></li>
</ol>

<p>Given <code>n</code> and <code>k</code>, return the <code>kth</code> permutation sequence.</p>

## Solution Approach
Math and observation. 

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    string getPermutation(int n, int k) {
        vector<int> fact(n + 1), vis(n + 1);
        fact[0] = 1, fact[1] = 1;
        for (int i = 2; i <= n; i++) fact[i] = fact[i - 1] * i;

        string s(n, ' ');
        int cnt = 1;
        while (cnt <= n) {
            int a = ceil(k / (1.0 * fact[n - cnt]));
            if (k == 0)
                a = 1;
            else
                k = abs((a - 1) * fact[n - cnt] - k);
            int t = 0, v = 1;
            while (t < a) {
                if (vis[v])
                    v++;
                else
                    t++, v++;
            }
            a = v - 1;
            s[cnt - 1] = a + '0';
            cnt++;
            vis[a] = 1;
        }

        return s;
    }
};

```
</TabItem>
</Tabs>

</details>
