---
sidebar_position : 6
---

# Count Inversions

## [Problem](https://www.codingninjas.com/codestudio/problems/count-inversions_615)

For a given integer array/list 'ARR' of size 'N' containing all distinct values, find the total number of 'Inversions' that may exist.
An inversion is defined for a pair of integers in the array/list when the following two conditions are met.

## Solution Approach

Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
#include <bits/stdc++.h>
#define ll long long

ll merge_sort(ll i, ll j, ll *arr) {
    if (i >= j) return 0;
    ll inv1 = merge_sort(i, (i + j) / 2, arr);
    ll inv2 = merge_sort((i + j) / 2 + 1, j, arr);

    vector<ll> a(j - i + 1);

    ll cnt = 0;
    int i1 = i, j1 = (i + j) / 2;
    int i2 = (i + j) / 2 + 1, j2 = j;
    int k = 0;

    while (i1 <= j1 && i2 <= j2) {
        if (arr[i1] <= arr[i2]) {
            a[k++] = arr[i1++];
        } else {
            cnt += j1 - i1 + 1;
            a[k++] = arr[i2++];
        }
    }
    while (i1 <= j1) a[k++] = arr[i1++];
    while (i2 <= j2) a[k++] = arr[i2++];
    ll tot = cnt + inv1 + inv2;
    for (int kk = 0; kk < j - i + 1; kk++) arr[i + kk] = a[kk];
    a.clear();
    return tot;
}

long long getInversions(long long *arr, int n) {
    ll aa = merge_sort(0, n - 1, arr);
    return aa;
}
```
</TabItem>
</Tabs>

</details>
