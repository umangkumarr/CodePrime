---
sidebar_position : 16
tags: [Array, Hash Table]
---

# Repeat and Missing Number Array

## [Problem](https://www.interviewbit.com/problems/repeat-and-missing-number-array/)

<div class="p-html-content__container"><p>You are given a read only array of n integers from 1 to n.</p>

<p>Each integer appears exactly once except A which appears twice and B which is missing.</p>

<p>Return A and B.</p>

<p><em>Note: Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?</em></p>

<p><em>Note that in your output A should precede B.</em></p>

<p><strong>Example:</strong></p>

<div class="highlighter-rouge"><pre class="highlight"><code>Input:[3 1 2 5 3] 

Output:[3, 4] 

A = 3, B = 4
</code></pre>
</div></div>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
vector<int> Solution::repeatedNumber(const vector<int> &A) {
    long long sm = 0, sm1 = 0, sm2 = 0, sm4 = 0;
    long long n = A.size();
    for (int i = 0; i < n; i++) {
        sm += A[i];
        sm2 += A[i] * A[i];
        sm4 += (i + 1) * (i + 1);
    }
    sm1 = (n * (n + 1ll) / 2ll);
    long long rel1 = sm1 - sm;
    long long rel2 = (sm4 - sm2) / rel1;
    if (rel1 < rel2) swap(rel1, rel2);
    long long x = (rel1 + rel2) / 2ll;
    long long y = (rel1 - rel2) / 2ll;
    vector<int> aa = {y, x};
    return aa;
}

```
</TabItem>
</Tabs>

</details>
