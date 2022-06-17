---
sidebar_position : 9
tags: [Implementation, Array]
---

# The Celebrity Problem

## Problem Link
https://www.codingninjas.com/codestudio/problems/the-celebrity-problem_982769?topList=striver-sde-sheet-problems&utm_source=striver&utm_medium=website

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
int findCelebrity(int n) {
    int c = 0;
    for (int i = 1; i < n; i++) {
        if (knows(c, i) == 1) {
            c = i;
        }
    }
    for (int i = 0; i < n; i++) {
        if (i != c and (knows(c, i) == 1 or knows(i, c) == 0)) return -1;
    }
    return c;
}
```
</TabItem>
</Tabs>

</details>
