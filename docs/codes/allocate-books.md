---
displayed_sidebar: null
sidebar_position : 7
tags: [Array, Binary Search]
---

# Allocate Books

## [Problem](https://www.interviewbit.com/problems/allocate-books/)

<p>Given an array of integers <strong>A</strong> of size <strong>N</strong> and an integer <strong>B</strong>.</p>

<p>College library has <strong>N</strong> bags,the <strong>ith</strong> book has <strong>A[i]</strong> number of pages.</p>

<p>You have to allocate books to <strong>B</strong> number of students so that maximum number of pages alloted to a student is minimum.</p>

*A book will be allocated to exactly one student.
Each student has to be allocated at least one book.
Allotment should be in contiguous order, for example: A student cannot be allocated book 1 and book 3, skipping book 2.*

<p>Calculate and return that minimum possible number.</p>


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
