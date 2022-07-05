---
displayed_sidebar: null
sidebar_position : 9
tags: [Implementation, Array]
---

# The Celebrity Problem

## [Problem](https://www.codingninjas.com/codestudio/problems/the-celebrity-problem_982769?topList=striver-sde-sheet-problems&utm_source=striver&utm_medium=website)

There are ‘N’ people at a party. Each person has been assigned a unique id between 0 to 'N' - 1(both inclusive). A celebrity is a person who is known to everyone but does not know anyone at the party.

Given a helper function ‘knows(A, B)’, It will returns "true" if the person having id ‘A’ know the person having id ‘B’ in the party, "false" otherwise. Your task is to find out the celebrity at the party. Print the id of the celebrity, if there is no celebrity at the party then print -1.

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
