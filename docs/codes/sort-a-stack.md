---
displayed_sidebar: null
sidebar_position : 7
tags: [Stack]
---

# Sort a Stack

## [Problem](https://bit.ly/3xUig52)

You’re given a stack consisting of 'N' integers. Your task is to sort this stack in descending order using recursion.

## Solution Approach
Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
void insert(int temp, stack<int> &st) {
    if (st.size() == 0) {
        st.push(temp);
        return;
    }
    if (st.top() > temp) {
        int t = st.top();
        st.pop();
        insert(temp, st);
        st.push(t);
    } else {
        st.push(temp);
    }
}
void sortStack(stack<int> &st) {
    if (st.size() == 1) return;
    int temp = st.top();
    st.pop();
    sortStack(st);
    insert(temp, st);
}
```
</TabItem>
</Tabs>

</details>
