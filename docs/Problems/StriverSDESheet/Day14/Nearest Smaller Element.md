---
sidebar_position : 1
tags: [Stack, Array]
---

# Nearest Smaller Element

## Problem Link
https://www.interviewbit.com/problems/nearest-smaller-element/

## Solution Approach
Use stack to find the previous smaller element.

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
vector<int> Solution::prevSmaller(vector<int> &A) {
    int n = A.size();
    stack<int> st;
    st.push(-1);
    vector<int> ans(n);
    for (int i = 0; i < n; i++) {
        while (st.top() >= A[i]) st.pop();
        ans[i] = st.top();
        st.push(A[i]);
    }
    return ans;
}
```
</TabItem>
</Tabs>

</details>
