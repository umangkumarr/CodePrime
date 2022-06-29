---
sidebar_position : 5
---

# Repeat and Missing Number Array

## Problem Link
https://www.interviewbit.com/problems/repeat-and-missing-number-array/

## Solution Code

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
