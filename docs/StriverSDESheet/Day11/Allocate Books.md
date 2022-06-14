---
sidebar_position : 7
tags: [Array, Binary Search]
---

# Allocate Books

## Problem Link
https://www.interviewbit.com/problems/allocate-books/

## Solution Approach
Divide and Conquer and implementation.

Expected Time complexity: $O(n*log(n))$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
bool possible(vector<int> A, int B, int n, long long curr_min) {
    long long curr_sum = 0;
    int student_required = 1;

    for (int i = 0; i < n; i++) {
        if (A[i] > curr_min) return false;
        if (A[i] + curr_sum > curr_min) {
            student_required++;
            curr_sum = A[i];
            if (student_required > B) return false;
        } else
            curr_sum += A[i];
    }
    return true;
}

int Solution::books(vector<int> &A, int B) {
    int n = A.size();
    if (B > n) return -1;
    if (n == 1) return A[0];
    long long sm = 0;
    for (int i = 0; i < n; i++) {
        sm += A[i];
    }
    long long min = 0, max = sm, ans = -1;
    while (min <= max) {
        long long mid = min + (max - min) / 2;
        if (possible(A, B, n, mid)) {
            ans = mid;
            max = mid - 1;
        } else {
            min = mid + 1;
        }
    }
    return ans;
}
```
</TabItem>
</Tabs>

</details>
