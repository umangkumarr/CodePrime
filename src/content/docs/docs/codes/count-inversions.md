---
title: "Count Inversions"
description: "For a given integer array/list 'ARR' of size 'N' containing all distinct values, find the total number of 'Inversions' that may exist. An inversion is…"
source: "https://www.codingninjas.com/codestudio/problems/count-inversions_615"
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

For a given integer array/list 'ARR' of size 'N' containing all distinct values, find the total number of 'Inversions' that may exist.
An inversion is defined for a pair of integers in the array/list when the following two conditions are met.

## Solution approach

### Intuition

An inversion is a pair `i < j` with `arr[i] > arr[j]`. Checking every pair is $O(n^2)$. Merge sort counts them for free: inversions are either inside the left half, inside the right half, or split across the two. The first two are counted recursively. For the split ones, both halves are already sorted, so when an element of the right half is placed before the remaining elements of the left half, it is smaller than **all** of them, and each of those forms one inversion.

### Algorithm

1. `merge_sort(i, j, arr)` returns `0` for a range of size one or less.
2. Recursively get `inv1` for the left half and `inv2` for the right half; both halves are now sorted.
3. Merge them into the buffer `a` with pointers `i1` (left) and `i2` (right). If `arr[i1] <= arr[i2]`, take the left element. Otherwise take `arr[i2]` and add `j1 - i1 + 1` (the number of left elements still waiting) to `cnt`.
4. Copy the leftovers, write `a` back into `arr[i..j]`, and return `cnt + inv1 + inv2`.
5. `getInversions` calls `merge_sort(0, n - 1, arr)`.

### Complexity

- **Time:** $O(n \log n)$ — $\log n$ levels of recursion, each doing $O(n)$ merging work.
- **Space:** $O(n)$ — the temporary buffer `a` during merging, plus $O(\log n)$ recursion stack.

### Edge cases

- **Equal elements** are not inversions: the `<=` comparison takes the left element first, so they are never counted.
- The count can reach about $n^2 / 2$, which is why the result uses `long long`.

## Code

```cpp title="C++"
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
