---
displayed_sidebar: null
sidebar_position : 1
tags: [Math, Divide Conquer]
---

# The N-th root of an integer

## [Problem](https://www.codingninjas.com/codestudio/problems/1062679?topList=striver-sde-sheet-problems&utm_source=striver&utm_medium=website)

You are given two positive integers N and M. You have to find the Nth root of M i.e. M^(1/N)

## Solution Approach
Divide and Conquer.

Expected Time complexity: $O(logn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
#include <bits/stdc++.h>
double findNthRootOfM(int n, long long m) {
    return pow(m, (1.0 / n));
}
```
</TabItem>
</Tabs>

</details>
